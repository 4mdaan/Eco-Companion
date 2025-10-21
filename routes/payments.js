const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');

// Configuração do Stripe
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Configuração do Mercado Pago
const mercadopagoClient = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

// Rate limiting para pagamentos
const paymentLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // 5 tentativas por IP
    message: {
        success: false,
        error: 'Muitas tentativas de pagamento. Tente novamente em 15 minutos.'
    }
});

// Simulação de banco de dados de pedidos
let orders = new Map();

// Validação de dados do carrinho
const validateCartData = [
    body('items').isArray().withMessage('Items deve ser um array'),
    body('items.*.id').isString().withMessage('ID do item é obrigatório'),
    body('items.*.name').isString().withMessage('Nome do item é obrigatório'),
    body('items.*.price').isFloat({ min: 0 }).withMessage('Preço deve ser um número válido'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantidade deve ser um número inteiro positivo'),
    body('customerInfo.name').isString().isLength({ min: 2 }).withMessage('Nome é obrigatório'),
    body('customerInfo.email').isEmail().withMessage('Email inválido'),
    body('customerInfo.phone').isString().isLength({ min: 10 }).withMessage('Telefone é obrigatório'),
    body('customerInfo.document').isString().isLength({ min: 11 }).withMessage('CPF/CNPJ é obrigatório'),
];

// Função para calcular o total do pedido
function calculateOrderTotal(items) {
    return items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
}

// Função para gerar ID único do pedido
function generateOrderId() {
    return 'EC_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// GET /api/payments/methods - Listar métodos de pagamento disponíveis
router.get('/methods', (req, res) => {
    try {
        const paymentMethods = {
            success: true,
            methods: [
                {
                    id: 'credit_card',
                    name: 'Cartão de Crédito',
                    description: 'Visa, Mastercard, American Express',
                    fee: 0.0399, // 3.99%
                    installments: [1, 2, 3, 6, 12]
                },
                {
                    id: 'debit_card',
                    name: 'Cartão de Débito',
                    description: 'Débito à vista',
                    fee: 0.0299, // 2.99%
                    installments: [1]
                },
                {
                    id: 'pix',
                    name: 'PIX',
                    description: 'Pagamento instantâneo',
                    fee: 0.0099, // 0.99%
                    installments: [1],
                    discount: 0.05 // 5% desconto
                },
                {
                    id: 'boleto',
                    name: 'Boleto Bancário',
                    description: 'Vencimento em 3 dias úteis',
                    fee: 3.50, // Taxa fixa
                    installments: [1]
                }
            ]
        };

        res.json(paymentMethods);
    } catch (error) {
        console.error('Erro ao buscar métodos de pagamento:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// POST /api/payments/create-intent - Criar intenção de pagamento (Stripe)
router.post('/create-intent', paymentLimiter, validateCartData, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { items, customerInfo, paymentMethod } = req.body;
        const total = calculateOrderTotal(items);
        const orderId = generateOrderId();

        // Criar order temporária
        orders.set(orderId, {
            id: orderId,
            items,
            customerInfo,
            total,
            status: 'pending',
            paymentMethod,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutos
        });

        if (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') {
            // Criar Payment Intent do Stripe
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(total * 100), // Convertir para centavos
                currency: 'brl',
                automatic_payment_methods: {
                    enabled: true,
                },
                metadata: {
                    orderId,
                    customerEmail: customerInfo.email,
                    customerName: customerInfo.name,
                }
            });

            res.json({
                success: true,
                orderId,
                clientSecret: paymentIntent.client_secret,
                total,
                paymentMethod
            });

        } else if (paymentMethod === 'pix') {
            // Criar preferência PIX no Mercado Pago
            const preference = new Preference(mercadopagoClient);

            const pixPreference = await preference.create({
                body: {
                    items: items.map(item => ({
                        id: item.id,
                        title: item.name,
                        quantity: item.quantity,
                        unit_price: item.price
                    })),
                    payer: {
                        name: customerInfo.name,
                        email: customerInfo.email,
                        identification: {
                            type: 'CPF',
                            number: customerInfo.document
                        }
                    },
                    payment_methods: {
                        excluded_payment_types: [
                            { id: 'credit_card' },
                            { id: 'debit_card' },
                            { id: 'ticket' }
                        ]
                    },
                    external_reference: orderId,
                    notification_url: `${process.env.WEBHOOK_URL}/mercadopago`,
                    back_urls: {
                        success: `${process.env.FRONTEND_URL}/pagamento/sucesso`,
                        failure: `${process.env.FRONTEND_URL}/pagamento/erro`,
                        pending: `${process.env.FRONTEND_URL}/pagamento/pendente`
                    }
                }
            });

            res.json({
                success: true,
                orderId,
                preferenceId: pixPreference.id,
                initPoint: pixPreference.init_point,
                total,
                paymentMethod
            });

        } else if (paymentMethod === 'boleto') {
            // Criar boleto no Mercado Pago
            const preference = new Preference(mercadopagoClient);

            const boletoPreference = await preference.create({
                body: {
                    items: items.map(item => ({
                        id: item.id,
                        title: item.name,
                        quantity: item.quantity,
                        unit_price: item.price
                    })),
                    payer: {
                        name: customerInfo.name,
                        email: customerInfo.email,
                        identification: {
                            type: 'CPF',
                            number: customerInfo.document
                        }
                    },
                    payment_methods: {
                        excluded_payment_types: [
                            { id: 'credit_card' },
                            { id: 'debit_card' },
                            { id: 'account_money' }
                        ]
                    },
                    external_reference: orderId,
                    notification_url: `${process.env.WEBHOOK_URL}/mercadopago`,
                    back_urls: {
                        success: `${process.env.FRONTEND_URL}/pagamento/sucesso`,
                        failure: `${process.env.FRONTEND_URL}/pagamento/erro`,
                        pending: `${process.env.FRONTEND_URL}/pagamento/pendente`
                    }
                }
            });

            res.json({
                success: true,
                orderId,
                preferenceId: boletoPreference.id,
                initPoint: boletoPreference.init_point,
                total,
                paymentMethod
            });
        }

    } catch (error) {
        console.error('Erro ao criar intenção de pagamento:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao processar pagamento'
        });
    }
});

// POST /api/payments/confirm - Confirmar pagamento
router.post('/confirm', async (req, res) => {
    try {
        const { orderId, paymentIntentId } = req.body;

        if (!orders.has(orderId)) {
            return res.status(404).json({
                success: false,
                error: 'Pedido não encontrado'
            });
        }

        const order = orders.get(orderId);

        // Verificar se o pedido não expirou
        if (new Date() > order.expiresAt) {
            orders.delete(orderId);
            return res.status(400).json({
                success: false,
                error: 'Pedido expirado'
            });
        }

        if (paymentIntentId) {
            // Verificar status no Stripe
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

            if (paymentIntent.status === 'succeeded') {
                order.status = 'paid';
                order.paymentId = paymentIntentId;
                order.paidAt = new Date();
                orders.set(orderId, order);

                res.json({
                    success: true,
                    message: 'Pagamento confirmado com sucesso',
                    order
                });
            } else {
                res.status(400).json({
                    success: false,
                    error: 'Pagamento não foi processado'
                });
            }
        } else {
            // Para PIX e Boleto, aguardar webhook
            res.json({
                success: true,
                message: 'Aguardando confirmação do pagamento',
                order
            });
        }

    } catch (error) {
        console.error('Erro ao confirmar pagamento:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao confirmar pagamento'
        });
    }
});

// GET /api/payments/order/:orderId - Consultar status do pedido
router.get('/order/:orderId', (req, res) => {
    try {
        const { orderId } = req.params;

        if (!orders.has(orderId)) {
            return res.status(404).json({
                success: false,
                error: 'Pedido não encontrado'
            });
        }

        const order = orders.get(orderId);

        res.json({
            success: true,
            order: {
                id: order.id,
                status: order.status,
                total: order.total,
                paymentMethod: order.paymentMethod,
                createdAt: order.createdAt,
                paidAt: order.paidAt || null
            }
        });

    } catch (error) {
        console.error('Erro ao consultar pedido:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao consultar pedido'
        });
    }
});

// POST /api/payments/webhook/stripe - Webhook do Stripe
router.post('/webhook/stripe', express.raw({type: 'application/json'}), (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.log(`Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            const orderId = paymentIntent.metadata.orderId;
            
            if (orders.has(orderId)) {
                const order = orders.get(orderId);
                order.status = 'paid';
                order.paymentId = paymentIntent.id;
                order.paidAt = new Date();
                orders.set(orderId, order);
                console.log(`Pagamento confirmado para pedido ${orderId}`);
            }
            break;

        case 'payment_intent.payment_failed':
            const failedPayment = event.data.object;
            const failedOrderId = failedPayment.metadata.orderId;
            
            if (orders.has(failedOrderId)) {
                const order = orders.get(failedOrderId);
                order.status = 'failed';
                orders.set(failedOrderId, order);
                console.log(`Pagamento falhou para pedido ${failedOrderId}`);
            }
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({received: true});
});

// POST /api/payments/webhook/mercadopago - Webhook do Mercado Pago
router.post('/webhook/mercadopago', (req, res) => {
    try {
        const { type, data } = req.body;

        if (type === 'payment') {
            // Processar notificação de pagamento
            const paymentId = data.id;
            
            // Aqui você consultaria o pagamento no Mercado Pago
            // e atualizaria o status do pedido
            console.log(`Notificação de pagamento recebida: ${paymentId}`);
        }

        res.status(200).send('OK');
    } catch (error) {
        console.error('Erro no webhook do Mercado Pago:', error);
        res.status(500).send('Error');
    }
});

module.exports = router;
// Sistema de Pagamentos - Frontend
class PaymentSystem {
    constructor() {
        this.stripe = null;
        this.elements = null;
        this.cardElement = null;
        this.currentOrder = null;
        this.init();
    }

    async init() {
        // Inicializar Stripe
        if (window.Stripe) {
            this.stripe = Stripe(window.STRIPE_PUBLIC_KEY);
            this.elements = this.stripe.elements();
            this.setupStripeElements();
        }

        this.setupEventListeners();
        this.loadPaymentMethods();
    }

    setupStripeElements() {
        // Configurar elemento do cartão
        const style = {
            base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            },
            invalid: {
                color: '#9e2146',
            },
        };

        this.cardElement = this.elements.create('card', { style });
    }

    setupEventListeners() {
        // Botão de checkout
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.startCheckout());
        }

        // Seleção de método de pagamento
        const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
        paymentMethods.forEach(method => {
            method.addEventListener('change', (e) => this.handlePaymentMethodChange(e.target.value));
        });

        // Formulário de pagamento
        const paymentForm = document.getElementById('payment-form');
        if (paymentForm) {
            paymentForm.addEventListener('submit', (e) => this.handlePaymentSubmit(e));
        }

        // Calcular parcelas
        const installmentsSelect = document.getElementById('installments');
        if (installmentsSelect) {
            installmentsSelect.addEventListener('change', () => this.calculateInstallments());
        }
    }

    async loadPaymentMethods() {
        try {
            const response = await fetch('/api/payments/methods');
            const data = await response.json();

            if (data.success) {
                this.renderPaymentMethods(data.methods);
            }
        } catch (error) {
            console.error('Erro ao carregar métodos de pagamento:', error);
        }
    }

    renderPaymentMethods(methods) {
        const container = document.getElementById('payment-methods');
        if (!container) return;

        container.innerHTML = '';

        methods.forEach(method => {
            const methodDiv = document.createElement('div');
            methodDiv.className = 'payment-method-option';
            
            const discount = method.discount ? `<span class="discount">-${(method.discount * 100).toFixed(0)}%</span>` : '';
            const fee = method.fee < 1 ? `${(method.fee * 100).toFixed(2)}%` : `R$ ${method.fee.toFixed(2)}`;
            
            methodDiv.innerHTML = `
                <label class="payment-method-label">
                    <input type="radio" name="payment-method" value="${method.id}" />
                    <div class="payment-method-info">
                        <h4>${method.name} ${discount}</h4>
                        <p>${method.description}</p>
                        <small>Taxa: ${fee}</small>
                    </div>
                </label>
            `;

            container.appendChild(methodDiv);
        });
    }

    handlePaymentMethodChange(method) {
        const cardContainer = document.getElementById('card-container');
        const pixContainer = document.getElementById('pix-container');
        const boletoContainer = document.getElementById('boleto-container');
        const installmentsContainer = document.getElementById('installments-container');

        // Ocultar todos os containers
        [cardContainer, pixContainer, boletoContainer, installmentsContainer].forEach(container => {
            if (container) container.style.display = 'none';
        });

        // Mostrar container específico
        switch (method) {
            case 'credit_card':
            case 'debit_card':
                if (cardContainer) {
                    cardContainer.style.display = 'block';
                    if (!this.cardElement._mounted) {
                        this.cardElement.mount('#card-element');
                    }
                }
                if (method === 'credit_card' && installmentsContainer) {
                    installmentsContainer.style.display = 'block';
                    this.loadInstallmentOptions();
                }
                break;
            case 'pix':
                if (pixContainer) pixContainer.style.display = 'block';
                break;
            case 'boleto':
                if (boletoContainer) boletoContainer.style.display = 'block';
                break;
        }

        this.calculateTotal();
    }

    loadInstallmentOptions() {
        const installmentsSelect = document.getElementById('installments');
        if (!installmentsSelect) return;

        const total = this.getCartTotal();
        const installmentOptions = [1, 2, 3, 6, 12];

        installmentsSelect.innerHTML = '';

        installmentOptions.forEach(installments => {
            const value = total / installments;
            const option = document.createElement('option');
            option.value = installments;
            option.textContent = `${installments}x de R$ ${value.toFixed(2)}${installments > 1 ? ' (com juros)' : ' (à vista)'}`;
            installmentsSelect.appendChild(option);
        });
    }

    async startCheckout() {
        try {
            this.showLoading('Iniciando checkout...');

            const cartData = this.getCartData();
            const customerInfo = this.getCustomerInfo();

            if (!this.validateCheckoutData(cartData, customerInfo)) {
                this.hideLoading();
                return;
            }

            // Mostrar modal de pagamento
            this.showPaymentModal();

        } catch (error) {
            console.error('Erro no checkout:', error);
            this.showError('Erro ao iniciar checkout');
        } finally {
            this.hideLoading();
        }
    }

    async handlePaymentSubmit(event) {
        event.preventDefault();

        const paymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value;
        if (!paymentMethod) {
            this.showError('Selecione um método de pagamento');
            return;
        }

        this.showLoading('Processando pagamento...');

        try {
            const cartData = this.getCartData();
            const customerInfo = this.getCustomerInfo();

            // Criar intenção de pagamento
            const response = await fetch('/api/payments/create-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: cartData.items,
                    customerInfo,
                    paymentMethod
                })
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Erro ao criar pagamento');
            }

            this.currentOrder = data;

            // Processar baseado no método de pagamento
            switch (paymentMethod) {
                case 'credit_card':
                case 'debit_card':
                    await this.processCardPayment(data);
                    break;
                case 'pix':
                    await this.processPixPayment(data);
                    break;
                case 'boleto':
                    await this.processBoletoPayment(data);
                    break;
            }

        } catch (error) {
            console.error('Erro no pagamento:', error);
            this.showError(error.message);
        } finally {
            this.hideLoading();
        }
    }

    async processCardPayment(paymentData) {
        try {
            const { error, paymentIntent } = await this.stripe.confirmCardPayment(
                paymentData.clientSecret,
                {
                    payment_method: {
                        card: this.cardElement,
                        billing_details: {
                            name: document.getElementById('customer-name')?.value,
                            email: document.getElementById('customer-email')?.value,
                        },
                    }
                }
            );

            if (error) {
                throw new Error(error.message);
            }

            if (paymentIntent.status === 'succeeded') {
                await this.confirmPayment(paymentData.orderId, paymentIntent.id);
                this.showSuccess('Pagamento realizado com sucesso!');
                setTimeout(() => {
                    window.location.href = '/carrinho/sucesso';
                }, 2000);
            }

        } catch (error) {
            throw error;
        }
    }

    async processPixPayment(paymentData) {
        try {
            // Redirecionar para o Mercado Pago
            window.open(paymentData.initPoint, '_blank');
            
            // Mostrar instruções PIX
            this.showPixInstructions(paymentData.orderId);
            
        } catch (error) {
            throw error;
        }
    }

    async processBoletoPayment(paymentData) {
        try {
            // Redirecionar para o Mercado Pago
            window.open(paymentData.initPoint, '_blank');
            
            // Mostrar instruções do boleto
            this.showBoletoInstructions(paymentData.orderId);
            
        } catch (error) {
            throw error;
        }
    }

    async confirmPayment(orderId, paymentIntentId) {
        const response = await fetch('/api/payments/confirm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                orderId,
                paymentIntentId
            })
        });

        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error);
        }

        return data;
    }

    showPixInstructions(orderId) {
        const modal = document.createElement('div');
        modal.className = 'payment-modal pix-instructions';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Pagamento PIX</h3>
                <p>Seu pedido foi criado! Complete o pagamento na janela que foi aberta.</p>
                <p><strong>Pedido:</strong> ${orderId}</p>
                <div class="pix-status" id="pix-status">
                    <div class="status-indicator pending"></div>
                    <span>Aguardando pagamento...</span>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="btn-secondary">
                    Fechar
                </button>
            </div>
        `;
        document.body.appendChild(modal);

        // Verificar status do pagamento
        this.checkPaymentStatus(orderId);
    }

    showBoletoInstructions(orderId) {
        const modal = document.createElement('div');
        modal.className = 'payment-modal boleto-instructions';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Boleto Bancário</h3>
                <p>Seu boleto foi gerado! Complete o pagamento na janela que foi aberta.</p>
                <p><strong>Pedido:</strong> ${orderId}</p>
                <p><strong>Vencimento:</strong> 3 dias úteis</p>
                <div class="boleto-status" id="boleto-status">
                    <div class="status-indicator pending"></div>
                    <span>Aguardando pagamento...</span>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="btn-secondary">
                    Fechar
                </button>
            </div>
        `;
        document.body.appendChild(modal);

        // Verificar status do pagamento
        this.checkPaymentStatus(orderId);
    }

    async checkPaymentStatus(orderId) {
        const checkStatus = async () => {
            try {
                const response = await fetch(`/api/payments/order/${orderId}`);
                const data = await response.json();

                if (data.success && data.order.status === 'paid') {
                    this.showSuccess('Pagamento confirmado!');
                    setTimeout(() => {
                        window.location.href = '/carrinho/sucesso';
                    }, 2000);
                    return;
                }

                // Verificar novamente em 5 segundos
                setTimeout(checkStatus, 5000);
            } catch (error) {
                console.error('Erro ao verificar status:', error);
            }
        };

        checkStatus();
    }

    calculateTotal() {
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value;
        const baseTotal = this.getCartTotal();
        let total = baseTotal;
        let fee = 0;
        let discount = 0;

        // Aplicar taxas e descontos baseado no método
        switch (paymentMethod) {
            case 'credit_card':
                fee = baseTotal * 0.0399;
                break;
            case 'debit_card':
                fee = baseTotal * 0.0299;
                break;
            case 'pix':
                fee = baseTotal * 0.0099;
                discount = baseTotal * 0.05;
                break;
            case 'boleto':
                fee = 3.50;
                break;
        }

        total = baseTotal + fee - discount;

        // Atualizar display
        this.updateTotalDisplay(baseTotal, fee, discount, total);
    }

    calculateInstallments() {
        const installments = parseInt(document.getElementById('installments')?.value || 1);
        const total = this.getCartTotal();
        
        // Aplicar juros para parcelamento
        let finalTotal = total;
        if (installments > 1) {
            const interestRate = 0.0299; // 2.99% ao mês
            finalTotal = total * Math.pow(1 + interestRate, installments - 1);
        }

        const installmentValue = finalTotal / installments;
        
        // Atualizar display das parcelas
        const installmentDisplay = document.getElementById('installment-display');
        if (installmentDisplay) {
            installmentDisplay.textContent = `${installments}x de R$ ${installmentValue.toFixed(2)}`;
        }
    }

    updateTotalDisplay(baseTotal, fee, discount, finalTotal) {
        const totalContainer = document.getElementById('payment-total');
        if (!totalContainer) return;

        totalContainer.innerHTML = `
            <div class="total-breakdown">
                <div class="total-line">
                    <span>Subtotal:</span>
                    <span>R$ ${baseTotal.toFixed(2)}</span>
                </div>
                ${fee > 0 ? `
                <div class="total-line fee">
                    <span>Taxa:</span>
                    <span>R$ ${fee.toFixed(2)}</span>
                </div>
                ` : ''}
                ${discount > 0 ? `
                <div class="total-line discount">
                    <span>Desconto:</span>
                    <span>-R$ ${discount.toFixed(2)}</span>
                </div>
                ` : ''}
                <div class="total-line final">
                    <span><strong>Total:</strong></span>
                    <span><strong>R$ ${finalTotal.toFixed(2)}</strong></span>
                </div>
            </div>
        `;
    }

    getCartData() {
        // Obter dados do carrinho do localStorage
        const cart = JSON.parse(localStorage.getItem('carrinho') || '[]');
        return {
            items: cart.map(item => ({
                id: item.id,
                name: item.nome,
                price: parseFloat(item.preco.replace('R$ ', '').replace('.', '').replace(',', '.')),
                quantity: item.quantidade
            }))
        };
    }

    getCustomerInfo() {
        return {
            name: document.getElementById('customer-name')?.value,
            email: document.getElementById('customer-email')?.value,
            phone: document.getElementById('customer-phone')?.value,
            document: document.getElementById('customer-document')?.value,
        };
    }

    getCartTotal() {
        const cartData = this.getCartData();
        return cartData.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    validateCheckoutData(cartData, customerInfo) {
        if (!cartData.items.length) {
            this.showError('Carrinho vazio');
            return false;
        }

        if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.document) {
            this.showError('Preencha todos os dados do cliente');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customerInfo.email)) {
            this.showError('Email inválido');
            return false;
        }

        return true;
    }

    showPaymentModal() {
        const modal = document.getElementById('payment-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    hidePaymentModal() {
        const modal = document.getElementById('payment-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    showLoading(message) {
        const loader = document.getElementById('payment-loader');
        const loaderText = document.getElementById('loader-text');
        
        if (loader) {
            loader.style.display = 'flex';
            if (loaderText) loaderText.textContent = message;
        }
    }

    hideLoading() {
        const loader = document.getElementById('payment-loader');
        if (loader) {
            loader.style.display = 'none';
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'payment-error';
        errorDiv.innerHTML = `
            <div class="error-content">
                <span class="error-icon">⚠️</span>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="error-close">×</button>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'payment-success';
        successDiv.innerHTML = `
            <div class="success-content">
                <span class="success-icon">✅</span>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }
}

// Inicializar sistema de pagamentos quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.paymentSystem = new PaymentSystem();
});

// Utilitários para formatação
class PaymentUtils {
    static formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    static formatDocument(value) {
        // Remove caracteres não numéricos
        value = value.replace(/\D/g, '');
        
        if (value.length <= 11) {
            // CPF
            return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else {
            // CNPJ
            return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        }
    }

    static formatPhone(value) {
        value = value.replace(/\D/g, '');
        
        if (value.length === 11) {
            return value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (value.length === 10) {
            return value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        
        return value;
    }

    static validateCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
        
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        
        let remainder = 11 - (sum % 11);
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(9))) return false;
        
        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        
        remainder = 11 - (sum % 11);
        if (remainder === 10 || remainder === 11) remainder = 0;
        
        return remainder === parseInt(cpf.charAt(10));
    }
}

// Fazer utilitários disponíveis globalmente
window.PaymentUtils = PaymentUtils;
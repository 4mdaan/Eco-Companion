const { body, param, query, validationResult } = require('express-validator');

/**
 * ============================================================
 * ARQUIVO DE VALIDAÇÕES - Educativo para Curso Técnico
 * ============================================================
 * 
 * Este arquivo centraliza TODAS as validações do projeto.
 * Cada validação segue o padrão express-validator com:
 * - Sanitização de dados
 * - Validação de tipo
 * - Validação de tamanho
 * - Validação de formato
 * - Mensagens de erro claras
 * 
 * Ideal para corrigir e estudar em aula ✓
 */

// Middleware para validar erros
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// ========== VALIDAÇÕES DE AUTENTICAÇÃO ==========

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('senha')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter no mínimo 6 caracteres'),
  handleValidationErrors
];

const validateRegistro = [
  body('nome')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Nome deve ter no mínimo 3 caracteres'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('telefone')
    .matches(/^(\d{10}|\d{11})$/)
    .withMessage('Telefone deve ter 10 ou 11 dígitos'),
  body('senha')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Senha deve ter: maiúscula, minúscula, número e símbolo'),
  body('confirmaSenha')
    .custom((value, { req }) => value === req.body.senha)
    .withMessage('Senhas não conferem'),
  handleValidationErrors
];

const validateEsqueceuSenha = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  handleValidationErrors
];

// ========== VALIDAÇÕES DE CARRINHO ==========

const validateAdicionarAoCarrinho = [
  body('pacoteId')
    .trim()
    .notEmpty().withMessage('ID do pacote é obrigatório')
    .isInt({ min: 1 }).withMessage('ID do pacote deve ser um número válido'),
  body('quantidade')
    .trim()
    .notEmpty().withMessage('Quantidade é obrigatória')
    .isInt({ min: 1, max: 10 }).withMessage('Quantidade deve estar entre 1 e 10'),
  body('slug')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Slug inválido'),
  handleValidationErrors
];

const validateAtualizarCarrinho = [
  body('pacoteId')
    .trim()
    .notEmpty().withMessage('ID do pacote é obrigatório')
    .isInt({ min: 1 }).withMessage('ID do pacote deve ser um número válido'),
  body('quantidade')
    .trim()
    .notEmpty().withMessage('Quantidade é obrigatória')
    .isInt({ min: 1, max: 10 }).withMessage('Quantidade deve estar entre 1 e 10'),
  handleValidationErrors
];

const validateRemoverCarrinho = [
  param('pacoteId')
    .trim()
    .notEmpty().withMessage('ID do pacote é obrigatório')
    .isInt({ min: 1 }).withMessage('ID do pacote deve ser um número válido'),
  handleValidationErrors
];

const validateAplicarCupom = [
  body('cupom')
    .trim()
    .notEmpty().withMessage('Cupom é obrigatório')
    .isLength({ min: 3, max: 20 }).withMessage('Cupom deve ter entre 3 e 20 caracteres')
    .matches(/^[A-Z0-9]+$/).withMessage('Cupom deve conter apenas letras maiúsculas e números'),
  handleValidationErrors
];

// ========== VALIDAÇÕES DE CONTATO ==========

const validateContato = [
  body('nome')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Nome deve ter no mínimo 3 caracteres'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('telefone')
    .matches(/^(\d{10}|\d{11})$/)
    .withMessage('Telefone deve ter 10 ou 11 dígitos'),
  body('servico')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Serviço é obrigatório'),
  body('mensagem')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Mensagem deve ter entre 10 e 1000 caracteres'),
  body('newsletter')
    .optional()
    .isBoolean()
    .withMessage('Newsletter deve ser verdadeiro ou falso'),
  handleValidationErrors
];

// ========== VALIDAÇÕES DE CASHBACK ==========

const validateResgateCashback = [
  body('pontos')
    .trim()
    .notEmpty().withMessage('Pontos é obrigatório')
    .isInt({ min: 100, max: 999999 }).withMessage('Mínimo 100 pontos para resgate'),
  body('tipoPagamento')
    .trim()
    .notEmpty().withMessage('Tipo de pagamento é obrigatório')
    .isIn(['cartao', 'transferencia', 'voucher']).withMessage('Tipo de pagamento inválido'),
  body('descricao')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Descrição muito longa'),
  handleValidationErrors
];

const validateHistoricoCashback = [
  query('filtro')
    .optional()
    .isIn(['todos', 'compras', 'resgates', 'pendentes']).withMessage('Filtro inválido'),
  query('limite')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limite deve estar entre 1 e 100'),
  handleValidationErrors
];

// ========== VALIDAÇÕES DE PACOTES ==========

const validateFiltrosPacotes = [
  query('categoria')
    .optional()
    .isIn(['nacional', 'internacional', 'luxo', 'adventure'])
    .withMessage('Categoria inválida'),
  query('precoMin')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Preço mínimo deve ser positivo'),
  query('precoMax')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Preço máximo deve ser positivo'),
  query('avaliacao')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Avaliação deve estar entre 0 e 5'),
  handleValidationErrors
];

const validateDetalhePacote = [
  param('slug')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Slug inválido'),
  handleValidationErrors
];

// ========== VALIDAÇÕES DE DESTINOS ==========

const validateCompraDestino = [
  body('destinoId')
    .trim()
    .notEmpty().withMessage('ID do destino é obrigatório')
    .isInt({ min: 1 }).withMessage('ID do destino deve ser um número válido'),
  body('dataPartida')
    .trim()
    .notEmpty().withMessage('Data de partida é obrigatória')
    .isISO8601().withMessage('Data de partida deve estar em formato válido')
    .custom(value => {
      const data = new Date(value);
      const agora = new Date();
      if (data < agora) {
        throw new Error('Data de partida não pode estar no passado');
      }
      return true;
    }),
  body('dataRetorno')
    .trim()
    .notEmpty().withMessage('Data de retorno é obrigatória')
    .isISO8601().withMessage('Data de retorno deve estar em formato válido')
    .custom((value, { req }) => {
      const dataPartida = new Date(req.body.dataPartida);
      const dataRetorno = new Date(value);
      
      if (dataRetorno <= dataPartida) {
        throw new Error('Data de retorno deve ser após a data de partida');
      }
      
      // Máximo de 30 dias
      const diffMs = dataRetorno - dataPartida;
      const diffDias = diffMs / (1000 * 60 * 60 * 24);
      
      if (diffDias > 30) {
        throw new Error('Período máximo de 30 dias');
      }
      
      return true;
    }),
  body('hospedes')
    .trim()
    .notEmpty().withMessage('Quantidade de hóspedes é obrigatória')
    .isInt({ min: 1, max: 20 }).withMessage('Hóspedes deve estar entre 1 e 20'),
  body('acomodacao')
    .optional()
    .trim()
    .isIn(['simples', 'confortavel', 'luxo']).withMessage('Acomodação inválida'),
  handleValidationErrors
];

const validateDetalhesDestino = [
  param('destinoId')
    .trim()
    .notEmpty().withMessage('ID do destino é obrigatório')
    .isInt({ min: 1 }).withMessage('ID do destino deve ser um número válido'),
  handleValidationErrors
];

// ========== VALIDAÇÕES DE ADMIN ==========

const validateCriarPacote = [
  body('destino')
    .trim()
    .notEmpty().withMessage('Destino é obrigatório')
    .isLength({ min: 3, max: 100 }).withMessage('Destino deve ter entre 3 e 100 caracteres'),
  body('preco')
    .trim()
    .notEmpty().withMessage('Preço é obrigatório')
    .isFloat({ min: 0.01, max: 999999.99 }).withMessage('Preço deve estar entre 0.01 e 999999.99'),
  body('precoOriginal')
    .trim()
    .notEmpty().withMessage('Preço original é obrigatório')
    .isFloat({ min: 0.01, max: 999999.99 }).withMessage('Preço original deve estar entre 0.01 e 999999.99')
    .custom((value, { req }) => {
      const preco = parseFloat(req.body.preco);
      const precoOriginal = parseFloat(value);
      if (precoOriginal < preco) {
        throw new Error('Preço original deve ser maior ou igual ao preço');
      }
      return true;
    }),
  body('descricao')
    .trim()
    .notEmpty().withMessage('Descrição é obrigatória')
    .isLength({ min: 10, max: 1000 }).withMessage('Descrição deve ter entre 10 e 1000 caracteres'),
  body('periodo')
    .trim()
    .notEmpty().withMessage('Período é obrigatório')
    .isLength({ min: 5, max: 100 }).withMessage('Período inválido'),
  body('categoria')
    .optional()
    .trim()
    .isIn(['nacional', 'internacional', 'luxo', 'adventure']).withMessage('Categoria inválida'),
  handleValidationErrors
];

const validateAtualizarPacote = [
  param('id')
    .trim()
    .notEmpty().withMessage('ID é obrigatório')
    .isInt({ min: 1 }).withMessage('ID deve ser um número válido'),
  body('destino')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('Destino deve ter entre 3 e 100 caracteres'),
  body('preco')
    .optional()
    .trim()
    .isFloat({ min: 0.01, max: 999999.99 }).withMessage('Preço inválido'),
  body('precoOriginal')
    .optional()
    .trim()
    .isFloat({ min: 0.01, max: 999999.99 }).withMessage('Preço original inválido'),
  body('descricao')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 }).withMessage('Descrição deve ter entre 10 e 1000 caracteres'),
  handleValidationErrors
];

const validateDeletarPacote = [
  param('id')
    .trim()
    .notEmpty().withMessage('ID é obrigatório')
    .isInt({ min: 1 }).withMessage('ID deve ser um número válido'),
  handleValidationErrors
];

const validateDeletarPacote = [
  param('id')
    .trim()
    .notEmpty().withMessage('ID é obrigatório')
    .isInt({ min: 1 }).withMessage('ID deve ser um número válido'),
  handleValidationErrors
];

// ========== VALIDAÇÕES DE PAGAMENTOS ==========

const validateIniciaPagamento = [
  body('items')
    .isArray({ min: 1 }).withMessage('Items deve ser um array com pelo menos 1 item'),
  body('items.*.id')
    .trim()
    .notEmpty().withMessage('ID do item é obrigatório')
    .isInt({ min: 1 }).withMessage('ID do item deve ser um número válido'),
  body('items.*.name')
    .trim()
    .notEmpty().withMessage('Nome do item é obrigatório')
    .isLength({ min: 3, max: 200 }).withMessage('Nome do item deve ter entre 3 e 200 caracteres'),
  body('items.*.price')
    .trim()
    .notEmpty().withMessage('Preço é obrigatório')
    .isFloat({ min: 0.01 }).withMessage('Preço deve ser maior que zero'),
  body('items.*.quantity')
    .trim()
    .notEmpty().withMessage('Quantidade é obrigatória')
    .isInt({ min: 1, max: 10 }).withMessage('Quantidade deve estar entre 1 e 10'),
  body('customerInfo.name')
    .trim()
    .notEmpty().withMessage('Nome do cliente é obrigatório')
    .isLength({ min: 3, max: 100 }).withMessage('Nome deve ter entre 3 e 100 caracteres'),
  body('customerInfo.email')
    .trim()
    .notEmpty().withMessage('Email é obrigatório')
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),
  body('customerInfo.phone')
    .trim()
    .notEmpty().withMessage('Telefone é obrigatório')
    .matches(/^(\d{10}|\d{11})$/).withMessage('Telefone deve ter 10 ou 11 dígitos'),
  body('customerInfo.document')
    .trim()
    .notEmpty().withMessage('CPF/CNPJ é obrigatório')
    .matches(/^(\d{11}|\d{14})$/).withMessage('CPF/CNPJ inválido'),
  body('paymentMethod')
    .trim()
    .notEmpty().withMessage('Método de pagamento é obrigatório')
    .isIn(['credito', 'debito', 'pix', 'boleto']).withMessage('Método de pagamento inválido'),
  handleValidationErrors
];

const validateConfirmaPagamento = [
  body('orderId')
    .trim()
    .notEmpty().withMessage('ID do pedido é obrigatório')
    .isLength({ min: 5, max: 50 }).withMessage('ID do pedido inválido'),
  body('paymentIntentId')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 }).withMessage('ID de intenção de pagamento inválido'),
  handleValidationErrors
];

module.exports = {
  // Auth
  validateLogin,
  validateRegistro,
  validateEsqueceuSenha,
  
  // Carrinho
  validateAdicionarAoCarrinho,
  validateAtualizarCarrinho,
  validateRemoverCarrinho,
  validateAplicarCupom,
  
  // Contato
  validateContato,
  
  // Cashback
  validateResgateCashback,
  validateHistoricoCashback,
  
  // Pacotes
  validateFiltrosPacotes,
  validateDetalhePacote,
  
  // Destinos
  validateCompraDestino,
  validateDetalhesDestino,
  
  // Admin
  validateCriarPacote,
  validateAtualizarPacote,
  validateDeletarPacote,
  
  // Pagamentos
  validateIniciaPagamento,
  validateConfirmaPagamento,
  
  // Utils
  handleValidationErrors
};

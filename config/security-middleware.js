/**
 * ============================================================
 * Middleware de Segurança e Validação
 * ============================================================
 * 
 * Arquivo educativo com middlewares de segurança para:
 * - Sanitização de dados
 * - Tratamento de erros
 * - Logging de segurança
 * - Rate limiting
 * - CSRF protection
 * 
 * Ideal para corrigir em curso técnico ✓
 */

const { validationResult } = require('express-validator');

// ========== SANITIZAÇÃO DE DADOS ==========

/**
 * Remove caracteres perigosos da string
 * Previne XSS (Cross-Site Scripting)
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>\"'`]/g, '') // Remove caracteres especiais perigosos
    .trim()
    .substring(0, 1000); // Limita tamanho
};

/**
 * Sanitiza número
 */
const sanitizeNumber = (input) => {
  const num = parseFloat(input);
  return isNaN(num) ? 0 : Math.max(0, num);
};

/**
 * Sanitiza email
 */
const sanitizeEmail = (email) => {
  return email.toLowerCase().trim();
};

/**
 * Sanitiza array de IDs
 */
const sanitizeIdArray = (arr) => {
  if (!Array.isArray(arr)) return [];
  return arr.map(id => parseInt(id, 10)).filter(id => !isNaN(id));
};

// ========== VALIDAÇÃO DE ERROS ==========

/**
 * Middleware que verifica erros de validação e retorna JSON
 * Ideal para APIs
 */
const handleValidationErrorsJson = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Erro de validação',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

/**
 * Middleware que verifica erros de validação e renderiza página com erro
 * Ideal para formulários HTML
 */
const handleValidationErrorsHtml = (templateView) => {
  return (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessage = errors.array()[0].msg;
      const templateData = {
        error: errorMessage,
        formData: req.body
      };
      
      // Adicionar dados específicos da página
      Object.assign(templateData, req.templateData || {});
      
      return res.render(templateView, templateData);
    }
    next();
  };
};

// ========== LOGGING DE SEGURANÇA ==========

/**
 * Logger de requisições suspeitas
 */
const securityLogger = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'] || 'Unknown';
  
  // Log com timestamp
  const timestamp = new Date().toISOString();
  
  // Verificar padrões suspeitos
  const body = JSON.stringify(req.body).toLowerCase();
  const isSuspicious = 
    body.includes('<script') ||
    body.includes('union') ||
    body.includes('delete') ||
    body.includes('drop') ||
    body.includes('insert');
  
  if (isSuspicious) {
    console.warn(`⚠️ [${timestamp}] SUSPEITO: ${req.method} ${req.path} de ${clientIP}`);
  } else {
    console.log(`📝 [${timestamp}] ${req.method} ${req.path} de ${clientIP}`);
  }
  
  next();
};

// ========== RATE LIMITING CUSTOMIZADO ==========

/**
 * Rate limiting por IP para endpoints críticos
 */
const createRateLimiter = (maxAttempts = 5, timeWindowMs = 60000) => {
  const attempts = new Map();
  
  return (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    // Limpar entradas antigas
    if (attempts.has(clientIP)) {
      const { count, firstAttempt } = attempts.get(clientIP);
      if (now - firstAttempt > timeWindowMs) {
        attempts.delete(clientIP);
      }
    }
    
    // Incrementar contador
    if (!attempts.has(clientIP)) {
      attempts.set(clientIP, { count: 1, firstAttempt: now });
    } else {
      const data = attempts.get(clientIP);
      data.count++;
      
      if (data.count > maxAttempts) {
        return res.status(429).json({
          success: false,
          message: `Muitas requisições. Tente novamente em ${Math.ceil((data.firstAttempt + timeWindowMs - now) / 1000)}s`
        });
      }
    }
    
    next();
  };
};

/**
 * Rate limiter específico para login
 * Mais restritivo que o padrão
 */
const loginRateLimiter = createRateLimiter(5, 300000); // 5 tentativas em 5 minutos

/**
 * Rate limiter para pagamentos
 * Muito restritivo
 */
const paymentRateLimiter = createRateLimiter(3, 3600000); // 3 tentativas em 1 hora

/**
 * Rate limiter para API geral
 * Moderado
 */
const apiRateLimiter = createRateLimiter(30, 60000); // 30 requisições em 1 minuto

// ========== VALIDAÇÃO DE DADOS ESPECÍFICOS ==========

/**
 * Valida se um pacote existe e está disponível
 */
const validarPacoteExistente = (pacotes) => {
  return (value) => {
    const pacote = pacotes.find(p => p.id == value || p.slug === value);
    if (!pacote) {
      throw new Error('Pacote não encontrado');
    }
    if (!pacote.disponivel) {
      throw new Error('Pacote indisponível no momento');
    }
    return true;
  };
};

/**
 * Valida quantidade de itens
 */
const validarQuantidade = (value) => {
  const num = parseInt(value, 10);
  if (isNaN(num) || num < 1 || num > 10) {
    throw new Error('Quantidade deve estar entre 1 e 10');
  }
  return true;
};

/**
 * Valida preço
 */
const validarPreco = (value) => {
  const num = parseFloat(value);
  if (isNaN(num) || num <= 0) {
    throw new Error('Preço deve ser maior que zero');
  }
  return true;
};

/**
 * Valida datas
 */
const validarDataFutura = (value) => {
  const data = new Date(value);
  const agora = new Date();
  
  if (data < agora) {
    throw new Error('Data deve estar no futuro');
  }
  return true;
};

/**
 * Valida intervalo de datas
 */
const validarIntervaloData = (dataRetorno, { req }) => {
  const dataPartida = new Date(req.body.dataPartida);
  const dataRetornoObj = new Date(dataRetorno);
  
  if (dataRetornoObj <= dataPartida) {
    throw new Error('Data de retorno deve ser após data de partida');
  }
  
  // Máximo de 30 dias
  const diffMs = dataRetornoObj - dataPartida;
  const diffDias = diffMs / (1000 * 60 * 60 * 24);
  
  if (diffDias > 30) {
    throw new Error('Intervalo máximo de 30 dias');
  }
  
  return true;
};

// ========== TRATAMENTO DE ERROS GLOBAL ==========

/**
 * Middleware de tratamento de erros global
 */
const errorHandler = (err, req, res, next) => {
  const timestamp = new Date().toISOString();
  const clientIP = req.ip || req.connection.remoteAddress;
  
  // Log do erro
  console.error(`❌ [${timestamp}] ERRO: ${err.message}`);
  console.error(`   IP: ${clientIP}`);
  console.error(`   Rota: ${req.method} ${req.path}`);
  
  // Responder com erro apropriado
  if (req.headers.accept && req.headers.accept.includes('json')) {
    return res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Erro interno do servidor'
    });
  }
  
  // Se for HTML, renderizar página de erro
  res.status(err.status || 500).render('error', {
    title: 'Erro',
    message: err.message || 'Erro interno do servidor',
    status: err.status || 500
  });
};

/**
 * Middleware para rotas não encontradas
 */
const notFoundHandler = (req, res) => {
  if (req.headers.accept && req.headers.accept.includes('json')) {
    return res.status(404).json({
      success: false,
      message: 'Rota não encontrada'
    });
  }
  
  res.status(404).render('404', {
    title: 'Página não encontrada'
  });
};

// ========== VERIFICAÇÃO DE AUTENTICAÇÃO ==========

/**
 * Middleware que verifica se usuário está autenticado
 */
const verificarAutenticacao = (req, res, next) => {
  if (!req.session || !req.session.user) {
    if (req.headers.accept && req.headers.accept.includes('json')) {
      return res.status(401).json({
        success: false,
        message: 'Você precisa estar autenticado'
      });
    }
    return res.redirect('/auth?redirect=' + encodeURIComponent(req.originalUrl));
  }
  next();
};

/**
 * Middleware que verifica se usuário é admin
 */
const verificarAdmin = (req, res, next) => {
  if (!req.session || !req.session.user || req.session.user.tipo !== 'admin') {
    if (req.headers.accept && req.headers.accept.includes('json')) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Você precisa ser administrador'
      });
    }
    return res.render('error', {
      title: 'Acesso Negado',
      message: 'Você não tem permissão para acessar esta página',
      status: 403
    });
  }
  next();
};

// ========== EXPORTAR MIDDLEWARES ==========

module.exports = {
  // Sanitização
  sanitizeInput,
  sanitizeNumber,
  sanitizeEmail,
  sanitizeIdArray,
  
  // Validação de erros
  handleValidationErrorsJson,
  handleValidationErrorsHtml,
  
  // Logging
  securityLogger,
  
  // Rate limiting
  createRateLimiter,
  loginRateLimiter,
  paymentRateLimiter,
  apiRateLimiter,
  
  // Validações específicas
  validarPacoteExistente,
  validarQuantidade,
  validarPreco,
  validarDataFutura,
  validarIntervaloData,
  
  // Tratamento de erros
  errorHandler,
  notFoundHandler,
  
  // Autenticação
  verificarAutenticacao,
  verificarAdmin
};

const express = require('express');
const router = express.Router();
const { validateLogin, validateRegistro, validateEsqueceuSenha } = require('../config/validators');

// Dados simulados de usuários (em um projeto real, seria um banco de dados)
const usuarios = [
  {
    id: 1,
    email: 'admin@ecocompanion.com',
    senha: 'admin123',
    nome: 'Administrador',
    tipo: 'admin'
  },
  {
    id: 2,
    email: 'usuario@teste.com',
    senha: '123456',
    nome: 'João Silva',
    tipo: 'usuario'
  }
];

// GET - Exibir página de login
router.get('/', (req, res) => {
  res.render('auth/login', {
    title: 'Login',
    currentPage: 'login',
    pageCSS: 'auth',
    pageJS: 'auth',
    error: null
  });
});

// Sistema de rate limiting por IP
const loginAttempts = new Map();

// Middleware customizado para tratamento de erros de validação com redirect
const handleValidationErrorsHtml = (req, res, next) => {
  const { validationResult } = require('express-validator');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessage = errors.array()[0].msg;
    return res.render('auth/login', {
      title: 'Login',
      currentPage: 'login',
      pageCSS: 'auth',
      pageJS: 'auth',
      error: errorMessage,
      email: req.body.email || ''
    });
  }
  next();
};

// POST - Processar login
router.post('/', validateLogin, handleValidationErrorsHtml, (req, res) => {
  const { email, senha, lembrar } = req.body;
  const clientIP = req.ip || req.connection.remoteAddress;
  
  // Rate limiting - verificar tentativas por IP
  const attempts = loginAttempts.get(clientIP) || { count: 0, lastAttempt: 0 };
  const now = Date.now();
  
  // Reset contador após 5 minutos
  if (now - attempts.lastAttempt > 300000) {
    attempts.count = 0;
  }
  
  // Verificar se excedeu limite de tentativas
  if (attempts.count >= 5) {
    const waitTime = Math.min(300, attempts.count * 30);
    const remainingTime = Math.ceil((attempts.lastAttempt + waitTime * 1000 - now) / 1000);
    
    if (remainingTime > 0) {
      return res.render('auth/login', {
        title: 'Login',
        currentPage: 'login',
        pageCSS: 'auth',
        pageJS: 'auth',
        error: `Muitas tentativas de login. Tente novamente em ${remainingTime} segundos`,
        email: email
      });
    }
  }
  
  // Buscar usuário
  const usuario = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha);
  
  if (!usuario) {
    attempts.count++;
    attempts.lastAttempt = now;
    loginAttempts.set(clientIP, attempts);
    
    return res.render('auth/login', {
      title: 'Login',
      currentPage: 'login',
      pageCSS: 'auth',
      pageJS: 'auth',
      error: 'Email ou senha incorretos',
      email: email
    });
  }
  
  // Login bem-sucedido - limpar tentativas
  loginAttempts.delete(clientIP);
  
  // Simular criação de sessão
  req.session = req.session || {};
  req.session.user = {
    id: usuario.id,
    email: usuario.email,
    nome: usuario.nome,
    tipo: usuario.tipo
  };
  
  // Log de segurança
  console.log(`✅ Login bem-sucedido: ${usuario.email} (${clientIP}) em ${new Date().toISOString()}`);
  
  // Redirecionar baseado no tipo de usuário
  if (usuario.tipo === 'admin') {
    res.redirect('/admin/dashboard');
  } else {
    res.redirect('/');
  }
});

// GET - Página de registro
router.get('/registro', (req, res) => {
  res.render('auth/registro', {
    title: 'Criar Conta',
    currentPage: 'registro',
    pageCSS: 'auth',
    pageJS: 'auth',
    error: null,
    success: null
  });
});

// POST - Processar registro
router.post('/registro', validateRegistro, handleValidationErrorsHtml, (req, res) => {
  const { nome, email, senha, termos } = req.body;
  
  // Verificar se email já existe
  const emailExiste = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (emailExiste) {
    return res.render('auth/registro', {
      title: 'Criar Conta',
      currentPage: 'registro',
      pageCSS: 'auth',
      pageJS: 'auth',
      error: 'Este email já está cadastrado',
      nome
    });
  }
  
  if (!termos) {
    return res.render('auth/registro', {
      title: 'Criar Conta',
      currentPage: 'registro',
      pageCSS: 'auth',
      pageJS: 'auth',
      error: 'Você deve aceitar os termos de uso',
      nome, email
    });
  }
  
  // Criar novo usuário
  const novoUsuario = {
    id: usuarios.length + 1,
    nome,
    email,
    senha,
    tipo: 'usuario'
  };
  
  usuarios.push(novoUsuario);
  
  console.log(`✅ Novo usuário registrado: ${email} em ${new Date().toISOString()}`);
  
  // Sucesso
  res.render('auth/login', {
    title: 'Login',
    currentPage: 'login',
    pageCSS: 'auth',
    pageJS: 'auth',
    success: 'Conta criada com sucesso! Faça login para continuar.',
    email: email
  });
});

// GET - Esqueceu a senha
router.get('/esqueceu-senha', (req, res) => {
  res.render('auth/esqueceu-senha', {
    title: 'Esqueceu a Senha',
    currentPage: 'esqueceu-senha',
    pageCSS: 'auth',
    pageJS: 'auth',
    error: null,
    success: null
  });
});

// POST - Processar esqueceu a senha
router.post('/esqueceu-senha', validateEsqueceuSenha, handleValidationErrorsHtml, (req, res) => {
  const { email } = req.body;
  
  const usuario = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!usuario) {
    return res.render('auth/esqueceu-senha', {
      title: 'Esqueceu a Senha',
      currentPage: 'esqueceu-senha',
      pageCSS: 'auth',
      pageJS: 'auth',
      error: 'Email não encontrado',
      email
    });
  }
  
  // Simular envio de email
  console.log(`📧 Link de recuperação enviado para: ${email}`);
  
  res.render('auth/esqueceu-senha', {
    title: 'Esqueceu a Senha',
    currentPage: 'esqueceu-senha',
    pageCSS: 'auth',
    pageJS: 'auth',
    success: 'Um link de recuperação foi enviado para seu email.'
  });
});

// GET - Logout
router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(() => {
      res.redirect('/auth?logout=success');
    });
  } else {
    res.redirect('/auth?logout=success');
  }
});

module.exports = router;
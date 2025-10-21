const express = require('express');
const router = express.Router();

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

// POST - Processar login
router.post('/', (req, res) => {
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
  
  // Validações de entrada
  if (!email || !senha) {
    attempts.count++;
    attempts.lastAttempt = now;
    loginAttempts.set(clientIP, attempts);
    
    return res.render('auth/login', {
      title: 'Login',
      currentPage: 'login',
      pageCSS: 'auth',
      pageJS: 'auth',
      error: 'Email e senha são obrigatórios',
      email: email
    });
  }
  
  // Validar formato do email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    attempts.count++;
    attempts.lastAttempt = now;
    loginAttempts.set(clientIP, attempts);
    
    return res.render('auth/login', {
      title: 'Login',
      currentPage: 'login',
      pageCSS: 'auth',
      pageJS: 'auth',
      error: 'Formato de email inválido',
      email: email
    });
  }
  
  // Validar tamanho mínimo da senha
  if (senha.length < 3) {
    attempts.count++;
    attempts.lastAttempt = now;
    loginAttempts.set(clientIP, attempts);
    
    return res.render('auth/login', {
      title: 'Login',
      currentPage: 'login',
      pageCSS: 'auth',
      pageJS: 'auth',
      error: 'Senha muito curta',
      email: email
    });
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
  console.log(`Login bem-sucedido: ${usuario.email} (${clientIP}) em ${new Date().toISOString()}`);
  
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
router.post('/registro', (req, res) => {
  const { nome, email, senha, confirmarSenha, termos } = req.body;
  
  // Validações
  if (!nome || !email || !senha || !confirmarSenha) {
    return res.render('auth/registro', {
      title: 'Criar Conta',
      currentPage: 'registro',
      pageCSS: 'auth',
      pageJS: 'auth',
      error: 'Todos os campos são obrigatórios',
      nome, email
    });
  }
  
  if (senha !== confirmarSenha) {
    return res.render('auth/registro', {
      title: 'Criar Conta',
      currentPage: 'registro',
      pageCSS: 'auth',
      pageJS: 'auth',
      error: 'As senhas não coincidem',
      nome, email
    });
  }
  
  if (senha.length < 6) {
    return res.render('auth/registro', {
      title: 'Criar Conta',
      currentPage: 'registro',
      pageCSS: 'auth',
      pageJS: 'auth',
      error: 'A senha deve ter pelo menos 6 caracteres',
      nome, email
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
  
  // Verificar se email já existe
  const emailExiste = usuarios.find(u => u.email === email);
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
  
  // Criar novo usuário
  const novoUsuario = {
    id: usuarios.length + 1,
    nome,
    email,
    senha,
    tipo: 'usuario'
  };
  
  usuarios.push(novoUsuario);
  
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
router.post('/esqueceu-senha', (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.render('auth/esqueceu-senha', {
      title: 'Esqueceu a Senha',
      currentPage: 'esqueceu-senha',
      pageCSS: 'auth',
      pageJS: 'auth',
      error: 'Email é obrigatório'
    });
  }
  
  const usuario = usuarios.find(u => u.email === email);
  
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
  // Limpar sessão (quando implementada)
  res.redirect('/auth?logout=success');
});

module.exports = router;
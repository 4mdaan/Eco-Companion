const express = require('express');
const path = require('path');
const helmet = require('helmet');
const session = require('express-session');
require('dotenv').config();

const connectDB = require('./config/database');
const { securityLogger, errorHandler, notFoundHandler } = require('./config/security-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// ========== SEGURANÇA ==========

// Helmet: Protege contra vulnerabilidades HTTP comuns
app.use(helmet());

// Logger de segurança global
app.use(securityLogger);

// ========== CONFIGURAÇÃO DO APP ==========

// Configurar EJS como template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configurar sessão
app.use(session({
  secret: process.env.SESSION_SECRET || 'eco_companion_session_secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true
  }
}));

app.use((req, res, next) => {
  res.locals.user = req.session && req.session.user ? req.session.user : null;
  next();
});

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Rota de debug para o carrinho
app.get('/debug-carrinho.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'debug-carrinho.html'));
});

// Middleware para parsing de dados do formulário (ANTES do JSON)
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware especial para webhook do Stripe (deve vir antes do express.json())
app.use('/api/payments/webhook/stripe', express.raw({type: 'application/json'}));

// Middleware para JSON (DEPOIS do webhook)
app.use(express.json({ limit: '10mb' }));

const startServer = () => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📁 Estrutura do projeto configurada com sucesso!`);
    console.log(`🔐 Middleware de segurança ativo`);
    console.log(`✅ Validações expressivas implementadas`);
    console.log(`� Ambiente: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();

// ========== ROTAS ==========

// Importar rotas
const indexRoutes = require('./routes/index');
const pacotesRoutes = require('./routes/pacotes');
const destinosRoutes = require('./routes/destinos');
const carrinhoRoutes = require('./routes/carrinho');
const cashbackRoutes = require('./routes/cashback');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const chatRoutes = require('./routes/chat');
const legalRoutes = require('./routes/legal');
const paymentsRoutes = require('./routes/payments');

// Usar as rotas
app.use('/', indexRoutes);
app.use('/pacotes', pacotesRoutes);
app.use('/destinos', destinosRoutes);
app.use('/carrinho', carrinhoRoutes);
app.use('/cashback', cashbackRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/chat', chatRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/', legalRoutes);

// ========== TRATAMENTO DE ERROS ==========

// Middleware para rotas não encontradas
app.use(notFoundHandler);

// Middleware global de tratamento de erros (DEVE SER O ÚLTIMO)
app.use(errorHandler);

module.exports = app;
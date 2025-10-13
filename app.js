const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar EJS como template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsing de dados do formulário
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Importar rotas
const indexRoutes = require('./routes/index');
const pacotesRoutes = require('./routes/pacotes');
const destinosRoutes = require('./routes/destinos');
const carrinhoRoutes = require('./routes/carrinho');

// Usar as rotas
app.use('/', indexRoutes);
app.use('/pacotes', pacotesRoutes);
app.use('/destinos', destinosRoutes);
app.use('/carrinho', carrinhoRoutes);

// Middleware para tratamento de erros 404
app.use((req, res, next) => {
  res.status(404).render('404', {
    title: 'Página não encontrada',
    message: 'A página que você está procurando não existe.'
  });
});

// Middleware para tratamento de erros gerais
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    title: 'Erro interno do servidor',
    message: 'Algo deu errado! Tente novamente mais tarde.'
  });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📁 Estrutura do projeto configurada com sucesso!`);
});

module.exports = app;
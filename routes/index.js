const express = require('express');
const router = express.Router();

// Rota para a página inicial
router.get('/', (req, res) => {
  // Dados dos pacotes para exibir na página inicial
  const pacotes = [
    {
      destino: 'Rio de Janeiro',
      periodo: '17 de Nov - 21 de Nov',
      preco: '870',
      bgClass: 'bg-rio',
      slug: 'rio-de-janeiro'
    },
    {
      destino: 'Florianópolis',
      periodo: '03 de Nov - 07 de Nov',
      preco: '841',
      bgClass: 'bg-florianopolis',
      slug: 'florianopolis'
    },
    {
      destino: 'Porto Seguro',
      periodo: '17 de Dez - 21 de Dez',
      preco: '1.828',
      bgClass: 'bg-porto-seguro',
      slug: 'porto-seguro'
    }
  ];

  res.render('index', {
    title: 'Início',
    description: 'Descubra as melhores experiências de viagem com nossa agência especializada em turismo marinho.',
    heroTitle: 'Mais que viagens,',
    heroSubtitle: 'experiências de vida !',
    pacotes: pacotes
  });
});

// Rota para página sobre
router.get('/sobre', (req, res) => {
  res.render('sobre', {
    title: 'Sobre Nós',
    description: 'Conheça nossa história e nossa paixão por criar experiências de viagem inesquecíveis.'
  });
});

// Rota para página de contato
router.get('/contato', (req, res) => {
  res.render('contato', {
    title: 'Contato',
    description: 'Entre em contato conosco para planejar sua próxima aventura.'
  });
});

module.exports = router;
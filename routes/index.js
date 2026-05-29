const express = require('express');
const router = express.Router();
const { validateContato } = require('../config/validators');

// Middleware customizado para tratamento de erros de validação com redirect
const handleValidationErrorsHtml = (req, res, next) => {
  const { validationResult } = require('express-validator');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessage = errors.array()[0].msg;
    return res.render('contato', {
      title: 'Contato',
      description: 'Entre em contato conosco para planejar sua próxima aventura.',
      error: errorMessage,
      formData: req.body
    });
  }
  next();
};

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
    },
    {
      destino: 'Natal',
      periodo: '15 de Mar - 20 de Mar',
      preco: '1.380',
      bgClass: 'bg-natal',
      slug: 'natal'
    },
    {
      destino: 'Maceió',
      periodo: '08 de Abr - 13 de Abr',
      preco: '1.295',
      bgClass: 'bg-maceio',
      slug: 'maceio'
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

// Rota para processar formulário de contato
router.post('/contato', validateContato, handleValidationErrorsHtml, (req, res) => {
    const { nome, email, telefone, servico, mensagem, newsletter } = req.body;
    
    // Gerar protocolo único
    const protocolo = `ECO${Date.now()}`;
    
    console.log(`✉️ Contato recebido - Protocolo: ${protocolo}`);
    console.log({ nome, email, telefone, servico, newsletter });
    
    res.render('contato-sucesso', { 
        title: 'Contato Enviado - Eco Companion',
        protocolo,
        nome 
    });
});

// Rota para a página de agenda
router.get('/agenda', (req, res) => {
    // Dados da agenda com diferentes pacotes e datas
    const agenda = {
        novembro2025: [
            {
                data: '15/11/2025',
                destino: 'Rio de Janeiro',
                tipo: 'City Tour',
                preco: 1200,
                vagas: 8,
                duracao: '3 dias',
                slug: 'rio-de-janeiro'
            },
            {
                data: '22/11/2025',
                destino: 'Florianópolis',
                tipo: 'Praia & Aventura',
                preco: 900,
                vagas: 12,
                duracao: '4 dias',
                slug: 'florianopolis'
            },
            {
                data: '29/11/2025',
                destino: 'Fernando de Noronha',
                tipo: 'Ecoturismo',
                preco: 3500,
                vagas: 6,
                duracao: '5 dias',
                slug: 'fernando-de-noronha'
            }
        ],
        dezembro2025: [
            {
                data: '06/12/2025',
                destino: 'Porto Seguro',
                tipo: 'Praia & História',
                preco: 800,
                vagas: 15,
                duracao: '4 dias',
                slug: 'porto-seguro'
            },
            {
                data: '13/12/2025',
                destino: 'Campos do Jordão',
                tipo: 'Turismo Rural',
                preco: 1800,
                vagas: 12,
                duracao: '4 dias',
                slug: 'campos-do-jordao'
            },
            {
                data: '20/12/2025',
                destino: 'Fernando de Noronha',
                tipo: 'Ecoturismo Premium',
                preco: 3500,
                vagas: 10,
                duracao: '5 dias',
                slug: 'fernando-de-noronha'
            },
            {
                data: '27/12/2025',
                destino: 'Rio de Janeiro - Réveillon',
                tipo: 'Festa & Cultura',
                preco: 1200,
                vagas: 20,
                duracao: '4 dias',
                slug: 'rio-de-janeiro'
            }
        ],
        janeiro2026: [
            {
                data: '10/01/2026',
                destino: 'Florianópolis',
                tipo: 'Verão Completo',
                preco: 900,
                vagas: 14,
                duracao: '5 dias',
                slug: 'florianopolis'
            },
            {
                data: '17/01/2026',
                destino: 'Fernando de Noronha',
                tipo: 'Mergulho Avançado',
                preco: 3500,
                vagas: 8,
                duracao: '6 dias',
                slug: 'fernando-de-noronha'
            },
            {
                data: '24/01/2026',
                destino: 'Porto Seguro',
                tipo: 'Carnaval Antecipado',
                preco: 800,
                vagas: 18,
                duracao: '4 dias',
                slug: 'porto-seguro'
            }
        ]
    };

    res.render('agenda', { 
        title: 'Agenda de Viagens - Eco Companion',
        currentPage: 'agenda',
        agenda
    });
});

module.exports = router;

// Rota para página de confirmação de contato
router.get('/contato/sucesso/:protocolo', (req, res) => {
  const { protocolo } = req.params;
  
  res.render('contato-sucesso', {
    title: 'Mensagem Enviada com Sucesso!',
    description: 'Sua mensagem foi recebida e será respondida em breve.',
    protocolo: protocolo
  });
});

module.exports = router;

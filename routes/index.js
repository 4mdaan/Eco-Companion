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

// Rota para processar formulário de contato
router.post('/contato', (req, res) => {
    const { nome, email, telefone, servico, mensagem, newsletter } = req.body;
    
    // Aqui você pode implementar:
    // - Validação dos dados
    // - Salvamento no banco de dados
    // - Envio de email
    // - Integração com CRM
    
    // Gerar protocolo único
    const protocolo = `ECO${Date.now()}`;
    
    console.log('Contato recebido:', { nome, email, telefone, servico, mensagem, newsletter, protocolo });
    
    res.render('contato-sucesso', { 
        title: 'Contato Enviado - Eco Companion',
        protocolo,
        nome 
    });
});

// Rota para a página de promoções
router.get('/promocoes', (req, res) => {
    // Dados das promoções ativas
    const promocoes = {
        destacadas: [
            {
                id: 1,
                destino: 'Rio de Janeiro',
                titulo: 'Super Oferta Cidade Maravilhosa',
                precoOriginal: 1200,
                precoPromocional: 899,
                desconto: 25,
                validadeInicio: '2025-10-15',
                validadeFim: '2025-11-30',
                vagas: 15,
                slug: 'rio-de-janeiro',
                tipo: 'flash',
                beneficios: ['Hotel 4 estrelas', 'Café da manhã incluso', 'City tour gratuito'],
                condicoes: 'Válido para viagens até dezembro/2025'
            },
            {
                id: 2,
                destino: 'Fernando de Noronha',
                titulo: 'Paraíso Tropical com 30% OFF',
                precoOriginal: 3500,
                precoPromocional: 2450,
                desconto: 30,
                validadeInicio: '2025-10-10',
                validadeFim: '2025-12-15',
                vagas: 8,
                slug: 'fernando-de-noronha',
                tipo: 'limitada',
                beneficios: ['Mergulho incluso', 'Traslados', 'Seguro viagem'],
                condicoes: 'Limitado a 8 pessoas por saída'
            },
            {
                id: 3,
                destino: 'Campos do Jordão',
                titulo: 'Inverno na Montanha - Promoção Especial',
                precoOriginal: 1800,
                precoPromocional: 1440,
                desconto: 20,
                validadeInicio: '2025-10-01',
                validadeFim: '2025-12-31',
                vagas: 15,
                slug: 'campos-do-jordao',
                tipo: 'promocao',
                beneficios: ['Lareira na pousada', 'Tour cervejaria', 'Teleférico incluso'],
                condicoes: 'Exclusivo para casais, máximo 2 casais'
            }
        ],
        categorias: {
            nacionais: [
                {
                    destino: 'Florianópolis',
                    precoOriginal: 900,
                    precoPromocional: 720,
                    desconto: 20,
                    titulo: 'Ilha da Magia - Primavera',
                    slug: 'florianopolis',
                    validade: '2025-11-30'
                },
                {
                    destino: 'Porto Seguro',
                    precoOriginal: 800,
                    precoPromocional: 640,
                    desconto: 20,
                    titulo: 'Berço do Brasil',
                    slug: 'porto-seguro',
                    validade: '2025-12-20'
                }
            ],
            internacionais: [
                {
                    destino: 'Foz do Iguaçu',
                    precoOriginal: 1500,
                    precoPromocional: 1200,
                    desconto: 20,
                    titulo: 'Cataratas do Iguaçu - Maravilha Natural',
                    slug: 'foz-do-iguacu',
                    validade: '2025-12-31'
                }
            ],
            ecoturismo: [
                {
                    destino: 'Fernando de Noronha',
                    precoOriginal: 3500,
                    precoPromocional: 2800,
                    desconto: 20,
                    titulo: 'Mergulho com Golfinhos',
                    slug: 'fernando-de-noronha',
                    validade: '2025-11-15'
                }
            ]
        },
        ultimaChance: [
            {
                destino: 'Rio de Janeiro - Réveillon',
                precoOriginal: 1500,
                precoPromocional: 1200,
                desconto: 20,
                vagas: 5,
                titulo: 'Réveillon 2026 em Copacabana',
                slug: 'rio-de-janeiro',
                validade: '2025-10-31',
                urgencia: 'Apenas 5 vagas restantes!'
            },
            {
                destino: 'Florianópolis - Carnaval',
                precoOriginal: 1100,
                precoPromocional: 880,
                desconto: 20,
                vagas: 12,
                titulo: 'Carnaval 2026 na Ilha',
                slug: 'florianopolis',
                validade: '2025-11-15',
                urgencia: 'Últimas semanas para garantir!'
            }
        ]
    };

    res.render('promocoes', { 
        title: 'Promoções Especiais - Eco Companion',
        currentPage: 'promocoes',
        promocoes
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
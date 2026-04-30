const express = require('express');
const router = express.Router();
const { validateCompraDestino, validateDetalhesDestino, handleValidationErrors } = require('../config/validators');
const { securityLogger, apiRateLimiter } = require('../config/security-middleware');

// Rota para listar todos os destinos
router.get('/', securityLogger, apiRateLimiter, (req, res) => {
  const destinos = [
    {
      id: 1,
      nome: 'Rio de Janeiro',
      estado: 'Rio de Janeiro',
      regiao: 'Sudeste',
      descricao: 'Cidade maravilhosa com praias deslumbrantes e pontos turísticos icônicos.',
      atrações: ['Cristo Redentor', 'Pão de Açúcar', 'Copacabana', 'Ipanema', 'Santa Teresa'],
      imagem: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=60',
      categoria: 'Praia e Cultura',
      melhorEpoca: 'Março a Maio, Setembro a Novembro',
      slug: 'rio-de-janeiro'
    },
    {
      id: 2,
      nome: 'Florianópolis',
      estado: 'Santa Catarina',
      regiao: 'Sul',
      descricao: 'Ilha da Magia com mais de 40 praias paradisíacas e rica cultura açoriana.',
      atrações: ['Lagoa da Conceição', 'Praia do Campeche', 'Centro Histórico', 'Ponte Hercílio Luz'],
      imagem: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=60',
      categoria: 'Praia',
      melhorEpoca: 'Dezembro a Março',
      slug: 'florianopolis'
    },
    {
      id: 3,
      nome: 'Porto Seguro',
      estado: 'Bahia',
      regiao: 'Nordeste',
      descricao: 'Berço do Brasil com praias tropicais e rica história colonial.',
      atrações: ['Centro Histórico', 'Passarela do Descobrimento', 'Praia de Taperapuã', 'Arraial d\'Ajuda'],
      imagem: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=60',
      categoria: 'Praia e História',
      melhorEpoca: 'Setembro a Março',
      slug: 'porto-seguro'
    },
    {
      id: 4,
      nome: 'Fernando de Noronha',
      estado: 'Pernambuco',
      regiao: 'Nordeste',
      descricao: 'Arquipélago paradisíaco com águas cristalinas e vida marinha exuberante.',
      atrações: ['Baía do Sancho', 'Dois Irmãos', 'Projeto Tamar', 'Mirante dos Golfinhos'],
      imagem: '/imagens/fernandodenoronha.png',
      categoria: 'Ecoturismo',
      melhorEpoca: 'Agosto a Dezembro',
      slug: 'fernando-de-noronha'
    },
    {
      id: 5,
      nome: 'Campos do Jordão',
      estado: 'São Paulo',
      regiao: 'Sudeste',
      descricao: 'A Suíça Brasileira no inverno, com clima de montanha, arquitetura europeia e gastronomia aconchegante.',
      atrações: ['Teleférico', 'Horto Florestal', 'Vila Capivari', 'Cervejaria Baden Baden', 'Palácio Boa Vista', 'Ducha de Prata'],
  imagem: 'http://todososcaminhos.com/wp-content/uploads/2020/09/20190513_143434-scaled.jpg',
      categoria: 'Turismo Rural',
      melhorEpoca: 'Maio a Setembro',
      preco: 1800,
      avaliacaoMedia: 4.7,
      slug: 'campos-do-jordao'
    },
    {
      id: 6,
      nome: 'Foz do Iguaçu',
      estado: 'Paraná',
      regiao: 'Sul',
      descricao: 'Lar das majestosas Cataratas do Iguaçu, uma das 7 Maravilhas da Natureza moderna.',
      atrações: ['Cataratas do Iguaçu', 'Parque das Aves', 'Usina de Itaipu', 'Marco das Três Fronteiras', 'Templo Budista', 'Passeio de helicóptero'],
  imagem: 'https://emalgumlugardomundo.com.br/wp-content/uploads/2021/12/o-que-fazer-em-foz-do-iguacu-cataratas-3.jpg',
      categoria: 'Ecoturismo',
      melhorEpoca: 'Março a Maio e Agosto a Outubro',
      preco: 1500,
      avaliacaoMedia: 4.9,
      slug: 'foz-do-iguacu'
    }
  ];

  res.render('destinos/index', {
    title: 'Destinos',
    description: 'Explore os destinos mais incríveis do Brasil com nossos roteiros especialmente planejados.',
    destinos: destinos
  });
});

// Rota para detalhes de um destino específico
router.get('/:slug', securityLogger, apiRateLimiter, validateDetalhesDestino, handleValidationErrors, (req, res) => {
  const { slug } = req.params;
  
  // Simular busca do destino pelo slug - incluindo todos os destinos
  const destinos = [
    {
      id: 1,
      nome: 'Rio de Janeiro',
      estado: 'Rio de Janeiro',
      regiao: 'Sudeste',
      descricao: 'Cidade maravilhosa com praias deslumbrantes e pontos turísticos icônicos.',
      descricaoCompleta: 'O Rio de Janeiro é uma das cidades mais famosas do mundo, conhecida por suas praias icônicas, monumentos históricos e cultura vibrante. A cidade oferece uma combinação única de natureza exuberante e vida urbana cosmopolita.',
      atrações: ['Cristo Redentor', 'Pão de Açúcar', 'Copacabana', 'Ipanema', 'Santa Teresa', 'Lapa', 'Maracanã'],
      imagem: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=60',
      categoria: 'Praia e Cultura',
      melhorEpoca: 'Março a Maio, Setembro a Novembro',
      clima: 'Tropical',
      temperatura: '20°C a 30°C',
      slug: 'rio-de-janeiro',
      preco: 1200,
      avaliacaoMedia: 4.8
    },
    {
      id: 2,
      nome: 'Florianópolis',
      estado: 'Santa Catarina',
      regiao: 'Sul',
      descricao: 'Ilha da Magia com mais de 40 praias paradisíacas e rica cultura açoriana.',
      descricaoCompleta: 'Florianópolis combina belezas naturais excepcionais com infraestrutura moderna. A ilha oferece praias para todos os gostos, desde as mais agitadas até recantos selvagens preservados.',
      atrações: ['Lagoa da Conceição', 'Praia do Campeche', 'Centro Histórico', 'Ponte Hercílio Luz', 'Jurere Internacional'],
      imagem: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=60',
      categoria: 'Praia',
      melhorEpoca: 'Dezembro a Março',
      clima: 'Subtropical',
      temperatura: '15°C a 28°C',
      slug: 'florianopolis',
      preco: 900,
      avaliacaoMedia: 4.5
    },
    {
      id: 3,
      nome: 'Porto Seguro',
      estado: 'Bahia',
      regiao: 'Nordeste',
      descricao: 'Berço do Brasil com praias tropicais e rica história colonial.',
      descricaoCompleta: 'Porto Seguro é onde a história do Brasil começou. Além do valor histórico inestimável, a região oferece praias paradisíacas, vida noturna vibrante e cultura baiana autêntica.',
      atrações: ['Centro Histórico', 'Passarela do Descobrimento', 'Praia de Taperapuã', 'Arraial d\'Ajuda', 'Trancoso'],
      imagem: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=60',
      categoria: 'Praia e História',
      melhorEpoca: 'Setembro a Março',
      clima: 'Tropical',
      temperatura: '22°C a 30°C',
      slug: 'porto-seguro',
      preco: 800,
      avaliacaoMedia: 4.3
    },
    {
      id: 4,
      nome: 'Fernando de Noronha',
      estado: 'Pernambuco',
      regiao: 'Nordeste',
      descricao: 'Arquipélago paradisíaco com águas cristalinas e vida marinha exuberante.',
      descricaoCompleta: 'Fernando de Noronha é um santuário ecológico único no mundo. Com praias eleitas as melhores do planeta, o arquipélago oferece experiências inesquecíveis de contato com a natureza preservada.',
      atrações: ['Baía do Sancho', 'Dois Irmãos', 'Projeto Tamar', 'Mirante dos Golfinhos', 'Praia do Leão'],
      imagem: '/imagens/fernandodenoronha.png',
      categoria: 'Ecoturismo',
      melhorEpoca: 'Agosto a Dezembro',
      clima: 'Tropical oceânico',
      temperatura: '24°C a 30°C',
      slug: 'fernando-de-noronha',
      preco: 3500,
      avaliacaoMedia: 4.9
    },
    {
      id: 5,
      nome: 'Campos do Jordão',
      estado: 'São Paulo',
      regiao: 'Sudeste',
      descricao: 'A Suíça Brasileira no inverno, com clima de montanha, arquitetura europeia e gastronomia aconchegante.',
      descricaoCompleta: 'Campos do Jordão é um destino único no Brasil, oferecendo a experiência de um inverno europeu em terras brasileiras. Conhecida como a "Suíça Brasileira", a cidade encanta com sua arquitetura típica alemã, clima de montanha e uma gastronomia que aquece o coração. É o destino perfeito para quem busca romance, tranquilidade e contato com a natureza.',
      atrações: ['Teleférico', 'Horto Florestal', 'Vila Capivari', 'Cervejaria Baden Baden', 'Palácio Boa Vista', 'Ducha de Prata'],
      imagem: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=60',
      categoria: 'Turismo Rural',
      melhorEpoca: 'Maio a Setembro',
      clima: 'Subtropical de altitude',
      temperatura: '5°C a 20°C',
      preco: 1800,
      avaliacaoMedia: 4.7,
      incluso: [
        'Hospedagem em pousada charmosa com lareira',
        'Café da manhã colonial completo',
        'Passeio de teleférico no Morro do Elefante',
        'Visita à fábrica da cervejaria Baden Baden',
        'Tour pelas vinícolas da região',
        'Jantar típico alemão em restaurante tradicional',
        'Passeio pelo Horto Florestal',
        'Compras na Vila Capivari'
      ],
      diferenciais: [
        '�️ Clima de montanha único no Brasil',
        '� Degustação em cervejarias artesanais',
        '🏰 Arquitetura europeia encantadora',
        '🌲 Trilhas ecológicas na Mata Atlântica',
        '� Experiência em vinícolas premiadas',
        '🔥 Experiência aconchegante com lareiras'
      ],
      slug: 'campos-do-jordao'
    },
    {
      id: 6,
      nome: 'Foz do Iguaçu',
      estado: 'Paraná',
      regiao: 'Sul',
      descricao: 'Lar das majestosas Cataratas do Iguaçu, uma das 7 Maravilhas da Natureza moderna.',
      descricaoCompleta: 'Foz do Iguaçu é um destino que impressiona pela grandiosidade da natureza. As Cataratas do Iguaçu, reconhecidas como uma das 7 Maravilhas Naturais do Mundo, oferecem um espetáculo único de força e beleza. Além das quedas d\'água, a região encanta com sua rica biodiversidade, marcos históricos e a experiência única de estar na tríplice fronteira.',
      atrações: ['Cataratas do Iguaçu', 'Parque das Aves', 'Usina de Itaipu', 'Marco das Três Fronteiras', 'Templo Budista', 'Passeio de helicóptero'],
      imagem: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=60',
      categoria: 'Ecoturismo',
      melhorEpoca: 'Março a Maio e Agosto a Outubro',
      clima: 'Subtropical úmido',
      temperatura: '18°C a 28°C',
      preco: 1500,
      avaliacaoMedia: 4.9,
      slug: 'foz-do-iguacu'
    }
  ];
  
  const destino = destinos.find(d => d.slug === slug);
  
  if (!destino) {
    return res.status(404).render('404', {
      title: 'Destino não encontrado',
      message: 'O destino que você está procurando não foi encontrado.'
    });
  }
  
  res.render('destinos/detalhes', {
    title: destino.nome,
    description: destino.descricao,
    destino: destino
  });
});

// Rota para compra direta do destino - redireciona para checkout
router.get('/:slug/comprar', (req, res) => {
  const { slug } = req.params;
  
  // Buscar o destino pelo slug (usando a mesma lista de destinos)
  const destinos = [
    {
      id: 1,
      nome: 'Rio de Janeiro',
      estado: 'Rio de Janeiro',
      regiao: 'Sudeste',
      descricao: 'Cidade maravilhosa com praias deslumbrantes e pontos turísticos icônicos.',
      imagem: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=60',
      categoria: 'Praia e Cultura',
      melhorEpoca: 'Março a Maio, Setembro a Novembro',
      slug: 'rio-de-janeiro',
      preco: 1200,
      avaliacaoMedia: 4.8,
      incluso: ['Hospedagem 4 estrelas', 'Café da manhã', 'City tour', 'Cristo Redentor', 'Pão de Açúcar'],
      duracao: '5 dias / 4 noites'
    },
    {
      id: 2,
      nome: 'Florianópolis',
      estado: 'Santa Catarina',
      regiao: 'Sul',
      descricao: 'Ilha da Magia com mais de 40 praias paradisíacas e rica cultura açoriana.',
      imagem: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=60',
      categoria: 'Praia',
      melhorEpoca: 'Dezembro a Março',
      slug: 'florianopolis',
      preco: 900,
      avaliacaoMedia: 4.5,
      incluso: ['Hospedagem pousada', 'Café da manhã', 'Passeio de barco', 'Lagoa da Conceição'],
      duracao: '4 dias / 3 noites'
    },
    {
      id: 3,
      nome: 'Porto Seguro',
      estado: 'Bahia',
      regiao: 'Nordeste',
      descricao: 'Berço do Brasil com praias tropicais e rica história colonial.',
      imagem: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=60',
      categoria: 'Praia e História',
      melhorEpoca: 'Setembro a Março',
      slug: 'porto-seguro',
      preco: 800,
      avaliacaoMedia: 4.3,
      incluso: ['Hospedagem resort', 'All inclusive', 'Centro histórico', 'Arraial d\'Ajuda'],
      duracao: '6 dias / 5 noites'
    },
    {
      id: 4,
      nome: 'Fernando de Noronha',
      estado: 'Pernambuco',
      regiao: 'Nordeste',
      descricao: 'Arquipélago paradisíaco com águas cristalinas e vida marinha exuberante.',
      imagem: '/imagens/fernandodenoronha.png',
      categoria: 'Ecoturismo',
      melhorEpoca: 'Agosto a Dezembro',
      slug: 'fernando-de-noronha',
      preco: 3500,
      avaliacaoMedia: 4.9,
      incluso: ['Hospedagem pousada ecológica', 'Café da manhã', 'Mergulho guiado', 'Trilhas ecológicas', 'Taxa ambiental'],
      duracao: '4 dias / 3 noites'
    },
    {
      id: 5,
      nome: 'Campos do Jordão',
      estado: 'São Paulo',
      regiao: 'Sudeste',
      descricao: 'A Suíça Brasileira no inverno, com clima de montanha, arquitetura europeia e gastronomia aconchegante.',
      imagem: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=60',
      categoria: 'Turismo Rural',
      melhorEpoca: 'Maio a Setembro',
      preco: 1800,
      avaliacaoMedia: 4.7,
      incluso: ['Hospedagem pousada charmosa', 'Café da manhã colonial', 'Passeio teleférico', 'Tour cervejaria', 'Jantar típico'],
      duracao: '4 dias / 3 noites'
    },
    {
      id: 6,
      nome: 'Foz do Iguaçu',
      estado: 'Paraná',
      regiao: 'Sul',
      descricao: 'Lar das majestosas Cataratas do Iguaçu, uma das 7 Maravilhas da Natureza moderna.',
      imagem: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=60',
      categoria: 'Ecoturismo',
      melhorEpoca: 'Março a Maio e Agosto a Outubro',
      preco: 1500,
      avaliacaoMedia: 4.9,
      incluso: ['Hospedagem hotel confortável', 'Café da manhã', 'Ingresso Cataratas', 'Parque das Aves', 'Tour Itaipu'],
      duracao: '3 dias / 2 noites',
      slug: 'foz-do-iguacu'
    }
  ];
  
  const destino = destinos.find(d => d.slug === slug);
  
  if (!destino) {
    return res.status(404).render('404', {
      title: 'Destino não encontrado',
      message: 'O destino que você está procurando não foi encontrado.'
    });
  }
  
  // Criar item para adicionar ao carrinho
  const itemCarrinho = {
    id: destino.id.toString(),
    nome: destino.nome,
    preco: destino.preco || 1200,
    periodo: destino.duracao || '5 dias / 4 noites',
    imagem: getImageClass(destino.nome),
    tipo: 'destino',
    quantidade: 1
  };
  
  // Função para mapear nome do destino para classe CSS
  function getImageClass(nome) {
    const nomeNormalizado = nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    const mapeamento = {
      'rio de janeiro': 'bg-rio',
      'florianopolis': 'bg-florianopolis',
      'porto seguro': 'bg-porto-seguro',
      'fernando de noronha': 'bg-fernando-noronha',
      'chapada diamantina': 'bg-chapada-diamantina',
      'natal': 'bg-natal',
      'maceio': 'bg-maceio',
      'gramado': 'bg-gramado',
      'paris': 'bg-paris'
    };
    
    return mapeamento[nomeNormalizado] || 'bg-default';
  }
  
  // Redirecionar para checkout com parâmetros do item e mensagem de sucesso
  const itemQuery = encodeURIComponent(JSON.stringify(itemCarrinho));
  res.redirect(`/carrinho/checkout?item=${itemQuery}&adicionado=true&nome=${encodeURIComponent(destino.nome)}`);
});

// Rota para processar compra direta do destino
router.post('/:slug/comprar', securityLogger, apiRateLimiter, validateCompraDestino, handleValidationErrors, (req, res) => {
  const { slug } = req.params;
  const { nome, email, telefone, cpf, metodoPagamento, endereco, pessoas } = req.body;
  
  // Buscar destino
  const destinos = [
    { id: 1, nome: 'Rio de Janeiro', preco: 1200, slug: 'rio-de-janeiro' },
    { id: 2, nome: 'Florianópolis', preco: 900, slug: 'florianopolis' },
    { id: 3, nome: 'Porto Seguro', preco: 800, slug: 'porto-seguro' },
    { id: 4, nome: 'Fernando de Noronha', preco: 3500, slug: 'fernando-de-noronha' },
    { id: 5, nome: 'Campos do Jordão', preco: 1800, slug: 'campos-do-jordao' },
    { id: 6, nome: 'Foz do Iguaçu', preco: 1500, slug: 'foz-do-iguacu' }
  ];
  
  const destino = destinos.find(d => d.slug === slug);
  
  if (!destino) {
    return res.status(404).json({ success: false, message: 'Destino não encontrado' });
  }
  
  // Calcular valor total
  const numeroPessoas = parseInt(pessoas) || 1;
  const valorTotal = destino.preco * numeroPessoas;
  
  // Simular processamento de pagamento
  const numeroReserva = 'RES' + Date.now();
  
  // Dados do pedido
  const pedido = {
    numeroReserva,
    destino: destino.nome,
    pessoas: numeroPessoas,
    valorUnitario: destino.preco,
    valorTotal: valorTotal,
    cliente: { nome, email, telefone, cpf },
    metodoPagamento,
    endereco,
    dataReserva: new Date()
  };
  
  // Renderizar página de sucesso
  res.render('destinos/sucesso', {
    title: 'Compra Realizada com Sucesso!',
    description: `Sua reserva para ${destino.nome} foi confirmada.`,
    pedido: pedido
  });
});

module.exports = router;
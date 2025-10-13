const express = require('express');
const router = express.Router();

// Rota para listar todos os destinos
router.get('/', (req, res) => {
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
      nome: 'Maldivas Privativas',
      estado: null,
      regiao: 'Internacional',
      pais: 'Maldivas',
      descricao: 'Experiência ultra-luxuosa em resort privativo com overwater villas e mordomo pessoal 24h.',
      atrações: ['Villa sobre as águas', 'Spa subaquático', 'Jantar com chef Michelin', 'Mergulho com tubarões-baleia', 'Helicóptero privativo', 'Iate exclusivo'],
      imagem: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=60',
      categoria: 'Ultra Luxury',
      melhorEpoca: 'Novembro a Abril',
      preco: 45000,
      avaliacaoMedia: 5.0,
      exclusividade: 'Apenas 8 convidados por temporada',
      incluso: [
        'Villa overwater de 300m² com piscina infinita privativa',
        'Mordomo pessoal 24/7 e chef particular',
        'Transfers em hidroavião e iate de luxo',
        'Mergulho com equipamento profissional e guia especializado',
        'Spa com tratamentos de cristais e pedras preciosas',
        'Experiências gastronômicas com chefs estrelados Michelin',
        'Acesso exclusivo a ilha privativa desabitada',
        'Observação de golfinhos e baleias em iate premium'
      ],
      diferenciais: [
        '🏖️ Praia exclusiva com areia cor-de-rosa importada',
        '🍾 Adega subterrânea com champagnes raros',
        '💎 Joias marinhas personalizadas de cortesia',
        '🚁 Helicóptero para passeios panorâmicos',
        '🌟 Observatório astronômico privativo',
        '🎭 Apresentações culturais maldívias exclusivas'
      ],
      slug: 'maldivas-privativas'
    },
    {
      id: 6,
      nome: 'Paris',
      estado: null,
      regiao: 'Internacional',
      pais: 'França',
      descricao: 'Cidade Luz, capital mundial da moda, arte e gastronomia com monumentos icônicos.',
      atrações: ['Torre Eiffel', 'Museu do Louvre', 'Notre-Dame', 'Champs-Élysées', 'Montmartre', 'Arco do Triunfo'],
      imagem: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?auto=format&fit=crop&w=800&q=60',
      categoria: 'Cidade Cultural',
      melhorEpoca: 'Maio a Setembro',
      preco: 8500,
      avaliacaoMedia: 4.8,
      slug: 'paris'
    }
  ];

  res.render('destinos/index', {
    title: 'Destinos',
    description: 'Explore os destinos mais incríveis do Brasil com nossos roteiros especialmente planejados.',
    destinos: destinos
  });
});

// Rota para detalhes de um destino específico
router.get('/:slug', (req, res) => {
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
      nome: 'Maldivas Privativas',
      estado: null,
      regiao: 'Internacional',
      pais: 'Maldivas',
      descricao: 'Experiência ultra-luxuosa em resort privativo com overwater villas e mordomo pessoal 24h.',
      descricaoCompleta: 'Uma experiência de luxo incomparável nas Maldivas, onde cada detalhe foi pensado para proporcionar o máximo em exclusividade e sofisticação. Este não é apenas um destino, é uma jornada transformadora em um dos lugares mais paradisíacos do planeta, com acesso limitado a apenas 8 convidados por temporada.',
      atrações: ['Villa sobre as águas', 'Spa subaquático', 'Jantar com chef Michelin', 'Mergulho com tubarões-baleia', 'Helicóptero privativo', 'Iate exclusivo'],
      imagem: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=60',
      categoria: 'Ultra Luxury',
      melhorEpoca: 'Novembro a Abril',
      clima: 'Tropical equatorial',
      temperatura: '26°C a 30°C',
      preco: 45000,
      avaliacaoMedia: 5.0,
      exclusividade: 'Apenas 8 convidados por temporada',
      incluso: [
        'Villa overwater de 300m² com piscina infinita privativa',
        'Mordomo pessoal 24/7 e chef particular',
        'Transfers em hidroavião e iate de luxo',
        'Mergulho com equipamento profissional e guia especializado',
        'Spa com tratamentos de cristais e pedras preciosas',
        'Experiências gastronômicas com chefs estrelados Michelin',
        'Acesso exclusivo a ilha privativa desabitada',
        'Observação de golfinhos e baleias em iate premium'
      ],
      diferenciais: [
        '🏖️ Praia exclusiva com areia cor-de-rosa importada',
        '🍾 Adega subterrânea com champagnes raros',
        '💎 Joias marinhas personalizadas de cortesia',
        '🚁 Helicóptero para passeios panorâmicos',
        '🌟 Observatório astronômico privativo',
        '🎭 Apresentações culturais maldívias exclusivas'
      ],
      slug: 'maldivas-privativas'
    },
    {
      id: 6,
      nome: 'Paris',
      estado: null,
      regiao: 'Internacional',
      pais: 'França',
      descricao: 'Cidade Luz, capital mundial da moda, arte e gastronomia com monumentos icônicos.',
      descricaoCompleta: 'Paris é muito mais que uma cidade, é um sentimento. A capital francesa combina história milenar, arte incomparável e gastronomia refinada em cada esquina. Dos museus mundialmente famosos aos cafés charmosos, cada momento em Paris é uma descoberta cultural única.',
      atrações: ['Torre Eiffel', 'Museu do Louvre', 'Notre-Dame', 'Champs-Élysées', 'Montmartre', 'Arco do Triunfo'],
      imagem: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?auto=format&fit=crop&w=800&q=60',
      categoria: 'Cidade Cultural',
      melhorEpoca: 'Maio a Setembro',
      clima: 'Temperado oceânico',
      temperatura: '5°C a 25°C',
      preco: 8500,
      avaliacaoMedia: 4.8,
      slug: 'paris'
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

// Rota para página de compra direta do destino
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
      nome: 'Maldivas Privativas',
      estado: null,
      regiao: 'Internacional',
      pais: 'Maldivas',
      descricao: 'Experiência ultra-luxuosa em resort privativo com overwater villas e mordomo pessoal 24h.',
      imagem: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=60',
      categoria: 'Ultra Luxury',
      melhorEpoca: 'Novembro a Abril',
      preco: 45000,
      avaliacaoMedia: 5.0,
      incluso: ['Villa overwater 300m²', 'Mordomo pessoal 24h', 'Chef particular', 'Transfers hidroavião', 'Spa premium'],
      duracao: '7 dias / 6 noites',
      exclusividade: 'Apenas 8 convidados por temporada'
    },
    {
      id: 6,
      nome: 'Paris',
      estado: null,
      regiao: 'Internacional',
      pais: 'França',
      descricao: 'Cidade Luz, capital mundial da moda, arte e gastronomia com monumentos icônicos.',
      imagem: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?auto=format&fit=crop&w=800&q=60',
      categoria: 'Cidade Cultural',
      melhorEpoca: 'Maio a Setembro',
      preco: 8500,
      avaliacaoMedia: 4.8,
      incluso: ['Hospedagem hotel boutique', 'Café da manhã', 'Tour pelos museus', 'Cruzeiro no Sena', 'City tour'],
      duracao: '6 dias / 5 noites',
      slug: 'paris'
    }
  ];
  
  const destino = destinos.find(d => d.slug === slug);
  
  if (!destino) {
    return res.status(404).render('404', {
      title: 'Destino não encontrado',
      message: 'O destino que você está procurando não foi encontrado.'
    });
  }
  
  res.render('destinos/comprar', {
    title: `Comprar ${destino.nome}`,
    description: `Finalize sua reserva para ${destino.nome} preenchendo os dados abaixo.`,
    destino: destino
  });
});

// Rota para processar compra direta do destino
router.post('/:slug/comprar', (req, res) => {
  const { slug } = req.params;
  const { nome, email, telefone, cpf, metodoPagamento, endereco, pessoas } = req.body;
  
  // Buscar destino
  const destinos = [
    { id: 1, nome: 'Rio de Janeiro', preco: 1200, slug: 'rio-de-janeiro' },
    { id: 2, nome: 'Florianópolis', preco: 900, slug: 'florianopolis' },
    { id: 3, nome: 'Porto Seguro', preco: 800, slug: 'porto-seguro' },
    { id: 4, nome: 'Fernando de Noronha', preco: 3500, slug: 'fernando-de-noronha' },
    { id: 5, nome: 'Maldivas Privativas', preco: 45000, slug: 'maldivas-privativas' },
    { id: 6, nome: 'Paris', preco: 8500, slug: 'paris' }
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
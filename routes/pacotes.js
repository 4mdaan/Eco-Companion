const express = require('express');
const router = express.Router();

// Rota para listar todos os pacotes
router.get('/', (req, res) => {
  const { categoria } = req.query;
  
  // Dados simulados de pacotes (em produção, viriam do banco de dados)
  let pacotes = [
    {
      id: 1,
      destino: 'Rio de Janeiro',
      periodo: '17 de Nov - 21 de Nov',
  preco: '870',
  precoOriginal: '1200',
      descricao: 'Conheça as belezas do Rio de Janeiro com este pacote completo incluindo hospedagem, café da manhã e passeios.',
      inclusos: ['Hospedagem por 4 noites', 'Café da manhã', 'City tour', 'Cristo Redentor', 'Pão de Açúcar'],
      imagem: 'https://images.unsplash.com/photo-1505765051205-3c2da8d1d0d6?auto=format&fit=crop&w=800&q=60',
      bgClass: 'bg-rio',
      slug: 'rio-de-janeiro',
      categoria: 'nacional',
      avaliacao: 4.8,
      disponivel: true
    },
    {
      id: 2,
      destino: 'Florianópolis',
      periodo: '03 de Nov - 07 de Nov',
  preco: '841',
  precoOriginal: '1100',
      descricao: 'Descubra as praias paradisíacas de Florianópolis neste pacote especial com as melhores hospedagens.',
      inclusos: ['Hospedagem por 4 noites', 'Café da manhã', 'Passeio de barco', 'Tour pelas praias'],
      imagem: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=60',
      bgClass: 'bg-florianopolis',
      slug: 'florianopolis',
      categoria: 'nacional',
      avaliacao: 4.6,
      disponivel: true
    },
    {
      id: 3,
      destino: 'Porto Seguro',
      periodo: '17 de Dez - 21 de Dez',
      preco: '1.828',
      precoOriginal: '2.200',
      descricao: 'Fim de ano em Porto Seguro com as melhores festas e atrações da Bahia.',
      inclusos: ['Hospedagem por 4 noites', 'All inclusive', 'Festa de réveillon', 'Passeios culturais'],
      imagem: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=801&q=60',
      bgClass: 'bg-porto-seguro',
      slug: 'porto-seguro',
      categoria: 'nacional',
      avaliacao: 4.9,
      disponivel: true
    },
    {
      id: 4,
      destino: 'Paris',
      periodo: '15 de Jan - 22 de Jan',
      preco: '3.850',
      precoOriginal: '4.500',
      descricao: 'Conheça a Cidade Luz neste pacote especial com hospedagem no centro e principais atrações incluídas.',
      inclusos: ['Hospedagem por 7 noites', 'Café da manhã', 'Ingresso Torre Eiffel', 'Museu do Louvre', 'Transfer aeroporto'],
      imagem: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?auto=format&fit=crop&w=800&q=60',
      bgClass: 'bg-paris',
      slug: 'paris',
      categoria: 'internacional',
      avaliacao: 4.7,
      disponivel: true
    },
    {
      id: 5,
      destino: 'Gramado',
      periodo: '10 de Dez - 14 de Dez',
      preco: '1.290',
      descricao: 'Magia do Natal Luz em Gramado com hospedagem aconchegante e roteiro completo pela Serra Gaúcha.',
      inclusos: ['Hospedagem por 4 noites', 'Café da manhã', 'Natal Luz', 'Tour Serra Gaúcha', 'Degustação vinhos'],
      imagem: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=60',
      bgClass: 'bg-gramado',
      slug: 'gramado',
      categoria: 'nacional',
      avaliacao: 4.6,
      disponivel: true
    }
  ];

  // Filtrar pacotes por categoria se especificado
  if (categoria && categoria !== 'todos') {
    if (categoria === 'promocoes') {
      pacotes = pacotes.filter(pacote => pacote.precoOriginal);
    } else {
      pacotes = pacotes.filter(pacote => pacote.categoria === categoria);
    }
  }

  res.render('pacotes/index', {
    title: 'Pacotes de Viagem',
    description: 'Conheça nossos pacotes especiais para os melhores destinos do Brasil e do mundo.',
    pacotes: pacotes,
    categoriaAtiva: categoria || 'todos'
  });
});

// Rota para detalhes de um pacote específico
router.get('/:slug', (req, res) => {
  const { slug } = req.params;
  
  // Simular busca do pacote pelo slug (em produção, seria uma consulta ao banco)
  const pacotes = [
    {
      id: 1,
      destino: 'Rio de Janeiro',
      periodo: '17 de Nov - 21 de Nov',
      preco: '870',
      precoOriginal: '1.200',
      descricao: 'Conheça as belezas do Rio de Janeiro com este pacote completo incluindo hospedagem, café da manhã e passeios.',
      descricaoCompleta: 'Experimente o melhor do Rio de Janeiro com nosso pacote especial. Hospedagem em hotéis selecionados na zona sul, próximo às praias de Copacabana e Ipanema. Inclui visitas aos principais pontos turísticos da cidade maravilhosa.',
      inclusos: ['Hospedagem por 4 noites em hotel 4 estrelas', 'Café da manhã continental', 'City tour pela cidade', 'Ingresso para o Cristo Redentor', 'Passeio ao Pão de Açúcar', 'Transfer aeroporto/hotel/aeroporto'],
      naoInclusos: ['Passagens aéreas', 'Refeições (almoço e jantar)', 'Bebidas', 'Seguro viagem', 'Gastos pessoais'],
      imagens: [
        'https://images.unsplash.com/photo-1505765051205-3c2da8d1d0d6?auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=60'
      ],
      bgClass: 'bg-rio',
      slug: 'rio-de-janeiro',
      categoria: 'nacional',
      avaliacao: 4.8,
      disponivel: true,
      destaque: true
    },
    {
      id: 2,
      destino: 'Florianópolis',
      periodo: '03 de Nov - 07 de Nov',
      preco: '841',
      precoOriginal: '1.100',
      descricao: 'Descubra as praias paradisíacas de Florianópolis neste pacote especial com as melhores hospedagens.',
      descricaoCompleta: 'Florianópolis, a Ilha da Magia, oferece praias paradisíacas, natureza exuberante e uma rica cultura açoriana. Nosso pacote inclui hospedagem em pousadas charmosas e passeios pelas principais praias da ilha.',
      inclusos: ['Hospedagem por 4 noites em pousada 3 estrelas', 'Café da manhã', 'Passeio de barco pelas praias', 'Tour pelas principais praias do norte da ilha', 'Transfer aeroporto/hotel/aeroporto'],
      naoInclusos: ['Passagens aéreas', 'Almoço e jantar', 'Bebidas alcoólicas', 'Atividades opcionais', 'Gastos pessoais'],
      bgClass: 'bg-florianopolis',
      slug: 'florianopolis',
      categoria: 'nacional',
      avaliacao: 4.7,
      disponivel: true
    },
    {
      id: 3,
      destino: 'Porto Seguro',
      periodo: '17 de Dez - 21 de Dez',
      preco: '1.828',
      precoOriginal: '2.200',
      descricao: 'Fim de ano em Porto Seguro com as melhores festas e atrações da Bahia.',
      descricaoCompleta: 'Celebrate o Réveillon em Porto Seguro, berço do Brasil. Este pacote especial inclui hospedagem em resort all-inclusive, festas de fim de ano e passeios pelos marcos históricos da região.',
      inclusos: ['Hospedagem por 4 noites em resort all-inclusive', 'Todas as refeições e bebidas', 'Festa de Réveillon', 'Passeios ao centro histórico', 'Atividades recreativas', 'Transfer aeroporto/hotel/aeroporto'],
      naoInclusos: ['Passagens aéreas', 'Passeios opcionais', 'Spa e massagens', 'Gastos pessoais'],
      bgClass: 'bg-porto-seguro',
      slug: 'porto-seguro',
      categoria: 'nacional',
      avaliacao: 4.9,
      disponivel: true
    },
    {
      id: 4,
      destino: 'Paris',
      periodo: '15 de Jan - 22 de Jan',
      preco: '3.850',
      precoOriginal: '4.500',
      descricao: 'Conheça a Cidade Luz neste pacote especial com hospedagem no centro e principais atrações incluídas.',
      descricaoCompleta: 'Viva a magia de Paris, a Cidade Luz, em um pacote completo que combina história, arte, gastronomia e romance. Hospede-se em hotéis selecionados no coração de Paris, próximo aos principais monumentos. Este pacote exclusivo inclui visitas guiadas aos marcos mais icônicos da capital francesa, degustações gastronômicas e experiências culturais únicas. Perfeito para casais, famílias ou amigos que desejam descobrir todos os encantos parisienses com conforto e sofisticação.',
      inclusos: [
        'Hospedagem por 7 noites em hotel 4 estrelas no centro de Paris',
        'Café da manhã continental francês',
        'Ingresso prioritário para a Torre Eiffel com subida ao topo',
        'Entrada para o Museu do Louvre com audio-guia em português',
        'Cruzeiro romântico pelo Rio Sena com jantar',
        'Tour guiado por Montmartre e Sacré-Cœur',
        'Visita aos Champs-Élysées e Arc de Triomphe',
        'Degustação em bistrô típico parisiense',
        'Transfer aeroporto/hotel/aeroporto',
        'Seguro viagem internacional'
      ],
      naoInclusos: [
        'Passagem aérea internacional',
        'Refeições não especificadas',
        'Bebidas alcoólicas (exceto no jantar do cruzeiro)',
        'Compras pessoais e souvenirs',
        'Gorjetas para guias',
        'Atividades opcionais não mencionadas'
      ],
      imagens: [
        '/imagens/paris.png',
        'https://images.unsplash.com/photo-1502602898536-47ad22581b52?auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1431274172761-fca41d930114?auto=format&fit=crop&w=800&q=60'
      ],
      bgClass: 'bg-paris',
      slug: 'paris',
      categoria: 'internacional',
      avaliacao: 4.9,
      disponivel: true,
      destaque: true,
      diferenciais: [
        '🗼 Acesso prioritário aos principais monumentos',
        '🎨 Tours com guias especializados em arte e história',
        '🍷 Experiências gastronômicas autênticas',
        '🛳️ Cruzeiro romântico pelo Sena incluído',
        '🏛️ Hotéis no coração histórico de Paris',
        '🚇 Passe de metrô incluso para toda a estadia'
      ]
    },
    {
      id: 5,
      destino: 'Gramado',
      periodo: '10 de Dez - 14 de Dez',
      preco: '1.290',
      precoOriginal: '1.600',
      descricao: 'Magia do Natal Luz em Gramado com hospedagem aconchegante e roteiro completo pela Serra Gaúcha.',
      descricaoCompleta: 'Experimente a magia do Natal em Gramado, a cidade mais charmosa da Serra Gaúcha. Este pacote especial coincide com o famoso Natal Luz, oferecendo uma experiência única de inverno brasileiro com arquitetura alemã, gastronomia refinada e paisagens de montanha deslumbrantes. Inclui hospedagem em hotéis boutique, roteiros pelos pontos turísticos mais icônicos e experiências gastronômicas que fazem de Gramado um destino inesquecível para toda a família.',
      inclusos: [
        'Hospedagem por 4 noites em hotel boutique temático',
        'Café da manhã serrano completo',
        'Ingresso para o espetáculo do Natal Luz',
        'Visita ao Mini Mundo com entrada incluída',
        'Passeio ao Lago Negro com pedalinho',
        'Tour pela Rua Coberta e centro de Gramado',
        'Excursão à Cascata do Caracol em Canela',
        'Visita ao Snowland com atividades na neve',
        'Degustação em chocolateria artesanal Gramado',
        'Tour por vinícola da Serra Gaúcha com degustação',
        'Transfer rodoviário de Porto Alegre',
        'Seguro viagem nacional'
      ],
      naoInclusos: [
        'Passagem aérea até Porto Alegre',
        'Almoços e jantares (exceto café da manhã)',
        'Bebidas alcoólicas nas refeições',
        'Atividades opcionais no Snowland',
        'Compras em chocolaterias e lojas',
        'Gorjetas para guias e motoristas'
      ],
      imagens: [
        '/imagens/gramado.png',
        'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=60'
      ],
      bgClass: 'bg-gramado',
      slug: 'gramado',
      categoria: 'nacional',
      avaliacao: 4.8,
      disponivel: true,
      destaque: true,
      diferenciais: [
        '🎄 Experiência completa do Natal Luz',
        '🍫 Degustações em chocolaterias renomadas',
        '🏔️ Paisagens de montanha da Serra Gaúcha',
        '🎬 Visita aos cenários do Festival de Cinema',
        '🍷 Tour exclusivo por vinícolas premiadas',
        '❄️ Diversão na neve no Snowland'
      ]
    }
  ];
  
  const pacote = pacotes.find(p => p.slug === slug);
  
  if (!pacote) {
    return res.status(404).render('404', {
      title: 'Pacote não encontrado',
      message: 'O pacote que você está procurando não foi encontrado.'
    });
  }
  
  res.render('pacotes/detalhes', {
    title: `Pacote ${pacote.destino}`,
    description: pacote.descricao,
    pacote: pacote
  });
});

module.exports = router;
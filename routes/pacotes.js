const express = require('express');
const router = express.Router();
const { validateFiltrosPacotes, validateDetalhePacote, handleValidationErrors } = require('../config/validators');
const { securityLogger, apiRateLimiter } = require('../config/security-middleware');

// Rota para listar todos os pacotes
router.get('/', securityLogger, apiRateLimiter, validateFiltrosPacotes, handleValidationErrors, (req, res) => {
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
    },
    {
      id: 6,
      destino: 'Fernando de Noronha',
      periodo: '10 de Jan - 15 de Jan',
      preco: '2.450',
      precoOriginal: '2.850',
      descricao: 'Paraíso ecológico com mergulhos inesquecíveis e paisagens únicas no arquipélago mais bonito do Brasil.',
      inclusos: ['Hospedagem por 5 noites', 'Café da manhã', 'Mergulho incluído', 'Passeio de barco', 'Guia marinho'],
      imagem: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=60',
      bgClass: 'bg-fernando-noronha',
      slug: 'fernando-noronha',
      categoria: 'nacional',
      avaliacao: 4.9,
      disponivel: true
    },
    {
      id: 7,
      destino: 'Natal',
      periodo: '15 de Mar - 20 de Mar',
      preco: '1.380',
      precoOriginal: '1.650',
      descricao: 'Explore as dunas de Genipabu e as belas praias do Rio Grande do Norte neste pacote aventura.',
      inclusos: ['Hospedagem por 5 noites', 'Café da manhã', 'Passeio de buggy', 'Dunas de Genipabu', 'Transfer aeroporto'],
      imagem: 'https://www.brasil-turismo.com/rio-grande-norte/imagens/natal-rn.jpg',
      bgClass: 'bg-natal',
      slug: 'natal',
      categoria: 'nacional',
      avaliacao: 4.7,
      disponivel: true
    },
    {
      id: 8,
      destino: 'Maceió',
      periodo: '08 de Abr - 13 de Abr',
      preco: '1.295',
      precoOriginal: '1.580',
      descricao: 'Relaxe nas piscinas naturais de Maragogi e curta as praias paradisíacas de Alagoas.',
      inclusos: ['Hospedagem por 5 noites', 'Café da manhã', 'Passeio de jangada', 'Piscinas naturais', 'Praia de Pajuçara'],
      imagem: 'https://www.cvc.com.br/dicas-de-viagem/wp-content/uploads/2021/11/Maceio-vista-aerea.jpg',
      bgClass: 'bg-maceio',
      slug: 'maceio',
      categoria: 'nacional',
      avaliacao: 4.8,
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
router.get('/:slug', securityLogger, apiRateLimiter, validateDetalhePacote, handleValidationErrors, (req, res) => {
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
    },
    {
      id: 6,
      destino: 'Fernando de Noronha',
      periodo: '10 de Jan - 15 de Jan',
      preco: '2.450',
      precoOriginal: '2.850',
      descricao: 'Paraíso ecológico com mergulhos inesquecíveis e paisagens únicas no arquipélago mais bonito do Brasil.',
      descricaoCompleta: 'Fernando de Noronha é um dos destinos mais exclusivos e preservados do Brasil. Este arquipélago paradisíaco oferece uma experiência única com suas águas cristalinas, vida marinha exuberante e paisagens de tirar o fôlego. Perfeito para quem busca contato com a natureza, mergulhos inesquecíveis e momentos de pura contemplação em um dos poucos santuários ecológicos do mundo.',
      inclusos: [
        'Hospedagem por 5 noites em pousada ecológica',
        'Café da manhã orgânico completo',
        'Mergulho com cilindro e equipamentos incluídos',
        'Passeio de barco pelas principais praias',
        'Trilha do Piquinho com guia especializado',
        'Visita ao Projeto Tamar',
        'Taxa de preservação ambiental incluída',
        'Guia marinho especializado',
        'Transfer aeroporto/pousada/aeroporto',
        'Seguro viagem e mergulho'
      ],
      naoInclusos: [
        'Passagem aérea (consulte valores especiais)',
        'Almoços e jantares',
        'Bebidas alcoólicas',
        'Mergulhos extras ou cursos de certificação',
        'Passeios opcionais não mencionados',
        'Gastos pessoais e lembranças'
      ],
      imagens: [
        '/imagens/fernandodenoronha.png',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=60'
      ],
      bgClass: 'bg-fernando-noronha',
      slug: 'fernando-noronha',
      categoria: 'nacional',
      avaliacao: 4.9,
      disponivel: true,
      destaque: true,
      diferenciais: [
        '🐢 Santuário ecológico preservado',
        '🏊 Mergulhos em águas cristalinas',
        '🐠 Rica vida marinha tropical',
        '🏝️ Praias paradisíacas exclusivas',
        '📸 Paisagens únicas no mundo',
        '🌅 Pôr do sol mais bonito do Brasil'
      ]
    },
    {
      id: 7,
      destino: 'Natal',
      periodo: '15 de Mar - 20 de Mar',
      preco: '1.380',
      precoOriginal: '1.650',
      descricao: 'Explore as dunas de Genipabu e as belas praias do Rio Grande do Norte neste pacote aventura.',
      descricaoCompleta: 'Descubra Natal, a cidade do sol, onde as dunas encontram o mar e a aventura é constante. Este pacote especial oferece uma experiência completa pelo Rio Grande do Norte, incluindo os famosos passeios de buggy pelas dunas de Genipabu, banhos de mar nas praias urbanas e a rica cultura potiguar. Ideal para quem busca diversão, aventura e paisagens naturais únicas do Nordeste brasileiro.',
      inclusos: [
        'Hospedagem por 5 noites em hotel 4 estrelas na Ponta Negra',
        'Café da manhã regional completo',
        'Passeio de buggy pelas dunas de Genipabu',
        'Visita à Lagoa de Pitangui com opção de esquibunda',
        'City tour histórico pelo centro de Natal',
        'Passeio à praia de Pipa com tempo livre',
        'Visita ao Cajueiro de Pirangi',
        'Transfer aeroporto/hotel/aeroporto',
        'Seguro viagem nacional'
      ],
      naoInclusos: [
        'Passagens aéreas',
        'Almoços e jantares',
        'Bebidas durante os passeios',
        'Atividades opcionais como voo de parapente',
        'Gastos pessoais e compras',
        'Gorjetas'
      ],
      imagens: [
        'https://www.brasil-turismo.com/rio-grande-norte/imagens/natal-rn.jpg',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=60'
      ],
      bgClass: 'bg-natal',
      slug: 'natal',
      categoria: 'nacional',
      avaliacao: 4.7,
      disponivel: true,
      diferenciais: [
        '🏜️ Aventura pelas dunas de Genipabu',
        '🏖️ Praias paradisíacas de Pipa',
        '🌳 Maior cajueiro do mundo',
        '🚗 Passeios de buggy emocionantes',
        '🏛️ Rica história colonial potiguar',
        '☀️ Clima tropical o ano todo'
      ]
    },
    {
      id: 8,
      destino: 'Maceió',
      periodo: '08 de Abr - 13 de Abr',
      preco: '1.295',
      precoOriginal: '1.580',
      descricao: 'Relaxe nas piscinas naturais de Maragogi e curta as praias paradisíacas de Alagoas.',
      descricaoCompleta: 'Experimente o paraíso tropical de Maceió, capital de Alagoas, famosa por suas águas cristalinas e piscinas naturais. Este pacote completo inclui os melhores passeios pela costa alagoana, desde as praias urbanas até os recifes de coral de Maragogi. Uma experiência perfeita para quem busca relaxamento, belezas naturais e a hospitalidade única do povo alagoano.',
      inclusos: [
        'Hospedagem por 5 noites em resort na Pajuçara',
        'Café da manhã tropical completo',
        'Passeio de jangada às piscinas naturais',
        'Excursão a Maragogi com day use',
        'City tour por Maceió e praias urbanas',
        'Visita à praia de Paripueira',
        'Passeio ao Saco da Pedra',
        'Transfer aeroporto/hotel/aeroporto',
        'Seguro viagem nacional'
      ],
      naoInclusos: [
        'Passagens aéreas',
        'Almoços e jantares',
        'Bebidas alcoólicas',
        'Equipamentos de mergulho',
        'Passeios opcionais',
        'Gastos pessoais'
      ],
      imagens: [
        'https://www.cvc.com.br/dicas-de-viagem/wp-content/uploads/2021/11/Maceio-vista-aerea.jpg',
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=60'
      ],
      bgClass: 'bg-maceio',
      slug: 'maceio',
      categoria: 'nacional',
      avaliacao: 4.8,
      disponivel: true,
      diferenciais: [
        '🏊 Piscinas naturais cristalinas',
        '🐠 Rica vida marinha nos recifes',
        '🏖️ Praias de águas mornas',
        '🛶 Passeios tradicionais de jangada',
        '🥥 Gastronomia tropical típica',
        '🌺 Hospitalidade alagoana autêntica'
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
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
      imagem: 'https://images.unsplash.com/photo-1505765051205-3c2da8d1d0d6?auto=format&fit=crop&w=800&q=60',
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
      imagem: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=60',
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
      imagem: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=60',
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
      imagem: 'https://images.unsplash.com/photo-1544948503-7ad535700ccd?auto=format&fit=crop&w=800&q=60',
      categoria: 'Ecoturismo',
      melhorEpoca: 'Agosto a Dezembro',
      slug: 'fernando-de-noronha'
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
  
  // Simular busca do destino pelo slug
  const destinos = [
    {
      id: 1,
      nome: 'Rio de Janeiro',
      estado: 'Rio de Janeiro',
      regiao: 'Sudeste',
      descricao: 'Cidade maravilhosa com praias deslumbrantes e pontos turísticos icônicos.',
      descricaoCompleta: 'O Rio de Janeiro é uma das cidades mais famosas do mundo, conhecida por suas praias icônicas, monumentos históricos e cultura vibrante. A cidade oferece uma combinação única de natureza exuberante e vida urbana cosmopolita.',
      atrações: ['Cristo Redentor', 'Pão de Açúcar', 'Copacabana', 'Ipanema', 'Santa Teresa', 'Lapa', 'Maracanã'],
      imagens: [
        'https://images.unsplash.com/photo-1505765051205-3c2da8d1d0d6?auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=60'
      ],
      categoria: 'Praia e Cultura',
      melhorEpoca: 'Março a Maio, Setembro a Novembro',
      clima: 'Tropical',
      temperatura: '20°C a 30°C',
      slug: 'rio-de-janeiro',
      pacotesDisponiveis: 3,
      avaliacaoMedia: 4.8
    }
    // Adicionar outros destinos aqui...
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

module.exports = router;
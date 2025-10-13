const express = require('express');
const router = express.Router();

// Simulação de sessão de carrinho (em produção, usar sessões reais ou banco de dados)
let carrinho = [];

// Função para encontrar pacote por slug
function encontrarPacote(slug) {
  const pacotes = [
    {
      id: 1,
      destino: 'Rio de Janeiro',
      periodo: '17 de Nov - 21 de Nov',
      preco: '870',
      precoOriginal: '1200',
      descricao: 'Conheça as belezas do Rio de Janeiro com este pacote completo incluindo hospedagem, café da manhã e passeios.',
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
      preco: '1828',
      precoOriginal: '2200',
      descricao: 'Fim de ano em Porto Seguro com as melhores festas e atrações da Bahia.',
      bgClass: 'bg-porto-seguro',
      slug: 'porto-seguro',
      categoria: 'nacional',
      avaliacao: 4.9,
      disponivel: true
    }
  ];
  
  return pacotes.find(p => p.slug === slug);
}

// Rota para visualizar o carrinho
router.get('/', (req, res) => {
  // Calcular totais
  let subtotal = 0;
  let descontoTotal = 0;
  
  carrinho.forEach(item => {
    const precoNum = parseFloat(item.preco.replace(/\./g, '').replace(',', '.'));
    const precoOriginalNum = item.precoOriginal ? parseFloat(item.precoOriginal.replace(/\./g, '').replace(',', '.')) : precoNum;
    
    subtotal += precoOriginalNum * item.quantidade;
    descontoTotal += (precoOriginalNum - precoNum) * item.quantidade;
  });
  
  const total = subtotal - descontoTotal;
  
  res.render('carrinho/index', {
    title: 'Carrinho de Compras',
    description: 'Revise seus pacotes selecionados e finalize sua compra.',
    carrinho: carrinho,
    totais: {
      subtotal: subtotal,
      desconto: descontoTotal,
      total: total,
      quantidade: carrinho.reduce((acc, item) => acc + item.quantidade, 0)
    }
  });
});

// Rota para adicionar item ao carrinho
router.post('/adicionar', (req, res) => {
  const { slug, quantidade = 1 } = req.body;
  const pacote = encontrarPacote(slug);
  
  if (!pacote) {
    return res.status(404).json({ 
      success: false, 
      message: 'Pacote não encontrado' 
    });
  }
  
  // Verificar se o item já está no carrinho
  const itemExistente = carrinho.find(item => item.slug === slug);
  
  if (itemExistente) {
    itemExistente.quantidade += parseInt(quantidade);
  } else {
    carrinho.push({
      ...pacote,
      quantidade: parseInt(quantidade),
      dataAdicao: new Date()
    });
  }
  
  res.json({ 
    success: true, 
    message: `${pacote.destino} adicionado ao carrinho!`,
    quantidadeCarrinho: carrinho.reduce((acc, item) => acc + item.quantidade, 0)
  });
});

// Rota para remover item do carrinho
router.post('/remover', (req, res) => {
  const { slug } = req.body;
  
  carrinho = carrinho.filter(item => item.slug !== slug);
  
  res.json({ 
    success: true, 
    message: 'Item removido do carrinho',
    quantidadeCarrinho: carrinho.reduce((acc, item) => acc + item.quantidade, 0)
  });
});

// Rota para atualizar quantidade
router.post('/atualizar', (req, res) => {
  const { slug, quantidade } = req.body;
  const item = carrinho.find(item => item.slug === slug);
  
  if (item) {
    if (parseInt(quantidade) <= 0) {
      carrinho = carrinho.filter(item => item.slug !== slug);
    } else {
      item.quantidade = parseInt(quantidade);
    }
  }
  
  res.json({ 
    success: true,
    quantidadeCarrinho: carrinho.reduce((acc, item) => acc + item.quantidade, 0)
  });
});

// Rota para checkout
router.get('/checkout', (req, res) => {
  if (carrinho.length === 0) {
    return res.redirect('/carrinho?vazio=true');
  }
  
  // Calcular totais
  let subtotal = 0;
  let descontoTotal = 0;
  
  carrinho.forEach(item => {
    const precoNum = parseFloat(item.preco.replace(/\./g, '').replace(',', '.'));
    const precoOriginalNum = item.precoOriginal ? parseFloat(item.precoOriginal.replace(/\./g, '').replace(',', '.')) : precoNum;
    
    subtotal += precoOriginalNum * item.quantidade;
    descontoTotal += (precoOriginalNum - precoNum) * item.quantidade;
  });
  
  const total = subtotal - descontoTotal;
  
  res.render('carrinho/checkout', {
    title: 'Finalizar Compra',
    description: 'Complete seus dados para finalizar a reserva dos pacotes.',
    carrinho: carrinho,
    totais: {
      subtotal: subtotal,
      desconto: descontoTotal,
      total: total,
      quantidade: carrinho.reduce((acc, item) => acc + item.quantidade, 0)
    }
  });
});

// Rota para processar checkout
router.post('/checkout', (req, res) => {
  const { nome, email, telefone, cpf, metodoPagamento, endereco } = req.body;
  
  // Aqui você processaria o pagamento e salvaria no banco de dados
  // Por enquanto, vamos simular sucesso
  
  const numeroReserva = 'RES' + Date.now();
  
  // Limpar carrinho após compra
  const itensPedido = [...carrinho];
  carrinho = [];
  
  res.render('carrinho/sucesso', {
    title: 'Compra Realizada com Sucesso!',
    description: 'Sua reserva foi confirmada. Você receberá os detalhes por email.',
    numeroReserva: numeroReserva,
    itens: itensPedido,
    dadosCliente: { nome, email, telefone }
  });
});

// API para obter quantidade do carrinho (para header)
router.get('/api/quantidade', (req, res) => {
  const quantidade = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
  res.json({ quantidade });
});

module.exports = router;
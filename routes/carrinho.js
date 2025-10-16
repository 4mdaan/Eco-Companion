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
  
  // Validar se há itens no carrinho
  if (carrinho.length === 0) {
    return res.redirect('/carrinho?erro=carrinho-vazio');
  }
  
  // Validar dados obrigatórios
  if (!nome || !email || !telefone) {
    return res.redirect('/carrinho/checkout?erro=dados-incompletos');
  }
  
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

// API para sincronizar carrinho do frontend
router.post('/sincronizar', (req, res) => {
  const { itens } = req.body;
  
  console.log('Recebendo itens para sincronização:', itens);
  
  if (Array.isArray(itens)) {
    // Converter itens do frontend para formato do backend
    carrinho = itens.map(item => {
      const pacote = encontrarPacote(item.slug || item.id);
      if (pacote) {
        console.log('Pacote encontrado:', pacote);
        return {
          ...pacote,
          quantidade: item.quantidade || 1,
          dataAdicao: new Date()
        };
      }
      
      // Se não encontrou o pacote, criar com base nos dados do frontend
      const precoFormatado = formatarPreco(item.preco);
      const precoOriginalFormatado = formatarPreco(item.precoOriginal || item.preco);
      
      console.log('Criando pacote personalizado:', {
        nome: item.nome,
        preco: precoFormatado,
        precoOriginal: precoOriginalFormatado
      });
      
      return {
        id: item.id,
        destino: item.nome || item.destino || 'Destino',
        slug: item.slug || item.id || String(item.id),
        preco: precoFormatado,
        precoOriginal: precoOriginalFormatado,
        quantidade: item.quantidade || 1,
        periodo: item.periodo || 'Data a definir',
        bgClass: item.bgClass || 'bg-default',
        categoria: item.categoria || 'nacional',
        avaliacao: item.avaliacao || 4.5,
        disponivel: true,
        descricao: item.descricao || 'Pacote personalizado',
        dataAdicao: new Date()
      };
    });
    
    console.log('Carrinho sincronizado:', carrinho);
  }
  
  res.json({ 
    success: true, 
    message: 'Carrinho sincronizado com sucesso!',
    quantidadeCarrinho: carrinho.reduce((acc, item) => acc + item.quantidade, 0),
    itensCarrinho: carrinho.length
  });
});

// Função auxiliar para formatar preço
function formatarPreco(preco) {
  if (!preco) return '0';
  
  // Se for número, converter para string formatada
  if (typeof preco === 'number') {
    return preco.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  
  // Se for string, garantir formatação adequada
  if (typeof preco === 'string') {
    // Remover caracteres não numéricos exceto vírgula e ponto
    const numerico = preco.replace(/[^\d.,]/g, '');
    
    // Se contém vírgula, assumir formato brasileiro (1.234,56)
    if (numerico.includes(',')) {
      const partes = numerico.split(',');
      const inteiro = partes[0].replace(/\./g, '');
      return inteiro;
    }
    
    // Se contém apenas ponto, pode ser separador de milhares ou decimal
    if (numerico.includes('.')) {
      const partes = numerico.split('.');
      if (partes[partes.length - 1].length <= 2) {
        // Último é decimal
        const decimal = partes.pop();
        const inteiro = partes.join('');
        return inteiro;
      } else {
        // São separadores de milhares
        return numerico.replace(/\./g, '');
      }
    }
    
    return numerico;
  }
  
  return '0';
}

// API para obter quantidade do carrinho (para header)
router.get('/api/quantidade', (req, res) => {
  const quantidade = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
  res.json({ quantidade });
});

module.exports = router;
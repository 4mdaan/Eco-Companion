const express = require('express');
const router = express.Router();

// Simulação de dados do usuário e cashback (em produção, usar banco de dados)
let dadosUsuario = {
    id: 1,
    nome: 'Usuário Eco',
    email: 'usuario@ecocompanion.com',
    pontosTotal: 2850,
    pontosPendentes: 420,
    nivelCashback: 'Gold',
    porcentagemCashback: 8,
    proximoNivel: 'Platinum',
    pontosProximoNivel: 5000
};

let historicoTransacoes = [
    {
        id: 1,
        tipo: 'compra',
        descricao: 'Pacote Rio de Janeiro',
        valor: 870,
        pontos: 70,
        data: new Date('2024-10-10'),
        status: 'confirmado'
    },
    {
        id: 2,
        tipo: 'compra', 
        descricao: 'Pacote Florianópolis',
        valor: 841,
        pontos: 67,
        data: new Date('2024-10-05'),
        status: 'confirmado'
    },
    {
        id: 3,
        tipo: 'resgate',
        descricao: 'Desconto em próxima viagem',
        valor: 50,
        pontos: -500,
        data: new Date('2024-09-28'),
        status: 'usado'
    },
    {
        id: 4,
        tipo: 'bonus',
        descricao: 'Bônus de cadastro',
        valor: 0,
        pontos: 100,
        data: new Date('2024-09-15'),
        status: 'confirmado'
    },
    {
        id: 5,
        tipo: 'compra',
        descricao: 'Pacote Porto Seguro',
        valor: 1828,
        pontos: 146,
        data: new Date('2024-09-20'),
        status: 'confirmado'
    }
];

let recompensas = [
    {
        id: 1,
        titulo: 'R$ 50 de desconto',
        descricao: 'Desconto de R$ 50 em qualquer pacote de viagem',
        pontosNecessarios: 500,
        categoria: 'desconto',
        icon: '💰',
        disponivel: true,
        validade: '31/12/2024'
    },
    {
        id: 2,
        titulo: 'R$ 100 de desconto',
        descricao: 'Desconto de R$ 100 em pacotes acima de R$ 1000',
        pontosNecessarios: 1000,
        categoria: 'desconto',
        icon: '💳',
        disponivel: true,
        validade: '31/12/2024'
    },
    {
        id: 3,
        titulo: 'Upgrade de hospedagem',
        descricao: 'Upgrade gratuito para categoria superior',
        pontosNecessarios: 800,
        categoria: 'upgrade',
        icon: '⭐',
        disponivel: true,
        validade: '31/03/2025'
    },
    {
        id: 4,
        titulo: 'Seguro viagem grátis',
        descricao: 'Seguro viagem gratuito para próxima reserva',
        pontosNecessarios: 600,
        categoria: 'servico',
        icon: '🛡️',
        disponivel: true,
        validade: '28/02/2025'
    },
    {
        id: 5,
        titulo: 'R$ 200 de desconto',
        descricao: 'Desconto de R$ 200 em pacotes acima de R$ 2000',
        pontosNecessarios: 2000,
        categoria: 'desconto',
        icon: '🎯',
        disponivel: true,
        validade: '31/12/2024'
    },
    {
        id: 6,
        titulo: 'Viagem grátis para acompanhante',
        descricao: 'Segunda pessoa viaja grátis em pacote nacional',
        pontosNecessarios: 3000,
        categoria: 'premium',
        icon: '🎁',
        disponivel: false,
        validade: '30/06/2025'
    }
];

// Rota principal do dashboard de cashback
router.get('/', (req, res) => {
    // Calcular estatísticas
    const totalGasto = historicoTransacoes
        .filter(t => t.tipo === 'compra' && t.status === 'confirmado')
        .reduce((acc, t) => acc + t.valor, 0);
    
    const pontosGanhos = historicoTransacoes
        .filter(t => t.pontos > 0)
        .reduce((acc, t) => acc + t.pontos, 0);
    
    const pontosUsados = Math.abs(historicoTransacoes
        .filter(t => t.pontos < 0)
        .reduce((acc, t) => acc + t.pontos, 0));
    
    // Próximas recompensas disponíveis
    const proximasRecompensas = recompensas
        .filter(r => r.disponivel && r.pontosNecessarios <= dadosUsuario.pontosTotal + 500)
        .sort((a, b) => a.pontosNecessarios - b.pontosNecessarios)
        .slice(0, 3);

    res.render('cashback/index', {
        title: 'Programa de Cashback Eco',
        description: 'Ganhe pontos a cada compra e troque por descontos e vantagens exclusivas.',
        usuario: dadosUsuario,
        estatisticas: {
            totalGasto,
            pontosGanhos,
            pontosUsados,
            proximasRecompensas
        },
        historicoRecente: historicoTransacoes.slice(0, 5),
        recompensasDestaque: proximasRecompensas
    });
});

// Rota para ver todas as recompensas
router.get('/recompensas', (req, res) => {
    const categoria = req.query.categoria || 'todas';
    
    let recompensasFiltradas = recompensas;
    if (categoria !== 'todas') {
        recompensasFiltradas = recompensas.filter(r => r.categoria === categoria);
    }
    
    // Separar por disponibilidade
    const disponiveis = recompensasFiltradas.filter(r => 
        r.disponivel && r.pontosNecessarios <= dadosUsuario.pontosTotal
    );
    const proximasDesbloqueios = recompensasFiltradas.filter(r => 
        r.disponivel && r.pontosNecessarios > dadosUsuario.pontosTotal
    );
    const indisponiveis = recompensasFiltradas.filter(r => !r.disponivel);

    res.render('cashback/recompensas', {
        title: 'Recompensas Disponíveis',
        description: 'Troque seus pontos por descontos e vantagens exclusivas.',
        usuario: dadosUsuario,
        categoriaAtual: categoria,
        recompensas: {
            disponiveis,
            proximasDesbloqueios,
            indisponiveis
        }
    });
});

// Rota para resgatar recompensa
router.post('/resgatar/:id', (req, res) => {
    const recompensaId = parseInt(req.params.id);
    const recompensa = recompensas.find(r => r.id === recompensaId);
    
    if (!recompensa) {
        return res.status(404).json({ 
            success: false, 
            message: 'Recompensa não encontrada' 
        });
    }
    
    if (!recompensa.disponivel) {
        return res.status(400).json({ 
            success: false, 
            message: 'Recompensa não disponível' 
        });
    }
    
    if (dadosUsuario.pontosTotal < recompensa.pontosNecessarios) {
        return res.status(400).json({ 
            success: false, 
            message: 'Pontos insuficientes' 
        });
    }
    
    // Processar resgate
    dadosUsuario.pontosTotal -= recompensa.pontosNecessarios;
    
    // Adicionar ao histórico
    historicoTransacoes.unshift({
        id: Date.now(),
        tipo: 'resgate',
        descricao: recompensa.titulo,
        valor: 0,
        pontos: -recompensa.pontosNecessarios,
        data: new Date(),
        status: 'usado'
    });
    
    res.json({
        success: true,
        message: `${recompensa.titulo} resgatado com sucesso!`,
        pontosRestantes: dadosUsuario.pontosTotal,
        codigoResgate: 'ECO' + Date.now().toString().slice(-6)
    });
});

// Rota para histórico completo
router.get('/historico', (req, res) => {
    const tipo = req.query.tipo || 'todos';
    const periodo = req.query.periodo || '3meses';
    
    let historicoFiltrado = [...historicoTransacoes];
    
    // Filtrar por tipo
    if (tipo !== 'todos') {
        historicoFiltrado = historicoFiltrado.filter(t => t.tipo === tipo);
    }
    
    // Filtrar por período
    const agora = new Date();
    let dataInicio = new Date();
    
    switch (periodo) {
        case '1mes':
            dataInicio.setMonth(agora.getMonth() - 1);
            break;
        case '3meses':
            dataInicio.setMonth(agora.getMonth() - 3);
            break;
        case '6meses':
            dataInicio.setMonth(agora.getMonth() - 6);
            break;
        case '1ano':
            dataInicio.setFullYear(agora.getFullYear() - 1);
            break;
    }
    
    historicoFiltrado = historicoFiltrado.filter(t => t.data >= dataInicio);
    
    // Calcular totais do período
    const totaisPeriodo = {
        pontosGanhos: historicoFiltrado.filter(t => t.pontos > 0).reduce((acc, t) => acc + t.pontos, 0),
        pontosUsados: Math.abs(historicoFiltrado.filter(t => t.pontos < 0).reduce((acc, t) => acc + t.pontos, 0)),
        totalGasto: historicoFiltrado.filter(t => t.tipo === 'compra').reduce((acc, t) => acc + t.valor, 0)
    };

    res.render('cashback/historico', {
        title: 'Histórico de Cashback',
        description: 'Acompanhe todas suas transações e pontos ganhos.',
        usuario: dadosUsuario,
        historico: historicoFiltrado,
        filtros: { tipo, periodo },
        totais: totaisPeriodo
    });
});

// API para obter pontos do usuário (usado em outras páginas)
router.get('/api/pontos', (req, res) => {
    res.json({
        pontosTotal: dadosUsuario.pontosTotal,
        pontosPendentes: dadosUsuario.pontosPendentes,
        nivel: dadosUsuario.nivelCashback,
        porcentagem: dadosUsuario.porcentagemCashback
    });
});

// Função para adicionar pontos (chamada quando uma compra é feita)
function adicionarPontosPorCompra(valorCompra, descricao = 'Compra realizada') {
    const pontosGanhos = Math.floor(valorCompra * (dadosUsuario.porcentagemCashback / 100));
    
    dadosUsuario.pontosTotal += pontosGanhos;
    dadosUsuario.pontosPendentes -= pontosGanhos; // Remove dos pendentes se havia
    
    // Verificar upgrade de nível
    verificarUpgradeNivel();
    
    // Adicionar ao histórico
    historicoTransacoes.unshift({
        id: Date.now(),
        tipo: 'compra',
        descricao: descricao,
        valor: valorCompra,
        pontos: pontosGanhos,
        data: new Date(),
        status: 'confirmado'
    });
    
    return pontosGanhos;
}

// Verificar se o usuário subiu de nível
function verificarUpgradeNivel() {
    const niveis = [
        { nome: 'Bronze', minPontos: 0, cashback: 3 },
        { nome: 'Silver', minPontos: 1000, cashback: 5 },
        { nome: 'Gold', minPontos: 2500, cashback: 8 },
        { nome: 'Platinum', minPontos: 5000, cashback: 12 },
        { nome: 'Diamond', minPontos: 10000, cashback: 15 }
    ];
    
    const nivelAtual = niveis.find(n => 
        dadosUsuario.pontosTotal >= n.minPontos && 
        (niveis[niveis.indexOf(n) + 1] ? dadosUsuario.pontosTotal < niveis[niveis.indexOf(n) + 1].minPontos : true)
    );
    
    if (nivelAtual && nivelAtual.nome !== dadosUsuario.nivelCashback) {
        dadosUsuario.nivelCashback = nivelAtual.nome;
        dadosUsuario.porcentagemCashback = nivelAtual.cashback;
        
        // Definir próximo nível
        const proximoNivel = niveis[niveis.indexOf(nivelAtual) + 1];
        if (proximoNivel) {
            dadosUsuario.proximoNivel = proximoNivel.nome;
            dadosUsuario.pontosProximoNivel = proximoNivel.minPontos;
        }
    }
}

// Exportar funções para usar em outras rotas
router.adicionarPontosPorCompra = adicionarPontosPorCompra;
router.dadosUsuario = dadosUsuario;

module.exports = router;
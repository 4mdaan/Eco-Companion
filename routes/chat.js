const express = require('express');
const router = express.Router();

// Armazenamento temporário das conversas (em produção seria um banco de dados)
let conversas = {};
let mensagensHistorico = {};

// Base de conhecimento do bot
const baseConhecimento = {
    saudacao: ['oi', 'olá', 'hello', 'bom dia', 'boa tarde', 'boa noite', 'hey'],
    despedida: ['tchau', 'bye', 'até logo', 'obrigado', 'obrigada', 'valeu'],
    destinos: {
        keywords: ['destino', 'viagem', 'onde', 'país', 'cidade', 'lugar'],
        response: 'Temos destinos incríveis! Alguns dos mais procurados são:\n• Europa: França, Itália, Espanha\n• América: Estados Unidos, Argentina, Peru\n• Ásia: Japão, Tailândia, Singapura\n\nQual região te interessa mais?'
    },
    pacotes: {
        keywords: ['pacote', 'preço', 'valor', 'quanto custa', 'orçamento'],
        response: 'Nossos pacotes são personalizados! Os preços variam de acordo com:\n• Destino escolhido\n• Duração da viagem\n• Tipo de hospedagem\n• Época do ano\n\nGostaria de fazer uma cotação personalizada?'
    },
    documentos: {
        keywords: ['documento', 'passaporte', 'visto', 'identidade', 'rg'],
        response: 'Para viagens internacionais você precisa:\n• Passaporte válido (6 meses de validade)\n• Visto (dependendo do destino)\n• Certificado de vacinação (alguns países)\n\nPara viagens nacionais: RG ou CNH bastam!'
    },
    pagamento: {
        keywords: ['pagamento', 'parcelamento', 'cartão', 'pix', 'boleto'],
        response: 'Oferecemos várias formas de pagamento:\n• PIX (5% de desconto)\n• Cartão de crédito (até 12x sem juros)\n• Boleto bancário\n• Transferência bancária\n\nTambém temos planos de parcelamento especiais!'
    },
    seguro: {
        keywords: ['seguro', 'assistência', 'emergência', 'médico'],
        response: 'O seguro viagem é essencial! Cobrimos:\n• Assistência médica 24h\n• Cancelamento de viagem\n• Bagagem extraviada\n• Morte acidental\n\nTodos os nossos pacotes incluem seguro!'
    },
    covid: {
        keywords: ['covid', 'coronavirus', 'pandemia', 'vacina', 'teste'],
        response: 'Para viagens durante a pandemia:\n• Verifique as restrições do destino\n• Comprovante de vacinação pode ser necessário\n• Teste PCR/Antígeno em alguns casos\n\nNosso time atualiza as informações diariamente!'
    }
};

// Função para processar mensagem do usuário
function processarMensagem(mensagem, sessionId) {
    const msg = mensagem.toLowerCase().trim();
    
    // Verificar saudações
    if (baseConhecimento.saudacao.some(palavra => msg.includes(palavra))) {
        return {
            tipo: 'bot',
            texto: 'Olá! 👋 Sou o assistente virtual da Eco Companion!\n\nComo posso te ajudar hoje? Posso tirar dúvidas sobre:\n• Destinos e pacotes\n• Documentação necessária\n• Formas de pagamento\n• Seguro viagem\n\nFique à vontade para perguntar!'
        };
    }
    
    // Verificar despedidas
    if (baseConhecimento.despedida.some(palavra => msg.includes(palavra))) {
        return {
            tipo: 'bot',
            texto: 'Foi um prazer te ajudar! 😊\n\nSe precisar de mais alguma coisa, estarei aqui 24/7.\n\nBoa viagem e até a próxima! ✈️'
        };
    }
    
    // Verificar tópicos específicos
    for (const [topico, dados] of Object.entries(baseConhecimento)) {
        if (typeof dados === 'object' && dados.keywords) {
            if (dados.keywords.some(keyword => msg.includes(keyword))) {
                return {
                    tipo: 'bot',
                    texto: dados.response
                };
            }
        }
    }
    
    // Resposta padrão para perguntas não reconhecidas
    return {
        tipo: 'bot',
        texto: 'Interessante pergunta! 🤔\n\nAinda estou aprendendo sobre esse assunto. Você gostaria de:\n\n• Falar com um de nossos consultores humanos?\n• Navegar pela nossa seção de destinos?\n• Ver nossos pacotes promocionais?\n\nOu pode reformular sua pergunta de outra forma!'
    };
}

// Rota principal do chat
router.get('/', (req, res) => {
    res.render('chat/index', {
        titulo: 'Chat de Atendimento - Eco Companion',
        descricao: 'Tire suas dúvidas sobre viagens conosco',
        currentPage: 'chat'
    });
});

// API para enviar mensagem
router.post('/api/enviar', (req, res) => {
    try {
        const { mensagem, sessionId } = req.body;
        
        if (!mensagem || !sessionId) {
            return res.status(400).json({ erro: 'Mensagem e sessionId são obrigatórios' });
        }
        
        // Inicializar conversa se não existir
        if (!conversas[sessionId]) {
            conversas[sessionId] = [];
            mensagensHistorico[sessionId] = [];
        }
        
        // Adicionar mensagem do usuário
        const mensagemUsuario = {
            id: Date.now(),
            tipo: 'usuario',
            texto: mensagem,
            timestamp: new Date()
        };
        
        conversas[sessionId].push(mensagemUsuario);
        
        // Processar resposta do bot
        const respostaBot = processarMensagem(mensagem, sessionId);
        respostaBot.id = Date.now() + 1;
        respostaBot.timestamp = new Date();
        
        conversas[sessionId].push(respostaBot);
        
        // Limitar histórico a 50 mensagens
        if (conversas[sessionId].length > 50) {
            conversas[sessionId] = conversas[sessionId].slice(-50);
        }
        
        res.json({
            sucesso: true,
            resposta: respostaBot,
            totalMensagens: conversas[sessionId].length
        });
        
    } catch (error) {
        console.error('Erro no chat:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});

// API para buscar histórico
router.get('/api/historico/:sessionId', (req, res) => {
    try {
        const { sessionId } = req.params;
        const historico = conversas[sessionId] || [];
        
        res.json({
            sucesso: true,
            mensagens: historico,
            total: historico.length
        });
        
    } catch (error) {
        console.error('Erro ao buscar histórico:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});

// API para limpar conversa
router.delete('/api/limpar/:sessionId', (req, res) => {
    try {
        const { sessionId } = req.params;
        
        if (conversas[sessionId]) {
            delete conversas[sessionId];
        }
        
        res.json({ sucesso: true, mensagem: 'Conversa limpa com sucesso' });
        
    } catch (error) {
        console.error('Erro ao limpar conversa:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});

// API para transferir para atendente humano
router.post('/api/transferir-humano', (req, res) => {
    try {
        const { sessionId, motivo } = req.body;
        
        // Em produção, isso seria integrado com um sistema de tickets
        console.log(`Solicitação de transferência - Session: ${sessionId}, Motivo: ${motivo}`);
        
        res.json({
            sucesso: true,
            mensagem: 'Transferindo para um consultor humano...',
            estimativaEspera: '2-5 minutos'
        });
        
    } catch (error) {
        console.error('Erro na transferência:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});

// Estatísticas do chat (para admin)
router.get('/api/estatisticas', (req, res) => {
    try {
        const stats = {
            conversasAtivas: Object.keys(conversas).length,
            totalMensagens: Object.values(conversas).reduce((acc, conv) => acc + conv.length, 0),
            mediaMensagensPorConversa: Object.keys(conversas).length > 0 ? 
                Object.values(conversas).reduce((acc, conv) => acc + conv.length, 0) / Object.keys(conversas).length : 0,
            ultimaAtividade: new Date()
        };
        
        res.json({ sucesso: true, estatisticas: stats });
        
    } catch (error) {
        console.error('Erro nas estatísticas:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});

module.exports = router;
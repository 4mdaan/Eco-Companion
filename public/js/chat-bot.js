// ==========================================
// CHAT BOT - ECO COMPANION
// ==========================================

class ChatBot {
    constructor() {
        if (!window.chatConfig) {
            console.error('❌ Configuração do chat não encontrada');
            return;
        }
        
        this.sessionId = window.chatConfig.sessionId;
        this.apiUrl = window.chatConfig.apiUrl;
        this.isTyping = false;
        
        this.init();
    }
    
    init() {
        this.bindElements();
        this.bindEvents();
        this.setupAutoResize();
        this.updateTimestamps();
        this.loadHistorico();
        
        console.log('💬 Chat Bot inicializado:', this.sessionId);
    }
    
    bindElements() {
        this.elements = {
            messagesContainer: document.getElementById('chatMessages'),
            messageInput: document.getElementById('messageInput'),
            sendButton: document.getElementById('sendButton'),
            typingIndicator: document.getElementById('typingIndicator'),
            charCounter: document.getElementById('charCounter'),
            quickSuggestions: document.getElementById('quickSuggestions'),
            limparChat: document.getElementById('limparChat'),
            transferirHumano: document.getElementById('transferirHumano'),
            transferModal: document.getElementById('transferModal')
        };
        
        // Verificar se todos os elementos foram encontrados
        for (const [key, element] of Object.entries(this.elements)) {
            if (!element) {
                console.error(`❌ Elemento não encontrado: ${key}`);
            }
        }
    }
    
    bindEvents() {
        if (!this.elements.sendButton || !this.elements.messageInput) {
            console.error('❌ Elementos essenciais do chat não encontrados');
            return;
        }
        
        // Enviar mensagem
        this.elements.sendButton.addEventListener('click', () => this.enviarMensagem());
        
        // Enter para enviar (Shift+Enter para nova linha)
        this.elements.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.enviarMensagem();
            }
        });
        
        // Monitorar input
        this.elements.messageInput.addEventListener('input', () => {
            this.updateCharCounter();
            this.toggleSendButton();
        });
        
        // Sugestões rápidas
        this.elements.quickSuggestions.addEventListener('click', (e) => {
            if (e.target.classList.contains('suggestion-chip')) {
                const message = e.target.dataset.message;
                this.elements.messageInput.value = message;
                this.toggleSendButton();
                this.enviarMensagem();
            }
        });
        
        // Ações do chat
        this.elements.limparChat.addEventListener('click', () => this.limparConversa());
        this.elements.transferirHumano.addEventListener('click', () => this.abrirModalTransferencia());
        
        // Modal
        this.setupModal();
    }
    
    setupAutoResize() {
        const textarea = this.elements.messageInput;
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        });
    }
    
    updateCharCounter() {
        const length = this.elements.messageInput.value.length;
        this.elements.charCounter.textContent = `${length}/1000`;
        
        if (length > 800) {
            this.elements.charCounter.style.color = '#ef4444';
        } else if (length > 600) {
            this.elements.charCounter.style.color = '#f59e0b';
        } else {
            this.elements.charCounter.style.color = '#64748b';
        }
    }
    
    toggleSendButton() {
        const hasText = this.elements.messageInput.value.trim().length > 0;
        this.elements.sendButton.disabled = !hasText || this.isTyping;
    }
    
    async enviarMensagem() {
        const mensagem = this.elements.messageInput.value.trim();
        
        if (!mensagem || this.isTyping) return;
        
        try {
            // Limpar input
            this.elements.messageInput.value = '';
            this.elements.messageInput.style.height = 'auto';
            this.updateCharCounter();
            this.toggleSendButton();
            
            // Esconder sugestões
            this.elements.quickSuggestions.style.display = 'none';
            
            // Adicionar mensagem do usuário
            this.adicionarMensagem({
                tipo: 'usuario',
                texto: mensagem,
                timestamp: new Date()
            });
            
            // Mostrar indicador de digitação
            this.mostrarDigitacao();
            
            // Simular delay de resposta (1-3 segundos)
            const delay = Math.random() * 2000 + 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
            
            // Enviar para API
            const response = await fetch(`${this.apiUrl}/enviar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    mensagem: mensagem,
                    sessionId: this.sessionId
                })
            });
            
            const data = await response.json();
            
            // Esconder digitação
            this.esconderDigitacao();
            
            if (data.sucesso) {
                this.adicionarMensagem(data.resposta);
            } else {
                this.adicionarMensagem({
                    tipo: 'bot',
                    texto: 'Desculpe, ocorreu um erro. Tente novamente em alguns segundos.',
                    timestamp: new Date(),
                    erro: true
                });
            }
            
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            this.esconderDigitacao();
            
            this.adicionarMensagem({
                tipo: 'bot',
                texto: 'Ops! Parece que estou com problemas de conexão. Verifique sua internet e tente novamente.',
                timestamp: new Date(),
                erro: true
            });
        }
    }
    
    adicionarMensagem(mensagem) {
        const messageElement = this.criarElementoMensagem(mensagem);
        this.elements.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
        
        // Atualizar timestamps
        setTimeout(() => this.updateTimestamps(), 100);
    }
    
    criarElementoMensagem(mensagem) {
        const messageDiv = document.createElement('section');
        messageDiv.className = `message ${mensagem.tipo}-message${mensagem.erro ? ' error' : ''}`;
        
        const avatar = document.createElement('section');
        avatar.className = 'message-avatar';
        avatar.innerHTML = mensagem.tipo === 'usuario' ? 
            '<i class="fas fa-user"></i>' : 
            '<i class="fas fa-robot"></i>';
        
        const content = document.createElement('section');
        content.className = 'message-content';
        
        const bubble = document.createElement('section');
        bubble.className = 'message-bubble';
        
        // Processar texto com formatação básica
        const textoFormatado = this.formatarTexto(mensagem.texto);
        bubble.innerHTML = textoFormatado;
        
        const time = document.createElement('span');
        time.className = 'message-time';
        time.dataset.time = mensagem.timestamp;
        time.textContent = this.formatarHora(new Date(mensagem.timestamp));
        
        content.appendChild(bubble);
        content.appendChild(time);
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        
        // Animação de entrada
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            messageDiv.style.transition = 'all 0.3s ease-out';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 50);
        
        return messageDiv;
    }
    
    formatarTexto(texto) {
        return texto
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/•/g, '<li>')
            .replace(/<li>(.*?)(?=<li>|$)/gs, '<ul><li>$1</li></ul>')
            .replace(/<\/ul>\s*<ul>/g, '');
    }
    
    formatarHora(data) {
        const agora = new Date();
        const diff = agora - data;
        
        if (diff < 60000) {
            return 'agora';
        } else if (diff < 3600000) {
            const minutos = Math.floor(diff / 60000);
            return `${minutos}min atrás`;
        } else if (diff < 86400000) {
            return data.toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        } else {
            return data.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }
    
    mostrarDigitacao() {
        this.isTyping = true;
        this.elements.typingIndicator.style.display = 'flex';
        this.toggleSendButton();
        this.scrollToBottom();
    }
    
    esconderDigitacao() {
        this.isTyping = false;
        this.elements.typingIndicator.style.display = 'none';
        this.toggleSendButton();
    }
    
    scrollToBottom() {
        if (window.chatConfig.autoScroll) {
            setTimeout(() => {
                this.elements.messagesContainer.scrollTop = this.elements.messagesContainer.scrollHeight;
            }, 100);
        }
    }
    
    async limparConversa() {
        if (!confirm('Tem certeza que deseja limpar toda a conversa?')) return;
        
        try {
            const response = await fetch(`${this.apiUrl}/limpar/${this.sessionId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                // Limpar mensagens (manter apenas a mensagem de boas-vindas)
                const messages = this.elements.messagesContainer.querySelectorAll('.message:not(.welcome-message)');
                messages.forEach(msg => msg.remove());
                
                // Mostrar sugestões novamente
                this.elements.quickSuggestions.style.display = 'flex';
                
                this.mostrarNotificacao('Conversa limpa com sucesso!', 'success');
            }
        } catch (error) {
            console.error('Erro ao limpar conversa:', error);
            this.mostrarNotificacao('Erro ao limpar conversa. Tente novamente.', 'error');
        }
    }
    
    async loadHistorico() {
        try {
            const response = await fetch(`${this.apiUrl}/historico/${this.sessionId}`);
            const data = await response.json();
            
            if (data.sucesso && data.mensagens.length > 0) {
                // Remover mensagem de boas-vindas se houver histórico
                const welcomeMessage = this.elements.messagesContainer.querySelector('.welcome-message');
                if (welcomeMessage) welcomeMessage.remove();
                
                // Adicionar mensagens do histórico
                data.mensagens.forEach(msg => {
                    const messageElement = this.criarElementoMensagem(msg);
                    this.elements.messagesContainer.appendChild(messageElement);
                });
                
                this.scrollToBottom();
            }
        } catch (error) {
            console.log('Nenhum histórico encontrado para esta sessão');
        }
    }
    
    updateTimestamps() {
        const timeElements = this.elements.messagesContainer.querySelectorAll('.message-time');
        timeElements.forEach(el => {
            if (el.dataset.time) {
                el.textContent = this.formatarHora(new Date(el.dataset.time));
            }
        });
    }
    
    // Modal de Transferência
    setupModal() {
        const modal = this.elements.transferModal;
        
        // Fechar modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal-close')) {
                this.fecharModal();
            }
        });
        
        // ESC para fechar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this.fecharModal();
            }
        });
    }
    
    abrirModalTransferencia() {
        this.elements.transferModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    fecharModal() {
        this.elements.transferModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    async confirmarTransferencia() {
        const motivo = document.getElementById('transferReason').value;
        
        if (!motivo) {
            alert('Por favor, selecione um motivo para a transferência.');
            return;
        }
        
        try {
            const response = await fetch(`${this.apiUrl}/transferir-humano`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sessionId: this.sessionId,
                    motivo: motivo
                })
            });
            
            const data = await response.json();
            
            if (data.sucesso) {
                this.adicionarMensagem({
                    tipo: 'bot',
                    texto: `✅ ${data.mensagem}\n\nTempo estimado: ${data.estimativaEspera}\n\nEm breve você será conectado com um de nossos consultores especializados!`,
                    timestamp: new Date()
                });
                
                this.fecharModal();
            }
        } catch (error) {
            console.error('Erro na transferência:', error);
            this.mostrarNotificacao('Erro na transferência. Tente novamente.', 'error');
        }
    }
    
    mostrarNotificacao(mensagem, tipo = 'info') {
        // Criar elemento de notificação
        const notification = document.createElement('section');
        notification.className = `notification ${tipo}`;
        notification.innerHTML = `
            <i class="fas fa-${tipo === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${mensagem}</span>
        `;
        
        // Adicionar estilos inline
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: tipo === 'success' ? '#10b981' : '#ef4444',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            zIndex: '9999',
            animation: 'slideInRight 0.3s ease-out',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
        });
        
        document.body.appendChild(notification);
        
        // Remover após 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Funções globais para o modal
window.fecharModal = function() {
    if (window.chatBot) {
        window.chatBot.fecharModal();
    }
};

window.confirmarTransferencia = function() {
    if (window.chatBot) {
        window.chatBot.confirmarTransferencia();
    }
};

// CSS para animações de notificação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.chatBot = new ChatBot();
    
    // Atualizar timestamps a cada minuto
    setInterval(() => {
        if (window.chatBot) {
            window.chatBot.updateTimestamps();
        }
    }, 60000);
});

// Debug no console
console.log('🤖 Chat Bot carregado e pronto!');
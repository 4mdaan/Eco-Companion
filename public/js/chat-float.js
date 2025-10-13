// ==========================================
// CHAT FLUTUANTE - ECO COMPANION
// ==========================================

class ChatFloat {
    constructor() {
        this.isPreviewOpen = false;
        this.notificationCount = 0;
        
        this.init();
    }
    
    init() {
        this.createFloatButton();
        this.bindEvents();
        this.checkOnlineStatus();
        
        console.log('💬 Chat flutuante inicializado');
    }
    
    createFloatButton() {
        // Criar container principal
        const container = document.createElement('div');
        container.className = 'chat-float-container';
        container.innerHTML = `
            <!-- Tooltip -->
            <div class="chat-float-tooltip">
                💬 Precisa de ajuda? Fale conosco!
            </div>
            
            <!-- Prévia rápida -->
            <div class="chat-quick-preview" id="chatQuickPreview">
                <div class="chat-preview-header">
                    <div class="chat-preview-title">
                        <i class="fas fa-robot"></i>
                        Assistente Virtual
                    </div>
                    <button class="chat-preview-close" onclick="chatFloat.closePreview()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="chat-preview-body">
                    <div class="chat-preview-message">
                        <div class="chat-preview-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="chat-preview-text">
                            👋 Olá! Como posso te ajudar hoje? Estou aqui para esclarecer dúvidas sobre viagens, pacotes e muito mais!
                        </div>
                    </div>
                </div>
                <div class="chat-preview-footer">
                    <button class="chat-preview-cta" onclick="chatFloat.openFullChat()">
                        <i class="fas fa-comments"></i>
                        Iniciar Conversa
                    </button>
                </div>
            </div>
            
            <!-- Botão principal -->
            <button class="chat-float-button" id="chatFloatButton">
                <i class="fas fa-comments" id="chatFloatIcon"></i>
                <span class="chat-notification-badge" id="chatNotificationBadge" style="display: none;">0</span>
                <div class="chat-status-indicator"></div>
            </button>
        `;
        
        // Adicionar ao body
        document.body.appendChild(container);
        
        // Armazenar referências
        this.elements = {
            container: container,
            button: container.querySelector('#chatFloatButton'),
            icon: container.querySelector('#chatFloatIcon'),
            badge: container.querySelector('#chatNotificationBadge'),
            preview: container.querySelector('#chatQuickPreview')
        };
    }
    
    bindEvents() {
        // Click no botão principal
        this.elements.button.addEventListener('click', () => {
            if (this.isPreviewOpen) {
                this.closePreview();
            } else {
                this.openPreview();
            }
        });
        
        // Fechar prévia ao clicar fora
        document.addEventListener('click', (e) => {
            if (this.isPreviewOpen && 
                !this.elements.container.contains(e.target)) {
                this.closePreview();
            }
        });
        
        // ESC para fechar prévia
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isPreviewOpen) {
                this.closePreview();
            }
        });
        
        // Animação de entrada após carregamento da página
        setTimeout(() => {
            this.elements.container.style.animation = 'slideInRight 0.5s ease-out';
        }, 1000);
    }
    
    openPreview() {
        this.isPreviewOpen = true;
        this.elements.preview.classList.add('active');
        this.elements.icon.className = 'fas fa-times';
        
        // Analytics (opcional)
        this.trackEvent('chat_preview_opened');
    }
    
    closePreview() {
        this.isPreviewOpen = false;
        this.elements.preview.classList.remove('active');
        this.elements.icon.className = 'fas fa-comments';
    }
    
    openFullChat() {
        // Redirecionar para página completa do chat
        window.open('/chat', '_blank');
        this.closePreview();
        
        // Analytics
        this.trackEvent('chat_full_opened');
    }
    
    // Gerenciar notificações
    addNotification(count = 1) {
        this.notificationCount += count;
        this.updateBadge();
        
        // Adicionar animação de atenção
        this.elements.button.style.animation = 'chatPulse 0.5s ease-out';
        setTimeout(() => {
            this.elements.button.style.animation = '';
        }, 500);
    }
    
    clearNotifications() {
        this.notificationCount = 0;
        this.updateBadge();
    }
    
    updateBadge() {
        if (this.notificationCount > 0) {
            this.elements.badge.textContent = this.notificationCount > 99 ? '99+' : this.notificationCount;
            this.elements.badge.style.display = 'flex';
        } else {
            this.elements.badge.style.display = 'none';
        }
    }
    
    // Status do assistente
    setStatus(status) {
        this.elements.button.className = `chat-float-button ${status}`;
        
        const statusMessages = {
            online: '💚 Online - Resposta imediata',
            away: '🟡 Ocupado - Resposta em alguns minutos',
            busy: '🔴 Indisponível - Deixe sua mensagem',
            offline: '⚫ Offline - Voltamos em breve'
        };
        
        const tooltip = this.elements.container.querySelector('.chat-float-tooltip');
        tooltip.textContent = statusMessages[status] || statusMessages.online;
    }
    
    checkOnlineStatus() {
        // Simular verificação de status
        // Em produção, isso viria de uma API real
        const isOnline = navigator.onLine;
        const currentHour = new Date().getHours();
        
        if (!isOnline) {
            this.setStatus('offline');
        } else if (currentHour >= 8 && currentHour <= 22) {
            this.setStatus('online');
        } else {
            this.setStatus('away');
        }
        
        // Verificar status a cada 5 minutos
        setTimeout(() => this.checkOnlineStatus(), 5 * 60 * 1000);
    }
    
    // Animações especiais
    celebrate() {
        const confetti = document.createElement('div');
        confetti.innerHTML = '🎉';
        confetti.style.cssText = `
            position: fixed;
            bottom: 90px;
            right: 30px;
            font-size: 2rem;
            animation: celebrate 2s ease-out forwards;
            z-index: 1000;
            pointer-events: none;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, 2000);
    }
    
    // Integração com notificações do sistema
    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('✅ Permissão para notificações concedida');
                }
            });
        }
    }
    
    showSystemNotification(title, body, icon = '/imagens/logo.png') {
        if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification(title, {
                body: body,
                icon: icon,
                badge: icon,
                tag: 'eco-companion-chat'
            });
            
            notification.onclick = () => {
                window.focus();
                this.openFullChat();
                notification.close();
            };
            
            // Fechar automaticamente após 5 segundos
            setTimeout(() => notification.close(), 5000);
        }
    }
    
    // Recursos de acessibilidade
    setupAccessibility() {
        this.elements.button.setAttribute('aria-label', 'Abrir chat de atendimento');
        this.elements.button.setAttribute('role', 'button');
        this.elements.button.setAttribute('tabindex', '0');
        
        // Navegação por teclado
        this.elements.button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.elements.button.click();
            }
        });
    }
    
    // Analytics e tracking (opcional)
    trackEvent(action, category = 'chat', label = '') {
        // Integração com Google Analytics, Mixpanel, etc.
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label,
                value: 1
            });
        }
        
        console.log(`📊 Event tracked: ${category}.${action}`, label);
    }
    
    // Integração com WebSocket (para mensagens em tempo real)
    initWebSocket() {
        // Em produção, conectar com WebSocket real
        /*
        this.ws = new WebSocket('wss://seu-servidor.com/chat');
        
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'new_message') {
                this.addNotification();
                this.showSystemNotification(
                    'Nova mensagem do atendimento',
                    data.message
                );
            }
        };
        */
    }
}

// Estilos adicionais para animações
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes celebrate {
        0% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 1;
        }
        50% {
            transform: translateY(-20px) rotate(180deg) scale(1.2);
            opacity: 0.8;
        }
        100% {
            transform: translateY(-40px) rotate(360deg) scale(0.8);
            opacity: 0;
        }
    }
`;
document.head.appendChild(additionalStyles);

// Função global para fechar prévia (usada no HTML)
window.chatFloat = null;

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar um pouco para garantir que outros scripts carregaram
    setTimeout(() => {
        window.chatFloat = new ChatFloat();
        window.chatFloat.setupAccessibility();
        window.chatFloat.requestNotificationPermission();
    }, 500);
});

// Debug
console.log('🚀 Chat Float script carregado!');
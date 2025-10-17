// Script do sistema de cashback

document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema de cashback carregado');
    
    // Elementos da página
    const btnResgates = document.querySelectorAll('.btn-resgatar');
    const botoesAcoes = document.querySelectorAll('[onclick]');
    
    // Inicializar listeners
    initCashbackSystem();
    
    /**
     * Inicializa o sistema de cashback
     */
    function initCashbackSystem() {
        // Atualizar progresso visual
        updateProgressBars();
        
        // Adicionar listeners aos botões de resgate
        btnResgates.forEach(btn => {
            btn.addEventListener('click', handleResgateRecompensa);
        });
        
        // Adicionar listeners aos outros botões
        setupActionButtons();
        
        // Auto-refresh dos dados de cashback
        setInterval(refreshCashbackData, 30000); // 30 segundos
    }
    
    /**
     * Atualiza as barras de progresso de nível
     */
    function updateProgressBars() {
        const progressBars = document.querySelectorAll('.progresso-fill');
        
        progressBars.forEach(bar => {
            const targetWidth = bar.dataset.width || bar.style.width;
            if (targetWidth) {
                // Animação suave da barra de progresso
                setTimeout(() => {
                    bar.style.width = targetWidth;
                }, 500);
            }
        });
    }
    
    /**
     * Configura os botões de ação da página
     */
    function setupActionButtons() {
        // Botão ver histórico completo
        const btnHistorico = document.querySelector('[data-action="ver-historico"]');
        if (btnHistorico) {
            btnHistorico.addEventListener('click', () => {
                window.location.href = '/cashback/historico';
            });
        }
        
        // Botão ver todas recompensas
        const btnRecompensas = document.querySelector('[data-action="ver-recompensas"]');
        if (btnRecompensas) {
            btnRecompensas.addEventListener('click', () => {
                window.location.href = '/cashback/recompensas';
            });
        }
        
        // Botão compartilhar conquista
        const btnCompartilhar = document.querySelector('[data-action="compartilhar"]');
        if (btnCompartilhar) {
            btnCompartilhar.addEventListener('click', compartilharConquista);
        }
    }
    
    /**
     * Trata o resgate de recompensas
     */
    async function handleResgateRecompensa(event) {
        event.preventDefault();
        
        const btn = event.target;
        const recompensaId = btn.dataset.recompensaId;
        const pontosNecessarios = parseInt(btn.dataset.pontos);
        
        if (!recompensaId) {
            showNotification('Erro: Recompensa não encontrada', 'error');
            return;
        }
        
        // Confirmar resgate
        const confirmacao = await showConfirmDialog(
            'Confirmar Resgate',
            `Deseja resgatar esta recompensa por ${pontosNecessarios} pontos?`
        );
        
        if (!confirmacao) return;
        
        // Mostrar loading
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Resgatando...';
        
        try {
            const response = await fetch('/cashback/resgatar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    recompensaId: recompensaId
                })
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                showNotification('Recompensa resgatada com sucesso!', 'success');
                
                // Atualizar a página após 2 segundos
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
                
            } else {
                throw new Error(result.message || 'Erro ao resgatar recompensa');
            }
            
        } catch (error) {
            console.error('Erro no resgate:', error);
            showNotification(error.message, 'error');
            
            // Restaurar botão
            btn.disabled = false;
            btn.innerHTML = 'Resgatar';
        }
    }
    
    /**
     * Compartilha conquista nas redes sociais
     */
    function compartilharConquista() {
        const nivel = document.querySelector('.nivel-badge')?.textContent?.trim() || 'Eco Viajante';
        const pontos = document.querySelector('.pontos-valor')?.textContent?.trim() || '0';
        
        const texto = `🎉 Alcancei o nível ${nivel} no Eco Companion com ${pontos} pontos de cashback! 🌟 Viaje sustentável e ganhe recompensas incríveis! ✈️🌱`;
        const url = window.location.origin;
        
        // Compartilhar no WhatsApp (mais usado no Brasil)
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(texto + ' ' + url)}`;
        
        // Abrir popup de compartilhamento
        const popup = window.open(whatsappUrl, 'compartilhar', 'width=600,height=400');
        
        // Rastrear compartilhamento
        if (popup) {
            trackEvent('cashback_compartilhamento', {
                nivel: nivel,
                pontos: pontos
            });
        }
    }
    
    /**
     * Atualiza os dados do cashback
     */
    async function refreshCashbackData() {
        try {
            const response = await fetch('/cashback/api/dados');
            const data = await response.json();
            
            if (response.ok) {
                updateDashboardData(data);
            }
        } catch (error) {
            console.error('Erro ao atualizar dados do cashback:', error);
        }
    }
    
    /**
     * Atualiza os dados na interface
     */
    function updateDashboardData(data) {
        // Atualizar pontos
        const pontosValor = document.querySelector('.pontos-valor');
        if (pontosValor && data.pontos !== undefined) {
            animateNumber(pontosValor, parseInt(pontosValor.textContent), data.pontos);
        }
        
        // Atualizar pontos pendentes
        const pontosPendentes = document.querySelector('.pontos-pendentes .pontos-valor');
        if (pontosPendentes && data.pontosPendentes !== undefined) {
            pontosPendentes.textContent = data.pontosPendentes;
        }
        
        // Atualizar progresso do nível
        const progressBar = document.querySelector('.progresso-fill');
        if (progressBar && data.progressoNivel !== undefined) {
            progressBar.style.width = `${data.progressoNivel}%`;
        }
        
        // Atualizar estatísticas
        updateStats(data.stats);
    }
    
    /**
     * Atualiza as estatísticas
     */
    function updateStats(stats) {
        if (!stats) return;
        
        const statElements = {
            'totalCompras': document.querySelector('[data-stat="compras"] .stat-valor'),
            'totalGasto': document.querySelector('[data-stat="gasto"] .stat-valor'),
            'economizado': document.querySelector('[data-stat="economizado"] .stat-valor'),
            'viagensEco': document.querySelector('[data-stat="eco"] .stat-valor')
        };
        
        Object.entries(statElements).forEach(([key, element]) => {
            if (element && stats[key] !== undefined) {
                element.textContent = stats[key];
            }
        });
    }
    
    /**
     * Anima mudança de número
     */
    function animateNumber(element, start, end, duration = 1000) {
        const startTime = Date.now();
        const difference = end - start;
        
        function updateNumber() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentNumber = Math.floor(start + (difference * progress));
            element.textContent = currentNumber.toLocaleString('pt-BR');
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        }
        
        updateNumber();
    }
    
    /**
     * Mostra diálogo de confirmação
     */
    function showConfirmDialog(titulo, mensagem) {
        return new Promise((resolve) => {
            const confirmed = confirm(`${titulo}\n\n${mensagem}`);
            resolve(confirmed);
        });
    }
    
    /**
     * Sistema de notificações
     */
    function showNotification(message, type = 'info') {
        // Remover notificação existente
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Criar nova notificação
        const notification = document.createElement('section');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <section class="notification-content">
                <section class="notification-icon">
                    ${getNotificationIcon(type)}
                </section>
                <section class="notification-message">${message}</section>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </section>
        `;
        
        // Adicionar estilos se não existirem
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 1000;
                    min-width: 300px;
                    max-width: 500px;
                    animation: slideInRight 0.3s ease;
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    border-left: 4px solid var(--color);
                }
                
                .notification-success { --color: #10b981; }
                .notification-error { --color: #ef4444; }
                .notification-warning { --color: #f59e0b; }
                .notification-info { --color: #3b82f6; }
                
                .notification-icon {
                    font-size: 20px;
                    color: var(--color);
                }
                
                .notification-message {
                    flex: 1;
                    color: #374151;
                    font-weight: 500;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    font-size: 20px;
                    color: #9ca3af;
                    cursor: pointer;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
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
            `;
            document.head.appendChild(styles);
        }
        
        // Adicionar ao DOM
        document.body.appendChild(notification);
        
        // Auto-remover após 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
    
    /**
     * Retorna ícone da notificação
     */
    function getNotificationIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }
    
    /**
     * Rastreia eventos para analytics
     */
    function trackEvent(eventName, eventData = {}) {
        console.log('Event tracked:', eventName, eventData);
        
        // Aqui você pode integrar com Google Analytics, Facebook Pixel, etc.
        if (window.gtag) {
            window.gtag('event', eventName, eventData);
        }
    }
});

// Funções globais (para onclick handlers)
window.cashback = {
    verHistorico: function() {
        window.location.href = '/cashback/historico';
    },
    
    verRecompensas: function() {
        window.location.href = '/cashback/recompensas';
    },
    
    compartilhar: function() {
        const nivel = document.querySelector('.nivel-badge')?.textContent?.trim() || 'Eco Viajante';
        const pontos = document.querySelector('.pontos-valor')?.textContent?.trim() || '0';
        
        const texto = `🎉 Alcancei o nível ${nivel} no Eco Companion com ${pontos} pontos de cashback! 🌟`;
        const url = window.location.origin;
        
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(texto + ' ' + url)}`;
        window.open(whatsappUrl, 'compartilhar', 'width=600,height=400');
    }
};
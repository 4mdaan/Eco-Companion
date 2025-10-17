// Admin Dashboard JavaScript - Real-time Monitoring & Management

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar dashboard
    initDashboard();
    initRealTimeUpdates();
    initCharts();
    initInteractiveElements();
});

// === DASHBOARD INITIALIZATION ===
function initDashboard() {
    console.log('🛡️ Admin Dashboard iniciado');
    
    // Atualizar timestamp inicial
    updateLastRefresh();
    
    // Verificar status do sistema
    checkSystemStatus();
    
    // Carregar dados iniciais
    loadInitialData();
}

function updateLastRefresh() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR');
    
    // Adicionar indicador de última atualização
    const refreshIndicator = document.createElement('section');
    refreshIndicator.id = 'last-refresh';
    refreshIndicator.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(52, 152, 219, 0.9);
        color: white;
        padding: 8px 15px;
        border-radius: 20px;
        font-size: 0.8rem;
        z-index: 1000;
        backdrop-filter: blur(10px);
    `;
    refreshIndicator.textContent = `🔄 Última atualização: ${timeString}`;
    
    // Remover indicador anterior se existir
    const existing = document.getElementById('last-refresh');
    if (existing) existing.remove();
    
    document.body.appendChild(refreshIndicator);
}

function checkSystemStatus() {
    const statusIndicator = document.getElementById('system-status');
    if (statusIndicator) {
        // Simular verificação de status
        setTimeout(() => {
            statusIndicator.className = 'status-dot online';
            showNotification('✅ Sistema operando normalmente', 'success');
        }, 1000);
    }
}

function loadInitialData() {
    // Simular carregamento inicial de dados
    const loadingOverlay = createLoadingOverlay();
    document.body.appendChild(loadingOverlay);
    
    setTimeout(() => {
        loadingOverlay.remove();
        animateMetrics();
    }, 2000);
}

function createLoadingOverlay() {
    const overlay = document.createElement('section');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255,255,255,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        backdrop-filter: blur(5px);
    `;
    
    overlay.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 20px; animation: spin 1s linear infinite;">⚙️</div>
            <div style="font-size: 1.2rem; color: #2c3e50; font-weight: 600;">Carregando Dashboard...</div>
            <div style="color: #7f8c8d; margin-top: 10px;">Verificando integrações e coletando métricas</div>
        </div>
    `;
    
    return overlay;
}

function animateMetrics() {
    const metricValues = document.querySelectorAll('.metric-value');
    
    metricValues.forEach((element, index) => {
        setTimeout(() => {
            element.style.animation = 'slideIn 0.6s ease';
            element.classList.add('data-change');
            setTimeout(() => element.classList.remove('data-change'), 500);
        }, index * 200);
    });
}

// === REAL-TIME UPDATES ===
function initRealTimeUpdates() {
    // Atualizar métricas a cada 30 segundos
    setInterval(updateMetrics, 30000);
    
    // Atualizar status das integrações a cada 1 minuto
    setInterval(updateIntegrationsStatus, 60000);
    
    // Simular novos eventos a cada 15 segundos
    setInterval(simulateNewEvents, 15000);
    
    // Atualizar dados específicos
    setInterval(updateSpecificData, 45000);
}

function updateMetrics() {
    const updates = [
        {
            id: 'response-time',
            value: Math.floor(Math.random() * 50) + 50 + 'ms',
            trend: Math.random() > 0.7 ? 'positive' : 'neutral'
        },
        {
            id: 'users-online',
            value: Math.floor(Math.random() * 50) + 100,
            trend: 'positive'
        },
        {
            id: 'total-requests',
            value: Math.floor(Math.random() * 1000) + 15000,
            trend: 'positive'
        },
        {
            id: 'conversion-rate',
            value: (Math.random() * 5 + 10).toFixed(1) + '%',
            trend: 'positive'
        }
    ];
    
    updates.forEach(update => {
        const element = document.getElementById(update.id);
        if (element) {
            // Animar mudança
            element.classList.add('updating');
            
            setTimeout(() => {
                if (typeof update.value === 'number') {
                    animateNumberChange(element, parseInt(element.textContent.replace(/[^\d]/g, '')), update.value);
                } else {
                    element.textContent = update.value;
                }
                
                element.classList.remove('updating');
                element.classList.add('data-change');
                
                setTimeout(() => element.classList.remove('data-change'), 500);
                
                // Atualizar trend se disponível
                const trendElement = element.closest('.metric-card')?.querySelector('.metric-trend');
                if (trendElement && update.trend) {
                    updateTrend(trendElement, update.trend);
                }
                
            }, 1000);
        }
    });
    
    // Atualizar timestamp
    updateLastRefresh();
}

function updateIntegrationsStatus() {
    const integrations = document.querySelectorAll('.integration-status-card');
    
    integrations.forEach(card => {
        const service = card.dataset.service;
        const statusBadge = card.querySelector('.status-badge');
        const metrics = card.querySelectorAll('.metric-value');
        
        // Simular mudanças de status ocasionais
        if (Math.random() > 0.9) {
            // 10% chance de mudança temporária
            statusBadge.className = 'status-badge warning';
            statusBadge.textContent = 'Verificando';
            
            setTimeout(() => {
                statusBadge.className = 'status-badge online';
                statusBadge.textContent = 'Online';
            }, Math.random() * 10000 + 5000);
        }
        
        // Atualizar métricas
        metrics.forEach(metric => {
            if (metric.textContent.includes('ms')) {
                const newLatency = Math.floor(Math.random() * 100) + 20 + 'ms';
                animateValueChange(metric, newLatency);
            } else if (metric.textContent.match(/\d+$/)) {
                const currentValue = parseInt(metric.textContent);
                const newValue = currentValue + Math.floor(Math.random() * 10) + 1;
                animateValueChange(metric, newValue);
            }
        });
    });
}

function simulateNewEvents() {
    const eventTypes = [
        { type: 'security', message: 'Nova tentativa de login bloqueada', severity: 'info' },
        { type: 'performance', message: 'Pico de tráfego detectado', severity: 'info' },
        { type: 'integration', message: 'Integração Booking.com sincronizada', severity: 'success' },
        { type: 'user', message: 'Novo usuário registrado', severity: 'success' },
        { type: 'backup', message: 'Backup automático concluído', severity: 'success' }
    ];
    
    const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    // Mostrar notificação do evento
    showEventNotification(randomEvent);
    
    // Simular novo review ocasionalmente
    if (Math.random() > 0.7) {
        simulateNewReview();
    }
}

function simulateNewReview() {
    const reviews = [
        { name: 'Carlos Silva', rating: 5, text: 'Excelente experiência!', destination: 'Rio de Janeiro' },
        { name: 'Ana Santos', rating: 4, text: 'Muito bom atendimento!', destination: 'Gramado' },
        { name: 'Pedro Costa', rating: 5, text: 'Recomendo a todos!', destination: 'Florianópolis' }
    ];
    
    const randomReview = reviews[Math.floor(Math.random() * reviews.length)];
    
    // Adicionar ao painel de reviews
    addNewReviewToPanel(randomReview);
    
    // Atualizar estatísticas
    updateReviewStats();
}

function addNewReviewToPanel(review) {
    const reviewsContainer = document.querySelector('.recent-reviews');
    if (!reviewsContainer) return;
    
    const reviewItem = document.createElement('section');
    reviewItem.className = 'review-item new-review';
    reviewItem.innerHTML = `
        <div class="review-content">
            <strong>${review.name}</strong>
            <span class="review-rating">
                ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
            </span>
        </div>
        <div class="review-text">"${review.text}"</div>
        <div class="review-time">Agora mesmo</div>
        <div class="live-indicator">🔴 Novo</div>
    `;
    
    // Adicionar no topo
    const firstReview = reviewsContainer.querySelector('.review-item');
    if (firstReview) {
        reviewsContainer.insertBefore(reviewItem, firstReview);
    } else {
        reviewsContainer.appendChild(reviewItem);
    }
    
    // Animar entrada
    reviewItem.style.animation = 'slideIn 0.5s ease';
    
    // Remover indicador "novo" após 10 segundos
    setTimeout(() => {
        const indicator = reviewItem.querySelector('.live-indicator');
        if (indicator) indicator.remove();
        reviewItem.classList.remove('new-review');
    }, 10000);
    
    // Manter apenas últimos 5 reviews
    const allReviews = reviewsContainer.querySelectorAll('.review-item');
    if (allReviews.length > 5) {
        allReviews[allReviews.length - 1].remove();
    }
}

function updateReviewStats() {
    const totalElement = document.querySelector('.reviews-stats .stat-number');
    if (totalElement) {
        const currentTotal = parseInt(totalElement.textContent.replace(/[^\d]/g, ''));
        const newTotal = currentTotal + 1;
        animateNumberChange(totalElement, currentTotal, newTotal);
    }
}

function updateSpecificData() {
    // Atualizar contadores específicos
    updateSecurityCounters();
    updateAutomationStats();
}

function updateSecurityCounters() {
    const blockedElement = document.querySelector('.security-count');
    if (blockedElement) {
        const current = parseInt(blockedElement.textContent);
        const increment = Math.floor(Math.random() * 3) + 1;
        animateNumberChange(blockedElement, current, current + increment);
    }
}

function updateAutomationStats() {
    const automationStats = document.querySelectorAll('.automation-stat strong');
    
    automationStats.forEach(stat => {
        const current = parseInt(stat.textContent.replace(/[^\d]/g, ''));
        if (!isNaN(current)) {
            const increment = Math.floor(Math.random() * 10) + 1;
            animateNumberChange(stat, current, current + increment);
        }
    });
}

// === CHARTS ===
function initCharts() {
    // Inicializar gráficos simples
    createTrafficChart();
    createPerformanceChart();
}

function createTrafficChart() {
    const canvas = document.getElementById('traffic-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Dados simulados
    const data = Array.from({length: 24}, (_, i) => Math.floor(Math.random() * 100) + 50);
    
    // Desenhar gráfico simples
    drawLineChart(ctx, data, 'Tráfego por Hora');
}

function createPerformanceChart() {
    const canvas = document.getElementById('performance-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Dados de performance
    const data = Array.from({length: 12}, () => Math.floor(Math.random() * 200) + 50);
    
    drawLineChart(ctx, data, 'Tempo de Resposta (ms)');
}

function drawLineChart(ctx, data, title) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const padding = 40;
    
    // Limpar canvas
    ctx.clearRect(0, 0, width, height);
    
    // Configurar estilo
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 2;
    ctx.fillStyle = 'rgba(52, 152, 219, 0.1)';
    
    // Calcular pontos
    const maxValue = Math.max(...data);
    const xStep = (width - 2 * padding) / (data.length - 1);
    const yScale = (height - 2 * padding) / maxValue;
    
    // Desenhar linha
    ctx.beginPath();
    data.forEach((value, index) => {
        const x = padding + index * xStep;
        const y = height - padding - value * yScale;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();
    
    // Desenhar área preenchida
    ctx.lineTo(width - padding, height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.closePath();
    ctx.fill();
}

// === INTERACTIVE ELEMENTS ===
function initInteractiveElements() {
    // Adicionar tooltips
    addTooltips();
    
    // Configurar modals
    setupModals();
    
    // Adicionar keyboard shortcuts
    addKeyboardShortcuts();
}

function addTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const text = e.target.dataset.tooltip;
    if (!text) return;
    
    const tooltip = document.createElement('section');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 0.8rem;
        z-index: 10000;
        pointer-events: none;
        white-space: nowrap;
    `;
    
    document.body.appendChild(tooltip);
    
    // Posicionar tooltip
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
    
    e.target._tooltip = tooltip;
}

function hideTooltip(e) {
    if (e.target._tooltip) {
        e.target._tooltip.remove();
        delete e.target._tooltip;
    }
}

function setupModals() {
    // Modal já configurado no HTML, apenas adicionar funcionalidades extras
    const modal = document.getElementById('logs-modal');
    if (modal) {
        // Fechar modal com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeLogs();
            }
        });
    }
}

function addKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + R para refresh
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            refreshDashboard();
        }
        
        // F5 para refresh completo
        if (e.key === 'F5') {
            e.preventDefault();
            window.location.reload();
        }
    });
}

// === UTILITY FUNCTIONS ===
function animateNumberChange(element, from, to) {
    const duration = 1000;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(from + (to - from) * progress);
        
        if (element.textContent.includes('.')) {
            element.textContent = current.toLocaleString('pt-BR');
        } else {
            element.textContent = current.toString();
        }
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function animateValueChange(element, newValue) {
    element.classList.add('updating');
    
    setTimeout(() => {
        element.textContent = newValue;
        element.classList.remove('updating');
        element.classList.add('data-change');
        
        setTimeout(() => element.classList.remove('data-change'), 500);
    }, 500);
}

function updateTrend(trendElement, trend) {
    const trends = {
        positive: { text: '+5%', class: 'positive' },
        negative: { text: '-2%', class: 'negative' },
        neutral: { text: '0%', class: 'neutral' }
    };
    
    const trendData = trends[trend] || trends.neutral;
    
    trendElement.textContent = trendData.text;
    trendElement.className = `metric-trend ${trendData.class}`;
}

function showEventNotification(event) {
    const notification = document.createElement('section');
    notification.className = `event-notification ${event.severity}`;
    notification.innerHTML = `
        <div class="event-icon">
            ${event.type === 'security' ? '🛡️' : 
              event.type === 'performance' ? '⚡' :
              event.type === 'integration' ? '🔗' :
              event.type === 'user' ? '👤' : '💾'}
        </div>
        <div class="event-message">${event.message}</div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: white;
        border: 1px solid #e1e5e9;
        border-left: 4px solid ${event.severity === 'success' ? '#2ecc71' : '#3498db'};
        border-radius: 8px;
        padding: 15px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('section');
    notification.className = `admin-notification notification-${type}`;
    notification.textContent = message;
    
    const colors = {
        success: '#2ecc71',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${colors[type] || colors.info};
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        font-weight: 600;
        z-index: 10001;
        animation: slideInDown 0.3s ease;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutUp 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// === GLOBAL FUNCTIONS ===
window.refreshDashboard = function() {
    showNotification('🔄 Atualizando dashboard...', 'info');
    
    // Simular refresh
    setTimeout(() => {
        updateMetrics();
        updateIntegrationsStatus();
        showNotification('✅ Dashboard atualizado com sucesso!', 'success');
    }, 1500);
};

window.viewSecurityLogs = function() {
    const modal = document.getElementById('logs-modal');
    const logsContainer = document.getElementById('logs-container');
    
    if (modal && logsContainer) {
        // Carregar logs
        fetch('/admin/security/logs')
            .then(response => response.json())
            .then(logs => {
                logsContainer.innerHTML = logs.map(log => `
                    <div class="log-item ${log.severity}">
                        <div class="log-info">
                            <div class="log-message">${log.message}</div>
                            <div class="log-details">
                                ${new Date(log.timestamp).toLocaleString('pt-BR')} - 
                                IP: ${log.ip} - 
                                Tipo: ${log.type}
                            </div>
                        </div>
                        <div class="log-severity ${log.severity}">${log.severity}</div>
                    </div>
                `).join('');
                
                modal.classList.add('active');
            })
            .catch(error => {
                console.error('Erro ao carregar logs:', error);
                showNotification('❌ Erro ao carregar logs de segurança', 'error');
            });
    }
};

window.closeLogs = function() {
    const modal = document.getElementById('logs-modal');
    if (modal) {
        modal.classList.remove('active');
    }
};

// === CSS ANIMATIONS ===
const adminStyle = document.createElement('style');
adminStyle.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    @keyframes slideInDown {
        from { transform: translate(-50%, -100%); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
    }
    
    @keyframes slideOutUp {
        from { transform: translate(-50%, 0); opacity: 1; }
        to { transform: translate(-50%, -100%); opacity: 0; }
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .new-review {
        border-left: 4px solid #2ecc71 !important;
        background: rgba(46, 204, 113, 0.05);
    }
    
    .live-indicator {
        background: #e74c3c;
        color: white;
        padding: 2px 6px;
        border-radius: 10px;
        font-size: 0.7rem;
        font-weight: 600;
        display: inline-block;
        animation: pulse 1.5s infinite;
    }
`;
document.head.appendChild(adminStyle);

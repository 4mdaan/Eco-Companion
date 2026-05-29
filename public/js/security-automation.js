// Security, Trust, Automation & Integration JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar funcionalidades
    initSecurityFeatures();
    initAutomationFeatures();
    initIntegrationFeatures();
    initSupportFeatures();
});

// === SECURITY FEATURES ===
function initSecurityFeatures() {
    // SSL Status Checker
    checkSSLStatus();
    
    // Real-time Security Monitoring
    startSecurityMonitoring();
}

function checkSSLStatus() {
    // Verificar se a conexão é segura
    const isSecure = location.protocol === 'https:';
    const sslIndicator = document.querySelector('.security-badge.verified');
    
    if (sslIndicator && isSecure) {
        sslIndicator.style.background = 'rgba(76, 175, 80, 0.3)';
        sslIndicator.innerHTML = '✅ SSL Ativo';
    }
}



function startSecurityMonitoring() {
    // Monitoramento de atividades suspeitas
    let suspiciousActivity = 0;
    
    // Detectar múltiplos cliques rápidos
    document.addEventListener('click', function() {
        suspiciousActivity++;
        setTimeout(() => suspiciousActivity--, 1000);
        
        if (suspiciousActivity > 10) {
            showSecurityAlert('Atividade suspeita detectada. Reforçando segurança...');
            suspiciousActivity = 0;
        }
    });
    
    // Detectar tentativas de inspecionar elemento
    document.addEventListener('keydown', function(e) {
        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
            showSecurityAlert('Modo desenvolvedor detectado. Monitorando...');
        }
    });
}

function showSecurityAlert(message) {
    const alert = document.createElement('section');
    alert.className = 'security-alert';
    alert.innerHTML = `
        <section class="alert-content">
            🛡️ ${message}
        </section>
    `;
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 3000);
}

// === AUTOMATION FEATURES ===
function initAutomationFeatures() {
    // Email automation
    setupEmailAutomation();
    
    // Smart notifications
    initSmartNotifications();
    
    // AI recommendations
    initAIRecommendations();
    
    // Auto-save form data
    initAutoSave();
}

function setupEmailAutomation() {
    // Simular sistema de email automático
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            // Simular envio automático de confirmação
            setTimeout(() => {
                showNotification('📧 Confirmação enviada automaticamente para seu email!', 'success');
            }, 1000);
        });
    });
}

function initSmartNotifications() {
    // Sistema de notificações inteligentes
    const notifications = [
        {
            icon: '✈️',
            message: 'Lembre-se: Check-in online abre 24h antes do voo',
            delay: 30000,
            type: 'info'
        },
        {
            icon: '📋',
            message: 'Dica: Tenha seus documentos em mãos para agilizar a reserva',
            delay: 60000,
            type: 'tip'
        },
        {
            icon: '💡',
            message: 'IA sugere: Pacotes similares com 20% de desconto disponíveis',
            delay: 90000,
            type: 'suggestion'
        }
    ];
    
    notifications.forEach(notification => {
        setTimeout(() => {
            showSmartNotification(notification);
        }, notification.delay);
    });
}

function showSmartNotification(notification) {
    const notif = document.createElement('section');
    notif.className = `smart-notification notification-${notification.type}`;
    notif.innerHTML = `
        <section class="notification-content">
            <span class="notification-icon">${notification.icon}</span>
            <span class="notification-text">${notification.message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </section>
    `;
    
    notif.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: white;
        border-left: 4px solid #4facfe;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 9999;
        max-width: 350px;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notif);
    
    // Auto-remove após 8 segundos
    setTimeout(() => {
        if (notif.parentNode) notif.remove();
    }, 8000);
}

function initAIRecommendations() {
    // Sistema de recomendações baseado em IA simulada
    const userPreferences = getUserPreferences();
    
    if (userPreferences.visited > 2) {
        setTimeout(() => {
            showAIRecommendation();
        }, 45000);
    }
}

function getUserPreferences() {
    // Simular dados do usuário
    return {
        visited: parseInt(localStorage.getItem('pageVisits') || '0') + 1,
        interests: ['praia', 'cultura', 'aventura'],
        budget: 'medio'
    };
}

function showAIRecommendation() {
    const recommendations = [
        'Com base no seu histórico, recomendamos os pacotes para Florianópolis!',
        'IA detectou interesse em praias: Confira nossas ofertas no Nordeste!',
        'Usuários como você também se interessaram por pacotes de aventura!'
    ];
    
    const randomRec = recommendations[Math.floor(Math.random() * recommendations.length)];
    
    showSmartNotification({
        icon: '🤖',
        message: randomRec,
        type: 'ai-suggestion'
    });
}

function initAutoSave() {
    // Auto-save de formulários
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            const key = `autosave_${this.name || this.id}`;
            localStorage.setItem(key, this.value);
            
            // Mostrar indicador de salvamento
            showSaveIndicator(this);
        });
        
        // Restaurar valores salvos
        const key = `autosave_${input.name || input.id}`;
        const saved = localStorage.getItem(key);
        if (saved && !input.value) {
            input.value = saved;
        }
    });
}

function showSaveIndicator(element) {
    // Criar indicador de salvamento
    let indicator = element.nextElementSibling;
    if (!indicator || !indicator.classList.contains('save-indicator')) {
        indicator = document.createElement('span');
        indicator.className = 'save-indicator';
        indicator.style.cssText = `
            color: #4caf50;
            font-size: 0.8rem;
            margin-left: 10px;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        element.parentNode.insertBefore(indicator, element.nextSibling);
    }
    
    indicator.textContent = '💾 Salvo automaticamente';
    indicator.style.opacity = '1';
    
    setTimeout(() => {
        indicator.style.opacity = '0';
    }, 2000);
}

// === INTEGRATION FEATURES ===
function initIntegrationFeatures() {
    // Payment integrations
    initPaymentIntegrations();
    
    // Social media integration
    initSocialIntegration();
    
    // Analytics integration
    initAnalyticsIntegration();
    
    // External API integrations
    initAPIIntegrations();
}

function initPaymentIntegrations() {
    // Simular integração com gateways de pagamento
    const paymentMethods = ['pix', 'visa', 'mastercard', 'paypal'];
    
    paymentMethods.forEach(method => {
        // Verificar disponibilidade de cada método
        checkPaymentMethodAvailability(method);
    });
}

function checkPaymentMethodAvailability(method) {
    // Simular verificação de disponibilidade
    setTimeout(() => {
        const statusElement = document.querySelector(`[data-payment="${method}"]`);
        if (statusElement) {
            statusElement.classList.add('payment-available');
            statusElement.title = `${method.toUpperCase()} disponível e funcionando`;
        }
    }, Math.random() * 2000);
}

function initSocialIntegration() {
    // Integração com redes sociais
    loadSocialProof();
}



function loadSocialProof() {
    // Simular carregamento de prova social
    setTimeout(() => {
        showSocialProof();
    }, 15000);
}

function showSocialProof() {
    const proof = document.createElement('section');
    proof.className = 'social-proof';
    proof.innerHTML = `
        <section class="proof-content">
            👥 <strong>127 pessoas</strong> visualizaram esta página nas últimas 24h
        </section>
    `;
    
    proof.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 12px 20px;
        border-radius: 25px;
        font-size: 0.9rem;
        z-index: 999;
        animation: pulse 2s infinite;
    `;
    
    document.body.appendChild(proof);
    
    // Auto-remove após 10 segundos
    setTimeout(() => proof.remove(), 10000);
}

function initAnalyticsIntegration() {
    // Integração com analytics (simulado)
    trackPageView();
    trackUserInteractions();
}

function trackPageView() {
    // Simular envio para analytics
    console.log('📊 Page view tracked:', {
        page: window.location.pathname,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent
    });
}

function trackUserInteractions() {
    // Track clicks, scrolls, time on page
    let timeOnPage = 0;
    let scrollDepth = 0;
    let clicks = 0;
    
    setInterval(() => timeOnPage++, 1000);
    
    window.addEventListener('scroll', () => {
        const newScrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (newScrollDepth > scrollDepth) {
            scrollDepth = newScrollDepth;
        }
    });
    
    document.addEventListener('click', () => clicks++);
    
    // Enviar dados periodicamente
    setInterval(() => {
        console.log('📊 User interaction data:', {
            timeOnPage,
            scrollDepth,
            clicks,
            timestamp: new Date().toISOString()
        });
    }, 30000);
}

function initAPIIntegrations() {
    // Simular integrações com APIs externas
    loadWeatherAPI();
}

function loadWeatherAPI() {
    // Simular carregamento de dados de clima
    setTimeout(() => {
        const weatherWidget = document.createElement('section');
        weatherWidget.className = 'weather-widget';
        weatherWidget.innerHTML = `
            <section class="weather-content">
                🌤️ Rio de Janeiro: 28°C
            </section>
        `;
        
        weatherWidget.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: rgba(255,255,255,0.9);
            padding: 10px 15px;
            border-radius: 20px;
            font-size: 0.9rem;
            z-index: 999;
            backdrop-filter: blur(10px);
        `;
        
        document.body.appendChild(weatherWidget);
    }, 5000);
}



// === SUPPORT FEATURES ===
function initSupportFeatures() {
    initSupportAnalytics();
}

// === UTILITY FUNCTIONS ===
function showNotification(message, type = 'info') {
    const notification = document.createElement('section');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 4000);
}

// === GLOBAL FUNCTIONS ===

window.openWhatsApp = function() {
    const message = encodeURIComponent('Olá! Gostaria de informações sobre os pacotes de viagem.');
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
};

window.callSupport = function() {
    showNotification('📞 Redirecionando para ligação...', 'info');
    setTimeout(() => {
        alert('Ligue para: (11) 9999-9999\nAtendimento 24/7');
    }, 1000);
};



// === CSS ANIMATIONS ===
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`;
document.head.appendChild(style);

// Inicializar contadores de visitas
localStorage.setItem('pageVisits', (parseInt(localStorage.getItem('pageVisits') || '0') + 1).toString());

// Sistema de gerenciamento de cookies para Eco Companion
// Compatível com LGPD e GDPR

class CookieManager {
    constructor() {
        this.cookieSettings = {
            essential: true, // Sempre verdadeiro, não pode ser desabilitado
            performance: false,
            functionality: false,
            marketing: false
        };
        
        this.cookieNames = {
            consent: 'eco_cookie_consent',
            settings: 'eco_cookie_settings'
        };
        
        this.init();
    }
    
    init() {
        // Verificar se já existe consentimento
        const existingConsent = this.getCookie(this.cookieNames.consent);
        const existingSettings = this.getCookie(this.cookieNames.settings);
        
        if (existingConsent && existingSettings) {
            // Carregar configurações salvas
            this.cookieSettings = JSON.parse(existingSettings);
            this.loadAllowedCookies();
        } else {
            // Mostrar banner de consentimento
            this.showCookieBanner();
        }
        
        // Adicionar event listeners
        this.addEventListeners();
    }
    
    showCookieBanner() {
        // Verificar se o banner já existe
        if (document.getElementById('cookie-banner')) return;
        
        const banner = document.createElement('section');
        banner.id = 'cookie-banner';
        banner.innerHTML = `
            <section class="cookie-banner-container">
                <section class="cookie-banner-content">
                    <section class="cookie-icon">🍪</section>
                    <section class="cookie-text">
                        <h4>Nós usamos cookies</h4>
                        <p>Este site usa cookies para melhorar sua experiência de navegação, personalizar conteúdo e analisar nosso tráfego. Ao continuar navegando, você concorda com nossa <a href="/cookies" target="_blank">Política de Cookies</a>.</p>
                    </section>
                </section>
                <section class="cookie-actions">
                    <button id="accept-all-cookies" class="btn-accept-all">
                        ✅ Aceitar Todos
                    </button>
                    <button id="manage-cookies" class="btn-manage">
                        ⚙️ Gerenciar
                    </button>
                    <button id="reject-optional-cookies" class="btn-reject">
                        ❌ Apenas Essenciais
                    </button>
                </section>
            </section>
        `;
        
        document.body.appendChild(banner);
        
        // Animar entrada
        setTimeout(() => {
            banner.classList.add('show');
        }, 100);
    }
    
    showCookieSettings() {
        // Verificar se o modal já existe
        if (document.getElementById('cookie-settings-modal')) return;
        
        const modal = document.createElement('section');
        modal.id = 'cookie-settings-modal';
        modal.innerHTML = `
            <section class="cookie-modal-overlay">
                <section class="cookie-modal-content">
                    <section class="cookie-modal-header">
                        <h3>⚙️ Configurações de Cookies</h3>
                        <button class="cookie-modal-close" aria-label="Fechar">×</button>
                    </section>
                    
                    <section class="cookie-modal-body">
                        <p>Personalize suas preferências de cookies. Você pode alterar essas configurações a qualquer momento.</p>
                        
                        <section class="cookie-category-settings">
                            <section class="cookie-category-item">
                                <section class="cookie-category-header">
                                    <h4>🔧 Cookies Essenciais</h4>
                                    <label class="cookie-toggle disabled">
                                        <input type="checkbox" checked disabled>
                                        <span class="slider"></span>
                                    </label>
                                </section>
                                <p>Necessários para o funcionamento básico do site. Não podem ser desabilitados.</p>
                            </section>
                            
                            <section class="cookie-category-item">
                                <section class="cookie-category-header">
                                    <h4>📊 Cookies de Performance</h4>
                                    <label class="cookie-toggle">
                                        <input type="checkbox" id="performance-cookies" ${this.cookieSettings.performance ? 'checked' : ''}>
                                        <span class="slider"></span>
                                    </label>
                                </section>
                                <p>Ajudam a entender como os visitantes interagem com o site através de dados anônimos.</p>
                            </section>
                            
                            <section class="cookie-category-item">
                                <section class="cookie-category-header">
                                    <h4>🎯 Cookies de Funcionalidade</h4>
                                    <label class="cookie-toggle">
                                        <input type="checkbox" id="functionality-cookies" ${this.cookieSettings.functionality ? 'checked' : ''}>
                                        <span class="slider"></span>
                                    </label>
                                </section>
                                <p>Permitem funcionalidades aprimoradas e personalizadas baseadas em suas escolhas.</p>
                            </section>
                            
                            <section class="cookie-category-item">
                                <section class="cookie-category-header">
                                    <h4>📢 Cookies de Marketing</h4>
                                    <label class="cookie-toggle">
                                        <input type="checkbox" id="marketing-cookies" ${this.cookieSettings.marketing ? 'checked' : ''}>
                                        <span class="slider"></span>
                                    </label>
                                </section>
                                <p>Utilizados para personalizar anúncios e medir a eficácia das campanhas publicitárias.</p>
                            </section>
                        </section>
                    </section>
                    
                    <section class="cookie-modal-footer">
                        <button id="save-cookie-preferences" class="btn-save">💾 Salvar Preferências</button>
                        <button id="accept-all-from-modal" class="btn-accept">✅ Aceitar Todos</button>
                    </section>
                </section>
            </section>
        `;
        
        document.body.appendChild(modal);
        
        // Animar entrada
        setTimeout(() => {
            modal.classList.add('show');
        }, 100);
        
        // Focar no primeiro elemento
        const firstInput = modal.querySelector('input[type="checkbox"]:not([disabled])');
        if (firstInput) firstInput.focus();
    }
    
    addEventListeners() {
        // Event delegation para elementos que podem ser criados dinamicamente
        document.addEventListener('click', (e) => {
            if (e.target.id === 'accept-all-cookies' || e.target.id === 'accept-all-from-modal') {
                this.acceptAllCookies();
            } else if (e.target.id === 'reject-optional-cookies') {
                this.rejectOptionalCookies();
            } else if (e.target.id === 'manage-cookies') {
                this.showCookieSettings();
            } else if (e.target.id === 'save-cookie-preferences') {
                this.saveCookiePreferences();
            } else if (e.target.classList.contains('cookie-modal-close')) {
                this.closeCookieModal();
            }
        });
        
        // Fechar modal ao clicar fora
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('cookie-modal-overlay')) {
                this.closeCookieModal();
            }
        });
        
        // Tecla ESC para fechar modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeCookieModal();
            }
        });
    }
    
    acceptAllCookies() {
        this.cookieSettings = {
            essential: true,
            performance: true,
            functionality: true,
            marketing: true
        };
        
        this.saveConsentAndSettings();
        this.hideCookieBanner();
        this.closeCookieModal();
        this.loadAllowedCookies();
        this.showNotification('✅ Todos os cookies foram aceitos!', 'success');
    }
    
    rejectOptionalCookies() {
        this.cookieSettings = {
            essential: true,
            performance: false,
            functionality: false,
            marketing: false
        };
        
        this.saveConsentAndSettings();
        this.hideCookieBanner();
        this.closeCookieModal();
        this.clearNonEssentialCookies();
        this.showNotification('ℹ️ Apenas cookies essenciais foram mantidos.', 'info');
    }
    
    saveCookiePreferences() {
        const modal = document.getElementById('cookie-settings-modal');
        if (!modal) return;
        
        this.cookieSettings = {
            essential: true, // Sempre verdadeiro
            performance: modal.querySelector('#performance-cookies').checked,
            functionality: modal.querySelector('#functionality-cookies').checked,
            marketing: modal.querySelector('#marketing-cookies').checked
        };
        
        this.saveConsentAndSettings();
        this.hideCookieBanner();
        this.closeCookieModal();
        this.loadAllowedCookies();
        this.showNotification('💾 Suas preferências foram salvas!', 'success');
    }
    
    saveConsentAndSettings() {
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1 ano
        
        this.setCookie(this.cookieNames.consent, 'true', expiryDate);
        this.setCookie(this.cookieNames.settings, JSON.stringify(this.cookieSettings), expiryDate);
    }
    
    loadAllowedCookies() {
        // Carregar cookies baseado nas preferências
        if (this.cookieSettings.performance) {
            this.loadPerformanceCookies();
        }
        
        if (this.cookieSettings.functionality) {
            this.loadFunctionalityCookies();
        }
        
        if (this.cookieSettings.marketing) {
            this.loadMarketingCookies();
        }
    }
    
    loadPerformanceCookies() {
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
        
        console.log('📊 Cookies de performance carregados');
    }
    
    loadFunctionalityCookies() {
        // Carregar preferências do usuário
        this.loadUserPreferences();
        console.log('🎯 Cookies de funcionalidade carregados');
    }
    
    loadMarketingCookies() {
        // Facebook Pixel, Google Ads, etc.
        if (typeof fbq !== 'undefined') {
            fbq('consent', 'grant');
        }
        
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'ad_storage': 'granted'
            });
        }
        
        console.log('📢 Cookies de marketing carregados');
    }
    
    clearNonEssentialCookies() {
        // Lista de cookies não essenciais para remover
        const nonEssentialCookies = ['_ga', '_gid', '_fbp', 'ads_data', 'remarketing_id'];
        
        nonEssentialCookies.forEach(cookieName => {
            this.deleteCookie(cookieName);
        });
        
        // Revogar consentimento para serviços externos
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied'
            });
        }
        
        if (typeof fbq !== 'undefined') {
            fbq('consent', 'revoke');
        }
    }
    
    loadUserPreferences() {
        const preferences = this.getCookie('user_preferences');
        if (preferences) {
            try {
                const prefs = JSON.parse(preferences);
                // Aplicar preferências (tema, idioma, etc.)
                if (prefs.theme) {
                    document.documentElement.setAttribute('data-theme', prefs.theme);
                }
            } catch (e) {
                console.warn('Erro ao carregar preferências do usuário:', e);
            }
        }
    }
    
    hideCookieBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.add('hide');
            setTimeout(() => {
                banner.remove();
            }, 300);
        }
    }
    
    closeCookieModal() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.classList.add('hide');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('section');
        notification.className = `cookie-notification ${type}`;
        notification.innerHTML = `
            <section class="notification-content">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" aria-label="Fechar">×</button>
            </section>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.add('hide');
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    // Métodos utilitários para cookies
    setCookie(name, value, expires, path = '/') {
        let cookieString = `${name}=${encodeURIComponent(value)}`;
        
        if (expires) {
            cookieString += `; expires=${expires.toUTCString()}`;
        }
        
        cookieString += `; path=${path}`;
        cookieString += `; SameSite=Lax`;
        
        if (location.protocol === 'https:') {
            cookieString += `; Secure`;
        }
        
        document.cookie = cookieString;
    }
    
    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) {
                return decodeURIComponent(c.substring(nameEQ.length, c.length));
            }
        }
        return null;
    }
    
    deleteCookie(name, path = '/') {
        this.setCookie(name, '', new Date(0), path);
    }
    
    // Métodos públicos para usar nas páginas
    hasConsent(type) {
        return this.cookieSettings[type] || false;
    }
    
    updatePreference(type, value) {
        if (type in this.cookieSettings && type !== 'essential') {
            this.cookieSettings[type] = value;
            this.saveConsentAndSettings();
            
            if (value) {
                // Carregar cookies específicos
                switch (type) {
                    case 'performance':
                        this.loadPerformanceCookies();
                        break;
                    case 'functionality':
                        this.loadFunctionalityCookies();
                        break;
                    case 'marketing':
                        this.loadMarketingCookies();
                        break;
                }
            } else {
                // Limpar cookies específicos
                this.clearSpecificCookies(type);
            }
        }
    }
    
    clearSpecificCookies(type) {
        const cookiesByType = {
            performance: ['_ga', '_gid', 'performance_data'],
            functionality: ['user_preferences', 'language', 'theme'],
            marketing: ['_fbp', 'ads_data', 'remarketing_id']
        };
        
        if (cookiesByType[type]) {
            cookiesByType[type].forEach(cookie => this.deleteCookie(cookie));
        }
    }
    
    openSettings() {
        this.showCookieSettings();
    }
    
    getSettings() {
        return { ...this.cookieSettings };
    }
}

// Funções globais para usar nas páginas
function openCookieSettings() {
    if (window.cookieManager) {
        window.cookieManager.openSettings();
    }
}

function acceptAllCookies() {
    if (window.cookieManager) {
        window.cookieManager.acceptAllCookies();
    }
}

function rejectNonEssentialCookies() {
    if (window.cookieManager) {
        window.cookieManager.rejectOptionalCookies();
    }
}

// Inicializar o gerenciador de cookies quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    window.cookieManager = new CookieManager();
});

// Exportar para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CookieManager;
}

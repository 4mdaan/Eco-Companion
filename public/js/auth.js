// JavaScript para páginas de autenticação

document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema de autenticação carregado');
    
    // Inicializar funcionalidades
    initPasswordToggle();
    initFormValidation();
    initSocialLogin();
    initAccessibilityFeatures();
    
    // Auto-hide alerts após 5 segundos
    autoHideAlerts();
    
    // Mostrar indicações visuais de campos obrigatórios
    highlightRequiredFields();
    
    // Log para debugging
    console.log('✅ Validação de login inicializada');
});

/**
 * Toggle de visibilidade da senha
 */
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const button = field.parentElement.querySelector('.password-toggle');
    const showIcon = button.querySelector('.show-password');
    const hideIcon = button.querySelector('.hide-password');
    
    if (field.type === 'password') {
        field.type = 'text';
        showIcon.style.display = 'none';
        hideIcon.style.display = 'block';
    } else {
        field.type = 'password';
        showIcon.style.display = 'block';
        hideIcon.style.display = 'none';
    }
}

/**
 * Inicializa funcionalidades do toggle de senha
 */
function initPasswordToggle() {
    const passwordFields = document.querySelectorAll('input[type="password"]');
    
    passwordFields.forEach(field => {
        const toggle = field.parentElement.querySelector('.password-toggle');
        if (toggle) {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                togglePassword(field.id);
            });
        }
    });
}

/**
 * Validação de formulários em tempo real
 */
function initFormValidation() {
    const forms = document.querySelectorAll('.auth-form');
    
    forms.forEach(form => {
        // Selecionar campos uma única vez
        const emailField = form.querySelector('input[type="email"]');
        const passwordField = form.querySelector('input[name="senha"]');
        const confirmField = form.querySelector('input[name="confirmarSenha"]');
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Validação de email
        if (emailField) {
            emailField.addEventListener('blur', validateEmail);
            emailField.addEventListener('input', clearFieldError);
            emailField.addEventListener('input', () => updateFieldStatus(emailField));
            emailField.addEventListener('blur', () => updateFieldStatus(emailField));
        }
        
        // Validação de senha
        if (passwordField) {
            passwordField.addEventListener('input', validatePassword);
            passwordField.addEventListener('blur', validateLoginPassword);
            passwordField.addEventListener('input', () => updateFieldStatus(passwordField));
            passwordField.addEventListener('blur', () => updateFieldStatus(passwordField));
        }
        
        // Confirmação de senha
        if (confirmField && passwordField) {
            confirmField.addEventListener('input', () => validatePasswordMatch(passwordField, confirmField));
            passwordField.addEventListener('input', () => validatePasswordMatch(passwordField, confirmField));
        }
        
        // Validação no submit
        form.addEventListener('submit', (e) => {
            if (!validateLoginForm(form)) {
                e.preventDefault();
            }
        });
        
        // Adicionar loading state ao botão de submit
        if (submitBtn) {
            form.addEventListener('submit', (e) => {
                if (validateLoginForm(form)) {
                    showLoadingState(submitBtn);
                }
            });
        }
        
        // Atualizar contador de tentativas
        updateAttemptsCounter();
    });
}

/**
 * Valida campo de email
 */
function validateEmail(event) {
    const field = event.target;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (field.value && !emailRegex.test(field.value)) {
        showFieldError(field, 'Email inválido');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

/**
 * Valida força da senha (para registro)
 */
function validatePassword(event) {
    const field = event.target;
    const password = field.value;
    
    if (password.length === 0) {
        clearFieldError(field);
        return true;
    }
    
    if (password.length < 6) {
        showFieldError(field, 'Senha deve ter pelo menos 6 caracteres');
        return false;
    }
    
    // Verificar força da senha
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    const strengthTexts = ['Muito fraca', 'Fraca', 'Regular', 'Boa', 'Forte'];
    const strengthColors = ['#ef4444', '#f59e0b', '#eab308', '#22c55e', '#16a34a'];
    
    showPasswordStrength(field, strengthTexts[strength], strengthColors[strength]);
    
    clearFieldError(field);
    return true;
}

/**
 * Valida senha para login (menos rigorosa)
 */
function validateLoginPassword(event) {
    const field = event.target;
    const password = field.value;
    
    if (password.length === 0) {
        showFieldError(field, 'Senha é obrigatória');
        return false;
    }
    
    if (password.length < 3) {
        showFieldError(field, 'Senha muito curta');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

/**
 * Validação completa do formulário de login
 */
function validateLoginForm(form) {
    // Verificar rate limiting primeiro
    if (!checkRateLimit()) {
        updateAttemptsCounter();
        return false;
    }
    
    let isValid = true;
    const errors = [];
    
    // Validar email
    const emailField = form.querySelector('input[type="email"]');
    if (emailField) {
        const email = emailField.value.trim();
        
        if (!email) {
            showFieldError(emailField, 'Email é obrigatório');
            errors.push('Email é obrigatório');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showFieldError(emailField, 'Email inválido');
            errors.push('Email inválido');
            isValid = false;
        } else {
            clearFieldError(emailField);
        }
        
        updateFieldStatus(emailField);
    }
    
    // Validar senha
    const passwordField = form.querySelector('input[name="senha"]');
    if (passwordField) {
        const password = passwordField.value;
        
        if (!password) {
            showFieldError(passwordField, 'Senha é obrigatória');
            errors.push('Senha é obrigatória');
            isValid = false;
        } else if (password.length < 3) {
            showFieldError(passwordField, 'Senha muito curta');
            errors.push('Senha muito curta');
            isValid = false;
        } else {
            clearFieldError(passwordField);
        }
        
        updateFieldStatus(passwordField);
    }
    
    // Mostrar resumo de validação
    showValidationSummary(errors);
    
    // Validações de segurança adicional
    if (isValid) {
        validateSecurityFields(form);
    }
    
    // Mostrar feedback visual
    if (isValid) {
        showNotification('✅ Validando credenciais...', 'info');
    } else {
        showNotification('❌ Por favor, corrija os erros antes de continuar', 'error');
        // Incrementar tentativas apenas em caso de erro
        updateAttemptsCounter();
    }
    
    return isValid;
}

/**
 * Verifica se o email é válido
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Valida se as senhas coincidem
 */
function validatePasswordMatch(passwordField, confirmField) {
    if (confirmField.value === '') {
        clearFieldError(confirmField);
        return true;
    }
    
    if (passwordField.value !== confirmField.value) {
        showFieldError(confirmField, 'As senhas não coincidem');
        return false;
    }
    
    clearFieldError(confirmField);
    return true;
}

/**
 * Mostra indicador de força da senha
 */
function showPasswordStrength(field, text, color) {
    let indicator = field.parentElement.parentElement.querySelector('.password-strength');
    
    if (!indicator) {
        indicator = document.createElement('section');
        indicator.className = 'password-strength';
        field.parentElement.parentElement.appendChild(indicator);
    }
    
    indicator.innerHTML = `
        <section class="strength-bar">
            <section class="strength-fill" style="width: ${(text === 'Muito fraca' ? 20 : text === 'Fraca' ? 40 : text === 'Regular' ? 60 : text === 'Boa' ? 80 : 100)}%; background: ${color}"></section>
        </div>
        <span style="color: ${color}; font-size: 0.75rem; font-weight: 500;">${text}</span>
    `;
    
    // Adicionar CSS se não existir
    if (!document.querySelector('#password-strength-styles')) {
        const styles = document.createElement('style');
        styles.id = 'password-strength-styles';
        styles.textContent = `
            .password-strength {
                margin-top: 0.5rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .strength-bar {
                flex: 1;
                height: 4px;
                background: #e2e8f0;
                border-radius: 2px;
                overflow: hidden;
            }
            .strength-fill {
                height: 100%;
                transition: width 0.3s ease;
                border-radius: 2px;
            }
        `;
        document.head.appendChild(styles);
    }
}

/**
 * Mostra erro em campo específico
 */
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#ef4444';
    
    const error = document.createElement('section');
    error.className = 'field-error';
    error.textContent = message;
    error.style.cssText = `
        color: #ef4444;
        font-size: 0.75rem;
        margin-top: 0.25rem;
        font-weight: 500;
    `;
    
    field.parentElement.appendChild(error);
}

/**
 * Remove erro do campo
 */
function clearFieldError(field) {
    const error = field.parentElement.querySelector('.field-error');
    if (error) {
        error.remove();
    }
    
    if (field.target) {
        field = field.target;
    }
    
    field.style.borderColor = '#e2e8f0';
}

/**
 * Valida formulário completo
 */
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('input[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'Este campo é obrigatório');
            isValid = false;
        }
    });
    
    // Validações específicas
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            showFieldError(emailField, 'Email inválido');
            isValid = false;
        }
    }
    
    const passwordField = form.querySelector('input[name="senha"]');
    const confirmField = form.querySelector('input[name="confirmarSenha"]');
    
    if (passwordField && passwordField.value.length < 6) {
        showFieldError(passwordField, 'Senha deve ter pelo menos 6 caracteres');
        isValid = false;
    }
    
    if (confirmField && passwordField && passwordField.value !== confirmField.value) {
        showFieldError(confirmField, 'As senhas não coincidem');
        isValid = false;
    }
    
    const termsField = form.querySelector('input[name="termos"]');
    if (termsField && !termsField.checked) {
        showFieldError(termsField.parentElement, 'Você deve aceitar os termos de uso');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Inicializa login social (placeholder)
 */
function initSocialLogin() {
    const googleBtn = document.querySelector('.btn-google');
    const facebookBtn = document.querySelector('.btn-facebook');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            showNotification('Login com Google em desenvolvimento', 'info');
        });
    }
    
    if (facebookBtn) {
        facebookBtn.addEventListener('click', () => {
            showNotification('Login com Facebook em desenvolvimento', 'info');
        });
    }
}

/**
 * Auto-hide dos alerts
 */
function autoHideAlerts() {
    const alerts = document.querySelectorAll('.alert');
    
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.opacity = '0';
            alert.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                if (alert.parentElement) {
                    alert.remove();
                }
            }, 300);
        }, 5000);
    });
}

/**
 * Sistema de notificações
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('section');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <section class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
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
    
    document.body.appendChild(notification);
    
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
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || icons.info;
}

/**
 * Mostra estado de loading no botão
 */
function showLoadingState(button) {
    const originalText = button.innerHTML;
    const originalDisabled = button.disabled;
    
    button.disabled = true;
    button.innerHTML = `
        <span class="loading-spinner"></span>
        Entrando...
    `;
    
    // Adicionar CSS para spinner se não existir
    if (!document.querySelector('#loading-spinner-styles')) {
        const styles = document.createElement('style');
        styles.id = 'loading-spinner-styles';
        styles.textContent = `
            .loading-spinner {
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid #ffffff40;
                border-left-color: #ffffff;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-right: 8px;
            }
            
            @keyframes spin {
                to {
                    transform: rotate(360deg);
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Restaurar estado original após timeout (caso não haja redirecionamento)
    setTimeout(() => {
        button.disabled = originalDisabled;
        button.innerHTML = originalText;
    }, 10000);
}

/**
 * Validação de segurança adicional
 */
function validateSecurityFields(form) {
    const emailField = form.querySelector('input[type="email"]');
    const passwordField = form.querySelector('input[name="senha"]');
    
    if (emailField && passwordField) {
        const email = emailField.value.trim();
        const password = passwordField.value;
        
        // Verificar se não são valores padrão/suspeitos
        const suspiciousPatterns = [
            'test@test.com',
            'admin@admin.com', 
            '123456',
            'password',
            'admin'
        ];
        
        // Avisos para senhas fracas comuns
        if (suspiciousPatterns.some(pattern => 
            email.toLowerCase().includes(pattern) || 
            password.toLowerCase().includes(pattern))) {
            
            showNotification('⚠️ Credenciais detectadas como potencialmente inseguras', 'warning');
        }
        
        // Validar domínio de email
        const emailDomain = email.split('@')[1];
        if (emailDomain && ['tempmail.com', '10minutemail.com', 'guerrillamail.com'].includes(emailDomain)) {
            showNotification('⚠️ Emails temporários podem causar problemas de recuperação', 'warning');
        }
    }
}

/**
 * Detectar tentativas de força bruta
 */
let loginAttempts = 0;
let lastAttemptTime = 0;

function checkRateLimit() {
    const currentTime = Date.now();
    const timeDiff = currentTime - lastAttemptTime;
    
    // Reset contador após 5 minutos
    if (timeDiff > 300000) {
        loginAttempts = 0;
    }
    
    loginAttempts++;
    lastAttemptTime = currentTime;
    
    // Bloquear após 5 tentativas
    if (loginAttempts >= 5) {
        const waitTime = Math.min(300, loginAttempts * 30); // Máximo 5 minutos
        showNotification(`🚫 Muitas tentativas. Tente novamente em ${waitTime} segundos`, 'error');
        
        // Desabilitar formulário temporariamente
        const form = document.querySelector('.auth-form');
        if (form) {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                setTimeout(() => {
                    submitBtn.disabled = false;
                }, waitTime * 1000);
            }
        }
        
        return false;
    }
    
    return true;
}

/**
 * Atualiza o status visual dos campos
 */
function updateFieldStatus(field) {
    const wrapper = field.closest('.form-group');
    const inputStatus = wrapper.querySelector('.input-status');
    
    if (!inputStatus) return;
    
    const validIcon = inputStatus.querySelector('.valid-icon');
    const invalidIcon = inputStatus.querySelector('.invalid-icon');
    
    // Reset icons
    validIcon.style.display = 'none';
    invalidIcon.style.display = 'none';
    
    if (field.value.trim() === '') {
        field.removeAttribute('aria-invalid');
        return;
    }
    
    let isValid = true;
    
    if (field.type === 'email') {
        isValid = isValidEmail(field.value);
    } else if (field.name === 'senha') {
        isValid = field.value.length >= 3;
    }
    
    if (isValid) {
        validIcon.style.display = 'inline';
        field.setAttribute('aria-invalid', 'false');
    } else {
        invalidIcon.style.display = 'inline';
        field.setAttribute('aria-invalid', 'true');
    }
}

/**
 * Atualiza contador de tentativas de login
 */
function updateAttemptsCounter() {
    const attemptsContainer = document.querySelector('.login-attempts');
    const attemptsRemaining = document.getElementById('attempts-remaining');
    
    if (attemptsContainer && attemptsRemaining) {
        const remaining = Math.max(0, 5 - loginAttempts);
        attemptsRemaining.textContent = remaining;
        
        if (loginAttempts >= 3) {
            attemptsContainer.style.display = 'block';
        } else {
            attemptsContainer.style.display = 'none';
        }
        
        if (remaining === 0) {
            attemptsContainer.style.background = '#fee2e2';
            attemptsContainer.style.color = '#dc2626';
        }
    }
}

/**
 * Mostra resumo de validação
 */
function showValidationSummary(errors) {
    const summary = document.querySelector('.validation-summary');
    
    if (!summary) return;
    
    if (errors.length === 0) {
        summary.style.display = 'none';
        return;
    }
    
    const validationText = summary.querySelector('.validation-text');
    if (validationText) {
        validationText.textContent = errors[0]; // Mostrar primeiro erro
    }
    
    summary.style.display = 'block';
}

/**
 * Destaca campos obrigatórios
 */
function highlightRequiredFields() {
    const requiredFields = document.querySelectorAll('input[required]');
    requiredFields.forEach(field => {
        const label = document.querySelector(`label[for="${field.id}"]`);
        if (label && !label.textContent.includes('*')) {
            // Já marcado no HTML, mas garantir visualmente
            field.setAttribute('aria-required', 'true');
        }
    });
}

/**
 * Funcionalidades de acessibilidade
 */
function initAccessibilityFeatures() {
    // Adicionar descrições para screen readers
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('senha');
    
    if (emailField) {
        emailField.setAttribute('aria-describedby', 'email-help');
        const helpText = document.createElement('span');
        helpText.id = 'email-help';
        helpText.className = 'sr-only';
        helpText.textContent = 'Digite seu endereço de email válido';
        emailField.parentElement.appendChild(helpText);
    }
    
    if (passwordField) {
        passwordField.setAttribute('aria-describedby', 'password-help');
        const helpText = document.createElement('span');
        helpText.id = 'password-help';
        helpText.className = 'sr-only';
        helpText.textContent = 'Digite sua senha, mínimo 3 caracteres';
        passwordField.parentElement.appendChild(helpText);
    }
}

/**
 * Limpeza de recursos ao sair da página
 */
window.addEventListener('beforeunload', function() {
    // Limpar timers se houver
    const submitBtn = document.querySelector('#login-btn');
    if (submitBtn && submitBtn.disabled) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span class="btn-text">Entrar</span><span class="btn-icon">→</span>';
    }
    
    // Log para debugging
    console.log('🔄 Recursos de validação limpos');
});
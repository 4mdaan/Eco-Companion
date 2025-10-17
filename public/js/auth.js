// JavaScript para páginas de autenticação

document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema de autenticação carregado');
    
    // Inicializar funcionalidades
    initPasswordToggle();
    initFormValidation();
    initSocialLogin();
    
    // Auto-hide alerts após 5 segundos
    autoHideAlerts();
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
        // Validação de email
        const emailField = form.querySelector('input[type="email"]');
        if (emailField) {
            emailField.addEventListener('blur', validateEmail);
            emailField.addEventListener('input', clearFieldError);
        }
        
        // Validação de senha
        const passwordField = form.querySelector('input[name="senha"]');
        if (passwordField) {
            passwordField.addEventListener('input', validatePassword);
        }
        
        // Confirmação de senha
        const confirmField = form.querySelector('input[name="confirmarSenha"]');
        if (confirmField && passwordField) {
            confirmField.addEventListener('input', () => validatePasswordMatch(passwordField, confirmField));
            passwordField.addEventListener('input', () => validatePasswordMatch(passwordField, confirmField));
        }
        
        // Validação no submit
        form.addEventListener('submit', (e) => {
            if (!validateForm(form)) {
                e.preventDefault();
            }
        });
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
 * Valida força da senha
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
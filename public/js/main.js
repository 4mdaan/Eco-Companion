// JavaScript principal da aplicação

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar componentes quando a página carregar
    initMobileMenu();
    initScrollEffects();
    initCardHovers();
    updateCurrentYear();
    addLoadingToButtons();
    smoothScroll();
});

// Função para o menu mobile
function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Fechar menu ao clicar em um link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Fechar menu ao clicar fora dele
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Função para efeitos de scroll
function initScrollEffects() {
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Adicionar sombra no header quando fizer scroll
            if (scrollTop > 0) {
                header.classList.add('shadow-md');
            } else {
                header.classList.remove('shadow-md');
            }
            
            lastScrollTop = scrollTop;
        });
    }
}

// Função para hover nos cards
function initCardHovers() {
    const cards = document.querySelectorAll('article');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Atualizar o ano automaticamente
function updateCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Função para animação suave de scroll para âncoras
function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Função para loading state nos botões
function addLoadingToButtons() {
    const buttons = document.querySelectorAll('button[data-loading]');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const originalText = this.textContent;
            this.disabled = true;
            this.textContent = 'Carregando...';
            
            // Simular carregamento (remover em produção)
            setTimeout(() => {
                this.disabled = false;
                this.textContent = originalText;
            }, 2000);
        });
    });
}

// Função para notificações toast simples
function showToast(message, type = 'info') {
    const toast = document.createElement('section');
    toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        type === 'warning' ? 'bg-yellow-500' : 
        'bg-blue-500'
    }`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Remover após 3 segundos
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Exportar funções para uso global
window.showToast = showToast;
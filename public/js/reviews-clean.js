// Sistema de Reviews Limpo - Eco Companion
// Animações suaves e atualizações em tempo real

class CleanReviewsSystem {
    constructor() {
        this.reviewsData = [
            {
                name: "Felipe P.",
                avatar: "https://i.pravatar.cc/48?img=1",
                rating: 5,
                text: "Viagem incrível para o Rio! Tudo perfeito, recomendo muito!",
                time: "agora",
                isNew: true
            },
            {
                name: "João P.",
                avatar: "https://i.pravatar.cc/48?img=2", 
                rating: 5,
                text: "Lua de mel dos sonhos em Gramado! Obrigado Eco Companion ❤️",
                time: "2 min",
                isNew: false
            },
            {
                name: "Eduardo J.",
                avatar: "https://i.pravatar.cc/48?img=3",
                rating: 5,
                text: "Fernando de Noronha foi espetacular! Já quero voltar!",
                time: "5 min",
                isNew: false
            },
            {
                name: "Carlos L.",
                avatar: "https://i.pravatar.cc/48?img=4",
                rating: 5,
                text: "Família toda amou Porto Seguro! Atendimento nota 10!",
                time: "1 min",
                isNew: false
            },
            {
                name: "Lucia F.",
                avatar: "https://i.pravatar.cc/48?img=5",
                rating: 5,
                text: "Paris foi um sonho realizado! Cada detalhe foi perfeito!",
                time: "3 min",
                isNew: false
            },
            {
                name: "Pedro A.",
                avatar: "https://i.pravatar.cc/48?img=6",
                rating: 5,
                text: "Floripa superou expectativas! Praias lindas e hotel top!",
                time: "4 min",
                isNew: false
            }
        ];
        
        this.newReviews = [
            {
                name: "Sophie M.",
                avatar: "https://i.pravatar.cc/48?img=7",
                rating: 5,
                text: "Acabei de chegar de Búzios, foi maravilhoso! 🏖️",
                time: "agora"
            },
            {
                name: "Ricardo S.",
                avatar: "https://i.pravatar.cc/48?img=8",
                rating: 5,
                text: "Viagem corporativa perfeita! Equipe muito profissional!",
                time: "agora"
            },
            {
                name: "Camila R.",
                avatar: "https://i.pravatar.cc/48?img=9",
                rating: 5,
                text: "Mochilão pela Europa foi incrível! Já planejando o próximo!",
                time: "agora"
            },
            {
                name: "Felipe O.",
                avatar: "https://i.pravatar.cc/48?img=10",
                rating: 5,
                text: "Casal de idosos muito bem cuidado! Obrigado pela atenção! 👴👵",
                time: "agora"
            }
        ];
        
        this.currentNewIndex = 0;
        this.init();
    }
    
    init() {
        this.startCounterAnimations();
        this.startLiveUpdates();
        this.setupIntersectionObserver();
    }
    
    startCounterAnimations() {
        // Animar contadores quando a seção entrar na tela
        const counters = [
            { element: 'reviews-today', target: 127, duration: 2000 },
            { element: 'reviews-week', target: 892, duration: 2500 }
        ];
        
        counters.forEach(counter => {
            this.animateCounter(counter.element, counter.target, counter.duration);
        });
    }
    
    animateCounter(elementId, target, duration) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const start = 0;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeOut);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    startLiveUpdates() {
        // Simular novos reviews chegando
        setInterval(() => {
            this.addNewReview();
        }, 15000); // A cada 15 segundos
        
        // Atualizar tempos dos reviews
        setInterval(() => {
            this.updateReviewTimes();
        }, 60000); // A cada minuto
    }
    
    addNewReview() {
        if (this.currentNewIndex >= this.newReviews.length) {
            this.currentNewIndex = 0;
        }
        
        const newReview = this.newReviews[this.currentNewIndex];
        this.currentNewIndex++;
        
        // Encontrar o primeiro review da coluna esquerda para substituir
        const leftColumn = document.querySelector('.left-column');
        const firstReview = leftColumn.querySelector('.review-minimal:last-child');
        
        if (firstReview) {
            // Animação de saída
            firstReview.style.transition = 'all 0.3s ease';
            firstReview.style.opacity = '0';
            firstReview.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                // Remover o último review
                firstReview.remove();
                
                // Criar novo review
                const newReviewElement = this.createReviewElement(newReview, true);
                
                // Inserir no topo com animação
                leftColumn.insertBefore(newReviewElement, leftColumn.firstChild);
                
                // Mostrar notificação
                this.showNewReviewNotification();
                
            }, 300);
        }
    }
    
    createReviewElement(reviewData, isActive = false) {
        const reviewDiv = document.createElement('div');
        reviewDiv.className = `review-minimal ${isActive ? 'active' : ''}`;
        
        const stars = '★'.repeat(reviewData.rating);
        const onlineDot = isActive ? '<div class="online-dot"></div>' : '';
        
        reviewDiv.innerHTML = `
            <div class="review-avatar">
                <img src="${reviewData.avatar}" alt="${reviewData.name.split(' ')[0]}">
                ${onlineDot}
            </div>
            <div class="review-bubble">
                <div class="review-content">
                    <div class="review-meta">
                        <span class="reviewer-name">${reviewData.name}</span>
                        <div class="rating-stars">${stars}</div>
                        <span class="review-time">${reviewData.time}</span>
                    </div>
                    <p>"${reviewData.text}"</p>
                </div>
                <div class="bubble-tail"></div>
            </div>
        `;
        
        return reviewDiv;
    }
    
    updateReviewTimes() {
        const timeElements = document.querySelectorAll('.review-time');
        
        timeElements.forEach(element => {
            const currentText = element.textContent.trim();
            
            if (currentText === 'agora') {
                element.textContent = '1 min';
            } else if (currentText.includes('min')) {
                const minutes = parseInt(currentText.match(/\d+/)?.[0] || 1);
                element.textContent = `${minutes + 1} min`;
            }
        });
        
        // Atualizar contadores
        this.incrementCounters();
    }
    
    incrementCounters() {
        const todayCounter = document.getElementById('reviews-today');
        const weekCounter = document.getElementById('reviews-week');
        
        if (todayCounter) {
            const current = parseInt(todayCounter.textContent) + 1;
            todayCounter.textContent = current;
        }
        
        if (weekCounter) {
            const current = parseInt(weekCounter.textContent) + 1;
            weekCounter.textContent = current;
        }
    }
    
    showNewReviewNotification() {
        // Criar notificação sutil
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 0.75rem 1rem;
            border-radius: 25px;
            font-size: 0.85rem;
            font-weight: 600;
            box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
            z-index: 10000;
            transform: translateX(100%);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;
        
        notification.innerHTML = '<span style="font-size: 1rem;">✨</span> Nova avaliação recebida!';
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animar saída
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 400);
        }, 3500);
    }
    
    setupIntersectionObserver() {
        const reviewsSection = document.querySelector('.reviews-section-clean');
        
        if (!reviewsSection) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Animar reviews com delay
                    const reviews = entry.target.querySelectorAll('.review-minimal');
                    reviews.forEach((review, index) => {
                        setTimeout(() => {
                            review.style.opacity = '1';
                            review.style.transform = 'translateY(0)';
                        }, index * 200);
                    });
                }
            });
        }, {
            threshold: 0.2
        });
        
        observer.observe(reviewsSection);
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    new CleanReviewsSystem();
});

// Adicionar estilos de animação de entrada
const style = document.createElement('style');
style.textContent = `
    .reviews-section-clean {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s ease;
    }
    
    .reviews-section-clean.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .review-minimal {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease;
    }
    
    /* Efeito de pulse para o badge AO VIVO */
    .reviews-badge-minimal {
        animation: badgePulse 2s ease-in-out infinite;
    }
    
    @keyframes badgePulse {
        0%, 100% { 
            transform: scale(1);
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }
        50% { 
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
        }
    }
`;

document.head.appendChild(style);
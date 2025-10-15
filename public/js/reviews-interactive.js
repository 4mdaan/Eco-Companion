// Reviews Interativos - Eco Companion
// Sistema de carousel e animações para reviews em tempo real

class ReviewsSystem {
    constructor() {
        this.currentIndex = 0;
        this.reviewsData = [
            {
                name: "Maria Silva",
                avatar: "https://i.pravatar.cc/60?img=1",
                rating: 5,
                text: "Experiência incrível! A Eco Companion superou todas as expectativas. O atendimento foi excepcional desde o primeiro contato até o retorno da viagem. Recomendo de olhos fechados!",
                tags: ["Atendimento Excepcional", "Organização Perfeita"],
                location: "Rio de Janeiro",
                time: "2 minutos",
                isLive: true
            },
            {
                name: "João Santos",
                avatar: "https://i.pravatar.cc/60?img=2",
                rating: 5,
                text: "Primeira vez que viajo com uma agência e foi perfeito! Tudo organizado nos mínimos detalhes. A lua de mel em Gramado foi um sonho!",
                tags: ["Lua de Mel Perfeita"],
                location: "São Paulo",
                time: "5 minutos",
                isLive: false
            },
            {
                name: "Ana Costa",
                avatar: "https://i.pravatar.cc/60?img=3",
                rating: 5,
                text: "Que viagem maravilhosa para Fernando de Noronha! Cada detalhe foi pensado com carinho. Já estou planejando a próxima aventura!",
                tags: ["Destino dos Sonhos"],
                location: "Belo Horizonte",
                time: "8 minutos",
                isLive: false
            },
            {
                name: "Carlos Oliveira",
                avatar: "https://i.pravatar.cc/60?img=4",
                rating: 5,
                text: "Serviço impecável! Desde o planejamento até a execução, tudo foi perfeito. A família inteira amou a viagem para Porto Seguro!",
                tags: ["Viagem em Família", "Serviço Impecável"],
                location: "Salvador",
                time: "12 minutos",
                isLive: false
            },
            {
                name: "Luciana Ferreira",
                avatar: "https://i.pravatar.cc/60?img=5",
                rating: 5,
                text: "Profissionalismo e dedicação em cada detalhe. A viagem para Paris foi exatamente como sonhamos. Obrigada por tudo!",
                tags: ["Sonho Realizado", "Paris Inesquecível"],
                location: "Brasília",
                time: "15 minutos",
                isLive: false
            }
        ];
        
        this.init();
    }
    
    init() {
        this.setupCarousel();
        this.animateStats();
        this.startAutoRotation();
        this.addEventListeners();
        this.simulateNewReviews();
    }
    
    setupCarousel() {
        const container = document.getElementById('reviews-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.reviewsData.forEach((review, index) => {
            const reviewCard = this.createReviewCard(review, index === 0);
            container.appendChild(reviewCard);
        });
    }
    
    createReviewCard(review, isFeatured = false) {
        const card = document.createElement('div');
        card.className = `review-card ${isFeatured ? 'featured' : ''}`;
        
        const stars = '★'.repeat(review.rating);
        const liveIndicator = review.isLive ? '<span class="live-indicator">🔴 AO VIVO</span>' : '';
        
        card.innerHTML = `
            <div class="review-header">
                <div class="reviewer-avatar">
                    <img src="${review.avatar}" alt="${review.name}" loading="lazy">
                </div>
                <div class="reviewer-info">
                    <h4 class="reviewer-name">${review.name}</h4>
                    <div class="review-rating">
                        <span class="stars">${stars}</span>
                        <span class="rating-text">${review.rating}.0</span>
                    </div>
                    <p class="review-date">Há ${review.time} • ${review.location}</p>
                </div>
                <div class="review-status">
                    ${liveIndicator}
                </div>
            </div>
            <div class="review-content">
                <p class="review-text">"${review.text}"</p>
                <div class="review-tags">
                    ${review.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        
        return card;
    }
    
    addEventListeners() {
        const prevBtn = document.getElementById('reviews-prev');
        const nextBtn = document.getElementById('reviews-next');
        const carousel = document.querySelector('.reviews-carousel');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousReview());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextReview());
        }
        
        // Touch/swipe support
        if (carousel) {
            let startX = 0;
            let currentX = 0;
            let isDragging = false;
            
            carousel.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isDragging = true;
            });
            
            carousel.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                currentX = e.touches[0].clientX;
            });
            
            carousel.addEventListener('touchend', () => {
                if (!isDragging) return;
                
                const diff = startX - currentX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        this.nextReview();
                    } else {
                        this.previousReview();
                    }
                }
                
                isDragging = false;
            });
        }
    }
    
    nextReview() {
        const carousel = document.querySelector('.reviews-carousel');
        if (!carousel) return;
        
        const cardWidth = 420; // 400px + 20px gap
        this.currentIndex = (this.currentIndex + 1) % this.reviewsData.length;
        
        carousel.scrollTo({
            left: this.currentIndex * cardWidth,
            behavior: 'smooth'
        });
        
        this.updateFeaturedCard();
    }
    
    previousReview() {
        const carousel = document.querySelector('.reviews-carousel');
        if (!carousel) return;
        
        const cardWidth = 420;
        this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.reviewsData.length - 1;
        
        carousel.scrollTo({
            left: this.currentIndex * cardWidth,
            behavior: 'smooth'
        });
        
        this.updateFeaturedCard();
    }
    
    updateFeaturedCard() {
        const cards = document.querySelectorAll('.review-card');
        cards.forEach((card, index) => {
            if (index === this.currentIndex) {
                card.classList.add('featured');
            } else {
                card.classList.remove('featured');
            }
        });
    }
    
    startAutoRotation() {
        setInterval(() => {
            this.nextReview();
        }, 5000); // Muda a cada 5 segundos
    }
    
    animateStats() {
        const stats = [
            { element: 'total-reviews', target: 2847, suffix: '' },
            { element: 'avg-rating', target: 4.9, suffix: '', decimal: true },
            { element: 'satisfaction', target: 98, suffix: '%' }
        ];
        
        stats.forEach(stat => {
            this.animateNumber(stat.element, stat.target, stat.suffix, stat.decimal);
        });
    }
    
    animateNumber(elementId, target, suffix = '', isDecimal = false) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const start = 0;
        const duration = 2000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = start + (target - start) * easeOut;
            
            if (isDecimal) {
                element.textContent = current.toFixed(1) + suffix;
            } else {
                element.textContent = Math.floor(current).toLocaleString() + suffix;
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    simulateNewReviews() {
        // Simula novos reviews chegando
        setInterval(() => {
            this.updateReviewTimes();
        }, 60000); // Atualiza a cada minuto
        
        // Adiciona um novo review ocasionalmente
        setInterval(() => {
            this.addNewReview();
        }, 300000); // A cada 5 minutos
    }
    
    updateReviewTimes() {
        const dateElements = document.querySelectorAll('.review-date');
        dateElements.forEach(element => {
            const text = element.textContent;
            const match = text.match(/Há (\d+) minutos/);
            if (match) {
                const minutes = parseInt(match[1]) + 1;
                element.textContent = text.replace(/Há \d+ minutos/, `Há ${minutes} minutos`);
            }
        });
    }
    
    addNewReview() {
        const newReviews = [
            {
                name: "Pedro Almeida",
                avatar: "https://i.pravatar.cc/60?img=6",
                rating: 5,
                text: "Acabei de voltar de Florianópolis e foi simplesmente perfeito! Recomendo a todos!",
                tags: ["Floripa Incrível"],
                location: "Curitiba",
                time: "agora",
                isLive: true
            },
            {
                name: "Carla Mendes",
                avatar: "https://i.pravatar.cc/60?img=7",
                rating: 5,
                text: "Que atendimento maravilhoso! Já estou planejando a próxima viagem com vocês!",
                tags: ["Atendimento Top"],
                location: "Recife",
                time: "agora",
                isLive: true
            }
        ];
        
        const randomReview = newReviews[Math.floor(Math.random() * newReviews.length)];
        
        // Remove o status "ao vivo" de outros reviews
        this.reviewsData.forEach(review => review.isLive = false);
        
        // Adiciona o novo review no início
        this.reviewsData.unshift(randomReview);
        
        // Mantém apenas os últimos 5 reviews
        if (this.reviewsData.length > 5) {
            this.reviewsData.pop();
        }
        
        // Atualiza a interface
        this.setupCarousel();
        this.showNewReviewNotification();
    }
    
    showNewReviewNotification() {
        // Cria uma notificação sutil de novo review
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 10000;
            font-weight: 600;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.innerHTML = '🌟 Novo review recebido!';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    new ReviewsSystem();
});

// Intersection Observer para animações quando a seção entra na tela
const observeReviews = () => {
    const reviewsSection = document.querySelector('.automated-reviews-section');
    
    if (!reviewsSection) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.2
    });
    
    observer.observe(reviewsSection);
};

// CSS para animação de entrada
const style = document.createElement('style');
style.textContent = `
    .automated-reviews-section {
        opacity: 0;
        transform: translateY(50px);
        transition: all 0.8s ease;
    }
    
    .automated-reviews-section.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .review-card {
        animation: slideInUp 0.6s ease forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Inicializar observer
document.addEventListener('DOMContentLoaded', observeReviews);
// Carrossel de Pacotes
class PackageCarousel {
    constructor() {
        this.track = document.getElementById('carousel-track');
        this.prevBtn = document.getElementById('carousel-prev');
        this.nextBtn = document.getElementById('carousel-next');
        this.indicatorsContainer = document.getElementById('carousel-indicators');
        
        if (!this.track) return;
        
        this.slides = this.track.querySelectorAll('.carousel-slide');
        this.currentIndex = 0;
        this.slidesToShow = this.getSlidesToShow();
        this.maxIndex = Math.max(0, this.slides.length - this.slidesToShow);
        this.autoplayInterval = null;
        this.autoplayDelay = 5000; // 5 segundos
        
        this.init();
    }
    
    init() {
        this.createIndicators();
        this.setupEventListeners();
        this.updateCarousel();
        this.startAutoplay();
        
        // Recalcular slides visíveis quando a janela redimensionar
        window.addEventListener('resize', () => {
            this.slidesToShow = this.getSlidesToShow();
            this.maxIndex = Math.max(0, this.slides.length - this.slidesToShow);
            this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
            this.updateCarousel();
        });
    }
    
    getSlidesToShow() {
        const containerWidth = this.track.parentElement.offsetWidth;
        const slideWidth = 350; // Width from CSS
        const gap = 24; // Gap from CSS (1.5rem = 24px)
        
        if (window.innerWidth <= 480) {
            return 1;
        } else if (window.innerWidth <= 768) {
            return Math.floor((containerWidth + gap) / (300 + gap));
        } else {
            return Math.floor((containerWidth + gap) / (slideWidth + gap));
        }
    }
    
    createIndicators() {
        if (!this.indicatorsContainer) return;
        
        this.indicatorsContainer.innerHTML = '';
        const totalPages = this.maxIndex + 1;
        
        for (let i = 0; i < totalPages; i++) {
            const indicator = document.createElement('button');
            indicator.className = 'carousel-indicator';
            indicator.setAttribute('aria-label', `Ir para página ${i + 1}`);
            indicator.addEventListener('click', () => this.goToSlide(i));
            this.indicatorsContainer.appendChild(indicator);
        }
    }
    
    setupEventListeners() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Pausar autoplay quando o mouse estiver sobre o carrossel
        this.track.addEventListener('mouseenter', () => this.stopAutoplay());
        this.track.addEventListener('mouseleave', () => this.startAutoplay());
        
        // Suporte para touch/swipe em dispositivos móveis
        this.setupTouchEvents();
        
        // Suporte para teclado
        this.track.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
    }
    
    setupTouchEvents() {
        let startX = 0;
        let startY = 0;
        let isDragging = false;
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = true;
            this.stopAutoplay();
        });
        
        this.track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = startX - currentX;
            const diffY = startY - currentY;
            
            // Se o movimento vertical for maior que o horizontal, não interfere
            if (Math.abs(diffY) > Math.abs(diffX)) return;
            
            e.preventDefault();
        });
        
        this.track.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            
            // Threshold para considerar um swipe
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            
            isDragging = false;
            this.startAutoplay();
        });
    }
    
    updateCarousel() {
        if (!this.track || this.slides.length === 0) return;
        
        // Calcular o offset baseado no slide atual
        const slideWidth = this.slides[0].offsetWidth;
        const gap = 24; // 1.5rem gap
        const offset = this.currentIndex * (slideWidth + gap);
        
        this.track.style.transform = `translateX(-${offset}px)`;
        
        // Atualizar botões
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentIndex === 0;
        }
        
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentIndex >= this.maxIndex;
        }
        
        // Atualizar indicadores
        this.updateIndicators();
    }
    
    updateIndicators() {
        if (!this.indicatorsContainer) return;
        
        const indicators = this.indicatorsContainer.querySelectorAll('.carousel-indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    nextSlide() {
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex++;
            this.updateCarousel();
        } else if (this.slides.length > this.slidesToShow) {
            // Loop para o início
            this.currentIndex = 0;
            this.updateCarousel();
        }
    }
    
    prevSlide() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarousel();
        } else if (this.slides.length > this.slidesToShow) {
            // Loop para o final
            this.currentIndex = this.maxIndex;
            this.updateCarousel();
        }
    }
    
    goToSlide(index) {
        if (index >= 0 && index <= this.maxIndex) {
            this.currentIndex = index;
            this.updateCarousel();
        }
    }
    
    startAutoplay() {
        this.stopAutoplay();
        if (this.slides.length > this.slidesToShow) {
            this.autoplayInterval = setInterval(() => {
                this.nextSlide();
            }, this.autoplayDelay);
        }
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
}

// Inicializar o carrossel quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new PackageCarousel();
});

// Reinicializar se a página for carregada via AJAX/SPA
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PackageCarousel();
    });
} else {
    new PackageCarousel();
}
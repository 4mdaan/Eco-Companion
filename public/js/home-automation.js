// Home Page - Automated Reviews & Real-time Integrations

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar funcionalidades da página inicial
    initAutomatedReviews();
    initRealTimeIntegrations();
    initLiveStats();
    initInteractiveElements();
});

// === AUTOMATED REVIEWS SYSTEM ===
function initAutomatedReviews() {
    const reviewsContainer = document.getElementById('reviews-container');
    if (!reviewsContainer) return;

    // Reviews database (simulado)
    const reviewsDatabase = [
        {
            name: 'Ana Silva',
            rating: 5,
            text: 'Experiência incrível! O atendimento foi excepcional e o destino superou todas as expectativas.',
            destination: 'Rio de Janeiro',
            time: '2 minutos atrás',
            avatar: 'A'
        },
        {
            name: 'João Santos',
            rating: 5,
            text: 'Viagem dos sonhos! Tudo muito bem organizado, desde o transporte até a hospedagem.',
            destination: 'Gramado',
            time: '5 minutos atrás',
            avatar: 'J'
        },
        {
            name: 'Maria Costa',
            rating: 4,
            text: 'Adorei cada momento! A equipe é muito profissional e os preços são justos.',
            destination: 'Florianópolis',
            time: '8 minutos atrás',
            avatar: 'M'
        },
        {
            name: 'Pedro Lima',
            rating: 5,
            text: 'Recomendo para todos! Melhor agência de viagens que já contratei.',
            destination: 'Fernando de Noronha',
            time: '12 minutos atrás',
            avatar: 'P'
        },
        {
            name: 'Carla Mendes',
            rating: 5,
            text: 'Simplesmente perfeito! Voltarei a viajar com vocês com certeza.',
            destination: 'Bonito',
            time: '15 minutos atrás',
            avatar: 'C'
        },
        {
            name: 'Lucas Oliveira',
            rating: 4,
            text: 'Ótimo custo-benefício! A viagem foi incrível e o suporte foi excelente.',
            destination: 'Chapada Diamantina',
            time: '18 minutos atrás',
            avatar: 'L'
        }
    ];

    // Carregar reviews iniciais
    loadInitialReviews(reviewsContainer, reviewsDatabase);
    
    // Simular novos reviews chegando em tempo real
    startLiveReviewsFeed(reviewsContainer, reviewsDatabase);
}

function loadInitialReviews(container, reviews) {
    // Mostrar primeiros 3 reviews
    const initialReviews = reviews.slice(0, 3);
    
    initialReviews.forEach((review, index) => {
        setTimeout(() => {
            addReviewCard(container, review, true);
        }, index * 500);
    });
}

function startLiveReviewsFeed(container, reviews) {
    let currentIndex = 3;
    
    // Adicionar novo review a cada 15 segundos
    setInterval(() => {
        if (currentIndex < reviews.length) {
            const review = reviews[currentIndex];
            
            // Atualizar tempo para parecer mais recente
            review.time = 'Agora mesmo';
            
            addReviewCard(container, review, false, true);
            currentIndex++;
            
            // Remover review mais antigo se houver mais de 6
            const allReviews = container.querySelectorAll('.review-card');
            if (allReviews.length > 6) {
                allReviews[0].style.animation = 'slideOutLeft 0.5s ease';
                setTimeout(() => {
                    if (allReviews[0].parentNode) {
                        allReviews[0].remove();
                    }
                }, 500);
            }
        } else {
            // Reiniciar o ciclo com reviews "novos"
            currentIndex = 0;
            reviews.forEach(review => {
                review.time = Math.floor(Math.random() * 30) + ' minutos atrás';
            });
        }
        
        // Atualizar estatísticas
        updateReviewStats();
        
    }, 15000); // 15 segundos
}

function addReviewCard(container, review, isInitial = false, isNew = false) {
    const reviewCard = document.createElement('div');
    reviewCard.className = `review-card ${isNew ? 'new-review' : ''}`;
    
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    
    reviewCard.innerHTML = `
        <div class="review-header">
            <div class="review-avatar">${review.avatar}</div>
            <div class="review-info">
                <h4>${review.name}</h4>
                <div class="review-rating">
                    ${stars.split('').map(star => `<span class="star">${star}</span>`).join('')}
                </div>
            </div>
            ${isNew ? '<div class="live-indicator"><div class="live-dot"></div>Novo</div>' : ''}
        </div>
        
        <p class="review-text">"${review.text}"</p>
        
        <div class="review-meta">
            <span class="review-destination">${review.destination}</span>
            <span class="review-time">${review.time}</span>
        </div>
    `;
    
    if (isNew) {
        // Adicionar no início para novos reviews
        container.insertBefore(reviewCard, container.firstChild);
        reviewCard.style.animation = 'slideInRight 0.5s ease';
    } else {
        // Adicionar no final para reviews iniciais
        container.appendChild(reviewCard);
        if (isInitial) {
            reviewCard.style.animation = 'fadeInUp 0.5s ease';
        }
    }
    
    // Remover indicador "novo" após 5 segundos
    if (isNew) {
        setTimeout(() => {
            const liveIndicator = reviewCard.querySelector('.live-indicator');
            if (liveIndicator) {
                liveIndicator.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => liveIndicator.remove(), 300);
            }
        }, 5000);
    }
}

function updateReviewStats() {
    const totalReviewsEl = document.getElementById('total-reviews');
    const avgRatingEl = document.getElementById('avg-rating');
    const satisfactionEl = document.getElementById('satisfaction');
    
    if (totalReviewsEl) {
        const current = parseInt(totalReviewsEl.textContent.replace(/,/g, ''));
        const newTotal = current + Math.floor(Math.random() * 3) + 1;
        animateNumber(totalReviewsEl, current, newTotal);
    }
    
    if (avgRatingEl) {
        const ratings = [4.8, 4.9, 5.0];
        const randomRating = ratings[Math.floor(Math.random() * ratings.length)];
        avgRatingEl.textContent = randomRating;
        avgRatingEl.style.animation = 'pulse 0.5s ease';
    }
    
    if (satisfactionEl) {
        const satisfactions = ['97%', '98%', '99%'];
        const randomSat = satisfactions[Math.floor(Math.random() * satisfactions.length)];
        satisfactionEl.textContent = randomSat;
        satisfactionEl.style.animation = 'pulse 0.5s ease';
    }
}

// === REAL-TIME INTEGRATIONS ===
function initRealTimeIntegrations() {
    // Simular status de integrações
    updateIntegrationStatus();
    
    // Atualizar dados em tempo real
    setInterval(updateIntegrationData, 30000); // 30 segundos
    
    // Simular mudanças de status ocasionais
    setInterval(simulateStatusChanges, 120000); // 2 minutos
}

function updateIntegrationStatus() {
    const integrations = document.querySelectorAll('.integration-item');
    
    integrations.forEach((item, index) => {
        const statusDot = item.querySelector('.status-dot');
        const statusText = item.querySelector('.status-text');
        
        // Simular status online para a maioria
        const isOnline = Math.random() > 0.1; // 90% chance de estar online
        
        if (isOnline) {
            statusDot.className = 'status-dot online';
            statusText.textContent = getStatusText(item.dataset.service, 'online');
        } else {
            statusDot.className = 'status-dot warning';
            statusText.textContent = getStatusText(item.dataset.service, 'warning');
        }
        
        // Animar mudança de status
        setTimeout(() => {
            item.style.animation = 'pulse 0.5s ease';
        }, index * 200);
    });
}

function getStatusText(service, status) {
    const statusTexts = {
        booking: {
            online: 'Online',
            warning: 'Lentidão',
            offline: 'Indisponível'
        },
        weather: {
            online: 'Atualizado',
            warning: 'Atualizando',
            offline: 'Sem dados'
        },
        payment: {
            online: 'Seguro',
            warning: 'Verificando',
            offline: 'Manutenção'
        },
        analytics: {
            online: 'Monitorando',
            warning: 'Processando',
            offline: 'Pausado'
        }
    };
    
    return statusTexts[service]?.[status] || 'Desconhecido';
}

function updateIntegrationData() {
    // Atualizar dados do clima
    updateWeatherData();
    
    // Atualizar contador de visitantes
    updateVisitorCount();
    
    // Atualizar dados de hotéis
    updateHotelCount();
}

function updateWeatherData() {
    const weatherData = document.getElementById('weather-data');
    if (!weatherData) return;
    
    const cities = ['Rio: 28°C ☀️', 'SP: 22°C ⛅', 'Gramado: 15°C 🌧️', 'Salvador: 31°C ☀️'];
    const randomWeather = cities[Math.floor(Math.random() * cities.length)];
    
    weatherData.textContent = randomWeather;
    weatherData.classList.add('data-update');
    setTimeout(() => weatherData.classList.remove('data-update'), 500);
}

function updateVisitorCount() {
    const visitorsCount = document.getElementById('visitors-count');
    if (!visitorsCount) return;
    
    const currentMatch = visitorsCount.textContent.match(/(\d+)/);
    if (currentMatch) {
        const current = parseInt(currentMatch[1]);
        const newCount = current + Math.floor(Math.random() * 5) + 1;
        visitorsCount.textContent = `${newCount} visitantes hoje`;
        visitorsCount.classList.add('data-update');
        setTimeout(() => visitorsCount.classList.remove('data-update'), 500);
    }
}

function updateHotelCount() {
    const hotelData = document.querySelector('[data-service="booking"] .data-point');
    if (!hotelData) return;
    
    const currentMatch = hotelData.textContent.match(/(\d+)/);
    if (currentMatch) {
        const current = parseInt(currentMatch[1].replace(/,/g, ''));
        const newCount = current + Math.floor(Math.random() * 100) + 10;
        hotelData.textContent = `${newCount.toLocaleString()} hotéis`;
        hotelData.classList.add('data-update');
        setTimeout(() => hotelData.classList.remove('data-update'), 500);
    }
}

function simulateStatusChanges() {
    const integrations = document.querySelectorAll('.integration-item');
    const randomIntegration = integrations[Math.floor(Math.random() * integrations.length)];
    
    if (randomIntegration) {
        const statusDot = randomIntegration.querySelector('.status-dot');
        const statusText = randomIntegration.querySelector('.status-text');
        const service = randomIntegration.dataset.service;
        
        // Simular mudança temporária de status
        statusDot.className = 'status-dot warning';
        statusText.textContent = getStatusText(service, 'warning');
        
        // Voltar ao normal após alguns segundos
        setTimeout(() => {
            statusDot.className = 'status-dot online';
            statusText.textContent = getStatusText(service, 'online');
        }, Math.random() * 5000 + 2000); // 2-7 segundos
    }
}

// === LIVE STATS ===
function initLiveStats() {
    // Atualizar estatísticas em tempo real
    setInterval(() => {
        updateLiveStats();
    }, 45000); // 45 segundos
}

function updateLiveStats() {
    // Atualizar números com pequenas variações
    const stats = [
        { id: 'total-reviews', increment: Math.floor(Math.random() * 5) + 1 },
        { id: 'visitors-count', increment: Math.floor(Math.random() * 10) + 2 }
    ];
    
    stats.forEach(stat => {
        const element = document.getElementById(stat.id);
        if (element) {
            const currentMatch = element.textContent.match(/(\d+)/);
            if (currentMatch) {
                const current = parseInt(currentMatch[1].replace(/,/g, ''));
                const newValue = current + stat.increment;
                
                if (stat.id === 'total-reviews') {
                    animateNumber(element, current, newValue);
                } else {
                    element.textContent = element.textContent.replace(/\d+/, newValue.toLocaleString());
                    element.style.animation = 'pulse 0.5s ease';
                }
            }
        }
    });
}

// === INTERACTIVE ELEMENTS ===
function initInteractiveElements() {
    // Hover effects para review cards
    addReviewCardInteractions();
    
    // Click effects para integration items
    addIntegrationInteractions();
    
    // Animações ao entrar na viewport
    addScrollAnimations();
}

function addReviewCardInteractions() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.review-card')) {
            const card = e.target.closest('.review-card');
            card.style.animation = 'pulse 0.3s ease';
            
            // Mostrar mais detalhes (simulado)
            showReviewDetails(card);
        }
    });
}

function addIntegrationInteractions() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.integration-item')) {
            const item = e.target.closest('.integration-item');
            const service = item.dataset.service;
            
            showIntegrationDetails(service);
        }
    });
}

function addScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease';
            }
        });
    });
    
    document.querySelectorAll('.review-card, .integration-item, .stat-item').forEach(el => {
        observer.observe(el);
    });
}

// === UTILITY FUNCTIONS ===
function animateNumber(element, from, to) {
    const duration = 1000;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(from + (to - from) * progress);
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function showReviewDetails(card) {
    const name = card.querySelector('h4').textContent;
    const destination = card.querySelector('.review-destination').textContent;
    
    showNotification(`💬 Review de ${name} sobre ${destination}`, 'info');
}

function showIntegrationDetails(service) {
    const serviceNames = {
        booking: 'Booking.com',
        weather: 'Dados Meteorológicos',
        payment: 'Sistema de Pagamentos',
        analytics: 'Analytics e Monitoramento'
    };
    
    const serviceName = serviceNames[service] || service;
    showNotification(`🔗 Integração: ${serviceName} funcionando normalmente`, 'success');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
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
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// === CSS ANIMATIONS ===
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes slideOutLeft {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(-100%); opacity: 0; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    .new-review {
        border-left: 4px solid #4caf50;
    }
`;
document.head.appendChild(style);

// Inicializar contador de visitantes únicos
(function() {
    const visited = localStorage.getItem('hasVisited');
    if (!visited) {
        localStorage.setItem('hasVisited', 'true');
        // Incrementar contador de visitantes únicos
        setTimeout(() => {
            updateVisitorCount();
        }, 2000);
    }
})();
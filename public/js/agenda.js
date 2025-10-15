// Gerenciador da Agenda Moderna
class ModernAgendaManager {
    constructor() {
        this.trips = [];
        this.filteredTrips = [];
        this.currentView = 'cards';
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        this.map = null;
        this.markers = [];
        this.markerGroup = null;
        
        this.init();
    }

    init() {
        this.generateSampleData();
        this.setupEventListeners();
        this.renderCurrentView();
        this.updateMetrics();
    }

    setupEventListeners() {
        // Busca
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // Nova viagem
        const newTripBtn = document.getElementById('newTripBtn');
        if (newTripBtn) {
            newTripBtn.addEventListener('click', () => this.showNewTripModal());
        }

        // Filtros
        this.setupFilterListeners();

        // Views
        const viewBtns = document.querySelectorAll('.view-btn');
        viewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchView(e.target.closest('.view-btn').dataset.view);
            });
        });

        // Navegação do calendário
        this.setupCalendarNavigation();

        // Modal events
        this.setupModalEvents();
    }

    setupFilterListeners() {
        // Filtros de data
        const startDate = document.getElementById('startDate');
        const endDate = document.getElementById('endDate');
        
        if (startDate) startDate.addEventListener('change', () => this.applyFilters());
        if (endDate) endDate.addEventListener('change', () => this.applyFilters());

        // Filtro de categoria
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.applyFilters());
        }

        // Status chips
        const statusChips = document.querySelectorAll('.status-chip');
        statusChips.forEach(chip => {
            chip.addEventListener('click', (e) => {
                // Remove active de todos
                statusChips.forEach(c => c.classList.remove('active'));
                // Adiciona active no clicado
                e.target.classList.add('active');
                this.applyFilters();
            });
        });

        // Sort
        const sortBy = document.getElementById('sortBy');
        if (sortBy) {
            sortBy.addEventListener('change', () => this.sortTrips());
        }
    }

    setupCalendarNavigation() {
        const prevMonth = document.getElementById('prevMonth');
        const nextMonth = document.getElementById('nextMonth');

        if (prevMonth) {
            prevMonth.addEventListener('click', () => this.navigateMonth(-1));
        }
        if (nextMonth) {
            nextMonth.addEventListener('click', () => this.navigateMonth(1));
        }
    }

    setupModalEvents() {
        // Fechar modais
        const closeButtons = document.querySelectorAll('.modal-close');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.closeModals());
        });

        // Fechar ao clicar fora
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModals();
            });
        });

        // Formulário de nova viagem
        const tripForm = document.getElementById('tripForm');
        if (tripForm) {
            tripForm.addEventListener('submit', (e) => this.handleNewTrip(e));
        }
    }

    generateSampleData() {
        const destinationsWithImages = [
            { name: 'Rio de Janeiro', image: 'bg-rio', category: 'cidade' },
            { name: 'Florianópolis', image: 'bg-florianopolis', category: 'praia' },
            { name: 'Porto Seguro', image: 'bg-porto-seguro', category: 'praia' },
            { name: 'Fernando de Noronha', image: 'bg-destinos-nacionais', category: 'aventura' },
            { name: 'Gramado', image: 'bg-gramado', category: 'montanha' },
            { name: 'Paris', image: 'bg-paris', category: 'cidade' }
        ];

        const categories = ['praia', 'montanha', 'cidade', 'aventura', 'relax'];
        const statuses = ['confirmed', 'pending', 'cancelled'];

        // Adicionar apenas 1 de cada destino disponível
        this.trips.push(
            {
                id: 1,
                destination: 'Rio de Janeiro',
                startDate: '2025-11-17',
                endDate: '2025-11-21',
                price: 870,
                category: 'cidade',
                status: 'confirmed',
                description: 'Hotel 4 estrelas com city tour incluído. Cristo Redentor, Pão de Açúcar e muito mais!',
                image: 'bg-rio',
                coordinates: [-22.9068, -43.1729]
            },
            {
                id: 2,
                destination: 'Florianópolis',
                startDate: '2025-11-03',
                endDate: '2025-11-07',
                price: 841,
                category: 'praia',
                status: 'confirmed',
                description: 'Praias paradisíacas com transfer incluso. Ilha da Magia te espera!',
                image: 'bg-florianopolis',
                coordinates: [-27.5954, -48.5480]
            },
            {
                id: 3,
                destination: 'Porto Seguro',
                startDate: '2025-12-17',
                endDate: '2025-12-21',
                price: 1828,
                category: 'praia',
                status: 'confirmed',
                description: 'Resort all inclusive com passeios incluídos. História, cultura e praias incríveis!',
                image: 'bg-porto-seguro',
                coordinates: [-16.4497, -39.0647]
            },
            {
                id: 4,
                destination: 'Fernando de Noronha',
                startDate: '2025-11-25',
                endDate: '2025-11-30',
                price: 2850,
                category: 'aventura',
                status: 'pending',
                description: 'Paraíso ecológico com mergulho e trilhas. Uma das praias mais bonitas do mundo!',
                image: 'bg-destinos-nacionais',
                coordinates: [-3.8536, -32.4297]
            },
            {
                id: 5,
                destination: 'Gramado',
                startDate: '2025-12-10',
                endDate: '2025-12-14',
                price: 1200,
                category: 'montanha',
                status: 'confirmed',
                description: 'Charme da serra gaúcha com arquitetura alemã e gastronomia especial!',
                image: 'bg-gramado',
                coordinates: [-29.3786, -50.8740]
            },
            {
                id: 6,
                destination: 'Paris',
                startDate: '2026-01-15',
                endDate: '2026-01-22',
                price: 4500,
                category: 'cidade',
                status: 'pending',
                description: 'Cidade Luz com Torre Eiffel, Louvre e romance francês!',
                image: 'bg-paris',
                coordinates: [48.8566, 2.3522]
            }
        );

        this.filteredTrips = [...this.trips];
        this.sortTrips();
    }

    switchView(newView) {
        // Atualizar botões
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${newView}"]`).classList.add('active');

        // Atualizar views
        document.querySelectorAll('.view-container').forEach(container => {
            container.classList.remove('active');
        });
        document.getElementById(`${newView}View`).classList.add('active');

        this.currentView = newView;
        this.renderCurrentView();
    }

    renderCurrentView() {
        switch (this.currentView) {
            case 'cards':
                this.renderCards();
                break;
            case 'calendar':
                this.renderCalendar();
                break;
            case 'timeline':
                this.renderTimeline();
                break;
            case 'map':
                this.renderMap();
                break;
        }
    }

    renderCards() {
        const container = document.querySelector('.trips-grid');
        if (!container) return;

        if (this.filteredTrips.length === 0) {
            container.innerHTML = this.getEmptyState('Nenhuma viagem encontrada', 'Tente ajustar os filtros para encontrar suas viagens.');
            return;
        }

        container.innerHTML = this.filteredTrips.map(trip => `
            <div class="trip-card" onclick="window.agendaManager.showTripDetails(${trip.id})">
                ${trip.image ? `
                    <div class="trip-image ${trip.image}">
                        <span class="trip-category">${this.getCategoryIcon(trip.category)} ${this.getCategoryName(trip.category)}</span>
                        <span class="trip-status status-${trip.status}">${this.getStatusName(trip.status)}</span>
                    </div>` 
                : `
                    <div class="trip-header">
                        <span class="trip-category">${this.getCategoryIcon(trip.category)} ${this.getCategoryName(trip.category)}</span>
                        <span class="trip-status status-${trip.status}">${this.getStatusName(trip.status)}</span>
                    </div>`}
                <div class="trip-content">
                    <h3 class="trip-title">${trip.destination}</h3>
                    <div class="trip-dates">
                        <i class="fas fa-calendar"></i>
                        ${this.formatDateRange(trip.startDate, trip.endDate)}
                    </div>
                    <p class="trip-description">${trip.description}</p>
                    <div class="trip-footer">
                        <span class="trip-price">R$ ${trip.price.toLocaleString()}</span>
                        <div class="trip-actions">
                            <button class="trip-action-btn btn-edit" onclick="event.stopPropagation(); window.agendaManager.editTrip(${trip.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="trip-action-btn btn-delete" onclick="event.stopPropagation(); window.agendaManager.deleteTrip(${trip.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderCalendar() {
        this.updateCalendarTitle();
        
        const daysContainer = document.getElementById('calendarDays');
        if (!daysContainer) return;

        // Limpar container
        daysContainer.innerHTML = '';

        // Calcular dias
        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        // Dias do mês anterior
        const prevMonthLastDay = new Date(this.currentYear, this.currentMonth, 0).getDate();
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            const dayNumber = prevMonthLastDay - i;
            const dayElement = this.createCalendarDay(dayNumber, true, false);
            daysContainer.appendChild(dayElement);
        }

        // Dias do mês atual
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = this.createCalendarDay(day, false, false);
            daysContainer.appendChild(dayElement);
        }

        // Dias do próximo mês
        const totalCells = daysContainer.children.length;
        const remainingCells = 42 - totalCells; // 6 semanas
        for (let day = 1; day <= remainingCells; day++) {
            const dayElement = this.createCalendarDay(day, false, true);
            daysContainer.appendChild(dayElement);
        }
    }

    createCalendarDay(day, isPrevMonth, isNextMonth) {
        const dayDiv = document.createElement('div');
        dayDiv.className = `calendar-day ${isPrevMonth || isNextMonth ? 'other-month' : ''}`;
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayDiv.appendChild(dayNumber);

        // Verificar se há eventos neste dia
        if (!isPrevMonth && !isNextMonth) {
            const currentDate = new Date(this.currentYear, this.currentMonth, day);
            const tripsOnDay = this.getTripsForDate(currentDate);
            
            if (tripsOnDay.length > 0) {
                dayDiv.classList.add('has-events');
                const eventsDiv = document.createElement('div');
                eventsDiv.className = 'day-events';
                
                tripsOnDay.slice(0, 3).forEach(() => {
                    const indicator = document.createElement('div');
                    indicator.className = 'event-indicator';
                    eventsDiv.appendChild(indicator);
                });
                
                dayDiv.appendChild(eventsDiv);
            }
        }

        return dayDiv;
    }

    renderTimeline() {
        const container = document.querySelector('.timeline-container');
        if (!container) return;

        if (this.filteredTrips.length === 0) {
            container.innerHTML = this.getEmptyState('Timeline vazia', 'Nenhuma viagem para exibir na timeline.');
            return;
        }

        const sortedTrips = [...this.filteredTrips].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

        container.innerHTML = sortedTrips.map(trip => `
            <div class="timeline-item">
                <div class="timeline-date">${this.formatDate(trip.startDate)}</div>
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                    <h4>${trip.destination}</h4>
                    <p>Duração: ${this.calculateDuration(trip.startDate, trip.endDate)} dias</p>
                    <p>Preço: R$ ${trip.price.toLocaleString()}</p>
                    <span class="trip-status status-${trip.status}">${this.getStatusName(trip.status)}</span>
                </div>
            </div>
        `).join('');
    }

    renderMap() {
        // Aguardar um pouco para garantir que o DOM está pronto
        setTimeout(() => {
            this.initializeMap();
        }, 100);
    }

    initializeMap() {
        const mapElement = document.getElementById('map');
        if (!mapElement) return;

        // Inicializar o mapa se ainda não foi criado
        if (!this.map) {
            // Centro do Brasil
            this.map = L.map('map', {
                center: [-14.2350, -51.9253],
                zoom: 4,
                zoomControl: true
            });

            // Adicionar camada de tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18
            }).addTo(this.map);

            // Criar grupo de marcadores
            this.markerGroup = L.layerGroup().addTo(this.map);

            // Configurar filtros do mapa
            this.setupMapFilters();
        }

        // Limpar marcadores existentes
        this.clearMapMarkers();

        // Adicionar marcadores das viagens filtradas
        this.addTripMarkers();

        // Ajustar zoom para mostrar todos os marcadores
        this.fitMapToMarkers();
    }

    setupMapFilters() {
        const filterButtons = document.querySelectorAll('.map-filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Atualizar botão ativo
                filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                // Aplicar filtro
                this.filterMapMarkers(e.target.dataset.filter);
            });
        });
    }

    clearMapMarkers() {
        if (this.markerGroup) {
            this.markerGroup.clearLayers();
        }
        this.markers = [];
    }

    addTripMarkers() {
        this.filteredTrips.forEach(trip => {
            if (trip.coordinates && trip.coordinates.length === 2) {
                const marker = this.createTripMarker(trip);
                this.markers.push(marker);
                this.markerGroup.addLayer(marker);
            }
        });
    }

    createTripMarker(trip) {
        const [lat, lng] = trip.coordinates;
        
        // Definir cor do marcador baseado no status
        const getMarkerColor = (status) => {
            switch (status) {
                case 'confirmed': return '#10b981'; // verde
                case 'pending': return '#f59e0b';   // amarelo
                case 'cancelled': return '#ef4444'; // vermelho
                default: return '#6b7280';          // cinza
            }
        };

        // Criar ícone customizado
        const markerIcon = L.divIcon({
            className: 'custom-marker',
            html: `
                <div style="
                    width: 24px; 
                    height: 24px; 
                    background-color: ${getMarkerColor(trip.status)}; 
                    border: 3px solid white; 
                    border-radius: 50%; 
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 10px;
                ">
                    ${this.getCategoryIcon(trip.category)}
                </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });

        // Criar marcador
        const marker = L.marker([lat, lng], { icon: markerIcon });

        // Adicionar popup
        const popupContent = this.createPopupContent(trip);
        marker.bindPopup(popupContent, {
            maxWidth: 300,
            className: 'custom-popup'
        });

        // Adicionar evento de click
        marker.on('click', () => {
            this.showTripInfoOnMap(trip);
        });

        return marker;
    }

    getCategoryIcon(category) {
        const icons = {
            'praia': '🏖️',
            'montanha': '⛰️',
            'cidade': '🏙️',
            'aventura': '🎯',
            'relax': '🧘'
        };
        return icons[category] || '📍';
    }

    createPopupContent(trip) {
        const statusLabels = {
            'confirmed': 'Confirmada',
            'pending': 'Pendente',
            'cancelled': 'Cancelada'
        };

        return `
            <div class="popup-trip-info">
                <h4>${trip.destination}</h4>
                <div class="popup-trip-details">
                    <div class="popup-detail">
                        <i class="fas fa-calendar"></i>
                        ${this.formatDateRange(trip.startDate, trip.endDate)}
                    </div>
                    <div class="popup-detail">
                        <i class="fas fa-money-bill-wave"></i>
                        R$ ${trip.price.toLocaleString('pt-BR')}
                    </div>
                    <div class="popup-detail">
                        <i class="fas fa-tag"></i>
                        ${this.getCategoryLabel(trip.category)}
                    </div>
                </div>
                <div class="popup-status ${trip.status}">
                    ${statusLabels[trip.status] || trip.status}
                </div>
            </div>
        `;
    }

    formatDateRange(start, end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        
        return `${startDate.toLocaleDateString('pt-BR', options)} - ${endDate.toLocaleDateString('pt-BR', options)}`;
    }

    getCategoryLabel(category) {
        const labels = {
            'praia': '🏖️ Praia',
            'montanha': '⛰️ Montanha',
            'cidade': '🏙️ Cidade',
            'aventura': '🎯 Aventura',
            'relax': '🧘 Relaxamento'
        };
        return labels[category] || category;
    }

    showTripInfoOnMap(trip) {
        const infoElement = document.getElementById('selectedTripInfo');
        if (!infoElement) return;

        const statusLabels = {
            'confirmed': 'Confirmada',
            'pending': 'Pendente',
            'cancelled': 'Cancelada'
        };

        infoElement.innerHTML = `
            <h4>${trip.destination}</h4>
            <div class="selected-trip-details">
                <div class="detail-item">
                    <i class="fas fa-calendar"></i>
                    <span>${this.formatDateRange(trip.startDate, trip.endDate)}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-money-bill-wave"></i>
                    <span>R$ ${trip.price.toLocaleString('pt-BR')}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-tag"></i>
                    <span>${this.getCategoryLabel(trip.category)}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-info-circle"></i>
                    <span>${statusLabels[trip.status]}</span>
                </div>
            </div>
            <p style="margin-top: 1rem; color: #64748b; font-size: 0.9rem;">${trip.description}</p>
        `;
        
        infoElement.style.display = 'block';

        // Centralizar o mapa no marcador selecionado
        if (trip.coordinates) {
            this.map.setView(trip.coordinates, 8, { animate: true });
        }
    }

    filterMapMarkers(filter) {
        // Se o filtro é 'all', mostrar todos os marcadores
        if (filter === 'all') {
            this.clearMapMarkers();
            this.addTripMarkers();
            return;
        }

        // Filtrar viagens baseado no status
        const filteredTrips = this.filteredTrips.filter(trip => trip.status === filter);
        
        // Limpar marcadores existentes
        this.clearMapMarkers();
        
        // Adicionar apenas marcadores filtrados
        filteredTrips.forEach(trip => {
            if (trip.coordinates && trip.coordinates.length === 2) {
                const marker = this.createTripMarker(trip);
                this.markers.push(marker);
                this.markerGroup.addLayer(marker);
            }
        });

        // Ajustar zoom
        this.fitMapToMarkers();
    }

    fitMapToMarkers() {
        if (this.markers.length > 0) {
            const group = new L.featureGroup(this.markers);
            this.map.fitBounds(group.getBounds().pad(0.1));
        }
    }

    // Funções de filtro e busca
    handleSearch(query) {
        this.applyFilters();
    }

    applyFilters() {
        let filtered = [...this.trips];

        // Filtro de busca
        const searchQuery = document.getElementById('searchInput')?.value.toLowerCase();
        if (searchQuery) {
            filtered = filtered.filter(trip => 
                trip.destination.toLowerCase().includes(searchQuery) ||
                trip.description.toLowerCase().includes(searchQuery)
            );
        }

        // Filtro de data
        const startDate = document.getElementById('startDate')?.value;
        const endDate = document.getElementById('endDate')?.value;
        
        if (startDate) {
            filtered = filtered.filter(trip => trip.startDate >= startDate);
        }
        if (endDate) {
            filtered = filtered.filter(trip => trip.endDate <= endDate);
        }

        // Filtro de categoria
        const category = document.getElementById('categoryFilter')?.value;
        if (category && category !== 'all') {
            filtered = filtered.filter(trip => trip.category === category);
        }

        // Filtro de status
        const activeStatus = document.querySelector('.status-chip.active')?.dataset.status;
        if (activeStatus && activeStatus !== 'all') {
            filtered = filtered.filter(trip => trip.status === activeStatus);
        }

        this.filteredTrips = filtered;
        this.renderCurrentView();
        this.updateMetrics();
    }

    sortTrips() {
        const sortBy = document.getElementById('sortBy')?.value || 'date';
        
        this.filteredTrips.sort((a, b) => {
            switch (sortBy) {
                case 'date':
                    return new Date(a.startDate) - new Date(b.startDate);
                case 'price':
                    return b.price - a.price;
                case 'destination':
                    return a.destination.localeCompare(b.destination);
                case 'status':
                    return a.status.localeCompare(b.status);
                default:
                    return 0;
            }
        });

        this.renderCurrentView();
    }

    // Funções do calendário
    navigateMonth(direction) {
        this.currentMonth += direction;
        
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        } else if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
        
        if (this.currentView === 'calendar') {
            this.renderCalendar();
        }
    }

    updateCalendarTitle() {
        const title = document.getElementById('calendarTitle');
        if (title) {
            const months = [
                'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
            ];
            title.textContent = `${months[this.currentMonth]} ${this.currentYear}`;
        }
    }

    // Funções de modal
    showNewTripModal() {
        const modal = document.getElementById('newTripModal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    closeModals() {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    handleNewTrip(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const newTrip = {
            id: this.trips.length + 1,
            destination: formData.get('destination') || document.getElementById('tripDestination').value,
            startDate: document.getElementById('tripStartDate').value,
            endDate: document.getElementById('tripEndDate').value,
            price: parseInt(document.getElementById('tripPrice').value),
            category: document.getElementById('tripCategory').value,
            description: document.getElementById('tripDescription').value || 'Nova experiência de viagem.',
            status: 'pending'
        };

        this.trips.push(newTrip);
        this.applyFilters();
        this.closeModals();
        
        // Reset form
        e.target.reset();
        
        alert('Viagem criada com sucesso!');
    }

    // Funções auxiliares
    updateMetrics() {
        const total = this.filteredTrips.length;
        const confirmed = this.filteredTrips.filter(t => t.status === 'confirmed').length;
        const pending = this.filteredTrips.filter(t => t.status === 'pending').length;
        const revenue = this.filteredTrips
            .filter(t => t.status === 'confirmed')
            .reduce((sum, t) => sum + t.price, 0);

        document.getElementById('totalTrips').textContent = total;
        document.getElementById('confirmedTrips').textContent = confirmed;
        document.getElementById('pendingTrips').textContent = pending;
        document.getElementById('totalRevenue').textContent = `R$ ${Math.floor(revenue / 1000)}k`;
    }

    getTripsForDate(date) {
        return this.filteredTrips.filter(trip => {
            const start = new Date(trip.startDate);
            const end = new Date(trip.endDate);
            return date >= start && date <= end;
        });
    }

    getCategoryIcon(category) {
        const icons = {
            praia: '🏖️',
            montanha: '⛰️',
            cidade: '🏙️',
            aventura: '🎯',
            relax: '🧘'
        };
        return icons[category] || '🌟';
    }

    getCategoryName(category) {
        const names = {
            praia: 'Praia',
            montanha: 'Montanha',
            cidade: 'Cidade',
            aventura: 'Aventura',
            relax: 'Relaxamento'
        };
        return names[category] || 'Geral';
    }

    getStatusName(status) {
        const names = {
            confirmed: 'Confirmado',
            pending: 'Pendente',
            cancelled: 'Cancelado'
        };
        return names[status] || status;
    }

    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit'
        });
    }

    formatDateRange(startStr, endStr) {
        const start = new Date(startStr);
        const end = new Date(endStr);
        
        return `${start.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short'
        })} - ${end.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short'
        })}`;
    }

    calculateDuration(startStr, endStr) {
        const start = new Date(startStr);
        const end = new Date(endStr);
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    getEmptyState(title, message) {
        return `
            <div class="empty-state" style="grid-column: 1/-1;">
                <i class="fas fa-search"></i>
                <h3>${title}</h3>
                <p>${message}</p>
            </div>
        `;
    }

    // Funções de ações das viagens
    showTripDetails(tripId) {
        const trip = this.trips.find(t => t.id === tripId);
        if (!trip) return;

        const modal = document.getElementById('tripDetailsModal');
        const content = document.getElementById('tripDetailsContent');
        const title = document.getElementById('detailsTitle');
        
        if (title) title.textContent = trip.destination;
        
        if (content) {
            content.innerHTML = `
                <div class="trip-detail-grid">
                    <div class="detail-section">
                        <h4>Informações Gerais</h4>
                        <p><strong>Destino:</strong> ${trip.destination}</p>
                        <p><strong>Categoria:</strong> ${this.getCategoryIcon(trip.category)} ${this.getCategoryName(trip.category)}</p>
                        <p><strong>Status:</strong> <span class="trip-status status-${trip.status}">${this.getStatusName(trip.status)}</span></p>
                    </div>
                    <div class="detail-section">
                        <h4>Datas e Preços</h4>
                        <p><strong>Data de Início:</strong> ${new Date(trip.startDate).toLocaleDateString('pt-BR')}</p>
                        <p><strong>Data de Término:</strong> ${new Date(trip.endDate).toLocaleDateString('pt-BR')}</p>
                        <p><strong>Duração:</strong> ${this.calculateDuration(trip.startDate, trip.endDate)} dias</p>
                        <p><strong>Preço:</strong> R$ ${trip.price.toLocaleString()}</p>
                    </div>
                    <div class="detail-section full-width">
                        <h4>Descrição</h4>
                        <p>${trip.description}</p>
                    </div>
                </div>
            `;
        }
        
        if (modal) modal.classList.add('active');
    }

    editTrip(tripId) {
        alert(`Funcionalidade de edição será implementada para a viagem ${tripId}`);
    }

    deleteTrip(tripId) {
        if (confirm('Tem certeza que deseja excluir esta viagem?')) {
            this.trips = this.trips.filter(t => t.id !== tripId);
            this.applyFilters();
            alert('Viagem excluída com sucesso!');
        }
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.agendaManager = new ModernAgendaManager();
});
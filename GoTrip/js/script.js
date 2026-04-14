// ==================== INICIALIZAÇÃO ==================== 
document.addEventListener('DOMContentLoaded', () => {
    initializeDateInputs();
    initializeSearchForm();
    initializeAdvancedFilters();
    initializeCards();
    initializeNewsletterForm();
});

// ==================== DATAS ==================== 
function initializeDateInputs() {
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    
    if (checkinInput && checkoutInput) {
        // Definir data padrão de hoje
        const today = new Date().toISOString().split('T')[0];
        checkinInput.value = today;
        checkinInput.min = today;
        
        // Definir checkout para amanhã
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        checkoutInput.value = tomorrowStr;
        checkoutInput.min = tomorrow.toISOString().split('T')[0];
        
        // Validar checkout quando check-in mudar
        checkinInput.addEventListener('change', () => {
            const checkinDate = new Date(checkinInput.value);
            const checkoutDate = new Date(checkoutInput.value);
            
            if (checkoutDate <= checkinDate) {
                const newCheckout = new Date(checkinDate);
                newCheckout.setDate(newCheckout.getDate() + 1);
                checkoutInput.value = newCheckout.toISOString().split('T')[0];
            }
            checkoutInput.min = checkinInput.value;
        });
    }
}

// ==================== FORMULÁRIO DE BUSCA ==================== 
function initializeSearchForm() {
    const searchForm = document.getElementById('searchForm');
    
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const destino = document.getElementById('destino').value.trim();
            const checkin = document.getElementById('checkin').value;
            const checkout = document.getElementById('checkout').value;
            const hospedes = document.getElementById('hospedes').value;
            
            // Validações
            if (!destino) {
                showNotification('Por favor, informe o destino ou nome do hotel.', 'error');
                return;
            }
            
            if (!checkin || !checkout) {
                showNotification('Por favor, informe as datas de check-in e check-out.', 'error');
                return;
            }
            
            const checkinDate = new Date(checkin);
            const checkoutDate = new Date(checkout);
            
            if (checkoutDate <= checkinDate) {
                showNotification('A data de check-out deve ser posterior à data de check-in.', 'error');
                return;
            }
            
            // Construir query string
            const params = new URLSearchParams({
                destino: destino,
                checkin: checkin,
                checkout: checkout,
                hospedes: hospedes
            });
            
            // Adicionar filtros avançados se existirem
            const precoMin = document.getElementById('preco-min')?.value;
            const precoMax = document.getElementById('preco-max')?.value;
            const tipoQuarto = document.getElementById('tipo-quarto')?.value;
            const estrelas = document.getElementById('estrelas')?.value;
            
            if (precoMin) params.append('preco-min', precoMin);
            if (precoMax) params.append('preco-max', precoMax);
            if (tipoQuarto) params.append('tipo-quarto', tipoQuarto);
            if (estrelas) params.append('estrelas', estrelas);
            
            // Serviços selecionados
            if (document.getElementById('filtro-wifi')?.checked) params.append('wifi', 'true');
            if (document.getElementById('filtro-piscina')?.checked) params.append('piscina', 'true');
            if (document.getElementById('filtro-academia')?.checked) params.append('academia', 'true');
            if (document.getElementById('filtro-restaurante')?.checked) params.append('restaurante', 'true');
            if (document.getElementById('filtro-estacionamento')?.checked) params.append('estacionamento', 'true');
            
            // Será redirecionado para página de resultados quando o back-end estiver pronto
            console.log('Busca com parametros:', Object.fromEntries(params));
            
            // Simulação - em produção seria:
            // window.location.href = `resultados.html?${params.toString()}`;
            
            showNotification(`Buscando hotéis em "${destino}" para ${hospedes} hóspede(s)...`, 'success');
            setTimeout(() => {
                alert('🔍 Conexão com banco será feita aqui:\n\nDestino: ' + destino + 
                      '\nCheck-in: ' + checkin + 
                      '\nCheck-out: ' + checkout +
                      '\nHóspedes: ' + hospedes);
            }, 500);
        });
    }
}

// ==================== FILTROS AVANÇADOS ==================== 
function initializeAdvancedFilters() {
    const toggleBtn = document.getElementById('toggleAdvanced');
    const filtersDiv = document.getElementById('advancedFilters');
    
    if (toggleBtn && filtersDiv) {
        toggleBtn.addEventListener('click', () => {
            filtersDiv.style.display = filtersDiv.style.display === 'none' ? 'block' : 'none';
            toggleBtn.classList.toggle('active');
            toggleBtn.textContent = filtersDiv.style.display === 'none' ? '▼ Filtros Avançados' : '▲ Ocultar Filtros';
        });
    }
}

// ==================== CARDS ==================== 
function initializeCards() {
    loadDestaquesCards();
    loadPopularesCards();
    loadRecomendadosCards();
}

// Exemplo de dados - substituir por fetch quando banco estiver pronto
const hotelsMock = [
    {
        id: 1,
        nome: 'Hotel Canvas',
        cidade: 'Rio de Janeiro',
        estrelas: 4.8,
        preco: 489,
        imagem: 'https://picsum.photos/id/1015/400/250',
        tipo: 'Luxo'
    },
    {
        id: 2,
        nome: 'Copacabana Palace',
        cidade: 'Rio de Janeiro',
        estrelas: 4.9,
        preco: 899,
        imagem: 'https://picsum.photos/id/1018/400/250',
        tipo: 'Premium'
    },
    {
        id: 3,
        nome: 'Hotel Unique',
        cidade: 'São Paulo',
        estrelas: 4.7,
        preco: 650,
        imagem: 'https://picsum.photos/id/1019/400/250',
        tipo: 'Boutique'
    },
    {
        id: 4,
        nome: 'Bahia Othon Palace',
        cidade: 'Salvador',
        estrelas: 4.5,
        preco: 399,
        imagem: 'https://picsum.photos/id/1020/400/250',
        tipo: 'Luxo'
    },
    {
        id: 5,
        nome: 'Jatiúca Resort',
        cidade: 'Maceió',
        estrelas: 4.6,
        preco: 529,
        imagem: 'https://picsum.photos/id/1021/400/250',
        tipo: 'Resort'
    },
    {
        id: 6,
        nome: 'Tropical Manaus',
        cidade: 'Manaus',
        estrelas: 4.4,
        preco: 449,
        imagem: 'https://picsum.photos/id/1022/400/250',
        tipo: 'Luxo'
    }
];

function loadDestaquesCards() {
    const container = document.getElementById('cards-ofertas');
    if (!container) return;
    
    // Simular delay de carregamento
    setTimeout(() => {
        const html = hotelsMock.slice(0, 4).map(hotel => `
            <div class="card">
                <img src="${hotel.imagem}" alt="${hotel.nome}">
                <div class="card-content">
                    <h3>${hotel.nome}</h3>
                    <p>${hotel.cidade} • <span class="card-rating">${hotel.estrelas} ⭐</span></p>
                    <p class="card-price">A partir de R$ ${hotel.preco}/noite</p>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = html;
        addCardClickListeners();
    }, 600);
}

function loadPopularesCards() {
    const container = document.getElementById('cards-populares');
    if (!container) return;
    
    setTimeout(() => {
        const html = hotelsMock.map(hotel => `
            <div class="card">
                <img src="${hotel.imagem}" alt="${hotel.nome}">
                <div class="card-content">
                    <h3>${hotel.nome}</h3>
                    <p>${hotel.cidade} • <span class="card-rating">${hotel.estrelas} ⭐</span></p>
                    <p>${hotel.tipo}</p>
                    <p class="card-price">A partir de R$ ${hotel.preco}/noite</p>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = html;
        addCardClickListeners();
    }, 800);
}

function loadRecomendadosCards() {
    const container = document.getElementById('cards-recomendados');
    if (!container) return;
    
    setTimeout(() => {
        const html = hotelsMock.slice(1, 5).map(hotel => `
            <div class="card">
                <img src="${hotel.imagem}" alt="${hotel.nome}">
                <div class="card-content">
                    <h3>${hotel.nome}</h3>
                    <p>${hotel.cidade} • <span class="card-rating">${hotel.estrelas} ⭐</span></p>
                    <p class="card-price">A partir de R$ ${hotel.preco}/noite</p>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = html;
        addCardClickListeners();
    }, 1000);
}

function addCardClickListeners() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            // Em produção, redirecionar para página do hotel
            const hotelName = this.querySelector('h3').textContent;
            showNotification(`Redirecionando para detalhes de ${hotelName}...`, 'info');
            console.log('Clicou no card do hotel:', hotelName);
        });
    });
}

// ==================== NEWSLETTER ==================== 
function initializeNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = form.querySelector('input[type="email"]').value;
            
            if (!email) {
                showNotification('Por favor, informe seu e-mail.', 'error');
                return;
            }
            
            console.log('Email inscrito na newsletter:', email);
            showNotification('Obrigado! Você foi inscrito em nossa newsletter. 🎉', 'success');
            form.reset();
        });
    }
}

// ==================== UTILIDADES ==================== 
function showNotification(message, type = 'info') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos inline temporários para notificação
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Adicionar animações CSS globalmente
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==================== AUTOCOMPLETE DESTINOS ==================== 
const destinos = [
    'Rio de Janeiro',
    'São Paulo',
    'Salvador',
    'Recife',
    'Maceió',
    'Manaus',
    'Fortaleza',
    'Brasília',
    'Belo Horizonte',
    'Curitiba'
];

const destinoInput = document.getElementById('destino');
if (destinoInput) {
    destinoInput.addEventListener('input', (e) => {
        const value = e.target.value.toLowerCase();
        const dropdown = document.getElementById('autocomplete-destinos');
        
        if (value.length < 1) {
            dropdown.style.display = 'none';
            return;
        }
        
        const filtered = destinos.filter(d => d.toLowerCase().includes(value));
        
        if (filtered.length === 0) {
            dropdown.style.display = 'none';
            return;
        }
        
        dropdown.innerHTML = filtered.map(d => 
            `<div class="autocomplete-item" onclick="selectDestino('${d}')">${d}</div>`
        ).join('');
        
        dropdown.style.display = 'block';
    });
    
    // Fechar dropdown ao clicar fora
    document.addEventListener('click', (e) => {
        if (e.target !== destinoInput) {
            document.getElementById('autocomplete-destinos').style.display = 'none';
        }
    });
}

function selectDestino(destino) {
    document.getElementById('destino').value = destino;
    document.getElementById('autocomplete-destinos').style.display = 'none';
}

// ==================== SCROLL SUAVE ==================== 
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
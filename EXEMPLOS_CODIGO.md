# 📚 EXEMPLOS DE CÓDIGO - Integração Frontend + Backend

## 1️⃣ Exemplo: Conectar Search Form com API

### Modificar o listener do form em `js/script.js`

**Atual (mock):**
```javascript
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const destino = document.getElementById('destino').value.trim();
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    const hospedes = document.getElementById('hospedes').value;
    
    alert(`Buscando hotéis em "${destino}"`);
});
```

**Novo (com API):**
```javascript
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const destino = document.getElementById('destino').value.trim();
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    const hospedes = document.getElementById('hospedes').value;
    
    // Validações
    if (!destino) {
        showNotification('Por favor, informe o destino.', 'error');
        return;
    }
    
    // Mostrar loading
    showNotification('🔍 Buscando hotéis...', 'info');
    
    // Chamar API
    const params = new URLSearchParams({
        destino: destino,
        preco_min: document.getElementById('preco-min')?.value || 0,
        preco_max: document.getElementById('preco-max')?.value || 99999,
        estrelas: document.getElementById('estrelas')?.value || 0
    });
    
    try {
        const response = await fetch(
            `http://localhost/GoTrip/api/buscar-hoteis.php?${params}`,
            { mode: 'cors' }
        );
        
        if (!response.ok) throw new Error('Erro na busca');
        
        const data = await response.json();
        console.log('Hotéis encontrados:', data);
        
        // Redirecionar para página de resultados
        const queryString = new URLSearchParams({
            destino: destino,
            checkin: checkin,
            checkout: checkout,
            hospedes: hospedes
        }).toString();
        
        window.location.href = `resultados.html?${queryString}`;
        
    } catch (erro) {
        console.error('Erro:', erro);
        showNotification('Erro ao buscar hotéis. Tente novamente.', 'error');
    }
});
```

---

## 2️⃣ Criar Página de Resultados - `resultados.html`

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resultados - GoTrip</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <!-- Navbar -->
    <header>
        <div class="container navbar">
            <div class="logo">
                <a href="index.html">
                    <img src="images/logo.png" alt="GoTrip Logo" id="logo-img">
                    <span>GoTrip</span>
                </a>
            </div>
            <nav>
                <a href="index.html">Home</a>
                <a href="#resultados">Resultados</a>
            </nav>
            <div class="auth">
                <a href="#" class="btn-login">Login</a>
            </div>
        </div>
    </header>

    <!-- Filtros Laterais -->
    <section class="resultados-wrapper">
        <div class="container resultados-container">
            
            <!-- Sidebar Filtros -->
            <aside class="filtros-sidebar">
                <h3>Filtrar Resultados</h3>
                
                <div class="filtro-grupo">
                    <label>Faixa de Preço</label>
                    <input type="range" id="preco-slider" min="0" max="2000" value="2000">
                    <span id="preco-valor">até R$ 2.000</span>
                </div>

                <div class="filtro-grupo">
                    <label>Avaliação</label>
                    <select id="filtro-estrelas">
                        <option value="">Qualquer avaliação</option>
                        <option value="5">5 estrelas</option>
                        <option value="4">4+ estrelas</option>
                        <option value="3">3+ estrelas</option>
                    </select>
                </div>

                <div class="filtro-grupo">
                    <label>
                        <input type="checkbox" id="filtro-wifi"> WiFi Grátis
                    </label>
                </div>

                <button class="btn-primary" onclick="aplicarFiltros()">Aplicar Filtros</button>
            </aside>

            <!-- Resultados -->
            <main class="resultados-main">
                <div class="resultados-header">
                    <h2>Hotéis em <span id="destino-resultado">-</span></h2>
                    <p id="data-resultado">-</p>
                    <p id="hospedes-resultado">-</p>
                </div>

                <div class="resultados-grid" id="hoteis-grid">
                    <p class="loading">Carregando resultados...</p>
                </div>
            </main>

        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
            <p>&copy; 2026 GoTrip - Todos os direitos reservados</p>
        </div>
    </footer>

    <script src="js/script.js"></script>
    <script src="js/resultados.js"></script>

</body>
</html>
```

### CSS adicional para resultados (`css/style.css` - adicione ao final):

```css
/* ==================== RESULTADOS ==================== */
.resultados-wrapper {
    background: #f9fafb;
    padding: 2rem 0;
}

.resultados-container {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 2rem;
}

.filtros-sidebar {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: var(--shadow-md);
    height: fit-content;
}

.filtro-grupo {
    margin-bottom: 1.5rem;
}

.filtro-grupo label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--text-dark);
}

.filtro-grupo input[type="range"],
.filtro-grupo select {
    width: 100%;
    padding: 8px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
}

.resultados-main {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: var(--shadow-md);
}

.resultados-header {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid var(--border-color);
}

.resultados-header h2 {
    color: var(--primary-color);
    margin-bottom: 0.5rem;
}

.resultados-header p {
    color: var(--text-light);
    font-size: 0.95rem;
}

.resultados-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
}

.resultado-card {
    background: white;
    border: 1px solid var(--border-color);
    border-radius: 10px;
    overflow: hidden;
    transition: all 0.3s ease;
    cursor: pointer;
}

.resultado-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
}

.resultado-card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.resultado-card-content {
    padding: 1.5rem;
}

.resultado-card h3 {
    margin-bottom: 0.5rem;
    color: var(--text-dark);
}

.resultado-card-meta {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    font-size: 0.9rem;
}

.resultado-card-preco {
    font-size: 1.3rem;
    font-weight: 800;
    color: var(--primary-color);
    margin-bottom: 1rem;
}

.resultado-card-botoes {
    display: flex;
    gap: 0.5rem;
}

.resultado-card button {
    flex: 1;
    padding: 10px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
}

.resultado-card button.detalhes {
    background: var(--primary-light);
    color: white;
}

.resultado-card button.detalhes:hover {
    background: var(--primary-color);
}

.resultado-card button.favoritar {
    background: white;
    border: 2px solid var(--secondary-color);
    color: var(--secondary-color);
}

.resultado-card button.favoritar:hover {
    background: var(--secondary-color);
    color: white;
}

@media (max-width: 768px) {
    .resultados-container {
        grid-template-columns: 1fr;
    }
    
    .filtros-sidebar {
        order: 2;
    }
    
    .resultados-main {
        order: 1;
    }
    
    .resultado-card-botoes {
        flex-direction: column;
    }
}
```

---

## 3️⃣ JavaScript para Resultados - `js/resultados.js`

```javascript
// js/resultados.js - Página de resultados

const API_BASE = 'http://localhost/GoTrip/api';

// Pegar parâmetros da URL
function obterParametros() {
    const params = new URLSearchParams(window.location.search);
    return {
        destino: params.get('destino') || '',
        checkin: params.get('checkin') || '',
        checkout: params.get('checkout') || '',
        hospedes: params.get('hospedes') || '2'
    };
}

// Inicializar página
document.addEventListener('DOMContentLoaded', () => {
    const params = obterParametros();
    
    // Exibir informações no header
    document.getElementById('destino-resultado').textContent = params.destino;
    document.getElementById('data-resultado').textContent = 
        `${params.checkin} a ${params.checkout}`;
    document.getElementById('hospedes-resultado').textContent = 
        `${params.hospedes} hóspede(s)`;
    
    // Buscar hotéis
    buscarResultados(params);
});

// Buscar hotéis da API
async function buscarResultados(params) {
    const container = document.getElementById('hoteis-grid');
    
    try {
        const url = new URL(API_BASE + '/buscar-hoteis.php');
        url.searchParams.append('destino', params.destino);
        url.searchParams.append('preco_max', 99999);
        url.searchParams.append('estrelas', 0);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Erro na resposta');
        }
        
        const data = await response.json();
        console.log('Hotéis encontrados:', data);
        
        if (data.hoteis && data.hoteis.length > 0) {
            exibirHoteis(data.hoteis, params);
        } else {
            container.innerHTML = '<p style="text-align: center; color: #999;">Nenhum hotel encontrado nesta localidade.</p>';
        }
        
    } catch (erro) {
        console.error('Erro:', erro);
        container.innerHTML = '<p style="text-align: center; color: #999;">Erro ao carregar hotéis. Tente novamente.</p>';
    }
}

// Exibir hotéis
function exibirHoteis(hoteis, params) {
    const container = document.getElementById('hoteis-grid');
    
    const html = hoteis.map(hotel => `
        <div class="resultado-card">
            <img src="${hotel.imagem}" alt="${hotel.nome}">
            <div class="resultado-card-content">
                <h3>${hotel.nome}</h3>
                <div class="resultado-card-meta">
                    <span>${hotel.estrelas} ⭐</span>
                    <span>${hotel.total_quartos} quartos</span>
                </div>
                <p style="color: #666; margin-bottom: 1rem;">${hotel.cidade}</p>
                <div class="resultado-card-preco">
                    A partir de R$ ${parseFloat(hotel.preco_minimo).toFixed(2)}
                </div>
                <div class="resultado-card-botoes">
                    <button class="detalhes" onclick="verDetalhes(${hotel.id})">
                        Ver Detalhes
                    </button>
                    <button class="favoritar" onclick="adicionarFavorito(${hotel.id})">
                        ❤️ Favoritar
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

// Ver detalhes do hotel
function verDetalhes(hotelId) {
    const params = obterParametros();
    const queryString = new URLSearchParams({
        id: hotelId,
        checkin: params.checkin,
        checkout: params.checkout,
        hospedes: params.hospedes
    }).toString();
    
    // Futura redireção
    console.log('Ir para detalhes do hotel:', hotelId);
    // window.location.href = `detalhes.html?${queryString}`;
    
    alert('Página de detalhes ainda em desenvolvimento 🚀');
}

// Adicionar aos favoritos
function adicionarFavorito(hotelId) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    
    if (!favoritos.includes(hotelId)) {
        favoritos.push(hotelId);
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
        showNotification('❤️ Adicionado aos favoritos!', 'success');
    } else {
        showNotification('Já está nos seus favoritos!', 'info');
    }
}

// Aplicar filtros
function aplicarFiltros() {
    const precoMax = document.getElementById('preco-slider').value;
    const estrelas = document.getElementById('filtro-estrelas').value;
    
    console.log('Filtros aplicados:', { precoMax, estrelas });
    showNotification('Filtros atualizados!', 'success');
    
    // Aqui você faria nova busca com os filtros
}

// Atualizar valor do preço
document.getElementById('preco-slider')?.addEventListener('input', (e) => {
    const valor = e.target.value;
    document.getElementById('preco-valor').textContent = 
        `até R$ ${parseInt(valor).toLocaleString('pt-BR')}`;
});
```

---

## 4️⃣ Exemplo: Create Reserva via Modal

### HTML Modal (adicionar ao index.html):

```html
<!-- Modal de Reserva -->
<div class="modal" id="modalReserva">
    <div class="modal-content">
        <span class="modal-close" onclick="fecharModal()">&times;</span>
        <h2>Confirmar Reserva</h2>
        <form id="formReserva">
            <div class="form-group">
                <label>CPF:</label>
                <input type="text" id="cpf-hospede" maxlength="11" required>
            </div>
            <div class="form-group">
                <label>Nome:</label>
                <input type="text" id="nome-hospede" required>
            </div>
            <div class="form-group">
                <label>Email:</label>
                <input type="email" id="email-hospede" required>
            </div>
            <div class="form-group">
                <label>Telefone:</label>
                <input type="tel" id="tel-hospede" required>
            </div>
            
            <div class="resumo-reserva">
                <h4>Resumo</h4>
                <p>Hotel: <span id="resumo-hotel">-</span></p>
                <p>Check-in: <span id="resumo-checkin">-</span></p>
                <p>Check-out: <span id="resumo-checkout">-</span></p>
                <p>Hóspedes: <span id="resumo-hospedes">-</span></p>
                <p style="font-weight: 800; font-size: 1.2rem;">
                    Total: R$ <span id="resumo-total">0</span>
                </p>
            </div>
            
            <button type="submit" class="btn-primary">Confirmar Reserva</button>
        </form>
    </div>
</div>
```

### CSS para Modal (adicionar ao style.css):

```css
.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 10000;
    align-items: center;
    justify-content: center;
}

.modal.ativo {
    display: flex;
}

.modal-content {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
    box-shadow: var(--shadow-lg);
    animation: slideUp 0.3s ease;
}

.modal-close {
    float: right;
    font-size: 2rem;
    cursor: pointer;
    color: #999;
}

.resumo-reserva {
    background: #f9fafb;
    padding: 1rem;
    border-radius: 8px;
    margin: 1rem 0;
}

@keyframes slideUp {
    from {
        transform: translateY(50px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}
```

### JavaScript para abrir e processar:

```javascript
// Abrir modal
function abrirModalReserva(hotelId, hotelNome, checkin, checkout, hospedes, preco) {
    document.getElementById('resumo-hotel').textContent = hotelNome;
    document.getElementById('resumo-checkin').textContent = checkin;
    document.getElementById('resumo-checkout').textContent = checkout;
    document.getElementById('resumo-hospedes').textContent = hospedes;
    
    // Calcular total
    const dias = (new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24);
    const total = preco * dias;
    document.getElementById('resumo-total').textContent = total.toFixed(2);
    
    // Mostrar modal
    document.getElementById('modalReserva').classList.add('ativo');
}

function fecharModal() {
    document.getElementById('modalReserva').classList.remove('ativo');
}

// Processar formulário de reserva
document.getElementById('formReserva')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const dados = {
        cpf: document.getElementById('cpf-hospede').value,
        nome: document.getElementById('nome-hospede').value,
        email: document.getElementById('email-hospede').value,
        telefone: document.getElementById('tel-hospede').value
    };
    
    console.log('Dados para reserva:', dados);
    showNotification('✅ Reserva em processamento...', 'success');
    
    // Aqui você chamaria a API para criar a reserva
});
```

---

## 5️⃣ Exemplo: Dashboard de Reservas

```php
<?php
// api/minhas-reservas.php

require_once 'config.php';

$cpf = limpar($_GET['cpf'] ?? '');

if (empty($cpf)) {
    responder(['erro' => 'CPF obrigatório'], 400);
}

$sql = "SELECT 
    r.id,
    r.checkin,
    r.checkout,
    r.status,
    r.valor_total,
    h.nome as hotel_nome,
    h.cidade,
    q.numero as quarto_numero,
    q.tipo
FROM reserva r
JOIN hospede hp ON r.id_hospede = hp.id
JOIN quarto q ON r.id_quarto = q.id
JOIN hotel h ON q.id_hotel = h.id
WHERE hp.cpf = '$cpf'
ORDER BY r.checkin DESC";

$resultado = $conn->query($sql);

if (!$resultado) {
    responder(['erro' => $conn->error], 500);
}

$reservas = [];
while ($linha = $resultado->fetch_assoc()) {
    $reservas[] = $linha;
}

responder([
    'total_reservas' => count($reservas),
    'reservas' => $reservas
]);

?>
```

---

**Salve este arquivo e consulte sempre que precisar de exemplos! 📚**

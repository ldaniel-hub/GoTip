<!-- GUIA DE INTEGRAÇÃO COM XAMPP E BANCO DE DADOS -->

# 🔌 GUIA DE INTEGRAÇÃO - GoTrip com XAMPP

## 📋 Sumário

1. [Preparação XAMPP](#preparação-xampp)
2. [Estruturação PHP](#estruturação-php)
3. [API REST endpoints](#api-rest-endpoints)
4. [Conectar Frontend com Backend](#conectar-frontend-com-backend)
5. [Testes](#testes)

---

## 🖥️ Preparação XAMPP

### Passo 1: Copiar Projeto para htdocs

```bash
# Windows
cd C:\xampp\htdocs
xcopy C:\Users\Aluno\Downloads\GoTip\GoTrip\ GoTrip\ /E /I

# Mac/Linux
cp -r /Users/Aluno/Downloads/GoTip/GoTrip /Applications/XAMPP/htdocs/
```

### Passo 2: Iniciar XAMPP

- **Windows**: Abra `xampp-control.exe`
- **Mac/Linux**: `sudo /Applications/XAMPP/xamppfiles/mambo start`

Inicie:
- Apache ✅
- MySQL ✅

### Passo 3: Criar Banco de Dados

1. Abra http://localhost/phpmyadmin
2. Clique em "SQL" (ou "Nova" no canto esquerdo)
3. Execute este script:

```sql
CREATE DATABASE gotrip_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gotrip_db;

-- Hotéis
CREATE TABLE hotel (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    endereco VARCHAR(255),
    telefone VARCHAR(20),
    email VARCHAR(255),
    estrelas FLOAT DEFAULT 4.5,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quartos
CREATE TABLE quarto (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_hotel INT NOT NULL,
    numero INT NOT NULL,
    tipo VARCHAR(50),
    descricao TEXT,
    capacidade INT NOT NULL,
    preco_base DECIMAL(10, 2) NOT NULL,
    status ENUM('disponível', 'ocupado', 'manutenção') DEFAULT 'disponível',
    FOREIGN KEY (id_hotel) REFERENCES hotel(id),
    UNIQUE KEY (id_hotel, numero)
);

-- Hóspedes
CREATE TABLE hospede (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cpf VARCHAR(11) UNIQUE,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    telefone VARCHAR(20),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reservas
CREATE TABLE reserva (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_hospede INT NOT NULL,
    id_quarto INT NOT NULL,
    checkin DATE NOT NULL,
    checkout DATE NOT NULL,
    num_hospedes INT NOT NULL,
    status ENUM('ativa', 'cancelada', 'finalizada') DEFAULT 'ativa',
    valor_total DECIMAL(10, 2),
    data_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_hospede) REFERENCES hospede(id),
    FOREIGN KEY (id_quarto) REFERENCES quarto(id),
    CONSTRAINT check_checkout_pos_checkin CHECK (checkout > checkin),
    CONSTRAINT check_hospedes_valido CHECK (num_hospedes > 0)
);

-- Funcionários
CREATE TABLE funcionario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_hotel INT NOT NULL,
    cpf VARCHAR(11) UNIQUE,
    nome VARCHAR(255) NOT NULL,
    cargo VARCHAR(100),
    FOREIGN KEY (id_hotel) REFERENCES hotel(id)
);

-- Serviços
CREATE TABLE servico (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    descricao TEXT
);

-- Serviço por Reserva
CREATE TABLE servico_reserva (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_servico INT NOT NULL,
    id_reserva INT NOT NULL,
    quantidade INT DEFAULT 1,
    id_funcionario INT,
    data_solicitacao DATE,
    valor_total DECIMAL(10, 2),
    FOREIGN KEY (id_servico) REFERENCES servico(id),
    FOREIGN KEY (id_reserva) REFERENCES reserva(id),
    FOREIGN KEY (id_funcionario) REFERENCES funcionario(id)
);

-- Pagamentos
CREATE TABLE pagamento (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_reserva INT NOT NULL UNIQUE,
    valor DECIMAL(10, 2) NOT NULL CHECK (valor >= 0),
    status ENUM('pendente', 'pago', 'reembolsado') DEFAULT 'pendente',
    data_pagamento DATE,
    metodo_pagamento VARCHAR(50),
    FOREIGN KEY (id_reserva) REFERENCES reserva(id)
);

-- Inserir dados de exemplo
INSERT INTO hotel (nome, cidade, endereco, telefone, email, estrelas) VALUES
('Hotel Canvas', 'Rio de Janeiro', 'Av. Atlântica, 1702', '(21) 2546-8000', 'canvas@hotel.com', 4.8),
('Copacabana Palace', 'Rio de Janeiro', 'Av. Atlântica, 1702', '(21) 2548-7070', 'palace@hotel.com', 4.9),
('Hotel Unique', 'São Paulo', 'Av. Brigadeiro Jaime, 164', '(11) 3055-4700', 'unique@hotel.com', 4.7),
('Bahia Othon Palace', 'Salvador', 'Av. Atlântica, 240', '(71) 3203-1111', 'othon@hotel.com', 4.5),
('Jatiúca Resort', 'Maceió', 'Praia de Jatiúca', '(82) 3231-0505', 'jatiuca@hotel.com', 4.6);

INSERT INTO quarto (id_hotel, numero, tipo, capacidade, preco_base) VALUES
(1, 101, 'single', 1, 489),
(1, 102, 'double', 2, 589),
(1, 103, 'suite', 4, 899),
(2, 201, 'presidencial', 4, 1500),
(3, 301, 'double', 2, 650);

INSERT INTO servico (nome, preco) VALUES
('Piscina', 0),
('WiFi', 0),
('Estacionamento', 50),
('Spa', 150),
('Academia', 0),
('Room Service', 25);

-- Criar usuário PHP
INSERT INTO hospede (cpf, nome, email, telefone) VALUES
('12345678901', 'João Silva', 'joao@email.com', '(11) 99999-9999'),
('98765432101', 'Maria Santos', 'maria@email.com', '(21) 98888-8888');
```

✅ **Pronto!** Banco criado e populado.

---

## 🛠️ Estruturação PHP

### Passo 1: Criar Estrutura de Pastas

```bash
GoTrip/
├── api/
│   ├── config.php                 # Conexão DB
│   ├── buscar-hoteis.php          # GET - Buscar hotéis
│   ├── destinos.php               # GET - Autocomplete
│   ├── hotel.php                  # GET - Detalhes hotel
│   ├── disponibilidade.php        # GET - Verificar datas
│   ├── reservar.php               # POST - Criar reserva
│   ├── pagamento.php              # POST - Processar pagamento
│   └── ...
├── js/
│   └── script.js                  # Frontend (já feito)
├── css/
│   └── style.css                  # (já feito)
└── index.html                     # (já feito)
```

### Passo 2: Criar `api/config.php`

```php
<?php
// api/config.php - Configuração de conexão

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Dados de conexão
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');  // XAMPP padrão é vazio
define('DB_NAME', 'gotrip_db');

// Conectar ao MySQL
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Verificar conexão
if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(['erro' => 'Conexão falhou: ' . $conn->connect_error]));
}

// Definir UTF-8
$conn->set_charset("utf8mb4");

// Função para responder em JSON
function responder($dados, $codigo = 200) {
    http_response_code($codigo);
    echo json_encode($dados, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

// Função para safar contra SQL injection
function limpar($dados) {
    global $conn;
    return $conn->real_escape_string(trim($dados));
}

// Requisições de exemplo
$metodo = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

?>
```

### Passo 3: Criar `api/buscar-hoteis.php`

```php
<?php
// api/buscar-hoteis.php - Buscar hotéis com filtros

require_once 'config.php';

$destino = limpar($_GET['destino'] ?? '');
$preco_min = (float)($_GET['preco_min'] ?? 0);
$preco_max = (float)($_GET['preco_max'] ?? 99999);
$estrelas = (float)($_GET['estrelas'] ?? 0);

if (empty($destino)) {
    responder(['erro' => 'Destino é obrigatório'], 400);
}

// SQL com filtros
$sql = "SELECT h.id, h.nome, h.cidade, h.email, h.telefone, h.estrelas,
               COUNT(DISTINCT q.id) as total_quartos,
               MIN(q.preco_base) as preco_minimo,
               'https://picsum.photos/id/1015/400/250' as imagem
        FROM hotel h
        LEFT JOIN quarto q ON h.id = q.id_hotel
        WHERE h.cidade LIKE '%$destino%'
        AND h.estrelas >= $estrelas
        GROUP BY h.id
        HAVING preco_minimo <= $preco_max AND preco_minimo >= $preco_min
        ORDER BY h.estrelas DESC
        LIMIT 20";

$resultado = $conn->query($sql);

if (!$resultado) {
    responder(['erro' => 'Erro na busca: ' . $conn->error], 500);
}

$hoteis = [];
while ($linha = $resultado->fetch_assoc()) {
    $hoteis[] = $linha;
}

responder([
    'total' => count($hoteis),
    'hoteis' => $hoteis
]);

?>
```

### Passo 4: Criar `api/destinos.php`

```php
<?php
// api/destinos.php - Autocomplete de destinos

require_once 'config.php';

$termo = limpar($_GET['q'] ?? '');

$sql = "SELECT DISTINCT cidade FROM hotel";

if (!empty($termo)) {
    $sql .= " WHERE cidade LIKE '%$termo%'";
}

$sql .= " ORDER BY cidade ASC LIMIT 10";

$resultado = $conn->query($sql);

if (!$resultado) {
    responder(['erro' => $conn->error], 500);
}

$destinos = [];
while ($linha = $resultado->fetch_assoc()) {
    $destinos[] = $linha['cidade'];
}

responder($destinos);

?>
```

### Passo 5: Criar `api/disponibilidade.php`

```php
<?php
// api/disponibilidade.php - Verificar if quarto está disponível

require_once 'config.php';

$id_quarto = (int)($_GET['id_quarto'] ?? 0);
$checkin = limpar($_GET['checkin'] ?? '');
$checkout = limpar($_GET['checkout'] ?? '');

if (!$id_quarto || !$checkin || !$checkout) {
    responder(['erro' => 'Parâmetros incompletos'], 400);
}

// Verificar se há reservas sobrepostas
$sql = "SELECT COUNT(*) as conflitos FROM reserva 
        WHERE id_quarto = $id_quarto 
        AND status IN ('ativa', 'finalizada')
        AND (
            (checkin < '$checkout' AND checkout > '$checkin')
        )";

$resultado = $conn->query($sql);
$dados = $resultado->fetch_assoc();

$disponivel = ($dados['conflitos'] == 0);

responder([
    'id_quarto' => $id_quarto,
    'checkin' => $checkin,
    'checkout' => $checkout,
    'disponivel' => $disponivel
]);

?>
```

### Passo 6: Criar `api/reservar.php`

```php
<?php
// api/reservar.php - Criar nova reserva

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    responder(['erro' => 'Método deve ser POST'], 405);
}

$dados = json_decode(file_get_contents('php://input'), true);

// Validações
$id_hospede = (int)($dados['id_hospede'] ?? 0);
$id_quarto = (int)($dados['id_quarto'] ?? 0);
$checkin = limpar($dados['checkin'] ?? '');
$checkout = limpar($dados['checkout'] ?? '');
$num_hospedes = (int)($dados['num_hospedes'] ?? 0);

if (!$id_hospede || !$id_quarto || !$checkin || !$checkout || !$num_hospedes) {
    responder(['erro' => 'Dados incompletos'], 400);
}

// Verificar capacidade
$sql = "SELECT capacidade FROM quarto WHERE id = $id_quarto";
$resultado = $conn->query($sql);
$quarto = $resultado->fetch_assoc();

if ($num_hospedes > $quarto['capacidade']) {
    responder(['erro' => 'Número de hóspedes excede capacidade'], 400);
}

// Verificar disponibilidade
$sql = "SELECT COUNT(*) as conflitos FROM reserva 
        WHERE id_quarto = $id_quarto 
        AND status != 'cancelada'
        AND (checkin < '$checkout' AND checkout > '$checkin')";

$resultado = $conn->query($sql);
$check = $resultado->fetch_assoc();

if ($check['conflitos'] > 0) {
    responder(['erro' => 'Quarto indisponível nessa data'], 409);
}

// Calcular valor
$dias = (strtotime($checkout) - strtotime($checkin)) / 86400;
$sql = "SELECT preco_base FROM quarto WHERE id = $id_quarto";
$resultado = $conn->query($sql);
$q = $resultado->fetch_assoc();
$valor_total = $q['preco_base'] * $dias;

// Criar reserva
$sql = "INSERT INTO reserva (id_hospede, id_quarto, checkin, checkout, num_hospedes, valor_total)
        VALUES ($id_hospede, $id_quarto, '$checkin', '$checkout', $num_hospedes, $valor_total)";

if ($conn->query($sql)) {
    $id_reserva = $conn->insert_id;
    
    // Criar pagamento
    $conn->query("INSERT INTO pagamento (id_reserva, valor, status) 
                  VALUES ($id_reserva, $valor_total, 'pendente')");
    
    responder([
        'sucesso' => true,
        'id_reserva' => $id_reserva,
        'valor_total' => $valor_total,
        'dias' => $dias
    ], 201);
} else {
    responder(['erro' => $conn->error], 500);
}

?>
```

---

## 🔗 Conectar Frontend com Backend

### Modificar `js/script.js`

Adicione isto no final do arquivo:

```javascript
// ==================== INTEGRAÇÃO COM API ====================

// URL base da API
const API_BASE = 'http://localhost/GoTrip/api';

// Substituir dados mock por API
async function fetchHoteis(parametros) {
    try {
        const url = new URL(API_BASE + '/buscar-hoteis.php');
        Object.keys(parametros).forEach(key => {
            url.searchParams.append(key, parametros[key]);
        });
        
        console.log('Buscando em:', url);
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erro na API');
        
        const data = await response.json();
        console.log('Resultado:', data);
        
        return data.hoteis || [];
    } catch (erro) {
        console.error('Erro ao buscar hotéis:', erro);
        showNotification('Erro ao conectar com servidor', 'error');
        return [];
    }
}

// Substituir autocomplete com API
async function fetchDestinos(termo) {
    try {
        const response = await fetch(API_BASE + '/destinos.php?q=' + encodeURIComponent(termo));
        const destinos = await response.json();
        return destinos;
    } catch (erro) {
        console.error('Erro ao buscar destinos:', erro);
        return [];
    }
}

// Verificar disponibilidade
async function verificarDisponibilidade(id_quarto, checkin, checkout) {
    try {
        const url = `${API_BASE}/disponibilidade.php?id_quarto=${id_quarto}&checkin=${checkin}&checkout=${checkout}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.disponivel;
    } catch (erro) {
        console.error('Erro ao verificar disponibilidade:', erro);
        return false;
    }
}

// Criar reserva
async function criarReserva(dados) {
    try {
        const response = await fetch(API_BASE + '/reservar.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        
        const resultado = await response.json();
        
        if (resultado.sucesso) {
            showNotification('Reserva criada com sucesso! ID: ' + resultado.id_reserva, 'success');
            return resultado;
        } else {
            showNotification('Erro: ' + resultado.erro, 'error');
            return null;
        }
    } catch (erro) {
        console.error('Erro ao criar reserva:', erro);
        showNotification('Erro ao processar reserva', 'error');
        return null;
    }
}

// Atualizar busca para usar API
function loadPopularesCards() {
    const container = document.getElementById('cards-populares');
    if (!container) return;
    
    fetchHoteis({ estrelas: 4, preco_max: 1000 }).then(hoteis => {
        const html = hoteis.map(hotel => `
            <div class="card" onclick="verDetalhesHotel(${hotel.id})">
                <img src="${hotel.imagem}" alt="${hotel.nome}">
                <div class="card-content">
                    <h3>${hotel.nome}</h3>
                    <p>${hotel.cidade} • <span class="card-rating">${hotel.estrelas} ⭐</span></p>
                    <p class="card-price">A partir de R$ ${hotel.preco_minimo}/noite</p>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = html;
        addCardClickListeners();
    });
}

function verDetalhesHotel(id) {
    console.log('Ver detalhes do hotel:', id);
    // Futura redireção para detalhes.html?id=X
}
```

---

## ✅ Testes

### Teste 1: Verificar Conexão

Acesse: http://localhost/GoTrip/api/destinos.php

Você deve receber:

```json
[
    "Rio de Janeiro",
    "São Paulo",
    "Salvador",
    "Maceió"
]
```

### Teste 2: Buscar Hotéis

Acesse: http://localhost/GoTrip/api/buscar-hoteis.php?destino=Rio&preco_max=1000

Você deve receber:

```json
{
    "total": 2,
    "hoteis": [
        {
            "id": 1,
            "nome": "Hotel Canvas",
            "cidade": "Rio de Janeiro",
            "estrelas": 4.8,
            "preco_minimo": "489.00",
            ...
        }
    ]
}
```

### Teste 3: Criar Reserva

Via Postman ou curl:

```bash
curl -X POST http://localhost/GoTrip/api/reservar.php \
  -H "Content-Type: application/json" \
  -d '{
    "id_hospede": 1,
    "id_quarto": 1,
    "checkin": "2026-04-20",
    "checkout": "2026-04-22",
    "num_hospedes": 2
  }'
```

Resposta:

```json
{
    "sucesso": true,
    "id_reserva": 1,
    "valor_total": "978.00",
    "dias": 2
}
```

---

## 🚀 Próximos Passos

1. ✅ Testar todas as APIs com Postman
2. ⏭️ Criar página `resultados.html` que consome API
3. ⏭️ Integrar autenticação (login/cadastro)
4. ⏭️ Implementar carrinho de compras
5. ⏭️ Payment gateway

---

**Pronto para começar! 🎉**

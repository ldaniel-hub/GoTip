# 🏨 GoTrip - Platform de Reserva de Hotéis

Um site estilo **Trivago** para reserva de hotéis, construído com HTML5, CSS3 e JavaScript vanilla. Integrado com banco de dados em XAMPP.

**Projeto de faculdade SENAI Mariano Ferraz para a matéria de banco de dados.**

---

## 📋 Visão Geral

GoTrip é uma plataforma moderna e responsiva para busca e reserva de hotéis em todo o Brasil, com foco em:
- ✨ Busca avançada com múltiplos filtros
- 🎨 Interface intuitiva e moderna
- 📱 Compatibilidade mobile-first
- 🔗 Fácil integração com backend em PHP/XAMPP

## 🏗️ Estrutura do Projeto

```
GoTrip/
├── index.html              # Página inicial reformulada
├── reserva.html            # Página de reserva
├── sobre.html              # Página sobre
├── css/
│   └── style.css           # Estilos modernos com variáveis CSS
├── js/
│   └── script.js           # Funcionalidades frontend
├── images/                 # Pasta para imagens/logo
└── README.md              # Documentação
```

## ✨ Características Principais

### 🔍 Search Box Inteligente
- 📍 **Autocomplete de destinos** - 10 cidades principais sugeridas
- 📅 **Seletor de datas** - Com validação automática (checkout > checkin)
- 👥 **Seletor de hóspedes** - 1 a 5+ hóspedes
- ⭐ **Filtro de categoria** - Por número de estrelas
- 🎯 **Filtros avançados** - Colapsível e organizado

### 🎚️ Filtros Avançados
- 💰 **Faixa de preço** - Mínimo e máximo
- 🛏️ **Tipo de quarto** - Single, Double, Suite, Presidencial
- 🏊 **Serviços** - WiFi, Piscina, Academia, Restaurante, Estacionamento

### 📊 Seções de Conteúdo
| Seção | Descrição |
|-------|-----------|
| Quick Stats | Exibir estatísticas (2.500+ hotéis, 150k+ reviews) |
| Ofertas Especiais | Cards destacados com descontos |
| Hotéis Populares | Grid completo de hotéis mais buscados |
| Recomendados | Personalizados (futuro: baseado em histórico) |
| Serviços | 8 cards mostrando amenidades disponíveis |
| Destinos Populares | 4 destinos principais brasileiros |
| Newsletter | Formulário para inscrição |

## 🎨 Design & UX

### 🎭 Sistema de Cores
```css
--primary-color: #1e3a8a      /* Azul escuro - principal */
--primary-dark: #2c4a9c       /* Azul mais escuro - hover */
--primary-light: #3b82f6      /* Azul claro - destaque */
--secondary-color: #f59e0b    /* Laranja - chamada à ação */
--success-color: #10b981      /* Verde - sucesso */
--danger-color: #ef4444       /* Vermelho - erro */
```

### 🎬 Efeitos Visuais
- ✨ Hover effects nos cards (elevação + zoom na imagem)
- 🎭 Animações suaves (slideDown, slideInRight, slideOutRight)
- 🔄 Transições CSS fluidas (0.3s ease)
- 📱 Design responsivo totalmente funcional

### 📐 Tipografia
- **Font Principal**: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Hierarquia clara** com font-sizes em rem (escalável)
- **Contraste** de cores acessível e legível

## 🚀 Getting Started

### ⚡ Uso Rápido Local

1. **Extraia o projeto**
2. **Abra no navegador** - Duplo clique em `index.html`

```bash
# Ou você pode abrir via terminal
open index.html                    # macOS
start index.html                   # Windows
xdg-open index.html               # Linux
```

### 🖥️ Com XAMPP

1. **Localize htdocs**: 
   - Windows: `C:\xampp\htdocs\`
   - Mac: `/Applications/XAMPP/htdocs/`
   - Linux: `/opt/lampp/htdocs/`

2. **Copie a pasta GoTrip**:
```bash
cp -r GoTrip /path/to/xampp/htdocs/
```

3. **Acesse via browser**:
```
http://localhost/GoTrip/
```

## 💻 Tecnologias Utilizadas

| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| HTML5 | - | Estrutura semântica |
| CSS3 | - | Design responsivo com Grid/Flexbox |
| JavaScript | ES6+ | Lógica frontend (Vanilla JS) |
| Variáveis CSS | - | Sistema de cores escalável |

**Zero dependências externas** - Tudo funciona nativamente no navegador!

## 🔗 Integração com Backend (XAMPP/PHP)

### 📦 Dados Atualmente Inclusos
- ✅ 6 hotéis mock com imagens
- ✅ Autocomplete com 10 cidades
- ✅ Notificações toast
- ✅ Validação de formulário

### 🔌 Quando Integrar com XAMPP

**1. Substituir dados mock** em `js/script.js`:

```javascript
// Antes (mock atual):
const hotel = hotelsMock[0];

// Depois (com API):
fetch('http://localhost/GoTrip/api/hoteis.php?destino=Rio')
    .then(r => r.json())
    .then(data => {
        console.log('Hotéis:', data);
        renderCards(data);
    })
    .catch(e => console.error('Erro:', e));
```

**2. API Endpoints necessários**:

```
POST   /api/buscar-hoteis.php
       Params: destino, checkin, checkout, hospedes, preco_min, preco_max
       Return: [{ id, nome, cidade, preco, estrelas, imagem }, ...]

GET    /api/destinos.php
       Return: ['Rio de Janeiro', 'São Paulo', ...]

GET    /api/hotel/{id}.php
       Return: { id, nome, cidade, quartos: [], servicos: [], avaliacoes: [] }

POST   /api/reservar.php
       Body: { id_hospede, id_quarto, checkin, checkout, servicos: [] }
       Return: { sucesso: true, id_reserva: 123 }

GET    /api/disponibilidade.php?id_quarto=1&checkin=2026-04-14&checkout=2026-04-15
       Return: { disponivel: true }
```

**3. Query string de busca**:
```
Exemplo completo:
?destino=Rio%20de%20Janeiro
&checkin=2026-04-14
&checkout=2026-04-15
&hospedes=2
&preco-min=0
&preco-max=1000
&estrelas=4
&wifi=true
&piscina=true
```

## 📊 Banco de Dados - Estrutura SQL

Baseado nas regras de negócio fornecidas:

```sql
-- Hotéis
CREATE TABLE hotel (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    endereco VARCHAR(255),
    telefone VARCHAR(20),
    email VARCHAR(255),
    estrelas FLOAT DEFAULT 0,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quartos
CREATE TABLE quarto (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_hotel INT NOT NULL,
    numero INT NOT NULL,
    tipo VARCHAR(50), -- 'single', 'double', 'suite', 'presidencial'
    descricao TEXT,
    capacidade INT NOT NULL,
    preco_base DECIMAL(10, 2) NOT NULL,
    status ENUM('disponível', 'ocupado', 'manutenção') DEFAULT 'disponível',
    FOREIGN KEY (id_hotel) REFERENCES hotel(id)
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
    metodo_pagamento VARCHAR(50), -- 'credito', 'debito', 'pix', etc
    FOREIGN KEY (id_reserva) REFERENCES reserva(id)
);
```

## ✅ Regras de Negócio Implementadas

### Frontend
- ✅ **Validação de datas** - Checkout deve ser > Checkin
- ✅ **Campos obrigatórios** - Destino, datas necessárias
- ✅ **Capacidade de hóspedes** - 1 a 5+
- ✅ **Filtros de preço e serviços** - Múltiplas opções
- ✅ **Sistema de rating** - Estrelas de 0 a 5
- ✅ **Status de reserva** - Ativa, cancelada, finalizada

### Backend (MySQL)
- ✅ **CPF único** - Hóspedes e funcionários
- ✅ **Número de quarto único por hotel** - Por hotel
- ✅ **Sem datas sobrepostas** - Quartos não podem ter reservas simultâneas
- ✅ **Valores positivos** - Nenhum valor negativo
- ✅ **Checkout > Checkin** - Constraint de data
- ✅ **Capacidade respeitada** - Hóspedes ≤ Capacidade do quarto

## 📱 Responsividade

### 📐 Breakpoints
```css
Desktop    : 1200px e acima   →  Desktop completo, 3-4 colunas
Tablet     : 768px - 1199px   →  2 colunas, menu adaptado
Mobile     : até 480px        →  1 coluna, menu mobile
```

**Todos os elementos** se adaptam automaticamente com CSS Grid e Flexbox!

## 🔔 Sistema de Notificações

Mensagens toast no canto superior direito com auto-dismiss (3s):

```javascript
showNotification('Mensagem aqui', 'success')   // ✅ Verde
showNotification('Erro aqui', 'error')         // ❌ Vermelho
showNotification('Info aqui', 'info')          // ℹ️ Azul
```

## 📝 Próximas Implementações

### Fase 2 - Frontend
- [ ] Página de resultados (resultados.html) - Mostra hotéis encontrados
- [ ] Detalhes do hotel (detalhes.html) - Fotos, descrição, mapa
- [ ] Carrinho de reservas - Salvar múltiplas buscas
- [ ] Dashboard do usuário - Minhas reservas
- [ ] Sistema de avaliações - Reviews e comentários

### Fase 3 - Backend
- [ ] Integração XAMPP/PHP
- [ ] Autenticação e autorização
- [ ] Payment gateway (Stripe, PagSeguro)
- [ ] Email de confirmação
- [ ] Admin panel para gerenciar hotéis
- [ ] Relatórios e estatísticas

### Fase 4 - Recursos Avançados
- [ ] Mapa interativo de destinos (Google Maps)
- [ ] Recomendações IA baseadas em histórico
- [ ] Programa de fidelidade
- [ ] Dark mode
- [ ] Internacionalização (i18n)

## 🧪 Testando Localmente

### Test do Search Form
1. Abra DevTools (F12)
2. Console - Veja os logs de busca
3. Preecha o formulário e clique "Buscar Hotéis"
4. Deve aparecer notificação de sucesso

### Test de Responsividade
```
DevTools → Toggle Device Toolbar (Ctrl+Shift+M)
Selecione: iPhone 12, iPad Pro, Desktop
```

## 🐛 Troubleshooting

| Problema | Solução |
|----------|---------|
| Imagens não aparecem | Adicione `GoTrip/images/hero.jpg` |
| Dados não carregam | Use XAMPP, não arquivo local |
| Formulário não funciona | Abra console (F12) e veja erros |
| Layout quebrado no mobile | Verifique viewport meta tag |
| Autocomplete vazio | Dados estão hardcoded, funciona sempre |

## 📧 Informações de Contato

- **Email**: contato@gotrip.com
- **Telefone**: 0800 123 4567
- **Website**: www.gotrip.com

## 👥 Equipe do Projeto

- **Desenvolvedor Frontend**: [Seu Nome]
- **Instituição**: SENAI Mariano Ferraz
- **Disciplina**: Banco de Dados
- **Ano**: 2026

## 📄 Licença

Projeto educacional - Todos os direitos reservados © 2026 GoTrip

---

**Desenvolvido com ❤️ para melhorar a experiência de viagem dos brasileiros!**

*Última atualização: 14 de abril de 2026*

document.addEventListener('DOMContentLoaded', () => {

    // Formulário de busca
    const searchForm = document.getElementById('searchForm');
    
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const destino = document.getElementById('destino').value.trim();
            const checkin = document.getElementById('checkin').value;
            const checkout = document.getElementById('checkout').value;
            const hosp = document.getElementById('hosp').value;

            if (!destino) {
                alert("Por favor, informe o destino ou nome do hotel.");
                return;
            }

            // Quando o back-end estiver pronto, redirecione ou chame API aqui
            console.log('Buscando hotéis:', { destino, checkin, checkout, hosp });
            
            // Exemplo: redirecionar para página de resultados
            // window.location.href = `resultados.html?destino=${encodeURIComponent(destino)}&checkin=${checkin}&checkout=${checkout}&hosp=${hosp}`;
            
            alert(`Buscando hotéis em "${destino}" para ${hosp} hóspedes.\n\n(Conexão com banco será feita aqui)`);
        });
    }

    // Placeholder para cards de destaques (substituir por fetch do banco depois)
    const cardsContainer = document.getElementById('cards-destaques');
    if (cardsContainer) {
        // Remover mensagem de loading quando tiver dados reais
        setTimeout(() => {
            cardsContainer.innerHTML = `
                <div class="card">
                    <img src="https://picsum.photos/id/1015/600/400" alt="Hotel">
                    <div class="card-content">
                        <h3>Hotel Canvas</h3>
                        <p>Rio de Janeiro • 4.8 ★★★★☆</p>
                        <p>A partir de R$ 489/noite</p>
                    </div>
                </div>
                <!-- Adicione mais cards conforme necessário -->
            `;
        }, 800);
    }
});
async function carregarMusicas() {
    try {
        const resposta = await fetch('/api/songs');
        let musicas = await resposta.json(); // Mudamos para 'let' para podermos alterar
        
        const lista = document.getElementById('songsList');
        
        if (musicas.length === 0) {
            lista.innerHTML = "<p>Nenhuma música disponível ainda.</p>";
            return;
        }

        // ADICIONE ESTA LINHA ABAIXO:
        // Inverte a ordem: a última música adicionada passa a ser a primeira da lista
        musicas.reverse();

        lista.innerHTML = musicas.map(m => `
            <div class="card">
                <div class="card-info">
                    <h3>${m.title}</h3>
                    <p>Lançamento: ${m.month}</p>
                </div>
                <a href="/uploads/${m.filename}" class="btn-download" download>Download</a>
            </div>
        `).join('');
    } catch (erro) {
        console.error("Erro ao carregar músicas:", erro);
    }
}

carregarMusicas();
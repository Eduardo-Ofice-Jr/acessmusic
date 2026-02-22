const formulario = document.getElementById('uploadForm');
const listaAdmin = document.getElementById('adminList');

// Função para listar as músicas no painel
async function listarMusicasAdmin() {
    const res = await fetch('/api/songs');
    const musicas = await res.json();
    
    // INVERTER A ORDEM
    musicas.reverse();

    listaAdmin.innerHTML = musicas.map(m => `
        <div class="card" style="justify-content: space-between; align-items: center; text-align: left;">
            <div class="card-info">
                <strong>${m.title}</strong><br>
                <small>Mês: ${m.month}</small>
            </div>
            <button class="btn-danger" onclick="apagarMusica(${m.id})">Eliminar</button>
        </div>
    `).join('');
}

// Evento de Upload
formulario.onsubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('month', document.getElementById('month').value);
    formData.append('file', document.getElementById('file').files[0]);

    const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
    });

    if (res.ok) {
        alert("Música carregada com sucesso!");
        formulario.reset();
        listarMusicasAdmin();
    }
};

// Função para Apagar
async function apagarMusica(id) {
    if (confirm("Tens a certeza que queres eliminar esta música?")) {
        await fetch(`/api/songs/${id}`, { method: 'DELETE' });
        listarMusicasAdmin();
    }
}

// Iniciar a lista ao abrir
listarMusicasAdmin();
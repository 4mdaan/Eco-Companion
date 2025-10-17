// Funcionalidades para a página de pacotes

// Função para adicionar pacote ao carrinho
function adicionarAoCarrinho(botao) {
    const pacoteData = {
        id: botao.getAttribute('data-pacote-id'),
        nome: botao.getAttribute('data-pacote-nome'),
        preco: parseFloat(botao.getAttribute('data-pacote-preco').replace('.', '').replace(',', '.')),
        periodo: botao.getAttribute('data-pacote-periodo'),
        imagem: botao.getAttribute('data-pacote-imagem'),
        tipo: 'pacote'
    };

    // Recuperar carrinho do localStorage ou criar novo
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    // Verificar se o pacote já está no carrinho
    const pacoteExistente = carrinho.find(item => item.id === pacoteData.id && item.tipo === 'pacote');
    
    if (pacoteExistente) {
        // Se já existe, incrementar quantidade
        pacoteExistente.quantidade += 1;
        mostrarNotificacao(`${pacoteData.nome} - Quantidade atualizada no carrinho!`, 'info');
    } else {
        // Se não existe, adicionar novo item
        pacoteData.quantidade = 1;
        carrinho.push(pacoteData);
        mostrarNotificacao(`${pacoteData.nome} adicionado ao carrinho!`, 'success');
    }
    
    // Salvar no localStorage
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    
    // Atualizar contador do carrinho se existir
    atualizarContadorCarrinho();
    
    // Feedback visual no botão
    const textoOriginal = botao.innerHTML;
    botao.innerHTML = '<span class="btn-icon">✅</span>Adicionado!';
    botao.disabled = true;
    botao.classList.add('btn-added');
    
    setTimeout(() => {
        botao.innerHTML = textoOriginal;
        botao.disabled = false;
        botao.classList.remove('btn-added');
    }, 2000);
}

// Função para mostrar notificações
function mostrarNotificacao(mensagem, tipo = 'success') {
    // Remover notificação anterior se existir
    const notificacaoAnterior = document.querySelector('.notification');
    if (notificacaoAnterior) {
        notificacaoAnterior.remove();
    }
    
    // Criar nova notificação
    const notificacao = document.createElement('section');
    notificacao.className = `notification notification-${tipo}`;
    notificacao.innerHTML = `
        <section class="notification-content">
            <span class="notification-icon">
                ${tipo === 'success' ? '✅' : tipo === 'info' ? 'ℹ️' : '⚠️'}
            </span>
            <span class="notification-message">${mensagem}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </section>
    `;
    
    // Adicionar ao body
    document.body.appendChild(notificacao);
    
    // Auto remover após 4 segundos
    setTimeout(() => {
        if (notificacao.parentElement) {
            notificacao.classList.add('notification-fade-out');
            setTimeout(() => notificacao.remove(), 300);
        }
    }, 4000);
}

// Função para atualizar contador do carrinho no header
function atualizarContadorCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const contador = document.querySelector('#carrinho-contador, .carrinho-contador');
    
    if (contador) {
        const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
        contador.textContent = totalItens;
        contador.style.display = totalItens > 0 ? 'inline-block' : 'none';
    }
}

// Função para ir para o carrinho
function irParaCarrinho() {
    window.location.href = '/carrinho';
}

// Inicializar contador do carrinho quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    atualizarContadorCarrinho();
});

// Função para filtrar pacotes (melhorar a funcionalidade existente)
function filtrarPacotes(categoria) {
    // Esta função pode ser expandida para filtrar via JavaScript no frontend
    // Por enquanto, usar os links com parâmetros de query
    window.location.href = `/pacotes${categoria !== 'todos' ? '?categoria=' + categoria : ''}`;
}
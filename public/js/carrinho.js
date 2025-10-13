// Funções do carrinho de compras

// Adicionar item ao carrinho
function adicionarAoCarrinho(slug, quantidade = 1) {
    const btnOriginal = event.target;
    const textoOriginal = btnOriginal.textContent;
    
    // Feedback visual
    btnOriginal.textContent = 'Adicionando...';
    btnOriginal.disabled = true;
    
    fetch('/carrinho/adicionar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug, quantidade })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Mostrar notificação de sucesso
            mostrarNotificacao(data.message, 'success');
            
            // Atualizar contador do carrinho
            atualizarContadorCarrinho(data.quantidadeCarrinho);
            
            // Restaurar botão
            btnOriginal.textContent = 'Adicionado!';
            btnOriginal.style.background = '#10b981';
            
            setTimeout(() => {
                btnOriginal.textContent = textoOriginal;
                btnOriginal.style.background = '';
                btnOriginal.disabled = false;
            }, 2000);
        } else {
            mostrarNotificacao(data.message, 'error');
            btnOriginal.textContent = textoOriginal;
            btnOriginal.disabled = false;
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        mostrarNotificacao('Erro ao adicionar ao carrinho', 'error');
        btnOriginal.textContent = textoOriginal;
        btnOriginal.disabled = false;
    });
}

// Atualizar contador do carrinho no header
function atualizarContadorCarrinho(quantidade) {
    const contador = document.getElementById('carrinho-contador');
    if (contador) {
        contador.textContent = quantidade;
        if (quantidade > 0) {
            contador.classList.remove('hidden');
        } else {
            contador.classList.add('hidden');
        }
    }
}

// Carregar quantidade inicial do carrinho
function carregarQuantidadeCarrinho() {
    fetch('/carrinho/api/quantidade')
        .then(response => response.json())
        .then(data => {
            atualizarContadorCarrinho(data.quantidade);
        })
        .catch(error => {
            console.error('Erro ao carregar quantidade do carrinho:', error);
        });
}

// Mostrar notificação
function mostrarNotificacao(mensagem, tipo = 'info') {
    // Remove notificação existente se houver
    const notificacaoExistente = document.querySelector('.notificacao');
    if (notificacaoExistente) {
        notificacaoExistente.remove();
    }
    
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao notificacao-${tipo}`;
    notificacao.innerHTML = `
        <div class="notificacao-content">
            <span class="notificacao-icon">
                ${tipo === 'success' ? '✅' : tipo === 'error' ? '❌' : 'ℹ️'}
            </span>
            <span class="notificacao-texto">${mensagem}</span>
            <button class="notificacao-fechar" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    document.body.appendChild(notificacao);
    
    // Auto remover após 5 segundos
    setTimeout(() => {
        if (notificacao.parentElement) {
            notificacao.remove();
        }
    }, 5000);
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    carregarQuantidadeCarrinho();
});

// Adicionar CSS para notificações
const style = document.createElement('style');
style.textContent = `
    .notificacao {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        background: white;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        padding: 1rem;
        min-width: 300px;
        animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notificacao-success {
        border-left: 4px solid #10b981;
    }
    
    .notificacao-error {
        border-left: 4px solid #ef4444;
    }
    
    .notificacao-info {
        border-left: 4px solid #3b82f6;
    }
    
    .notificacao-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notificacao-icon {
        font-size: 1.125rem;
    }
    
    .notificacao-texto {
        flex: 1;
        color: #374151;
        font-weight: 500;
    }
    
    .notificacao-fechar {
        background: none;
        border: none;
        font-size: 1.25rem;
        cursor: pointer;
        color: #6b7280;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s ease;
    }
    
    .notificacao-fechar:hover {
        background: #f3f4f6;
        color: #374151;
    }
`;
document.head.appendChild(style);
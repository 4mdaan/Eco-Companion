// Funcionalidades para a página do carrinho

// Função para carregar carrinho do localStorage e exibir na página
function carregarCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const container = document.querySelector('.carrinho-content .container');
    
    if (carrinho.length === 0) {
        mostrarCarrinhoVazio(container);
        return;
    }
    
    mostrarItensCarrinho(carrinho, container);
}

// Função para mostrar carrinho vazio
function mostrarCarrinhoVazio(container) {
    container.innerHTML = `
        <div class="carrinho-vazio">
            <div class="vazio-icon">🛒</div>
            <h2 class="vazio-title">Seu carrinho está vazio</h2>
            <p class="vazio-description">Adicione alguns pacotes incríveis para começar sua jornada!</p>
            <a href="/pacotes" class="btn-continuar-compras">
                <span class="btn-icon">🏖️</span>
                Ver Pacotes Disponíveis
            </a>
        </div>
    `;
}

// Função para mostrar itens do carrinho
function mostrarItensCarrinho(carrinho, container) {
    const totais = calcularTotais(carrinho);
    
    container.innerHTML = `
        <div class="carrinho-grid">
            <div class="carrinho-items">
                <h2 class="section-title">Seus Pacotes (${carrinho.length})</h2>
                ${carrinho.map(item => criarItemHTML(item)).join('')}
            </div>
            
            <div class="carrinho-resumo">
                <div class="resumo-card">
                    <h3 class="resumo-title">Resumo do Pedido</h3>
                    
                    <div class="resumo-linha">
                        <span class="resumo-label">Subtotal (${totais.quantidade} ${totais.quantidade === 1 ? 'pessoa' : 'pessoas'}):</span>
                        <span class="resumo-valor">R$ ${totais.subtotal.toLocaleString('pt-BR')}</span>
                    </div>
                    
                    <div class="resumo-divider"></div>
                    
                    <div class="resumo-total">
                        <span class="total-label">Total:</span>
                        <span class="total-valor">R$ ${totais.total.toLocaleString('pt-BR')}</span>
                    </div>
                    
                    <div class="resumo-actions">
                        <button class="btn-checkout" onclick="finalizarCompra()">
                            <span class="btn-icon">💳</span>
                            Finalizar Compra
                        </button>
                        
                        <a href="/pacotes" class="btn-continuar">
                            <span class="btn-icon">🔍</span>
                            Continuar Comprando
                        </a>
                        
                        <button class="btn-limpar-carrinho" onclick="limparCarrinho()">
                            <span class="btn-icon">🗑️</span>
                            Limpar Carrinho
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    atualizarContadorCarrinho();
}

// Função para criar HTML de um item
function criarItemHTML(item) {
    const precoNum = parseFloat(item.preco.toString().replace(/\./g, '').replace(',', '.'));
    const totalItem = precoNum * item.quantidade;
    
    return `
        <div class="carrinho-item" data-item-id="${item.id}">
            <div class="item-image ${item.imagem}"></div>
            
            <div class="item-info">
                <h3 class="item-title">${item.nome}</h3>
                <p class="item-periodo">${item.periodo}</p>
                
                <div class="item-precos">
                    <span class="preco-atual">R$ ${item.preco.toLocaleString('pt-BR')}</span>
                    <span class="preco-label">por pessoa</span>
                </div>
            </div>
            
            <div class="item-actions">
                <div class="quantidade-control">
                    <label class="quantidade-label">Pessoas:</label>
                    <div class="quantidade-input">
                        <button type="button" class="btn-menos" onclick="alterarQuantidade('${item.id}', -1)">-</button>
                        <input type="number" value="${item.quantidade}" min="1" max="10" class="input-quantidade" onchange="atualizarQuantidade('${item.id}', this.value)">
                        <button type="button" class="btn-mais" onclick="alterarQuantidade('${item.id}', 1)">+</button>
                    </div>
                </div>
                
                <div class="item-total">
                    <span class="total-label">Total:</span>
                    <span class="total-valor">R$ ${totalItem.toLocaleString('pt-BR')}</span>
                </div>
                
                <button type="button" class="btn-remover" onclick="removerItem('${item.id}')">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                    Remover
                </button>
            </div>
        </div>
    `;
}

// Função para calcular totais
function calcularTotais(carrinho) {
    let subtotal = 0;
    let quantidade = 0;
    
    carrinho.forEach(item => {
        const precoNum = parseFloat(item.preco.toString().replace(/\./g, '').replace(',', '.'));
        subtotal += precoNum * item.quantidade;
        quantidade += item.quantidade;
    });
    
    return {
        subtotal: subtotal,
        desconto: 0,
        total: subtotal,
        quantidade: quantidade
    };
}

// Função para alterar quantidade
function alterarQuantidade(itemId, alteracao) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const item = carrinho.find(i => i.id == itemId);
    
    if (item) {
        item.quantidade = Math.max(1, item.quantidade + alteracao);
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        carregarCarrinho();
        mostrarNotificacao(`Quantidade atualizada para ${item.quantidade}`, 'info');
    }
}

// Função para atualizar quantidade diretamente
function atualizarQuantidade(itemId, novaQuantidade) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const item = carrinho.find(i => i.id == itemId);
    
    if (item) {
        item.quantidade = Math.max(1, parseInt(novaQuantidade));
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        carregarCarrinho();
    }
}

// Função para remover item
function removerItem(itemId) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const item = carrinho.find(i => i.id == itemId);
    const nomeItem = item ? item.nome : 'Item';
    
    carrinho = carrinho.filter(i => i.id != itemId);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    
    carregarCarrinho();
    mostrarNotificacao(`${nomeItem} removido do carrinho`, 'success');
}

// Função para limpar carrinho
function limparCarrinho() {
    if (confirm('Tem certeza que deseja remover todos os itens do carrinho?')) {
        localStorage.removeItem('carrinho');
        carregarCarrinho();
        mostrarNotificacao('Carrinho limpo com sucesso!', 'success');
    }
}

// Função para finalizar compra
async function finalizarCompra() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    if (carrinho.length === 0) {
        mostrarNotificacao('Seu carrinho está vazio!', 'warning');
        return;
    }
    
    mostrarNotificacao('Sincronizando carrinho...', 'info');
    
    try {
        // Sincronizar carrinho com o backend antes de ir para checkout
        const response = await fetch('/carrinho/sincronizar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ itens: carrinho })
        });
        
        const data = await response.json();
        
        if (data.success) {
            mostrarNotificacao('Redirecionando para checkout...', 'info');
            setTimeout(() => {
                window.location.href = '/carrinho/checkout';
            }, 1000);
        } else {
            mostrarNotificacao('Erro ao sincronizar carrinho. Tente novamente.', 'warning');
        }
    } catch (error) {
        console.error('Erro ao sincronizar carrinho:', error);
        mostrarNotificacao('Erro ao sincronizar carrinho. Tente novamente.', 'warning');
    }
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

// Função para mostrar notificações
function mostrarNotificacao(mensagem, tipo = 'success') {
    const notificacaoAnterior = document.querySelector('.notification');
    if (notificacaoAnterior) {
        notificacaoAnterior.remove();
    }
    
    const notificacao = document.createElement('section');
    notificacao.className = `notification notification-${tipo}`;
    notificacao.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${tipo === 'success' ? '✅' : tipo === 'info' ? 'ℹ️' : '⚠️'}
            </span>
            <span class="notification-message">${mensagem}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    document.body.appendChild(notificacao);
    
    setTimeout(() => {
        if (notificacao.parentElement) {
            notificacao.classList.add('notification-fade-out');
            setTimeout(() => notificacao.remove(), 300);
        }
    }, 4000);
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    carregarCarrinho();
});

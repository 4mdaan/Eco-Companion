// Script para corrigir problemas de sincronização do carrinho
document.addEventListener('DOMContentLoaded', function() {
    console.log('🛒 Inicializando sistema de carrinho...');
    
    // Verificar se estamos na página do carrinho
    if (window.location.pathname === '/carrinho') {
        // Carregar carrinho do localStorage e exibir
        carregarCarrinhoUnificado();
    }
    
    // Atualizar contador do carrinho no header
    atualizarContadorCarrinho();
});

// Função unificada para carregar carrinho
async function carregarCarrinhoUnificado() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    if (carrinho.length === 0) {
        mostrarCarrinhoVazio();
        return;
    }
    
    // Sincronizar com backend primeiro
    try {
        await sincronizarCarrinhoBackend(carrinho);
    } catch (error) {
        console.warn('Falha na sincronização, continuando com dados locais:', error);
    }
    
    // Exibir carrinho na interface
    exibirCarrinhoNaPagina(carrinho);
}

// Função para sincronizar carrinho com backend
async function sincronizarCarrinhoBackend(carrinho) {
    const response = await fetch('/carrinho/sincronizar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itens: carrinho })
    });
    
    if (!response.ok) {
        throw new Error('Falha na sincronização');
    }
    
    const data = await response.json();
    console.log('✅ Carrinho sincronizado:', data);
    return data;
}

// Função para exibir carrinho vazio
function mostrarCarrinhoVazio() {
    const container = document.querySelector('.carrinho-content .container');
    if (container) {
        container.innerHTML = `
            <section class="carrinho-vazio">
                <section class="vazio-icon">🛒</section>
                <h2 class="vazio-title">Seu carrinho está vazio</h2>
                <p class="vazio-texto">Que tal explorar nossos incríveis pacotes de viagem?</p>
                <a href="/pacotes" class="btn-explorar">Explorar Pacotes</a>
            </section>
        `;
    }
}

// Função para exibir carrinho na página
function exibirCarrinhoNaPagina(carrinho) {
    const container = document.querySelector('.carrinho-content .container');
    if (!container) return;
    
    const totais = calcularTotaisCarrinho(carrinho);
    
    container.innerHTML = `
        <section class="carrinho-grid">
            <section class="carrinho-items">
                <h2 class="section-title">Seus Pacotes</h2>
                ${carrinho.map(item => criarHTMLItemCarrinho(item)).join('')}
            </section>
            
            <section class="carrinho-resumo">
                <h2 class="section-title">Resumo da Compra</h2>
                
                <section class="resumo-detalhes">
                    <section class="resumo-linha">
                        <span class="resumo-label">Subtotal:</span>
                        <span class="resumo-valor">R$ ${totais.subtotal.toLocaleString('pt-BR')}</span>
                    </section>
                    
                    ${totais.desconto > 0 ? `
                        <section class="resumo-linha desconto">
                            <span class="resumo-label">Desconto:</span>
                            <span class="resumo-valor">- R$ ${totais.desconto.toLocaleString('pt-BR')}</span>
                        </section>
                    ` : ''}
                    
                    <section class="resumo-divider"></section>
                    
                    <section class="resumo-total">
                        <span class="total-label">Total:</span>
                        <span class="total-valor">R$ ${totais.total.toLocaleString('pt-BR')}</span>
                    </section>
                    
                    <section class="resumo-actions">
                        <button onclick="finalizarCompraUnificada()" class="btn-checkout">
                            Finalizar Compra
                        </button>
                        
                        <a href="/pacotes" class="btn-continuar">
                            Continuar Comprando
                        </a>
                    </section>
                </section>
            </section>
        </section>
    `;
}

// Função para criar HTML de item do carrinho
function criarHTMLItemCarrinho(item) {
    return `
        <section class="carrinho-item" data-id="${item.id}">
            <section class="item-image ${item.bgClass || 'bg-default'}"></section>
            
            <section class="item-info">
                <h3 class="item-titulo">${item.nome || item.destino}</h3>
                <p class="item-periodo">${item.periodo || 'Data a definir'}</p>
                
                <section class="item-precos">
                    ${item.precoOriginal && item.precoOriginal !== item.preco ? `
                        <span class="preco-original">R$ ${formatarPrecoExibicao(item.precoOriginal)}</span>
                    ` : ''}
                    <span class="preco-atual">R$ ${formatarPrecoExibicao(item.preco)}</span>
                </section>
            </section>
            
            <section class="item-actions">
                <section class="quantidade-controls">
                    <button onclick="alterarQuantidadeItem('${item.id}', -1)">-</button>
                    <input type="number" value="${item.quantidade}" min="1" 
                           onchange="atualizarQuantidadeItem('${item.id}', this.value)">
                    <button onclick="alterarQuantidadeItem('${item.id}', 1)">+</button>
                </section>
                
                <button onclick="removerItemCarrinho('${item.id}')" class="btn-remover">
                    🗑️ Remover
                </button>
            </section>
        </section>
    `;
}

// Função para calcular totais
function calcularTotaisCarrinho(carrinho) {
    let subtotal = 0;
    let desconto = 0;
    
    carrinho.forEach(item => {
        const preco = parseFloat(String(item.preco).replace(/\./g, '').replace(',', '.')) || 0;
        const precoOriginal = parseFloat(String(item.precoOriginal || item.preco).replace(/\./g, '').replace(',', '.')) || preco;
        
        subtotal += precoOriginal * item.quantidade;
        desconto += (precoOriginal - preco) * item.quantidade;
    });
    
    return {
        subtotal: subtotal,
        desconto: desconto,
        total: subtotal - desconto,
        quantidade: carrinho.reduce((acc, item) => acc + item.quantidade, 0)
    };
}

// Função para formatar preço para exibição
function formatarPrecoExibicao(preco) {
    const numero = parseFloat(String(preco).replace(/\./g, '').replace(',', '.')) || 0;
    return numero.toLocaleString('pt-BR');
}

// Função para alterar quantidade
function alterarQuantidadeItem(itemId, delta) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const item = carrinho.find(i => i.id == itemId);
    
    if (item) {
        item.quantidade = Math.max(1, item.quantidade + delta);
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        carregarCarrinhoUnificado();
        atualizarContadorCarrinho();
    }
}

// Função para atualizar quantidade diretamente
function atualizarQuantidadeItem(itemId, novaQuantidade) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const item = carrinho.find(i => i.id == itemId);
    
    if (item) {
        item.quantidade = Math.max(1, parseInt(novaQuantidade) || 1);
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        carregarCarrinhoUnificado();
        atualizarContadorCarrinho();
    }
}

// Função para remover item
function removerItemCarrinho(itemId) {
    if (confirm('Deseja remover este pacote do carrinho?')) {
        let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        carrinho = carrinho.filter(i => i.id != itemId);
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        carregarCarrinhoUnificado();
        atualizarContadorCarrinho();
        mostrarNotificacao('Item removido do carrinho!', 'success');
    }
}

// Função unificada para finalizar compra
async function finalizarCompraUnificada() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    if (carrinho.length === 0) {
        mostrarNotificacao('Seu carrinho está vazio!', 'warning');
        return;
    }
    
    mostrarNotificacao('Preparando checkout...', 'info');
    
    try {
        // Sincronizar carrinho com backend
        await sincronizarCarrinhoBackend(carrinho);
        
        mostrarNotificacao('Redirecionando para checkout...', 'success');
        setTimeout(() => {
            window.location.href = '/carrinho/checkout';
        }, 1000);
        
    } catch (error) {
        console.error('Erro ao preparar checkout:', error);
        mostrarNotificacao('Erro ao preparar checkout. Tente novamente.', 'error');
    }
}

// Função para atualizar contador do carrinho
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
    // Remover notificação anterior
    const notificacaoAnterior = document.querySelector('.notification');
    if (notificacaoAnterior) {
        notificacaoAnterior.remove();
    }
    
    const notificacao = document.createElement('section');
    notificacao.className = `notification notification-${tipo}`;
    notificacao.innerHTML = `
        <section class="notification-content">
            <span class="notification-icon">
                ${tipo === 'success' ? '✅' : tipo === 'info' ? 'ℹ️' : tipo === 'error' ? '❌' : '⚠️'}
            </span>
            <span class="notification-message">${mensagem}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </section>
    `;
    
    document.body.appendChild(notificacao);
    
    setTimeout(() => {
        if (notificacao.parentElement) {
            notificacao.classList.add('notification-fade-out');
            setTimeout(() => notificacao.remove(), 300);
        }
    }, 4000);
}

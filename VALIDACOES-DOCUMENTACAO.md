# 🎓 DOCUMENTAÇÃO DE VALIDAÇÕES - Eco Companion

## Resumo Executivo

Este documento descreve **TODAS as validações implementadas** no projeto Eco Companion para fins educacionais em um curso técnico. As validações seguem as **melhores práticas** de segurança web.

---

## 📁 Arquivos de Validação

### 1. **config/validators.js** ✅
Arquivo centralizado com TODAS as regras de validação do projeto.

**Características:**
- ✅ Express-validator com sanitização
- ✅ Validações customizadas
- ✅ Mensagens de erro claras
- ✅ Suporte para data, email, telefone, CPF, etc

**Validações Implementadas:**

#### 🔐 **Autenticação**
```javascript
validateLogin
- Email: validação RFC + normalização
- Senha: mínimo 6 caracteres

validateRegistro  
- Nome: 3-100 caracteres
- Email: RFC válido + normalização
- Telefone: 10 ou 11 dígitos
- Senha: 8+ caracteres, maiúscula, minúscula, número, símbolo
- Confirmação: match com senha

validateEsqueceuSenha
- Email: RFC válido + normalização
```

#### 🛒 **Carrinho**
```javascript
validateAdicionarAoCarrinho
- pacoteId: inteiro > 0
- quantidade: 1-10
- slug: 2-50 caracteres (opcional)

validateAtualizarCarrinho
- pacoteId: inteiro > 0
- quantidade: 1-10

validateRemoverCarrinho
- pacoteId: inteiro > 0 (parâmetro)

validateAplicarCupom
- cupom: 3-20 caracteres
- Apenas letras maiúsculas e números
```

#### 📬 **Contato**
```javascript
validateContato
- nome: 3+ caracteres
- email: RFC válido
- telefone: 10 ou 11 dígitos
- servico: 2+ caracteres
- mensagem: 10-1000 caracteres
- newsletter: booleano (opcional)
```

#### 💰 **Cashback**
```javascript
validateResgateCashback
- pontos: 100-999999
- tipoPagamento: 'cartao', 'transferencia' ou 'voucher'
- descricao: máx 500 caracteres (opcional)

validateHistoricoCashback
- filtro: 'todos', 'compras', 'resgates', 'pendentes' (opcional)
- limite: 1-100 (opcional)
```

#### 🏖️ **Pacotes**
```javascript
validateFiltrosPacotes (query)
- categoria: 'nacional', 'internacional', 'luxo', 'adventure' (opcional)
- precoMin: > 0 (opcional)
- precoMax: > 0 (opcional)
- avaliacao: 0-5 (opcional)

validateDetalhePacote
- slug: 2+ caracteres (parâmetro)
```

#### 🌍 **Destinos**
```javascript
validateCompraDestino
- destinoId: inteiro > 0
- dataPartida: ISO8601, não pode ser passado
- dataRetorno: ISO8601, após partida, máx 30 dias
- hospedes: 1-20
- acomodacao: 'simples', 'confortavel', 'luxo' (opcional)

validateDetalhesDestino
- destinoId: inteiro > 0 (parâmetro)
```

#### 👨‍💼 **Admin**
```javascript
validateCriarPacote
- destino: 3-100 caracteres
- preco: 0.01-999999.99
- precoOriginal: 0.01-999999.99, >= preco
- descricao: 10-1000 caracteres
- periodo: 5-100 caracteres
- categoria: 'nacional', 'internacional', 'luxo', 'adventure' (opcional)

validateAtualizarPacote
- id: inteiro > 0 (parâmetro)
- destino: 3-100 caracteres (opcional)
- preco: 0.01-999999.99 (opcional)
- precoOriginal: 0.01-999999.99 (opcional)
- descricao: 10-1000 caracteres (opcional)

validateDeletarPacote
- id: inteiro > 0 (parâmetro)
```

#### 💳 **Pagamentos**
```javascript
validateIniciaPagamento
- items: array com 1+ item
  - items[].id: inteiro > 0
  - items[].name: 3-200 caracteres
  - items[].price: > 0.01
  - items[].quantity: 1-10
- customerInfo.name: 3-100 caracteres
- customerInfo.email: RFC válido
- customerInfo.phone: 10 ou 11 dígitos
- customerInfo.document: 11 (CPF) ou 14 (CNPJ) dígitos
- paymentMethod: 'credito', 'debito', 'pix', 'boleto'

validateConfirmaPagamento
- orderId: 5-50 caracteres
- paymentIntentId: 5-100 caracteres (opcional)
```

---

### 2. **config/security-middleware.js** ✅
Middleware educativo de segurança.

**Funções Principais:**

#### 🛡️ **Sanitização**
```javascript
sanitizeInput()       // Remove XSS, limita tamanho
sanitizeNumber()      // Converte para número seguro
sanitizeEmail()       // Normaliza email
sanitizeIdArray()     // Valida array de IDs
```

#### ⚠️ **Rate Limiting**
```javascript
loginRateLimiter      // 5 tentativas em 5 minutos
paymentRateLimiter    // 3 tentativas em 1 hora
apiRateLimiter        // 30 requisições em 1 minuto
```

#### 📊 **Logging**
```javascript
securityLogger()      // Registra requisições
                      // Detecta padrões suspeitos
```

#### 🔑 **Autenticação**
```javascript
verificarAutenticacao()  // Valida sessão do usuário
verificarAdmin()         // Valida permissão de admin
```

---

## 🚀 Rotas com Validações

### Autenticação (`routes/auth.js`)
```
POST /auth/                 ✅ validateLogin
POST /auth/registro         ✅ validateRegistro
POST /auth/esqueceu-senha   ✅ validateEsqueceuSenha
```

### Carrinho (`routes/carrinho.js`)
```
GET  /carrinho/                   ✅ securityLogger, apiRateLimiter
POST /carrinho/adicionar          ✅ validateAdicionarAoCarrinho
POST /carrinho/remover            ✅ validateRemoverCarrinho
POST /carrinho/atualizar          ✅ validateAtualizarCarrinho
```

### Pacotes (`routes/pacotes.js`)
```
GET  /pacotes/                    ✅ validateFiltrosPacotes
GET  /pacotes/:slug               ✅ validateDetalhePacote
```

### Destinos (`routes/destinos.js`)
```
GET  /destinos/                   ✅ securityLogger, apiRateLimiter
GET  /destinos/:slug              ✅ validateDetalhesDestino
POST /destinos/:slug/comprar      ✅ validateCompraDestino
```

### Contato (`routes/index.js`)
```
POST /contato                     ✅ validateContato
```

### Cashback (`routes/cashback.js`)
```
GET  /cashback/                   ✅ securityLogger, apiRateLimiter
POST /cashback/resgatar/:id       ✅ validateResgateCashback
```

---

## 📝 Padrão de Implementação

### Estrutura de Validação

```javascript
// 1. Importar validadores
const { validateXXX, handleValidationErrors } = require('../config/validators');
const { securityLogger, apiRateLimiter } = require('../config/security-middleware');

// 2. Aplicar middleware na rota
router.post('/rota', 
  securityLogger,              // Log de segurança
  apiRateLimiter,              // Rate limiting
  validateXXX,                 // Validação
  handleValidationErrors,      // Tratamento de erros
  (req, res) => {
    // Handler da rota
  }
);

// 3. Resposta em caso de erro
{
  success: false,
  errors: [
    {
      field: 'email',
      message: 'Email inválido',
      value: 'teste@'
    }
  ]
}
```

---

## 🎯 Pontos para Corrigir em Aula

### ✅ O que foi implementado corretamente:

1. **Centralização de Validações**
   - Arquivo único: `config/validators.js`
   - Fácil manutenção
   - Reuso de código

2. **Express-Validator Patterns**
   - `.trim()` para remover espaços
   - `.notEmpty()` para campos obrigatórios
   - `.matches()` para regex
   - `.custom()` para validação complexa
   - `.withMessage()` para mensagens claras

3. **Segurança**
   - Rate limiting implementado
   - Sanitização de entrada
   - Logging de atividades
   - Validação de tipo (int, float, email, etc)

4. **UX**
   - Mensagens de erro específicas
   - Tratamento de erros centralizado
   - Resposta consistente (JSON + HTML)

### ⚠️ Melhorias Futuras (Desafio para Alunos):

1. **Criptografia de Senhas**
   ```javascript
   // Implementar bcrypt
   const bcrypt = require('bcrypt');
   const senhaHash = await bcrypt.hash(senha, 10);
   ```

2. **JWT para Autenticação**
   ```javascript
   // Substituir session por JWT
   const token = jwt.sign({ userId }, process.env.JWT_SECRET);
   ```

3. **Validação de CPF**
   ```javascript
   // Adicionar validação de dígito verificador
   const validarCPF = (cpf) => { ... }
   ```

4. **CSRF Protection**
   ```javascript
   // Usar csrf middleware
   const csrf = require('csurf');
   ```

5. **Validação de Arquivo**
   ```javascript
   // Para upload de imagens
   const multer = require('multer');
   ```

---

## 📊 Estatísticas

| Componente | Total | Status |
|---|---|---|
| Validadores Criados | 20+ | ✅ |
| Rotas com Validação | 13+ | ✅ |
| Tipos de Validação | 15+ | ✅ |
| Rate Limiters | 3 | ✅ |
| Middlewares de Segurança | 6+ | ✅ |

---

## 🎓 Exercícios Propostos para Alunos

### 1. **Adicionar Validação de Idade**
```javascript
// Nos dados de usuário, validar se é maior de 18 anos
body('dataNascimento')
  .isISO8601()
  .custom(value => {
    const idade = calcularIdade(value);
    if (idade < 18) throw new Error('Deve ser maior de 18 anos');
  })
```

### 2. **Implementar Validação de Força de Senha**
```javascript
// Criar função para medir força da senha
const verificarForcaSenha = (senha) => {
  // 0-25%: Fraca
  // 25-50%: Média
  // 50-75%: Boa
  // 75-100%: Forte
}
```

### 3. **Adicionar Whitelist de Domínios**
```javascript
// Validar apenas emails de domínios específicos
const dominiosPermitidos = ['empresa.com', 'cliente.com'];
body('email')
  .isEmail()
  .custom(value => {
    const dominio = value.split('@')[1];
    if (!dominiosPermitidos.includes(dominio)) {
      throw new Error('Email de domínio não autorizado');
    }
  })
```

### 4. **Criar Validator Customizado**
```javascript
// Validar disponibilidade de data
body('dataPartida')
  .custom(async (value) => {
    const datas = await buscarDatasOcupadas();
    if (datas.includes(value)) {
      throw new Error('Data indisponível');
    }
  })
```

### 5. **Implementar Testes**
```javascript
// Usar Jest para testar validações
describe('Validação de Email', () => {
  test('rejeita email inválido', () => {
    expect(validarEmail('teste@')).toBe(false);
  });
  
  test('aceita email válido', () => {
    expect(validarEmail('teste@example.com')).toBe(true);
  });
});
```

---

## 🔗 Referências

- [Express-Validator Docs](https://express-validator.github.io)
- [OWASP Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

---

## ✍️ Conclusão

O projeto Eco Companion possui um **sistema robusto de validações** seguindo as melhores práticas educacionais. Ideal para um **curso técnico** onde os alunos podem:

1. ✅ Aprender padrões de validação
2. ✅ Entender segurança web
3. ✅ Praticar express-validator
4. ✅ Implementar melhorias
5. ✅ Debater sobre segurança

**Bom estudo! 🎓**

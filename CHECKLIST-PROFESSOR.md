# 🎓 CHECKLIST DE VALIDAÇÕES - Eco Companion

## Para Professor Corrigir

Guia completo para validação do projeto Eco Companion em um curso técnico.

---

## 📋 SEÇÃO 1: ARQUIVO DE CONFIGURAÇÃO

### ✅ config/validators.js

- [ ] Arquivo existe e está bem organizado
- [ ] Tem comentários descritivos
- [ ] Exporta todas as funções
- [ ] Valida email corretamente
- [ ] Valida telefone (10-11 dígitos)
- [ ] Valida senhas fortes (maiúscula, minúscula, número, símbolo)
- [ ] Valida datas em formato ISO8601
- [ ] Valida intervalo de datas (retorno > partida)
- [ ] Valida preços (positivos)
- [ ] Valida quantidade (1-10)
- [ ] Valida cupons (maiúsculas + números)

---

## 📋 SEÇÃO 2: MIDDLEWARE DE SEGURANÇA

### ✅ config/security-middleware.js

- [ ] Arquivo existe e está bem documentado
- [ ] Implementa `securityLogger()` 
- [ ] Implementa rate limiters (3 tipos)
- [ ] Implementa sanitização de entrada
- [ ] Detecta padrões suspeitos
- [ ] Trata erros com `errorHandler`
- [ ] Redireciona 404 corretamente
- [ ] Verifica autenticação
- [ ] Verifica permissão de admin

---

## 📋 SEÇÃO 3: ROTAS - AUTENTICAÇÃO

### ✅ routes/auth.js

- [ ] Importa validators corretamente
- [ ] `POST /auth/` tem `validateLogin`
- [ ] `POST /auth/registro` tem `validateRegistro`
- [ ] `POST /auth/esqueceu-senha` tem `validateEsqueceuSenha`
- [ ] Rate limiting em login (máx 5 tentativas)
- [ ] Mensagens de erro claras
- [ ] Valida confirmação de senha
- [ ] Não armazena senha em texto plano (⚠️ desafio: implementar bcrypt)

---

## 📋 SEÇÃO 4: ROTAS - CARRINHO

### ✅ routes/carrinho.js

- [ ] Importa validators corretamente
- [ ] `GET /carrinho/` tem `securityLogger` e `apiRateLimiter`
- [ ] `POST /carrinho/adicionar` tem `validateAdicionarAoCarrinho`
- [ ] `POST /carrinho/remover` tem `validateRemoverCarrinho`
- [ ] `POST /carrinho/atualizar` tem `validateAtualizarCarrinho`
- [ ] Valida pacoteId como inteiro
- [ ] Valida quantidade (1-10)
- [ ] Retorna erros em JSON
- [ ] Limita quantidade máxima

---

## 📋 SEÇÃO 5: ROTAS - PACOTES

### ✅ routes/pacotes.js

- [ ] Importa validators corretamente
- [ ] `GET /pacotes/` tem `validateFiltrosPacotes`
- [ ] `GET /pacotes/:slug` tem `validateDetalhePacote`
- [ ] Valida categoria (4 opções)
- [ ] Valida preço mínimo e máximo
- [ ] Valida avaliação (0-5)
- [ ] Slug tem 2+ caracteres
- [ ] Rate limiting ativo

---

## 📋 SEÇÃO 6: ROTAS - DESTINOS

### ✅ routes/destinos.js

- [ ] Importa validators corretamente
- [ ] `GET /destinos/` tem segurança
- [ ] `GET /destinos/:slug` tem validação
- [ ] `POST /destinos/:slug/comprar` tem `validateCompraDestino`
- [ ] Valida datas (ISO8601)
- [ ] Data retorno > data partida
- [ ] Máximo 30 dias de intervalo
- [ ] Valida hóspedes (1-20)
- [ ] Valida acomodação (3 tipos)

---

## 📋 SEÇÃO 7: ROTAS - CASHBACK

### ✅ routes/cashback.js

- [ ] Importa validators corretamente
- [ ] `GET /cashback/` tem `securityLogger`
- [ ] `POST /cashback/resgatar/:id` tem `validateResgateCashback`
- [ ] Valida pontos (mínimo 100)
- [ ] Valida tipo de pagamento (3 opções)
- [ ] Rate limiting em resgates

---

## 📋 SEÇÃO 8: ROTAS - CONTATO

### ✅ routes/index.js

- [ ] Importa `validateContato`
- [ ] `POST /contato` tem validação completa
- [ ] Nome: 3+ caracteres
- [ ] Email: válido e normalizado
- [ ] Telefone: 10-11 dígitos
- [ ] Mensagem: 10-1000 caracteres
- [ ] Newsletter: booleano
- [ ] Gera protocolo único
- [ ] Log registra contato

---

## 📋 SEÇÃO 9: APP.JS - CONFIGURAÇÃO GLOBAL

### ✅ app.js

- [ ] Importa `helmet` para segurança
- [ ] Importa `securityLogger` e `errorHandler`
- [ ] `helmet()` está ativo
- [ ] `securityLogger` é middleware global
- [ ] Limite de upload: 10mb
- [ ] Webhook Stripe antes do JSON
- [ ] Tratamento de 404 ativo
- [ ] Tratamento global de erros ativo
- [ ] Servidor inicia com mensagens informativas

---

## 📋 SEÇÃO 10: PADRÕES DE CÓDIGO

### ✅ Validação Express

- [ ] Usa `.trim()` para strings
- [ ] Usa `.notEmpty()` para obrigatórios
- [ ] Usa `.isEmail()` com `.normalizeEmail()`
- [ ] Usa `.matches()` para regex
- [ ] Usa `.custom()` para validações complexas
- [ ] Usa `.withMessage()` para mensagens
- [ ] Valida parâmetros com `param()`
- [ ] Valida query com `query()`
- [ ] Valida body com `body()`

### ✅ Rate Limiting

- [ ] Login: 5 tentativas em 5 minutos
- [ ] Pagamento: 3 tentativas em 1 hora
- [ ] API: 30 requisições em 1 minuto
- [ ] Verifica IP do cliente

### ✅ Logging

- [ ] Log registra IP do cliente
- [ ] Log registra user agent
- [ ] Log detecta padrões suspeitos
- [ ] Log tem timestamp
- [ ] Log mostra method + path

---

## 📋 SEÇÃO 11: SEGURANÇA

### ✅ Validações

- [ ] Não aceita SQL Injection
- [ ] Não aceita XSS (remove `<>`)
- [ ] Valida tipo de dado
- [ ] Valida tamanho de dado
- [ ] Sanitiza entrada
- [ ] Limita corpo da requisição

### ⚠️ Melhorias Necessárias (Desafio)

- [ ] **Criptografia de Senha** - Implementar bcrypt
- [ ] **JWT** - Substituir session por token
- [ ] **CSRF** - Adicionar proteção CSRF
- [ ] **Validação de CPF** - Dígito verificador
- [ ] **HTTPS** - Forçar em produção

---

## 📋 SEÇÃO 12: DOCUMENTAÇÃO

### ✅ Arquivos

- [ ] `VALIDACOES-DOCUMENTACAO.md` existe
- [ ] Documento está bem organizado
- [ ] Tem exemplos de código
- [ ] Tem lista de exercícios
- [ ] Tem referências externas
- [ ] Tem padrão de implementação

### ✅ Código

- [ ] Funções têm comentários JSDoc
- [ ] Rotas têm comentários
- [ ] Middleware tem descritivo
- [ ] Mensagens de erro são claras

---

## 📝 RUBRICA DE PONTUAÇÃO

### Pontos Máximos: 100

| Componente | Pontos | Status |
|---|---|---|
| **config/validators.js** | 15 | ___/15 |
| **config/security-middleware.js** | 15 | ___/15 |
| **routes/auth.js** | 10 | ___/10 |
| **routes/carrinho.js** | 10 | ___/10 |
| **routes/pacotes.js** | 8 | ___/8 |
| **routes/destinos.js** | 10 | ___/10 |
| **routes/cashback.js** | 8 | ___/8 |
| **routes/index.js (contato)** | 5 | ___/5 |
| **app.js** | 10 | ___/10 |
| **Documentação** | 9 | ___/9 |
| **TOTAL** | **100** | **___/100** |

---

## 🎯 CRITÉRIOS DE APROVAÇÃO

### Nível 1 - BÁSICO (60-70%)
- ✅ Validações básicas implementadas
- ✅ Erros tratados
- ✅ Documentação mínima

### Nível 2 - INTERMEDIÁRIO (71-85%)
- ✅ Tudo do Nível 1
- ✅ Rate limiting implementado
- ✅ Logging funcional
- ✅ Documentação clara

### Nível 3 - AVANÇADO (86-100%)
- ✅ Tudo do Nível 2
- ✅ Middlewares bem estruturados
- ✅ Boas práticas de segurança
- ✅ Código bem comentado
- ✅ Exemplos e exercícios inclusos

---

## 🚀 DESAFIOS PARA ALUNOS

### Desafio 1: Implementar Bcrypt ⭐
```javascript
// Adicionar criptografia de senha
npm install bcrypt

// Em auth.js
const bcrypt = require('bcrypt');
const senhaHash = await bcrypt.hash(senha, 10);
const senhaValida = await bcrypt.compare(senha, senhaHash);
```

### Desafio 2: JWT Authentication ⭐⭐
```javascript
// Substituir session por JWT
npm install jsonwebtoken

const token = jwt.sign(
  { userId, tipo },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);
```

### Desafio 3: Validação de CPF ⭐⭐
```javascript
// Implementar dígito verificador
const validarCPF = (cpf) => {
  const [d1, d2] = calcularDigitos(cpf);
  return cpf[9] == d1 && cpf[10] == d2;
};
```

### Desafio 4: CSRF Protection ⭐⭐
```javascript
// Adicionar proteção CSRF
npm install csurf
const csrf = require('csurf');
app.use(csrf());
```

### Desafio 5: Testes Unitários ⭐⭐⭐
```javascript
// Testar validações com Jest
npm install --save-dev jest

describe('Validators', () => {
  test('rejeita email inválido', () => {
    // Testes aqui
  });
});
```

---

## 📊 FEEDBACK TEMPLATE

```markdown
## Feedback para o Aluno

### ✅ Pontos Fortes
- 
- 
- 

### ⚠️ Pontos para Melhorar
- 
- 
- 

### 🎯 Próximos Passos
- 
- 
- 

### 📈 Nota Final: __/100
```

---

## 📞 REFERÊNCIAS PARA DISCUSSÃO

1. **Por que validar entrada?**
   - Prevenção de ataques
   - Consistência de dados
   - Melhor UX

2. **Qual a diferença entre sanitização e validação?**
   - Sanitização: limpa dados
   - Validação: verifica formato

3. **Rate limiting é apenas segurança?**
   - Também protege servidor
   - Evita abuso
   - Melhora performance

4. **JWT ou Session?**
   - JWT: stateless, melhor para APIs
   - Session: stateful, simples

5. **Onde devem estar as validações?**
   - Frontend: UX
   - Backend: SEGURANÇA (sempre!)

---

## ✍️ NOTAS DO PROFESSOR

```
Data da Avaliação: __________
Aluno: _____________________
Turma: _____________________

Observações:
_____________________________________________________
_____________________________________________________
_____________________________________________________

Recomendações:
_____________________________________________________
_____________________________________________________
_____________________________________________________

Assinatura: _________________
```

---

**Boa avaliação! 🎓**

# 🌊 Eco Companion - Agência de Viagens Marinhas

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21+-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0+-green.svg)](https://www.mongodb.com/)
[![EJS](https://img.shields.io/badge/EJS-3.1+-orange.svg)](https://ejs.co/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)
[![GitHub Pro](https://img.shields.io/badge/GitHub-Pro-black.svg)](https://github.com/features/pro)

> **Projeto Educacional** - Site moderno e responsivo para agência de viagens especializada em turismo marinho, desenvolvido com foco em **segurança e validações** para cursos técnicos.

## 📋 Sobre o Projeto

O **Eco Companion** é uma aplicação web completa para uma agência de viagens especializada em experiências marinhas. Desenvolvido com tecnologias modernas e seguindo as melhores práticas de segurança e validação de dados.

### 🎯 Objetivos Educacionais

- ✅ **Validações Express-Validator** completas
- ✅ **Segurança Web** (Rate Limiting, Sanitização, Logging)
- ✅ **Arquitetura MVC** profissional
- ✅ **Pool de Conexões** otimizado
- ✅ **Documentação** técnica detalhada

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** 18+ - Runtime JavaScript
- **Express.js** 4.21+ - Framework web
- **MongoDB** 8.0+ - Banco de dados NoSQL
- **Mongoose** 8.0+ - ODM para MongoDB

### Frontend
- **EJS** 3.1+ - Template engine
- **Tailwind CSS** - Framework CSS
- **JavaScript ES6+** - Lógica client-side

### Segurança & Validação
- **Express-Validator** 7.2+ - Validação de dados
- **Helmet** 7.2+ - Segurança HTTP
- **Express Rate Limit** 7.5+ - Controle de requisições
- **CORS** 2.8+ - Controle de origem

### Desenvolvimento
- **Nodemon** 3.0+ - Auto-reload
- **Dotenv** 16.6+ - Variáveis de ambiente

## 📁 Estrutura do Projeto

```
eco-companion/
├── 📁 config/                    # Configurações
│   ├── database.js              # Conexão MongoDB + Pool
│   ├── validators.js            # Validações centralizadas
│   └── security-middleware.js   # Middlewares de segurança
│
├── 📁 routes/                    # Rotas da aplicação
│   ├── index.js                 # Página inicial + Contato
│   ├── auth.js                  # Autenticação (Login/Registro)
│   ├── pacotes.js               # Gestão de pacotes
│   ├── destinos.js              # Destinos turísticos
│   ├── carrinho.js              # Carrinho de compras
│   ├── cashback.js              # Sistema de cashback
│   ├── admin.js                 # Painel administrativo
│   ├── chat.js                  # Chat bot
│   ├── payments.js              # Processamento de pagamentos
│   └── legal.js                 # Páginas legais
│
├── 📁 views/                     # Templates EJS
│   ├── partials/                # Componentes reutilizáveis
│   │   ├── head.ejs            # Meta tags e CSS
│   │   ├── header.ejs          # Cabeçalho
│   │   ├── footer.ejs          # Rodapé
│   │   └── scripts.ejs         # Scripts JS
│   ├── index.ejs               # Página inicial
│   ├── 404.ejs                 # Página de erro
│   └── 📁 [outras páginas]/
│
├── 📁 public/                    # Arquivos estáticos
│   ├── css/                     # Estilos CSS
│   ├── js/                      # Scripts JavaScript
│   ├── images/                  # Imagens
│   └── manifest.json            # PWA
│
├── 📁 models/                    # Modelos de dados
│   └── User.js                  # Modelo de usuário
│
├── 📁 uploads/                   # Arquivos enviados
├── 📁 backup/                    # Backups
│
├── 📄 app.js                     # Arquivo principal
├── 📄 package.json               # Dependências
├── 📄 .env.example               # Exemplo de variáveis
├── 📄 .gitignore                 # Arquivos ignorados
├── 📄 README.md                  # Esta documentação
├── 📄 VALIDACOES-DOCUMENTACAO.md # Documentação técnica
├── 📄 CHECKLIST-PROFESSOR.md     # Guia de correção
└── 📄 RESUMO-EXECUTIVO.md        # Resumo das mudanças
```

## 🛠️ Instalação e Configuração

### Pré-requisitos

- **Node.js** 18.0.0 ou superior
- **MongoDB** 8.0+ (local ou Atlas)
- **Git** para controle de versão
- **VS Code** com GitHub Copilot (recomendado)

### 1. Clone o Repositório

```bash
git clone https://github.com/SEU_USERNAME/eco-companion.git
cd eco-companion
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure as Variáveis de Ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Banco de Dados
MONGODB_URI=mongodb://localhost:27017/eco-companion

# Segurança
JWT_SECRET=sua_chave_jwt_super_secreta_aqui
SESSION_SECRET=sua_chave_session_super_secreta

# Stripe (Pagamentos)
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (opcional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_app
```

### 4. Inicie o Servidor

```bash
# Desenvolvimento (com auto-reload)
npm run dev

# Produção
npm start
```

Acesse: http://localhost:3000

## 🔒 Funcionalidades de Segurança

### ✅ Validações Implementadas

| Módulo | Validações | Status |
|--------|------------|--------|
| **Autenticação** | Email, senha forte, rate limiting | ✅ |
| **Carrinho** | Quantidade, itens, cupons | ✅ |
| **Pacotes** | Filtros, preços, avaliações | ✅ |
| **Destinos** | Datas, hóspedes, acomodações | ✅ |
| **Cashback** | Pontos, tipos de pagamento | ✅ |
| **Contato** | Nome, email, telefone, mensagem | ✅ |

### 🛡️ Middlewares de Segurança

- **Helmet**: Protege contra vulnerabilidades HTTP
- **Rate Limiting**: 3 níveis (login, pagamento, API)
- **Logging**: Registra requisições suspeitas
- **Sanitização**: Remove XSS e caracteres perigosos
- **CORS**: Controle de origem das requisições

### 📊 Pool de Conexões

```javascript
// Configuração otimizada
maxPoolSize: 10,      // Máximo de conexões
minPoolSize: 5,       // Mínimo mantido
retryWrites: true,    // Retry automático
heartbeatFrequencyMS: 10000, // Check saúde
```

## 🎓 Recursos Educacionais

### 📚 Documentação Técnica

- **[VALIDACOES-DOCUMENTACAO.md](VALIDACOES-DOCUMENTACAO.md)** - Guia completo de validações
- **[CHECKLIST-PROFESSOR.md](CHECKLIST-PROFESSOR.md)** - Rubrica de correção
- **[RESUMO-EXECUTIVO.md](RESUMO-EXECUTIVO.md)** - Mudanças implementadas

### 🎯 Exercícios Propostos

1. **Implementar Bcrypt** para criptografia de senhas
2. **Adicionar JWT** para autenticação stateless
3. **Criar testes unitários** com Jest
4. **Implementar CSRF protection**
5. **Adicionar validação de CPF** com dígito verificador

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia com nodemon

# Produção
npm start            # Inicia servidor

# Testes (futuro)
npm test             # Executa testes

# Build (futuro)
npm run build        # Build para produção
```

## 🌐 Funcionalidades

### 👤 Autenticação
- ✅ Login com rate limiting
- ✅ Registro com validação forte
- ✅ Recuperação de senha
- ✅ Logout seguro

### 🛒 Carrinho de Compras
- ✅ Adicionar/remover itens
- ✅ Atualizar quantidades
- ✅ Aplicar cupons
- ✅ Checkout seguro

### 🏖️ Pacotes Turísticos
- ✅ Listagem com filtros
- ✅ Detalhes completos
- ✅ Avaliações e comentários
- ✅ Reserva online

### 💰 Sistema Cashback
- ✅ Acúmulo de pontos
- ✅ Resgate de recompensas
- ✅ Histórico de transações
- ✅ Níveis de fidelidade

### 💳 Pagamentos
- ✅ Stripe integration
- ✅ PIX, cartão, boleto
- ✅ Webhooks seguros
- ✅ Confirmação automática

### 🤖 Chat Bot
- ✅ Atendimento automatizado
- ✅ Respostas inteligentes
- ✅ Suporte 24/7

## 📊 Status do Projeto

### ✅ Implementado
- [x] Sistema de autenticação completo
- [x] Carrinho de compras funcional
- [x] Gestão de pacotes turísticos
- [x] Sistema de cashback
- [x] Processamento de pagamentos
- [x] Chat bot integrado
- [x] Validações de segurança
- [x] Documentação técnica

### 🚧 Em Desenvolvimento
- [ ] Testes automatizados
- [ ] CI/CD com GitHub Actions
- [ ] Deploy automatizado
- [ ] PWA (Progressive Web App)

### 📋 Backlog
- [ ] Dark mode
- [ ] Notificações push
- [ ] Multi-idioma
- [ ] API REST completa

## 🤝 Como Contribuir

1. **Fork** o projeto
2. **Clone** sua fork: `git clone https://github.com/SEU_USERNAME/eco-companion.git`
3. **Crie** uma branch: `git checkout -b feature/nova-funcionalidade`
4. **Commit** suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`
5. **Push** para branch: `git push origin feature/nova-funcionalidade`
6. **Abra** um Pull Request

### 📝 Padrões de Código

- Use **ESLint** para linting
- Siga o padrão **Airbnb** para JavaScript
- Use **JSDoc** para documentação
- Mantenha **cobertura de testes** > 80%

## 📄 Licença

Este projeto está sob a licença **ISC**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Desenvolvedor**: [Seu Nome]
- **Orientador**: Professor do Curso Técnico
- **Instituição**: [Nome da Escola]

## 🙏 Agradecimentos

- **GitHub Copilot** - Assistente de IA para desenvolvimento
- **Node.js Community** - Ecossistema incrível
- **Open Source** - Comunidade que torna tudo possível

## 📞 Suporte

Para dúvidas ou sugestões:

- 📧 **Email**: seu_email@exemplo.com
- 💬 **Issues**: [GitHub Issues](https://github.com/SEU_USERNAME/eco-companion/issues)
- 📱 **WhatsApp**: (11) 99999-9999

---

## 🎯 Próximos Passos

1. **Configurar GitHub Actions** para CI/CD
2. **Adicionar testes** com Jest
3. **Implementar PWA** para mobile
4. **Deploy no Vercel** ou Heroku
5. **Monitoramento** com Sentry

---

**⭐ Se este projeto te ajudou, dê uma estrela no GitHub!**

> Desenvolvido com ❤️ e muita validação de dados

2. **Execute o projeto:**
   ```bash
   # Modo desenvolvimento (com nodemon)
   npm run dev

   # Modo produção
   npm start
   ```

3. **Abra no navegador:**
   ```
   http://localhost:3000
   ```

## 🎯 Funcionalidades

### ✅ Implementadas

- **Página inicial** com hero section e pacotes em destaque
- **Header responsivo** com menu mobile
- **Footer completo** com informações da empresa
- **Sistema de rotas** organizado
- **Views parciais** reutilizáveis
- **Design responsivo** com Tailwind CSS
- **Página de erro 404** personalizada

### 🔄 Em Desenvolvimento

- Página de pacotes completa
- Página de destinos
- Página de contato com formulário
- Página sobre a empresa
- Sistema de reservas
- Integração com banco de dados
- Painel administrativo

## 📱 Responsividade

O site é totalmente responsivo e funciona perfeitamente em:

- 📱 **Mobile** (320px+)
- 📱 **Tablet** (768px+)
- 💻 **Desktop** (1024px+)
- 🖥️ **Large Desktop** (1280px+)

## 🎨 Personalização

### Cores do Tema

As cores principais estão definidas no arquivo `public/css/styles.css`:

```css
:root {
    --yellow: #FFCB2F;  /* Amarelo principal */
    --navy: #174E6B;    /* Azul marinho */
}
```

### Fontes

- **Pacifico:** Para títulos especiais (Google Fonts)
- **Inter:** Para textos gerais (Google Fonts)

## 🔧 Scripts Disponíveis

- `npm start` - Inicia o servidor em modo produção
- `npm run dev` - Inicia o servidor com nodemon (desenvolvimento)

## 📊 SEO e Performance

- ✅ Meta tags otimizadas
- ✅ URLs amigáveis (SEO-friendly)
- ✅ Imagens otimizadas
- ✅ CSS e JS minificados (em produção)
- ✅ Estrutura semântica HTML5

## 🌐 Navegação

- **/** - Página inicial
- **/pacotes** - Lista de pacotes
- **/pacotes/:slug** - Detalhes do pacote
- **/destinos** - Lista de destinos
- **/destinos/:slug** - Detalhes do destino
- **/sobre** - Sobre a empresa
- **/contato** - Formulário de contato

## 🔒 Segurança

- Validação de dados de entrada
- Sanitização de parâmetros de URL
- Headers de segurança configurados
- Proteção contra XSS

## 📝 Próximos Passos

1. **Integrar banco de dados** (MongoDB/MySQL)
2. **Implementar sistema de usuários**
3. **Adicionar sistema de pagamento**
4. **Criar painel administrativo**
5. **Implementar sistema de avaliações**
6. **Adicionar filtros de busca avançada**

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC. Veja o arquivo `package.json` para mais detalhes.

## 📞 Suporte

Para suporte ou dúvidas, entre em contato através:

- 📧 Email: contato@experienciasmarinhas.com
- 📱 WhatsApp: (11) 99999-9999
- 🌐 Website: [experienciasmarinhas.com](http://localhost:3000)

---

**Desenvolvido com ❤️ para proporcionar as melhores experiências de viagem!** 🌊✈️

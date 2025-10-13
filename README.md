# 🌊 Agência de Viagens - Experiências Marinhas

Site moderno e responsivo para agência de viagens especializada em turismo marinho, desenvolvido com Node.js, Express e EJS.

## 🚀 Tecnologias Utilizadas

- **Backend:** Node.js com Express
- **Template Engine:** EJS (Embedded JavaScript)
- **CSS Framework:** Tailwind CSS
- **Arquitetura:** MVC (Model-View-Controller)

## 📁 Estrutura do Projeto

```
agencia_viagens_site/
├── app.js                 # Arquivo principal do servidor
├── package.json          # Dependências e scripts
├── routes/              # Rotas da aplicação
│   ├── index.js         # Rotas principais
│   ├── pacotes.js       # Rotas de pacotes
│   └── destinos.js      # Rotas de destinos
├── views/               # Templates EJS
│   ├── partials/        # Componentes reutilizáveis
│   │   ├── head.ejs     # Meta tags e links CSS
│   │   ├── header.ejs   # Cabeçalho da página
│   │   ├── footer.ejs   # Rodapé da página
│   │   └── scripts.ejs  # Scripts JavaScript
│   ├── pacotes/         # Views de pacotes
│   │   ├── index.ejs    # Lista de pacotes
│   │   └── detalhes.ejs # Detalhes do pacote
│   ├── index.ejs        # Página inicial
│   └── 404.ejs          # Página de erro
├── public/              # Arquivos estáticos
│   ├── css/
│   │   └── styles.css   # Estilos personalizados
│   ├── js/
│   │   └── main.js      # JavaScript personalizado
│   └── images/          # Imagens do site
├── controllers/         # Controladores (lógica de negócio)
├── helpers/             # Funções auxiliares
└── config/              # Configurações
```

## 🛠️ Instalação

1. **Instale as dependências:**
   ```bash
   npm install
   ```

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

# 🎬 Hub de Entretenimento Pessoal

Um dashboard web pessoal que centraliza fontes **gratuitas e legais** de entretenimento em um único lugar — filmes, música, podcasts, jogos e documentários — com busca, favoritos e atalhos para termos de pesquisa.

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)
![Stack](https://img.shields.io/badge/stack-React%20%2B%20Vite%20%2B%20Tailwind-7c3aed)

---

## ✨ Funcionalidades

- 🎬 **Filmes e séries** — fontes gratuitas e legais de streaming
- 🎵 **Música** — plataformas de streaming, download e descoberta musical
- 🎙️ **Podcasts e audiolivros** — agregadores e diretórios
- 🎮 **Jogos** — plataformas com jogos gratuitos legítimos
- 📚 **Documentários e educação** — conteúdo educativo de qualidade
- 🔍 **Busca global** em todas as fontes
- ⭐ **Favoritos** salvos localmente (sem login)
- 🌗 **Dark/Light mode**
- 📱 **Responsivo** — funciona em mobile, tablet e desktop

---

## 🛠️ Tecnologias

- **[React 18+](https://react.dev/)** — biblioteca de UI
- **[Vite](https://vitejs.dev/)** — build tool e dev server
- **[Tailwind CSS](https://tailwindcss.com/)** — estilização utility-first
- **[Lucide React](https://lucide.dev/)** — ícones
- **localStorage** — persistência de favoritos e preferências

---

## 🎨 Paleta de Cores

| Token       | Hex         | Uso                          |
|-------------|-------------|------------------------------|
| Background  | `#0a0a0f`   | Fundo principal              |
| Surface     | `#16161d`   | Cards e painéis              |
| Primary     | `#7c3aed`   | Destaques e botões           |
| Text        | `#e5e5e5`   | Texto principal              |
| Muted       | `#9ca3af`   | Texto secundário             |

---

## 🚀 Como rodar localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) 18+ instalado

### Jeito rápido (Windows)

Dê duplo clique em **`start.bat`** — ele instala as dependências na primeira vez e abre o servidor automaticamente.

### Via terminal

```bash
# Clone o repositório
git clone https://github.com/viniciusandradedev0/hub-entretenimento.git
cd hub-entretenimento

# Instale as dependências (só na primeira vez)
npm install

# Rode o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

### Scripts disponíveis

```bash
npm run dev       # Servidor de desenvolvimento
npm run build     # Build de produção
npm run preview   # Preview do build localmente
npm run lint      # Verificação de código (se configurado)
```

---

## 📁 Estrutura do Projeto

```
/
├── public/
├── src/
│   ├── components/         # Componentes React reutilizáveis
│   ├── data/
│   │   └── sources.json    # Base de dados das fontes
│   ├── hooks/              # Hooks customizados
│   ├── styles/             # Estilos globais
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── tailwind.config.js
├── vite.config.js
├── CLAUDE.md               # Diretrizes para IA assistente
└── README.md
```

---

## ➕ Adicionando novas fontes

Edite `src/data/sources.json` seguindo o schema:

```json
{
  "id": "exemplo-fonte",
  "category": "musica",
  "name": "Nome da Fonte",
  "url": "https://exemplo.com",
  "description": "Descrição breve do que oferece",
  "bestFor": ["Indie", "Descoberta"],
  "language": "multi",
  "searchTerms": ["música indie grátis"],
  "icon": "music",
  "free": true,
  "legal": true
}
```

### Categorias válidas
- `filmes`
- `musica`
- `podcasts`
- `jogos`
- `documentarios`

> ⚠️ **Apenas fontes gratuitas e legais** são aceitas no projeto.

---

## 🗺️ Roadmap

### v1.0 — MVP
- [x] Estrutura HTML/CSS inicial
- [ ] Migração para React + Vite
- [ ] Integração do Tailwind CSS
- [ ] Sistema de cards dinâmicos
- [ ] Busca global
- [ ] Favoritos com localStorage
- [ ] Toggle de tema

### v1.1
- [ ] Filtros avançados (idioma, tipo)
- [ ] Copiar termos de busca
- [ ] PWA instalável

### v2.0 (futuro)
- [ ] Sincronização opcional via backend
- [ ] Recomendações personalizadas
- [ ] Extensão de navegador

---

## 🤝 Contribuindo

Este é um projeto pessoal, mas sugestões são bem-vindas! Abra uma issue ou pull request.

### Diretrizes
1. Mantenha o foco em **conteúdo gratuito e legal**
2. Siga os padrões de código descritos em `CLAUDE.md`
3. Teste em mobile e desktop antes de submeter
4. Atualize a documentação se necessário

---

## 📜 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

---

## 👤 Autor

**Vinicius** — Curitiba, Brasil

---

## 🙏 Agradecimentos

Este projeto não hospeda nem distribui conteúdo — apenas agrega links públicos de plataformas gratuitas e legais. Todos os direitos pertencem aos respectivos provedores.

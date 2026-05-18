# CLAUDE.md

> Arquivo de contexto e diretrizes para o Claude Code.
> Este documento define o escopo, padrões e regras do projeto.
> **Leia este arquivo antes de qualquer alteração no código.**

---

## 🎯 Visão Geral do Projeto

**Nome:** Hub de Entretenimento Pessoal
**Tipo:** Dashboard web (SPA em React)
**Objetivo:** Centralizar fontes **gratuitas e legais** de entretenimento em um único painel, organizadas por categoria, com busca, favoritos e atalhos para termos de pesquisa.

### Categorias do Dashboard
1. 🎬 **Filmes e séries**
2. 🎵 **Música**
3. 🎙️ **Podcasts e audiolivros**
4. 🎮 **Jogos e experiências interativas**
5. 📚 **Documentários e educação**

---

## 🧱 Stack Técnica

- **Framework:** React 18+ com **Vite**
- **Estilo:** **Tailwind CSS** (integrado ao CSS/HTML já existente do projeto)
- **Linguagem:** JavaScript (ES6+) ou TypeScript (a confirmar com o mantenedor)
- **Persistência:** `localStorage` (favoritos, preferências, tema)
- **Ícones:** `lucide-react`
- **Roteamento:** `react-router-dom` (se necessário em múltiplas páginas)
- **Build:** Vite (`npm run build`)
- **Hospedagem alvo:** Vercel / Netlify / GitHub Pages

### ⚠️ Estado atual do projeto (atualizado 2026-05-18)
- O projeto está em **React + Vite + Tailwind** (migração concluída na v2.0)
- **8 sprints entregues** — veja o ROADMAP.md e o HISTORICO.md para o estado completo
- **44 fontes** em `sources.json`, todas com o campo `lastVerified`
- Antes de modificar qualquer componente, leia o arquivo para entender as props atuais (Card.jsx tem 9 props)

### Restrições
- ❌ **Sem APIs pagas** ou que exijam chave de acesso
- ❌ **Sem backend** na v1
- ❌ **Sem rastreadores** ou analytics de terceiros
- ❌ **Sem rádios** — apenas plataformas de música (streaming, download legal, etc.)
- ✅ **Tudo client-side**

---

## 📁 Estrutura de Pastas Atual

```
/
├── scripts/
│   └── check-links.js       # npm run check-links — verifica todas as URLs
├── src/
│   ├── components/
│   │   ├── Card.jsx          # 9 props: source, isFavorite, onToggleFavorite, onCopyTerms,
│   │   │                     #   searchTerm, onOpenModal, onTrackClick, onAddToCollection, collections
│   │   ├── CategorySection.jsx
│   │   ├── CollectionsPanel.jsx
│   │   ├── DailyPick.jsx
│   │   ├── FavoritesPanel.jsx
│   │   ├── FilterBar.jsx
│   │   ├── Header.jsx
│   │   ├── NavBar.jsx
│   │   ├── SearchBar.jsx
│   │   ├── SortSelector.jsx
│   │   ├── SourceModal.jsx
│   │   ├── TagFilter.jsx
│   │   ├── ThemeToggle.jsx
│   │   ├── BackToTop.jsx
│   │   └── Toast.jsx
│   ├── data/
│   │   └── sources.json      # 44 fontes, schema com lastVerified
│   ├── hooks/
│   │   ├── useActiveSection.js
│   │   ├── useClickStats.js
│   │   ├── useClipboard.js
│   │   ├── useCollections.js
│   │   ├── useFavorites.js
│   │   ├── useKeyboardShortcuts.js
│   │   ├── useNotes.js
│   │   ├── useSearch.js
│   │   └── useTheme.js
│   ├── lib/
│   │   ├── categories.js
│   │   ├── daily.js
│   │   ├── highlight.jsx
│   │   └── icons.js          # 15 ícones registrados
│   ├── styles/
│   │   └── index.css
│   ├── App.jsx
│   └── main.jsx
├── .gitattributes
├── index.html
├── tailwind.config.js
├── vite.config.js
└── CLAUDE.md
```

---

## 📊 Modelo de Dados (`sources.json`)

Toda fonte de conteúdo deve seguir este schema:

```json
{
  "id": "string-unico-kebab-case",
  "category": "filmes | musica | podcasts | jogos | documentarios",
  "name": "Nome da Fonte",
  "url": "https://...",
  "description": "Descrição curta (máx. 140 chars)",
  "bestFor": ["Tag1", "Tag2"],
  "language": "pt-BR | en | multi",
  "searchTerms": ["termo 1", "termo 2"],
  "icon": "nome-do-icone-lucide",
  "free": true,
  "legal": true,
  "lastVerified": "YYYY-MM-DD"
}
```

**Ícones disponíveis em `icons.js`:**
`Film`, `Music`, `Mic`, `Headphones`, `BookOpen`, `Gamepad2`, `GraduationCap`, `Youtube`, `Archive`, `Search`, `Library`, `Code`, `Theater`, `Landmark`, `Tv`

Para adicionar um novo ícone: importe-o em `src/lib/icons.js` e registre-o no objeto `ICONS`.

---

## 🎨 Padrões de UI/UX

- **Dark mode por padrão**, com toggle para light mode
- **Mobile-first** e totalmente responsivo (breakpoints Tailwind: `sm`, `md`, `lg`, `xl`)
- **Acessibilidade:** semântica HTML correta, `aria-labels`, contraste AA
- **Performance:** primeira pintura < 1s em 3G
- **Animações sutis** — usar `transition` do Tailwind (200-300ms)

### 🎨 Paleta de Cores (dark mode)

| Token       | Valor       | Uso                          |
|-------------|-------------|------------------------------|
| Background  | `#0a0a0f`   | Fundo principal              |
| Surface     | `#16161d`   | Cards, modais, painéis       |
| Primary     | `#7c3aed`   | Botões, links, destaques     |
| Text        | `#e5e5e5`   | Texto principal              |
| Muted       | `#9ca3af`   | Texto secundário, legendas   |

### Configuração no `tailwind.config.js`

```js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#0a0a0f",
        surface: "#16161d",
        primary: "#7c3aed",
        text: "#e5e5e5",
        muted: "#9ca3af",
      },
    },
  },
  plugins: [],
};
```

---

## 🧑‍💻 Padrões de Código

### Geral
- **Clareza > esperteza:** prefira código legível
- **Comentários em PT-BR** para lógica de negócio; nomes de variáveis/funções em inglês
- **Sem dependências desnecessárias** — avalie antes de instalar
- **Componentes pequenos** (ideal: < 150 linhas)
- **Sem `console.log`** em código de produção

### React
- **Componentes funcionais** + Hooks (sem class components)
- **Props tipadas** com PropTypes ou TypeScript
- **Hooks customizados** para lógica reutilizável (`useFavorites`, `useTheme`)
- **Estado local** via `useState`; estado global via Context API (sem Redux na v1)
- **Keys estáveis** em listas (nunca use o índice do array)
- **Sem lógica pesada no JSX** — extraia para funções/hooks

### Tailwind
- Use **classes utilitárias diretas** no JSX
- Para padrões repetidos, crie **componentes** (não `@apply` excessivo)
- Use `clsx` ou `classnames` para classes condicionais
- Mantenha responsividade com prefixos (`md:`, `lg:`)

### JavaScript
- ES6+ (módulos, arrow functions, destructuring, async/await)
- `const` por padrão; `let` apenas quando necessário; **nunca `var`**
- Trate erros com `try/catch` em operações assíncronas

### HTML
- Semântico: `<header>`, `<main>`, `<section>`, `<article>`, `<nav>`
- `alt` em todas as imagens
- `lang="pt-BR"` no `<html>`

---

## ✅ Checklist antes de finalizar qualquer feature

- [ ] Funciona em mobile e desktop
- [ ] Acessível via teclado
- [ ] Sem warnings/erros no console
- [ ] Dados persistem corretamente no `localStorage`
- [ ] Componentes reutilizáveis quando possível
- [ ] README atualizado se houve mudança de uso

---

## 🚫 Limites e Regras

**Você (Claude) NÃO deve:**
- Adicionar fontes piratas, ilegais ou de origem duvidosa
- Adicionar fontes de **rádio** (categoria removida do escopo)
- Sugerir bibliotecas abandonadas ou inseguras
- Criar dependências de APIs com chave sem consulta prévia
- Reescrever HTML/CSS existente sem justificativa — **adapte, não substitua**
- Implementar tracking, analytics ou cookies de terceiros
- Fazer commits ou alterações grandes sem explicar o plano antes

**Você DEVE:**
- Perguntar quando houver ambiguidade
- Explicar o "porquê" das decisões técnicas
- Validar links antes de adicioná-los à base de fontes
- Manter o projeto 100% gratuito e legal
- **Preservar o trabalho já feito** no HTML/CSS atual

---

## 🔄 Fluxo de Trabalho

1. **Antes de codar:** descreva brevemente o plano
2. **Durante:** implemente em pequenos incrementos
3. **Depois:** explique o que mudou e como testar
4. **Sempre:** mantenha `README.md` e `CLAUDE.md` atualizados

---

## 📚 Fontes de Referência (exemplos válidos)

> Use estas como ponto de partida para popular `sources.json`.
> Todas devem ser **gratuitas e legais**.

- **Filmes/Séries:** Pluto TV, Tubi, Plex Free, Kanopy, Internet Archive
- **Música:** Spotify (free), YouTube Music (free), Bandcamp, Jamendo, Free Music Archive, SoundCloud
- **Podcasts:** Spotify (free), Apple Podcasts (web), Podchaser, Listen Notes
- **Jogos:** itch.io (free), Epic Games (gratuitos semanais), Newgrounds, Steam (free-to-play)
- **Documentários:** YouTube (canais oficiais), Curiosity Stream (free tier), Open Culture, Coursera (audit), MIT OpenCourseWare

---

## 🗺️ Roadmap (resumo)

Veja o arquivo `ROADMAP.md` para o plano completo com 15 sprints.

| Sprint | Tema | Status |
|--------|------|--------|
| 1–8 | Quick wins, busca, navegação, modal, descoberta, favoritos, curadoria, coleções | ✅ |
| 9 | Compartilhamento via URL (`?share=<base64>`) | ⏳ próximo |
| 10 | ESLint + Prettier + Husky | ⬜ |
| 11 | TypeScript | ⬜ |
| 12 | Testes (Vitest + Testing Library) | ⬜ |
| 13 | CI/CD + Deploy automático | ⬜ |
| 14 | PWA instalável | ⬜ |
| 15 | i18n + Acessibilidade avançada | ⬜ |

### Chaves de localStorage em uso
| Chave | Hook | Conteúdo |
|-------|------|---------|
| `hub:favorites` | useFavorites | `string[]` de IDs |
| `hub:notes` | useNotes | `{ [sourceId]: string }` |
| `hub:click-stats` | useClickStats | `{ [sourceId]: number }` |
| `hub:collections` | useCollections | `[{ id, name, sourceIds[] }]` |
| `theme` | useTheme | `"dark" \| "light"` |

---

## 💬 Comunicação

- Responda **sempre em português (Brasil)**
- Seja **direto e técnico**, sem rodeios
- Quando sugerir algo grande, **mostre o plano antes** de executar
- Em dúvidas, **pergunte** — não invente

---

**Última atualização:** 2026-05-18
**Mantenedor:** Vinicius
**Sprint atual:** 8 concluído — próximo: Sprint 9 (Compartilhamento)

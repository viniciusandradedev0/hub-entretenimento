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
- **Estilo:** **Tailwind CSS** com tema customizado (dark/light)
- **Linguagem:** **TypeScript** (migração concluída no Sprint 11)
- **i18n:** `react-i18next` — PT-BR e EN; toggle no header
- **Testes:** Vitest + Testing Library (32 testes)
- **Qualidade:** ESLint 8 + Prettier 3 + Husky + lint-staged
- **CI/CD:** GitHub Actions (ci.yml + deploy.yml → GitHub Pages)
- **PWA:** `vite-plugin-pwa` + Workbox (instalável, cache offline)
- **Persistência:** `localStorage` (favoritos, notas, coleções, stats, tema, idioma, streak)
- **Ícones:** `lucide-react`
- **Build:** Vite (`npm run build`)
- **Hospedagem:** GitHub Pages (deploy automático no push para `main`)

### ⚠️ Estado atual do projeto (atualizado 2026-05-18)
- **Todos os 15 sprints do roadmap concluídos** + features extras (Stats Pessoais, Chip "Novo")
- Stack: **React 18 + Vite + Tailwind + TypeScript** — 100% client-side
- **44 fontes** em `sources.json`, todas com o campo `lastVerified`
- Antes de modificar qualquer componente, leia o arquivo para entender as props e interfaces TypeScript atuais (`Card.tsx` tem interface `CardProps` com 10 props)

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
├── .github/workflows/
│   ├── ci.yml               # typecheck + lint + test + build em todo push/PR
│   └── deploy.yml           # deploy automático no GitHub Pages
├── .husky/pre-commit        # lint-staged antes de cada commit
├── scripts/
│   └── check-links.js       # npm run check-links — verifica todas as URLs
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── i18n.ts              # react-i18next (pt/en)
│   ├── types.ts             # Source, Collection, CategoryMeta…
│   ├── vite-env.d.ts        # tipos Vite + vite-plugin-pwa
│   ├── components/
│   │   ├── Card.tsx          # CardProps (10 props) + chip Novo + isShared
│   │   ├── CategorySection.tsx
│   │   ├── CollectionsPanel.tsx # + botão Share por coleção
│   │   ├── DailyPick.tsx
│   │   ├── FavoritesPanel.tsx
│   │   ├── FilterBar.tsx
│   │   ├── Header.tsx        # + LangToggle + Share + Stats (📊)
│   │   ├── LangToggle.tsx    # toggle PT-BR / EN
│   │   ├── NavBar.tsx
│   │   ├── SearchBar.tsx
│   │   ├── SortSelector.tsx
│   │   ├── SourceModal.tsx   # + focus trap
│   │   ├── StatsModal.tsx    # cliques, streak, top fontes
│   │   ├── TagFilter.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── Toast.tsx
│   │   ├── BackToTop.tsx
│   │   └── UpdatePrompt.tsx  # banner de nova versão do PWA
│   ├── data/
│   │   ├── sources.json      # 44 fontes (fonte canônica para check-links)
│   │   └── sources.ts        # re-export tipado do JSON
│   ├── hooks/
│   │   ├── useActiveSection.ts
│   │   ├── useClickStats.ts
│   │   ├── useClipboard.ts
│   │   ├── useCollections.ts
│   │   ├── useFavorites.ts
│   │   ├── useFocusTrap.ts  # focus trap para modais (a11y)
│   │   ├── useKeyboardShortcuts.ts
│   │   ├── useNotes.ts
│   │   ├── useSearch.ts
│   │   └── useTheme.ts
│   ├── lib/
│   │   ├── categories.ts
│   │   ├── daily.ts         # getDailyPick() — hash determinístico por data
│   │   ├── highlight.tsx    # highlight(text, term): ReactNode
│   │   ├── icons.ts         # 15 ícones registrados
│   │   └── share.ts         # encodeShare / decodeShare / buildShareUrl
│   ├── locales/
│   │   ├── pt.json          # strings em português
│   │   └── en.json          # strings em inglês
│   ├── test/
│   │   └── setup.ts         # @testing-library/jest-dom
│   └── styles/
│       └── index.css
├── .eslintrc.cjs
├── .prettierrc
├── tsconfig.json
├── vite.config.js           # + VitePWA + vitest config
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

Veja o arquivo `ROADMAP.md` para o plano completo. Todos os 15 sprints foram concluídos.

| Sprint | Tema | Status |
|--------|------|--------|
| 1–15 | Todos os sprints do roadmap | ✅ |
| Extra | Stats Pessoais + Chip "Novo" | ✅ |

### Chaves de localStorage em uso
| Chave | Hook/Origem | Conteúdo |
|-------|-------------|---------|
| `hub:favorites` | useFavorites | `string[]` de IDs |
| `hub:notes` | useNotes | `{ [sourceId]: string }` |
| `hub:click-stats` | useClickStats | `{ [sourceId]: number }` |
| `hub:collections` | useCollections | `Collection[]` |
| `hub:visit-streak` | App.tsx (useEffect mount) | `{ days: number, lastVisit: string }` |
| `hub:lang` | LangToggle | `"pt" \| "en"` |
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
**Estado:** Roadmap 100% concluído + features extras (Stats Pessoais, Chip "Novo")

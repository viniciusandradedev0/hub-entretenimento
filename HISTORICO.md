# Histórico do Projeto — Hub de Entretenimento Pessoal

> Hub pessoal e curado para descobrir filmes, música, podcasts, jogos e documentários a partir de fontes legais, gratuitas e de qualidade.

Este documento registra a evolução do projeto, decisões arquiteturais e os caminhos que foram abandonados ao longo do desenvolvimento.

---

## 🚀 Versão 4.0 — 2026-05-18 (atual)

### O que mudou

Após a v3.0 (Sprints 1–8), o projeto foi levado à maturidade técnica completa com os Sprints 9–15 e uma rodada extra de novas features (stats pessoais, chip "Novo").

### Sprints 9–15

| Sprint | Entregue |
|--------|---------|
| 9 | Compartilhamento via URL `?share=<base64>` — coleções compartilháveis sem backend; botão Share no header e no CollectionsPanel; banner de preview ao abrir link compartilhado; `src/lib/share.ts` |
| 10 | ESLint 8 + `eslint-plugin-react-hooks`, Prettier 3 + `prettier-plugin-tailwindcss`, Husky + lint-staged; 11 erros corrigidos no código legado; scripts `lint`, `lint:fix`, `format`, `format:check` |
| 11 | Migração completa para **TypeScript** — todos os 36 arquivos `.jsx/.js` renomeados para `.tsx/.ts`; `tsconfig.json`; `src/types.ts` com interfaces centrais (`Source`, `Collection`, `CategoryMeta`…); `sources.ts` com type assertion sobre JSON; `vite-env.d.ts` |
| 12 | **Vitest + Testing Library** — 6 arquivos de teste, 32 testes passando; cobertura de `useFavorites`, `useSearch`, `useTheme`, `useClipboard`, `SearchBar`, `Card`; scripts `test`, `test:watch`, `coverage` |
| 13 | **GitHub Actions** — `ci.yml` (typecheck + lint + test + build em todo push/PR) e `deploy.yml` (GitHub Pages automático no merge); base URL dinâmica para GH Pages; badge de CI no README |
| 14 | **PWA instalável** — `vite-plugin-pwa` com Workbox; Service Worker com precache e runtime cache de favicons; `manifest.json` embutido; `UpdatePrompt.tsx` com banner "Nova versão disponível" |
| 15 | **i18n PT-BR/EN** via `react-i18next`; `LangToggle.tsx` no header; skip-to-content; `useFocusTrap` hook; focus trap em `SourceModal`; ARIA live region para anunciar resultados de busca; `src/locales/pt.json` + `src/locales/en.json` |

### Novas features (pós-Sprint 15)

| Feature | Descrição |
|---------|-----------|
| **Chip "Novo"** | Badge `✦ Novo` verde em `Card.tsx` para fontes com `lastVerified` ≤ 30 dias |
| **Stats Pessoais** | Modal `StatsModal.tsx` acessível pelo botão 📊 no header — mostra cliques totais, favoritos, coleções, streak de visitas diárias, categoria favorita e top 5 fontes com mini barras de progresso; streak persistido em `hub:visit-streak` |

### Estrutura de pastas atual (v4.0)

```
/
├── .github/
│   └── workflows/
│       ├── ci.yml              # build + lint + typecheck + test em todo push
│       └── deploy.yml          # deploy automático no GitHub Pages
├── .husky/
│   └── pre-commit              # lint-staged antes de cada commit
├── scripts/
│   └── check-links.js          # verifica todas as URLs do catálogo
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── i18n.ts                 # configuração react-i18next (pt/en)
│   ├── types.ts                # interfaces centrais: Source, Collection, CategoryMeta…
│   ├── vite-env.d.ts           # tipos Vite + PWA
│   ├── data/
│   │   ├── sources.json        # 44 fontes (fonte de dados canônica para check-links)
│   │   └── sources.ts          # type-safe re-export do JSON
│   ├── lib/
│   │   ├── categories.ts       # CATEGORIES: CategoryMeta[]
│   │   ├── icons.ts            # ICONS map + resolveIcon()
│   │   ├── daily.ts            # getDailyPick() — hash determinístico por data
│   │   ├── highlight.tsx       # highlight(text, term): ReactNode
│   │   └── share.ts            # encodeShare / decodeShare / buildShareUrl
│   ├── hooks/
│   │   ├── useActiveSection.ts
│   │   ├── useClickStats.ts
│   │   ├── useClipboard.ts
│   │   ├── useCollections.ts
│   │   ├── useFavorites.ts
│   │   ├── useFocusTrap.ts     # focus trap para modais (a11y)
│   │   ├── useKeyboardShortcuts.ts
│   │   ├── useNotes.ts
│   │   ├── useSearch.ts
│   │   └── useTheme.ts
│   ├── locales/
│   │   ├── pt.json             # strings em português
│   │   └── en.json             # strings em inglês
│   ├── components/
│   │   ├── BackToTop.tsx
│   │   ├── Card.tsx            # 10 props + chip Novo (isNew) + isShared
│   │   ├── CategorySection.tsx # prop sharedIds para destaque de fontes compartilhadas
│   │   ├── CollectionsPanel.tsx # + botão Share por coleção
│   │   ├── DailyPick.tsx
│   │   ├── FavoritesPanel.tsx
│   │   ├── FilterBar.tsx
│   │   ├── Header.tsx          # + LangToggle + Share + Stats
│   │   ├── LangToggle.tsx      # toggle PT-BR / EN
│   │   ├── NavBar.tsx
│   │   ├── SearchBar.tsx
│   │   ├── SortSelector.tsx
│   │   ├── SourceModal.tsx     # + focus trap
│   │   ├── StatsModal.tsx      # stats pessoais (cliques, streak, top fontes)
│   │   ├── TagFilter.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── Toast.tsx
│   │   └── UpdatePrompt.tsx    # banner de nova versão do PWA
│   ├── test/
│   │   └── setup.ts            # @testing-library/jest-dom
│   └── styles/
│       └── index.css
├── .eslintrc.cjs
├── .prettierrc
├── .prettierignore
├── tsconfig.json
├── vite.config.js              # + VitePWA + test config
├── package.json
└── CLAUDE.md
```

### Chaves de localStorage (v4.0)

| Chave | Hook/Origem | Conteúdo |
|-------|-------------|---------|
| `hub:favorites` | useFavorites | `string[]` de IDs |
| `hub:notes` | useNotes | `{ [sourceId]: string }` |
| `hub:click-stats` | useClickStats | `{ [sourceId]: number }` |
| `hub:collections` | useCollections | `Collection[]` |
| `hub:visit-streak` | App.tsx (useEffect) | `{ days: number, lastVisit: string }` |
| `hub:lang` | LangToggle | `"pt" \| "en"` |
| `theme` | useTheme | `"dark" \| "light"` |

### Decisões de arquitetura (v4.0)

- **TypeScript progressivo** — `noImplicitAny: false` para facilitar migração gradual; interfaces centrais em `types.ts`; tipos explícitos nos componentes críticos
- **Stats sem hook** — `StatsModal` lê o `clickStats` passado como prop; o cálculo de `topSources` e `favoriteCategory` é feito com `useMemo` dentro do modal para não poluir App.tsx
- **Streak client-only** — `hub:visit-streak` é escrito num `useEffect` no mount do App; o StatsModal só lê do localStorage (estado "cold") para evitar re-renders desnecessários

---

## 🚀 Versão 3.0 — 2026-05-18

### O que mudou

Após a entrega da v2.0, o projeto passou por 8 sprints de melhorias contínuas, todos executados com agentes paralelos e revisão final por build limpo.

### Novas funcionalidades (Sprints 1–8)

| Sprint | Entregue |
|--------|---------|
| 1 | `.gitattributes`, preconnect favicon, tooltips nos badges, FilterBar (idioma + só favoritos) |
| 2 | Highlight de busca nos cards, atalhos `/` `Esc` `f`, badge kbd, empty state com sugestões |
| 3 | NavBar sticky com Intersection Observer, botão Back-to-top |
| 4 | SourceModal via createPortal, notas pessoais por fonte (useNotes), click handler no card |
| 5 | Fonte do dia determinística (daily.js), botão Surpreenda-me, TagFilter com chips bestFor |
| 6 | Export/import de favoritos (.json), useClickStats, ordenação A→Z / mais acessadas, SortSelector |
| 7 | +8 fontes brasileiras (44 total), campo `lastVerified`, badge ⚠️ se > 180 dias, script check-links |
| 8 | useCollections CRUD, CollectionsPanel drawer, dropdown "Adicionar à coleção" no card |

### Estrutura de pastas atual

```
/
├── scripts/
│   └── check-links.js          # verifica todas as URLs do catálogo
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── data/
│   │   └── sources.json        # 44 fontes em 5 categorias (com lastVerified)
│   ├── lib/
│   │   ├── categories.js
│   │   ├── icons.js            # mapa de ícones lucide (15 ícones)
│   │   ├── daily.js            # getDailyPick — hash determinístico por data
│   │   └── highlight.jsx       # utilitário de highlight de busca
│   ├── hooks/
│   │   ├── useFavorites.js     # toggleFavorite + addFavorites (import em massa)
│   │   ├── useTheme.js
│   │   ├── useSearch.js        # debounce + filtragem
│   │   ├── useClipboard.js
│   │   ├── useNotes.js         # notas por fonte em localStorage
│   │   ├── useClickStats.js    # contagem de acessos por fonte
│   │   ├── useCollections.js   # CRUD de coleções em localStorage
│   │   ├── useKeyboardShortcuts.js  # / Esc f
│   │   └── useActiveSection.js # Intersection Observer para NavBar
│   ├── components/
│   │   ├── Card.jsx            # card completo: highlight, favorito, coleção, lastVerified badge
│   │   ├── CategorySection.jsx # seção com sort (original/A→Z/mais acessadas)
│   │   ├── SearchBar.jsx       # com hint de atalho kbd /
│   │   ├── ThemeToggle.jsx
│   │   ├── FavoritesPanel.jsx  # com export/import .json
│   │   ├── CollectionsPanel.jsx # drawer com tabs, inline edit, CRUD
│   │   ├── Header.jsx          # Surpreenda-me + Coleções + Favoritos + Tema
│   │   ├── NavBar.jsx          # sticky, active section via IntersectionObserver
│   │   ├── FilterBar.jsx       # idioma + só favoritos + contador
│   │   ├── TagFilter.jsx       # chips bestFor mais frequentes (filtro OR)
│   │   ├── SortSelector.jsx    # dropdown de ordenação
│   │   ├── DailyPick.jsx       # destaque colapsável da fonte do dia
│   │   ├── SourceModal.jsx     # modal detalhado via createPortal
│   │   ├── BackToTop.jsx       # botão flutuante após 400px
│   │   └── Toast.jsx
│   └── styles/
│       └── index.css
├── .gitattributes
├── index.html
├── tailwind.config.js
├── vite.config.js
├── package.json
└── CLAUDE.md
```

### Fontes catalogadas (44 no total)

| Categoria | Qtd | Destaques |
|-----------|-----|-----------|
| 🎬 Filmes | 8 | Pluto TV, Tubi, Plex, Kanopy, Internet Archive, TV Brasil Play… |
| 🎵 Música | 9 | Spotify Free, Bandcamp, Jamendo, FMA, SoundCloud, Palco MP3… |
| 🎙️ Podcasts | 6 | Spotify, Apple Podcasts, Podchaser, Listen Notes… |
| 🎮 Jogos | 7 | itch.io, Epic Games, Newgrounds, Steam F2P… |
| 📚 Docs/Edu | 14 | YouTube Edu, MIT OCW, Khan Academy, DIO, Escola Virtual Gov, SESC Digital… |

Todas as fontes possuem o campo `lastVerified` desde 2026-05-18. O script `npm run check-links` verifica a acessibilidade de todas as URLs.

### Decisões de arquitetura mantidas

- **Sem backend** — tudo persiste em `localStorage` (favoritos, notas, coleções, click stats, tema)
- **Sem APIs pagas** — favicons via Google S2 (gratuito), sem chaves
- **Modais via `createPortal`** — SourceModal e CollectionsPanel evitam problemas de overflow/z-index
- **Filtros compostos** — busca + idioma + só favoritos + tags bestFor (OR) combinam via `useMemo`
- **Ordenação stateless** — `sortMode` global em App.jsx, sort aplicado em `useMemo` no CategorySection

### Ideia registrada no backlog

**Destaque em vídeo** — card com `<iframe>` embedado de conteúdo curado (YouTube / Internet Archive), rotativo por data, sem autoplay, colapsável. Não usa API. Planejado para intercalar com os sprints futuros.

---

## 🚀 Versão 2.0 — 2026-05-17

### Stack escolhida

- **React 18** com JSX puro (sem TypeScript) para componentização clara e ecossistema maduro.
- **Vite** como build tool e dev server, escolhido pelo HMR instantâneo e configuração mínima.
- **Tailwind CSS** com tema customizado (dark/light) e tokens próprios, em substituição ao CSS puro da V1.
- **PostCSS** para o pipeline do Tailwind.

A migração para esta stack foi exigida pelo novo `CLAUDE.md` fornecido pelo usuário, que descartou o modelo sem build step.

### Funcionalidades da v2.0

- Busca global com debounce, favoritos em localStorage, dark mode, copiar termos de busca, painel de favoritos.

### Correções aplicadas após revisão

- `new URL(...)` envolvido em `try/catch` para URLs malformadas.
- Keys estáveis (id da fonte) em vez de índice do array.
- Standard Ebooks removido (fora do escopo audiovisual/jogos).

---

## 🗄️ Versão 1.0 — abandonada

Construída sem build step usando HTM + React via CDN e CSS puro. Descartada quando o usuário definiu Vite + Tailwind como stack oficial no CLAUDE.md.

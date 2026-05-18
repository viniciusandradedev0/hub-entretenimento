# Histórico do Projeto — Hub de Entretenimento Pessoal

> Hub pessoal e curado para descobrir filmes, música, podcasts, jogos e documentários a partir de fontes legais, gratuitas e de qualidade.

Este documento registra a evolução do projeto, decisões arquiteturais e os caminhos que foram abandonados ao longo do desenvolvimento.

---

## 🚀 Versão 3.0 — 2026-05-18 (atual)

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

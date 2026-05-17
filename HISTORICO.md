# Histórico do Projeto — Hub de Entretenimento Pessoal

> Hub pessoal e curado para descobrir filmes, música, podcasts, jogos e documentários a partir de fontes legais, gratuitas e de qualidade.

Este documento registra a evolução do projeto, decisões arquiteturais e os caminhos que foram abandonados ao longo do desenvolvimento.

---

## 🚀 Versão 2.0 — 2026-05-17 (atual)

### Stack escolhida

- **React 18** com JSX puro (sem TypeScript) para componentização clara e ecossistema maduro.
- **Vite** como build tool e dev server, escolhido pelo HMR instantâneo e configuração mínima.
- **Tailwind CSS** com tema customizado (dark/light) e tokens próprios, em substituição ao CSS puro da V1.
- **PostCSS** para o pipeline do Tailwind.

A migração para esta stack foi exigida pelo novo `CLAUDE.md` fornecido pelo usuário, que descartou o modelo sem build step.

### Estrutura de pastas final

```
Projeto x/
├── index.html                  # entry point Vite
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── CLAUDE.md
├── README.md
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── data/
    │   └── sources.json        # 36 fontes em 5 categorias
    ├── lib/
    │   ├── categories.js
    │   └── icons.js
    ├── hooks/
    │   ├── useFavorites.js
    │   ├── useTheme.js
    │   ├── useSearch.js
    │   └── useClipboard.js
    ├── components/
    │   ├── Card.jsx
    │   ├── CategorySection.jsx
    │   ├── SearchBar.jsx
    │   ├── ThemeToggle.jsx
    │   ├── FavoritesPanel.jsx
    │   ├── Header.jsx
    │   └── Toast.jsx
    └── styles/
        └── index.css
```

### Fontes catalogadas (36 no total)

- 🎬 **filmes** — curadoria de plataformas gratuitas e legais de cinema.
- 🎵 **musica** — serviços de streaming, descoberta e rádios online editoriais (sem rádios broadcast).
- 🎙️ **podcasts** — diretórios e agregadores abertos.
- 🎮 **jogos** — lojas com gratuitos legais e bibliotecas indie.
- 📚 **documentarios** — acervos públicos e canais educativos.

> As categorias foram **renomeadas** em relação à V1, e o schema de cada fonte passou a incluir `bestFor`, `language`, `free` e `legal` para permitir filtragem e ranqueamento mais ricos.

### Funcionalidades implementadas

- **Busca global** (`useSearch`) com filtragem por nome, descrição e `bestFor`.
- **Favoritos** persistidos em `localStorage` via `useFavorites`, com painel dedicado.
- **Dark mode** com `useTheme`, alternância manual e respeito à preferência do sistema.
- **Copiar termos de busca** para a área de transferência (`useClipboard`) com feedback via `Toast`.
- **Painel de favoritos** acessível pelo header, listando todos os itens marcados.

### Decisões de design

- Tailwind configurado com **paleta customizada** (cores semânticas para dark/light) em vez de usar somente o default.
- Tipografia e espaçamentos padronizados via tokens no `tailwind.config.js`.
- Cards com hierarquia visual clara: ícone + título + descrição + chips de metadados.

### Correções aplicadas após revisão paralela

- Envolvido `new URL(...)` em `try/catch` para evitar quebra de render em URLs malformadas.
- Substituídas keys baseadas em índice por **keys estáveis** (id da fonte) nas listas renderizadas.
- Removida a entrada **Standard Ebooks** (fora do escopo de entretenimento audiovisual/jogos).

---

## 🗄️ Versão 1.0 — abandonada

A primeira versão do hub foi construída sem build step, usando **HTM + React via CDN** e **CSS puro com tokens** definidos em `:root`. A ideia era manter o projeto totalmente estático, abrindo o `index.html` direto no navegador, sem `npm install` nem servidor de desenvolvimento.

Essa abordagem chegou a ter componentes funcionais, dark mode e uma lista inicial de fontes, mas misturava sintaxe HTM (template literals) com lógica React, dificultando a leitura e a manutenção. O CSS puro, embora performático, exigia disciplina manual para manter consistência entre temas.

A V1 foi **descartada** quando o usuário forneceu um novo `CLAUDE.md` exigindo Vite + Tailwind como stack oficial do projeto. A migração trouxe HMR, JSX nativo, classes utilitárias e um schema de dados mais robusto, justificando a reescrita completa.

---

## 🛣️ Próximos passos

Com base no roadmap descrito em `README.md` e `CLAUDE.md`:

- Filtros avançados por idioma, gratuidade e tipo de conteúdo.
- Ordenação por relevância ou alfabética dentro de cada categoria.
- Atalhos de teclado para busca (`/`) e alternância de tema.
- Exportar/importar favoritos como JSON.
- Testes unitários nos hooks (`useFavorites`, `useSearch`).
- Acessibilidade: revisão de contraste, foco visível e navegação por teclado.
- PWA: manifest e service worker para uso offline.

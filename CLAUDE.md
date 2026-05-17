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

### ⚠️ Importante sobre o estado atual
- O projeto **já possui HTML e CSS iniciais** — esses arquivos devem ser **preservados e adaptados**, não reescritos do zero
- A migração para Tailwind deve ser **incremental**, mantendo as classes/estilos existentes quando fizerem sentido
- **Pergunte antes de remover** estilos ou estruturas já criadas

### Restrições
- ❌ **Sem APIs pagas** ou que exijam chave de acesso
- ❌ **Sem backend** na v1
- ❌ **Sem rastreadores** ou analytics de terceiros
- ❌ **Sem rádios** — apenas plataformas de música (streaming, download legal, etc.)
- ✅ **Tudo client-side**

---

## 📁 Estrutura de Pastas Sugerida

```
/
├── public/
├── src/
│   ├── components/
│   │   ├── Card.jsx
│   │   ├── CategorySection.jsx
│   │   ├── SearchBar.jsx
│   │   ├── ThemeToggle.jsx
│   │   └── FavoritesPanel.jsx
│   ├── data/
│   │   └── sources.json
│   ├── hooks/
│   │   ├── useFavorites.js
│   │   ├── useTheme.js
│   │   └── useSearch.js
│   ├── styles/
│   │   └── index.css        # Estilos globais + diretivas Tailwind
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── tailwind.config.js
├── vite.config.js
├── CLAUDE.md
└── README.md
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
  "legal": true
}
```

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

## 🗺️ Roadmap

### v1.0 — MVP
- [x] Estrutura base + categorias (HTML/CSS inicial já criado)
- [ ] Migração para React + Vite
- [ ] Integração do Tailwind preservando estilos atuais
- [ ] Renderização dos cards a partir do JSON
- [ ] Busca global
- [ ] Favoritos (localStorage)
- [ ] Toggle de tema

### v1.1
- [ ] Filtros por idioma e tipo de conteúdo
- [ ] Botão "copiar termo de busca"
- [ ] PWA (instalável offline)

### v2.0 (futuro)
- [ ] Sync de favoritos via conta (opcional, com backend)
- [ ] Recomendações baseadas em uso
- [ ] Extensão de navegador

---

## 💬 Comunicação

- Responda **sempre em português (Brasil)**
- Seja **direto e técnico**, sem rodeios
- Quando sugerir algo grande, **mostre o plano antes** de executar
- Em dúvidas, **pergunte** — não invente

---

**Última atualização:** 2026-05-17
**Mantenedor:** Vinicius

# 🎬 Hub de Entretenimento Pessoal

Um dashboard web pessoal que centraliza fontes **gratuitas e legais** de entretenimento — filmes, música, podcasts, jogos e documentários — com busca, favoritos, coleções e muito mais.

[![CI](https://github.com/viniciusandradedev0/hub-entretenimento/actions/workflows/ci.yml/badge.svg)](https://github.com/viniciusandradedev0/hub-entretenimento/actions/workflows/ci.yml)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6)
![Stack](https://img.shields.io/badge/stack-React%20%2B%20Vite%20%2B%20Tailwind-7c3aed)
![Fontes](https://img.shields.io/badge/fontes-44%20curadas-green)
![PWA](https://img.shields.io/badge/PWA-instalável-blueviolet)
![Tests](https://img.shields.io/badge/testes-32%20passando-brightgreen)

---

## ✨ Funcionalidades

### Descoberta
- 🎬 **5 categorias** — Filmes · Música · Podcasts/Audiolivros · Jogos · Documentários/Edu
- ✨ **Fonte do dia** — destaque rotativo diário, determinístico por data
- 🎲 **Surpreenda-me** — abre uma fonte aleatória do catálogo em nova aba

### Busca e filtros
- 🔍 **Busca global** com highlight do termo e debounce de 250ms
- 🌍 **Filtro por idioma** — Todos / PT-BR / EN / Multi
- 🏷️ **Filtro por tags** — chips clicáveis das categorias `bestFor` (filtro OR)
- ❤️ **Só favoritos** — exibe apenas as fontes marcadas
- 📊 **Ordenação** — Original / A→Z / Mais acessadas

### Organização pessoal
- ⭐ **Favoritos** — salvos localmente, com export/import `.json`
- 📂 **Coleções** — crie, renomeie e delete listas temáticas; adicione fontes via dropdown no card
- 📝 **Notas pessoais** — anotações por fonte persistidas no modal de detalhes
- 📈 **Stats pessoais** — modal 📊 com cliques totais, streak de visitas diárias, categoria favorita e top 5 fontes

### Compartilhamento
- 🔗 **Compartilhar coleção** — gera URL `?share=<base64>` com os IDs da coleção
- 📤 **Web Share API** — com fallback para clipboard
- 👁️ **Preview de link compartilhado** — fontes da coleção ficam destacadas em anel roxo ao abrir o link

### UX e Acessibilidade
- 🧭 **NavBar** — sticky com indicador de seção ativa (Intersection Observer)
- ⬆️ **Voltar ao topo** — botão flutuante após 400px de scroll
- ⌨️ **Atalhos de teclado** — `/` · `Esc` · `f`
- 🌗 **Dark/Light mode** — detecta preferência do sistema, toggle manual
- 🌐 **i18n PT-BR / EN** — toggle de idioma no header
- ♿ **Acessibilidade** — skip-to-content, focus trap em modais, ARIA live regions
- 📱 **PWA instalável** — funciona offline, ícone na home screen

### Qualidade do catálogo
- ✦ **Chip "Novo"** — badge verde em fontes com `lastVerified` ≤ 30 dias
- ⚠️ **Badge de link desatualizado** — aviso âmbar quando `lastVerified` > 180 dias
- 🔗 **Verificador de links** — `npm run check-links` faz HEAD em todas as 44 URLs

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|-----------|-----|
| **React 18** | UI e componentes |
| **TypeScript 5** | Type safety e IntelliSense |
| **Vite 5** | Build tool e dev server |
| **Tailwind CSS 3** | Estilização utility-first |
| **react-i18next** | Internacionalização (PT-BR / EN) |
| **vite-plugin-pwa** | Service Worker + manifest PWA |
| **Vitest + Testing Library** | 32 testes automatizados |
| **ESLint + Prettier + Husky** | Qualidade de código |
| **GitHub Actions** | CI/CD automático |
| **Lucide React** | Ícones |
| **clsx** | Classes condicionais |
| **localStorage** | Persistência client-side |

---

## 🎨 Paleta de Cores

| Token | Hex | Uso |
|-------|-----|-----|
| Background | `#0a0a0f` | Fundo principal |
| Surface | `#16161d` | Cards e painéis |
| Primary | `#7c3aed` | Destaques, links, DailyPick |
| Text | `#e5e5e5` | Texto principal |
| Muted | `#9ca3af` | Texto secundário |

---

## 🚀 Como rodar localmente

**Pré-requisitos:** Node.js 18+

```bash
# Clone o repositório
git clone https://github.com/viniciusandradedev0/hub-entretenimento.git
cd hub-entretenimento

# Instale as dependências
npm install

# Servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:5173`.

---

## 📜 Scripts disponíveis

```bash
npm run dev           # Servidor de desenvolvimento (HMR)
npm run build         # Build de produção
npm run preview       # Preview do build localmente
npm run typecheck     # Verifica tipos TypeScript (sem emitir)
npm run lint          # ESLint nos arquivos .ts/.tsx
npm run lint:fix      # ESLint com auto-fix
npm run format        # Prettier em src/**/*.{ts,tsx,css}
npm run test          # Vitest — executa todos os testes
npm run test:watch    # Vitest em modo watch
npm run coverage      # Relatório de cobertura (v8)
npm run check-links   # Verifica se todas as 44 URLs respondem
```

---

## ⌨️ Atalhos de teclado

| Tecla | Ação |
|-------|------|
| `/` | Foca o campo de busca |
| `Esc` | Limpa a busca / fecha modal |
| `f` | Abre/fecha o painel de favoritos |

---

## 📁 Estrutura do Projeto

```
/
├── .github/workflows/      # CI (ci.yml) e deploy automático (deploy.yml)
├── .husky/                 # Hook de pre-commit (lint-staged)
├── scripts/
│   └── check-links.js      # Verificador de links (Node 18+)
├── src/
│   ├── App.tsx             # Componente raiz — estado global e wiring
│   ├── main.tsx            # Entry point
│   ├── i18n.ts             # Configuração react-i18next
│   ├── types.ts            # Interfaces centrais (Source, Collection, CategoryMeta…)
│   ├── vite-env.d.ts       # Tipos Vite + PWA
│   ├── components/         # 19 componentes React (.tsx)
│   ├── data/
│   │   ├── sources.json    # 44 fontes curadas (fonte canônica)
│   │   └── sources.ts      # Re-export tipado do JSON
│   ├── hooks/              # 10 hooks customizados (.ts)
│   ├── lib/                # Utilitários: categories, daily, highlight, icons, share
│   ├── locales/            # pt.json + en.json
│   ├── test/               # Setup dos testes
│   └── styles/             # CSS global + Tailwind
├── .eslintrc.cjs
├── .prettierrc
├── tsconfig.json
└── vite.config.js          # + VitePWA + Vitest config
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
  "description": "Descrição breve (máx. 140 chars)",
  "bestFor": ["Indie", "Descoberta"],
  "language": "pt-BR",
  "searchTerms": ["música indie grátis"],
  "icon": "Music",
  "free": true,
  "legal": true,
  "lastVerified": "2026-05-18"
}
```

Após adicionar, rode `npm run check-links` para validar a URL.

> ⚠️ **Apenas fontes gratuitas e legais** são aceitas no projeto.

---

## 🗺️ Roadmap

Todos os 15 sprints do roadmap foram concluídos. O projeto é considerado **feature-complete** para a v1.

| Fase | Status |
|------|--------|
| Sprints 1–8: Quick wins, busca, modal, favoritos, coleções | ✅ |
| Sprints 9–15: Compartilhamento, TypeScript, Testes, CI/CD, PWA, i18n | ✅ |
| Features extras: Stats Pessoais, Chip "Novo" | ✅ |

---

## 🤝 Contribuindo

Este é um projeto pessoal. Sugestões são bem-vindas via issues.

1. Mantenha o foco em **conteúdo gratuito e legal**
2. Siga os padrões de código em `CLAUDE.md`
3. Adicione `lastVerified` em novas fontes e rode `npm run check-links`
4. `npm run typecheck && npm run lint && npm run test` devem passar sem erros

---

## 📜 Licença

MIT

---

## 👤 Autor

**Vinicius** — Curitiba, Brasil

---

*Este projeto apenas agrega links públicos de plataformas gratuitas e legais. Todos os direitos pertencem aos respectivos provedores.*

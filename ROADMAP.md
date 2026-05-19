# 🗺️ Roadmap — Hub de Entretenimento Pessoal

> Plano de desenvolvimento em 15 sprints, do polimento visual ao PWA completo.
> Cada sprint é independente, entregável e finalizável com um commit.
> Executamos um sprint por vez. Status atualizado conforme o avanço.

**Versão atual:** v2.0 — funcional (React + Vite + Tailwind, 44 fontes, busca, favoritos, coleções, compartilhamento)
**Repo:** https://github.com/viniciusandradedev0/hub-entretenimento

---

## Status geral

| Sprint | Tema | Status |
|--------|------|--------|
| 1 | Quick wins visuais | ✅ |
| 2 | Busca melhorada | ✅ |
| 3 | Navegação e orientação | ✅ |
| 4 | Card expandido + modal | ✅ |
| 5 | Diversão e descoberta | ✅ |
| 6 | Favoritos avançados | ✅ |
| 7 | Conteúdo e curadoria | ✅ |
| 8 | Coleções personalizadas | ✅ |
| 9 | Compartilhamento | ✅ |
| 10 | Qualidade: Lint + Format | ✅ |
| 11 | TypeScript | ✅ |
| 12 | Testes automatizados | ✅ |
| 13 | CI/CD e Deploy | ✅ |
| 14 | PWA instalável | ✅ |
| 15 | i18n + Acessibilidade avançada | ✅ |

Legenda: ✅ Concluído · 🔄 Em andamento · ⏳ Próximo · ⬜ Pendente

---

## Sprint 1 — Quick wins visuais
**Tema:** Polimento imediato sem grandes refactors. Alta percepção de qualidade, baixo esforço.

| # | Feature | Arquivos |
|---|---------|----------|
| 1.1 | `.gitattributes` (elimina CRLF warnings do Git) | `.gitattributes` (novo) |
| 1.2 | `<link rel="preconnect">` para Google Favicon API | `index.html` |
| 1.3 | Tooltips informativos nos badges do Card | `src/components/Card.jsx` |
| 1.4 | `FilterBar` — filtros por idioma (Todos / PT-BR / EN / Multi) + toggle "Só favoritos" | `src/App.jsx`, `src/components/FilterBar.jsx` (novo) |

**Resultado:** App com filtros funcionais, sem warnings no Git, favicons mais rápidos.

---

## Sprint 2 — Busca melhorada
**Tema:** Tornar a busca mais expressiva e acessível pelo teclado.

| # | Feature | Arquivos |
|---|---------|----------|
| 2.1 | Highlight do termo buscado no nome e descrição dos cards | `src/lib/highlight.jsx` (novo), `src/components/Card.jsx` |
| 2.2 | Atalhos de teclado: `/` foca busca, `Esc` limpa, `f` abre favoritos | `src/hooks/useKeyboardShortcuts.js` (novo), `src/App.jsx` |
| 2.3 | Dica visual do atalho `/` no placeholder do SearchBar | `src/components/SearchBar.jsx` |
| 2.4 | Mensagem de "sem resultados" com sugestões de termos | `src/App.jsx` |

**Resultado:** Busca com feedback visual, atalhos de teclado, UX de power-user.

---

## Sprint 3 — Navegação e orientação
**Tema:** O usuário sabe onde está na página e pula para categorias rapidamente.

| # | Feature | Arquivos |
|---|---------|----------|
| 3.1 | Quick-nav de categorias no header (links âncora que scrollam para a seção) | `src/components/Header.jsx`, `src/components/NavBar.jsx` (novo) |
| 3.2 | Indicador de categoria ativa conforme scroll (Intersection Observer) | `src/hooks/useActiveSection.js` (novo), `src/components/NavBar.jsx` |
| 3.3 | Botão "Voltar ao topo" (aparece após scroll de 400px) | `src/components/BackToTop.jsx` (novo) |

**Resultado:** Dashboard longo mas navegável, com orientação visual clara.

---

## Sprint 4 — Card expandido + modal de detalhes
**Tema:** Mais informação disponível sem poluir o card padrão.

| # | Feature | Arquivos |
|---|---------|----------|
| 4.1 | Modal de detalhes: todos os `searchTerms`, todos os `bestFor`, ícone grande, botão "Abrir site" | `src/components/SourceModal.jsx` (novo, via `createPortal`) |
| 4.2 | Trigger do modal ao clicar no card (fora do link e dos botões) | `src/components/Card.jsx` |
| 4.3 | Notas pessoais por fonte dentro do modal (textarea persistida em localStorage) | `src/hooks/useNotes.js` (novo) |

**Resultado:** Card compacto na grade, detalhes no modal — o melhor dos dois mundos.

---

## Sprint 5 — Diversão e descoberta
**Tema:** Features lúdicas que incentivam explorar o catálogo.

| # | Feature | Arquivos |
|---|---------|----------|
| 5.1 | Botão "Surpreenda-me" no header → abre fonte aleatória em nova aba | `src/components/Header.jsx` |
| 5.2 | "Fonte do dia" — exibida em destaque no topo, rotaciona por data | `src/components/DailyPick.jsx` (novo), `src/lib/daily.js` (lógica determinística por data) |
| 5.3 | Filtro de tags (bestFor) via chips clicáveis abaixo do FilterBar | `src/App.jsx`, `src/components/TagFilter.jsx` (novo) |

**Resultado:** App que convida o usuário a explorar, não só a buscar.

---

## Sprint 6 — Favoritos avançados
**Tema:** Dar mais poder sobre a lista de favoritos.

| # | Feature | Arquivos |
|---|---------|----------|
| 6.1 | Export de favoritos: baixar `favoritos.json` | `src/components/FavoritesPanel.jsx` |
| 6.2 | Import de favoritos: fazer upload de `favoritos.json` | `src/components/FavoritesPanel.jsx` |
| 6.3 | Histórico de cliques — contar quantas vezes cada fonte foi acessada | `src/hooks/useClickStats.js` (novo) |
| 6.4 | Ordenação na seção: original / A→Z / mais acessadas | `src/components/CategorySection.jsx`, `src/App.jsx` |

**Resultado:** Favoritos portáteis entre dispositivos + ordenação por uso real.

---

## Sprint 7 — Conteúdo e curadoria
**Tema:** Ampliar o catálogo com fontes brasileiras e manter links saudáveis.

| # | Feature | Arquivos |
|---|---------|----------|
| 7.1 | +8 fontes brasileiras: Palco MP3, Domínio Público (gov.br), TV Brasil Play, Fundação Bradesco, Univesp, Curta!, DIO Courses extras, Escola Virtual Gov | `src/data/sources.json` |
| 7.2 | Campo `lastVerified` (ISO date) em cada fonte | `src/data/sources.json`, `src/components/Card.jsx` (badge de aviso se > 180 dias) |
| 7.3 | Script Node `scripts/check-links.js` — faz HEAD em todas as URLs, reporta erros | `scripts/check-links.js` (novo) |

**Resultado:** +20% de fontes, curadoria ativa, nenhum link silenciosamente morto.

---

## Sprint 8 — Coleções personalizadas
**Tema:** Além de favoritos, o usuário cria listas temáticas.

| # | Feature | Arquivos |
|---|---------|----------|
| 8.1 | CRUD de coleções no localStorage: criar, renomear, deletar | `src/hooks/useCollections.js` (novo) |
| 8.2 | Dropdown no Card: "Adicionar à coleção…" | `src/components/Card.jsx` |
| 8.3 | Painel de coleções (similar ao FavoritesPanel) com troca entre coleções | `src/components/CollectionsPanel.jsx` (novo) |

**Resultado:** Usuário organiza o catálogo do jeito dele (trabalho, lazer, estudos…).

---

## Sprint 9 — Compartilhamento
**Tema:** Levar o hub além do navegador local.

| # | Feature | Arquivos |
|---|---------|----------|
| 9.1 | Compartilhar coleção/seleção via URL (`?share=<base64>`) | `src/lib/share.js` (novo), `src/App.jsx` |
| 9.2 | Botão de share nativo (Web Share API, com fallback para copiar link) | `src/components/Header.jsx` |
| 9.3 | Preview ao carregar URL compartilhada (destaque das fontes da coleção) | `src/App.jsx` |

**Resultado:** App compartilhável sem backend.

---

## Sprint 10 — Qualidade: ESLint + Prettier
**Tema:** Estabelecer padrão de código antes de TypeScript.

| # | Feature | Arquivos |
|---|---------|----------|
| 10.1 | ESLint com `eslint-plugin-react`, `eslint-plugin-react-hooks` | `.eslintrc.cjs` (novo), `package.json` |
| 10.2 | Prettier com plugin Tailwind (ordena classes automaticamente) | `.prettierrc` (novo), `package.json` |
| 10.3 | Scripts `npm run lint` e `npm run format` | `package.json` |
| 10.4 | Husky + lint-staged: lint automático em todo `git commit` | `.husky/` (novo), `package.json` |

**Resultado:** Código consistente, sem lint errors, formatação automática.

---

## Sprint 11 — TypeScript
**Tema:** Type safety completa no projeto.

| # | Feature | Arquivos |
|---|---------|----------|
| 11.1 | `tsconfig.json` + instalar `@types/react`, `@types/react-dom` | `tsconfig.json` (novo), `package.json` |
| 11.2 | Tipos centrais: `Source`, `Category`, `Favorites`, `ClickStats` | `src/types.ts` (novo) |
| 11.3 | Migrar hooks para `.ts` | `src/hooks/*.ts` |
| 11.4 | Migrar componentes para `.tsx` | `src/components/*.tsx`, `src/App.tsx`, etc. |
| 11.5 | Tipar `sources.json` com `as const satisfies Source[]` | `src/data/sources.json` → `src/data/sources.ts` |

**Resultado:** Erros pegos em build-time, IntelliSense completo.

---

## Sprint 12 — Testes automatizados
**Tema:** Cobertura mínima de regressão nos hooks e componentes críticos.

| # | Feature | Arquivos |
|---|---------|----------|
| 12.1 | Instalar Vitest + Testing Library + jsdom | `package.json`, `vite.config.ts` |
| 12.2 | Testes dos hooks: `useFavorites`, `useSearch`, `useClipboard`, `useTheme` | `src/hooks/*.test.ts` |
| 12.3 | Testes do Card: render, favoritar, copiar termos, fallback de favicon | `src/components/Card.test.tsx` |
| 12.4 | Teste do SearchBar: input, clear, atalho `/` | `src/components/SearchBar.test.tsx` |
| 12.5 | Script `npm run test` e `npm run coverage` | `package.json` |

**Resultado:** Regressões detectadas antes do push.

---

## Sprint 13 — CI/CD e Deploy
**Tema:** Automação total de build, teste e publicação.

| # | Feature | Arquivos |
|---|---------|----------|
| 13.1 | GitHub Actions: `ci.yml` (build + lint + test em todo push/PR) | `.github/workflows/ci.yml` (novo) |
| 13.2 | Deploy automático no Vercel (conectar repo) ou GitHub Pages | `.github/workflows/deploy.yml` (novo) |
| 13.3 | Badge de status no README | `README.md` |
| 13.4 | `vite.config.ts` com `base` configurado se GitHub Pages | `vite.config.ts` |

**Resultado:** Merge → deploy. CI bloqueia PR com teste falhando.

---

## Sprint 14 — PWA instalável
**Tema:** App instalável no celular/desktop com cache offline.

| # | Feature | Arquivos |
|---|---------|----------|
| 14.1 | Instalar `vite-plugin-pwa` | `package.json`, `vite.config.ts` |
| 14.2 | `manifest.json` com ícones, cores, nome | configurado no plugin |
| 14.3 | Service Worker: cache da app shell + `sources.json` | configurado no plugin (Workbox) |
| 14.4 | Banner "Atualização disponível — recarregar?" quando SW atualiza | `src/components/UpdatePrompt.jsx` (novo) |

**Resultado:** App instalável, funciona offline, ícone na home screen do celular.

---

## Sprint 15 — i18n + Acessibilidade avançada
**Tema:** App inclusivo e pronto para mais idiomas.

| # | Feature | Arquivos |
|---|---------|----------|
| 15.1 | `react-i18next`: strings em `src/locales/pt.json` e `src/locales/en.json` | `src/locales/`, `src/i18n.ts` (novo) |
| 15.2 | Toggle de idioma no header (PT/EN) | `src/components/Header.tsx` |
| 15.3 | Focus trap no `FavoritesPanel`, `SourceModal` e `CollectionsPanel` | via `focus-trap-react` ou implementação própria |
| 15.4 | Link "Pular para o conteúdo" (skip-to-content) | `src/App.tsx`, `src/styles/index.css` |
| 15.5 | ARIA live regions completas: anunciar resultados de busca, favorito adicionado | `src/App.tsx`, componentes relevantes |

**Resultado:** Acessível a leitores de tela, pronto para inglês, inclusivo por design.

---

## Novas ideias (backlog aberto)
Ideias para depois do Sprint 15 ou para intercalar:

- **Screenshots hover** nos cards (campo `preview` no schema + popover)
- **Modo compacto** — toggle que reduz cards a lista simples (nome + link)
- **Histórico de visitas** — "Você acessou isso 3x esta semana"
- **Recomendações por similaridade** — "Quem curtiu itch.io também usa Game Jolt"
- **Integração com Notion** — exportar favoritos para database do Notion via API
- **Extensão de navegador** — botão para "adicionar site atual ao Hub"
- **Destaque em vídeo** — card de destaque rotativo no topo com `<iframe>` embedado de conteúdo curado (YouTube, Internet Archive). Vídeo escolhido deterministicamente por data (mesmo algoritmo da "Fonte do dia"). Sem autoplay — o usuário clica para iniciar. Lista de embeds curados em `src/data/featured-videos.json` com campos `{ id, title, embedUrl, platform, category }`. Colapsável para não ocupar espaço quem não quiser. Não usa API — apenas iframes públicos de plataformas que permitem embedding gratuito.

---

## Convenções de commit por sprint

```
feat(s1): adicionar FilterBar e tooltips nos badges
feat(s2): highlight de busca e atalhos de teclado
feat(s3): quick-nav e back-to-top
...
```

---

*Atualizado em: 2026-05-18*
*Roadmap concluído em: **2026-05-18** — todos os 15 sprints entregues!*

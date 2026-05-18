# 🎬 Hub de Entretenimento Pessoal

Um dashboard web pessoal que centraliza fontes **gratuitas e legais** de entretenimento em um único lugar — filmes, música, podcasts, jogos e documentários — com busca, favoritos, coleções e muito mais.

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)
![Stack](https://img.shields.io/badge/stack-React%20%2B%20Vite%20%2B%20Tailwind-7c3aed)
![Fontes](https://img.shields.io/badge/fontes-44%20curadas-green)

---

## ✨ Funcionalidades

### Descoberta
- 🎬 **Filmes e séries** — plataformas gratuitas e legais de streaming
- 🎵 **Música** — streaming, download legal e descoberta musical
- 🎙️ **Podcasts e audiolivros** — agregadores e diretórios abertos
- 🎮 **Jogos** — plataformas com jogos gratuitos legítimos
- 📚 **Documentários e educação** — conteúdo educativo de qualidade
- ✨ **Fonte do dia** — destaque rotativo diário, determinístico por data
- 🎲 **Surpreenda-me** — abre uma fonte aleatória do catálogo

### Busca e filtros
- 🔍 **Busca global** com highlight do termo nos cards
- 🌍 **Filtro por idioma** — Todos / PT-BR / EN / Multi
- 🏷️ **Filtro por tags** — chips clicáveis das categorias bestFor (filtro OR)
- ❤️ **Só favoritos** — exibe apenas as fontes marcadas
- 📊 **Ordenação** — Original / A→Z / Mais acessadas

### Organização pessoal
- ⭐ **Favoritos** — salvos localmente, com export/import `.json`
- 📂 **Coleções** — crie, renomeie e delete listas temáticas; adicione fontes via dropdown no card
- 📝 **Notas pessoais** — anote observações em cada fonte (no modal de detalhes)
- 📈 **Histórico de acessos** — contagem de cliques por fonte (usado na ordenação)

### Navegação e UX
- 🧭 **NavBar de categorias** — sticky com indicador da seção ativa (Intersection Observer)
- ⬆️ **Voltar ao topo** — botão flutuante após 400px de scroll
- ⌨️ **Atalhos de teclado** — `/` foca busca · `Esc` limpa · `f` abre favoritos
- 🌗 **Dark/Light mode** — detecta preferência do sistema, toggle manual
- 📱 **Responsivo** — mobile-first, funciona em qualquer tela

### Qualidade
- ⚠️ **Badge de link desatualizado** — aviso âmbar quando `lastVerified` > 180 dias
- 🔗 **Script de verificação de links** — `npm run check-links` faz HEAD em todas as URLs

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|-----------|-----|
| **React 18+** | UI e componentes |
| **Vite** | Build tool e dev server |
| **Tailwind CSS** | Estilização utility-first |
| **Lucide React** | Ícones |
| **clsx** | Classes condicionais |
| **localStorage** | Favoritos, notas, coleções, click stats, tema |

---

## 🎨 Paleta de Cores

| Token | Hex | Uso |
|-------|-----|-----|
| Background | `#0a0a0f` | Fundo principal |
| Surface | `#16161d` | Cards e painéis |
| Primary | `#7c3aed` | Destaques e botões |
| Text | `#e5e5e5` | Texto principal |
| Muted | `#9ca3af` | Texto secundário |

---

## 🚀 Como rodar localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) 18+ instalado

### Jeito rápido (Windows)

Dê duplo clique em **`start.bat`** — instala dependências na primeira vez e abre o servidor automaticamente.

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
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build localmente
npm run check-links  # Verifica se todas as 44 URLs estão acessíveis (Node 18+)
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
├── scripts/
│   └── check-links.js      # Verificador de links (Node 18+)
├── src/
│   ├── components/         # 15 componentes React
│   ├── data/
│   │   └── sources.json    # 44 fontes curadas
│   ├── hooks/              # 9 hooks customizados
│   ├── lib/                # Utilitários (ícones, categorias, daily, highlight)
│   ├── styles/             # CSS global + Tailwind
│   ├── App.jsx
│   └── main.jsx
├── .gitattributes
├── index.html
├── tailwind.config.js
├── vite.config.js
└── CLAUDE.md               # Diretrizes para IA assistente
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

### Categorias válidas
- `filmes` · `musica` · `podcasts` · `jogos` · `documentarios`

### Ícones disponíveis
`Film`, `Music`, `Mic`, `Headphones`, `BookOpen`, `Gamepad2`, `GraduationCap`, `Youtube`, `Archive`, `Search`, `Library`, `Code`, `Theater`, `Landmark`, `Tv`

> ⚠️ **Apenas fontes gratuitas e legais** são aceitas no projeto.

---

## 🗺️ Roadmap

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
| 9 | Compartilhamento via URL | ⏳ próximo |
| 10–15 | Lint, TypeScript, Testes, CI/CD, PWA, i18n | ⬜ |

---

## 🤝 Contribuindo

Este é um projeto pessoal, mas sugestões são bem-vindas! Abra uma issue ou pull request.

### Diretrizes
1. Mantenha o foco em **conteúdo gratuito e legal**
2. Siga os padrões de código descritos em `CLAUDE.md`
3. Adicione `lastVerified` em novas fontes e rode `npm run check-links`
4. Teste em mobile e desktop antes de submeter

---

## 📜 Licença

Distribuído sob a licença MIT.

---

## 👤 Autor

**Vinicius** — Curitiba, Brasil

---

## 🙏 Agradecimentos

Este projeto não hospeda nem distribui conteúdo — apenas agrega links públicos de plataformas gratuitas e legais. Todos os direitos pertencem aos respectivos provedores.

# Web Toolkit — Frontend Design Workspace

Next.js 16 + shadcn/ui + Tailwind v4 project for building beautiful webpages fast.

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui (code-distributed, fully customizable)
- **Design Intelligence**: UI UX Pro Max (50+ styles, 161 palettes, 57 font pairings)

## Directory Structure

```
web-toolkit/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/
│   │   └── ui/           # shadcn/ui components (14 installed)
│   └── lib/              # Utilities (cn() helper)
├── .claude/
│   └── skills/
│       └── ui-ux-pro-max/  # Design intelligence skill
├── .tools/
│   ├── ui-ux-pro-max/   # Full UI UX Pro Max repo (reference)
│   └── magic-mcp/       # 21st.dev Magic MCP (AI component gen)
└── public/               # Static assets
```

## Installed shadcn/ui Components

accordion, avatar, badge, button, card, dialog, dropdown-menu, input, label,
navigation-menu, separator, sheet, tabs, textarea

Add more: `npx shadcn@latest add <component-name>`
Browse all: https://ui.shadcn.com/docs/components

## Design Tools

### 1. shadcn/ui (Local)
Components live in `src/components/ui/`. Fully editable. Add new ones:
```bash
npx shadcn@latest add [component]
```

### 2. UI UX Pro Max (Local Skill)
Search the design database:
```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "landing page" --domain product
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "dark theme" --domain color
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "modern sans" --domain typography
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "glassmorphism" --domain style
```
Domains: product, style, typography, color, landing, chart, ux

### 3. Google Stitch (Browser)
AI UI generator: stitch.withgoogle.com
- Text-to-UI prototyping
- Export designs to code
- 350 free generations/month

### 4. 21st.dev Magic MCP (Optional)
AI component generator. To activate, add to MCP config and get API key from 21st.dev.

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint check
```

## Creating Pages

New pages go in `src/app/`. Example: `src/app/landing/page.tsx` serves at `/landing`.

## Design Workflow

1. **Ideate** - Use Stitch or describe what you want
2. **Search** - Query UI UX Pro Max for styles, colors, typography
3. **Build** - Compose with shadcn/ui components + Tailwind
4. **Polish** - Add animations, responsive breakpoints, dark mode

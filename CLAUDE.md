# Web Toolkit — Portfolio & Web Projects

Next.js portfolio hosting multiple client/personal web projects. Each project is a route.

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion (only animation lib — no GSAP/Lenis)
- **Icons**: Lucide React
- **Components**: shadcn/ui (14 installed, used sparingly — custom code preferred)
- **Design Intelligence**: UI UX Pro Max skill (generates design systems)
- **Visual Verification**: Puppeteer MCP (headless screenshots)
- **Component Inspiration**: 21st.dev Magic MCP (`component_inspiration` only)

## Deployment

- **GitHub**: `zyynx-hub/web-toolkit`
- **Vercel**: `robin-portfolio-flax.vercel.app` (auto-deploys on push)
- Build: `npm run build` must pass before push

## Directory Structure

```
web-toolkit/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Portfolio homepage (dark, green accent)
│   │   ├── layout.tsx         # Root layout (Space Grotesk + JetBrains Mono)
│   │   ├── globals.css        # Tailwind base
│   │   └── brenda/            # Brenda's Hairstyle salon site
│   │       ├── page.tsx       # Full salon page (self-contained)
│   │       ├── layout.tsx     # Brenda layout (Nunito Sans + Varela Round)
│   │       └── brenda.css     # Soft UI Evolution design tokens
│   ├── components/
│   │   ├── ui/                # shadcn/ui components (14 installed)
│   │   └── brenda/            # ORPHANED — old split components, unused
│   └── lib/
│       ├── utils.ts           # cn() helper
│       └── data/brenda.ts     # Salon data (unused — data is inline in page.tsx)
├── .claude/
│   ├── skills/
│   │   └── ui-ux-pro-max/     # Design intelligence (67 styles, 96 palettes)
│   └── rules/
│       └── frontend-toolkit.md
├── design-system/             # Persisted design systems from UI UX Pro Max
│   └── brenda's-hairstyle/MASTER.md
├── public/
│   └── brenda/                # Salon photos (5 images)
└── docs/
    └── status.md              # Current state + session log
```

## Pages

| Route | Project | Design System | Status |
|-------|---------|--------------|--------|
| `/` | Portfolio homepage | Dark + green (#22C55E), Space Grotesk | Working, needs polish |
| `/brenda` | Brenda's Hairstyle | Soft UI Evolution, pink (#EC4899), Varela Round | Working, needs polish |

## Design Workflow

1. **Generate design system**: `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<keywords>" --design-system -p "Name"`
2. **Build with Framer Motion** — word reveals, 3D tilt, magnetic buttons, image clip wipes
3. **Screenshot with Puppeteer** — verify via `puppeteer_navigate` + `puppeteer_screenshot`
4. **Iterate** — user feedback → fix → screenshot → repeat
5. **Deploy** — `git push` triggers Vercel auto-deploy

## Key Patterns

- **Single-file pages**: Each project's page.tsx is self-contained (data + components + FX)
- **Custom over library**: Write custom Tailwind + Framer Motion rather than fighting shadcn APIs
- **Design system first**: Always run UI UX Pro Max before building — get colors, fonts, style right
- **Visual verification**: Use Puppeteer to screenshot after changes (can't see output otherwise)

## Animation Components (reusable across projects)

- `Reveal` — scroll-triggered fade+blur-in
- `TextReveal` — word-by-word stagger with blur
- `CharReveal` — character-by-character spring reveal
- `ImageReveal` — clip-path wipe with zoom
- `TiltCard` — 3D perspective tilt on hover
- `MagneticButton` — button follows cursor with spring
- `FloatingBlob` — decorative animated gradient blob
- `ScrollProgress` — gradient progress bar
- `CursorSpotlight` — mouse-following radial gradient
- `GrainOverlay` — SVG noise texture
- `Marquee` — infinite horizontal scroll
- `Counter` — spring-animated number counter

## Commands

```bash
npm run dev          # Dev server (localhost:3000)
npm run build        # Production build (must pass before deploy)
npm run lint         # ESLint
```

## Gotchas

- `Reveal` component doesn't accept `style` prop — use Tailwind classes with `[var(--x)]` syntax
- Puppeteer screenshots are static — can't verify hover/scroll animations visually
- 21st.dev `component_builder` opens browser window (unusable from Claude) — only `component_inspiration` works
- Malwarebytes blocks fresh `*.vercel.app` domains — user must whitelist
- Framer Motion `useInView` needs scroll to trigger in Puppeteer — use `window.scrollTo()` + delay

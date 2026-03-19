# Build Full Portfolio — All Projects

You are building a complete developer portfolio at `c:/Users/Robin/Desktop/Projects/web-toolkit`. Each project gets its own route, its own design system, and its own visual identity. No two projects should look alike.

## CRITICAL RULES

1. **Use agent teams in parallel** — each project is independent, different file domains, 5+ tool calls each. Spawn parallel agents.
2. **Generate a design system FIRST** for each project: `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<keywords>" --design-system -p "Name"`
3. **Every project must have "wow" animations** — character reveals, 3D tilt, cursor effects, scroll-driven motion, spring physics. Static = rejected.
4. **Screenshot with Puppeteer after building** — `puppeteer_navigate` + `puppeteer_screenshot` to self-verify before showing user.
5. **Each project gets a UNIQUE style** — different color palette, different typography, different animation approach. Check the style registry below.
6. **Use only**: Next.js + Tailwind + Framer Motion + Lucide icons. No GSAP, no Lenis, no shadcn (unless forms).
7. **21st.dev is inspiration-only** — search for techniques, write original code.
8. **All code original** — no copy-paste from 21st.dev or any template.

## Project Registry — What to Build

Read each project's CLAUDE.md and docs/status.md first to understand what it is.

| # | Project | Root | What it is | Route | Style Direction |
|---|---------|------|-----------|-------|----------------|
| 1 | AnimePlatformer | `codex/godot_port/` | 2D anime platformer game (Godot 4) | `/codex` | Retro pixel art, dark + neon, scanline effects, game UI aesthetic |
| 2 | Backrooms | `Backrooms/BackRooms/` | Horror game (UE5) | `/backrooms` | VHS horror, distorted text, glitch effects, found-footage grain |
| 3 | brenda-hairstyle | Already built at `/brenda` | Hair salon website | `/brenda` | Soft UI Evolution, pink palette (ALREADY DONE — polish only) |
| 4 | FileStudio | `Projects/FileStudio/` | CLS analysis tool (single HTML) | `/filestudio` | Clean data-tool aesthetic, monospace, blue/slate, dashboard feel |
| 5 | GodotMetrics | `Projects/GodotMetrics/` | Godot telemetry plugin (itch.io product) | `/godotmetrics` | Developer tool, terminal green-on-black, code blocks, technical |
| 6 | SPSS-Migratie | `Projects/SPSS-Migratie/` | CBS SPSS→Python migration tool | `/spss` | Government/enterprise, clean Dutch design, orange (#FF6600 CBS), formal |
| 7 | Semester6 | `Semester 6/` | HBO-ICT school project documentation | `/semester6` | Academic, clean serif, paper-white, structured |
| 8 | MCP-Servers | `Projects/mcp-servers/` | Custom MCP tools for UE5/Blender | `/mcp` | Technical/API docs style, dark + syntax highlighting colors |

## Style Registry (NO DUPLICATES)

Each project MUST use a different combination. Track what's used:

| Project | Bg | Accent | Font Heading | Font Body | Key Effect |
|---------|-----|--------|-------------|-----------|-----------|
| Portfolio `/` | #0a0a0b | #22C55E | Space Grotesk | Space Grotesk | Cursor spotlight + char reveal |
| Brenda `/brenda` | #FDF2F8 | #EC4899 | Varela Round | Nunito Sans | Word blur + 3D tilt |
| Codex `/codex` | ? | ? | ? | ? | ? |
| Backrooms `/backrooms` | ? | ? | ? | ? | ? |
| ... fill as you build | | | | | |

## Parallel Agent Strategy

Split into 3-4 parallel agents:

**Agent 1 — Game Projects**: `/codex` (anime platformer) + `/backrooms` (horror game)
- Read each project's CLAUDE.md for context
- Generate design systems
- Build showcase pages with game-specific aesthetics

**Agent 2 — Tool Projects**: `/filestudio` + `/godotmetrics` + `/mcp`
- Read each project's CLAUDE.md
- Generate design systems
- Build showcase pages with developer/tool aesthetics

**Agent 3 — Professional Projects**: `/spss` + `/semester6`
- Read project docs
- Generate design systems
- Build showcase pages with formal/academic aesthetics

**Agent 4 (main) — Portfolio Homepage**: Update `/` to list all projects with previews

## Per-Project Build Steps

For EACH project:

1. Read the project's `CLAUDE.md` and `docs/status.md` to understand what it does
2. Run `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<keywords>" --design-system -p "Name" --persist`
3. Create `src/app/{route}/page.tsx` — self-contained, all components inline
4. Create `src/app/{route}/layout.tsx` — project-specific fonts
5. Create `src/app/{route}/{route}.css` — design tokens
6. Screenshot with Puppeteer to verify
7. Add to the projects array in `src/app/page.tsx` (portfolio homepage)

## Portfolio Homepage Update

After all projects are built, update `src/app/page.tsx`:
- Add all projects to the `projects` array with correct metadata
- Add a screenshot/preview image for each project (use Puppeteer to capture)
- Consider adding project filtering by category (Games, Tools, Professional)

## Quality Checklist (per project)

- [ ] Design system generated and persisted
- [ ] Unique color palette (not used by any other project)
- [ ] Unique font pairing (not used by any other project)
- [ ] At least 3 different animation types
- [ ] Hero section that immediately communicates what the project IS
- [ ] Key features/screenshots section
- [ ] Tech stack display
- [ ] Link to live project / GitHub
- [ ] Mobile responsive
- [ ] Puppeteer screenshot verified
- [ ] Added to portfolio homepage
- [ ] `npm run build` passes

## After Everything is Built

1. Run `npm run build` to verify all routes compile
2. `git add -A && git commit && git push` to deploy to Vercel
3. Verify all routes work on `robin-portfolio-flax.vercel.app`
4. Update `docs/status.md` with results

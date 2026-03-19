# Frontend Toolkit Enforcement

## Mandatory Toolkit Usage

Before marking ANY frontend section as complete, verify it uses components from EVERY layer:

### Layer 1: shadcn/ui Components (REQUIRED in every section)
Every section MUST use at least one shadcn primitive. Never build raw HTML divs when a shadcn component exists.

| Need | Use | NOT raw HTML |
|------|-----|-------------|
| Cards/containers | `Card`, `CardHeader`, `CardContent` | `<div className="border rounded">` |
| Buttons | `Button` with variants | `<button className="...">` |
| Tabs/categories | `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | Custom state toggle |
| Mobile menu | `Sheet`, `SheetContent`, `SheetTrigger` | Custom overlay div |
| Modals/lightbox | `Dialog`, `DialogContent` | Custom z-index overlay |
| Forms | `Input`, `Label`, `Textarea` | `<input className="...">` |
| Labels/tags | `Badge` | `<span className="...">` |
| Dividers | `Separator` | `<div className="h-px">` |
| Dropdowns | `DropdownMenu` | Custom click handler |

### Layer 2: Animation Split (REQUIRED)

| Use Case | Library | Rule |
|----------|---------|------|
| Hover states, mount/unmount, layout shifts | **Framer Motion** | `motion.div`, `AnimatePresence`, `useInView` |
| Scroll-driven parallax, timelines, scrub | **GSAP + ScrollTrigger** | `gsap.to()`, `scrub: true`, timeline chains |
| Smooth scroll momentum | **Lenis** | Wrap root, connect to GSAP ticker |

Both GSAP and Framer Motion MUST be used. Not one or the other.

### Layer 3: Scroll Experience (REQUIRED)
- Lenis smooth scroll wrapping the page
- GSAP ScrollTrigger for at least: parallax images, section reveals, pinned elements
- Framer Motion `useInView` for component-level enter animations

### Layer 4: Design Effects (at least 3 per page)
Pick from the custom fx/ components or create new ones:
- Cursor-following glow
- Blur-reveal on scroll
- Glow border (cursor-tracking)
- Glow button (breathing aura)
- Scroll-driven text reveal
- Image comparison slider
- Parallax depth layers
- Magnetic hover effects

## Pre-Build Checklist

Before writing ANY section component, answer:
1. Which shadcn components does this section use?
2. Which Framer Motion animations does this section use?
3. Which GSAP scroll effects does this section use?
4. Which custom fx does this section use?

If any answer is "none" — redesign the section.

## Post-Build Audit

After building all sections, run this checklist:
- [ ] Every `<button>` uses shadcn `Button`
- [ ] Every card uses shadcn `Card`
- [ ] Pricing uses shadcn `Tabs`
- [ ] Mobile nav uses shadcn `Sheet`
- [ ] At least one `Dialog` exists (lightbox, booking, etc.)
- [ ] Forms use shadcn `Input` + `Label`
- [ ] GSAP ScrollTrigger has at least 3 scroll-driven animations
- [ ] Lenis wraps the page root
- [ ] Framer Motion handles all hover/mount animations
- [ ] At least 3 custom effects are active

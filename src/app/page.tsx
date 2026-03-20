"use client"

import { useRef, useCallback, useEffect, useState } from "react"
import Link from "next/link"
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useInView,
} from "framer-motion"
import { ArrowUpRight, Github, Mail, ArrowDown } from "lucide-react"
import { GlowingEffect } from "@/components/ui/glowing-effect"

/* ------------------------------------------------------------------ */
/*  FX: Warm cursor glow                                               */
/* ------------------------------------------------------------------ */
function CursorGlow() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)

  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY) }
    window.addEventListener("mousemove", move)
    return () => window.removeEventListener("mousemove", move)
  }, [x, y])

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30"
      style={{
        background: useTransform(
          [x, y],
          ([px, py]) => `radial-gradient(600px circle at ${px}px ${py}px, rgba(251,146,60,0.07), transparent 50%)`
        ),
      }}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  FX: Scroll-triggered reveal                                        */
/* ------------------------------------------------------------------ */
function Reveal({ children, className = "", delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  FX: Animated gradient mesh background for hero                     */
/* ------------------------------------------------------------------ */
function HeroMesh() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Warm amber blob — top right */}
      <motion.div
        className="absolute w-[900px] h-[900px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(251,146,60,0.35) 0%, rgba(251,146,60,0) 60%)",
          top: "-20%", right: "-15%",
          filter: "blur(50px)",
        }}
        animate={{ x: [0, -40, 0], y: [0, 30, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Coral/rose blob — left center */}
      <motion.div
        className="absolute w-[750px] h-[750px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(234,88,12,0.2) 0%, transparent 55%)",
          top: "25%", left: "-18%",
          filter: "blur(60px)",
        }}
        animate={{ x: [0, 50, 0], y: [0, -30, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      {/* Warm golden blob — bottom center */}
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(234,179,8,0.18) 0%, transparent 50%)",
          bottom: "-10%", left: "35%",
          filter: "blur(60px)",
        }}
        animate={{ x: [0, -30, 0], y: [0, -25, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />
      {/* Deep terracotta blob — bottom left for depth */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(180,83,9,0.12) 0%, transparent 50%)",
          bottom: "10%", left: "5%",
          filter: "blur(80px)",
        }}
        animate={{ x: [0, 20, 0], y: [0, 40, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 8 }}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  FX: Floating orbs that drift across hero                           */
/* ------------------------------------------------------------------ */
function FloatingOrbs() {
  const orbs = [
    { size: 6, x: "15%", y: "25%", delay: 0, dur: 7, color: "rgba(251,146,60,0.6)" },
    { size: 4, x: "75%", y: "35%", delay: 1, dur: 9, color: "rgba(234,88,12,0.5)" },
    { size: 5, x: "55%", y: "70%", delay: 3, dur: 8, color: "rgba(234,179,8,0.5)" },
    { size: 3, x: "85%", y: "60%", delay: 2, dur: 11, color: "rgba(251,146,60,0.45)" },
    { size: 4, x: "30%", y: "80%", delay: 4, dur: 10, color: "rgba(180,83,9,0.4)" },
    { size: 7, x: "45%", y: "20%", delay: 1, dur: 12, color: "rgba(234,179,8,0.35)" },
    { size: 3, x: "65%", y: "85%", delay: 6, dur: 8, color: "rgba(251,146,60,0.4)" },
    { size: 5, x: "20%", y: "55%", delay: 3, dur: 9, color: "rgba(234,88,12,0.35)" },
  ]
  return (
    <>
      {orbs.map((o, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: o.size, height: o.size, left: o.x, top: o.y,
            background: o.color,
            boxShadow: `0 0 ${o.size * 3}px ${o.color}`,
          }}
          animate={{
            y: [0, -20, 0, 15, 0],
            x: [0, 10, -5, 8, 0],
            opacity: [0.4, 0.8, 0.5, 0.9, 0.4],
          }}
          transition={{ duration: o.dur, repeat: Infinity, delay: o.delay, ease: "easeInOut" }}
        />
      ))}
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  FX: Animated name with word stagger + warm gradient                */
/* ------------------------------------------------------------------ */
function AnimatedName() {
  const firstName = "Robin"
  const lastName = "."

  return (
    <h1
      className="text-[clamp(3.5rem,12vw,9rem)] font-black tracking-tighter leading-[0.9]"
      style={{ fontFamily: "var(--font-heading)" }}
    >
      <span className="inline-block overflow-hidden">
        {firstName.split("").map((char, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={{ y: "120%", rotateZ: 8 }}
            animate={{ y: "0%", rotateZ: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.3 + i * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ color: "#1a1a1a" }}
          >
            {char}
          </motion.span>
        ))}
      </span>
      <span className="inline-block overflow-hidden">
        <motion.span
          className="inline-block"
          initial={{ y: "120%", scale: 0.5 }}
          animate={{ y: "0%", scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            background: "linear-gradient(135deg, #F97316, #F43F5E, #8B5CF6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {lastName}
        </motion.span>
      </span>
    </h1>
  )
}

/* ------------------------------------------------------------------ */
/*  FX: Role tags that spring in                                       */
/* ------------------------------------------------------------------ */
function RoleTags() {
  const roles = ["Games", "Websites", "Tools"]
  return (
    <motion.div
      className="flex flex-wrap items-center justify-center gap-3 mt-8"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 1.2 } } }}
    >
      {roles.map((role) => (
        <motion.span
          key={role}
          variants={{
            hidden: { opacity: 0, scale: 0.8, y: 10 },
            visible: { opacity: 1, scale: 1, y: 0 },
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="px-5 py-2 rounded-full text-sm font-medium"
          style={{
            background: "rgba(251,146,60,0.08)",
            color: "#92400E",
            border: "1px solid rgba(251,146,60,0.15)",
          }}
        >
          {role}
        </motion.span>
      ))}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  FX: Scroll progress with warm gradient                             */
/* ------------------------------------------------------------------ */
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-50 origin-left"
      style={{ scaleX, background: "linear-gradient(90deg, #F97316, #F43F5E, #8B5CF6)" }}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  Project card — compact grid variant with 3D tilt                   */
/* ------------------------------------------------------------------ */
function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), { stiffness: 300, damping: 30 })

  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }, [x, y])

  const onLeave = useCallback(() => { x.set(0); y.set(0) }, [x, y])
  const isFeatured = project.featured

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.97 }}
      transition={{
        opacity: { duration: 0.3, delay: index * 0.06 },
        y: { type: "spring", stiffness: 300, damping: 28, delay: index * 0.06 },
        scale: { duration: 0.3, delay: index * 0.06 },
        layout: { type: "spring", stiffness: 300, damping: 30 },
      }}
      className={isFeatured ? "md:col-span-2" : ""}
    >
      <Link href={project.slug}>
        <motion.div
          ref={ref}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          style={{ rotateX, rotateY, transformPerspective: 1200, borderColor: "rgba(180,83,9,0.08)" }}
          className="group relative cursor-pointer h-full rounded-[1.25rem] border-[0.75px] p-1.5 md:rounded-[1.5rem] md:p-2"
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={120}
            inactiveZone={0.01}
            borderWidth={3}
          />
          <div
            className={`relative rounded-xl md:rounded-2xl overflow-hidden transition-shadow duration-500 h-full ${
              isFeatured ? "p-7 md:p-9 md:flex md:items-center md:gap-10" : "p-5 md:p-7"
            }`}
            style={{
              background: "linear-gradient(145deg, rgba(255,252,247,0.9), rgba(255,248,240,0.8))",
              backdropFilter: "blur(20px)",
              boxShadow: "0 2px 8px rgba(180,83,9,0.06), 0 8px 32px rgba(180,83,9,0.04), inset 0 1px 0 rgba(255,255,255,0.8)",
              border: "1px solid rgba(180,83,9,0.06)",
            }}
          >

            {/* Featured: color accent block */}
            {isFeatured && (
              <div
                className="hidden md:flex items-center justify-center rounded-xl flex-shrink-0"
                style={{
                  width: 180,
                  height: 140,
                  background: `linear-gradient(135deg, ${project.color}15, ${project.color}08)`,
                  border: `1px solid ${project.color}20`,
                }}
              >
                <span
                  className="text-5xl font-black select-none"
                  style={{ fontFamily: "var(--font-heading)", color: `${project.color}30` }}
                >
                  {project.title.slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}

            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: project.color }}
                />
                <span className="text-[11px] font-mono tracking-wider" style={{ color: "rgba(0,0,0,0.3)" }}>{project.year}</span>
                <span style={{ color: "rgba(0,0,0,0.12)" }}>|</span>
                <span className="text-[11px] font-mono" style={{ color: "rgba(0,0,0,0.3)" }}>{project.type}</span>
              </div>

              <h3
                className={`font-bold mb-2 transition-colors duration-300 ${
                  isFeatured ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
                }`}
                style={{ fontFamily: "var(--font-heading)", color: "#1a1a1a" }}
              >
                {project.title}
              </h3>
              <p
                className={`leading-relaxed mb-4 ${isFeatured ? "text-sm max-w-lg" : "text-[13px] max-w-sm"}`}
                style={{ color: "rgba(0,0,0,0.45)" }}
              >
                {project.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.slice(0, isFeatured ? 4 : 3).map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-medium"
                      style={{
                        background: "rgba(251,146,60,0.05)",
                        color: "rgba(120,60,0,0.5)",
                        border: "1px solid rgba(251,146,60,0.1)",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <motion.div
                  className="flex items-center gap-1 text-xs font-medium"
                  style={{ color: "rgba(0,0,0,0.2)" }}
                >
                  <span className="group-hover:opacity-100 opacity-0 transition-opacity duration-300">View</span>
                  <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </motion.div>
              </div>
            </div>

            {/* Hover glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{ background: `radial-gradient(400px circle at 80% 0%, ${project.color}08, transparent 60%)` }}
            />
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Filter tabs for project categories                                 */
/* ------------------------------------------------------------------ */
const categories = ["All", "Games", "Tools", "Web", "Academic"] as const
type Category = typeof categories[number]

const categoryMap: Record<string, Category[]> = {
  "/codex": ["Games"],
  "/backrooms": ["Games"],
  "/brenda": ["Web"],
  "/filestudio": ["Tools"],
  "/godotmetrics": ["Tools"],
  "/spss": ["Tools"],
  "/semester6": ["Academic"],
  "/mcp": ["Tools"],
}

function FilterTabs({ active, onChange }: { active: Category; onChange: (c: Category) => void }) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-full" style={{ background: "rgba(251,146,60,0.06)", border: "1px solid rgba(251,146,60,0.1)" }}>
      {categories.map((cat) => (
        <motion.button
          key={cat}
          onClick={() => onChange(cat)}
          className="relative px-4 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors duration-200"
          style={{ color: active === cat ? "#1a1a1a" : "rgba(0,0,0,0.35)" }}
          whileTap={{ scale: 0.97 }}
        >
          {active === cat && (
            <motion.div
              layoutId="activeFilter"
              className="absolute inset-0 rounded-full"
              style={{
                background: "rgba(255,252,247,0.95)",
                boxShadow: "0 1px 4px rgba(180,83,9,0.08), 0 0 0 1px rgba(251,146,60,0.08)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{cat}</span>
        </motion.button>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  FX: Infinite marquee — warm                                        */
/* ------------------------------------------------------------------ */
function Marquee({ items, speed = 30 }: { items: string[]; speed?: number }) {
  const content = [...items, ...items, ...items]
  return (
    <div className="overflow-hidden py-5" style={{ borderTop: "1px solid rgba(251,146,60,0.1)", borderBottom: "1px solid rgba(251,146,60,0.1)" }}>
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: [0, -(items.length * 140)] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {content.map((item, i) => (
          <span key={i} className="text-sm font-mono flex items-center gap-3" style={{ color: "rgba(0,0,0,0.2)" }}>
            <span className="w-1 h-1 rounded-full" style={{ background: "rgba(251,146,60,0.4)" }} />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
const projects = [
  {
    slug: "/codex",
    title: "Codex",
    description: "2D anime platformer built in Godot 4 with quest system, cat companion, boss fights, portals, and day/night cycle. 11 autoloads, 9 player states, 24 shaders.",
    tags: ["Godot 4", "GDScript", "LDtk", "GLSL"],
    color: "#7C3AED",
    year: "2025",
    type: "Game Development",
    featured: true,
  },
  {
    slug: "/backrooms",
    title: "The Backrooms",
    description: "First-person horror game in Unreal Engine 5. Procedurally-generated liminal spaces, entity AI, VHS camcorder HUD, and found-footage atmosphere.",
    tags: ["Unreal Engine 5", "C++", "Blueprints"],
    color: "#CA8A04",
    year: "2025",
    type: "Game Development",
    featured: true,
  },
  {
    slug: "/brenda",
    title: "Brenda's Hairstyle",
    description: "Complete website redesign for a local hair salon in Hoensbroek, NL. Warm Soft UI design system, animated interactions, and mobile-first approach.",
    tags: ["Next.js", "Framer Motion", "Tailwind CSS"],
    color: "#EC4899",
    year: "2026",
    type: "Website Redesign",
    featured: false,
  },
  {
    slug: "/filestudio",
    title: "FileStudio",
    description: "Browser-based CLS classification analysis tool for CBS. Hierarchical tree navigation, dataset detection, column mapping, and auto-numbering.",
    tags: ["HTML", "JavaScript", "Single-File"],
    color: "#1E40AF",
    year: "2026",
    type: "Data Tool",
    featured: false,
  },
  {
    slug: "/godotmetrics",
    title: "GodotMetrics",
    description: "Telemetry and analytics plugin for Godot 4. Privacy-respecting player behavior tracking with Supabase backend and analytics dashboard.",
    tags: ["Godot 4", "GDScript", "Supabase"],
    color: "#22C55E",
    year: "2026",
    type: "Developer Tool",
    featured: false,
  },
  {
    slug: "/spss",
    title: "SPSS-Migratie",
    description: "Automated migration toolkit for CBS converting legacy SPSS syntax to modern Python. PowerShell orchestration, validation reports, and batch processing.",
    tags: ["Python", "PowerShell", "SPSS"],
    color: "#F97316",
    year: "2026",
    type: "Enterprise Tool",
    featured: false,
  },
  {
    slug: "/semester6",
    title: "Semester 6",
    description: "HBO-ICT graduation portfolio using DOT Framework research methodology. Document analysis, landscape analysis, interviews, and sprint documentation.",
    tags: ["DOT Framework", "Research", "Documentation"],
    color: "#2563EB",
    year: "2026",
    type: "Academic",
    featured: false,
  },
  {
    slug: "/mcp",
    title: "MCP Servers",
    description: "Custom Model Context Protocol servers extending AI coding assistants with 48+ tools for Unreal Engine 5, Blender, and game development.",
    tags: ["Python", "C++", "MCP", "UE5"],
    color: "#8B5CF6",
    year: "2025",
    type: "AI Tooling",
    featured: false,
  },
]

const skills = [
  "React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion",
  "Node.js", "Godot 4", "GDScript", "Unreal Engine 5", "C++",
  "Python", "PowerShell", "Git", "Vercel", "Supabase",
  "LDtk", "GLSL Shaders", "MCP Protocol", "Blueprints",
]

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */
export default function Portfolio() {
  const [mounted, setMounted] = useState(false)
  const [activeCategory, setActiveCategory] = useState<Category>("All")
  useEffect(() => setMounted(true), [])

  const filteredProjects = activeCategory === "All"
    ? projects
    : projects.filter(p => categoryMap[p.slug]?.includes(activeCategory))

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: "linear-gradient(180deg, #FEF0E1 0%, #FFF5EB 20%, #FFF8F2 40%, #FFFAF5 60%, #FDF6EE 80%, #FAF0E4 100%)",
        color: "#1a1a1a",
        fontFamily: "var(--font-body)",
      }}
    >
      {mounted && <CursorGlow />}
      <ScrollProgress />

      {/* ---- HERO ---- */}
      <header className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        <HeroMesh />
        <FloatingOrbs />

        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 md:px-12 py-6 z-10"
        >
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#F97316" }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#F97316" }} />
            </span>
            <span className="text-xs font-mono" style={{ color: "rgba(0,0,0,0.35)" }}>Available for work</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://github.com/zyynx-hub" target="_blank" rel="noopener" className="transition-colors" style={{ color: "rgba(0,0,0,0.25)" }}>
              <Github size={18} />
            </a>
            <a href="mailto:robin@example.com" className="transition-colors" style={{ color: "rgba(0,0,0,0.25)" }}>
              <Mail size={18} />
            </a>
          </div>
        </motion.div>

        {/* Main content */}
        <div className="text-center relative z-10">
          {/* Subtitle fades in first */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="text-sm font-mono tracking-[0.2em] uppercase mb-6"
            style={{ color: "#C2410C" }}
          >
            Creative Developer
          </motion.p>

          {/* Animated name */}
          <AnimatedName />

          {/* Role tags */}
          <RoleTags />

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.7 }}
            className="mt-8 text-lg max-w-md mx-auto leading-relaxed"
            style={{ color: "rgba(0,0,0,0.4)" }}
          >
            Building digital experiences that feel alive.
            <br />
            <span style={{ color: "rgba(0,0,0,0.6)" }}>Based in the Netherlands.</span>
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9, duration: 0.7 }}
            className="mt-10 flex items-center justify-center gap-4"
          >
            <motion.a
              href="#work"
              className="group flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-white cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #F97316, #EA580C)",
                boxShadow: "0 4px 20px rgba(249,115,22,0.25)",
              }}
              whileHover={{ scale: 1.05, boxShadow: "0 8px 30px rgba(249,115,22,0.35)" }}
              whileTap={{ scale: 0.97 }}
            >
              View Work <ArrowUpRight size={14} className="group-hover:rotate-45 transition-transform duration-300" />
            </motion.a>
            <motion.a
              href="mailto:robin@example.com"
              className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold cursor-pointer transition-all"
              style={{
                border: "1px solid rgba(0,0,0,0.1)",
                color: "rgba(0,0,0,0.5)",
              }}
              whileHover={{ scale: 1.05, borderColor: "rgba(249,115,22,0.3)", color: "#EA580C" }}
              whileTap={{ scale: 0.97 }}
            >
              Get in Touch
            </motion.a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute bottom-10 flex flex-col items-center gap-3"
        >
          <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: "rgba(0,0,0,0.2)" }}>Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown size={16} style={{ color: "rgba(0,0,0,0.15)" }} />
          </motion.div>
        </motion.div>
      </header>

      {/* ---- SKILL MARQUEE ---- */}
      <Marquee items={skills} speed={40} />

      {/* ---- WORK ---- */}
      <section id="work" className="max-w-6xl mx-auto px-6 py-32">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: "#C2410C" }}>Portfolio</p>
              <h2
                className="text-4xl md:text-5xl font-bold tracking-tight"
                style={{ fontFamily: "var(--font-heading)", color: "#1a1a1a" }}
              >
                Selected <span style={{ color: "rgba(0,0,0,0.2)" }}>Work</span>
              </h2>
            </div>
            <FilterTabs active={activeCategory} onChange={setActiveCategory} />
          </div>
        </Reveal>

        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {filteredProjects.map((p, i) => (
              <ProjectCard key={p.slug} project={p} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Project count */}
        <motion.p
          className="text-center mt-8 text-xs font-mono"
          style={{ color: "rgba(0,0,0,0.2)" }}
          key={activeCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""}
          {activeCategory !== "All" && ` in ${activeCategory}`}
        </motion.p>
      </section>

      {/* ---- ABOUT STRIP ---- */}
      <section
        className="py-24"
        style={{ borderTop: "1px solid rgba(251,146,60,0.1)", borderBottom: "1px solid rgba(251,146,60,0.1)" }}
      >
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Reveal>
            <p className="text-2xl md:text-3xl font-light leading-relaxed" style={{ color: "rgba(0,0,0,0.4)" }}>
              I craft{" "}
              <span className="font-medium" style={{ color: "#1a1a1a" }}>
                fast, accessible, and beautiful
              </span>{" "}
              web experiences — from concept to deployment. Every pixel has a purpose.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---- FOOTER ---- */}
      <footer className="max-w-5xl mx-auto px-6 py-20">
        <Reveal>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "#1a1a1a" }}>
                Let&apos;s work together
                <span style={{ color: "#F97316" }}>.</span>
              </h3>
              <p className="text-sm mt-2" style={{ color: "rgba(0,0,0,0.35)" }}>
                Available for freelance projects and collaborations.
              </p>
            </div>
            <motion.a
              href="mailto:robin@example.com"
              className="group flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold cursor-pointer transition-all"
              style={{
                border: "1px solid rgba(0,0,0,0.1)",
                color: "rgba(0,0,0,0.5)",
              }}
              whileHover={{ scale: 1.05, boxShadow: "0 4px 20px rgba(249,115,22,0.1)", borderColor: "rgba(249,115,22,0.3)" }}
            >
              <Mail size={16} /> robin@example.com
            </motion.a>
          </div>
        </Reveal>
        <div
          className="mt-16 pt-8 flex items-center justify-between text-xs font-mono"
          style={{ borderTop: "1px solid rgba(251,146,60,0.1)", color: "rgba(0,0,0,0.2)" }}
        >
          <span>&copy; {new Date().getFullYear()} Robin</span>
          <span>Built with Next.js + Framer Motion</span>
        </div>
      </footer>
    </div>
  )
}

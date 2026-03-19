"use client"

import { useRef, useCallback, useEffect, useState } from "react"
import Link from "next/link"
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useInView,
  AnimatePresence,
} from "framer-motion"
import { ArrowUpRight, Github, Linkedin, Mail, ExternalLink } from "lucide-react"

/* ------------------------------------------------------------------ */
/*  FX: Cursor spotlight that follows mouse                            */
/* ------------------------------------------------------------------ */
function CursorSpotlight() {
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
          ([px, py]) => `radial-gradient(600px circle at ${px}px ${py}px, rgba(34,197,94,0.04), transparent 60%)`
        ),
      }}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  FX: Animated grain overlay                                         */
/* ------------------------------------------------------------------ */
function GrainOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-40 opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
      }}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  FX: Character-by-character spring reveal                           */
/* ------------------------------------------------------------------ */
function CharReveal({ text, className = "", delay = 0 }: {
  text: string; className?: string; delay?: number
}) {
  return (
    <span className={className}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 40, rotateX: -90, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.6,
            delay: delay + i * 0.04,
            ease: [0.25, 0.4, 0.25, 1],
          }}
          className="inline-block"
          style={{ transformOrigin: "bottom" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  FX: Scroll-triggered reveal                                        */
/* ------------------------------------------------------------------ */
function Reveal({ children, className = "", delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  FX: 3D tilt project card                                           */
/* ------------------------------------------------------------------ */
function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 })

  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }, [x, y])

  const onLeave = useCallback(() => { x.set(0); y.set(0) }, [x, y])

  return (
    <Reveal delay={index * 0.1}>
      <Link href={project.slug}>
        <motion.div
          ref={ref}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          style={{ rotateX, rotateY, transformPerspective: 1000 }}
          className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-1 cursor-pointer"
          whileHover={{ borderColor: "rgba(255,255,255,0.12)" }}
        >
          {/* Inner card */}
          <div className="relative rounded-xl bg-gradient-to-br from-white/[0.04] to-transparent p-8 md:p-10 overflow-hidden">
            {/* Project number */}
            <span className="absolute top-6 right-6 text-[80px] font-black leading-none text-white/[0.03] select-none" style={{ fontFamily: "var(--font-heading)" }}>
              {String(index + 1).padStart(2, "0")}
            </span>

            {/* Color accent line */}
            <motion.div
              className="absolute top-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-700"
              style={{ background: project.color }}
            />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: project.color, boxShadow: `0 0 12px ${project.color}60` }} />
                <span className="text-xs text-white/30 font-mono tracking-wider">{project.year}</span>
                <span className="text-xs text-white/20">—</span>
                <span className="text-xs text-white/30 font-mono">{project.type}</span>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-white/90 mb-2 group-hover:text-white transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                {project.title}
              </h3>
              <p className="text-white/40 text-sm mb-6 max-w-md leading-relaxed">
                {project.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((t) => (
                    <span key={t} className="px-3 py-1 rounded-full text-[11px] font-medium border border-white/[0.08] text-white/40 bg-white/[0.02]">
                      {t}
                    </span>
                  ))}
                </div>
                <motion.div
                  className="flex items-center gap-1 text-sm font-medium text-white/30 group-hover:text-white/70 transition-colors"
                  whileHover={{ x: 4 }}
                >
                  View <ArrowUpRight size={14} />
                </motion.div>
              </div>
            </div>

            {/* Hover glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{ background: `radial-gradient(400px circle at 80% 20%, ${project.color}10, transparent 60%)` }}
            />
          </div>
        </motion.div>
      </Link>
    </Reveal>
  )
}

/* ------------------------------------------------------------------ */
/*  FX: Infinite marquee                                               */
/* ------------------------------------------------------------------ */
function Marquee({ items, speed = 30 }: { items: string[]; speed?: number }) {
  const content = [...items, ...items, ...items]
  return (
    <div className="overflow-hidden py-6 border-y border-white/[0.06]">
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: [0, -(items.length * 160)] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {content.map((item, i) => (
          <span key={i} className="text-sm font-mono text-white/20 flex items-center gap-3">
            <span className="w-1 h-1 rounded-full bg-green-500/40" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  FX: Scroll progress                                                */
/* ------------------------------------------------------------------ */
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-50 origin-left"
      style={{ scaleX, background: "linear-gradient(90deg, #22C55E, #3B82F6)" }}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  FX: Animated status indicator                                      */
/* ------------------------------------------------------------------ */
function StatusDot() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
const projects = [
  {
    slug: "/brenda",
    title: "Brenda's Hairstyle",
    description: "Complete website redesign for a local hair salon in Hoensbroek, NL. Warm Soft UI design system, animated interactions, and mobile-first approach.",
    tags: ["Next.js", "Framer Motion", "Tailwind CSS"],
    color: "#EC4899",
    year: "2026",
    type: "Website Redesign",
  },
]

const skills = [
  "React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion",
  "Node.js", "Godot Engine", "GDScript", "Unreal Engine 5", "C++",
  "Python", "Git", "Vercel", "Figma", "Three.js",
]

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */
export default function Portfolio() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="min-h-screen text-white relative" style={{ background: "#0a0a0b", fontFamily: "var(--font-body)" }}>
      {mounted && <CursorSpotlight />}
      <GrainOverlay />
      <ScrollProgress />

      {/* ---- HERO ---- */}
      <header className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Animated gradient orbs in background */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-20"
          style={{ background: "radial-gradient(circle, #22C55E 0%, transparent 70%)", top: "20%", left: "10%" }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-10"
          style={{ background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)", bottom: "10%", right: "10%" }}
          animate={{ x: [0, -20, 0], y: [0, 30, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />

        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 md:px-12 py-6"
        >
          <div className="flex items-center gap-3">
            <StatusDot />
            <span className="text-xs font-mono text-white/40">Available for work</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://github.com/zyynx-hub" target="_blank" rel="noopener" className="text-white/30 hover:text-white/70 transition-colors">
              <Github size={18} />
            </a>
            <a href="mailto:robin@example.com" className="text-white/30 hover:text-white/70 transition-colors">
              <Mail size={18} />
            </a>
          </div>
        </motion.div>

        {/* Main content */}
        <div className="text-center relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-sm font-mono text-green-400/70 tracking-widest uppercase mb-6"
          >
            Web Developer & Designer
          </motion.p>

          <h1 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter leading-[0.85]" style={{ fontFamily: "var(--font-heading)" }}>
            <CharReveal text="Robin" delay={0.4} />
            <span className="text-green-500">
              <CharReveal text="." delay={0.7} />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="mt-8 text-lg text-white/30 max-w-md mx-auto leading-relaxed"
          >
            Building digital experiences that feel alive.
            <br />
            <span className="text-white/50">Based in the Netherlands.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="mt-10 flex items-center justify-center gap-4"
          >
            <motion.a
              href="#work"
              className="group flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold bg-green-500 text-black cursor-pointer"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(34,197,94,0.3)" }}
              whileTap={{ scale: 0.97 }}
            >
              View Work <ArrowUpRight size={14} className="group-hover:rotate-45 transition-transform duration-300" />
            </motion.a>
            <motion.a
              href="mailto:robin@example.com"
              className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all cursor-pointer"
              whileHover={{ scale: 1.05 }}
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
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-mono text-white/20 tracking-widest uppercase">Scroll</span>
          <motion.div
            className="w-[1px] h-8 bg-gradient-to-b from-white/20 to-transparent"
            animate={{ scaleY: [1, 0.5, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </header>

      {/* ---- SKILL MARQUEE ---- */}
      <Marquee items={skills} speed={40} />

      {/* ---- WORK ---- */}
      <section id="work" className="max-w-5xl mx-auto px-6 py-32">
        <Reveal>
          <div className="flex items-end justify-between mb-16">
            <div>
              <p className="text-xs font-mono text-green-400/60 tracking-widest uppercase mb-3">Portfolio</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                Selected <span className="text-white/30">Work</span>
              </h2>
            </div>
            <p className="text-sm text-white/20 font-mono hidden md:block">
              {String(projects.length).padStart(2, "0")} projects
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>

        {projects.length <= 1 && (
          <Reveal delay={0.3}>
            <div className="mt-12 text-center py-16 rounded-2xl border border-dashed border-white/[0.06]">
              <p className="text-white/20 text-sm font-mono">More projects coming soon.</p>
            </div>
          </Reveal>
        )}
      </section>

      {/* ---- ABOUT STRIP ---- */}
      <section className="border-y border-white/[0.06] py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Reveal>
            <p className="text-2xl md:text-3xl font-light text-white/50 leading-relaxed">
              I craft <span className="text-white/90 font-medium">fast, accessible, and beautiful</span> web
              experiences — from concept to deployment. Every pixel has a purpose.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---- FOOTER ---- */}
      <footer className="max-w-5xl mx-auto px-6 py-20">
        <Reveal>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                Let&apos;s work together<span className="text-green-500">.</span>
              </h3>
              <p className="text-white/30 text-sm mt-2">Available for freelance projects and collaborations.</p>
            </div>
            <motion.a
              href="mailto:robin@example.com"
              className="group flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border border-white/10 text-white/60 hover:text-white hover:border-green-500/30 transition-all cursor-pointer"
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(34,197,94,0.1)" }}
            >
              <Mail size={16} /> robin@example.com
            </motion.a>
          </div>
        </Reveal>
        <div className="mt-16 pt-8 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/20 font-mono">
          <span>&copy; {new Date().getFullYear()} Robin</span>
          <span>Built with Next.js + Framer Motion</span>
        </div>
      </footer>
    </div>
  )
}

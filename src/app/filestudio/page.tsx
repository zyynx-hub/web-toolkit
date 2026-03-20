"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion"
import {
  FileText, Database, Search, Hash, Upload, Download,
  ArrowRight, ChevronRight, FolderTree, Table, Filter,
  Layers, BarChart3, CheckCircle2, ExternalLink
} from "lucide-react"

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
      initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  FX: Word-by-word text reveal                                        */
/* ------------------------------------------------------------------ */
function TextReveal({ text, className = "", delay = 0 }: {
  text: string; className?: string; delay?: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const words = text.split(" ")
  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.5, delay: delay + i * 0.08, ease: [0.25, 0.4, 0.25, 1] }}
          className="inline-block mr-[0.3em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  FX: Spring-animated counter                                         */
/* ------------------------------------------------------------------ */
function Counter({ target, suffix = "", prefix = "", className = "" }: {
  target: number; suffix?: string; prefix?: string; className?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const motionVal = useMotionValue(0)
  const springVal = useSpring(motionVal, { stiffness: 40, damping: 20 })
  const [display, setDisplay] = useState("0")

  useEffect(() => {
    if (inView) motionVal.set(target)
  }, [inView, target, motionVal])

  useEffect(() => {
    const unsub = springVal.on("change", (v) => {
      setDisplay(Math.round(v).toLocaleString())
    })
    return unsub
  }, [springVal])

  return (
    <span ref={ref} className={className}>
      {prefix}{display}{suffix}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  FX: 3D tilt card                                                    */
/* ------------------------------------------------------------------ */
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 })

  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }, [x, y])

  const onLeave = useCallback(() => { x.set(0); y.set(0) }, [x, y])

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  FX: Blinking cursor                                                 */
/* ------------------------------------------------------------------ */
function BlinkingCursor({ color = "#1E40AF" }: { color?: string }) {
  return (
    <motion.span
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="inline-block w-[3px] h-[1em] ml-1 align-middle rounded-sm"
      style={{ backgroundColor: color }}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  FX: Shimmer loading line                                            */
/* ------------------------------------------------------------------ */
function ShimmerLine({ width = "100%", delay = 0 }: { width?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className="h-2.5 rounded-full fs-shimmer"
      style={{
        width,
        background: "linear-gradient(90deg, #DBEAFE 0%, #93C5FD 50%, #DBEAFE 100%)",
        backgroundSize: "200% 100%",
        animation: `fs-shimmer 2s ease-in-out infinite ${delay}s`,
      }}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  DATA                                                                */
/* ------------------------------------------------------------------ */
const features = [
  {
    icon: FolderTree,
    title: "Tree Navigation",
    desc: "Browse the full CLS hierarchy with expandable nodes. Jump to any classification level instantly.",
    stat: "5 levels deep",
  },
  {
    icon: Database,
    title: "Dataset Detection",
    desc: "Automatically detects column groups and row blocks in pasted data. Multi-dataset support.",
    stat: "Auto-detect",
  },
  {
    icon: Table,
    title: "Column Mapping",
    desc: "Idiot-proof column mapping UX with live preview. Map your data to CLS fields in seconds.",
    stat: "Live preview",
  },
  {
    icon: Hash,
    title: "Auto-Numbering",
    desc: "Hierarchical auto-numbering with infinite depth support. Processed set prevents recursion.",
    stat: "Infinite depth",
  },
  {
    icon: Search,
    title: "Search & Filter",
    desc: "Full-text search across all 19,000+ classifications. Filter by level, category, or keyword.",
    stat: "< 50ms",
  },
  {
    icon: Filter,
    title: "Smart Export",
    desc: "Export filtered results to CSV or clipboard. Preserves hierarchy structure in output.",
    stat: "CSV + Clipboard",
  },
]

const steps = [
  {
    icon: Upload,
    title: "Upload",
    desc: "Paste your CLS data or open a file. FileStudio auto-detects the format.",
    color: "#3B82F6",
  },
  {
    icon: BarChart3,
    title: "Analyze",
    desc: "Browse the hierarchy, map columns, search classifications. All in-browser.",
    color: "#1E40AF",
  },
  {
    icon: Download,
    title: "Export",
    desc: "Export your analysis as CSV, copy to clipboard, or save for later.",
    color: "#F59E0B",
  },
]

const stats = [
  { value: 19000, suffix: "+", label: "Classifications" },
  { value: 5, suffix: "", label: "Hierarchy Levels" },
  { value: 0, suffix: "", label: "Dependencies", prefix: "" },
  { value: 1, suffix: "", label: "Single File" },
]

/* ------------------------------------------------------------------ */
/*  Mock Dashboard Tree                                                 */
/* ------------------------------------------------------------------ */
const treeData = [
  { level: 0, label: "A — Landbouw, bosbouw en visserij", expanded: true },
  { level: 1, label: "01 — Landbouw, jacht en dienstverlening", expanded: true },
  { level: 2, label: "01.1 — Teelt van eenjarige gewassen", expanded: false },
  { level: 2, label: "01.2 — Teelt van meerjarige gewassen", expanded: false },
  { level: 2, label: "01.3 — Teelt van planten voor vermeerdering", expanded: false },
  { level: 1, label: "02 — Bosbouw en winning van hout", expanded: false },
  { level: 1, label: "03 — Visserij en aquacultuur", expanded: false },
  { level: 0, label: "B — Winning van delfstoffen", expanded: false },
  { level: 0, label: "C — Industrie", expanded: false },
]

function MockDashboard() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
      className="rounded-2xl overflow-hidden shadow-2xl border border-[#DBEAFE]"
      style={{ background: "#FFFFFF" }}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#DBEAFE]" style={{ background: "#EFF6FF" }}>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <span className="text-xs ml-2" style={{ fontFamily: "var(--fs-font-heading)", color: "#64748B" }}>
          FileStudio — CLS Browser
        </span>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-[#DBEAFE]">
        <div className="flex items-center gap-2 flex-1 px-3 py-1.5 rounded-lg" style={{ background: "#F1F5F9", border: "1px solid #E2E8F0" }}>
          <Search className="w-3.5 h-3.5 text-[#94A3B8]" />
          <span className="text-xs text-[#94A3B8]">Search classifications...</span>
        </div>
        <div className="flex gap-1.5">
          {["All", "A-F", "G-N"].map((f) => (
            <button
              key={f}
              className="text-[10px] px-2.5 py-1 rounded-md font-medium transition-colors"
              style={{
                background: f === "All" ? "#1E40AF" : "transparent",
                color: f === "All" ? "white" : "#64748B",
                border: f === "All" ? "none" : "1px solid #E2E8F0",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] divide-x divide-[#DBEAFE]">
        {/* Tree panel */}
        <div className="p-4 space-y-1">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-3">Classification Tree</div>
          {treeData.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
              className="flex items-center gap-1.5 py-1 cursor-pointer hover:bg-[#F1F5F9] rounded px-1 transition-colors"
              style={{ paddingLeft: `${item.level * 16 + 4}px` }}
            >
              <ChevronRight
                className="w-3 h-3 text-[#94A3B8] transition-transform"
                style={{ transform: item.expanded ? "rotate(90deg)" : "rotate(0deg)" }}
              />
              <span className="text-[11px]" style={{ color: item.level === 0 ? "#1E40AF" : item.level === 1 ? "#3B82F6" : "#64748B", fontWeight: item.level < 2 ? 600 : 400 }}>
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Detail panel */}
        <div className="p-4 hidden md:block">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-3">Details</div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
            className="space-y-3"
          >
            <div className="text-sm font-semibold" style={{ color: "#1E40AF" }}>01 — Landbouw, jacht en dienstverlening</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                ["Level", "2-digit SBI"],
                ["Parent", "A — Landbouw"],
                ["Children", "7 subgroups"],
                ["Last Updated", "2024-Q4"],
              ].map(([label, value]) => (
                <div key={label} className="p-2 rounded-lg" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                  <div className="text-[9px] uppercase tracking-wider text-[#94A3B8] mb-0.5">{label}</div>
                  <div className="text-xs font-medium" style={{ color: "#334155" }}>{value}</div>
                </div>
              ))}
            </div>
            <div className="space-y-2 pt-2">
              <ShimmerLine width="100%" delay={1} />
              <ShimmerLine width="85%" delay={1.2} />
              <ShimmerLine width="70%" delay={1.4} />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Flow Step Connector                                                 */
/* ------------------------------------------------------------------ */
function FlowConnector({ active }: { active: boolean }) {
  return (
    <div className="hidden md:flex items-center justify-center w-16 lg:w-24">
      <svg width="100%" height="24" viewBox="0 0 80 24">
        <motion.line
          x1="0" y1="12" x2="60" y2="12"
          stroke={active ? "#3B82F6" : "#CBD5E1"}
          strokeWidth="2"
          strokeDasharray="6 4"
          initial={{ pathLength: 0 }}
          animate={active ? { pathLength: 1 } : {}}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
        <motion.polygon
          points="60,6 72,12 60,18"
          fill={active ? "#3B82F6" : "#CBD5E1"}
          initial={{ opacity: 0 }}
          animate={active ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.3 }}
        />
      </svg>
    </div>
  )
}

/* ================================================================== */
/*  PAGE                                                                */
/* ================================================================== */
export default function FileStudioPage() {
  const flowRef = useRef(null)
  const flowInView = useInView(flowRef, { once: true, margin: "-100px" })
  const [activeStep, setActiveStep] = useState(-1)

  useEffect(() => {
    if (!flowInView) return
    const timers = [
      setTimeout(() => setActiveStep(0), 300),
      setTimeout(() => setActiveStep(1), 900),
      setTimeout(() => setActiveStep(2), 1500),
    ]
    return () => timers.forEach(clearTimeout)
  }, [flowInView])

  return (
    <div className="fs-page min-h-screen">
      {/* ========== HERO ========== */}
      <section className="fs-section relative overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(#1E40AF 1px, transparent 1px), linear-gradient(90deg, #1E40AF 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />

        <div className="fs-container relative">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <Reveal delay={0}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-8"
                style={{ background: "#EFF6FF", color: "#1E40AF", border: "1px solid #DBEAFE" }}>
                <Layers className="w-3.5 h-3.5" />
                CBS Classification Tool
              </div>
            </Reveal>

            {/* Title with cursor */}
            <Reveal delay={0.1}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight" style={{ fontFamily: "var(--fs-font-heading)" }}>
                <span className="fs-gradient-text">FileStudio</span>
                <BlinkingCursor />
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-lg sm:text-xl mb-4" style={{ color: "#334155" }}>
                <TextReveal text="CLS Classification Analysis Tool" delay={0.3} />
              </p>
            </Reveal>

            <Reveal delay={0.4}>
              <p className="text-base max-w-xl mx-auto mb-10" style={{ color: "#64748B" }}>
                Browse, search, and analyze the Dutch Classificatiestelsel hierarchy.
                Zero dependencies. Runs entirely in your browser.
              </p>
            </Reveal>

            {/* CTA */}
            <Reveal delay={0.5}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white text-sm transition-shadow"
                  style={{ background: "linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)", boxShadow: "0 4px 14px rgba(30, 64, 175, 0.3)" }}
                >
                  <ExternalLink className="w-4 h-4" />
                  View Project
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all"
                  style={{ border: "2px solid #DBEAFE", color: "#1E40AF" }}
                >
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========== STATS BAR ========== */}
      <section className="border-y" style={{ borderColor: "#DBEAFE", background: "#EFF6FF" }}>
        <div className="fs-container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.1} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold fs-gradient-text" style={{ fontFamily: "var(--fs-font-heading)" }}>
                  <Counter target={s.value} suffix={s.suffix} prefix={s.prefix} />
                </div>
                <div className="text-xs mt-1" style={{ color: "#64748B" }}>{s.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section className="fs-section">
        <div className="fs-container">
          <div className="text-center mb-16">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <TextReveal text="Built for Analysts" />
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-base max-w-lg mx-auto" style={{ color: "#64748B" }}>
                Every feature designed for efficient classification work at CBS.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.1}>
                <TiltCard className="fs-card p-6 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 rounded-xl" style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)" }}>
                      <f.icon className="w-5 h-5" style={{ color: "#1E40AF" }} />
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: "#FEF3C7", color: "#92400E" }}>
                      {f.stat}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "var(--fs-font-heading)", color: "#1E3A8A" }}>
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>
                    {f.desc}
                  </p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section className="fs-section" style={{ background: "#EFF6FF" }}>
        <div className="fs-container">
          <div className="text-center mb-16">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <TextReveal text="Three Simple Steps" />
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-base max-w-lg mx-auto" style={{ color: "#64748B" }}>
                From data to insights in under a minute.
              </p>
            </Reveal>
          </div>

          <div ref={flowRef} className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0">
            {steps.map((step, i) => (
              <div key={step.title} className="contents">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={activeStep >= i ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
                  className="relative"
                >
                  <div
                    className="w-48 p-6 rounded-2xl text-center transition-shadow duration-500"
                    style={{
                      background: "white",
                      border: `2px solid ${activeStep >= i ? step.color : "#E2E8F0"}`,
                      boxShadow: activeStep >= i ? `0 0 24px ${step.color}20` : "none",
                    }}
                  >
                    {/* Step number */}
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold text-white"
                      style={{ background: step.color }}
                    >
                      {i + 1}
                    </div>
                    <step.icon className="w-6 h-6 mx-auto mb-2" style={{ color: step.color }} />
                    <h3 className="text-sm font-bold mb-1" style={{ color: "#1E3A8A" }}>{step.title}</h3>
                    <p className="text-xs" style={{ color: "#64748B" }}>{step.desc}</p>
                  </div>
                </motion.div>
                {i < steps.length - 1 && <FlowConnector active={activeStep > i} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TECH STACK ========== */}
      <section className="fs-section">
        <div className="fs-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Reveal>
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                  <TextReveal text="Zero Dependencies" />
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-base mb-8" style={{ color: "#64748B" }}>
                  FileStudio is a single HTML file. No build step, no npm install, no server needed.
                  Open it in any browser and start analyzing.
                </p>
              </Reveal>
              <div className="space-y-4">
                {[
                  { label: "Pure HTML/JS/CSS", desc: "No frameworks, no transpilation" },
                  { label: "Single-file architecture", desc: "One .html file, everything included" },
                  { label: "Works offline", desc: "No server or internet required" },
                  { label: "Government-ready", desc: "Runs on locked-down workstations" },
                ].map((item, i) => (
                  <Reveal key={item.label} delay={0.3 + i * 0.1}>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#22C55E" }} />
                      <div>
                        <div className="text-sm font-semibold" style={{ color: "#1E3A8A" }}>{item.label}</div>
                        <div className="text-xs" style={{ color: "#64748B" }}>{item.desc}</div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal delay={0.3}>
              {/* Code block */}
              <div className="rounded-xl overflow-hidden" style={{ background: "#1E293B", border: "1px solid #334155" }}>
                <div className="flex items-center gap-2 px-4 py-2.5 border-b" style={{ borderColor: "#334155" }}>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                  </div>
                  <span className="text-[10px] text-[#64748B] ml-2 font-mono">file-studio.html</span>
                </div>
                <div className="p-4 text-xs font-mono leading-6 overflow-x-auto" style={{ color: "#CBD5E1" }}>
                  <div><span style={{ color: "#7DD3FC" }}>&lt;!DOCTYPE</span> <span style={{ color: "#F9A8D4" }}>html</span><span style={{ color: "#7DD3FC" }}>&gt;</span></div>
                  <div><span style={{ color: "#7DD3FC" }}>&lt;html</span> <span style={{ color: "#F9A8D4" }}>lang</span>=<span style={{ color: "#86EFAC" }}>&quot;nl&quot;</span><span style={{ color: "#7DD3FC" }}>&gt;</span></div>
                  <div><span style={{ color: "#7DD3FC" }}>&lt;head&gt;</span></div>
                  <div className="pl-4"><span style={{ color: "#64748B" }}>{`<!-- Everything in one file -->`}</span></div>
                  <div className="pl-4"><span style={{ color: "#7DD3FC" }}>&lt;style&gt;</span> <span style={{ color: "#64748B" }}>/* 2400 lines */</span> <span style={{ color: "#7DD3FC" }}>&lt;/style&gt;</span></div>
                  <div><span style={{ color: "#7DD3FC" }}>&lt;/head&gt;</span></div>
                  <div><span style={{ color: "#7DD3FC" }}>&lt;body&gt;</span></div>
                  <div className="pl-4"><span style={{ color: "#7DD3FC" }}>&lt;script&gt;</span></div>
                  <div className="pl-8"><span style={{ color: "#C4B5FD" }}>const</span> CLS = <span style={{ color: "#FCD34D" }}>buildTree</span>(data);</div>
                  <div className="pl-8"><span style={{ color: "#C4B5FD" }}>const</span> mapped = <span style={{ color: "#FCD34D" }}>detectDataset</span>(input);</div>
                  <div className="pl-8"><span style={{ color: "#FCD34D" }}>render</span>(CLS, mapped);</div>
                  <div className="pl-4"><span style={{ color: "#7DD3FC" }}>&lt;/script&gt;</span></div>
                  <div><span style={{ color: "#7DD3FC" }}>&lt;/body&gt;</span></div>
                  <div><span style={{ color: "#7DD3FC" }}>&lt;/html&gt;</span></div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========== DEMO PREVIEW ========== */}
      <section className="fs-section" style={{ background: "#EFF6FF" }}>
        <div className="fs-container">
          <div className="text-center mb-12">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <TextReveal text="See It in Action" />
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-base max-w-lg mx-auto" style={{ color: "#64748B" }}>
                A clean, government-grade interface for navigating classification data.
              </p>
            </Reveal>
          </div>

          <div className="max-w-4xl mx-auto">
            <MockDashboard />
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="py-12 border-t" style={{ borderColor: "#DBEAFE" }}>
        <div className="fs-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5" style={{ color: "#1E40AF" }} />
              <span className="text-sm font-semibold" style={{ fontFamily: "var(--fs-font-heading)", color: "#1E3A8A" }}>
                FileStudio
              </span>
            </div>
            <p className="text-xs text-center" style={{ color: "#94A3B8" }}>
              Built for CBS (Centraal Bureau voor de Statistiek) classification workflows.
            </p>
            <div className="text-xs" style={{ color: "#94A3B8" }}>
              Single-file HTML application
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

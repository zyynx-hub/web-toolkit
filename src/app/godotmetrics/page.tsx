"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { motion, useInView, useMotionValue, useSpring } from "framer-motion"
import {
  Terminal, Shield, ExternalLink, ArrowRight, Check,
  X, Eye, EyeOff, Fingerprint, Server, ChevronRight
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
/*  FX: Spring-animated counter                                        */
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
    const unsub = springVal.on("change", (v: number) => {
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
/*  FX: Terminal typing animation (robust recursive)                   */
/* ------------------------------------------------------------------ */
const terminalLines = [
  { prefix: "$ ", text: "godot --script addons/godot_metrics/plugin.gd", color: "#F8FAFC", delay: 0 },
  { prefix: "> ", text: "Connecting to Supabase...", color: "#64748B", delay: 600 },
  { prefix: "> ", text: "Session started: uuid-7f3a9c2e", color: "#22C55E", delay: 500 },
  { prefix: "> ", text: "Tracking enabled. 0 dependencies.", color: "#4ADE80", delay: 300 },
  { prefix: "> ", text: 'Event: level_complete {level: "town", time: 142s}', color: "#7DD3FC", delay: 800 },
  { prefix: "> ", text: 'Event: item_acquired {item: "rocket_boots"}', color: "#7DD3FC", delay: 400 },
  { prefix: "> ", text: 'Event: enemy_killed {type: "slime", method: "stomp"}', color: "#7DD3FC", delay: 400 },
  { prefix: "> ", text: "3 events batched. Flushing...", color: "#FCD34D", delay: 600 },
  { prefix: "> ", text: "Sent to Supabase (23ms)", color: "#4ADE80", delay: 400 },
]

function LiveTerminal() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const [lineStates, setLineStates] = useState<number[]>(terminalLines.map(() => 0))
  const [activeLine, setActiveLine] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!inView) return
    let cancelled = false
    let lineIdx = 0
    let charIdx = 0

    function typeLine() {
      if (cancelled || lineIdx >= terminalLines.length) {
        if (!cancelled) setDone(true)
        return
      }
      const line = terminalLines[lineIdx]
      const fullText = (line.prefix || "") + line.text
      const delay = lineIdx === 0 ? 0 : (line.delay || 200)

      setTimeout(() => {
        if (cancelled) return
        setActiveLine(lineIdx)
        charIdx = 0

        const typeChar = () => {
          if (cancelled) return
          if (charIdx <= fullText.length) {
            const currentLine = lineIdx
            const currentChar = charIdx
            setLineStates((prev) => {
              const next = [...prev]
              next[currentLine] = currentChar
              return next
            })
            charIdx++
            setTimeout(typeChar, 25 + Math.random() * 15)
          } else {
            lineIdx++
            typeLine()
          }
        }
        typeChar()
      }, delay)
    }

    typeLine()
    return () => { cancelled = true }
  }, [inView])

  return (
    <div ref={ref} className="gm-terminal-body">
      {terminalLines.map((line, i) => {
        const fullText = (line.prefix || "") + line.text
        const shown = fullText.slice(0, lineStates[i])
        if (lineStates[i] === 0 && i > activeLine) return null
        return (
          <div key={i} className="flex items-center" style={{ minHeight: "1.85em" }}>
            <span style={{ color: line.color || "#22C55E" }}>{shown}</span>
            {i === activeLine && !done && lineStates[i] < fullText.length && (
              <span className="gm-cursor inline-block w-[7px] h-[1.1em] ml-0.5" style={{ background: "#22C55E" }} />
            )}
          </div>
        )
      })}
      {done && (
        <div className="flex items-center" style={{ minHeight: "1.85em" }}>
          <span style={{ color: "#22C55E" }}>$ </span>
          <span className="gm-cursor inline-block w-[7px] h-[1.1em] ml-0.5" style={{ background: "#22C55E" }} />
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  FX: Animated SVG chart                                             */
/* ------------------------------------------------------------------ */
function AnimatedChart() {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })

  const chartPath = "M 0 120 C 40 110, 60 90, 80 95 C 100 100, 120 60, 160 70 C 200 80, 220 40, 260 35 C 300 30, 320 50, 360 30 C 400 10, 420 25, 460 15 C 480 10, 500 20, 520 12"
  const fillPath = chartPath + " L 520 140 L 0 140 Z"

  return (
    <svg ref={ref} viewBox="0 0 520 140" className="w-full" style={{ height: "180px" }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22C55E" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Fill area */}
      <path
        d={fillPath}
        fill="url(#chartGrad)"
        className={`gm-chart-fill ${inView ? "gm-animate" : ""}`}
      />
      {/* Line */}
      <path
        d={chartPath}
        fill="none"
        stroke="#22C55E"
        strokeWidth="2.5"
        strokeLinecap="round"
        className={`gm-chart-line ${inView ? "gm-animate" : ""}`}
      />
      {/* Dot at end */}
      {inView && (
        <motion.circle
          cx="520" cy="12" r="4"
          fill="#22C55E"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.2, duration: 0.3 }}
        />
      )}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  FX: Event log rows that fade in                                    */
/* ------------------------------------------------------------------ */
const eventLogData = [
  { time: "14:32:01", event: "level_complete", detail: 'level: "town"', status: "OK" },
  { time: "14:32:18", event: "item_acquired", detail: 'item: "rocket_boots"', status: "OK" },
  { time: "14:33:05", event: "enemy_killed", detail: 'type: "slime"', status: "OK" },
  { time: "14:33:42", event: "player_died", detail: 'cause: "fall"', status: "OK" },
]

function EventLog() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })

  return (
    <div ref={ref}>
      {/* Header */}
      <div className="gm-event-row" style={{ borderBottom: "1px solid #21262D", color: "#64748B", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        <span>Time</span>
        <span>Event</span>
        <span>Detail</span>
        <span>Status</span>
      </div>
      {eventLogData.map((row, i) => (
        <motion.div
          key={i}
          className="gm-event-row"
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 1.5 + i * 0.3, duration: 0.5 }}
        >
          <span style={{ color: "#64748B" }}>{row.time}</span>
          <span style={{ color: "#7DD3FC" }}>{row.event}</span>
          <span style={{ color: "#94A3B8" }}>{row.detail}</span>
          <span style={{ color: "#4ADE80", fontWeight: 600 }}>{row.status}</span>
        </motion.div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  SECTION: Dashboard Preview                                         */
/* ------------------------------------------------------------------ */
function DashboardPreview() {
  const metrics = [
    { label: "Sessions Today", value: 1247, suffix: "" },
    { label: "Avg Session", value: 8, suffix: "m 32s" },
    { label: "Events / Hour", value: 3891, suffix: "" },
    { label: "Active Players", value: 342, suffix: "" },
  ]

  return (
    <div className="gm-dashboard-frame">
      {/* Browser title bar */}
      <div className="gm-dashboard-titlebar">
        <div className="gm-terminal-dots">
          <div className="gm-terminal-dot" style={{ background: "#FF5F57" }} />
          <div className="gm-terminal-dot" style={{ background: "#FEBC2E" }} />
          <div className="gm-terminal-dot" style={{ background: "#28C840" }} />
        </div>
        <div className="gm-dashboard-url">
          localhost:8080/dashboard
        </div>
      </div>

      {/* Dashboard content */}
      <div style={{ padding: "20px", background: "#0D1117" }}>
        {/* Metric cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {metrics.map((m, i) => (
            <Reveal key={m.label} delay={0.3 + i * 0.1}>
              <div className="gm-metric-card">
                <div className="gm-metric-label">{m.label}</div>
                <div className="gm-metric-value">
                  <Counter target={m.value} suffix={m.suffix} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Chart area */}
        <Reveal delay={0.7}>
          <div style={{ background: "#161B22", border: "1px solid #21262D", borderRadius: "8px", padding: "16px" }} className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <span style={{ fontSize: "12px", color: "#94A3B8", fontFamily: "var(--gm-font-heading)" }}>Sessions Over Time</span>
              <span style={{ fontSize: "11px", color: "#64748B" }}>Last 7 days</span>
            </div>
            <AnimatedChart />
          </div>
        </Reveal>

        {/* Event log */}
        <Reveal delay={1}>
          <div style={{ background: "#161B22", border: "1px solid #21262D", borderRadius: "8px", overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #21262D" }}>
              <span style={{ fontSize: "12px", color: "#94A3B8", fontFamily: "var(--gm-font-heading)" }}>Recent Events</span>
            </div>
            <EventLog />
          </div>
        </Reveal>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  SECTION: Integration Timeline                                      */
/* ------------------------------------------------------------------ */
const steps = [
  {
    num: "1",
    title: "Install",
    desc: "Drag the addons folder into your Godot project. Enable the plugin in Project Settings.",
    code: [
      { text: "res://", color: "#64748B" },
      { text: "  addons/", color: "#94A3B8" },
      { text: "    godot_metrics/", color: "#22C55E" },
      { text: "      plugin.gd", color: "#7DD3FC" },
      { text: "      TelemetryManager.gd", color: "#7DD3FC" },
      { text: "      plugin.cfg", color: "#94A3B8" },
    ],
  },
  {
    num: "2",
    title: "Configure",
    desc: "One line in your _ready() function. Point it at your Supabase project.",
    code: [
      { text: "# In any autoload or main scene", color: "#64748B" },
      { text: 'TelemetryManager.init(', color: "#F8FAFC" },
      { text: '    "https://your-project.supabase.co",', color: "#4ADE80" },
      { text: '    "your-anon-key"', color: "#4ADE80" },
      { text: ")", color: "#F8FAFC" },
    ],
  },
  {
    num: "3",
    title: "Track",
    desc: "Call track_event() anywhere in your game code. Events are batched and sent automatically.",
    code: [
      { text: "# Track anything you care about", color: "#64748B" },
      { text: 'TelemetryManager.track_event(', color: "#F8FAFC" },
      { text: '    "level_complete",', color: "#4ADE80" },
      { text: '    {"level": "town", "time": 142}', color: "#FCD34D" },
      { text: ")", color: "#F8FAFC" },
    ],
  },
]

function IntegrationTimeline() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <div ref={ref} className="gm-timeline">
      {/* Animated vertical line */}
      <motion.div
        className="gm-timeline-line"
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: 1 } : {}}
        transition={{ duration: 1.5, ease: [0.25, 0.4, 0.25, 1] }}
        style={{ transformOrigin: "top" }}
      />

      {steps.map((step, i) => (
        <Reveal key={step.num} delay={i * 0.25}>
          <div className="gm-timeline-step">
            <div className="gm-timeline-dot">{step.num}</div>
            <h3 className="text-xl font-bold mb-2" style={{ color: "#F8FAFC" }}>{step.title}</h3>
            <p className="text-sm mb-3" style={{ color: "#94A3B8" }}>{step.desc}</p>
            <div className="gm-timeline-code">
              {step.code.map((line, j) => (
                <div key={j} style={{ color: line.color }}>{line.text}</div>
              ))}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  SECTION: Before / After Comparison                                 */
/* ------------------------------------------------------------------ */
const withoutItems = [
  "Guessing why players quit at level 3",
  "No data on difficulty spikes",
  'Manual print() debugging in production',
  "Shipping updates based on gut feeling",
]

const withItems = [
  "See exact drop-off points per level",
  "Heatmaps of player deaths and retries",
  "Automated event batching and analysis",
  "Data-driven balance patches",
]

function Comparison() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Without */}
      <Reveal>
        <div className="gm-comparison-col gm-comparison-without h-full">
          <div className="flex items-center gap-2 mb-6">
            <X className="w-5 h-5" style={{ color: "#EF4444" }} />
            <span className="text-sm font-bold" style={{ color: "#EF4444", fontFamily: "var(--gm-font-heading)" }}>
              Without GodotMetrics
            </span>
          </div>
          <div className="space-y-4">
            {withoutItems.map((item, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <X className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "rgba(239, 68, 68, 0.6)" }} />
                <span className="text-sm" style={{ color: "#94A3B8" }}>{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* With */}
      <Reveal delay={0.2}>
        <div className="gm-comparison-col gm-comparison-with h-full">
          <div className="flex items-center gap-2 mb-6">
            <Check className="w-5 h-5" style={{ color: "#22C55E" }} />
            <span className="text-sm font-bold" style={{ color: "#22C55E", fontFamily: "var(--gm-font-heading)" }}>
              With GodotMetrics
            </span>
          </div>
          <div className="space-y-4">
            {withItems.map((item, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.15 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.15, type: "spring", stiffness: 300 }}
                >
                  <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#22C55E" }} />
                </motion.div>
                <span className="text-sm" style={{ color: "#CBD5E1" }}>{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  )
}

/* ================================================================== */
/*  PAGE                                                                */
/* ================================================================== */
export default function GodotMetricsPage() {
  return (
    <div className="gm-page min-h-screen">

      {/* ========== SECTION 1: HERO — SPLIT WITH LIVE TERMINAL ========== */}
      <section className="gm-section relative overflow-hidden" style={{ minHeight: "90vh", display: "flex", alignItems: "center" }}>
        {/* Background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(34,197,94,0.05) 0%, transparent 70%)" }}
        />

        <div className="gm-container relative w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Pitch */}
            <div>
              <Reveal>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono mb-6"
                  style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.2)", color: "#22C55E" }}
                >
                  <Terminal className="w-3 h-3" />
                  Godot 4 Plugin
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-[1.1]" style={{ fontFamily: "var(--gm-font-heading)" }}>
                  Know your{" "}
                  <span className="gm-gradient-text">players.</span>
                </h1>
              </Reveal>

              <Reveal delay={0.2}>
                <p className="text-lg mb-2" style={{ color: "#CBD5E1" }}>
                  Privacy-respecting telemetry for Godot 4.
                </p>
              </Reveal>

              <Reveal delay={0.25}>
                <p className="text-sm max-w-md mb-8" style={{ color: "#64748B" }}>
                  Track player sessions, custom events, deaths, and purchases.
                  Pure GDScript. Zero dependencies. Drag-and-drop install.
                </p>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.a
                    href="https://zyynx-hub.itch.io/godotmetrics"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="gm-cta-glow inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm text-black"
                    style={{ background: "linear-gradient(135deg, #22C55E 0%, #4ADE80 100%)" }}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Get on itch.io
                  </motion.a>
                  <motion.a
                    href="#integration"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm"
                    style={{ border: "1px solid #334155", color: "#CBD5E1" }}
                  >
                    See how it works
                    <ArrowRight className="w-4 h-4" />
                  </motion.a>
                </div>
              </Reveal>
            </div>

            {/* Right: Live terminal */}
            <Reveal delay={0.3}>
              <div className="gm-terminal" style={{ boxShadow: "0 0 60px rgba(34, 197, 94, 0.06)" }}>
                <div className="gm-terminal-bar">
                  <div className="gm-terminal-dots">
                    <div className="gm-terminal-dot" style={{ background: "#FF5F57" }} />
                    <div className="gm-terminal-dot" style={{ background: "#FEBC2E" }} />
                    <div className="gm-terminal-dot" style={{ background: "#28C840" }} />
                  </div>
                  <span className="text-[10px] ml-2 font-mono" style={{ color: "#64748B" }}>terminal -- godot</span>
                </div>
                <LiveTerminal />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========== SECTION 2: DASHBOARD PREVIEW ========== */}
      <section className="gm-section" style={{ background: "#0B1120" }}>
        <div className="gm-container">
          <div className="text-center mb-12">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Your data, <span className="gm-gradient-text">visualized</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-sm max-w-lg mx-auto" style={{ color: "#64748B" }}>
                GodotMetrics generates an interactive HTML dashboard from your telemetry data.
                Real-time metrics, charts, and event logs -- all in your browser.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <div className="max-w-4xl mx-auto">
              <DashboardPreview />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========== SECTION 3: THREE-STEP INTEGRATION ========== */}
      <section id="integration" className="gm-section">
        <div className="gm-container">
          <div className="text-center mb-16">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Up and running in <span className="gm-gradient-text">3 steps</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-sm max-w-md mx-auto" style={{ color: "#64748B" }}>
                No build tools. No package managers. Just drag, configure, and track.
              </p>
            </Reveal>
          </div>

          <div className="max-w-2xl mx-auto">
            <IntegrationTimeline />
          </div>
        </div>
      </section>

      {/* ========== SECTION 4: BEFORE / AFTER ========== */}
      <section className="gm-section" style={{ background: "#0B1120" }}>
        <div className="gm-container">
          <div className="text-center mb-12">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Stop guessing. <span className="gm-gradient-text">Start knowing.</span>
              </h2>
            </Reveal>
          </div>

          <div className="max-w-3xl mx-auto">
            <Comparison />
          </div>
        </div>
      </section>

      {/* ========== SECTION 5: PRIVACY ========== */}
      <section className="gm-section">
        <div className="gm-container">
          <div className="text-center mb-12">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono mb-4"
                style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.2)", color: "#22C55E" }}
              >
                <Shield className="w-3 h-3" />
                Privacy First
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Privacy by <span className="gm-gradient-text">default</span>
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="text-sm max-w-md mx-auto" style={{ color: "#64748B" }}>
                Your players{"'"} privacy matters. GodotMetrics is built from the ground up to respect it.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              {
                icon: Fingerprint,
                title: "Anonymous UUID",
                desc: "Per-device random identifier. No emails, no usernames, no personal data ever collected.",
              },
              {
                icon: EyeOff,
                title: "Full Opt-Out",
                desc: "One toggle disables all telemetry. Respects your players' choice with zero hassle.",
              },
              {
                icon: Server,
                title: "Self-Hosted",
                desc: "Your Supabase instance, your data. Nothing goes through third-party servers.",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.15}>
                <motion.div
                  className="gm-privacy-card h-full"
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
                    style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.2)" }}
                  >
                    <item.icon className="w-5 h-5" style={{ color: "#22C55E" }} />
                  </div>
                  <h3 className="text-base font-bold mb-2" style={{ fontFamily: "var(--gm-font-heading)", color: "#F8FAFC" }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>
                    {item.desc}
                  </p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SECTION 6: PRICING + CTA ========== */}
      <section className="gm-section" style={{ background: "#0B1120" }}>
        <div className="gm-container">
          <div className="max-w-2xl mx-auto text-center">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Free & <span className="gm-gradient-text">Open Source</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-lg mb-2" style={{ color: "#CBD5E1" }}>
                No subscriptions. No usage limits. No catch.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="text-sm mb-10" style={{ color: "#64748B" }}>
                GodotMetrics is free for everyone. Pro support available for studios and commercial projects.
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.a
                  href="https://zyynx-hub.itch.io/godotmetrics"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  className="gm-cta-glow inline-flex items-center gap-3 px-10 py-4 rounded-xl font-bold text-base text-black"
                  style={{ background: "linear-gradient(135deg, #22C55E 0%, #4ADE80 100%)" }}
                >
                  <ExternalLink className="w-5 h-5" />
                  Get it on itch.io
                </motion.a>
              </div>
            </Reveal>

            <Reveal delay={0.35}>
              <p className="text-xs mt-6" style={{ color: "#64748B" }}>
                Pure GDScript -- works with Godot 4.x -- no external dependencies
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="py-12 border-t" style={{ borderColor: "#1E293B" }}>
        <div className="gm-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5" style={{ color: "#22C55E" }} />
              <span className="text-sm font-semibold" style={{ fontFamily: "var(--gm-font-heading)", color: "#F8FAFC" }}>
                GodotMetrics
              </span>
            </div>
            <p className="text-xs text-center" style={{ color: "#64748B" }}>
              Built for Godot 4 game developers. Privacy-respecting analytics.
            </p>
            <motion.a
              href="https://zyynx-hub.itch.io/godotmetrics"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-1.5 text-xs font-mono"
              style={{ color: "#22C55E" }}
            >
              zyynx-hub.itch.io
              <ExternalLink className="w-3 h-3" />
            </motion.a>
          </div>
        </div>
      </footer>
    </div>
  )
}

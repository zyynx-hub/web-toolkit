"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { motion, useInView, useMotionValue, useSpring } from "framer-motion"
import Link from "next/link"
import {
  Brain, Code, Eye, Network, Palette, MessageSquare,
  ArrowRight, Terminal, Gamepad2, ExternalLink, Cpu
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
function Counter({ target, suffix = "", className = "" }: {
  target: number; suffix?: string; className?: string
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
      setDisplay(Math.round(v).toString())
    })
    return unsub
  }, [springVal])

  return (
    <span ref={ref} className={className}>
      {display}{suffix}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  DATA                                                                */
/* ------------------------------------------------------------------ */
const servers = [
  {
    id: "blueprint",
    name: "Blueprint MCP",
    subtitle: "unreal-blueprint-mcp",
    icon: Code,
    color: "#F97316",
    toolCount: 12,
    desc: "Create and manipulate Unreal Engine 5 Blueprint nodes programmatically. Build entire gameplay systems through AI — stance mechanics, input handling, component composition.",
    tools: [
      "create_blueprint_node", "connect_pins", "delete_node", "set_node_property",
      "get_component_properties", "set_component_property", "create_variable",
      "get_variable", "set_variable", "compile_blueprint", "create_input_action",
      "cycle_stance"
    ],
    example: {
      method: "create_blueprint_node",
      params: { class: "KismetMathLibrary", function: "Add_IntInt" }
    }
  },
  {
    id: "screenshot",
    name: "Screenshot MCP",
    subtitle: "ue5-screenshot-mcp",
    icon: Eye,
    color: "#3B82F6",
    toolCount: 16,
    desc: "Full UE5 editor control — capture screenshots, manage Play-in-Editor sessions, execute Python scripts, search assets and actors across the project.",
    tools: [
      "take_screenshot", "take_viewport_screenshot", "get_editor_state",
      "start_pie", "stop_pie", "execute_python", "search_assets",
      "search_actors", "get_actor_details", "set_actor_property",
      "undo", "redo", "get_log", "list_blueprints", "get_blueprint_details",
      "focus_actor"
    ],
    example: {
      method: "take_screenshot",
      params: { viewport: "main", resolution: "1920x1080" }
    }
  },
  {
    id: "graphnav",
    name: "Graph Navigation",
    subtitle: "graph-navigation-mcp",
    icon: Network,
    color: "#22C55E",
    toolCount: 5,
    desc: "Navigate Blueprint graphs with precision — pan, zoom, switch tabs, and focus on specific nodes. Full view state management for complex graph editing.",
    tools: [
      "pan_graph", "zoom_graph", "switch_tab", "focus_node", "get_view_state"
    ],
    example: {
      method: "focus_node",
      params: { node_name: "EventBeginPlay", zoom: 1.5 }
    }
  },
  {
    id: "umg",
    name: "UMG Designer",
    subtitle: "umg-designer-mcp",
    icon: Palette,
    color: "#EC4899",
    toolCount: 16,
    desc: "Design UMG widget hierarchies through AI. Build Canvas panels, overlays, progress bars, inventory systems — all from natural language descriptions.",
    tools: [
      "create_widget", "delete_widget", "set_widget_property", "get_widget_tree",
      "create_canvas_panel", "add_to_canvas", "set_slot_layout", "set_alignment",
      "create_overlay", "set_brush", "set_font", "create_size_box",
      "set_visibility", "bind_property", "create_progress_bar", "get_widget_details"
    ],
    example: {
      method: "create_widget",
      params: { type: "ProgressBar", name: "HealthBar", parent: "WBP_HUD" }
    }
  },
]

/* ------------------------------------------------------------------ */
/*  SECTION 1: Hero — Animated Architecture Diagram                    */
/* ------------------------------------------------------------------ */
function HeroArchitectureDiagram() {
  const containerRef = useRef<HTMLDivElement>(null)
  const claudeRef = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([])
  const inView = useInView(containerRef, { once: true, margin: "-50px" })
  const [lines, setLines] = useState<{ d: string; color: string }[]>([])

  // Measure actual DOM center positions, use known CSS sizes for radii
  // Claude circle: 80px (from CSS .hero-center-node .hero-node-circle)
  // Node circles: 56px (from CSS .hero-node-circle)
  const CLAUDE_RADIUS = 40 + 4  // 80px/2 + small gap
  const NODE_RADIUS = 28 + 4    // 56px/2 + small gap

  useEffect(() => {
    if (!inView || !containerRef.current || !claudeRef.current) return

    const measure = () => {
      const container = containerRef.current!.getBoundingClientRect()

      // Now left/top IS the circle center (circle uses translate(-50%,-50%))
      // So we can just read the element's offsetLeft/offsetTop directly
      const claudeEl = claudeRef.current!
      const ccx = claudeEl.offsetLeft
      const ccy = claudeEl.offsetTop

      const newLines: { d: string; color: string }[] = []
      nodeRefs.current.forEach((el, i) => {
        if (!el) return
        const nx = el.offsetLeft
        const ny = el.offsetTop

        // Direction vector
        const dx = ccx - nx
        const dy = ccy - ny
        const len = Math.sqrt(dx * dx + dy * dy)
        const ux = dx / len, uy = dy / len

        // Start: node circle edge
        const sx = nx + ux * NODE_RADIUS
        const sy = ny + uy * NODE_RADIUS
        // End: Claude circle edge
        const ex = ccx - ux * CLAUDE_RADIUS
        const ey = ccy - uy * CLAUDE_RADIUS

        // Gentle curve
        const mx = (sx + ex) / 2
        const my = (sy + ey) / 2
        const curve = 15
        const px = mx + (-uy) * curve
        const py = my + (ux) * curve

        newLines.push({
          d: `M ${sx} ${sy} Q ${px} ${py} ${ex} ${ey}`,
          color: servers[i].color,
        })
      })
      setLines(newLines)
    }

    // Wait for spring animations to finish (scale 0→1 takes ~500ms)
    const timer = setTimeout(measure, 800)
    window.addEventListener("resize", measure)
    return () => { clearTimeout(timer); window.removeEventListener("resize", measure) }
  }, [inView])

  const nodePositions = [
    { left: "25%", top: "22%" },
    { left: "75%", top: "22%" },
    { left: "25%", top: "78%" },
    { left: "75%", top: "78%" },
  ]

  return (
    <div ref={containerRef} className="hero-graph">
      {/* SVG overlay for connection lines — same size as container */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ overflow: "visible", zIndex: 1 }}
      >
        {lines.map((line, i) => (
          <g key={i}>
            {/* Glow */}
            <motion.path
              d={line.d}
              fill="none"
              stroke={line.color}
              strokeWidth="3"
              strokeOpacity="0.1"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: i * 0.12, ease: "easeInOut" }}
            />
            {/* Main line */}
            <motion.path
              d={line.d}
              fill="none"
              stroke={line.color}
              strokeWidth="1.5"
              strokeOpacity="0.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: i * 0.12, ease: "easeInOut" }}
            />
            {/* Traveling dot */}
            <circle r="3" fill={line.color} opacity="0.85">
              <animateMotion
                dur="3s"
                repeatCount="indefinite"
                begin={`${0.5 + i * 0.4}s`}
                path={line.d}
              />
            </circle>
          </g>
        ))}
      </svg>

      {/* Center node (Claude) */}
      <motion.div
        ref={claudeRef}
        className="hero-node hero-center-node"
        style={{ left: "50%", top: "50%", zIndex: 2 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
      >
        <div
          className="hero-node-circle"
          style={{
            borderColor: "#8B5CF6",
            background: "rgba(139, 92, 246, 0.12)",
            ["--pulse-color" as string]: "#8B5CF6",
          }}
        >
          <Brain className="w-8 h-8" style={{ color: "#A78BFA" }} />
        </div>
        <span className="hero-node-label" style={{ color: "#A78BFA" }}>Claude</span>
      </motion.div>

      {/* Server nodes */}
      {servers.map((server, i) => (
        <motion.div
          key={server.id}
          ref={(el) => { nodeRefs.current[i] = el }}
          className="hero-node"
          style={{ left: nodePositions[i].left, top: nodePositions[i].top, zIndex: 2 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 200, damping: 15 }}
        >
          <div
            className="hero-node-circle"
            style={{
              borderColor: server.color,
              background: `${server.color}18`,
              ["--pulse-color" as string]: server.color,
              animationDelay: `${i * 0.7}s`,
            }}
          >
            <server.icon className="w-5 h-5" style={{ color: server.color }} />
          </div>
          <span className="hero-node-label" style={{ color: server.color }}>{server.name}</span>
        </motion.div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  SECTION 2: Interactive Server Explorer (Tabbed)                    */
/* ------------------------------------------------------------------ */
function ServerExplorer() {
  const [activeTab, setActiveTab] = useState(0)
  const server = servers[activeTab]

  return (
    <div>
      {/* Tab bar */}
      <div className="tab-bar" style={{ borderRadius: "12px 12px 0 0", overflow: "hidden" }}>
        {servers.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setActiveTab(i)}
            className={`tab-btn ${i === activeTab ? "active" : ""}`}
          >
            <span className="flex items-center justify-center gap-2">
              <s.icon className="w-4 h-4" style={{ color: i === activeTab ? s.color : undefined }} />
              <span className="hidden sm:inline">{s.name}</span>
              <span className="sm:hidden">{s.name.split(" ")[0]}</span>
            </span>
            {/* Active underline */}
            {i === activeTab && (
              <motion.div
                layoutId="tab-underline"
                className="absolute bottom-0 left-0 right-0 h-[2px]"
                style={{ background: s.color, boxShadow: `0 0 12px ${s.color}60` }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="tab-content">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="tab-content-inner"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Info + JSON example */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-xl font-bold" style={{ color: server.color }}>
                  {server.name}
                </h3>
                <span
                  className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: `${server.color}15`, color: server.color, border: `1px solid ${server.color}30` }}
                >
                  {server.toolCount} tools
                </span>
              </div>
              <p className="text-xs font-mono mb-4" style={{ color: "#64748B" }}>{server.subtitle}</p>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "#94A3B8" }}>
                {server.desc}
              </p>

              {/* Mini JSON-RPC example */}
              <div className="json-example">
                <div style={{ color: "#64748B" }}>{"// JSON-RPC call"}</div>
                <div>
                  <span style={{ color: "#F8FAFC" }}>{"{"}</span>
                </div>
                <div>
                  <span style={{ color: "#F8FAFC" }}>{"  "}</span>
                  <span style={{ color: "#7DD3FC" }}>&quot;method&quot;</span>
                  <span style={{ color: "#F8FAFC" }}>: </span>
                  <span style={{ color: server.color }}>&quot;{server.example.method}&quot;</span>
                  <span style={{ color: "#F8FAFC" }}>,</span>
                </div>
                <div>
                  <span style={{ color: "#F8FAFC" }}>{"  "}</span>
                  <span style={{ color: "#7DD3FC" }}>&quot;params&quot;</span>
                  <span style={{ color: "#F8FAFC" }}>: {"{"}</span>
                </div>
                {Object.entries(server.example.params).map(([key, val], j, arr) => (
                  <div key={key}>
                    <span style={{ color: "#F8FAFC" }}>{"    "}</span>
                    <span style={{ color: "#7DD3FC" }}>&quot;{key}&quot;</span>
                    <span style={{ color: "#F8FAFC" }}>: </span>
                    <span style={{ color: "#FCD34D" }}>
                      {typeof val === "number" ? val : `"${val}"`}
                    </span>
                    {j < arr.length - 1 && <span style={{ color: "#F8FAFC" }}>,</span>}
                  </div>
                ))}
                <div><span style={{ color: "#F8FAFC" }}>{"  }"}</span></div>
                <div><span style={{ color: "#F8FAFC" }}>{"}"}</span></div>
              </div>
            </div>

            {/* Right: Scrollable tool list (terminal-style) */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Terminal className="w-4 h-4" style={{ color: server.color }} />
                <span className="text-xs font-mono" style={{ color: "#64748B" }}>
                  Available Tools
                </span>
              </div>
              <div
                className="tool-list"
                style={{ background: "var(--mcp-bg)", border: "1px solid var(--mcp-border)", borderRadius: "8px", padding: "12px 16px" }}
              >
                {server.tools.map((tool, i) => (
                  <motion.div
                    key={tool}
                    className="tool-list-item"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <div className="bullet" style={{ background: server.color }} />
                    <span style={{ color: server.color }}>{tool}</span>
                    <span style={{ color: "#334155" }}>()</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  SECTION 3: Pipeline — Horizontal Flow                              */
/* ------------------------------------------------------------------ */
function PipelineFlow() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  const stages = [
    {
      icon: MessageSquare,
      title: "You describe what to build",
      desc: "Natural language instructions to Claude"
    },
    {
      icon: Code,
      title: "Claude calls MCP tools",
      desc: "JSON-RPC requests over TCP/stdio"
    },
    {
      icon: Gamepad2,
      title: "Engine executes the action",
      desc: "Nodes created, widgets designed, screenshots taken"
    },
  ]

  return (
    <div ref={ref}>
      {/* Pipeline stages */}
      <div className="flex flex-col md:flex-row items-stretch">
        {stages.map((stage, i) => (
          <div key={stage.title} className="contents">
            <motion.div
              className="pipeline-stage flex-1"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.2, duration: 0.6 }}
            >
              <div className="pipeline-icon">
                <stage.icon className="w-6 h-6" style={{ color: "#A78BFA" }} />
              </div>
              <h4 className="text-sm font-bold mb-1" style={{ color: "#F8FAFC" }}>{stage.title}</h4>
              <p className="text-xs" style={{ color: "#64748B" }}>{stage.desc}</p>
            </motion.div>

            {/* Arrow between stages */}
            {i < stages.length - 1 && (
              <>
                {/* Desktop arrow (horizontal) */}
                <motion.div
                  className="pipeline-arrow hidden md:flex"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.2 }}
                >
                  <svg width="60" height="24" viewBox="0 0 60 24">
                    <line
                      x1="0" y1="12" x2="42" y2="12"
                      stroke="#8B5CF6" strokeWidth="2" strokeDasharray="4 3"
                      className="mcp-flow-line"
                    />
                    <polygon points="42,6 54,12 42,18" fill="#8B5CF6" />
                  </svg>
                </motion.div>
                {/* Mobile arrow (vertical) */}
                <motion.div
                  className="pipeline-arrow flex md:hidden py-2"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.2 }}
                >
                  <svg width="24" height="32" viewBox="0 0 24 32">
                    <line
                      x1="12" y1="0" x2="12" y2="20"
                      stroke="#8B5CF6" strokeWidth="2" strokeDasharray="4 3"
                      className="mcp-flow-line"
                    />
                    <polygon points="6,20 12,32 18,20" fill="#8B5CF6" />
                  </svg>
                </motion.div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* JSON-RPC request/response that types out */}
      <Reveal delay={0.6}>
        <TypingTerminal />
      </Reveal>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Typing Terminal (auto-types lines)                                 */
/* ------------------------------------------------------------------ */
function TypingTerminal() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const [visibleLines, setVisibleLines] = useState(0)

  const lines = useMemo(() => [
    { prefix: "claude", text: '"Create a health bar widget in the HUD"', color: "#F8FAFC" },
    { prefix: "  ->", text: 'mcp.call("create_widget", {type: "ProgressBar", name: "HealthBar"})', color: "#8B5CF6" },
    { prefix: "  <-", text: '{success: true, widget_id: "WBP_HUD_HealthBar"}', color: "#22C55E" },
    { prefix: "  ->", text: 'mcp.call("set_property", {widget: "HealthBar", percent: 0.75})', color: "#8B5CF6" },
    { prefix: "  <-", text: '{success: true}', color: "#22C55E" },
    { prefix: "  ->", text: 'mcp.call("set_brush", {widget: "HealthBar", color: "#EF4444"})', color: "#8B5CF6" },
    { prefix: "  <-", text: '{success: true, applied: "fill_color"}', color: "#22C55E" },
  ], [])

  useEffect(() => {
    if (!inView) return
    let i = 0
    const interval = setInterval(() => {
      i++
      setVisibleLines(i)
      if (i >= lines.length) clearInterval(interval)
    }, 600)
    return () => clearInterval(interval)
  }, [inView, lines.length])

  return (
    <div ref={ref} className="terminal-window mt-8 max-w-3xl mx-auto">
      <div className="terminal-titlebar">
        <div className="terminal-dot" style={{ background: "#EF4444" }} />
        <div className="terminal-dot" style={{ background: "#EAB308" }} />
        <div className="terminal-dot" style={{ background: "#22C55E" }} />
        <span className="text-[10px] font-mono ml-2" style={{ color: "#64748B" }}>mcp-session</span>
      </div>
      <div className="terminal-body">
        {lines.slice(0, visibleLines).map((line, i) => (
          <motion.div
            key={i}
            className="terminal-line"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span style={{ color: "#64748B" }}>{line.prefix} </span>
            <span style={{ color: line.color }}>{line.text}</span>
          </motion.div>
        ))}
        {visibleLines < lines.length && inView && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            style={{ color: "#8B5CF6" }}
          >
            _
          </motion.span>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  SECTION 4: Tool Count Breakdown (Animated Bars)                    */
/* ------------------------------------------------------------------ */
function ToolBars() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  const maxTools = 16 // for percentage calc

  return (
    <div ref={ref} className="max-w-2xl mx-auto space-y-5">
      {servers.map((server, i) => (
        <motion.div
          key={server.id}
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: i * 0.12, duration: 0.5 }}
        >
          <div className="tool-bar-label">
            <span className="flex items-center gap-2">
              <server.icon className="w-3.5 h-3.5" style={{ color: server.color }} />
              {server.name}
            </span>
            <span style={{ color: server.color }}>{server.toolCount}</span>
          </div>
          <div className="tool-bar-track">
            <motion.div
              className="tool-bar-fill"
              style={{ background: `linear-gradient(90deg, ${server.color}, ${server.color}B0)` }}
              initial={{ width: 0 }}
              animate={inView ? { width: `${(server.toolCount / maxTools) * 100}%` } : {}}
              transition={{ delay: 0.3 + i * 0.12, duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
            >
              {server.toolCount} tools
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  SECTION 5: Live Code Example                                       */
/* ------------------------------------------------------------------ */
function LiveCodeExample() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const [visibleLines, setVisibleLines] = useState(0)

  const lines = useMemo(() => [
    { color: "#64748B", text: "// 1. Create a Blueprint actor" },
    { color: "#8B5CF6", text: 'await mcp.call("create_blueprint_node", {' },
    { color: "#FCD34D", text: '  class: "Actor", name: "BP_Enemy"' },
    { color: "#8B5CF6", text: "});" },
    { color: "#22C55E", text: '// -> { success: true, node_id: "BP_Enemy_01" }' },
    { color: "#64748B", text: "" },
    { color: "#64748B", text: "// 2. Add a health component" },
    { color: "#8B5CF6", text: 'await mcp.call("set_component_property", {' },
    { color: "#FCD34D", text: '  blueprint: "BP_Enemy",' },
    { color: "#FCD34D", text: '  component: "HealthComponent",' },
    { color: "#FCD34D", text: '  property: "MaxHealth", value: 100' },
    { color: "#8B5CF6", text: "});" },
    { color: "#22C55E", text: '// -> { success: true }' },
    { color: "#64748B", text: "" },
    { color: "#64748B", text: "// 3. Take a screenshot to verify" },
    { color: "#8B5CF6", text: 'await mcp.call("take_screenshot", {' },
    { color: "#FCD34D", text: '  viewport: "main"' },
    { color: "#8B5CF6", text: "});" },
    { color: "#22C55E", text: '// -> { path: "screenshot_001.png", size: "1920x1080" }' },
  ], [])

  useEffect(() => {
    if (!inView) return
    let i = 0
    const interval = setInterval(() => {
      i++
      setVisibleLines(i)
      if (i >= lines.length) clearInterval(interval)
    }, 150)
    return () => clearInterval(interval)
  }, [inView, lines.length])

  return (
    <div ref={ref} className="terminal-window max-w-3xl mx-auto">
      <div className="terminal-titlebar">
        <div className="terminal-dot" style={{ background: "#EF4444" }} />
        <div className="terminal-dot" style={{ background: "#EAB308" }} />
        <div className="terminal-dot" style={{ background: "#22C55E" }} />
        <span className="text-[10px] font-mono ml-2" style={{ color: "#64748B" }}>mcp-workflow.ts</span>
      </div>
      <div className="terminal-body" style={{ minHeight: "280px" }}>
        {lines.slice(0, visibleLines).map((line, i) => (
          <motion.div
            key={i}
            className="terminal-line"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            style={{ lineHeight: "1.8" }}
          >
            <span style={{ color: "#334155", userSelect: "none" }}>{String(i + 1).padStart(2, " ")}  </span>
            <span style={{ color: line.color }}>{line.text}</span>
          </motion.div>
        ))}
        {visibleLines < lines.length && inView && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            style={{ color: "#8B5CF6" }}
          >
            _
          </motion.span>
        )}
      </div>
    </div>
  )
}

/* ================================================================== */
/*  PAGE                                                                */
/* ================================================================== */
export default function McpPage() {
  return (
    <div className="mcp-page min-h-screen">

      {/* ========== SECTION 1: Hero + Architecture Diagram ========== */}
      <section className="mcp-section relative overflow-hidden" style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
        {/* Subtle radial glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 55%)" }}
        />

        <div className="mcp-container relative w-full">
          {/* Architecture diagram */}
          <HeroArchitectureDiagram />

          {/* Title below the diagram */}
          <div className="text-center mt-8">
            <Reveal>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono mb-6"
                style={{ background: "rgba(139, 92, 246, 0.1)", color: "#A78BFA", border: "1px solid rgba(139, 92, 246, 0.2)" }}
              >
                <Cpu className="w-3.5 h-3.5" />
                Model Context Protocol
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 tracking-tight"
                style={{ fontFamily: "var(--mcp-font-heading)" }}
              >
                <span style={{ color: "#8B5CF6" }}>MCP</span>{" "}
                <span style={{ color: "#F8FAFC" }}>Servers</span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-base sm:text-lg mb-2" style={{ color: "#CBD5E1" }}>
                4 servers. 49+ tools. Game development superpowers for AI.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="text-sm max-w-lg mx-auto mb-8" style={{ color: "#64748B" }}>
                Custom MCP servers that give Claude direct control over Unreal Engine 5 — from Blueprints to UMG widgets, editor screenshots to graph navigation.
              </p>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm text-white"
                  style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)", boxShadow: "0 4px 14px rgba(139, 92, 246, 0.3)" }}
                >
                  <ExternalLink className="w-4 h-4" />
                  View on GitHub
                </motion.a>
                <motion.a
                  href="#explorer"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm"
                  style={{ border: "1px solid #334155", color: "#CBD5E1" }}
                >
                  Explore Tools
                  <ArrowRight className="w-4 h-4" />
                </motion.a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========== SECTION 2: Interactive Server Explorer ========== */}
      <section id="explorer" className="mcp-section" style={{ background: "#0B1120" }}>
        <div className="mcp-container">
          <div className="text-center mb-12">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Server Explorer
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-sm max-w-md mx-auto" style={{ color: "#64748B" }}>
                Click a tab to inspect each server — see its tools, JSON-RPC signatures, and capabilities.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <ServerExplorer />
          </Reveal>
        </div>
      </section>

      {/* ========== SECTION 3: Pipeline Flow ========== */}
      <section className="mcp-section">
        <div className="mcp-container">
          <div className="text-center mb-12">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                How It Works
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-sm max-w-lg mx-auto" style={{ color: "#64748B" }}>
                From natural language to engine action in milliseconds.
              </p>
            </Reveal>
          </div>

          <PipelineFlow />
        </div>
      </section>

      {/* ========== SECTION 4: Tool Count Breakdown ========== */}
      <section className="mcp-section" style={{ background: "#0B1120" }}>
        <div className="mcp-container">
          <div className="text-center mb-12">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <Counter target={49} suffix="+" className="mcp-gradient-text" />{" "}
                <span style={{ color: "#F8FAFC" }}>Tools</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-sm max-w-md mx-auto" style={{ color: "#64748B" }}>
                Every tool is individually callable through the MCP protocol.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <ToolBars />
          </Reveal>
        </div>
      </section>

      {/* ========== SECTION 5: Live Code Example ========== */}
      <section className="mcp-section">
        <div className="mcp-container">
          <div className="text-center mb-12">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Real Workflow
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-sm max-w-md mx-auto" style={{ color: "#64748B" }}>
                A complete MCP interaction — from creating an actor to verifying the result.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <LiveCodeExample />
          </Reveal>
        </div>
      </section>

      {/* ========== SECTION 6: Footer ========== */}
      <footer className="py-12">
        <div className="mcp-container">
          <div className="mcp-footer-line" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5" style={{ color: "#8B5CF6" }} />
              <span className="text-sm font-semibold" style={{ fontFamily: "var(--mcp-font-heading)", color: "#F8FAFC" }}>
                MCP Servers
              </span>
            </div>

            <p className="text-xs text-center" style={{ color: "#64748B" }}>
              Built for game developers who code with AI.
            </p>

            <div className="flex items-center gap-6">
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-1.5 text-xs font-mono"
                style={{ color: "#8B5CF6" }}
              >
                GitHub
                <ExternalLink className="w-3 h-3" />
              </motion.a>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-mono"
                style={{ color: "#64748B" }}
              >
                Portfolio
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

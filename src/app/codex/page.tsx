"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion"
import Link from "next/link"
import {
  ArrowRight,
  ArrowLeft,
  Gamepad2,
  Code2,
  Layers,
  Palette,
  Zap,
  Sun,
  Save,
  Swords,
  Cat,
  ScrollText,
} from "lucide-react"

/* ================================================================== */
/*  UTILITY: Animated spring counter                                   */
/* ================================================================== */
function Counter({
  target,
  suffix = "",
}: {
  target: number
  suffix?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const count = useMotionValue(0)
  const springCount = useSpring(count, { duration: 2000 })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (inView) count.set(target)
  }, [inView, count, target])

  useEffect(() => {
    const unsub = springCount.on("change", (v: number) =>
      setDisplay(Math.round(v))
    )
    return unsub
  }, [springCount])

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  )
}

/* ================================================================== */
/*  UTILITY: Scroll-triggered reveal                                   */
/* ================================================================== */
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ================================================================== */
/*  UTILITY: Scroll progress bar                                       */
/* ================================================================== */
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, #7C3AED, #F43F5E)",
      }}
    />
  )
}

/* ================================================================== */
/*  DATA                                                               */
/* ================================================================== */
const bootLines = [
  { text: "GODOT ENGINE v4.6.1 — INITIALIZING...", delay: 0 },
  { text: "[OK] Core systems loaded", delay: 400 },
  { text: "[OK] 11 autoloads initialized", delay: 700 },
  { text: "[OK] Player state machine: 9 states", delay: 1000 },
  { text: "[OK] 24 shaders compiled", delay: 1250 },
  { text: "[OK] Quest graph loaded (10+ NPCs)", delay: 1500 },
  { text: "[OK] Cat companion AI: READY", delay: 1750 },
  { text: "[OK] 6 levels registered", delay: 2000 },
  { text: "[OK] Enemy system online", delay: 2200 },
  { text: "", delay: 2500 },
  { text: "ALL SYSTEMS NOMINAL. LAUNCHING...", delay: 2600 },
]

const TITLE_SLAM_DELAY = 3200

const levels = [
  {
    name: "TUTORIAL",
    num: "01",
    color: "#3B82F6",
    desc: "LDtk-driven level with interactive buttons, teleporters, and key pickups. Learn movement, jumping, and E-key interactions. Inca-themed tileset on a 16px grid.",
  },
  {
    name: "TOWN",
    num: "02",
    color: "#10B981",
    desc: "3400px flat ground with 6 houses, a church, shop, and 10+ NPCs. Day/night cycle, ambient audio, cat companion spawn point. The hub world connecting all levels.",
  },
  {
    name: "JUNGLE",
    num: "03",
    color: "#F59E0B",
    desc: "1600px green-palette environment with Hydra NPCs and house interiors. Quest-gated NPC visibility through the JungleLevelController.",
  },
  {
    name: "MYSTICAL REALM",
    num: "04",
    color: "#8B5CF6",
    desc: "Cosmic sky shader, stone pedestal, and Cloud Karim. Home of the Exodia boss fight — multi-phase stomp-to-kill combat with cutscene integration and weather effects.",
  },
  {
    name: "ARENA",
    num: "05",
    color: "#EF4444",
    desc: "Combat test arena with flat ground, platforms, and slime enemies. Used for testing the stomp-to-kill combat system and enemy state machines.",
  },
  {
    name: "LEVEL COLLIN",
    num: "06",
    color: "#EC4899",
    desc: "LDtk 4-sublevel world with SunnyLand tileset. Per-sublevel camera bounds that tween on crossing. Features slime enemies and an exit portal back to town.",
  },
]

const stats = [
  { value: 11, suffix: "", label: "AUTOLOADS" },
  { value: 9, suffix: "", label: "STATES" },
  { value: 24, suffix: "", label: "SHADERS" },
  { value: 10, suffix: "+", label: "NPCs" },
  { value: 6, suffix: "", label: "LEVELS" },
  { value: 7, suffix: "", label: "ACHIEVEMENTS" },
]

const techStack = [
  { name: "Godot 4.6", desc: "Game Engine", icon: Gamepad2, phase: 0 },
  { name: "GDScript", desc: "Language", icon: Code2, phase: 1.2 },
  { name: "LDtk", desc: "Level Editor", icon: Layers, phase: 2.4 },
  { name: "GLSL", desc: "Shaders", icon: Palette, phase: 3.6 },
]

const questEntries = [
  { name: "Talk to Purple Karim", status: "complete" as const },
  { name: "Find the Hidden Portal", status: "complete" as const },
  { name: "Befriend the Cat", status: "active" as const },
  { name: "Defeat Exodia Karim", status: "locked" as const },
  { name: "Collect All Achievements", status: "locked" as const },
]

/* ================================================================== */
/*  NAV                                                                */
/* ================================================================== */
function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(15, 15, 35, 0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(124, 58, 237, 0.15)"
          : "1px solid transparent",
      }}
    >
      <div className="codex-container flex items-center justify-between h-14">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm transition-colors hover:opacity-80"
          style={{
            fontFamily: "var(--font-pixel)",
            color: "var(--codex-accent-light)",
            fontSize: "10px",
          }}
        >
          <ArrowLeft size={14} />
          PORTFOLIO
        </Link>
        <span
          className="neon-pulse"
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "10px",
            color: "var(--codex-accent)",
          }}
        >
          CODEX
        </span>
      </div>
    </motion.nav>
  )
}

/* ================================================================== */
/*  SECTION 1: HERO — Retro Arcade Boot Sequence                      */
/* ================================================================== */
function HeroBoot() {
  const [visibleLines, setVisibleLines] = useState(0)
  const [titleVisible, setTitleVisible] = useState(false)
  const [shaking, setShaking] = useState(false)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    bootLines.forEach((line, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleLines(i + 1)
        }, line.delay)
      )
    })

    // Title slam
    timers.push(
      setTimeout(() => {
        setShaking(true)
        setTitleVisible(true)
        setTimeout(() => setShaking(false), 400)
      }, TITLE_SLAM_DELAY)
    )

    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, transparent 70%)",
        }}
      />

      <div
        className={`relative z-10 w-full max-w-2xl px-6 ${shaking ? "screen-shake" : ""}`}
      >
        {/* Boot terminal */}
        <div
          className="mb-10"
          style={{ minHeight: "260px" }}
        >
          {bootLines.slice(0, visibleLines).map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className="mb-1"
              style={{
                fontFamily: "var(--font-retro)",
                fontSize: "18px",
                color: line.text.startsWith("[OK]")
                  ? "#10B981"
                  : line.text === ""
                    ? "transparent"
                    : "var(--codex-text-muted)",
                lineHeight: 1.6,
              }}
            >
              {line.text || "\u00A0"}
              {i === visibleLines - 1 && !titleVisible && (
                <span className="boot-cursor" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Title slam */}
        <motion.div
          initial={{ opacity: 0, scale: 1.8, y: -20 }}
          animate={
            titleVisible
              ? { opacity: 1, scale: 1, y: 0 }
              : { opacity: 0, scale: 1.8, y: -20 }
          }
          transition={{
            duration: 0.3,
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
          className="text-center glitch-hover cursor-default"
        >
          <h1
            className="neon-pulse relative"
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "clamp(2.5rem, 10vw, 7rem)",
              color: "var(--codex-accent)",
              lineHeight: 1.1,
            }}
          >
            CODEX
            <span
              className="glitch-layer-1 absolute inset-0"
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "clamp(2.5rem, 10vw, 7rem)",
              }}
              aria-hidden="true"
            >
              CODEX
            </span>
            <span
              className="glitch-layer-2 absolute inset-0"
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "clamp(2.5rem, 10vw, 7rem)",
              }}
              aria-hidden="true"
            >
              CODEX
            </span>
          </h1>
        </motion.div>

        {/* Subtitle + CTAs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={titleVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center mt-6"
        >
          <p
            className="mb-8"
            style={{
              fontFamily: "var(--font-retro)",
              fontSize: "24px",
              color: "var(--codex-text-muted)",
            }}
          >
            A 2D side-scrolling anime platformer.
            <br />
            Quest system. Cat companion. Boss fights. 24 shaders.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <motion.a
              href="https://zyynx-hub.itch.io/platformer"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-retro flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              PLAY ON ITCH.IO <ArrowRight size={16} />
            </motion.a>
            <motion.a
              href="https://github.com/zyynx-hub"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-retro"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              VIEW SOURCE
            </motion.a>
          </div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={titleVisible ? { opacity: 1 } : {}}
          transition={{ delay: 1.5 }}
          className="text-center mt-16"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span
              style={{
                fontFamily: "var(--font-retro)",
                fontSize: "16px",
                color: "var(--codex-text-dim)",
              }}
            >
              SCROLL TO EXPLORE LEVELS
            </span>
            <div
              className="w-5 h-8 border-2 rounded-full flex items-start justify-center p-1"
              style={{ borderColor: "var(--codex-text-dim)" }}
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--codex-accent)" }}
                animate={{ y: [0, 12, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

/* ================================================================== */
/*  SECTION 2: Horizontal Scroll Level Showcase                        */
/* ================================================================== */
function LevelShowcase() {
  const outerRef = useRef<HTMLDivElement>(null)
  const [isModal, setIsModal] = useState(false)

  // Detect modal vs full-page
  useEffect(() => {
    if (!outerRef.current) return
    const modal = outerRef.current.closest("[class*='overflow-y-auto'], [style*='overflow-y: auto']")
    setIsModal(!!modal)
  }, [])

  const totalCards = levels.length

  // Scroll-driven horizontal motion (full-page only)
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  })
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0vw", `${-(totalCards - 1) * 85}vw`]
  )

  // Full-page: sticky scroll-hijack
  if (!isModal) {
    return (
      <section
        ref={outerRef}
        style={{ position: "relative", height: `${totalCards * 100}vh` }}
      >
        <div style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
        }}>
          <div
            className="absolute top-6 left-0 right-0 text-center z-10"
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "9px",
              color: "var(--codex-text-dim)",
              letterSpacing: "0.2em",
            }}
          >
            LEVEL SELECT
          </div>

          <motion.div style={{ display: "flex", gap: 24, padding: "0 5vw", willChange: "transform", x }}>
            {levels.map((level, i) => (
              <LevelCard key={level.num} level={level} index={i} />
            ))}
          </motion.div>
        </div>
      </section>
    )
  }

  // Modal: native horizontal scroll with wheel conversion
  return (
    <section ref={outerRef} style={{ padding: "clamp(3rem, 8vw, 6rem) 0" }}>
      <div
        className="text-center mb-8"
        style={{
          fontFamily: "var(--font-pixel)",
          fontSize: "9px",
          color: "var(--codex-text-dim)",
          letterSpacing: "0.2em",
        }}
      >
        LEVEL SELECT
      </div>

      <div
        className="level-scroll-track"
        style={{
          display: "flex",
          gap: 24,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          padding: "0 5vw 16px",
          scrollbarWidth: "none",
        }}
      >
        {levels.map((level, i) => (
          <LevelCard key={level.num} level={level} index={i} snap />
        ))}
      </div>
    </section>
  )
}

function LevelCard({ level, index, snap }: { level: typeof levels[0]; index: number; snap?: boolean }) {
  return (
    <motion.div
      className="level-card"
      style={snap ? { scrollSnapAlign: "center" } : undefined}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <div className="level-card-accent" style={{ background: level.color }} />
      <div className="level-card-number">{level.num}</div>
      <div className="relative z-10">
        <div className="mb-2" style={{ fontFamily: "var(--font-retro)", fontSize: "18px", color: level.color, letterSpacing: "0.15em" }}>
          LEVEL {level.num}
        </div>
        <h3 className="mb-4" style={{ fontFamily: "var(--font-pixel)", fontSize: "clamp(12px, 2.5vw, 20px)", color: "var(--codex-text)", lineHeight: 1.8 }}>
          {level.name}
        </h3>
        <p style={{ fontFamily: "var(--font-retro)", fontSize: "20px", color: "var(--codex-text-muted)", lineHeight: 1.5, maxWidth: "500px" }}>
          {level.desc}
        </p>
      </div>
      <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: level.color, opacity: 0.3 }} />
      <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: level.color, opacity: 0.3 }} />
      <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2" style={{ borderColor: level.color, opacity: 0.3 }} />
      <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: level.color, opacity: 0.3 }} />
    </motion.div>
  )
}

/* ================================================================== */
/*  SECTION 3: Bento Grid — Game Systems                               */
/* ================================================================== */
function BentoSystems() {
  const bossRef = useRef(null)
  const bossInView = useInView(bossRef, { once: true, margin: "-100px" })
  const [catFrame, setCatFrame] = useState(0)
  const catFaces = ["/\\___/\\", "(= o.o =)", "( > ^ < )", "(= ^.^ =)"]

  useEffect(() => {
    const interval = setInterval(() => {
      setCatFrame((f) => (f + 1) % catFaces.length)
    }, 800)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="codex-section">
      <div className="codex-container">
        <Reveal className="text-center mb-12">
          <span
            className="inline-block text-xs tracking-widest uppercase mb-3"
            style={{
              fontFamily: "var(--font-retro)",
              color: "var(--codex-cta)",
              fontSize: "18px",
              letterSpacing: "0.2em",
            }}
          >
            GAME SYSTEMS
          </span>
          <h2
            className="neon-text"
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "clamp(10px, 2.5vw, 16px)",
              color: "var(--codex-accent)",
              lineHeight: 1.6,
            }}
          >
            UNDER THE HOOD
          </h2>
        </Reveal>

        <div className="bento-grid">
          {/* BOSS — large card (2x2) */}
          <Reveal className="bento-boss" delay={0}>
            <div ref={bossRef} className="bento-card h-full">
              <div className="flex items-center gap-2 mb-3">
                <Swords size={18} style={{ color: "var(--codex-cta)" }} />
                <span
                  style={{
                    fontFamily: "var(--font-pixel)",
                    fontSize: "9px",
                    color: "var(--codex-cta)",
                    lineHeight: 1.8,
                  }}
                >
                  BOSS FIGHT
                </span>
              </div>
              <h3
                className="mb-2"
                style={{
                  fontFamily: "var(--font-pixel)",
                  fontSize: "clamp(10px, 2vw, 14px)",
                  color: "var(--codex-text)",
                  lineHeight: 1.8,
                }}
              >
                EXODIA KARIM
              </h3>
              <p
                className="mb-6"
                style={{
                  fontFamily: "var(--font-retro)",
                  fontSize: "19px",
                  color: "var(--codex-text-muted)",
                  lineHeight: 1.5,
                }}
              >
                Multi-phase boss with AnimationPlayer-driven attack patterns.
                7-part composite body, 5 HP, stomp-to-kill per phase.
                Pre-boss cutscene with 7 named segments. Post-boss rain + sad
                music + victory dialog.
              </p>

              {/* Animated Boss HP bar */}
              <div>
                <div
                  className="flex justify-between mb-1"
                  style={{
                    fontFamily: "var(--font-pixel)",
                    fontSize: "7px",
                    lineHeight: 1.6,
                  }}
                >
                  <span style={{ color: "var(--codex-cta)" }}>BOSS HP</span>
                  <span style={{ color: "var(--codex-text-dim)" }}>
                    PHASE 3
                  </span>
                </div>
                <div
                  className="w-full h-4 rounded-sm overflow-hidden"
                  style={{
                    background: "rgba(244, 63, 94, 0.15)",
                    border: "1px solid rgba(244, 63, 94, 0.3)",
                  }}
                >
                  <div
                    className={`boss-hp-fill ${bossInView ? "animate" : ""}`}
                  />
                </div>
              </div>

              {/* Phase markers */}
              <div className="flex gap-3 mt-4">
                {["PHASE 1", "PHASE 2", "PHASE 3"].map((phase, i) => (
                  <span
                    key={phase}
                    style={{
                      fontFamily: "var(--font-retro)",
                      fontSize: "14px",
                      padding: "2px 8px",
                      border: `1px solid ${i === 2 ? "rgba(244, 63, 94, 0.4)" : "rgba(124, 58, 237, 0.2)"}`,
                      color:
                        i === 2
                          ? "var(--codex-cta)"
                          : "var(--codex-text-dim)",
                      background:
                        i === 2
                          ? "rgba(244, 63, 94, 0.08)"
                          : "transparent",
                    }}
                  >
                    {phase}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* CAT — tall card */}
          <Reveal className="bento-cat" delay={0.1}>
            <div className="bento-card h-full flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <Cat size={18} style={{ color: "#10B981" }} />
                <span
                  style={{
                    fontFamily: "var(--font-pixel)",
                    fontSize: "9px",
                    color: "#10B981",
                    lineHeight: 1.8,
                  }}
                >
                  COMPANION
                </span>
              </div>
              <h3
                className="mb-2"
                style={{
                  fontFamily: "var(--font-pixel)",
                  fontSize: "clamp(9px, 1.5vw, 12px)",
                  color: "var(--codex-text)",
                  lineHeight: 1.8,
                }}
              >
                CAT AI
              </h3>
              <p
                className="mb-4"
                style={{
                  fontFamily: "var(--font-retro)",
                  fontSize: "18px",
                  color: "var(--codex-text-muted)",
                  lineHeight: 1.4,
                }}
              >
                Tri-mode AI: WANDER in town, FOLLOW after befriend, CONTROLLED
                via C-key swap. Own state machine with 7 states, 2 HP, contact
                damage.
              </p>

              {/* Animated ASCII cat */}
              <div
                className="mt-auto text-center py-4"
                style={{
                  fontFamily: "var(--font-retro)",
                  fontSize: "20px",
                  color: "#10B981",
                  whiteSpace: "pre",
                  lineHeight: 1.3,
                }}
              >
                <motion.div
                  key={catFrame}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {catFaces[catFrame]}
                </motion.div>
              </div>

              {/* Mode badges */}
              <div className="flex gap-2 mt-2 flex-wrap">
                {["WANDER", "FOLLOW", "CONTROLLED"].map((mode) => (
                  <span
                    key={mode}
                    style={{
                      fontFamily: "var(--font-retro)",
                      fontSize: "14px",
                      padding: "2px 6px",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                      color: "#10B981",
                    }}
                  >
                    {mode}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* QUEST — tall card */}
          <Reveal className="bento-quest" delay={0.15}>
            <div className="bento-card h-full flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <ScrollText size={18} style={{ color: "#F59E0B" }} />
                <span
                  style={{
                    fontFamily: "var(--font-pixel)",
                    fontSize: "9px",
                    color: "#F59E0B",
                    lineHeight: 1.8,
                  }}
                >
                  QUESTS
                </span>
              </div>
              <h3
                className="mb-2"
                style={{
                  fontFamily: "var(--font-pixel)",
                  fontSize: "clamp(9px, 1.5vw, 12px)",
                  color: "var(--codex-text)",
                  lineHeight: 1.8,
                }}
              >
                QUEST SYSTEM
              </h3>
              <p
                className="mb-4"
                style={{
                  fontFamily: "var(--font-retro)",
                  fontSize: "18px",
                  color: "var(--codex-text-muted)",
                  lineHeight: 1.4,
                }}
              >
                JSON-driven quest graph with branching NPC dialogs. Q-key log,
                state tracking across levels, dialog triggers.
              </p>

              {/* Fake quest log */}
              <div className="mt-auto">
                <div
                  className="mb-2"
                  style={{
                    fontFamily: "var(--font-pixel)",
                    fontSize: "7px",
                    color: "var(--codex-text-dim)",
                    letterSpacing: "0.1em",
                    lineHeight: 1.6,
                  }}
                >
                  QUEST LOG
                </div>
                {questEntries.map((q) => (
                  <div key={q.name} className="quest-log-entry">
                    <div className={`quest-dot ${q.status}`} />
                    <span
                      style={{
                        fontFamily: "var(--font-retro)",
                        fontSize: "16px",
                        color:
                          q.status === "locked"
                            ? "var(--codex-text-dim)"
                            : "var(--codex-text-muted)",
                        textDecoration:
                          q.status === "complete" ? "line-through" : "none",
                        opacity: q.status === "locked" ? 0.5 : 1,
                      }}
                    >
                      {q.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* PORTAL — small card */}
          <Reveal className="bento-portal" delay={0.2}>
            <div className="bento-card h-full">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={16} style={{ color: "var(--codex-accent)" }} />
                <span
                  style={{
                    fontFamily: "var(--font-pixel)",
                    fontSize: "8px",
                    color: "var(--codex-accent)",
                    lineHeight: 1.8,
                  }}
                >
                  PORTALS
                </span>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-retro)",
                  fontSize: "17px",
                  color: "var(--codex-text-muted)",
                  lineHeight: 1.4,
                }}
              >
                Vortex shader portals with cinematic pull-in. E-key activation,
                cross-level travel with arrival positioning.
              </p>
            </div>
          </Reveal>

          {/* DAY/NIGHT — small card */}
          <Reveal className="bento-daynight" delay={0.25}>
            <div className="bento-card h-full">
              <div className="flex items-center gap-2 mb-2">
                <Sun size={16} style={{ color: "#F59E0B" }} />
                <span
                  style={{
                    fontFamily: "var(--font-pixel)",
                    fontSize: "8px",
                    color: "#F59E0B",
                    lineHeight: 1.8,
                  }}
                >
                  DAY/NIGHT
                </span>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-retro)",
                  fontSize: "17px",
                  color: "var(--codex-text-muted)",
                  lineHeight: 1.4,
                }}
              >
                5-minute real-time cycle with throttled signals. Affects
                lighting, prop shadows, and ambient audio.
              </p>
            </div>
          </Reveal>

          {/* SAVE — small-wide card */}
          <Reveal className="bento-save" delay={0.3}>
            <div className="bento-card h-full">
              <div className="flex items-center gap-2 mb-2">
                <Save size={16} style={{ color: "#3B82F6" }} />
                <span
                  style={{
                    fontFamily: "var(--font-pixel)",
                    fontSize: "8px",
                    color: "#3B82F6",
                    lineHeight: 1.8,
                  }}
                >
                  SAVE SYSTEM
                </span>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-retro)",
                  fontSize: "17px",
                  color: "var(--codex-text-muted)",
                  lineHeight: 1.4,
                }}
              >
                3-slot save with autosave, resume-to-exact-position, play-time
                tracking, and legacy migration from single-file saves.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ================================================================== */
/*  SECTION 4: HUD Stats Counter Bar                                   */
/* ================================================================== */
function StatsHUD() {
  return (
    <section className="codex-section" style={{ paddingTop: 0 }}>
      <div className="codex-container">
        <Reveal>
          <div className="hud-bar">
            {stats.map((s, i) => (
              <div key={s.label} className="hud-stat">
                <span
                  style={{
                    fontFamily: "var(--font-pixel)",
                    fontSize: "clamp(14px, 3vw, 24px)",
                    color:
                      i % 2 === 0
                        ? "var(--codex-accent)"
                        : "var(--codex-cta)",
                  }}
                >
                  <Counter target={s.value} suffix={s.suffix} />
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-pixel)",
                    fontSize: "6px",
                    color: "var(--codex-text-dim)",
                    letterSpacing: "0.12em",
                    lineHeight: 1.4,
                  }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ================================================================== */
/*  SECTION 5: Tech Stack — Floating Power-Ups                        */
/* ================================================================== */
function TechPowerUps() {
  return (
    <section
      className="codex-section"
      style={{
        borderTop: "1px solid rgba(124, 58, 237, 0.1)",
      }}
    >
      <div className="codex-container">
        <Reveal className="text-center mb-12">
          <span
            className="inline-block text-xs tracking-widest uppercase mb-3"
            style={{
              fontFamily: "var(--font-retro)",
              color: "var(--codex-cta)",
              fontSize: "18px",
              letterSpacing: "0.2em",
            }}
          >
            POWER-UPS COLLECTED
          </span>
          <h2
            className="neon-text"
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "clamp(10px, 2.5vw, 16px)",
              color: "var(--codex-accent)",
              lineHeight: 1.6,
            }}
          >
            TECH STACK
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {techStack.map((tech, i) => (
            <Reveal key={tech.name} delay={i * 0.1}>
              <motion.div
                className="powerup-badge"
                animate={{
                  y: [0, -14, 0],
                }}
                transition={{
                  duration: 3,
                  delay: tech.phase * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                whileHover={{
                  scale: 1.12,
                  boxShadow:
                    "0 0 50px rgba(124, 58, 237, 0.4), 0 0 100px rgba(124, 58, 237, 0.15)",
                }}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <tech.icon
                    size={32}
                    style={{ color: "var(--codex-accent)" }}
                  />
                </motion.div>
                <span
                  style={{
                    fontFamily: "var(--font-pixel)",
                    fontSize: "9px",
                    color: "var(--codex-text)",
                    lineHeight: 1.8,
                    textAlign: "center",
                  }}
                >
                  {tech.name}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-retro)",
                    fontSize: "16px",
                    color: "var(--codex-text-dim)",
                  }}
                >
                  {tech.desc}
                </span>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ================================================================== */
/*  SECTION 6: Footer — GAME OVER                                     */
/* ================================================================== */
function GameOverFooter() {
  return (
    <footer
      className="py-16"
      style={{
        borderTop: "1px solid rgba(124, 58, 237, 0.1)",
        background:
          "linear-gradient(180deg, rgba(15, 15, 35, 1) 0%, rgba(124, 58, 237, 0.04) 100%)",
      }}
    >
      <div className="codex-container text-center">
        <Reveal>
          <h2
            className="neon-text mb-6"
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "clamp(1.5rem, 5vw, 3rem)",
              color: "var(--codex-cta)",
              textShadow:
                "0 0 10px #F43F5E, 0 0 30px rgba(244, 63, 94, 0.5), 0 0 60px rgba(244, 63, 94, 0.2)",
            }}
          >
            GAME OVER
          </h2>

          <p
            className="insert-coin mb-10"
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "8px",
              color: "var(--codex-text-dim)",
              letterSpacing: "0.2em",
              lineHeight: 1.8,
            }}
          >
            INSERT COIN TO CONTINUE
          </p>

          <div className="flex items-center justify-center gap-8">
            <Link
              href="/"
              className="transition-colors hover:text-[var(--codex-accent)]"
              style={{
                fontFamily: "var(--font-retro)",
                fontSize: "20px",
                color: "var(--codex-text-dim)",
              }}
            >
              PORTFOLIO
            </Link>
            <span style={{ color: "var(--codex-text-dim)" }}>|</span>
            <a
              href="https://zyynx-hub.itch.io/platformer"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[var(--codex-cta)]"
              style={{
                fontFamily: "var(--font-retro)",
                fontSize: "20px",
                color: "var(--codex-text-dim)",
              }}
            >
              ITCH.IO
            </a>
          </div>

          <p
            className="mt-8"
            style={{
              fontFamily: "var(--font-retro)",
              fontSize: "16px",
              color: "var(--codex-text-dim)",
              opacity: 0.5,
            }}
          >
            Built with Godot 4.6 + GDScript
          </p>
        </Reveal>
      </div>
    </footer>
  )
}

/* ================================================================== */
/*  PAGE                                                               */
/* ================================================================== */
export default function CodexPage() {
  return (
    <div className="crt-overlay" style={{ background: "var(--codex-bg, #0F0F23)", minHeight: "100%" }}>
      <ScrollProgress />
      <Nav />
      <HeroBoot />
      <LevelShowcase />
      <BentoSystems />
      <StatsHUD />
      <TechPowerUps />
      <GameOverFooter />
    </div>
  )
}

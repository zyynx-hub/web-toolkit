"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

/* ================================================================== */
/*  CONSTANTS                                                          */
/* ================================================================== */
const GLITCH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*<>?"
const WARNING_TEXT =
  "If you're not careful and noclip out of reality in the wrong areas, you'll end up in the Backrooms."

const FLOOR_LEVELS = [
  {
    level: "LEVEL 0",
    label: "Procedural Generation",
    quote: "600,000 sq ft of nothing. Every time.",
  },
  {
    level: "LEVEL 1",
    label: "Entity AI",
    quote: "They hunt by sound. Don't run.",
  },
  {
    level: "LEVEL 2",
    label: "Audio Design",
    quote: "The hum never stops. You just stop noticing.",
  },
  {
    level: "LEVEL 3",
    label: "VHS Camcorder",
    quote: "Night vision. 30 fps. Your only friend.",
  },
  {
    level: "LEVEL 4",
    label: "Lighting System",
    quote: "The fluorescents flicker. Something moved.",
  },
]

const EVIDENCE_ITEMS = [
  { id: "01", name: "Unreal Engine 5 (C++ / Blueprints)" },
  { id: "02", name: "Custom MCP Integration Tools" },
  { id: "03", name: "Procedural Level Algorithm" },
  { id: "04", name: "AI Behavior Trees" },
]

/* ================================================================== */
/*  VHS TRACKING BAND — sweeps vertically                              */
/* ================================================================== */
function VHSBand() {
  return (
    <motion.div
      className="fixed left-0 right-0 pointer-events-none"
      style={{
        height: "6px",
        zIndex: 198,
        background:
          "linear-gradient(90deg, transparent 0%, rgba(202,138,4,0.15) 15%, rgba(202,138,4,0.5) 40%, rgba(202,138,4,0.6) 50%, rgba(202,138,4,0.5) 60%, rgba(202,138,4,0.15) 85%, transparent 100%)",
        mixBlendMode: "screen",
        filter: "blur(0.5px)",
      }}
      animate={{
        top: ["105%", "-5%"],
        opacity: [0, 0.8, 0.6, 0.8, 0],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        repeatDelay: 9,
        ease: "linear",
      }}
    />
  )
}

/* ================================================================== */
/*  REC INDICATOR + TIMECODE (top-right, always visible)               */
/* ================================================================== */
function RecIndicator({ visible }: { visible: boolean }) {
  const [time, setTime] = useState("00:00:00:00")

  useEffect(() => {
    if (!visible) return
    const start = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - start
      const h = String(Math.floor(elapsed / 3600000)).padStart(2, "0")
      const m = String(Math.floor((elapsed % 3600000) / 60000)).padStart(2, "0")
      const s = String(Math.floor((elapsed % 60000) / 1000)).padStart(2, "0")
      const f = String(Math.floor((elapsed % 1000) / 33)).padStart(2, "0") // ~30fps frame count
      setTime(`${h}:${m}:${s}:${f}`)
    }, 33)
    return () => clearInterval(interval)
  }, [visible])

  if (!visible) return null

  return (
    <div className="fixed top-5 right-5 flex items-center gap-3" style={{ zIndex: 150 }}>
      <div className="flex items-center gap-2">
        <div
          className="rec-blink rounded-full"
          style={{ width: 8, height: 8, background: "var(--br-danger)" }}
        />
        <span
          className="text-xs font-bold tracking-wider"
          style={{ color: "var(--br-danger)", fontSize: "11px" }}
        >
          REC
        </span>
      </div>
      <span
        className="vhs-timestamp"
        style={{ color: "var(--br-text-dim)", fontSize: "11px" }}
      >
        {time}
      </span>
    </div>
  )
}

/* ================================================================== */
/*  DATE STAMP (bottom-left, always visible)                           */
/* ================================================================== */
function DateStamp({ visible }: { visible: boolean }) {
  if (!visible) return null
  return (
    <div className="fixed bottom-5 left-5" style={{ zIndex: 150 }}>
      <span
        className="vhs-timestamp"
        style={{ color: "var(--br-text-dim)", fontSize: "11px", opacity: 0.6 }}
      >
        03.15.2026
      </span>
    </div>
  )
}

/* ================================================================== */
/*  BACK NAV (top-left, minimal)                                       */
/* ================================================================== */
function BackNav({ visible }: { visible: boolean }) {
  if (!visible) return null
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 1 }}
      className="fixed top-5 left-5"
      style={{ zIndex: 150 }}
    >
      <Link
        href="/"
        className="flex items-center gap-2 text-xs transition-opacity hover:opacity-100"
        style={{ color: "var(--br-text-dim)", opacity: 0.5, fontSize: "11px", letterSpacing: "0.1em" }}
      >
        <ArrowLeft size={12} />
        PORTFOLIO
      </Link>
    </motion.div>
  )
}

/* ================================================================== */
/*  SECTION 1: FOUND VHS TAPE OPENING                                  */
/*  Black → static → "TAPE RECOVERED" flicker → video starts          */
/* ================================================================== */
function TapeOpening({ onTapeStarted }: { onTapeStarted: () => void }) {
  const [phase, setPhase] = useState<"black" | "static" | "text" | "playing">("black")
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("static"), 800)
    const t2 = setTimeout(() => setPhase("text"), 1500)
    const t3 = setTimeout(() => {
      setPhase("playing")
      onTapeStarted()
      // Auto-scroll past the tape opening to the content below
      setTimeout(() => {
        const next = sectionRef.current?.nextElementSibling as HTMLElement
        if (next) next.scrollIntoView({ behavior: "smooth" })
      }, 800)
    }, 3800)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [onTapeStarted])

  return (
    <section
      ref={sectionRef}
      className="relative flex items-center justify-center overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      {/* Black background always present */}
      <div
        className="absolute inset-0"
        style={{ background: "var(--br-bg)" }}
      />

      {/* Static noise phase */}
      <AnimatePresence>
        {(phase === "static" || phase === "text") && (
          <motion.div
            className="absolute inset-0 heavy-static"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* TAPE RECOVERED text */}
      <AnimatePresence>
        {phase === "text" && (
          <motion.div
            className="relative flex flex-col items-center gap-3"
            style={{ zIndex: 10 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <motion.span
              className="flicker"
              style={{
                color: "var(--br-accent)",
                fontSize: "clamp(0.7rem, 2vw, 0.9rem)",
                letterSpacing: "0.25em",
                fontWeight: 500,
                fontFamily: "var(--br-font)",
              }}
              animate={{
                opacity: [0, 1, 0.6, 1, 0.8, 1],
              }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              TAPE RECOVERED: 03/15/2026
            </motion.span>
            <motion.span
              style={{
                color: "var(--br-text-dim)",
                fontSize: "10px",
                letterSpacing: "0.15em",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.5 }}
            >
              PLAYBACK INITIATED
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Playing state — VHS playback loop (visible when scrolling back) */}
      {phase === "playing" && (
        <>
          {/* Static noise background */}
          <div className="absolute inset-0 heavy-static" style={{ opacity: 0.4 }} />

          {/* Horizontal tracking lines */}
          <div className="absolute inset-0 pointer-events-none" style={{ overflow: "hidden" }}>
            <motion.div
              className="absolute left-0 right-0 h-[2px]"
              style={{ background: "rgba(202,138,4,0.3)", filter: "blur(1px)" }}
              animate={{ top: ["-5%", "105%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute left-0 right-0 h-[1px]"
              style={{ background: "rgba(255,255,255,0.08)" }}
              animate={{ top: ["105%", "-5%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 1 }}
            />
          </div>

          {/* Center label */}
          <motion.div
            className="relative flex flex-col items-center gap-2"
            style={{ zIndex: 10 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              style={{
                width: 40,
                height: 40,
                border: "2px solid rgba(202,138,4,0.4)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <div style={{
                width: 0,
                height: 0,
                borderLeft: "10px solid rgba(202,138,4,0.6)",
                borderTop: "6px solid transparent",
                borderBottom: "6px solid transparent",
                marginLeft: 3,
              }} />
            </motion.div>
            <span
              className="flicker"
              style={{
                color: "var(--br-accent-dim)",
                fontSize: "10px",
                letterSpacing: "0.2em",
                fontFamily: "var(--br-font)",
              }}
            >
              PLAYBACK IN PROGRESS
            </span>
            <motion.span
              style={{
                color: "var(--br-text-dim)",
                fontSize: "9px",
                letterSpacing: "0.1em",
                fontFamily: "monospace",
              }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              SCROLL DOWN TO CONTINUE
            </motion.span>
          </motion.div>
        </>
      )}
    </section>
  )
}

/* ================================================================== */
/*  SECTION 2: THE WARNING — Typing + glitch characters                */
/*  Full-screen, "THE BACKROOMS" slam at end                           */
/* ================================================================== */
function WarningSection({ tapeStarted }: { tapeStarted: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })
  const [chars, setChars] = useState<Array<{ char: string; glitching: boolean }>>([])
  const [showTitle, setShowTitle] = useState(false)
  const [titleFlash, setTitleFlash] = useState(false)
  const [typingDone, setTypingDone] = useState(false)
  const started = tapeStarted && inView

  useEffect(() => {
    if (!started) return
    let i = 0
    const result: Array<{ char: string; glitching: boolean }> = []

    const interval = setInterval(() => {
      if (i >= WARNING_TEXT.length) {
        clearInterval(interval)
        setTypingDone(true)
        // Beat of silence, then title slam
        setTimeout(() => {
          setTitleFlash(true)
          setTimeout(() => setTitleFlash(false), 150)
          setShowTitle(true)
        }, 1200)
        return
      }

      const currentChar = WARNING_TEXT[i]
      // ~15% chance of glitch on alphanumeric chars
      const shouldGlitch = currentChar.match(/[a-zA-Z]/) && Math.random() < 0.15

      if (shouldGlitch) {
        // Show wrong char first
        const wrongChar = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
        result.push({ char: wrongChar, glitching: true })
        setChars([...result])

        // Correct after a brief moment
        setTimeout(() => {
          result[result.length - 1] = { char: currentChar, glitching: false }
          setChars([...result])
        }, 80)
      } else {
        result.push({ char: currentChar, glitching: false })
        setChars([...result])
      }

      i++
    }, 40)

    return () => clearInterval(interval)
  }, [started])

  return (
    <section
      ref={ref}
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{ minHeight: "100vh", padding: "2rem" }}
    >
      {/* Subtle ambient noise bg */}
      <div
        className="absolute inset-0 pointer-events-none heavy-static"
        style={{ opacity: 0.3 }}
      />

      {/* Dark vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 20%, rgba(12,10,9,0.85) 80%)",
        }}
      />

      {/* Typing text */}
      <div
        className="relative max-w-3xl mx-auto text-center"
        style={{ zIndex: 10 }}
      >
        <p
          style={{
            fontSize: "clamp(1rem, 2.5vw, 1.35rem)",
            lineHeight: 1.8,
            color: "var(--br-text)",
            fontWeight: 300,
            letterSpacing: "0.02em",
            minHeight: "6em",
          }}
        >
          {chars.map((c, idx) => (
            <span
              key={idx}
              style={{
                color: c.glitching ? "var(--br-accent)" : "var(--br-text)",
                textShadow: c.glitching ? "0 0 8px var(--br-accent)" : "none",
                transition: "color 0.08s",
              }}
            >
              {c.char}
            </span>
          ))}
          {started && !typingDone && (
            <span
              style={{
                color: "var(--br-accent)",
                animation: "cursor-blink 0.8s ease-in-out infinite",
                marginLeft: "2px",
              }}
            >
              |
            </span>
          )}
        </p>

        {/* THE BACKROOMS slam */}
        <AnimatePresence>
          {showTitle && (
            <motion.div
              initial={{ opacity: 0, scale: 1.3 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="mt-12"
            >
              <h1
                className="glitch-text"
                style={{
                  fontSize: "clamp(2.5rem, 8vw, 6rem)",
                  fontWeight: 700,
                  color: "var(--br-text-bright)",
                  letterSpacing: "0.12em",
                  lineHeight: 1,
                  textShadow: "0 0 40px rgba(202,138,4,0.15)",
                }}
              >
                THE BACKROOMS
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 0.8, duration: 1.5 }}
                style={{
                  marginTop: "1.5rem",
                  fontSize: "clamp(0.65rem, 1.5vw, 0.8rem)",
                  color: "var(--br-accent-dim)",
                  letterSpacing: "0.3em",
                }}
              >
                FIRST-PERSON HORROR / UNREAL ENGINE 5
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Full-screen white flash on title slam */}
      <AnimatePresence>
        {titleFlash && (
          <motion.div
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 100, background: "rgba(202,138,4,0.08)" }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Scroll hint */}
      {showTitle && (
        <motion.div
          className="absolute bottom-8 left-1/2"
          style={{ transform: "translateX(-50%)", zIndex: 10 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          transition={{ delay: 2.5, duration: 1 }}
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div
              style={{
                width: 16,
                height: 26,
                border: "1px solid var(--br-text-dim)",
                borderRadius: 10,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                paddingTop: 4,
              }}
            >
              <motion.div
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: "50%",
                  background: "var(--br-accent)",
                }}
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}

/* ================================================================== */
/*  SECTION 3: VERTICAL SCROLL "DESCENT"                               */
/*  5 floor levels, parallax, scroll-reveal, glitch flashes            */
/* ================================================================== */
function FloorLevel({
  level,
  label,
  quote,
  index,
}: {
  level: string
  label: string
  quote: string
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-120px" })
  const [glitchFlash, setGlitchFlash] = useState(false)

  // Random glitch flash when entering view
  useEffect(() => {
    if (!inView) return
    const delay = 200 + Math.random() * 600
    const t = setTimeout(() => {
      setGlitchFlash(true)
      setTimeout(() => setGlitchFlash(false), 100)
    }, delay)
    return () => clearTimeout(t)
  }, [inView])

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Glitch flash rectangle */}
      <AnimatePresence>
        {glitchFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            style={{
              position: "absolute",
              left: `${10 + Math.random() * 60}%`,
              top: `${Math.random() * 80}%`,
              width: `${30 + Math.random() * 120}px`,
              height: `${4 + Math.random() * 12}px`,
              background: "var(--br-accent)",
              zIndex: 20,
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>

      {/* Divider line */}
      {index > 0 && (
        <motion.div
          className="level-divider"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ marginBottom: "3rem", transformOrigin: "left" }}
        />
      )}

      {/* Level content */}
      <motion.div
        initial={{ opacity: 0.08, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
        style={{ paddingBottom: "4rem" }}
      >
        {/* Level tag */}
        <span
          style={{
            fontSize: "10px",
            letterSpacing: "0.3em",
            color: "var(--br-accent-dim)",
            fontWeight: 600,
            display: "block",
            marginBottom: "0.75rem",
          }}
        >
          {level}
        </span>

        {/* Feature label */}
        <h3
          style={{
            fontSize: "clamp(0.7rem, 1.5vw, 0.85rem)",
            fontWeight: 600,
            color: "var(--br-text-bright)",
            letterSpacing: "0.12em",
            marginBottom: "1rem",
            textTransform: "uppercase",
          }}
        >
          {label}
        </h3>

        {/* Quote */}
        <p
          style={{
            fontSize: "clamp(1.1rem, 3vw, 1.6rem)",
            fontWeight: 300,
            color: "var(--br-text)",
            lineHeight: 1.5,
            fontStyle: "italic",
            maxWidth: "600px",
          }}
        >
          &ldquo;{quote}&rdquo;
        </p>
      </motion.div>
    </div>
  )
}

function DescentSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  // Parallax: text moves faster than background noise
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -60])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        paddingTop: "clamp(4rem, 10vw, 8rem)",
        paddingBottom: "clamp(4rem, 10vw, 8rem)",
      }}
    >
      {/* Parallax noise background */}
      <motion.div
        className="absolute inset-0 pointer-events-none heavy-static"
        style={{ opacity: 0.15, y: bgY }}
      />

      {/* Content */}
      <div
        style={{
          maxWidth: "800px",
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: "clamp(1.5rem, 5vw, 4rem)",
          paddingRight: "clamp(1.5rem, 5vw, 4rem)",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.3 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          style={{
            marginBottom: "4rem",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              letterSpacing: "0.4em",
              color: "var(--br-text-dim)",
            }}
          >
            DESCENDING...
          </span>
        </motion.div>

        {FLOOR_LEVELS.map((floor, i) => (
          <FloorLevel key={floor.level} {...floor} index={i} />
        ))}
      </div>
    </section>
  )
}

/* ================================================================== */
/*  SECTION 4: TECH DOSSIER — classified evidence report               */
/* ================================================================== */
function EvidenceItem({
  id,
  name,
  delay,
}: {
  id: string
  name: string
  delay: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const [displayed, setDisplayed] = useState("")
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!inView) return
    const t = setTimeout(() => setStarted(true), delay * 1000)
    return () => clearTimeout(t)
  }, [inView, delay])

  useEffect(() => {
    if (!started) return
    const fullText = `ITEM ${id}: ${name}`
    let i = 0
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setDisplayed(fullText.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
      }
    }, 30)
    return () => clearInterval(interval)
  }, [started, id, name])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6, delay }}
      style={{
        padding: "1rem 0",
        borderBottom: "1px solid rgba(68, 64, 60, 0.15)",
        fontFamily: "var(--br-font)",
      }}
    >
      <span
        style={{
          fontSize: "clamp(0.75rem, 1.5vw, 0.9rem)",
          color: "var(--br-text)",
          letterSpacing: "0.08em",
          fontWeight: 400,
        }}
      >
        {displayed}
        {started && displayed.length < `ITEM ${id}: ${name}`.length && (
          <span style={{ color: "var(--br-accent)", marginLeft: 2 }}>|</span>
        )}
      </span>
    </motion.div>
  )
}

function TechDossier() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{
        paddingTop: "clamp(5rem, 10vw, 8rem)",
        paddingBottom: "clamp(5rem, 10vw, 8rem)",
      }}
    >
      <div
        className="paper-texture relative"
        style={{
          maxWidth: "700px",
          marginLeft: "auto",
          marginRight: "auto",
          padding: "clamp(2rem, 5vw, 4rem)",
          border: "1px solid rgba(68, 64, 60, 0.2)",
        }}
      >
        {/* CLASSIFIED stamp */}
        <div className="classified-stamp">CLASSIFIED</div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span
            style={{
              fontSize: "10px",
              letterSpacing: "0.3em",
              color: "var(--br-text-dim)",
              display: "block",
              marginBottom: "0.5rem",
            }}
          >
            DOCUMENT REF: BR-2026-0315
          </span>
          <h2
            style={{
              fontSize: "clamp(0.85rem, 2vw, 1.1rem)",
              fontWeight: 600,
              color: "var(--br-text-bright)",
              letterSpacing: "0.15em",
              marginBottom: "0.5rem",
            }}
          >
            TECHNICAL EVIDENCE LOG
          </h2>
          <div
            style={{
              height: "1px",
              background: "rgba(68, 64, 60, 0.3)",
              marginBottom: "2rem",
            }}
          />
          <p
            style={{
              fontSize: "11px",
              color: "var(--br-text-dim)",
              letterSpacing: "0.05em",
              marginBottom: "2rem",
              lineHeight: 1.6,
            }}
          >
            The following items were recovered from the development environment.
            Handle with appropriate clearance.
          </p>
        </motion.div>

        {/* Evidence items */}
        <div>
          {EVIDENCE_ITEMS.map((item, i) => (
            <EvidenceItem
              key={item.id}
              id={item.id}
              name={item.name}
              delay={i * 0.3}
            />
          ))}
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.3 } : {}}
          transition={{ delay: 1.8, duration: 1 }}
          style={{ marginTop: "2rem" }}
        >
          <span
            style={{
              fontSize: "9px",
              color: "var(--br-text-dim)",
              letterSpacing: "0.15em",
            }}
          >
            UNAUTHORIZED DISTRIBUTION PROHIBITED
          </span>
        </motion.div>
      </div>
    </section>
  )
}

/* ================================================================== */
/*  SECTION 5: END OF TAPE                                             */
/*  Heavy static, corruption, rewind button                            */
/* ================================================================== */
function EndOfTape() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, margin: "-100px" })
  const [staticIntensity, setStaticIntensity] = useState(0.08)

  // Intensify static the longer you stay
  useEffect(() => {
    if (!inView) {
      setStaticIntensity(0.08)
      return
    }
    const interval = setInterval(() => {
      setStaticIntensity((prev) => Math.min(prev + 0.008, 0.25))
    }, 300)
    return () => clearInterval(interval)
  }, [inView])

  const handleRewind = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  return (
    <section
      ref={ref}
      className="relative overflow-hidden flex flex-col items-center justify-center"
      style={{
        minHeight: "70vh",
        padding: "4rem 2rem",
      }}
    >
      {/* Intensifying static background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: staticIntensity,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='e'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23e)'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
          animation: "heavy-static 0.3s steps(8) infinite",
          mixBlendMode: "screen",
        }}
      />

      {/* Tracking corruption lines */}
      <motion.div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          height: "4px",
          background: "rgba(202,138,4,0.4)",
          filter: "blur(1px)",
          top: "30%",
        }}
        animate={{
          opacity: [0, 0.6, 0, 0.4, 0],
          scaleX: [1, 0.7, 1, 0.5, 1],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          height: "2px",
          background: "rgba(202,138,4,0.3)",
          top: "65%",
        }}
        animate={{
          opacity: [0, 0.5, 0, 0.3, 0],
          scaleX: [0.8, 1, 0.6, 1, 0.8],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />

      {/* Content */}
      <div className="relative text-center" style={{ zIndex: 10 }}>
        <motion.div
          className="glitch-text"
          animate={{
            opacity: [1, 0.7, 1, 0.5, 1],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <h2
            style={{
              fontSize: "clamp(1.5rem, 5vw, 3rem)",
              fontWeight: 700,
              color: "var(--br-text-bright)",
              letterSpacing: "0.2em",
              textShadow: "0 0 20px rgba(202,138,4,0.1)",
            }}
          >
            END OF TAPE
          </h2>
        </motion.div>

        {/* Rewind button */}
        <motion.button
          onClick={handleRewind}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05, borderColor: "rgba(202,138,4,0.5)" }}
          whileTap={{ scale: 0.98 }}
          style={{
            marginTop: "2.5rem",
            padding: "0.6rem 2rem",
            background: "transparent",
            border: "1px solid rgba(202,138,4,0.25)",
            color: "var(--br-accent)",
            fontSize: "11px",
            letterSpacing: "0.3em",
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "var(--br-font)",
            transition: "border-color 0.3s",
          }}
        >
          REWIND
        </motion.button>

        {/* Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1.5 }}
          style={{
            marginTop: "3rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.5rem",
          }}
        >
          <Link
            href="/"
            style={{
              fontSize: "11px",
              color: "var(--br-text-dim)",
              letterSpacing: "0.1em",
              textDecoration: "none",
              transition: "color 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#CA8A04")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#78716C")}
          >
            Portfolio
          </Link>
          <span style={{ color: "var(--br-secondary)", fontSize: "8px" }}>|</span>
          <Link
            href="/codex"
            style={{
              fontSize: "11px",
              color: "var(--br-text-dim)",
              letterSpacing: "0.1em",
              textDecoration: "none",
              transition: "color 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#CA8A04")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#78716C")}
          >
            CODEX Project
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

/* ================================================================== */
/*  RANDOM GLITCH FLASHES — ambient, unpredictable                     */
/* ================================================================== */
function AmbientGlitches() {
  const [flash, setFlash] = useState<{ x: number; y: number; w: number; h: number } | null>(null)

  useEffect(() => {
    const spawnFlash = () => {
      setFlash({
        x: Math.random() * 80,
        y: Math.random() * 100,
        w: 30 + Math.random() * 150,
        h: 3 + Math.random() * 10,
      })
      setTimeout(() => setFlash(null), 80 + Math.random() * 60)
    }

    const scheduleNext = () => {
      const delay = 4000 + Math.random() * 12000
      return setTimeout(() => {
        spawnFlash()
        timerId = scheduleNext()
      }, delay)
    }

    let timerId = scheduleNext()
    return () => clearTimeout(timerId)
  }, [])

  if (!flash) return null

  return (
    <div
      style={{
        position: "fixed",
        left: `${flash.x}%`,
        top: `${flash.y}%`,
        width: flash.w,
        height: flash.h,
        background: "var(--br-accent)",
        opacity: 0.4,
        zIndex: 197,
        pointerEvents: "none",
        mixBlendMode: "screen",
      }}
    />
  )
}

/* ================================================================== */
/*  PAGE                                                               */
/* ================================================================== */
export default function BackroomsPage() {
  const [tapeStarted, setTapeStarted] = useState(false)

  const handleTapeStarted = useCallback(() => {
    setTapeStarted(true)
  }, [])

  return (
    <div className="film-grain scanlines" style={{ background: "var(--br-bg, #0C0A09)", minHeight: "100%" }}>
      {/* Global VHS overlays */}
      <VHSBand />
      <RecIndicator visible={tapeStarted} />
      <DateStamp visible={tapeStarted} />
      <BackNav visible={tapeStarted} />
      <AmbientGlitches />

      {/* Sections */}
      <TapeOpening onTapeStarted={handleTapeStarted} />
      <WarningSection tapeStarted={tapeStarted} />
      <DescentSection />
      <TechDossier />
      <EndOfTape />
    </div>
  )
}

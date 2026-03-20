"use client"

import { useRef, useEffect, useState } from "react"
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  animate,
} from "framer-motion"
import {
  ArrowRight,
  Database,
  Terminal,
  CheckCircle,
  FileText,
  BarChart3,
  Zap,
  Shield,
  GitBranch,
  Code2,
  ChevronRight,
  ExternalLink,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  FX: Scroll-triggered reveal (elegant, no blur — government style)  */
/* ------------------------------------------------------------------ */
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
/*  FX: Word-by-word text reveal                                       */
/* ------------------------------------------------------------------ */
function TextReveal({
  text,
  className = "",
  delay = 0,
  tag: Tag = "span",
}: {
  text: string
  className?: string
  delay?: number
  tag?: "span" | "h1" | "h2" | "h3" | "p"
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const words = text.split(" ")
  return (
    <Tag ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.45,
            delay: delay + i * 0.06,
            ease: [0.25, 0.4, 0.25, 1],
          }}
          className="inline-block mr-[0.3em]"
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  )
}

/* ------------------------------------------------------------------ */
/*  FX: Animated counter                                               */
/* ------------------------------------------------------------------ */
function Counter({
  target,
  suffix = "",
  prefix = "",
  duration = 2,
}: {
  target: number
  suffix?: string
  prefix?: string
  duration?: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, target, {
      duration,
      ease: [0.25, 0.4, 0.25, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, target, duration])

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  FX: Pipeline step with sequential animation                        */
/* ------------------------------------------------------------------ */
function PipelineStep({
  icon: Icon,
  label,
  index,
  total,
  active,
}: {
  icon: React.ElementType
  label: string
  index: number
  total: number
  active: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-3 relative">
      <motion.div
        className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center relative z-10"
        initial={{ scale: 0.8, opacity: 0.3 }}
        animate={
          active
            ? {
                scale: 1,
                opacity: 1,
                backgroundColor: "rgba(13, 148, 136, 0.12)",
                borderColor: "var(--teal-600)",
              }
            : {
                scale: 0.85,
                opacity: 0.4,
                backgroundColor: "rgba(13, 148, 136, 0.04)",
                borderColor: "var(--teal-200)",
              }
        }
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ border: "2px solid" }}
      >
        <Icon
          size={28}
          style={{ color: active ? "var(--teal-600)" : "var(--teal-300)" }}
        />
      </motion.div>
      <motion.span
        className="text-xs md:text-sm font-semibold text-center max-w-[100px]"
        animate={{ opacity: active ? 1 : 0.4 }}
        transition={{ duration: 0.4 }}
        style={{ color: active ? "var(--teal-900)" : "var(--teal-400)" }}
      >
        {label}
      </motion.span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  FX: Code comparison block                                          */
/* ------------------------------------------------------------------ */
function CodeComparison() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <div ref={ref} className="grid md:grid-cols-2 gap-6 md:gap-8">
      {/* SPSS Before */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <span
            className="text-sm font-bold uppercase tracking-widest"
            style={{ color: "var(--teal-500)" }}
          >
            Before — SPSS
          </span>
        </div>
        <div className="code-block">
          <div>
            <span className="comment">* Load survey data.</span>
          </div>
          <div>
            <span className="keyword">GET FILE</span>={" "}
            <span className="string">&apos;survey_2024.sav&apos;</span>.
          </div>
          <div>
            <span className="keyword">FREQUENCIES</span>{" "}
            <span className="variable">VARIABLES</span>=age income
          </div>
          <div>
            {"  "}/
            <span className="keyword">STATISTICS</span>=
            <span className="function">MEAN MEDIAN STDDEV</span>.
          </div>
          <div>
            <span className="keyword">CROSSTABS</span>{" "}
            <span className="variable">/TABLES</span>=region{" "}
            <span className="keyword">BY</span> satisfaction
          </div>
          <div>
            {"  "}/
            <span className="keyword">CELLS</span>=
            <span className="function">COUNT ROW</span>.
          </div>
        </div>
      </motion.div>

      {/* Python After */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <span
            className="text-sm font-bold uppercase tracking-widest"
            style={{ color: "var(--teal-500)" }}
          >
            After — Python
          </span>
        </div>
        <div className="code-block">
          <div>
            <span className="keyword">import</span>{" "}
            <span className="variable">pandas</span>{" "}
            <span className="keyword">as</span> pd
          </div>
          <div>
            <span className="keyword">import</span>{" "}
            <span className="variable">pyreadstat</span>
          </div>
          <div>&nbsp;</div>
          <div>
            <span className="comment"># Load survey data</span>
          </div>
          <div>
            df, meta = <span className="function">pyreadstat.read_sav</span>(
            <span className="string">&apos;survey_2024.sav&apos;</span>)
          </div>
          <div>
            df[[<span className="string">&apos;age&apos;</span>,{" "}
            <span className="string">&apos;income&apos;</span>]].
            <span className="function">describe</span>()
          </div>
          <div>
            pd.<span className="function">crosstab</span>(df[
            <span className="string">&apos;region&apos;</span>], df[
            <span className="string">&apos;satisfaction&apos;</span>])
          </div>
        </div>
      </motion.div>
    </div>
  )
}

/* ================================================================== */
/*  MAIN PAGE                                                          */
/* ================================================================== */
export default function SPSSPage() {
  /* Pipeline animation state */
  const pipelineRef = useRef(null)
  const pipelineInView = useInView(pipelineRef, { once: true, margin: "-80px" })
  const [activeStep, setActiveStep] = useState(-1)

  useEffect(() => {
    if (!pipelineInView) return
    let step = 0
    const interval = setInterval(() => {
      setActiveStep(step)
      step++
      if (step >= 5) {
        clearInterval(interval)
        // Loop it
        setTimeout(() => {
          step = 0
          setActiveStep(-1)
          const loopInterval = setInterval(() => {
            setActiveStep(step)
            step++
            if (step >= 5) {
              clearInterval(loopInterval)
              setTimeout(() => setActiveStep(-1), 2000)
            }
          }, 600)
        }, 3000)
      }
    }, 600)
    return () => clearInterval(interval)
  }, [pipelineInView])

  /* Parallax hero */
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, 80])

  const features = [
    {
      icon: Code2,
      title: "Syntax Parsing",
      description:
        "Intelligent parser that understands SPSS syntax constructs — GET FILE, FREQUENCIES, CROSSTABS, COMPUTE, IF/ELSE, and 40+ commands.",
    },
    {
      icon: Zap,
      title: "Batch Processing",
      description:
        "Process entire directories of .sps files in one run. PowerShell orchestration handles file discovery, ordering, and dependency resolution.",
    },
    {
      icon: CheckCircle,
      title: "Validation Reports",
      description:
        "Every migration generates a detailed report comparing SPSS output with Python results. Statistical accuracy verified to 6 decimal places.",
    },
    {
      icon: Terminal,
      title: "PowerShell Orchestration",
      description:
        "Enterprise-grade batch runner with logging, error handling, and retry logic. Integrates with CBS infrastructure and CI/CD pipelines.",
    },
    {
      icon: BarChart3,
      title: "Migration Dashboard",
      description:
        "Real-time progress dashboard showing migration status, accuracy metrics, and remaining work across all CBS departments.",
    },
  ]

  const pipelineSteps = [
    { icon: FileText, label: ".sps Files" },
    { icon: Code2, label: "Parser" },
    { icon: Terminal, label: "Python Gen" },
    { icon: CheckCircle, label: "Validation" },
    { icon: Database, label: "Output" },
  ]

  const techStack = [
    {
      name: "Python",
      description: "Core migration engine",
      color: "#3776AB",
    },
    {
      name: "PowerShell",
      description: "Batch orchestration",
      color: "#012456",
    },
    {
      name: "SPSS Syntax",
      description: "Source language parser",
      color: "#CC0000",
    },
    {
      name: "pandas",
      description: "Data manipulation",
      color: "#150458",
    },
    {
      name: "pytest",
      description: "Validation framework",
      color: "#0A9EDC",
    },
    {
      name: "GitHub",
      description: "zyynx-hub/CBS-Test",
      color: "#24292E",
    },
  ]

  return (
    <main className="overflow-x-hidden" style={{ background: "var(--spss-bg, #F0FDFA)", minHeight: "100%" }}>
      {/* ============ HERO ============ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(var(--teal-400) 1px, transparent 1px),
              linear-gradient(90deg, var(--teal-400) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Floating decorative elements */}
        <motion.div
          className="absolute top-20 right-[15%] w-64 h-64 rounded-full opacity-[0.06]"
          style={{
            background:
              "radial-gradient(circle, var(--teal-400), transparent 70%)",
            y: heroY,
          }}
        />
        <motion.div
          className="absolute bottom-20 left-[10%] w-48 h-48 rounded-full opacity-[0.04]"
          style={{
            background:
              "radial-gradient(circle, var(--orange-400), transparent 70%)",
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="spss-container relative z-10 py-20">
          <div className="max-w-3xl">
            {/* CBS badge */}
            <Reveal delay={0}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-8"
                style={{
                  background: "rgba(13, 148, 136, 0.08)",
                  border: "1px solid var(--teal-200)",
                }}
              >
                <Shield size={14} style={{ color: "var(--teal-600)" }} />
                <span
                  className="text-xs font-bold uppercase tracking-[0.15em]"
                  style={{ color: "var(--teal-600)" }}
                >
                  CBS / Centraal Bureau voor de Statistiek
                </span>
              </div>
            </Reveal>

            {/* Main heading with transformation arrow */}
            <Reveal delay={0.15}>
              <h1
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-6"
                style={{ fontFamily: "var(--spss-font-heading)" }}
              >
                <span style={{ color: "var(--teal-900)" }}>SPSS</span>
                <span className="inline-flex items-center mx-3 md:mx-5 relative">
                  <motion.span
                    className="inline-block"
                    style={{ color: "var(--orange-500)" }}
                    animate={{
                      x: [0, 8, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <ArrowRight
                      size={48}
                      className="md:w-16 md:h-16"
                      strokeWidth={2.5}
                    />
                  </motion.span>
                  {/* Arrow trail effect */}
                  <motion.span
                    className="absolute left-0"
                    style={{ color: "var(--orange-400)", opacity: 0.3 }}
                    animate={{
                      x: [0, 8, 0],
                      opacity: [0.3, 0, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.15,
                    }}
                  >
                    <ArrowRight
                      size={48}
                      className="md:w-16 md:h-16"
                      strokeWidth={2.5}
                    />
                  </motion.span>
                </span>
                <span style={{ color: "var(--teal-600)" }}>Python</span>
              </h1>
            </Reveal>

            <Reveal delay={0.3}>
              <p
                className="text-lg md:text-xl max-w-xl leading-relaxed mb-10"
                style={{ color: "var(--teal-700)" }}
              >
                Automated migration toolkit for CBS statistical workflows.
                Converting thousands of legacy SPSS scripts to modern,
                maintainable Python.
              </p>
            </Reveal>

            <Reveal delay={0.45}>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://github.com/zyynx-hub/CBS-Test"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-cbs inline-flex items-center gap-2"
                >
                  View on GitHub
                  <ExternalLink size={16} />
                </a>
                <a
                  href="#pipeline"
                  className="btn-teal-outline inline-flex items-center gap-2"
                >
                  See How It Works
                  <ChevronRight size={16} />
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ THE PROBLEM ============ */}
      <section id="problem" className="spss-section">
        <div className="spss-container">
          <Reveal>
            <div className="text-center mb-12">
              <span
                className="text-sm font-bold uppercase tracking-[0.2em] mb-4 block"
                style={{ color: "var(--teal-500)" }}
              >
                The Challenge
              </span>
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
                style={{ fontFamily: "var(--spss-font-heading)" }}
              >
                Modernizing Statistical Infrastructure
              </h2>
              <p
                className="max-w-2xl mx-auto text-lg"
                style={{ color: "var(--teal-700)" }}
              >
                CBS maintains thousands of SPSS scripts powering national
                statistics. These legacy workflows need migration to Python
                for maintainability, reproducibility, and modern tooling
                support.
              </p>
            </div>
          </Reveal>

          <CodeComparison />

          <Reveal delay={0.2}>
            <div className="flex justify-center mt-10">
              <div
                className="inline-flex items-center gap-3 px-6 py-3 rounded-xl"
                style={{
                  background: "rgba(13, 148, 136, 0.06)",
                  border: "1px solid var(--teal-200)",
                }}
              >
                <CheckCircle
                  size={20}
                  style={{ color: "var(--teal-600)" }}
                />
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--teal-700)" }}
                >
                  Automated conversion preserving statistical accuracy
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section
        id="features"
        className="spss-section"
        style={{ background: "rgba(13, 148, 136, 0.03)" }}
      >
        <div className="spss-container">
          <Reveal>
            <div className="text-center mb-14">
              <span
                className="text-sm font-bold uppercase tracking-[0.2em] mb-4 block"
                style={{ color: "var(--teal-500)" }}
              >
                Capabilities
              </span>
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold"
                style={{ fontFamily: "var(--spss-font-heading)" }}
              >
                Enterprise-Grade Migration
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Reveal key={feature.title} delay={i * 0.1}>
                <div className="gov-card p-6 md:p-8 h-full">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{
                      background: "rgba(13, 148, 136, 0.08)",
                      border: "1px solid var(--teal-200)",
                    }}
                  >
                    <feature.icon
                      size={22}
                      style={{ color: "var(--teal-600)" }}
                    />
                  </div>
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{ fontFamily: "var(--spss-font-heading)" }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--teal-700)" }}
                  >
                    {feature.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ MIGRATION PIPELINE ============ */}
      <section id="pipeline" className="spss-section" ref={pipelineRef}>
        <div className="spss-container">
          <Reveal>
            <div className="text-center mb-14">
              <span
                className="text-sm font-bold uppercase tracking-[0.2em] mb-4 block"
                style={{ color: "var(--teal-500)" }}
              >
                How It Works
              </span>
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold"
                style={{ fontFamily: "var(--spss-font-heading)" }}
              >
                Migration Pipeline
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div
              className="gov-card p-8 md:p-12"
              style={{ border: "1px solid var(--teal-200)" }}
            >
              {/* Pipeline steps */}
              <div className="flex items-start justify-between gap-2 md:gap-4 relative">
                {/* Connection line */}
                <div className="absolute top-8 md:top-10 left-[10%] right-[10%] h-[2px]">
                  <div
                    className="h-full rounded-full"
                    style={{ background: "var(--teal-100)" }}
                  />
                  <motion.div
                    className="absolute top-0 left-0 h-full rounded-full"
                    style={{ background: "var(--teal-500)" }}
                    animate={{
                      width:
                        activeStep >= 0
                          ? `${Math.min((activeStep / 4) * 100, 100)}%`
                          : "0%",
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>

                {pipelineSteps.map((step, i) => (
                  <PipelineStep
                    key={step.label}
                    icon={step.icon}
                    label={step.label}
                    index={i}
                    total={pipelineSteps.length}
                    active={i <= activeStep}
                  />
                ))}
              </div>

              {/* Pipeline description */}
              <motion.div
                className="mt-10 pt-8 text-center"
                style={{ borderTop: "1px solid var(--teal-100)" }}
                initial={{ opacity: 0 }}
                animate={pipelineInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <p
                  className="text-sm max-w-lg mx-auto"
                  style={{ color: "var(--teal-600)" }}
                >
                  Each .sps file flows through the automated pipeline. The
                  parser extracts SPSS commands, the generator produces
                  equivalent Python, and the validator confirms statistical
                  parity.
                </p>
              </motion.div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section
        className="spss-section"
        style={{ background: "rgba(13, 148, 136, 0.03)" }}
      >
        <div className="spss-container">
          <Reveal>
            <div className="text-center mb-14">
              <span
                className="text-sm font-bold uppercase tracking-[0.2em] mb-4 block"
                style={{ color: "var(--teal-500)" }}
              >
                Impact
              </span>
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold"
                style={{ fontFamily: "var(--spss-font-heading)" }}
              >
                Results That Matter
              </h2>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                value: 1000,
                suffix: "+",
                label: "Scripts Migrated",
                description: "SPSS files converted to Python",
              },
              {
                value: 95,
                suffix: "%",
                label: "Accuracy Rate",
                description: "Statistical output parity verified",
              },
              {
                value: 3,
                suffix: "x",
                label: "Faster Than Manual",
                description: "Compared to hand-rewriting",
              },
            ].map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.15}>
                <div className="text-center">
                  <div
                    className="text-5xl md:text-6xl font-bold mb-2"
                    style={{
                      fontFamily: "var(--spss-font-heading)",
                      color: "var(--teal-600)",
                    }}
                  >
                    <Counter
                      target={stat.value}
                      suffix={stat.suffix}
                      duration={2.5}
                    />
                  </div>
                  <div
                    className="text-lg font-bold mb-1"
                    style={{ color: "var(--teal-900)" }}
                  >
                    {stat.label}
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: "var(--teal-600)" }}
                  >
                    {stat.description}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TECH STACK ============ */}
      <section id="tech" className="spss-section">
        <div className="spss-container">
          <Reveal>
            <div className="text-center mb-14">
              <span
                className="text-sm font-bold uppercase tracking-[0.2em] mb-4 block"
                style={{ color: "var(--teal-500)" }}
              >
                Technology
              </span>
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold"
                style={{ fontFamily: "var(--spss-font-heading)" }}
              >
                Built With
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto">
            {techStack.map((tech, i) => (
              <Reveal key={tech.name} delay={i * 0.08}>
                <motion.div
                  className="gov-card p-5 md:p-6 text-center group cursor-default"
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div
                    className="w-10 h-10 rounded-lg mx-auto mb-3 flex items-center justify-center transition-colors duration-300"
                    style={{
                      background: `${tech.color}15`,
                      border: `1px solid ${tech.color}30`,
                    }}
                  >
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{ background: tech.color }}
                    />
                  </div>
                  <h4
                    className="font-bold text-sm mb-1"
                    style={{ color: "var(--teal-900)" }}
                  >
                    {tech.name}
                  </h4>
                  <p
                    className="text-xs"
                    style={{ color: "var(--teal-600)" }}
                  >
                    {tech.description}
                  </p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer
        className="py-12"
        style={{
          borderTop: "1px solid var(--teal-100)",
          background: "rgba(13, 148, 136, 0.02)",
        }}
      >
        <div className="spss-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Shield size={18} style={{ color: "var(--teal-500)" }} />
              <span
                className="text-sm font-semibold"
                style={{ color: "var(--teal-700)" }}
              >
                SPSS-Migratie
              </span>
              <span className="text-sm" style={{ color: "var(--teal-400)" }}>
                |
              </span>
              <span className="text-sm" style={{ color: "var(--teal-500)" }}>
                CBS Migration Toolkit
              </span>
            </div>

            <div className="flex items-center gap-6">
              <a
                href="https://github.com/zyynx-hub/CBS-Test"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm flex items-center gap-1.5 transition-colors duration-200"
                style={{ color: "var(--teal-500)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--teal-700)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--teal-500)")
                }
              >
                <GitBranch size={14} />
                GitHub
              </a>
              <span className="text-xs" style={{ color: "var(--teal-400)" }}>
                Built for CBS / Centraal Bureau voor de Statistiek
              </span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

"use client"

import { useRef, useEffect, useState } from "react"
import {
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion"
import {
  FileText,
  Map,
  Users,
  Calendar,
  BookOpen,
  GraduationCap,
  Lightbulb,
  FlaskConical,
  Presentation,
  Wrench,
  Library,
  ChevronRight,
  ArrowUpRight,
  Search,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  FX: Elegant academic reveal (subtle y + opacity, no blur)          */
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
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  FX: Word-by-word academic text reveal (opacity + slight y only)    */
/* ------------------------------------------------------------------ */
function AcademicTextReveal({
  text,
  className = "",
  delay = 0,
}: {
  text: string
  className?: string
  delay?: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const words = text.split(" ")
  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.4,
            delay: delay + i * 0.05,
            ease: [0.25, 0.4, 0.25, 1],
          }}
          className="inline-block mr-[0.28em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  FX: DOT Framework circle node                                      */
/* ------------------------------------------------------------------ */
function DotNode({
  icon: Icon,
  label,
  description,
  index,
  total,
  isCenter,
}: {
  icon: React.ElementType
  label: string
  description: string
  index: number
  total: number
  isCenter?: boolean
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center text-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.12,
        ease: [0.25, 0.4, 0.25, 1],
      }}
    >
      <motion.div
        className="relative mb-4"
        whileHover={{ scale: 1.08 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: index * 0.12 + 0.2 }}
          style={{
            border: isCenter
              ? "2px solid var(--s6-blue-600)"
              : "1px solid var(--s6-zinc-200)",
            width: isCenter ? 88 : 76,
            height: isCenter ? 88 : 76,
          }}
        />
        <div
          className="relative z-10 flex items-center justify-center rounded-full"
          style={{
            width: isCenter ? 88 : 76,
            height: isCenter ? 88 : 76,
            background: isCenter
              ? "rgba(37, 99, 235, 0.06)"
              : "var(--s6-bg-card)",
            border: isCenter
              ? "2px solid var(--s6-blue-600)"
              : "1px solid var(--s6-zinc-200)",
          }}
        >
          <Icon
            size={isCenter ? 28 : 24}
            style={{
              color: isCenter
                ? "var(--s6-blue-600)"
                : "var(--s6-zinc-600)",
            }}
          />
        </div>
      </motion.div>
      <h4
        className="text-sm font-bold mb-1"
        style={{
          fontFamily: "var(--s6-font-heading)",
          color: isCenter ? "var(--s6-blue-600)" : "var(--s6-text)",
        }}
      >
        {label}
      </h4>
      <p
        className="text-xs max-w-[140px] leading-relaxed"
        style={{ color: "var(--s6-text-muted)" }}
      >
        {description}
      </p>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  FX: Timeline sprint node                                           */
/* ------------------------------------------------------------------ */
function TimelineNode({
  sprint,
  title,
  description,
  index,
  isActive,
}: {
  sprint: string
  title: string
  description: string
  index: number
  isActive: boolean
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center text-center min-w-[160px] md:min-w-[200px]"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.15,
        ease: [0.25, 0.4, 0.25, 1],
      }}
    >
      {/* Dot */}
      <motion.div
        className="relative z-10 mb-4"
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{
          duration: 0.4,
          delay: index * 0.15 + 0.1,
          type: "spring",
          stiffness: 300,
        }}
      >
        <div
          className="w-4 h-4 rounded-full transition-all duration-500"
          style={{
            background: isActive
              ? "var(--s6-blue-600)"
              : "var(--s6-zinc-300)",
            boxShadow: isActive
              ? "0 0 0 4px rgba(37, 99, 235, 0.15), 0 0 16px rgba(37, 99, 235, 0.2)"
              : "0 0 0 3px var(--s6-bg)",
          }}
        />
      </motion.div>

      {/* Content */}
      <span
        className="text-xs font-bold uppercase tracking-[0.15em] mb-1"
        style={{
          color: isActive ? "var(--s6-blue-600)" : "var(--s6-text-muted)",
        }}
      >
        {sprint}
      </span>
      <h4
        className="text-sm font-bold mb-1"
        style={{
          fontFamily: "var(--s6-font-heading)",
          color: isActive ? "var(--s6-text)" : "var(--s6-zinc-500)",
        }}
      >
        {title}
      </h4>
      <p
        className="text-xs leading-relaxed max-w-[180px]"
        style={{
          color: isActive ? "var(--s6-text-body)" : "var(--s6-zinc-400)",
        }}
      >
        {description}
      </p>
    </motion.div>
  )
}

/* ================================================================== */
/*  MAIN PAGE                                                          */
/* ================================================================== */
export default function Semester6Page() {
  /* Timeline scroll activation */
  const timelineRef = useRef(null)
  const timelineInView = useInView(timelineRef, { once: true, margin: "-80px" })
  const [activeSprint, setActiveSprint] = useState(-1)

  useEffect(() => {
    if (!timelineInView) return
    let current = 0
    const interval = setInterval(() => {
      setActiveSprint(current)
      current++
      if (current > 4) clearInterval(interval)
    }, 500)
    return () => clearInterval(interval)
  }, [timelineInView])

  const { scrollY } = useScroll()
  const heroParallax = useTransform(scrollY, [0, 400], [0, 60])

  const researchAreas = [
    {
      icon: FileText,
      title: "Document Analysis",
      description:
        "Systematic analysis of existing documentation, standards, and technical specifications relevant to the project scope.",
      method: "Library Research",
    },
    {
      icon: Map,
      title: "Landscape Analysis",
      description:
        "Mapping the current technological landscape, competitor analysis, and identifying opportunities for innovation.",
      method: "Library Research",
    },
    {
      icon: Users,
      title: "Interviews",
      description:
        "Semi-structured interviews with stakeholders, domain experts, and end users to gather qualitative insights.",
      method: "Field Research",
    },
    {
      icon: Calendar,
      title: "Sprint Documentation",
      description:
        "Agile sprint logs documenting iterative development, retrospectives, and incremental deliverables.",
      method: "Workshop",
    },
  ]

  const dotFramework = [
    {
      icon: Library,
      label: "Library",
      description: "Literature study & document analysis",
    },
    {
      icon: Search,
      label: "Field",
      description: "Interviews, surveys & observations",
    },
    {
      icon: FlaskConical,
      label: "Lab",
      description: "Prototyping & technical experiments",
      isCenter: true,
    },
    {
      icon: Presentation,
      label: "Showroom",
      description: "Peer reviews & expert validation",
    },
    {
      icon: Wrench,
      label: "Workshop",
      description: "Iterative building & testing",
    },
  ]

  const sprints = [
    {
      sprint: "Sprint 1",
      title: "Foundation",
      description: "Research setup, stakeholder interviews, initial analysis",
    },
    {
      sprint: "Sprint 2",
      title: "Exploration",
      description: "Landscape analysis, document deep-dives, prototyping",
    },
    {
      sprint: "Sprint 3",
      title: "Development",
      description: "Core implementation, iterative testing, field validation",
    },
    {
      sprint: "Sprint 4",
      title: "Refinement",
      description: "Polish, expert review, final adjustments",
    },
    {
      sprint: "Sprint 5",
      title: "Delivery",
      description: "Documentation, presentation, final submission",
    },
  ]

  const skills = [
    "React / Next.js",
    "TypeScript",
    "Python",
    "Research Methods",
    "DOT Framework",
    "Agile / Scrum",
    "UX Research",
    "Technical Writing",
    "Data Analysis",
    "Stakeholder Management",
    "System Design",
    "GDScript / Godot",
    "Presentation Skills",
    "Git / Version Control",
  ]

  return (
    <main className="overflow-x-hidden paper-texture" style={{ background: "var(--s6-bg, #FAFAFA)", minHeight: "100%" }}>
      {/* ============ HERO ============ */}
      <section className="relative min-h-[85vh] flex items-center">
        {/* Subtle decorative line */}
        <div
          className="absolute left-[12%] top-0 bottom-0 w-px opacity-[0.06]"
          style={{ background: "var(--s6-zinc-900)" }}
        />
        <div
          className="absolute left-[13%] top-0 bottom-0 w-px opacity-[0.03]"
          style={{ background: "var(--s6-zinc-900)" }}
        />

        <motion.div className="s6-container relative z-10 py-20" style={{ y: heroParallax }}>
          <div className="max-w-2xl">
            {/* Academic badge */}
            <Reveal delay={0}>
              <div className="inline-flex items-center gap-2 mb-8">
                <GraduationCap
                  size={18}
                  style={{ color: "var(--s6-blue-600)" }}
                />
                <span
                  className="text-xs font-bold uppercase tracking-[0.2em]"
                  style={{ color: "var(--s6-zinc-500)" }}
                >
                  HBO-ICT &middot; Graduation Portfolio
                </span>
              </div>
            </Reveal>

            {/* Main heading — elegant serif */}
            <Reveal delay={0.1}>
              <h1
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-[0.9] mb-4"
                style={{ fontFamily: "var(--s6-font-heading)" }}
              >
                <AcademicTextReveal text="Semester" delay={0.2} />
                <br />
                <span className="relative">
                  <AcademicTextReveal
                    text="6"
                    delay={0.7}
                    className="inline-block"
                  />
                  {/* Decorative underline */}
                  <motion.span
                    className="absolute -bottom-2 left-0 h-[3px] rounded-full"
                    style={{ background: "var(--s6-blue-600)" }}
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{
                      duration: 0.8,
                      delay: 1.0,
                      ease: [0.25, 0.4, 0.25, 1],
                    }}
                  />
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.4}>
              <p
                className="text-lg md:text-xl leading-relaxed mt-8 max-w-lg"
                style={{
                  fontFamily: "var(--s6-font-body)",
                  color: "var(--s6-text-body)",
                }}
              >
                A structured research portfolio documenting my graduation
                semester at HBO-ICT, guided by the DOT Framework methodology.
              </p>
            </Reveal>

            <Reveal delay={0.55}>
              <div className="flex items-center gap-2 mt-8">
                <a
                  href="#research"
                  className="btn-academic inline-flex items-center gap-2"
                  style={{ fontFamily: "var(--s6-font-body)" }}
                >
                  Explore Research
                  <ChevronRight size={16} />
                </a>
              </div>
            </Reveal>
          </div>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="s6-container">
        <div className="s6-divider" />
      </div>

      {/* ============ ABOUT ============ */}
      <section id="about" className="s6-section">
        <div className="s6-container">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <Reveal>
              <div>
                <span
                  className="text-xs font-bold uppercase tracking-[0.2em] mb-4 block"
                  style={{ color: "var(--s6-text-muted)" }}
                >
                  About This Project
                </span>
                <h2
                  className="text-3xl md:text-4xl font-bold mb-6"
                  style={{ fontFamily: "var(--s6-font-heading)" }}
                >
                  Research-Driven Development
                </h2>
                <p
                  className="leading-relaxed mb-6"
                  style={{
                    fontFamily: "var(--s6-font-body)",
                    color: "var(--s6-text-body)",
                  }}
                >
                  This portfolio documents a semester of applied research using
                  the DOT Framework — a structured methodology for practice-based
                  research in ICT. Each research activity is categorized into one
                  of five strategies: Library, Field, Lab, Showroom, and Workshop.
                </p>
                <p
                  className="leading-relaxed"
                  style={{
                    fontFamily: "var(--s6-font-body)",
                    color: "var(--s6-text-body)",
                  }}
                >
                  The project combines theoretical investigation with hands-on
                  prototyping, stakeholder interviews, and iterative development
                  sprints — ensuring every decision is grounded in evidence.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div>
                <blockquote className="pull-quote mb-8">
                  &ldquo;Good research is not about finding answers — it is about
                  asking better questions and validating assumptions
                  systematically.&rdquo;
                </blockquote>
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: "rgba(37, 99, 235, 0.08)",
                      border: "1px solid rgba(37, 99, 235, 0.15)",
                    }}
                  >
                    <BookOpen
                      size={18}
                      style={{ color: "var(--s6-blue-600)" }}
                    />
                  </div>
                  <div>
                    <span
                      className="text-sm font-bold block"
                      style={{ color: "var(--s6-text)" }}
                    >
                      DOT Framework
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: "var(--s6-text-muted)" }}
                    >
                      HBO-ICT Research Methodology
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="s6-container">
        <div className="s6-divider" />
      </div>

      {/* ============ RESEARCH AREAS ============ */}
      <section id="research" className="s6-section">
        <div className="s6-container">
          <Reveal>
            <div className="text-center mb-14">
              <span
                className="text-xs font-bold uppercase tracking-[0.2em] mb-4 block"
                style={{ color: "var(--s6-text-muted)" }}
              >
                Research Streams
              </span>
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold"
                style={{ fontFamily: "var(--s6-font-heading)" }}
              >
                Four Pillars of Inquiry
              </h2>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-5 md:gap-6 max-w-3xl mx-auto">
            {researchAreas.map((area, i) => (
              <Reveal key={area.title} delay={i * 0.1}>
                <motion.div
                  className="academic-card p-6 md:p-8 h-full group cursor-default"
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        background: "rgba(37, 99, 235, 0.06)",
                        border: "1px solid rgba(37, 99, 235, 0.1)",
                      }}
                    >
                      <area.icon
                        size={20}
                        style={{ color: "var(--s6-blue-600)" }}
                      />
                    </div>
                    <div>
                      <h3
                        className="text-lg font-bold mb-1"
                        style={{ fontFamily: "var(--s6-font-heading)" }}
                      >
                        {area.title}
                      </h3>
                      <span
                        className="text-xs uppercase tracking-[0.1em]"
                        style={{ color: "var(--s6-blue-600)" }}
                      >
                        {area.method}
                      </span>
                    </div>
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      fontFamily: "var(--s6-font-body)",
                      color: "var(--s6-text-body)",
                    }}
                  >
                    {area.description}
                  </p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ DOT FRAMEWORK ============ */}
      <section
        id="methodology"
        className="s6-section"
        style={{ background: "var(--s6-zinc-100)" }}
      >
        <div className="s6-container">
          <Reveal>
            <div className="text-center mb-14">
              <span
                className="text-xs font-bold uppercase tracking-[0.2em] mb-4 block"
                style={{ color: "var(--s6-text-muted)" }}
              >
                Methodology
              </span>
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
                style={{ fontFamily: "var(--s6-font-heading)" }}
              >
                DOT Framework
              </h2>
              <p
                className="max-w-xl mx-auto text-sm"
                style={{
                  fontFamily: "var(--s6-font-body)",
                  color: "var(--s6-text-body)",
                }}
              >
                Design-Oriented Triangulation — five complementary research
                strategies ensuring comprehensive, validated results.
              </p>
            </div>
          </Reveal>

          {/* Framework circles */}
          <div className="relative max-w-3xl mx-auto">
            {/* Connection lines (visible on md+) */}
            <svg
              className="absolute inset-0 w-full h-full hidden md:block pointer-events-none"
              viewBox="0 0 800 200"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Lines connecting all nodes to center */}
              {[0, 1, 3, 4].map((i) => {
                const positions = [
                  { x: 80, y: 100 },
                  { x: 240, y: 100 },
                  { x: 400, y: 100 },
                  { x: 560, y: 100 },
                  { x: 720, y: 100 },
                ]
                const center = positions[2]
                const node = positions[i]
                return (
                  <motion.line
                    key={i}
                    x1={center.x}
                    y1={center.y}
                    x2={node.x}
                    y2={node.y}
                    stroke="var(--s6-zinc-300)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.5 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.8,
                      delay: 0.5 + i * 0.1,
                      ease: "easeOut",
                    }}
                  />
                )
              })}
            </svg>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-4 relative z-10">
              {dotFramework.map((item, i) => (
                <DotNode
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  description={item.description}
                  index={i}
                  total={dotFramework.length}
                  isCenter={item.isCenter}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ TIMELINE ============ */}
      <section id="timeline" className="s6-section" ref={timelineRef}>
        <div className="s6-container">
          <Reveal>
            <div className="text-center mb-14">
              <span
                className="text-xs font-bold uppercase tracking-[0.2em] mb-4 block"
                style={{ color: "var(--s6-text-muted)" }}
              >
                Progress
              </span>
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold"
                style={{ fontFamily: "var(--s6-font-heading)" }}
              >
                Semester Timeline
              </h2>
            </div>
          </Reveal>

          {/* Horizontal scrollable timeline */}
          <div className="relative">
            {/* Base line */}
            <div className="absolute top-[7px] left-0 right-0 h-[2px]">
              <div
                className="h-full rounded-full"
                style={{ background: "var(--s6-zinc-200)" }}
              />
              <motion.div
                className="absolute top-0 left-0 h-full rounded-full"
                style={{ background: "var(--s6-blue-600)" }}
                animate={{
                  width:
                    activeSprint >= 0
                      ? `${Math.min(((activeSprint + 1) / sprints.length) * 100, 100)}%`
                      : "0%",
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>

            <div className="flex justify-between gap-4 overflow-x-auto pb-4 pt-0">
              {sprints.map((sprint, i) => (
                <TimelineNode
                  key={sprint.sprint}
                  sprint={sprint.sprint}
                  title={sprint.title}
                  description={sprint.description}
                  index={i}
                  isActive={i <= activeSprint}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="s6-container">
        <div className="s6-divider" />
      </div>

      {/* ============ SKILLS ============ */}
      <section id="skills" className="s6-section">
        <div className="s6-container">
          <Reveal>
            <div className="text-center mb-14">
              <span
                className="text-xs font-bold uppercase tracking-[0.2em] mb-4 block"
                style={{ color: "var(--s6-text-muted)" }}
              >
                Competencies
              </span>
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold"
                style={{ fontFamily: "var(--s6-font-heading)" }}
              >
                Skills Developed
              </h2>
            </div>
          </Reveal>

          <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
            {skills.map((skill, i) => (
              <Reveal key={skill} delay={i * 0.04}>
                <motion.span
                  className="px-4 py-2 rounded-lg text-sm cursor-default"
                  style={{
                    background: "var(--s6-bg-card)",
                    border: "1px solid var(--s6-border)",
                    color: "var(--s6-text-body)",
                    fontFamily: "var(--s6-font-body)",
                  }}
                  whileHover={{
                    borderColor: "var(--s6-blue-600)",
                    color: "var(--s6-blue-600)",
                    y: -2,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  {skill}
                </motion.span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer
        className="py-10"
        style={{
          borderTop: "1px solid var(--s6-border)",
        }}
      >
        <div className="s6-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <GraduationCap
                size={16}
                style={{ color: "var(--s6-text-muted)" }}
              />
              <span
                className="text-sm"
                style={{
                  fontFamily: "var(--s6-font-heading)",
                  color: "var(--s6-text)",
                }}
              >
                Semester 6
              </span>
              <span
                className="text-xs"
                style={{ color: "var(--s6-text-muted)" }}
              >
                HBO-ICT Graduation Portfolio
              </span>
            </div>

            <span
              className="text-xs"
              style={{ color: "var(--s6-text-muted)" }}
            >
              DOT Framework &middot; Applied Research &middot; 2026
            </span>
          </div>
        </div>
      </footer>
    </main>
  )
}

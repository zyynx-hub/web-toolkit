"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import Image from "next/image"
import { motion, useInView, useScroll, useMotionValue, useSpring, AnimatePresence } from "framer-motion"
import {
  Phone, Mail, MapPin, Clock, Star, ArrowRight, Menu, X,
  Scissors, Heart, ChevronRight, Facebook, Award
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  FX: Scroll-triggered reveal with blur                              */
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
/*  FX: Image clip-path reveal on scroll                               */
/* ------------------------------------------------------------------ */
function ImageReveal({ src, alt, className = "", delay = 0 }: {
  src: string; alt: string; className?: string; delay?: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  return (
    <motion.div
      ref={ref}
      initial={{ clipPath: "inset(0 100% 0 0)" }}
      animate={inView ? { clipPath: "inset(0 0% 0 0)" } : {}}
      transition={{ duration: 1.2, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      <motion.div
        initial={{ scale: 1.3 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 1.6, delay, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <Image src={src} alt={alt} width={640} height={480} className="w-full h-full object-cover" />
      </motion.div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  FX: Magnetic button                                                */
/* ------------------------------------------------------------------ */
function MagneticButton({ children, className = "", href = "#" }: {
  children: React.ReactNode; className?: string; href?: string
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const springX = useSpring(mx, { stiffness: 200, damping: 20 })
  const springY = useSpring(my, { stiffness: 200, damping: 20 })

  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    mx.set((e.clientX - rect.left - rect.width / 2) * 0.3)
    my.set((e.clientY - rect.top - rect.height / 2) * 0.3)
  }, [mx, my])

  const onLeave = useCallback(() => { mx.set(0); my.set(0) }, [mx, my])

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className={className}
    >
      {children}
    </motion.a>
  )
}

/* ------------------------------------------------------------------ */
/*  FX: Scroll progress bar                                            */
/* ------------------------------------------------------------------ */
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left"
      style={{ scaleX, background: "linear-gradient(90deg, var(--accent), #D4A849)" }}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  FX: Animated counter                                               */
/* ------------------------------------------------------------------ */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const count = useMotionValue(0)
  const springCount = useSpring(count, { duration: 2000 })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (inView) count.set(target)
  }, [inView, count, target])

  useEffect(() => {
    const unsubscribe = springCount.on("change", v => setDisplay(Math.round(v)))
    return unsubscribe
  }, [springCount])

  return <span ref={ref}>{display}{suffix}</span>
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
const hours = [
  { day: "Maandag", time: "Gesloten", closed: true },
  { day: "Dinsdag", time: "09:00 – 18:00" },
  { day: "Woensdag", time: "09:00 – 18:00" },
  { day: "Donderdag", time: "09:00 – 18:00" },
  { day: "Vrijdag", time: "09:00 – 18:00" },
  { day: "Zaterdag", time: "09:00 – 16:00" },
  { day: "Zondag", time: "Gesloten", closed: true },
]

const services: Record<string, { name: string; price: string; popular?: boolean }[]> = {
  Dames: [
    { name: "Knippen en drogen", price: "€20,50", popular: true },
    { name: "Pony knippen", price: "€5,00" },
    { name: "Föhnen", price: "v.a. €22,50" },
    { name: "Watergolf", price: "€22,50" },
    { name: "Stijlen", price: "v.a. €19,50" },
    { name: "Krullen", price: "v.a. €22,50" },
    { name: "Opsteken", price: "v.a. €29,50" },
    { name: "Vlechten", price: "v.a. €15,00" },
  ],
  Heren: [
    { name: "Knippen", price: "€20,50", popular: true },
    { name: "Knippen + figuren inscheren", price: "v.a. €22,50" },
    { name: "Tondeuse 1 lengte", price: "€15,00" },
    { name: "Tondeuse 2 lengtes", price: "€17,50" },
  ],
  Verven: [
    { name: "Uitgroei verven", price: "v.a. €35,50", popular: true },
    { name: "Verven helemaal", price: "v.a. €39,50" },
    { name: "Kleurspoeling", price: "v.a. €19,50" },
    { name: "Folies high/lowlights", price: "v.a. €59,50" },
    { name: "Blonderen", price: "v.a. €25,00" },
    { name: "Coup soleil/kopstrepen", price: "v.a. €19,50" },
  ],
  Kids: [
    { name: "Knippen", price: "€14,50", popular: true },
    { name: "Knippen + figuren inscheren", price: "v.a. €16,00" },
  ],
  Overig: [
    { name: "Permanenten incl. knippen/drogen", price: "€79,50" },
    { name: "Permanenten incl. knippen + föhnen", price: "€89,50" },
    { name: "Extensions, per stuk", price: "€4,45" },
    { name: "Extensions, compleet (100 st.)", price: "€445,00" },
    { name: "Epileren", price: "€10,00" },
    { name: "Wenkbrauwen verven", price: "€10,00" },
  ],
}

const reviews = [
  {
    name: "Sandra M.",
    text: "Al jaren vaste klant bij Brenda en ik ga nergens anders meer heen. Ze luistert echt naar wat je wilt en het resultaat is altijd prachtig.",
  },
  {
    name: "Patrick V.",
    text: "Mijn kinderen gaan hier super graag naartoe. Brenda heeft veel geduld en maakt er altijd iets moois van. Aanrader voor het hele gezin!",
  },
  {
    name: "Lisa D.",
    text: "Eindelijk een kapper die begrijpt wat ik bedoel! Geweldige kleurtechnieken en heel persoonlijk advies. Voelt elke keer als een verwenmomentje.",
  },
]

/* ------------------------------------------------------------------ */
/*  NAV                                                                */
/* ------------------------------------------------------------------ */
function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const links = [
    { label: "Over Ons", href: "#about" },
    { label: "Diensten", href: "#services" },
    { label: "Sfeer", href: "#gallery" },
    { label: "Reviews", href: "#reviews" },
    { label: "Contact", href: "#contact" },
  ]

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(245,241,236,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,0,0,0.06)" : "1px solid transparent",
      }}
    >
      <div className="s-container flex items-center justify-between h-16">
        <a href="#" className="flex items-center gap-1">
          <span style={{
            fontFamily: "var(--font-heading)",
            fontSize: 18,
            fontWeight: 600,
            color: scrolled ? "var(--text)" : "white",
            transition: "color 0.4s",
          }}>
            Brenda&apos;s <span style={{ color: "var(--accent)" }}>Hairstyle</span>
          </span>
        </a>
        <div className="hidden md:flex items-center gap-7">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13px] font-medium transition-colors duration-300"
              style={{ color: scrolled ? "var(--text-body)" : "rgba(255,255,255,0.8)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent)" }}
              onMouseLeave={(e) => { e.currentTarget.style.color = scrolled ? "var(--text-body)" : "rgba(255,255,255,0.8)" }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="tel:+31455117476"
            className="text-[13px] font-medium px-5 py-2 rounded-full transition-all duration-300"
            style={{
              background: scrolled ? "var(--text)" : "rgba(255,255,255,0.15)",
              color: scrolled ? "white" : "rgba(255,255,255,0.9)",
              backdropFilter: scrolled ? "none" : "blur(8px)",
              border: scrolled ? "none" : "1px solid rgba(255,255,255,0.2)",
            }}
          >
            Afspraak Maken
          </a>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 cursor-pointer"
          style={{ color: scrolled ? "var(--text)" : "white" }}
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden px-6 pb-6 flex flex-col gap-3 overflow-hidden"
            style={{ background: "var(--bg)" }}
          >
            {links.map(l => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-base font-medium py-2" style={{ color: "var(--text-body)" }}>
                {l.label}
              </a>
            ))}
            <a href="tel:+31455117476" className="btn-primary text-center" style={{ padding: "12px 24px", fontSize: 14 }}>
              Afspraak Maken
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

/* ------------------------------------------------------------------ */
/*  HERO — Full-width editorial hero with warm overlay photo           */
/* ------------------------------------------------------------------ */
function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      {/* Background image with warm overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/brenda/salon1.jpg"
          alt="Interieur Brenda's Hairstyle"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(180deg, rgba(26,26,26,0.35) 0%, rgba(26,26,26,0.55) 50%, rgba(26,26,26,0.7) 100%)",
        }} />
        {/* Warm overlay tint */}
        <div className="absolute inset-0" style={{
          background: "rgba(184,134,11,0.08)",
          mixBlendMode: "multiply",
        }} />
      </div>

      <div className="s-container relative z-10 w-full" style={{ paddingTop: "clamp(8rem, 14vw, 12rem)", paddingBottom: "clamp(6rem, 10vw, 8rem)" }}>
        <div style={{ maxWidth: 720 }}>
          <Reveal>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: "rgba(255,255,255,0.6)", letterSpacing: "0.2em" }}>
              Kapsalon Hoensbroek
            </span>
          </Reveal>

          <Reveal delay={0.2}>
            <h1 style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(3rem, 6vw, 4.5rem)",
              lineHeight: 1.1,
              color: "white",
              fontStyle: "italic",
              fontWeight: 500,
            }}>
              Jouw haar,<br />onze passie.
            </h1>
          </Reveal>

          <Reveal delay={0.5}>
            <p className="mt-6 text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.8)", maxWidth: 480 }}>
              Al meer dan 15 jaar de vertrouwde kapper in Hoensbroek.
              Persoonlijk advies, vakmanschap en altijd met liefde voor het vak.
            </p>
          </Reveal>

          <Reveal delay={0.7}>
            <div className="flex flex-wrap gap-4 mt-10">
              <MagneticButton href="tel:+31455117476" className="btn-primary flex items-center gap-2" >
                Afspraak Maken <ArrowRight size={16} />
              </MagneticButton>
              <MagneticButton href="#services" className="flex items-center gap-2 px-7 py-3.5 rounded-full font-medium text-sm cursor-pointer" >
                <span style={{ color: "white", border: "1.5px solid rgba(255,255,255,0.35)", borderRadius: 999, padding: "12px 30px", display: "flex", alignItems: "center", gap: 8, backdropFilter: "blur(4px)", background: "rgba(255,255,255,0.08)" }}>
                  Bekijk Diensten <ChevronRight size={16} />
                </span>
              </MagneticButton>
            </div>
          </Reveal>

          {/* Stats row */}
          <Reveal delay={0.9}>
            <div className="flex flex-wrap items-center gap-8 mt-14">
              {[
                { value: <Counter target={15} suffix="+" />, label: "Jaar Ervaring" },
                { value: <Counter target={5000} suffix="+" />, label: "Tevreden Klanten" },
                { value: <><span className="flex gap-0.5 mb-0.5">{[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#B8860B" stroke="none" />)}</span></>, label: "Google Reviews" },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col" style={{ borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.2)" : "none", paddingLeft: i > 0 ? 32 : 0 }}>
                  <span style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "white", fontWeight: 600 }}>
                    {stat.value}
                  </span>
                  <span className="text-xs uppercase tracking-wider mt-1" style={{ color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em" }}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>Scroll</span>
        <motion.div
          className="w-px h-8"
          style={{ background: "rgba(255,255,255,0.3)" }}
          animate={{ scaleY: [0, 1, 0], originY: 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  USP STRIP — Three selling points with separator lines              */
/* ------------------------------------------------------------------ */
function UspStrip() {
  const usps = [
    { icon: Heart, title: "Persoonlijk advies", desc: "Elk bezoek begint met een goed gesprek" },
    { icon: Award, title: "Premium producten", desc: "Uitsluitend professionele merken" },
    { icon: Scissors, title: "15+ jaar ervaring", desc: "Vakmanschap waar je op kunt vertrouwen" },
  ]
  return (
    <section style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border)" }}>
      <div className="s-container" style={{ padding: "clamp(2.5rem, 5vw, 3.5rem) clamp(1.25rem, 4vw, 3rem)" }}>
        <div className="grid md:grid-cols-3 gap-0">
          {usps.map((usp, i) => (
            <Reveal key={usp.title} delay={i * 0.12}>
              <div
                className="flex items-center gap-4 py-4 md:py-0"
                style={{
                  paddingLeft: i > 0 ? "clamp(1.5rem, 3vw, 2.5rem)" : 0,
                  paddingRight: i < usps.length - 1 ? "clamp(1.5rem, 3vw, 2.5rem)" : 0,
                  borderLeft: i > 0 ? "1px solid var(--border)" : "none",
                  borderTop: "none",
                }}
              >
                <div
                  className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center"
                  style={{ background: "var(--accent-light)" }}
                >
                  <usp.icon size={20} style={{ color: "var(--accent)" }} />
                </div>
                <div>
                  <h3 className="text-sm font-bold" style={{ color: "var(--text)", fontFamily: "var(--font-heading)" }}>{usp.title}</h3>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{usp.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  ABOUT — Overlapping cards on gray (KEPT AS ORIGINAL)               */
/* ------------------------------------------------------------------ */
function About() {
  return (
    <section id="about" className="relative overflow-hidden" style={{ background: "#D6D1CA", padding: "clamp(4rem, 10vw, 8rem) 0" }}>
      {/* Grain texture on the gray backdrop */}
      <div className="absolute inset-0 grain-texture" />

      <div className="s-container relative" style={{ perspective: "1200px" }}>
        {/* Floating panels composition */}
        <div className="relative" style={{ minHeight: "clamp(500px, 70vh, 700px)" }}>

          {/* Back panel — large hero photo, tilted right */}
          <Reveal>
            <motion.div
              className="absolute hidden md:block"
              style={{
                top: "5%",
                right: "0%",
                width: "55%",
                zIndex: 1,
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
                transform: "rotate(2deg)",
              }}
            >
              <ImageReveal
                src="/brenda/salon1.jpg"
                alt="Salon interieur"
                className="overflow-hidden"
                delay={0.2}
              />
            </motion.div>
          </Reveal>

          {/* Main text panel — white card, slight left tilt */}
          <Reveal delay={0.15}>
            <motion.div
              style={{
                position: "relative",
                zIndex: 3,
                background: "white",
                borderRadius: 12,
                padding: "clamp(2rem, 5vw, 3.5rem)",
                maxWidth: 520,
                boxShadow: "0 12px 48px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)",
                transform: "rotate(-1.5deg)",
              }}
            >
              <span
                className="inline-block text-[11px] font-semibold tracking-widest uppercase mb-5"
                style={{ color: "var(--accent)", letterSpacing: "0.15em" }}
              >
                Over Ons
              </span>
              <h2 style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
                lineHeight: 1.15,
                color: "var(--text)",
                fontStyle: "italic",
                marginBottom: "1.25rem",
              }}>
                Waar passie en stijl samenkomen
              </h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: "var(--text-body)" }}>
                Bij Brenda&apos;s Hairstyle draait alles om jou. In onze gezellige salon in
                Hoensbroek nemen we de tijd voor persoonlijk advies en vakkundig knipwerk.
                Of je nu komt voor een frisse coupe, een nieuwe kleur of een feestelijk
                kapsel — je bent altijd welkom.
              </p>
              <div className="flex items-center gap-6 text-sm" style={{ color: "var(--text-muted)" }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--accent-light)" }}>
                    <Star size={14} fill="#B8860B" stroke="none" />
                  </div>
                  <span><strong style={{ color: "var(--text)" }}>15+</strong> jaar ervaring</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--accent-light)" }}>
                    <Heart size={14} style={{ color: "var(--accent)" }} />
                  </div>
                  <span><strong style={{ color: "var(--text)" }}>5000+</strong> klanten</span>
                </div>
              </div>
            </motion.div>
          </Reveal>

          {/* Small accent photo — bottom right, overlapping both */}
          <Reveal delay={0.4}>
            <motion.div
              className="absolute hidden md:block"
              style={{
                bottom: "-5%",
                right: "15%",
                width: "30%",
                zIndex: 4,
                borderRadius: 10,
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
                transform: "rotate(3deg)",
              }}
            >
              <ImageReveal
                src="/brenda/salon2.jpg"
                alt="Salon werkplekken"
                className="overflow-hidden"
                delay={0.5}
              />
            </motion.div>
          </Reveal>

          {/* Floating badge card — spinning seal */}
          <Reveal delay={0.6}>
            <motion.div
              className="absolute hidden md:flex items-center justify-center"
              style={{
                bottom: "15%",
                right: "3%",
                width: 100,
                height: 100,
                zIndex: 5,
                background: "white",
                borderRadius: "50%",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <svg viewBox="0 0 100 100" width="90" height="90">
                  <defs>
                    <path id="circlePath" d="M 50,50 m -35,0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
                  </defs>
                  <text fontSize="8.5" fill="#1A1A1A" letterSpacing="3" fontFamily="var(--font-heading)">
                    <textPath href="#circlePath">
                      KAPSALON HOENSBROEK  &#x2022;  SINCE 2009  &#x2022;
                    </textPath>
                  </text>
                </svg>
              </motion.div>
              <Star size={18} fill="#B8860B" stroke="none" />
            </motion.div>
          </Reveal>

          {/* Mobile fallback — stacked layout */}
          <div className="md:hidden space-y-6 relative" style={{ zIndex: 2 }}>
            <div style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
              <ImageReveal src="/brenda/salon1.jpg" alt="Salon interieur" className="overflow-hidden" delay={0.2} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  SERVICES — Tabbed price list with accent                           */
/* ------------------------------------------------------------------ */
function Services() {
  const [tab, setTab] = useState("Dames")
  const tabs = Object.keys(services)

  return (
    <section id="services" className="section-pad relative" style={{ background: "var(--bg-card)" }}>
      {/* Subtle decorative pattern */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.015 }}>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--text) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }} />
      </div>

      <div className="s-container relative">
        <Reveal className="text-center mb-12">
          <span className="inline-block text-[11px] font-semibold tracking-widest uppercase mb-4" style={{ color: "var(--accent)", letterSpacing: "0.15em" }}>
            Behandelingen
          </span>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", color: "var(--text)", fontStyle: "italic" }}>
            Onze diensten &amp; tarieven
          </h2>
          <p className="mt-3 text-base" style={{ color: "var(--text-muted)", maxWidth: 440, margin: "12px auto 0" }}>
            Van een frisse coupe tot een complete metamorfose.
          </p>
        </Reveal>

        {/* Tabs */}
        <Reveal delay={0.1} className="flex justify-center mb-10">
          <div className="flex flex-wrap justify-center gap-1 p-1.5 rounded-full w-fit" style={{ background: "var(--accent-light)", border: "1px solid var(--border)" }}>
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="relative px-5 py-2.5 rounded-full text-sm font-semibold cursor-pointer z-10"
              style={{ color: tab === t ? "white" : "var(--text-body)" }}
            >
              {tab === t && (
                <motion.div
                  layoutId="service-tab-pill"
                  className="absolute inset-0 rounded-full"
                  style={{ background: "#1A1A1A", boxShadow: "0 4px 14px rgba(0,0,0,0.12)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{t}</span>
            </button>
          ))}
          </div>
        </Reveal>

        {/* Price list */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
            className="mx-auto"
            style={{ maxWidth: 640 }}
          >
            <div className="soft-card overflow-hidden">
              {/* Tab header accent bar */}
              <div style={{ height: 3, background: "linear-gradient(90deg, var(--accent), transparent)" }} />
              {services[tab].map((s, i) => (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="group flex items-center justify-between px-6 py-4 transition-colors cursor-default"
                  style={{ borderBottom: i < services[tab].length - 1 ? "1px solid var(--border)" : "none" }}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium transition-colors group-hover:text-[var(--accent)]" style={{ color: "var(--text)" }}>{s.name}</span>
                    {s.popular && (
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase"
                        style={{ background: "var(--accent-light)", color: "var(--accent)" }}
                      >
                        Populair
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-sm" style={{ color: "var(--accent)" }}>{s.price}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <Reveal delay={0.2} className="text-center mt-8">
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Alle prijzen inclusief BTW. Prijzen kunnen afwijken afhankelijk van haarlengte en -dikte.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  GALLERY — Masonry-style atmosphere grid                            */
/* ------------------------------------------------------------------ */
function Gallery() {
  const images = [
    { src: "/brenda/salon1.jpg", alt: "Gezellig salon interieur", caption: "Ons interieur", span: "row-span-2" },
    { src: "/brenda/salon2.jpg", alt: "Werkplekken in de salon", caption: "Vakkundig aan het werk", span: "" },
    { src: "/brenda/banner1.jpg", alt: "Sfeer in de salon", caption: "Warme sfeer", span: "" },
    { src: "/brenda/salon1.jpg", alt: "Detail van de salon", caption: "Oog voor detail", span: "" },
  ]

  return (
    <section id="gallery" className="section-pad" style={{ background: "var(--bg)" }}>
      <div className="s-container">
        <Reveal className="text-center mb-12">
          <span className="inline-block text-[11px] font-semibold tracking-widest uppercase mb-4" style={{ color: "var(--accent)", letterSpacing: "0.15em" }}>
            Sfeer
          </span>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", color: "var(--text)", fontStyle: "italic" }}>
            Een kijkje in onze salon
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4" style={{ gridAutoRows: "220px" }}>
          {images.map((img, i) => (
            <Reveal key={i} delay={i * 0.1} className={`relative group overflow-hidden rounded-xl ${i === 0 ? "md:row-span-2" : ""}`}>
              <motion.div
                className="relative w-full h-full"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Hover overlay with caption */}
                <div
                  className="absolute inset-0 flex items-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{ background: "linear-gradient(0deg, rgba(26,26,26,0.7) 0%, transparent 60%)" }}
                >
                  <span className="text-sm font-medium text-white" style={{ fontFamily: "var(--font-heading)", fontStyle: "italic" }}>
                    {img.caption}
                  </span>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  REVIEWS — Clean white cards on cream                               */
/* ------------------------------------------------------------------ */
function Reviews() {
  return (
    <section id="reviews" className="section-pad" style={{ background: "var(--bg)" }}>
      <div className="s-container">
        <Reveal className="text-center mb-12">
          <span className="inline-block text-[11px] font-semibold tracking-widest uppercase mb-4" style={{ color: "var(--accent)", letterSpacing: "0.15em" }}>
            Ervaringen
          </span>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", color: "var(--text)", fontStyle: "italic" }}>
            Wat onze klanten zeggen
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.12}>
              <div className="soft-card p-7 h-full flex flex-col justify-between">
                {/* Stars */}
                <div>
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={16} fill="#B8860B" stroke="none" />
                    ))}
                  </div>

                  {/* Quote */}
                  <div className="editorial-quote">
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-body)", fontStyle: "italic" }}>
                      {r.text}
                    </p>
                  </div>
                </div>

                {/* Attribution */}
                <div className="flex items-center gap-3 mt-6 pt-5" style={{ borderTop: "1px solid var(--border)" }}>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: "var(--accent-light)", color: "var(--accent)" }}
                  >
                    {r.name.split(" ").map(w => w[0]).join("")}
                  </div>
                  <div>
                    <span className="text-sm font-semibold block" style={{ color: "var(--text)" }}>{r.name}</span>
                    <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Google Review</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  CTA Band — Dark, impactful                                         */
/* ------------------------------------------------------------------ */
function CtaBand() {
  return (
    <section className="relative overflow-hidden" style={{ background: "#1A1A1A" }}>
      {/* Subtle texture */}
      <div className="absolute inset-0 grain-texture" style={{ opacity: 0.06 }} />

      <div className="s-container relative text-center" style={{ padding: "clamp(4rem, 8vw, 6rem) clamp(1.25rem, 4vw, 3rem)" }}>
        <Reveal>
          <span className="inline-block text-[11px] font-semibold tracking-widest uppercase mb-5" style={{ color: "var(--accent)", letterSpacing: "0.2em" }}>
            Maak een afspraak
          </span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
            color: "white",
            fontStyle: "italic",
            fontWeight: 500,
            lineHeight: 1.2,
          }}>
            Klaar voor een nieuwe look?
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-4 text-base" style={{ color: "rgba(255,255,255,0.6)", maxWidth: 440, margin: "16px auto 0" }}>
            Bel ons of stuur een bericht — wij zorgen voor de rest.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <MagneticButton href="tel:+31455117476" className="flex items-center gap-2.5 px-8 py-4 rounded-full font-semibold text-sm transition-all cursor-pointer" >
              <span style={{ background: "white", color: "#1A1A1A", borderRadius: 999, padding: "14px 32px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 4px 20px rgba(255,255,255,0.15)" }}>
                <Phone size={16} /> Bel 045 - 511 74 76
              </span>
            </MagneticButton>
            <MagneticButton href="mailto:info@brenda-hairstyle.nl" className="flex items-center gap-2.5 px-8 py-4 rounded-full font-semibold text-sm transition-all cursor-pointer" >
              <span style={{ background: "transparent", color: "white", border: "1.5px solid rgba(255,255,255,0.25)", borderRadius: 999, padding: "14px 32px", display: "flex", alignItems: "center", gap: 10, backdropFilter: "blur(8px)" }}>
                <Mail size={16} /> Stuur een e-mail
              </span>
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  CONTACT — Two-column: info + form                                  */
/* ------------------------------------------------------------------ */
function Contact() {
  return (
    <section id="contact" className="section-pad" style={{ background: "var(--bg)" }}>
      <div className="s-container">
        <Reveal className="text-center mb-12">
          <span className="inline-block text-[11px] font-semibold tracking-widest uppercase mb-4" style={{ color: "var(--accent)", letterSpacing: "0.15em" }}>
            Contact
          </span>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", color: "var(--text)", fontStyle: "italic" }}>
            Neem contact op
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Info + Hours */}
          <Reveal>
            <div className="soft-card p-7">
              {/* Contact details */}
              <h3 className="text-lg font-bold mb-5" style={{ fontFamily: "var(--font-heading)", color: "var(--text)" }}>Onze gegevens</h3>
              <div className="flex flex-col gap-4 mb-8">
                {[
                  { icon: MapPin, label: "Adres", text: "Akerstraat-Noord 224, 6431 HT Hoensbroek" },
                  { icon: Phone, label: "Telefoon", text: "045 - 511 74 76" },
                  { icon: Mail, label: "E-mail", text: "info@brenda-hairstyle.nl" },
                  { icon: Facebook, label: "Socials", text: "Facebook" },
                ].map(c => (
                  <div key={c.label} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5" style={{ background: "var(--accent-light)" }}>
                      <c.icon size={16} style={{ color: "var(--accent)" }} />
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider block mb-0.5" style={{ color: "var(--text-muted)" }}>{c.label}</span>
                      <span className="text-sm font-medium" style={{ color: "var(--text)" }}>{c.text}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hours */}
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24 }}>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "var(--font-heading)", color: "var(--text)" }}>
                  <Clock size={18} style={{ color: "var(--accent)" }} />
                  Openingstijden
                </h3>
                {hours.map(h => (
                  <div key={h.day} className="flex justify-between py-2.5" style={{ borderBottom: "1px solid var(--border)", opacity: h.closed ? 0.45 : 1 }}>
                    <span className="text-sm" style={{ color: "var(--text-body)" }}>{h.day}</span>
                    <span className="text-sm font-semibold" style={{ color: h.closed ? "var(--text-muted)" : "var(--accent)" }}>{h.time}</span>
                  </div>
                ))}
                <p className="mt-4 text-xs italic" style={{ color: "var(--text-muted)" }}>Wij werken altijd op afspraak</p>
              </div>
            </div>
          </Reveal>

          {/* Right: Form */}
          <Reveal delay={0.15}>
            <div className="soft-card p-7">
              <h3 className="text-lg font-bold mb-5" style={{ fontFamily: "var(--font-heading)", color: "var(--text)" }}>Stuur een bericht</h3>
              <form className="flex flex-col gap-5" onSubmit={e => e.preventDefault()}>
                {[
                  { label: "Naam", placeholder: "Uw naam", type: "text" },
                  { label: "Telefoonnummer", placeholder: "Uw telefoonnummer", type: "tel" },
                  { label: "E-mail", placeholder: "Uw e-mailadres", type: "email" },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>{f.label}</label>
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all"
                      style={{ background: "var(--bg)", border: "1.5px solid var(--border)", color: "var(--text)" }}
                      onFocus={e => e.target.style.borderColor = "var(--accent)"}
                      onBlur={e => e.target.style.borderColor = "var(--border)"}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Vraag / Opmerking</label>
                  <textarea
                    rows={5}
                    placeholder="Waar kunnen wij u mee helpen?"
                    className="w-full px-4 py-3.5 rounded-xl text-sm outline-none resize-y transition-all"
                    style={{ background: "var(--bg)", border: "1.5px solid var(--border)", color: "var(--text)" }}
                    onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor = "var(--accent)"}
                    onBlur={e => (e.target as HTMLTextAreaElement).style.borderColor = "var(--border)"}
                  />
                </div>
                <button type="submit" className="btn-primary mt-2 w-full flex items-center justify-center gap-2" style={{ padding: "16px 24px" }}>
                  Verstuur bericht <ArrowRight size={16} />
                </button>
                <p className="text-[11px] text-center" style={{ color: "var(--text-muted)" }}>
                  Wij reageren doorgaans binnen 24 uur.
                </p>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  FOOTER — Dark, clean                                               */
/* ------------------------------------------------------------------ */
function FooterSection() {
  return (
    <footer style={{ background: "#1A1A1A", color: "rgba(255,255,255,0.5)" }}>
      <div className="s-container" style={{ padding: "clamp(3rem, 6vw, 4.5rem) clamp(1.25rem, 4vw, 3rem)" }}>
        <div className="grid md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <span className="text-xl font-bold text-white block mb-3" style={{ fontFamily: "var(--font-heading)" }}>
              Brenda&apos;s <span style={{ color: "var(--accent)" }}>Hairstyle</span>
            </span>
            <p className="text-sm leading-relaxed" style={{ maxWidth: 300 }}>
              Al meer dan 15 jaar de kapsalon van Hoensbroek. Persoonlijk, vakkundig en altijd met een warm welkom.
            </p>
          </div>

          {/* Nav links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4" style={{ letterSpacing: "0.15em" }}>Navigatie</h4>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "Over Ons", href: "#about" },
                { label: "Diensten", href: "#services" },
                { label: "Sfeer", href: "#gallery" },
                { label: "Reviews", href: "#reviews" },
                { label: "Contact", href: "#contact" },
              ].map(l => (
                <a key={l.href} href={l.href} className="text-sm hover:text-white transition-colors w-fit">
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4" style={{ letterSpacing: "0.15em" }}>Contact</h4>
            <div className="flex flex-col gap-2 text-sm">
              <span>Akerstraat-Noord 224</span>
              <span>6431 HT Hoensbroek</span>
              <span className="mt-2">045 - 511 74 76</span>
              <span>info@brenda-hairstyle.nl</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <span>&copy; {new Date().getFullYear()} Brenda&apos;s Hairstyle. Alle rechten voorbehouden.</span>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>
            Ontworpen met zorg
          </span>
        </div>
      </div>
    </footer>
  )
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */
export default function BrendaPage() {
  return (
    <div style={{ background: "var(--bg, #F5F1EC)", minHeight: "100%" }}>
      <ScrollProgress />
      <Nav />
      <Hero />
      <UspStrip />
      <About />
      <Services />
      <Gallery />
      <Reviews />
      <CtaBand />
      <Contact />
      <FooterSection />
    </div>
  )
}

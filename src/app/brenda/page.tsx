"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import Image from "next/image"
import { motion, useInView, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion"
import {
  Phone, Mail, MapPin, Clock, Star, ArrowRight, Menu, X,
  Scissors, Heart, Sparkles, ChevronRight, Facebook
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
/*  FX: Word-by-word stagger reveal for headings                       */
/* ------------------------------------------------------------------ */
function TextReveal({ text, className = "", accentWords = [] as string[], delay = 0 }: {
  text: string; className?: string; accentWords?: string[]; delay?: number
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
          style={accentWords.includes(word.replace(/[.,!?]/g, "")) ? { color: "var(--accent)", fontStyle: "italic" } : {}}
        >
          {word}
        </motion.span>
      ))}
    </span>
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
/*  FX: 3D tilt card on hover                                          */
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
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={className}
    >
      {children}
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
/*  FX: Floating decorative blob                                       */
/* ------------------------------------------------------------------ */
function FloatingBlob({ size, color, top, left, delay = 0 }: {
  size: number; color: string; top: string; left: string; delay?: number
}) {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl pointer-events-none -z-10"
      style={{ width: size, height: size, background: color, top, left }}
      animate={{ y: [0, -20, 0], x: [0, 10, 0], scale: [1, 1.05, 1] }}
      transition={{ duration: 8, delay, repeat: Infinity, ease: "easeInOut" }}
    />
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
      style={{ scaleX, background: "linear-gradient(90deg, var(--pink-400), var(--violet-500))" }}
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

const features = [
  { icon: Scissors, title: "Vakmanschap", desc: "Meer dan 15 jaar ervaring en voortdurende bijscholing." },
  { icon: Heart, title: "Persoonlijk", desc: "Elk bezoek begint met een goed gesprek over jouw wensen." },
  { icon: Sparkles, title: "Kwaliteit", desc: "Uitsluitend professionele producten voor gezond haar." },
]

/* ------------------------------------------------------------------ */
/*  NAV                                                                */
/* ------------------------------------------------------------------ */
function Nav() {
  const [open, setOpen] = useState(false)
  const links = [
    { label: "Over Ons", href: "#about" },
    { label: "Diensten", href: "#services" },
    { label: "Reviews", href: "#reviews" },
    { label: "Contact", href: "#contact" },
  ]
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md" style={{ background: "rgba(245,241,236,0.85)", borderBottom: "1px solid var(--border)" }}>
      <div className="s-container flex items-center justify-between h-16">
        <a href="#" className="flex items-center gap-1">
          <span style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 700, color: "var(--text)" }}>
            Brenda&apos;s <span style={{ color: "var(--accent)" }}>Hairstyle</span>
          </span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l.href} href={l.href} className="text-sm font-medium transition-colors hover:text-[var(--accent)]" style={{ color: "var(--text-body)" }}>
              {l.label}
            </a>
          ))}
          <a href="tel:+31455117476" className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-muted)" }}>
            <Phone size={14} /> 045 - 511 74 76
          </a>
          <a href="tel:+31455117476" className="btn-primary" style={{ padding: "10px 24px", fontSize: 14 }}>
            Afspraak Maken
          </a>
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 cursor-pointer" aria-label="Menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden px-6 pb-6 flex flex-col gap-4"
          style={{ background: "var(--bg)" }}
        >
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-base font-medium py-2" style={{ color: "var(--text-body)" }}>
              {l.label}
            </a>
          ))}
          <a href="tel:+31455117476" className="btn-primary text-center" style={{ padding: "12px 24px" }}>
            Afspraak Maken
          </a>
        </motion.div>
      )}
    </nav>
  )
}

/* ------------------------------------------------------------------ */
/*  HERO                                                               */
/* ------------------------------------------------------------------ */
function Hero() {
  return (
    <section className="section-pad relative overflow-hidden" style={{ paddingTop: "clamp(7rem, 12vw, 10rem)" }}>
      {/* Floating decorative blobs */}
      <FloatingBlob size={400} color="rgba(236,72,153,0.08)" top="-10%" left="-5%" delay={0} />
      <FloatingBlob size={300} color="rgba(139,92,246,0.06)" top="60%" left="80%" delay={2} />
      <FloatingBlob size={200} color="rgba(249,168,212,0.1)" top="30%" left="45%" delay={4} />

      <div className="s-container grid md:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div>
          <Reveal>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "var(--accent)", letterSpacing: "0.15em" }}>
              Kapsalon Hoensbroek
            </span>
          </Reveal>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2.5rem, 5vw, 3.75rem)", lineHeight: 1.15, color: "var(--text)" }}>
            <TextReveal text="Jouw haar, onze passie." accentWords={["onze", "passie."]} delay={0.2} />
          </h1>
          <Reveal delay={0.8}>
            <p className="mt-5 text-lg leading-relaxed" style={{ color: "var(--text-body)", maxWidth: 460 }}>
              Al meer dan 15 jaar de vertrouwde kapper in Hoensbroek.
              Persoonlijk advies, vakmanschap en altijd met liefde voor het vak.
            </p>
          </Reveal>
          <Reveal delay={1.0}>
            <div className="flex flex-wrap gap-4 mt-8">
              <MagneticButton href="tel:+31455117476" className="btn-primary flex items-center gap-2">
                Afspraak Maken <ArrowRight size={16} />
              </MagneticButton>
              <MagneticButton href="#services" className="btn-outline">
                Bekijk Diensten
              </MagneticButton>
            </div>
          </Reveal>
          <Reveal delay={1.2}>
            <div className="flex items-center gap-6 mt-8" style={{ color: "var(--text-muted)", fontSize: 14 }}>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.3 + i * 0.1, type: "spring", stiffness: 400 }}>
                      <Star size={16} fill="#B8860B" stroke="none" />
                    </motion.div>
                  ))}
                </div>
                <span>Google</span>
              </div>
              <span style={{ color: "var(--border-card)" }}>|</span>
              <span><Counter target={15} suffix="+" /> jaar ervaring</span>
              <span style={{ color: "var(--border-card)" }}>|</span>
              <span><Counter target={5000} suffix="+" /> klanten</span>
            </div>
          </Reveal>
        </div>
        {/* Right — Photo with clip-path reveal */}
        <div className="relative">
          <ImageReveal
            src="/brenda/salon1.jpg"
            alt="Interieur Brenda's Hairstyle"
            className="overflow-hidden"
            delay={0.4}
          />
          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.6, type: "spring" }}
            className="absolute -bottom-4 -left-4 soft-card px-5 py-3 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "var(--pink-100)" }}>
              <Clock size={18} style={{ color: "var(--accent)" }} />
            </div>
            <div>
              <div className="text-xs font-semibold" style={{ color: "var(--text)" }}>Open vandaag</div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>09:00 – 18:00</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  FEATURES (trust strip)                                             */
/* ------------------------------------------------------------------ */
function Features() {
  return (
    <section className="section-pad" style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div className="s-container grid md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.15} className="text-center">
            <TiltCard className="soft-card p-8 h-full cursor-default">
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
                style={{ background: "var(--pink-100)" }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <f.icon size={28} style={{ color: "var(--accent)" }} />
              </motion.div>
              <h3 className="text-lg font-bold mb-3" style={{ color: "var(--text)" }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-body)", maxWidth: 280, margin: "0 auto" }}>{f.desc}</p>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  ABOUT                                                              */
/* ------------------------------------------------------------------ */
function About() {
  return (
    <section id="about" className="section-pad relative overflow-hidden">
      <FloatingBlob size={350} color="rgba(249,168,212,0.12)" top="20%" left="-10%" delay={1} />
      <div className="s-container grid md:grid-cols-2 gap-16 items-center">
        {/* Photos with staggered clip reveal */}
        <div className="relative grid grid-cols-2 gap-4">
          <ImageReveal
            src="/brenda/salon1.jpg"
            alt="Salon interieur"
            className="overflow-hidden h-72"
            delay={0}
          />
          <ImageReveal
            src="/brenda/salon2.jpg"
            alt="Salon werkplekken"
            className="overflow-hidden h-72 mt-8"
            delay={0.3}
          />
          <FloatingBlob size={200} color="rgba(236,72,153,0.1)" top="50%" left="50%" delay={3} />
        </div>
        {/* Text */}
        <div>
          <Reveal>
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-4" style={{ background: "var(--pink-100)", color: "var(--accent)" }}>
              15+ jaar ervaring
            </span>
          </Reveal>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", lineHeight: 1.2, color: "var(--text)" }}>
            <TextReveal text="Waar passie en stijl samenkomen" accentWords={["samenkomen"]} delay={0.2} />
          </h2>
          <Reveal delay={0.6}>
            <p className="mt-5 text-base leading-relaxed" style={{ color: "var(--text-body)" }}>
              Bij Brenda&apos;s Hairstyle draait alles om jou. In onze gezellige salon in
              Hoensbroek nemen we de tijd voor persoonlijk advies en vakkundig knipwerk.
              Of je nu komt voor een frisse coupe, een nieuwe kleur of een feestelijk
              kapsel — je bent altijd welkom.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  SERVICES                                                           */
/* ------------------------------------------------------------------ */
function Services() {
  const [tab, setTab] = useState("Dames")
  const tabs = Object.keys(services)

  return (
    <section id="services" className="section-pad" style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div className="s-container">
        <Reveal className="text-center mb-10">
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", color: "var(--text)" }}>
            Onze <span style={{ color: "var(--accent)" }}>behandelingen</span>
          </h2>
          <p className="mt-3 text-base" style={{ color: "var(--text-muted)" }}>
            Van een frisse coupe tot een complete metamorfose.
          </p>
        </Reveal>

        {/* Tabs with sliding pill indicator */}
        <Reveal delay={0.1} className="flex flex-wrap justify-center gap-1 mb-8 p-1.5 rounded-full mx-auto w-fit bg-[var(--pink-100)] border border-[var(--border)]">
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
        </Reveal>

        {/* Price list with staggered row animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
            className="soft-card overflow-hidden mx-auto"
            style={{ maxWidth: 640 }}
          >
            {services[tab].map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex items-center justify-between px-6 py-4 transition-colors"
                style={{ borderBottom: i < services[tab].length - 1 ? "1px solid var(--border)" : "none" }}
                whileHover={{ backgroundColor: "var(--bg-elevated)" }}
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium" style={{ color: "var(--text)" }}>{s.name}</span>
                  {s.popular && (
                    <motion.span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                      style={{ background: "var(--pink-100)", color: "var(--accent)" }}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Populair
                    </motion.span>
                  )}
                </div>
                <span className="font-bold" style={{ color: "var(--accent)" }}>{s.price}</span>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <Reveal delay={0.2} className="text-center mt-6">
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Alle prijzen inclusief BTW. Prijzen kunnen afwijken afhankelijk van haarlengte en -dikte.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  REVIEWS                                                            */
/* ------------------------------------------------------------------ */
function Reviews() {
  return (
    <section id="reviews" className="section-pad relative overflow-hidden">
      <FloatingBlob size={300} color="rgba(139,92,246,0.06)" top="10%" left="85%" delay={2} />
      <div className="s-container">
        <div className="text-center mb-10">
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", color: "var(--text)" }}>
            <TextReveal text="Wat onze klanten zeggen" accentWords={["klanten"]} />
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.15}>
              <TiltCard className="soft-card p-6 h-full flex flex-col justify-between cursor-default">
                <div>
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <motion.div key={j} whileHover={{ scale: 1.3, rotate: 15 }} transition={{ type: "spring", stiffness: 500 }}>
                        <Star size={16} fill="#B8860B" stroke="none" />
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed italic" style={{ color: "var(--text-body)" }}>
                    &ldquo;{r.text}&rdquo;
                  </p>
                </div>
                <div className="flex items-center justify-between mt-6 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: "var(--pink-100)", color: "var(--accent)" }}
                      whileHover={{ scale: 1.15 }}
                    >
                      {r.name.split(" ").map(w => w[0]).join("")}
                    </motion.div>
                    <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>{r.name}</span>
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded-full font-medium" style={{ border: "1px solid var(--border-card)", color: "var(--text-muted)" }}>
                    Google Review
                  </span>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  CTA Band                                                           */
/* ------------------------------------------------------------------ */
function CtaBand() {
  return (
    <section className="section-pad" style={{ background: "linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)" }}>
      <div className="s-container text-center">
        <Reveal>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)", color: "white" }}>
            Klaar voor een nieuwe look?
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-3 text-base" style={{ color: "rgba(255,255,255,0.8)" }}>
            Maak vandaag nog een afspraak en laat je verrassen.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <a href="tel:+31455117476" className="flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-all cursor-pointer" style={{ background: "white", color: "#1A1A1A", boxShadow: "0 4px 14px rgba(0,0,0,0.15)" }}>
              <Phone size={16} /> Bel ons
            </a>
            <a href="#contact" className="flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-all cursor-pointer" style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "2px solid rgba(255,255,255,0.3)", backdropFilter: "blur(8px)" }}>
              <Mail size={16} /> Stuur bericht
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  CONTACT                                                            */
/* ------------------------------------------------------------------ */
function Contact() {
  return (
    <section id="contact" className="section-pad">
      <div className="s-container">
        <Reveal className="text-center mb-10">
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", color: "var(--text)" }}>
            Neem <span style={{ color: "var(--accent)" }}>contact</span> op
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Hours */}
          <Reveal>
            <div className="soft-card p-6">
              <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--text)" }}>Openingstijden</h3>
              {hours.map(h => (
                <div key={h.day} className="flex justify-between py-3" style={{ borderBottom: "1px solid var(--border)", opacity: h.closed ? 0.5 : 1 }}>
                  <span className="text-sm font-medium" style={{ color: "var(--text)" }}>{h.day}</span>
                  <span className="text-sm font-semibold" style={{ color: h.closed ? "var(--text-muted)" : "var(--accent)" }}>{h.time}</span>
                </div>
              ))}
              <p className="mt-4 text-xs italic" style={{ color: "var(--text-muted)" }}>Wij werken altijd met afspraak</p>

              <div className="flex flex-col gap-3 mt-6">
                {[
                  { icon: MapPin, text: "Akerstraat-Noord 224, 6431 HT Hoensbroek" },
                  { icon: Phone, text: "045 - 511 74 76" },
                  { icon: Mail, text: "info@brenda-hairstyle.nl" },
                  { icon: Facebook, text: "Facebook" },
                ].map(c => (
                  <div key={c.text} className="flex items-center gap-3 text-sm" style={{ color: "var(--text-body)" }}>
                    <c.icon size={16} style={{ color: "var(--accent)" }} />
                    {c.text}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.1}>
            <div className="soft-card p-6">
              <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--text)" }}>Stuur een bericht</h3>
              <form className="flex flex-col gap-4" onSubmit={e => e.preventDefault()}>
                {[
                  { label: "Naam", placeholder: "Uw naam", type: "text" },
                  { label: "Telefoonnummer", placeholder: "Uw telefoonnummer", type: "tel" },
                  { label: "E-mail", placeholder: "Uw e-mailadres", type: "email" },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text)" }}>{f.label}</label>
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{ background: "var(--bg)", border: "1.5px solid var(--border)", color: "var(--text)" }}
                      onFocus={e => e.target.style.borderColor = "var(--accent)"}
                      onBlur={e => e.target.style.borderColor = "var(--border)"}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text)" }}>Vraag / Opmerking</label>
                  <textarea
                    rows={4}
                    placeholder="Waar kunnen wij u mee helpen?"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-y transition-all"
                    style={{ background: "var(--bg)", border: "1.5px solid var(--border)", color: "var(--text)" }}
                    onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor = "var(--accent)"}
                    onBlur={e => (e.target as HTMLTextAreaElement).style.borderColor = "var(--border)"}
                  />
                </div>
                <button type="submit" className="btn-primary mt-2 w-full" style={{ padding: "14px 24px" }}>
                  Verstuur bericht
                </button>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  FOOTER                                                             */
/* ------------------------------------------------------------------ */
function FooterSection() {
  return (
    <footer style={{ background: "#1A1A1A", color: "rgba(255,255,255,0.6)" }}>
      <div className="s-container py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <span className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
              Brenda&apos;s <span style={{ color: "var(--pink-300)" }}>Hairstyle</span>
            </span>
            <p className="mt-3 text-sm leading-relaxed">
              Al meer dan 15 jaar dé kapsalon van Hoensbroek. Persoonlijk, vakkundig en altijd met een warm welkom.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Snelle Links</h4>
            {["Over Ons", "Diensten", "Reviews", "Contact"].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(" ", "")}`} className="block text-sm py-1 hover:text-white transition-colors">
                {l}
              </a>
            ))}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Contact</h4>
            <p className="text-sm">Akerstraat-Noord 224</p>
            <p className="text-sm">6431 HT Hoensbroek</p>
            <p className="text-sm mt-2">045 - 511 74 76</p>
            <p className="text-sm">info@brenda-hairstyle.nl</p>
          </div>
        </div>
        <div className="mt-10 pt-6 text-center text-xs" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          &copy; {new Date().getFullYear()} Brenda&apos;s Hairstyle. Alle rechten voorbehouden.
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
      <Features />
      <About />
      <Services />
      <Reviews />
      <CtaBand />
      <Contact />
      <FooterSection />
    </div>
  )
}

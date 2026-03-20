"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import {
  Phone, Mail, MapPin, Clock, Star, ArrowRight,
  Scissors, Heart, Award, Facebook,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Scroll-triggered fade-up reveal                                    */
/* ------------------------------------------------------------------ */
function Reveal({ children, className = "", delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Animated counter                                                   */
/* ------------------------------------------------------------------ */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref as React.RefObject<Element>, { once: true })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1600
    const step = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      setDisplay(Math.round(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, target])

  return <span ref={ref}>{display}{suffix}</span>
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
const services: Record<string, { name: string; price: string }[]> = {
  Dames: [
    { name: "Knippen en drogen", price: "€20,50" },
    { name: "Pony knippen", price: "€5,00" },
    { name: "Föhnen", price: "v.a. €22,50" },
    { name: "Watergolf", price: "€22,50" },
    { name: "Stijlen", price: "v.a. €19,50" },
    { name: "Krullen", price: "v.a. €22,50" },
    { name: "Opsteken", price: "v.a. €29,50" },
    { name: "Vlechten", price: "v.a. €15,00" },
  ],
  Heren: [
    { name: "Knippen", price: "€20,50" },
    { name: "Knippen + figuren inscheren", price: "v.a. €22,50" },
    { name: "Tondeuse 1 lengte", price: "€15,00" },
    { name: "Tondeuse 2 lengtes", price: "€17,50" },
  ],
  Kinderen: [
    { name: "Knippen", price: "€14,50" },
    { name: "Knippen + figuren inscheren", price: "v.a. €16,00" },
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

const hours = [
  { day: "Maandag", time: "Gesloten", closed: true },
  { day: "Dinsdag", time: "09:00 – 18:00" },
  { day: "Woensdag", time: "09:00 – 18:00" },
  { day: "Donderdag", time: "09:00 – 18:00" },
  { day: "Vrijdag", time: "09:00 – 18:00" },
  { day: "Zaterdag", time: "09:00 – 16:00" },
  { day: "Zondag", time: "Gesloten", closed: true },
]

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */
export default function BrendaPage() {
  const [tab, setTab] = useState("Dames")
  const tabs = Object.keys(services)

  return (
    <div style={{ background: "var(--bg, #F5F1EC)", minHeight: "100%" }}>

      {/* ============================================================ */}
      {/*  NAV — simple, non-fixed, in normal flow                      */}
      {/* ============================================================ */}
      <nav style={{ background: "var(--bg)" }}>
        <div className="s-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
          <a href="#" style={{
            fontFamily: "var(--font-heading)",
            fontSize: 20,
            fontWeight: 600,
            color: "var(--text)",
            textDecoration: "none",
          }}>
            Brenda&apos;s <span style={{ color: "var(--accent)" }}>Hairstyle</span>
          </a>

          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {["Over Ons", "Diensten", "Reviews", "Contact"].map(label => (
              <a
                key={label}
                href={`#${label.toLowerCase().replace(/\s/g, "")}`}
                style={{
                  fontSize: 14,
                  color: "var(--text-body)",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "color 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = "var(--accent)" }}
                onMouseLeave={e => { e.currentTarget.style.color = "var(--text-body)" }}
              >
                {label}
              </a>
            ))}
            <a
              href="tel:+31455117476"
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "white",
                background: "var(--text)",
                borderRadius: 999,
                padding: "10px 22px",
                textDecoration: "none",
                transition: "background 0.2s",
              }}
            >
              Bel Ons
            </a>
          </div>
        </div>
      </nav>

      {/* ============================================================ */}
      {/*  HERO — Full-width banner image + text below                  */}
      {/* ============================================================ */}
      <section>
        {/* Banner image */}
        <div style={{ width: "100%", height: "clamp(320px, 50vw, 520px)", overflow: "hidden" }}>
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=80"
            alt="Salon interieur"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>

        {/* Text content below image */}
        <div className="s-container" style={{ paddingTop: "clamp(3rem, 6vw, 5rem)", paddingBottom: "clamp(3rem, 6vw, 5rem)" }}>
          <Reveal>
            <h1 style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2.5rem, 5.5vw, 4rem)",
              lineHeight: 1.1,
              color: "var(--text)",
              fontStyle: "italic",
              fontWeight: 500,
              maxWidth: 600,
            }}>
              Jouw haar,<br />onze passie.
            </h1>
          </Reveal>

          <Reveal delay={0.15}>
            <p style={{
              marginTop: 20,
              fontSize: 17,
              lineHeight: 1.7,
              color: "var(--text-body)",
              maxWidth: 500,
            }}>
              Al meer dan 15 jaar de vertrouwde kapper in Hoensbroek.
              Persoonlijk advies, vakmanschap en altijd met liefde voor het vak.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 32 }}>
              <a href="tel:+31455117476" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                Afspraak Maken <ArrowRight size={16} />
              </a>
              <a href="#diensten" className="btn-outline">
                Bekijk Diensten
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.45}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 40, marginTop: 48 }}>
              {[
                { value: <Counter target={15} suffix="+" />, label: "Jaar Ervaring" },
                { value: <><span style={{ display: "flex", gap: 2 }}>{[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#B8860B" stroke="none" />)}</span></>, label: "Google Reviews" },
                { value: <Counter target={5000} suffix="+" />, label: "Tevreden Klanten" },
              ].map((stat, i) => (
                <div key={i} style={{
                  display: "flex",
                  flexDirection: "column",
                  paddingLeft: i > 0 ? 40 : 0,
                  borderLeft: i > 0 ? "1px solid var(--border)" : "none",
                }}>
                  <span style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "clamp(1.5rem, 3vw, 2rem)",
                    color: "var(--text)",
                    fontWeight: 600,
                  }}>
                    {stat.value}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  USP STRIP — Three selling points                             */}
      {/* ============================================================ */}
      <section style={{ background: "white", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="s-container" style={{ padding: "clamp(2rem, 4vw, 3rem) clamp(1.25rem, 4vw, 3rem)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
            {[
              { icon: Heart, title: "Persoonlijk advies", desc: "Elk bezoek begint met een goed gesprek" },
              { icon: Award, title: "Premium producten", desc: "Uitsluitend professionele merken" },
              { icon: Scissors, title: "15+ jaar ervaring", desc: "Vakmanschap waar je op kunt vertrouwen" },
            ].map((usp, i) => (
              <Reveal key={usp.title} delay={i * 0.1}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  paddingLeft: i > 0 ? "clamp(1.5rem, 3vw, 2.5rem)" : 0,
                  paddingRight: i < 2 ? "clamp(1.5rem, 3vw, 2.5rem)" : 0,
                  borderLeft: i > 0 ? "1px solid var(--border)" : "none",
                }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "var(--accent-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <usp.icon size={20} style={{ color: "var(--accent)" }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-heading)" }}>{usp.title}</h3>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{usp.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  ABOUT — Two columns: text left, image right                  */}
      {/* ============================================================ */}
      <section id="overons" className="section-pad">
        <div className="s-container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(3rem, 6vw, 5rem)", alignItems: "center" }}>
            {/* Left: text */}
            <Reveal>
              <div>
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "var(--accent)",
                  display: "block",
                  marginBottom: 16,
                }}>
                  Over Ons
                </span>
                <h2 style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                  lineHeight: 1.15,
                  color: "var(--text)",
                  fontStyle: "italic",
                  marginBottom: 20,
                }}>
                  Waar passie en stijl samenkomen
                </h2>
                <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--text-body)", marginBottom: 16 }}>
                  Bij Brenda&apos;s Hairstyle draait alles om jou. In onze gezellige salon in
                  Hoensbroek nemen we de tijd voor persoonlijk advies en vakkundig knipwerk.
                </p>
                <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--text-body)" }}>
                  Of je nu komt voor een frisse coupe, een nieuwe kleur of een feestelijk
                  kapsel — je bent altijd welkom. Al meer dan 15 jaar vertrouwen klanten
                  op ons vakmanschap en onze warme sfeer.
                </p>
              </div>
            </Reveal>

            {/* Right: image */}
            <Reveal delay={0.2}>
              <div style={{ borderRadius: 12, overflow: "hidden" }}>
                <img
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"
                  alt="Hair styling"
                  style={{ width: "100%", height: "auto", display: "block", borderRadius: 12 }}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SERVICES — Tabbed price list                                 */}
      {/* ============================================================ */}
      <section id="diensten" className="section-pad" style={{ background: "white" }}>
        <div className="s-container">
          <Reveal className="text-center mb-12">
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--accent)", display: "block", marginBottom: 12 }}>
              Behandelingen
            </span>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", color: "var(--text)", fontStyle: "italic" }}>
              Onze diensten &amp; tarieven
            </h2>
            <p style={{ marginTop: 12, fontSize: 15, color: "var(--text-muted)", maxWidth: 440, marginLeft: "auto", marginRight: "auto" }}>
              Van een frisse coupe tot een complete metamorfose.
            </p>
          </Reveal>

          {/* Tabs */}
          <Reveal delay={0.1}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
              <div style={{
                display: "flex",
                gap: 4,
                padding: 6,
                borderRadius: 999,
                background: "var(--accent-light)",
                border: "1px solid var(--border)",
              }}>
                {tabs.map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    style={{
                      position: "relative",
                      padding: "10px 24px",
                      borderRadius: 999,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      border: "none",
                      background: tab === t ? "#1A1A1A" : "transparent",
                      color: tab === t ? "white" : "var(--text-body)",
                      transition: "all 0.25s ease",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Price list */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              style={{ maxWidth: 600, margin: "0 auto" }}
            >
              <div className="soft-card" style={{ overflow: "hidden" }}>
                <div style={{ height: 3, background: "linear-gradient(90deg, var(--accent), transparent)" }} />
                {services[tab].map((s, i) => (
                  <div
                    key={s.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px 24px",
                      borderBottom: i < services[tab].length - 1 ? "1px solid var(--border)" : "none",
                    }}
                  >
                    <span style={{ fontSize: 15, fontWeight: 500, color: "var(--text)" }}>{s.name}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)" }}>{s.price}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <Reveal delay={0.15}>
            <p style={{ textAlign: "center", marginTop: 28, fontSize: 12, color: "var(--text-muted)" }}>
              Alle prijzen inclusief BTW. Prijzen kunnen afwijken afhankelijk van haarlengte en -dikte.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  GALLERY — 3-column grid                                      */}
      {/* ============================================================ */}
      <section id="sfeer" className="section-pad">
        <div className="s-container">
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--accent)", display: "block", marginBottom: 12 }}>
                Sfeer
              </span>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", color: "var(--text)", fontStyle: "italic" }}>
                Een kijkje in onze salon
              </h2>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[
              { src: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&q=80", alt: "Salon stoel" },
              { src: "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=600&q=80", alt: "Kapper aan het werk" },
              { src: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&q=80", alt: "Haar producten" },
            ].map((img, i) => (
              <Reveal key={i} delay={i * 0.12}>
                <motion.div
                  style={{
                    borderRadius: 12,
                    overflow: "hidden",
                    boxShadow: "var(--shadow-md)",
                    cursor: "pointer",
                  }}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    style={{
                      width: "100%",
                      height: 280,
                      objectFit: "cover",
                      display: "block",
                      transition: "transform 0.6s ease",
                    }}
                  />
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  REVIEWS — Three white cards                                  */}
      {/* ============================================================ */}
      <section id="reviews" className="section-pad" style={{ background: "white" }}>
        <div className="s-container">
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--accent)", display: "block", marginBottom: 12 }}>
                Ervaringen
              </span>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", color: "var(--text)", fontStyle: "italic" }}>
                Wat onze klanten zeggen
              </h2>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {reviews.map((r, i) => (
              <Reveal key={r.name} delay={i * 0.12}>
                <div className="soft-card" style={{
                  padding: 28,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  background: "var(--bg)",
                }}>
                  <div>
                    {/* Stars */}
                    <div style={{ display: "flex", gap: 3, marginBottom: 20 }}>
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={16} fill="#B8860B" stroke="none" />
                      ))}
                    </div>

                    {/* Quote */}
                    <p style={{
                      fontSize: 14,
                      lineHeight: 1.7,
                      color: "var(--text-body)",
                      fontStyle: "italic",
                    }}>
                      &ldquo;{r.text}&rdquo;
                    </p>
                  </div>

                  {/* Attribution */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginTop: 24,
                    paddingTop: 20,
                    borderTop: "1px solid var(--border)",
                  }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "var(--accent-light)",
                      color: "var(--accent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                    }}>
                      {r.name.split(" ").map(w => w[0]).join("")}
                    </div>
                    <div>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", display: "block" }}>{r.name}</span>
                      <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Google Review</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CTA BAND — Dark background                                   */}
      {/* ============================================================ */}
      <section style={{ background: "#1A1A1A" }}>
        <div className="s-container" style={{ padding: "clamp(4rem, 8vw, 6rem) clamp(1.25rem, 4vw, 3rem)", textAlign: "center" }}>
          <Reveal>
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
          <Reveal delay={0.1}>
            <p style={{ marginTop: 16, fontSize: 15, color: "rgba(255,255,255,0.55)", maxWidth: 420, marginLeft: "auto", marginRight: "auto" }}>
              Bel ons of stuur een bericht — wij zorgen voor de rest.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, marginTop: 36 }}>
              <a
                href="tel:+31455117476"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: "white",
                  color: "#1A1A1A",
                  borderRadius: 999,
                  padding: "14px 32px",
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "transform 0.2s",
                }}
              >
                <Phone size={16} /> Bel 045 - 511 74 76
              </a>
              <a
                href="#contact"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: "transparent",
                  color: "white",
                  border: "1.5px solid rgba(255,255,255,0.25)",
                  borderRadius: 999,
                  padding: "14px 32px",
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "border-color 0.2s",
                }}
              >
                <Mail size={16} /> Stuur een bericht
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CONTACT — Two columns: info + form                           */}
      {/* ============================================================ */}
      <section id="contact" className="section-pad">
        <div className="s-container">
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--accent)", display: "block", marginBottom: 12 }}>
                Contact
              </span>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", color: "var(--text)", fontStyle: "italic" }}>
                Neem contact op
              </h2>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            {/* Left: contact info + hours */}
            <Reveal>
              <div className="soft-card" style={{ padding: 28 }}>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 20 }}>
                  Onze gegevens
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 28 }}>
                  {[
                    { icon: MapPin, label: "Adres", text: "Akerstraat-Noord 224, 6431 HT Hoensbroek" },
                    { icon: Phone, label: "Telefoon", text: "045 - 511 74 76" },
                    { icon: Mail, label: "E-mail", text: "info@brenda-hairstyle.nl" },
                    { icon: Facebook, label: "Facebook", text: "Brenda's Hairstyle", href: "https://www.facebook.com/people/Brendas-Hairstyle/100063748982500/" },
                  ].map(c => {
                    const content = (
                      <>
                        <div style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: "var(--accent-light)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}>
                          <c.icon size={16} style={{ color: "var(--accent)" }} />
                        </div>
                        <div>
                          <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", display: "block", marginBottom: 2 }}>{c.label}</span>
                          <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{c.text}</span>
                        </div>
                      </>
                    )
                    return 'href' in c && c.href ? (
                      <a key={c.label} href={c.href} target="_blank" rel="noopener" style={{ display: "flex", alignItems: "flex-start", gap: 12, textDecoration: "none" }}>
                        {content}
                      </a>
                    ) : (
                      <div key={c.label} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                        {content}
                      </div>
                    )
                  })}
                </div>

                {/* Opening hours */}
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24 }}>
                  <h3 style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "var(--text)",
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}>
                    <Clock size={18} style={{ color: "var(--accent)" }} />
                    Openingstijden
                  </h3>
                  {hours.map(h => (
                    <div key={h.day} style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom: "1px solid var(--border)",
                      opacity: h.closed ? 0.45 : 1,
                    }}>
                      <span style={{ fontSize: 14, color: "var(--text-body)" }}>{h.day}</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: h.closed ? "var(--text-muted)" : "var(--accent)" }}>{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Right: form */}
            <Reveal delay={0.15}>
              <div className="soft-card" style={{ padding: 28 }}>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 20 }}>
                  Stuur een bericht
                </h3>
                <form style={{ display: "flex", flexDirection: "column", gap: 20 }} onSubmit={e => e.preventDefault()}>
                  {[
                    { label: "Naam", placeholder: "Uw naam", type: "text" },
                    { label: "E-mail", placeholder: "Uw e-mailadres", type: "email" },
                  ].map(f => (
                    <div key={f.label}>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: 8 }}>
                        {f.label}
                      </label>
                      <input
                        type={f.type}
                        placeholder={f.placeholder}
                        style={{
                          width: "100%",
                          padding: "14px 16px",
                          borderRadius: 10,
                          fontSize: 14,
                          border: "1.5px solid var(--border)",
                          background: "var(--bg)",
                          color: "var(--text)",
                          outline: "none",
                          transition: "border-color 0.2s",
                          boxSizing: "border-box",
                        }}
                        onFocus={e => { e.target.style.borderColor = "var(--accent)" }}
                        onBlur={e => { e.target.style.borderColor = "var(--border)" }}
                      />
                    </div>
                  ))}
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: 8 }}>
                      Bericht
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Waar kunnen wij u mee helpen?"
                      style={{
                        width: "100%",
                        padding: "14px 16px",
                        borderRadius: 10,
                        fontSize: 14,
                        border: "1.5px solid var(--border)",
                        background: "var(--bg)",
                        color: "var(--text)",
                        outline: "none",
                        resize: "vertical",
                        transition: "border-color 0.2s",
                        fontFamily: "inherit",
                        boxSizing: "border-box",
                      }}
                      onFocus={e => { (e.target as HTMLTextAreaElement).style.borderColor = "var(--accent)" }}
                      onBlur={e => { (e.target as HTMLTextAreaElement).style.borderColor = "var(--border)" }}
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "16px 24px",
                    marginTop: 4,
                  }}>
                    Verstuur bericht <ArrowRight size={16} />
                  </button>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center" }}>
                    Wij reageren doorgaans binnen 24 uur.
                  </p>
                </form>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FOOTER — Dark, clean                                         */}
      {/* ============================================================ */}
      <footer style={{ background: "#1A1A1A", color: "rgba(255,255,255,0.5)" }}>
        <div className="s-container" style={{ padding: "clamp(3rem, 6vw, 4.5rem) clamp(1.25rem, 4vw, 3rem)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40 }}>
            {/* Brand */}
            <div>
              <span style={{
                fontFamily: "var(--font-heading)",
                fontSize: 20,
                fontWeight: 700,
                color: "white",
                display: "block",
                marginBottom: 12,
              }}>
                Brenda&apos;s <span style={{ color: "var(--accent)" }}>Hairstyle</span>
              </span>
              <p style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 280 }}>
                Al meer dan 15 jaar de kapsalon van Hoensbroek. Persoonlijk, vakkundig en altijd met een warm welkom.
              </p>
            </div>

            {/* Nav links */}
            <div>
              <h4 style={{ fontSize: 11, fontWeight: 700, color: "white", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 16 }}>
                Navigatie
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Over Ons", href: "#overons" },
                  { label: "Diensten", href: "#diensten" },
                  { label: "Sfeer", href: "#sfeer" },
                  { label: "Reviews", href: "#reviews" },
                  { label: "Contact", href: "#contact" },
                ].map(l => (
                  <a
                    key={l.href}
                    href={l.href}
                    style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", textDecoration: "none", transition: "color 0.2s", width: "fit-content" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "white" }}
                    onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.5)" }}
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 style={{ fontSize: 11, fontWeight: 700, color: "white", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 16 }}>
                Contact
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 14 }}>
                <span>Akerstraat-Noord 224</span>
                <span>6431 HT Hoensbroek</span>
                <span style={{ marginTop: 8 }}>045 - 511 74 76</span>
                <span>info@brenda-hairstyle.nl</span>
                <a
                  href="https://www.facebook.com/people/Brendas-Hairstyle/100063748982500/"
                  target="_blank"
                  rel="noopener"
                  style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "white" }}
                  onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.5)" }}
                >
                  <Facebook size={14} /> Facebook
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{
            marginTop: 48,
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 12,
          }}>
            <span>&copy; {new Date().getFullYear()} Brenda&apos;s Hairstyle. Alle rechten voorbehouden.</span>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>Ontworpen met zorg</span>
          </div>
        </div>
      </footer>

    </div>
  )
}

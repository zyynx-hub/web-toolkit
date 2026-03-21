"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import LockedProjectGate from "@/components/LockedProjectGate"
import {
  Phone, Mail, MapPin, Clock, Star, ArrowRight,
  Scissors, Heart, Award, Facebook, Menu, X,
} from "lucide-react"
import {
  BUSINESS, PRICE_CATEGORIES, REVIEWS, DAYS, SCHEDULE,
} from "@/lib/data/brenda"

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
    let rafId: number
    const duration = 1600
    const step = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      setDisplay(Math.round(progress * target))
      if (progress < 1) rafId = requestAnimationFrame(step)
    }
    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  }, [inView, target])

  return <span ref={ref}>{display}{suffix}</span>
}

/* ------------------------------------------------------------------ */
/*  Derive hours from SCHEDULE + DAYS                                  */
/* ------------------------------------------------------------------ */
const hours = DAYS.map(d => {
  const sched = SCHEDULE[d.key]
  return {
    day: d.name,
    time: sched ? `${String(sched[0]).padStart(2, "0")}:00 – ${String(sched[1]).padStart(2, "0")}:00` : "Gesloten",
    closed: !sched,
  }
})

/* ------------------------------------------------------------------ */
/*  Floating Facebook widget                                           */
/* ------------------------------------------------------------------ */
function FacebookWidget() {
  return (
    <motion.a
      href={BUSINESS.facebookUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, boxShadow: "0 6px 28px rgba(24,119,242,0.45)" }}
      whileTap={{ scale: 0.95 }}
      transition={{
        opacity: { delay: 0.5, duration: 0.5 },
        y: { delay: 0.5, type: "spring", stiffness: 200, damping: 20 },
        scale: { type: "spring", stiffness: 300, damping: 20 },
      }}
      className="hidden md:flex"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 90,
        height: 44,
        alignItems: "center",
        gap: 8,
        padding: "0 18px 0 14px",
        borderRadius: 999,
        background: "#1877F2",
        color: "white",
        textDecoration: "none",
        boxShadow: "0 4px 20px rgba(24,119,242,0.3)",
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 600,
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white" style={{ flexShrink: 0 }}>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
      Volg ons
    </motion.a>
  )
}

/* ------------------------------------------------------------------ */
/*  Mobile nav drawer                                                  */
/* ------------------------------------------------------------------ */
const NAV_ITEMS = [
  { label: "Over Ons", href: "#over-ons" },
  { label: "Diensten", href: "#diensten" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
]

function MobileNav() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [open])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--text)",
          padding: 8,
        }}
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.5)",
                zIndex: 100,
              }}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                bottom: 0,
                width: "min(320px, 85vw)",
                background: "var(--bg, #F5F1EC)",
                zIndex: 101,
                padding: "24px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
                <span style={{ fontFamily: "var(--font-heading)", fontSize: 18, fontWeight: 600, color: "var(--text)" }}>
                  Brenda&apos;s <span style={{ color: "var(--accent)" }}>Hairstyle</span>
                </span>
                <button
                  onClick={() => setOpen(false)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text)", padding: 4 }}
                  aria-label="Sluit menu"
                >
                  <X size={24} />
                </button>
              </div>

              <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {NAV_ITEMS.map((item, i) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05 }}
                    style={{
                      fontSize: 18,
                      fontWeight: 500,
                      color: "var(--text)",
                      textDecoration: "none",
                      padding: "14px 0",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    {item.label}
                  </motion.a>
                ))}
              </nav>

              <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
                <a
                  href={BUSINESS.phoneHref}
                  className="btn-primary"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, textDecoration: "none" }}
                >
                  <Phone size={16} /> Bel {BUSINESS.phone}
                </a>
                <a
                  href={BUSINESS.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "12px 24px",
                    borderRadius: 999,
                    background: "#1877F2",
                    color: "white",
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  <Facebook size={16} /> Volg ons op Facebook
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Google Reviews hook — fetches live rating from API                  */
/* ------------------------------------------------------------------ */
function proxyPhoto(url: string | null): string | null {
  if (!url) return null
  if (url.includes("lh3.googleusercontent.com")) {
    return `/api/proxy-image?url=${encodeURIComponent(url)}`
  }
  return url
}

interface GoogleReview {
  name: string
  rating: number
  text: string
  date: string
  photoUrl: string | null
  googleMapsUri: string
}

function useGoogleReviews() {
  const [data, setData] = useState<{
    rating: number
    reviewCount: number
    reviews: GoogleReview[]
  }>({ rating: 4.7, reviewCount: 51, reviews: [] })

  useEffect(() => {
    fetch("/api/google-reviews")
      .then(r => r.json())
      .then(d => {
        if (d.rating && d.reviewCount) {
          setData({
            rating: d.rating,
            reviewCount: d.reviewCount,
            reviews: d.reviews || [],
          })
        }
      })
      .catch(() => {})
  }, [])

  return data
}

/* ------------------------------------------------------------------ */
/*  Star rating renderer                                                */
/* ------------------------------------------------------------------ */
function StarRating({ rating, size = 13 }: { rating: number; size?: number }) {
  const full = Math.floor(rating)
  const partial = rating - full
  const empty = 5 - full - (partial > 0 ? 1 : 0)

  return (
    <div style={{ display: "flex", gap: 1 }}>
      {[...Array(full)].map((_, i) => (
        <Star key={`f${i}`} size={size} fill="#FBBC05" stroke="none" />
      ))}
      {partial > 0 && (
        <svg key="partial" width={size} height={size} viewBox="0 0 24 24" style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="partialStar">
              <stop offset={`${Math.round(partial * 100)}%`} stopColor="#FBBC05" />
              <stop offset={`${Math.round(partial * 100)}%`} stopColor="#D1D5DB" />
            </linearGradient>
          </defs>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#partialStar)" stroke="none" />
        </svg>
      )}
      {[...Array(empty)].map((_, i) => (
        <Star key={`e${i}`} size={size} fill="#D1D5DB" stroke="none" />
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Google Reviews expandable widget (hero)                            */
/* ------------------------------------------------------------------ */
function GoogleReviewsWidget({ reviews: data }: {
  reviews: { rating: number; reviewCount: number; reviews: GoogleReview[] }
}) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ position: "relative" }}>
      {/* Google-branded card trigger */}
      <motion.button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 18px",
          borderRadius: 12,
          background: "white",
          border: "1px solid var(--border)",
          boxShadow: open ? "0 4px 20px rgba(0,0,0,0.1)" : "0 1px 4px rgba(0,0,0,0.06)",
          cursor: "pointer",
          fontFamily: "inherit",
          transition: "box-shadow 0.2s",
        }}
        whileHover={{ boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
        whileTap={{ scale: 0.98 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <div style={{ textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 17, fontWeight: 700, color: "var(--text)" }}>{data.rating}</span>
            <StarRating rating={data.rating} size={12} />
          </div>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{data.reviewCount} reviews</span>
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ display: "flex", color: "var(--text-muted)", marginLeft: 4 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </motion.span>
      </motion.button>

      {/* Expandable panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              left: 0,
              zIndex: 50,
              width: 340,
              borderRadius: 16,
              background: "white",
              border: "1px solid var(--border)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "16px 18px 12px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Google Reviews</span>
                <a
                  href={BUSINESS.googleReviewsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 11, color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}
                >
                  Bekijk alle →
                </a>
              </div>
            </div>

            <div style={{ maxHeight: 320, overflowY: "auto", padding: "4px 0" }}>
              {(data.reviews.length > 0
                ? data.reviews
                : REVIEWS.map(r => ({ name: r.name, rating: r.stars as number, text: r.text, date: r.date, photoUrl: null as string | null, googleMapsUri: "" }))
              ).map((r, i) => (
                <a
                  key={r.name + i}
                  href={r.googleMapsUri || BUSINESS.googleReviewsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    gap: 12,
                    padding: "12px 18px",
                    textDecoration: "none",
                    borderBottom: "1px solid var(--border)",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-elevated)" }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent" }}
                >
                  {r.photoUrl ? (
                    <img src={proxyPhoto(r.photoUrl)!} alt={r.name} width={32} height={32} referrerPolicy="no-referrer" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", flexShrink: 0, marginTop: 2 }} />
                  ) : (
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--accent-light)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>
                      {r.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{r.name}</span>
                      <span style={{ fontSize: 10, color: "var(--text-muted)", flexShrink: 0 }}>{r.date}</span>
                    </div>
                    <StarRating rating={r.rating} size={10} />
                    <p style={{
                      fontSize: 11,
                      lineHeight: 1.5,
                      color: "var(--text-body)",
                      margin: "4px 0 0",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}>
                      {r.text}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            <div style={{ padding: "12px 18px", borderTop: "1px solid var(--border)", textAlign: "center" }}>
              <a
                href={BUSINESS.googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)", textDecoration: "none" }}
              >
                Bekijk alle {data.reviewCount} reviews op Google →
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */
export function BrendaPageContent() {
  const tabs = PRICE_CATEGORIES.map(c => c.label)
  const [tab, setTab] = useState(tabs[0])
  const activeCategory = PRICE_CATEGORIES.find(c => c.label === tab)!
  const googleReviews = useGoogleReviews()
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormState("sending")
    const form = e.currentTarget
    const naam = (form.elements.namedItem("naam") as HTMLInputElement)?.value
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value
    const bericht = (form.elements.namedItem("bericht") as HTMLTextAreaElement)?.value

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ naam, email, bericht }),
      })
      if (res.ok) {
        setFormState("sent")
        form.reset()
      } else {
        const data = await res.json()
        console.error("Contact form error:", data.error)
        setFormState("error")
      }
    } catch {
      setFormState("error")
    }
  }

  return (
    <div style={{ background: "var(--bg, #F5F1EC)", minHeight: "100%" }}>

      <FacebookWidget />

      {/* ============================================================ */}
      {/*  NAV                                                          */}
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

          <div className="hidden md:flex" style={{ alignItems: "center", gap: 32 }}>
            {NAV_ITEMS.map(item => (
              <a
                key={item.href}
                href={item.href}
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
                {item.label}
              </a>
            ))}
            <a
              href={BUSINESS.phoneHref}
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

          <MobileNav />
        </div>
      </nav>

      {/* ============================================================ */}
      {/*  HERO                                                         */}
      {/* ============================================================ */}
      <section>
        <div style={{ width: "100%", height: "clamp(320px, 50vw, 520px)", overflow: "hidden" }}>
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=80"
            alt="Salon interieur"
            loading="eager"
            width={1920}
            height={1080}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "grayscale(100%)" }}
          />
        </div>

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
              <a href={BUSINESS.phoneHref} className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                Afspraak Maken <ArrowRight size={16} />
              </a>
              <a href="#diensten" className="btn-outline">
                Bekijk Diensten
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.45}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "stretch", gap: 20, marginTop: 48 }}>
              {/* Stat: years */}
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <span style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "var(--text)", fontWeight: 600 }}>
                  <Counter target={15} suffix="+" />
                </span>
                <span style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Jaar Ervaring
                </span>
              </div>

              {/* Google Reviews — expandable dropdown */}
              <div style={{ paddingLeft: 40, borderLeft: "1px solid var(--border)" }}>
                <GoogleReviewsWidget reviews={googleReviews} />
              </div>

              {/* Stat: customers */}
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: 40, borderLeft: "1px solid var(--border)" }}>
                <span style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "var(--text)", fontWeight: 600 }}>
                  <Counter target={5000} suffix="+" />
                </span>
                <span style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Tevreden Klanten
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  USP STRIP                                                    */}
      {/* ============================================================ */}
      <section style={{ background: "white", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="s-container" style={{ padding: "clamp(2rem, 4vw, 3rem) clamp(1.25rem, 4vw, 3rem)" }}>
          <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: 24 }}>
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
      {/*  ABOUT                                                        */}
      {/* ============================================================ */}
      <section id="over-ons" className="section-pad">
        <div className="s-container">
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "clamp(3rem, 6vw, 5rem)", alignItems: "center" }}>
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

            <Reveal delay={0.2}>
              <div style={{ borderRadius: 12, overflow: "hidden" }}>
                <img
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"
                  alt="Hair styling"
                  loading="lazy"
                  width={800}
                  height={533}
                  style={{ width: "100%", height: "auto", display: "block", borderRadius: 12, filter: "grayscale(100%)" }}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SERVICES — Tabbed price list (all 7 categories from data)    */}
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

          {/* Tabs — scrollable on mobile */}
          <Reveal delay={0.1}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
              <div style={{
                display: "flex",
                gap: 4,
                padding: 6,
                borderRadius: 999,
                background: "var(--accent-light)",
                border: "1px solid var(--border)",
                overflowX: "auto",
                maxWidth: "100%",
                WebkitOverflowScrolling: "touch",
              }}>
                {tabs.map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    style={{
                      position: "relative",
                      padding: "10px 20px",
                      borderRadius: 999,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      border: "none",
                      background: tab === t ? "#1A1A1A" : "transparent",
                      color: tab === t ? "white" : "var(--text-body)",
                      transition: "all 0.25s ease",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
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
                {activeCategory.items.map((s, i) => (
                  <div
                    key={s.name + (s.note || "")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px 24px",
                      borderBottom: i < activeCategory.items.length - 1 ? "1px solid var(--border)" : "none",
                    }}
                  >
                    <div>
                      <span style={{ fontSize: 15, fontWeight: 500, color: "var(--text)" }}>{s.name}</span>
                      {s.note && (
                        <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: 8 }}>({s.note})</span>
                      )}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)", whiteSpace: "nowrap", marginLeft: 16 }}>
                      {s.from ? "v.a. " : ""}{s.price}
                    </span>
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
      {/*  GALLERY — 3-column grid (B&W consistent with hero)           */}
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

          <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: 20 }}>
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
                    loading="lazy"
                    width={600}
                    height={400}
                    style={{
                      width: "100%",
                      height: 280,
                      objectFit: "cover",
                      display: "block",
                      transition: "transform 0.6s ease",
                      filter: "grayscale(100%)",
                    }}
                  />
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  REVIEWS — auto-scrolling carousel, live from Google           */}
      {/* ============================================================ */}
      <section id="reviews" className="section-pad" style={{ background: "white" }}>
        <div className="s-container">
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--accent)", display: "block", marginBottom: 12 }}>
                Ervaringen
              </span>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", color: "var(--text)", fontStyle: "italic" }}>
                Wat onze klanten zeggen
              </h2>
              <a
                href={BUSINESS.googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 16, textDecoration: "none" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>{googleReviews.rating}</span>
                <StarRating rating={googleReviews.rating} size={14} />
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>({googleReviews.reviewCount} reviews)</span>
              </a>
            </div>
          </Reveal>
        </div>

        {/* Scrolling carousel — full width, no container */}
        {(() => {
          const allReviews = googleReviews.reviews.length > 0
            ? googleReviews.reviews
            : REVIEWS.map(r => ({
                name: r.name,
                rating: r.stars as number,
                text: r.text,
                date: r.date,
                photoUrl: null as string | null,
                googleMapsUri: "",
              }))
          // One duplicate for seamless loop (original + 1 copy)
          const loopItems = [...allReviews, ...allReviews]
          const cardWidth = 340
          const gap = 20
          const totalWidth = allReviews.length * (cardWidth + gap)

          return (
            <div style={{ overflow: "hidden", padding: "8px 0 24px" }}>
              <motion.div
                style={{ display: "flex", gap, width: "max-content" }}
                animate={{ x: [0, -totalWidth] }}
                transition={{ duration: allReviews.length * 8, repeat: Infinity, ease: "linear" }}
                whileHover={{ animationPlayState: "paused" } as never}
                onHoverStart={(_, info) => {
                  const el = (info as unknown as { target: HTMLElement }).target?.closest("[style*='display: flex']") as HTMLElement | null
                  if (el) el.style.animationPlayState = "paused"
                }}
              >
                {loopItems.map((r, i) => (
                  <a
                    key={r.name + i}
                    href={r.googleMapsUri || BUSINESS.googleReviewsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      textDecoration: "none",
                      display: "block",
                      width: cardWidth,
                      flexShrink: 0,
                    }}
                  >
                    <div className="soft-card" style={{
                      padding: 24,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      background: "var(--bg)",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      cursor: "pointer",
                      minHeight: 220,
                    }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)" }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "var(--shadow-soft)" }}
                    >
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
                          <StarRating rating={r.rating} size={14} />
                        </div>
                        <p style={{
                          fontSize: 13,
                          lineHeight: 1.65,
                          color: "var(--text-body)",
                          fontStyle: "italic",
                          display: "-webkit-box",
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          margin: 0,
                        }}>
                          &ldquo;{r.text}&rdquo;
                        </p>
                      </div>

                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginTop: 16,
                        paddingTop: 14,
                        borderTop: "1px solid var(--border)",
                      }}>
                        {r.photoUrl ? (
                          <img
                            src={r.photoUrl}
                            alt={r.name}
                            width={36}
                            height={36}
                            referrerPolicy="no-referrer"
                            style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }}
                          />
                        ) : (
                          <div style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            background: "var(--accent-light)",
                            color: "var(--accent)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 11,
                            fontWeight: 700,
                          }}>
                            {r.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                          </div>
                        )}
                        <div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", display: "block" }}>{r.name}</span>
                          <span style={{ fontSize: 10, color: "var(--text-muted)" }}>Google{r.date ? ` · ${r.date}` : ""}</span>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </motion.div>
            </div>
          )
        })()}

        <div className="s-container">
          <Reveal delay={0.2}>
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <a
                href={BUSINESS.googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--accent)",
                  textDecoration: "none",
                  padding: "10px 24px",
                  borderRadius: 999,
                  border: "1.5px solid var(--border-card)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.background = "var(--accent-light)" }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-card)"; e.currentTarget.style.background = "transparent" }}
              >
                <Star size={14} fill="#B8860B" stroke="none" />
                Bekijk alle {googleReviews.reviewCount} reviews op Google
                <ArrowRight size={14} />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CTA BAND                                                     */}
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
                href={BUSINESS.phoneHref}
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
                <Phone size={16} /> Bel {BUSINESS.phone}
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
      {/*  CONTACT — info + form with real submission                    */}
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

          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 32 }}>
            {/* Left: contact info + hours */}
            <Reveal>
              <div className="soft-card" style={{ padding: 28 }}>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 20 }}>
                  Onze gegevens
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 28 }}>
                  {[
                    { icon: MapPin, label: "Adres", text: `${BUSINESS.address}, ${BUSINESS.postalCode} ${BUSINESS.city}` },
                    { icon: Phone, label: "Telefoon", text: BUSINESS.phone, href: BUSINESS.phoneHref },
                    { icon: Mail, label: "E-mail", text: "info@brenda-hairstyle.nl", href: "mailto:info@brenda-hairstyle.nl" },
                    { icon: Facebook, label: "Facebook", text: "Brenda's Hairstyle", href: BUSINESS.facebookUrl },
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
                      <a key={c.label} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined} style={{ display: "flex", alignItems: "flex-start", gap: 12, textDecoration: "none" }}>
                        {content}
                      </a>
                    ) : (
                      <div key={c.label} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                        {content}
                      </div>
                    )
                  })}
                </div>

                {/* Opening hours from data */}
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

                {formState === "sent" ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      textAlign: "center",
                      padding: "48px 24px",
                    }}
                  >
                    <div style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      background: "var(--accent-light)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 20px",
                    }}>
                      <Mail size={24} style={{ color: "var(--accent)" }} />
                    </div>
                    <h4 style={{ fontFamily: "var(--font-heading)", fontSize: 18, color: "var(--text)", marginBottom: 8 }}>
                      Bericht verstuurd!
                    </h4>
                    <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
                      Bedankt voor uw bericht. Wij reageren doorgaans binnen 24 uur.
                    </p>
                    <button
                      onClick={() => setFormState("idle")}
                      className="btn-outline"
                      style={{ marginTop: 24, cursor: "pointer" }}
                    >
                      Nog een bericht sturen
                    </button>
                  </motion.div>
                ) : (
                  <form style={{ display: "flex", flexDirection: "column", gap: 20 }} onSubmit={handleSubmit}>
                    {[
                      { label: "Naam", placeholder: "Uw naam", type: "text", name: "naam" },
                      { label: "E-mail", placeholder: "Uw e-mailadres", type: "email", name: "email" },
                    ].map(f => (
                      <div key={f.label}>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: 8 }}>
                          {f.label}
                        </label>
                        <input
                          name={f.name}
                          type={f.type}
                          required
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
                        name="bericht"
                        required
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

                    {formState === "error" && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ fontSize: 13, color: "#DC2626", textAlign: "center" }}
                      >
                        Er ging iets mis. Probeer het opnieuw of bel ons direct.
                      </motion.p>
                    )}

                    <button
                      type="submit"
                      disabled={formState === "sending"}
                      className="btn-primary"
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        padding: "16px 24px",
                        marginTop: 4,
                        opacity: formState === "sending" ? 0.7 : 1,
                        cursor: formState === "sending" ? "wait" : "pointer",
                      }}
                    >
                      {formState === "sending" ? "Versturen..." : "Verstuur bericht"} {formState !== "sending" && <ArrowRight size={16} />}
                    </button>
                    <p style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center" }}>
                      Wij reageren doorgaans binnen 24 uur.
                    </p>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FOOTER                                                       */}
      {/* ============================================================ */}
      <footer style={{ background: "#1A1A1A", color: "rgba(255,255,255,0.5)" }}>
        <div className="s-container" style={{ padding: "clamp(3rem, 6vw, 4.5rem) clamp(1.25rem, 4vw, 3rem)" }}>
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 40 }}>
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

            <div>
              <h4 style={{ fontSize: 11, fontWeight: 700, color: "white", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 16 }}>
                Navigatie
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Over Ons", href: "#over-ons" },
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

            <div>
              <h4 style={{ fontSize: 11, fontWeight: 700, color: "white", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 16 }}>
                Contact
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 14 }}>
                <span>{BUSINESS.address}</span>
                <span>{BUSINESS.postalCode} {BUSINESS.city}</span>
                <span style={{ marginTop: 8 }}>{BUSINESS.phone}</span>
                <span>info@brenda-hairstyle.nl</span>
                <a
                  href={BUSINESS.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "white" }}
                  onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.5)" }}
                >
                  <Facebook size={14} /> Facebook
                </a>
              </div>
            </div>
          </div>

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
          </div>
        </div>
      </footer>

    </div>
  )
}

export default function BrendaPage() {
  return (
    <LockedProjectGate
      slug="brenda"
      password="brenda2026"
      title="Brenda's Hairstyle"
      color="#EC4899"
      year="2026"
      type="Website Redesign"
      tags={["Next.js", "Framer Motion", "Tailwind CSS"]}
    >
      <BrendaPageContent />
    </LockedProjectGate>
  )
}

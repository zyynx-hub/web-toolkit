"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Phone } from "lucide-react"

export function CtaBand() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <section
      ref={ref}
      className="py-20 md:py-28 relative overflow-hidden"
      style={{ backgroundColor: "var(--bg-dark)" }}
    >
      {/* Accent gradient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 30% 50%, rgba(196, 22, 126, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 50%, rgba(232, 74, 170, 0.08) 0%, transparent 50%)",
        }}
      />

      <div className="s-container relative text-center">
        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight mb-6"
          style={{ fontFamily: "var(--font-serif)", color: "var(--text-on-dark)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          Klaar voor een{" "}
          <span className="italic font-medium" style={{ color: "var(--accent-light)" }}>
            nieuwe look
          </span>
          ?
        </motion.h2>

        <motion.p
          className="text-lg mb-10 max-w-md mx-auto"
          style={{ color: "var(--text-muted-on-dark)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
        >
          Maak vandaag nog een afspraak en laat je verrassen.
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <a
            href="tel:+31455117476"
            className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white no-underline transition-all duration-200 hover:brightness-110 hover:scale-[1.02]"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <Phone size={18} />
            Bel 045 - 511 74 76
          </a>
          <a
            href="#contact"
            className="inline-flex items-center rounded-full px-8 py-4 text-base font-semibold no-underline transition-all duration-200 hover:scale-[1.02]"
            style={{
              color: "var(--text-on-dark)",
              border: "1.5px solid rgba(255,255,255,0.2)",
            }}
          >
            Stuur een bericht
          </a>
        </motion.div>
      </div>
    </section>
  )
}

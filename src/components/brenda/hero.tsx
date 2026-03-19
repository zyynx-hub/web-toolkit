"use client"

import { motion } from "framer-motion"
import { Star, ArrowRight } from "lucide-react"
import Image from "next/image"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.15 + i * 0.15,
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  }),
}

export function Hero() {
  return (
    <section
      className="relative pt-[112px] pb-20 md:pt-[140px] md:pb-28 overflow-hidden"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="s-container">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left — text (60%) */}
          <div className="flex-[3] max-w-xl lg:max-w-none">
            <motion.p
              className="text-sm font-semibold tracking-widest uppercase mb-5"
              style={{ color: "var(--accent)" }}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              Kapsalon Hoensbroek
            </motion.p>

            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] mb-6"
              style={{ fontFamily: "var(--font-serif)", color: "var(--text)" }}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
            >
              Jouw haar,{" "}
              <span
                className="italic"
                style={{ color: "var(--accent)" }}
              >
                onze passie.
              </span>
            </motion.h1>

            <motion.p
              className="text-lg leading-relaxed max-w-md mb-8"
              style={{ color: "var(--text-muted)" }}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
            >
              Al meer dan 15 jaar de vertrouwde kapper in Hoensbroek.
              Persoonlijk advies, vakmanschap en altijd met liefde voor
              het vak.
            </motion.p>

            {/* Buttons */}
            <motion.div
              className="flex flex-wrap items-center gap-4 mb-8"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
            >
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold text-white no-underline transition-all duration-200 hover:brightness-110 hover:scale-[1.02] hover:gap-3"
                style={{ backgroundColor: "var(--accent)" }}
              >
                Afspraak Maken
                <ArrowRight size={16} />
              </a>
              <a
                href="#diensten"
                className="inline-flex items-center rounded-full px-7 py-3.5 text-base font-semibold no-underline transition-all duration-200 hover:scale-[1.02]"
                style={{
                  color: "var(--text)",
                  border: "1.5px solid var(--card-border)",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)"
                  e.currentTarget.style.color = "var(--accent)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--card-border)"
                  e.currentTarget.style.color = "var(--text)"
                }}
              >
                Bekijk Diensten
              </a>
            </motion.div>

            {/* Trust line */}
            <motion.div
              className="flex items-center gap-3 text-sm"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={4}
            >
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill="var(--accent)"
                    stroke="var(--accent)"
                  />
                ))}
              </div>
              <span style={{ color: "var(--text-muted)" }}>
                Google Reviews
              </span>
              <span
                className="w-px h-4 mx-1"
                style={{ backgroundColor: "var(--card-border)" }}
              />
              <span style={{ color: "var(--text-muted)" }}>
                15+ jaar ervaring
              </span>
            </motion.div>
          </div>

          {/* Right — photo (40%) */}
          <motion.div
            className="flex-[2] w-full max-w-md lg:max-w-none"
            initial={{ opacity: 0, x: 30, rotate: 1 }}
            animate={{ opacity: 1, x: 0, rotate: 2 }}
            transition={{
              delay: 0.4,
              duration: 0.8,
              ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
            }}
          >
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{
                aspectRatio: "3 / 4",
                boxShadow: "0 25px 60px -12px rgba(196, 22, 126, 0.15), 0 12px 30px -8px rgba(0,0,0,0.12)",
              }}
            >
              <Image
                src="/brenda/salon1.jpg"
                alt="Interieur van Brenda's Hairstyle kapsalon in Hoensbroek"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
              />
              {/* Dark gradient overlay for mood */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(26, 18, 21, 0.05) 0%, rgba(26, 18, 21, 0.25) 60%, rgba(26, 18, 21, 0.5) 100%)",
                }}
              />
              {/* Accent glow at bottom */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1 pointer-events-none"
                style={{
                  background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
                  opacity: 0.6,
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Accent separator line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, var(--accent) 30%, var(--accent-light) 50%, var(--accent) 70%, transparent 100%)",
          opacity: 0.3,
        }}
      />
    </section>
  )
}

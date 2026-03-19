"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { Scissors, Heart, Sparkles } from "lucide-react"

const features = [
  {
    icon: Scissors,
    title: "Vakmanschap",
    description: "Jarenlange ervaring en voortdurende bijscholing voor de beste resultaten.",
  },
  {
    icon: Heart,
    title: "Persoonlijk",
    description: "Elk bezoek begint met een persoonlijk adviesgesprek op maat.",
  },
  {
    icon: Sparkles,
    title: "Kwaliteit",
    description: "Wij werken uitsluitend met hoogwaardige producten en technieken.",
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.15,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  }),
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" })

  return (
    <section
      id="over-ons"
      ref={sectionRef}
      className="py-24 md:py-32"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="s-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left — Photos */}
          <motion.div
            className="relative flex gap-5 justify-center lg:justify-start"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeUp}
            custom={0}
          >
            {/* Photo 1 — positioned higher */}
            <div
              className="relative w-[45%] max-w-[260px] rounded-2xl overflow-hidden shadow-lg"
              style={{ marginTop: 0 }}
            >
              <div className="aspect-[3/4]">
                <Image
                  src="/brenda/salon1.jpg"
                  alt="Brenda's Hairstyle salon interieur"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 45vw, 260px"
                />
              </div>
            </div>

            {/* Photo 2 — offset down for visual interest */}
            <div
              className="relative w-[45%] max-w-[260px] rounded-2xl overflow-hidden shadow-lg"
              style={{ marginTop: "3rem" }}
            >
              <div className="aspect-[3/4]">
                <Image
                  src="/brenda/salon2.jpg"
                  alt="Brenda's Hairstyle kapper aan het werk"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 45vw, 260px"
                />
              </div>
            </div>
          </motion.div>

          {/* Right — Text Content */}
          <div>
            <motion.div
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={fadeUp}
              custom={1}
            >
              <span
                className="text-xs font-semibold tracking-[0.2em] uppercase"
                style={{ color: "var(--accent)" }}
              >
                Over ons
              </span>

              <h2
                className="mt-4 text-3xl md:text-4xl lg:text-[2.75rem] font-light leading-tight"
                style={{ fontFamily: "var(--font-serif)", color: "var(--text)" }}
              >
                Waar passie en stijl{" "}
                <span
                  className="italic font-medium"
                  style={{ color: "var(--accent)" }}
                >
                  samenkomen
                </span>
              </h2>

              <p
                className="mt-6 text-base md:text-lg leading-relaxed max-w-lg"
                style={{ color: "var(--text-muted)" }}
              >
                Bij Brenda&apos;s Hairstyle draait alles om jou. Al meer dan 15 jaar
                verwelkomen wij dames, heren en kinderen in onze gezellige salon in
                Hoensbroek. Met persoonlijke aandacht, een warm kopje koffie en vakkundig
                advies zorgen we ervoor dat je er altijd op je best uitziet. Of je nu komt
                voor een frisse coupe, een nieuwe kleur of een feestelijk kapsel — bij ons
                ben je in goede handen.
              </p>
            </motion.div>

            {/* Feature Cards */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  className="flex flex-col items-start gap-3 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    border: "1px solid var(--card-border)",
                    boxShadow: "0 4px 20px -4px rgba(0,0,0,0.06)",
                  }}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  variants={fadeUp}
                  custom={i + 2}
                >
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-full"
                    style={{ backgroundColor: "rgba(196, 22, 126, 0.08)" }}
                  >
                    <feature.icon
                      size={20}
                      style={{ color: "var(--accent)" }}
                      strokeWidth={1.8}
                    />
                  </div>
                  <h3
                    className="text-sm font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

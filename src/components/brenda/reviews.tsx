"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Star } from "lucide-react"

type Review = {
  quote: string
  author: string
  stars: number
}

const reviews: Review[] = [
  {
    quote:
      "Al jaren vaste klant bij Brenda. Ze luistert echt naar wat je wilt en het resultaat is altijd prachtig. De sfeer in de salon is heel gezellig en ontspannen.",
    author: "Sandra M.",
    stars: 5,
  },
  {
    quote:
      "Mijn kinderen gaan hier super graag naartoe. Brenda heeft veel geduld en maakt er altijd iets moois van. Aanrader voor het hele gezin!",
    author: "Patrick V.",
    stars: 5,
  },
  {
    quote:
      "Eindelijk een kapper die begrijpt wat ik bedoel! Geweldige kleurtechnieken en heel persoonlijk advies. Voelt elke keer als een verwenmomentje.",
    author: "Lisa D.",
    stars: 5,
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

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }, (_, i) => (
        <Star
          key={i}
          size={16}
          fill="var(--accent)"
          style={{ color: "var(--accent)" }}
          strokeWidth={0}
        />
      ))}
    </div>
  )
}

export function Reviews() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" })

  return (
    <section
      id="reviews"
      ref={sectionRef}
      className="py-20 md:py-24"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="s-container">
        {/* Heading */}
        <motion.div
          className="text-center mb-14"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          custom={0}
        >
          <span
            className="text-xs font-semibold tracking-[0.2em] uppercase"
            style={{ color: "var(--accent)" }}
          >
            Ervaringen
          </span>
          <h2
            className="mt-4 text-3xl md:text-4xl lg:text-[2.75rem] font-light leading-tight"
            style={{ fontFamily: "var(--font-serif)", color: "var(--text)" }}
          >
            Wat onze{" "}
            <span
              className="italic font-medium"
              style={{ color: "var(--accent)" }}
            >
              klanten
            </span>{" "}
            zeggen
          </h2>
        </motion.div>

        {/* Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {reviews.map((review, i) => (
            <motion.div
              key={review.author}
              className="rounded-2xl p-8 flex flex-col transition-all duration-300 hover:scale-[1.02]"
              style={{
                backgroundColor: "var(--card-bg)",
                border: "1px solid var(--card-border)",
                boxShadow: "0 4px 24px -4px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
              }}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={fadeUp}
              custom={i + 1}
            >
              {/* Stars */}
              <StarRating count={review.stars} />

              {/* Quote */}
              <p
                className="mt-5 text-base leading-relaxed flex-1"
                style={{ color: "var(--text-muted)" }}
              >
                &ldquo;{review.quote}&rdquo;
              </p>

              {/* Divider */}
              <div
                className="my-5 h-px w-full"
                style={{ backgroundColor: "var(--card-border)" }}
              />

              {/* Author */}
              <div className="flex items-center justify-between">
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--text)" }}
                >
                  {review.author}
                </span>
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: "rgba(196, 22, 126, 0.08)",
                    color: "var(--accent)",
                  }}
                >
                  Google Review
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

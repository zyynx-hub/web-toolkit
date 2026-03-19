"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

export function Statement() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const words = "Wij geloven dat ieder kapsel een kunstwerk is — persoonlijk, uniek en met liefde gemaakt.".split(" ")

  return (
    <section
      ref={ref}
      className="py-24 md:py-32 relative overflow-hidden"
      style={{ backgroundColor: "var(--bg-dark)" }}
    >
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(196, 22, 126, 0.08) 0%, transparent 70%)",
        }}
      />

      <div className="s-container relative">
        <p
          className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] leading-snug md:leading-snug font-light max-w-3xl mx-auto"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block mr-[0.3em]"
              initial={{ opacity: 0.15 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0.15 }}
              transition={{
                duration: 0.5,
                delay: i * 0.06,
                ease: "easeOut",
              }}
              style={{
                color: i < 4 ? "var(--text-on-dark)" : "var(--text-muted-on-dark)",
              }}
            >
              {word}
            </motion.span>
          ))}
        </p>
      </div>
    </section>
  )
}

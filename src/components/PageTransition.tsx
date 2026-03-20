"use client"

import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useRef, useEffect, useState } from "react"

/* ------------------------------------------------------------------ */
/*  Glass Frame — project pages open inside a rounded container        */
/*  with a bounce-in animation. Background matches each page's own     */
/*  aesthetic (no portfolio bleed-through).                            */
/* ------------------------------------------------------------------ */
export default function GlassFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === "/" || pathname === ""
  const scrollRef = useRef<HTMLDivElement>(null)

  // Reset scroll on route change
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }, [pathname])

  // Homepage renders directly, no frame
  if (isHome) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    )
  }

  // Project pages get the glass frame
  return (
    <>
      {/* Dark scrim behind the frame — no color, just depth */}
      <div className="fixed inset-0 z-0" style={{ background: "#111" }} />

      {/* Glass container with bounce */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          className="fixed z-10"
          style={{
            top: "10px",
            left: "10px",
            right: "10px",
            bottom: "10px",
          }}
          initial={{ scale: 0.88, opacity: 0, borderRadius: 18 }}
          animate={{ scale: 1, opacity: 1, borderRadius: 18 }}
          exit={{ scale: 0.95, opacity: 0, borderRadius: 18 }}
          transition={{
            scale: {
              type: "spring",
              stiffness: 260,
              damping: 20,
              mass: 0.8,
            },
            opacity: { duration: 0.3, ease: "easeOut" },
            borderRadius: { duration: 0 },
          }}
        >
          {/* Subtle outer glow */}
          <div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              borderRadius: 18,
              boxShadow: `
                0 0 0 1px rgba(255,255,255,0.06),
                0 20px 50px rgba(0,0,0,0.4),
                0 8px 20px rgba(0,0,0,0.2)
              `,
            }}
          />

          {/* Scrollable content — clips to rounded corners */}
          <div
            ref={scrollRef}
            className="absolute inset-0 overflow-y-auto overflow-x-hidden"
            style={{ borderRadius: 18 }}
          >
            {children}
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  )
}

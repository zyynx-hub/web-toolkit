"use client"

import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useRef, useEffect, useState } from "react"

/* ------------------------------------------------------------------ */
/*  Glass Frame — wraps project pages in a floating glass container    */
/*  Behind the glass edges, the warm portfolio gradient peeks through  */
/* ------------------------------------------------------------------ */
export default function GlassFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === "/" || pathname === ""
  const [mounted, setMounted] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

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
      {/* Warm portfolio background — peeks through on edges */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: "linear-gradient(135deg, #FFF7ED 0%, #FEF3E2 25%, #FFFBF5 50%, #FFF1E6 75%, #FAFAFA 100%)",
        }}
      >
        {/* Subtle floating gradient blobs to match homepage */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(251,146,60,0.15) 0%, transparent 65%)",
            top: "-10%", right: "-5%",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(244,63,94,0.1) 0%, transparent 60%)",
            bottom: "-10%", left: "-5%",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* Glass container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          className="fixed z-10"
          style={{
            top: "12px",
            left: "12px",
            right: "12px",
            bottom: "12px",
          }}
          initial={{ scale: 0.92, opacity: 0, borderRadius: 20 }}
          animate={{ scale: 1, opacity: 1, borderRadius: 20 }}
          exit={{ scale: 0.95, opacity: 0, borderRadius: 20 }}
          transition={{
            duration: 0.5,
            ease: [0.32, 0.72, 0, 1],
          }}
        >
          {/* Glass border glow */}
          <div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: `
                0 0 0 1px rgba(0,0,0,0.05),
                0 25px 60px rgba(0,0,0,0.12),
                0 8px 24px rgba(0,0,0,0.06),
                inset 0 1px 0 rgba(255,255,255,0.1)
              `,
            }}
          />

          {/* Scrollable content — each page has its own back nav */}
          <div
            ref={scrollRef}
            className="absolute inset-0 overflow-y-auto overflow-x-hidden"
            style={{ borderRadius: 20 }}
          >
            {children}
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  )
}

"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useEffect, useRef, useState, useCallback } from "react"

export default function ProjectModal({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [closing, setClosing] = useState(false)

  const handleClose = useCallback(() => {
    if (closing) return
    setClosing(true)
    setTimeout(() => {
      router.back()
    }, 350)
  }, [router, closing])

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [handleClose])

  // Intercept link clicks inside the modal
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a")
      if (!anchor) return

      const href = anchor.getAttribute("href")
      if (!href) return

      // Home link — close modal
      if (href === "/") {
        e.preventDefault()
        e.stopPropagation()
        handleClose()
        return
      }

      // Hash/anchor link — scroll within modal, don't change URL
      if (href.startsWith("#")) {
        e.preventDefault()
        e.stopPropagation()
        const targetId = href.slice(1)
        const target = container.querySelector(`[id="${targetId}"]`)
        if (target) {
          target.scrollIntoView({ behavior: "smooth" })
        }
        return
      }
    }

    container.addEventListener("click", onClick, true)
    return () => container.removeEventListener("click", onClick, true)
  }, [handleClose])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.85)", cursor: "pointer" }}
        initial={{ opacity: 1 }}
        animate={{ opacity: closing ? 0 : 1 }}
        transition={{ duration: closing ? 0.3 : 0 }}
        onClick={handleClose}
      />

      {/* Close button — top-right, above everything */}
      <motion.button
        onClick={(e) => { e.stopPropagation(); handleClose(); }}
        className="flex items-center justify-center cursor-pointer"
        style={{
          position: "fixed",
          top: 6,
          right: 6,
          zIndex: 200,
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "rgba(255,255,255,0.8)",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: closing ? 0 : 1, scale: closing ? 0.8 : 1 }}
        transition={{ delay: closing ? 0 : 0.4, duration: 0.25 }}
        whileHover={{
          background: "rgba(255,255,255,0.25)",
          color: "rgba(255,255,255,1)",
          scale: 1.1,
        }}
        whileTap={{ scale: 0.9 }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </motion.button>

      {/* Project container */}
      <motion.div
        className="absolute overflow-hidden"
        style={{
          top: "clamp(8px, 2vw, 24px)",
          left: "clamp(8px, 2vw, 24px)",
          right: "clamp(8px, 2vw, 24px)",
          bottom: "clamp(8px, 2vw, 24px)",
          borderRadius: "clamp(10px, 2vw, 16px)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)",
          transform: "translateZ(0)",
        }}
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={closing
          ? { scale: 0.92, opacity: 0, y: 40 }
          : { scale: 1, opacity: 1, y: 0 }
        }
        transition={closing
          ? { duration: 0.3, ease: [0.4, 0, 1, 1] }
          : {
              scale: { type: "spring", stiffness: 300, damping: 24, mass: 0.8 },
              opacity: { duration: 0.2 },
              y: { type: "spring", stiffness: 300, damping: 24, mass: 0.8 },
            }
        }
      >
        {/* Scrollable project content */}
        <div
          ref={scrollRef}
          className="absolute inset-0 overflow-y-auto overflow-x-clip"
          style={{
            borderRadius: "inherit",
          }}
        >
          {children}
        </div>
      </motion.div>
    </div>
  )
}

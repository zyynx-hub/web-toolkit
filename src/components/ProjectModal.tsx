"use client"

import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useRef, useState, useCallback } from "react"

/* ------------------------------------------------------------------ */
/*  Modal overlay — homepage stays behind, project opens on top        */
/*                                                                     */
/*  Key trick: `transform: translateZ(0)` on the scroll container      */
/*  creates a new containing block, so `position: fixed` navs inside   */
/*  project pages stay within the modal instead of the viewport.       */
/*                                                                     */
/*  Exit animation: internal `closing` state triggers the out-anim,    */
/*  then router.back() fires after it completes.                       */
/* ------------------------------------------------------------------ */
export default function ProjectModal({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [closing, setClosing] = useState(false)
  const [visible, setVisible] = useState(true)

  const handleClose = useCallback(() => {
    if (closing) return
    setClosing(true)
    // Let exit animation play, then navigate
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

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop — starts opaque instantly (no flash of homepage) */}
      <motion.div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.85)", cursor: "pointer" }}
        initial={{ opacity: 1 }}
        animate={{ opacity: closing ? 0 : 1 }}
        transition={{ duration: closing ? 0.3 : 0 }}
        onClick={handleClose}
      />

      {/* Project container */}
      <motion.div
        className="absolute overflow-hidden"
        style={{
          top: 24,
          left: 24,
          right: 24,
          bottom: 24,
          borderRadius: 16,
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
              scale: {
                type: "spring",
                stiffness: 300,
                damping: 24,
                mass: 0.8,
              },
              opacity: { duration: 0.2 },
              y: {
                type: "spring",
                stiffness: 300,
                damping: 24,
                mass: 0.8,
              },
            }
        }
      >
        {/* Scrollable project content */}
        <div
          ref={scrollRef}
          className="absolute inset-0 overflow-y-auto overflow-x-hidden"
          style={{
            borderRadius: 16,
            transform: "translateZ(0)",
          }}
        >
          {children}
        </div>
      </motion.div>
    </div>
  )
}

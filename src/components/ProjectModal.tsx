"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useEffect, useRef } from "react"

/* ------------------------------------------------------------------ */
/*  Modal overlay — homepage stays behind, project opens on top        */
/*                                                                     */
/*  Key trick: `transform: translateZ(0)` on the scroll container      */
/*  creates a new containing block, so `position: fixed` navs inside   */
/*  project pages stay within the modal instead of the viewport.       */
/* ------------------------------------------------------------------ */
export default function ProjectModal({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.back()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [router])

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
    return () => { document.body.style.overflow = "" }
  }, [])

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop — opaque enough to hide homepage */}
      <motion.div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.85)", cursor: "pointer" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        onClick={() => router.back()}
      />

      {/* Project container — bounces in */}
      <motion.div
        className="absolute overflow-hidden"
        style={{
          top: 24,
          left: 24,
          right: 24,
          bottom: 24,
          borderRadius: 16,
          boxShadow: "0 25px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)",
          /* Creates containing block for position:fixed children */
          transform: "translateZ(0)",
        }}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          scale: {
            type: "spring",
            stiffness: 300,
            damping: 24,
            mass: 0.8,
          },
          opacity: { duration: 0.2 },
        }}
      >
        {/* Scrollable project content */}
        <div
          ref={scrollRef}
          className="absolute inset-0 overflow-y-auto overflow-x-hidden"
          style={{
            borderRadius: 16,
            /* Also create containing block here for fixed navs */
            transform: "translateZ(0)",
          }}
        >
          {children}
        </div>
      </motion.div>
    </div>
  )
}

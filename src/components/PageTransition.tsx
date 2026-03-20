"use client"

import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

/* ------------------------------------------------------------------ */
/*  Page Transition — bouncy scale-in for project pages                */
/*  No wrapper styling, no backdrop, no frame. Just the animation.     */
/* ------------------------------------------------------------------ */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{
          scale: {
            type: "spring",
            stiffness: 200,
            damping: 18,
            mass: 0.9,
          },
          opacity: { duration: 0.25, ease: "easeOut" },
        }}
        style={{ minHeight: "100vh" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

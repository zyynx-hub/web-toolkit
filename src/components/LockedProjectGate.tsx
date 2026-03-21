"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, Unlock, Eye, EyeOff } from "lucide-react"

interface LockedProjectGateProps {
  slug: string
  password: string
  title: string
  color: string
  year: string
  type: string
  tags: string[]
  children: React.ReactNode
}

export default function LockedProjectGate({
  slug,
  password,
  title,
  color,
  year,
  type,
  tags,
  children,
}: LockedProjectGateProps) {
  const [unlocked, setUnlocked] = useState(false)
  const [input, setInput] = useState("")
  const [error, setError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [justUnlocked, setJustUnlocked] = useState(false)

  // No sessionStorage — always ask for password on each visit
  void slug // used for key identity only

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input === password) {
      setJustUnlocked(true)
      setTimeout(() => setUnlocked(true), 800)
    } else {
      setError(true)
      setTimeout(() => setError(false), 1500)
    }
  }

  if (unlocked) return <>{children}</>

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, #0a0a0a 0%, #111 50%, #0a0a0a 100%)`,
      }}
    >
      {/* Subtle gradient accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 50% 30%, ${color}12, transparent 70%)`,
        }}
      />

      {/* Blurred preview behind — shows just enough to tease */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          style={{
            filter: "blur(20px) brightness(0.3) saturate(0.5)",
            transform: "scale(1.1)",
          }}
          className="absolute inset-0 overflow-hidden pointer-events-none"
        >
          {children}
        </div>
        {/* Gradient overlay to fade out the blur */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg,
              rgba(10,10,10,0.6) 0%,
              rgba(10,10,10,0.85) 30%,
              rgba(10,10,10,0.95) 60%,
              rgba(10,10,10,1) 100%)`,
          }}
        />
      </div>

      {/* Lock gate content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          {justUnlocked ? (
            <motion.div
              key="unlocking"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.4 }}
              >
                <Unlock size={40} style={{ color }} />
              </motion.div>
              <p className="text-white/80 text-sm font-mono">Unlocking...</p>
            </motion.div>
          ) : (
            <motion.div
              key="gate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
              className="w-full max-w-sm flex flex-col items-center"
            >
              {/* Lock icon */}
              <motion.div
                className="mb-8 p-5 rounded-2xl"
                style={{
                  background: `${color}15`,
                  border: `1px solid ${color}25`,
                }}
                animate={error ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                <Lock size={32} style={{ color: error ? "#EF4444" : color }} />
              </motion.div>

              {/* Project teaser info */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <span className="text-[11px] font-mono tracking-wider text-white/30">{year}</span>
                  <span className="text-white/12">|</span>
                  <span className="text-[11px] font-mono text-white/30">{type}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">{title}</h1>
                <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-medium"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        color: "rgba(255,255,255,0.4)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-white/35">
                  This project is password-protected.
                </p>
              </div>

              {/* Password form */}
              <form onSubmit={handleSubmit} className="w-full space-y-3">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={input}
                    onChange={(e) => { setInput(e.target.value); setError(false) }}
                    placeholder="Enter password"
                    autoFocus
                    className="w-full px-4 py-3 pr-12 rounded-xl text-sm font-mono outline-none transition-all duration-300"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: error
                        ? "1px solid rgba(239,68,68,0.5)"
                        : `1px solid rgba(255,255,255,0.1)`,
                      color: "rgba(255,255,255,0.9)",
                      boxShadow: error
                        ? "0 0 20px rgba(239,68,68,0.15)"
                        : "none",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    style={{ color: "rgba(255,255,255,0.25)" }}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-center"
                      style={{ color: "#EF4444" }}
                    >
                      Incorrect password
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  className="w-full py-3 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${color}, ${color}CC)`,
                    color: "#fff",
                    boxShadow: `0 4px 20px ${color}30`,
                  }}
                  whileHover={{ scale: 1.02, boxShadow: `0 8px 30px ${color}40` }}
                  whileTap={{ scale: 0.98 }}
                >
                  Unlock Project
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

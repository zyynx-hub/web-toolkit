"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Phone } from "lucide-react"

const links = [
  { label: "Over Ons", href: "#over-ons" },
  { label: "Diensten", href: "#diensten" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? "rgba(250, 248, 245, 0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid var(--card-border)" : "1px solid transparent",
        }}
      >
        <div className="s-container">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <a href="#" className="flex items-baseline gap-0.5 no-underline">
              <span
                className="text-2xl font-light tracking-wide"
                style={{ fontFamily: "var(--font-serif)", color: "var(--text)" }}
              >
                Brenda&apos;s
              </span>
              <span
                className="text-2xl italic font-medium ml-1.5"
                style={{ fontFamily: "var(--font-serif)", color: "var(--accent)" }}
              >
                Hairstyle
              </span>
            </a>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-8">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium tracking-wide no-underline transition-colors duration-200"
                  style={{ color: "var(--text)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--accent)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--text)")
                  }
                >
                  {link.label}
                </a>
              ))}

              {/* Phone */}
              <a
                href="tel:+31455117476"
                className="hidden xl:flex items-center gap-2 text-sm no-underline"
                style={{ color: "var(--text-muted)" }}
              >
                <Phone size={14} />
                045-511 74 76
              </a>

              {/* CTA */}
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold text-white no-underline transition-all duration-200 hover:brightness-110 hover:scale-[1.02]"
                style={{ backgroundColor: "var(--accent)" }}
              >
                Afspraak Maken
              </a>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg border-0 bg-transparent cursor-pointer"
              style={{ color: "var(--text)" }}
              aria-label={menuOpen ? "Menu sluiten" : "Menu openen"}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center lg:hidden"
            style={{ backgroundColor: "var(--bg)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <nav className="flex flex-col items-center gap-8">
              {links.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-2xl font-medium no-underline"
                  style={{
                    fontFamily: "var(--font-serif)",
                    color: "var(--text)",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.07, duration: 0.3 }}
                >
                  {link.label}
                </motion.a>
              ))}

              <motion.a
                href="tel:+31455117476"
                className="flex items-center gap-2 text-base no-underline"
                style={{ color: "var(--text-muted)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.3 }}
              >
                <Phone size={16} />
                045-511 74 76
              </motion.a>

              <motion.a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center justify-center rounded-full px-8 py-3 text-base font-semibold text-white no-underline transition-all duration-200"
                style={{ backgroundColor: "var(--accent)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, duration: 0.3 }}
              >
                Afspraak Maken
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

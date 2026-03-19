"use client"

import { Facebook } from "lucide-react"
import { BUSINESS } from "@/lib/data/brenda"

const quickLinks = [
  { label: "Over Ons", href: "#over-ons" },
  { label: "Diensten", href: "#diensten" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
]

export function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "var(--bg-dark)",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <div className="s-container py-16 md:py-20">
        <div className="grid md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand */}
          <div>
            <a href="#" className="inline-block no-underline mb-4">
              <span
                className="text-2xl font-light tracking-wide"
                style={{ fontFamily: "var(--font-serif)", color: "var(--text-on-dark)" }}
              >
                Brenda&apos;s{" "}
              </span>
              <span
                className="text-2xl italic font-medium"
                style={{ fontFamily: "var(--font-serif)", color: "var(--accent)" }}
              >
                Hairstyle
              </span>
            </a>
            <p
              className="text-sm leading-relaxed max-w-xs"
              style={{ color: "var(--text-muted-on-dark)" }}
            >
              Uw kapsalon in Hoensbroek. Persoonlijk advies, vakmanschap en altijd op afspraak.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-sm font-semibold uppercase tracking-widest mb-5"
              style={{ color: "var(--text-on-dark)" }}
            >
              Snelle links
            </h4>
            <nav className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm no-underline transition-colors duration-200"
                  style={{ color: "var(--text-muted-on-dark)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--accent-light)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--text-muted-on-dark)")
                  }
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="text-sm font-semibold uppercase tracking-widest mb-5"
              style={{ color: "var(--text-on-dark)" }}
            >
              Contact
            </h4>
            <div className="flex flex-col gap-3">
              <p className="text-sm" style={{ color: "var(--text-muted-on-dark)" }}>
                {BUSINESS.address}
                <br />
                {BUSINESS.postalCode} {BUSINESS.city}
              </p>
              <a
                href="tel:+31455117476"
                className="text-sm no-underline transition-colors duration-200"
                style={{ color: "var(--text-muted-on-dark)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--accent-light)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--text-muted-on-dark)")
                }
              >
                {BUSINESS.phone}
              </a>
              <a
                href="mailto:info@brenda-hairstyle.nl"
                className="text-sm no-underline transition-colors duration-200"
                style={{ color: "var(--text-muted-on-dark)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--accent-light)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--text-muted-on-dark)")
                }
              >
                info@brenda-hairstyle.nl
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="s-container"
        style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
          <p className="text-xs" style={{ color: "var(--text-muted-on-dark)" }}>
            &copy; {new Date().getFullYear()} {BUSINESS.name}. Alle rechten voorbehouden.
          </p>
          <a
            href={BUSINESS.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs no-underline transition-colors duration-200"
            style={{ color: "var(--text-muted-on-dark)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--accent-light)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-muted-on-dark)")
            }
          >
            <Facebook size={14} />
            Volg ons op Facebook
          </a>
        </div>
      </div>
    </footer>
  )
}

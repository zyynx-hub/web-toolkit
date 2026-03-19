"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { MapPin, Phone, Mail, Facebook } from "lucide-react"
import { BUSINESS, DAYS, SCHEDULE } from "@/lib/data/brenda"

function formatTime(hour: number) {
  return `${hour.toString().padStart(2, "0")}:00`
}

export function Contact() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section
      id="contact"
      ref={ref}
      className="py-24 md:py-32"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="s-container">
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        >
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-light mb-4"
            style={{ fontFamily: "var(--font-serif)", color: "var(--text)" }}
          >
            Neem{" "}
            <span className="italic font-medium" style={{ color: "var(--accent)" }}>
              contact
            </span>{" "}
            op
          </h2>
          <p
            className="text-base md:text-lg max-w-md mx-auto"
            style={{ color: "var(--text-muted)" }}
          >
            Wij staan altijd voor u klaar. Neem gerust contact op voor een afspraak of vraag.
          </p>
        </motion.div>

        {/* Two-column grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left column: Hours + Contact info */}
          <motion.div
            className="flex flex-col gap-8"
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            {/* Opening hours card */}
            <div
              className="rounded-xl p-6 md:p-8"
              style={{
                backgroundColor: "var(--card-bg)",
                border: "1px solid var(--card-border)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <h3
                className="text-xl font-medium mb-6"
                style={{ fontFamily: "var(--font-serif)", color: "var(--text)" }}
              >
                Openingstijden
              </h3>

              <table className="w-full" style={{ borderCollapse: "collapse" }}>
                <tbody>
                  {DAYS.map((day) => {
                    const sched = SCHEDULE[day.key]
                    const closed = sched === null
                    return (
                      <tr
                        key={day.key}
                        className="border-b last:border-b-0"
                        style={{ borderColor: "var(--card-border)" }}
                      >
                        <td
                          className="py-3 text-sm"
                          style={{
                            color: closed ? "var(--text-muted)" : "var(--text)",
                            fontWeight: closed ? 400 : 500,
                          }}
                        >
                          {day.name}
                        </td>
                        <td
                          className="py-3 text-sm text-right"
                          style={{
                            color: closed ? "var(--text-muted)" : "var(--accent)",
                            fontWeight: closed ? 400 : 500,
                          }}
                        >
                          {closed
                            ? "Gesloten"
                            : `${formatTime(sched[0])} — ${formatTime(sched[1])}`}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              <p
                className="mt-5 text-sm italic"
                style={{ color: "var(--text-muted)" }}
              >
                Wij werken altijd met afspraak
              </p>
            </div>

            {/* Contact info rows */}
            <div className="flex flex-col gap-4">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${BUSINESS.address}, ${BUSINESS.postalCode} ${BUSINESS.city}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 no-underline group"
              >
                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 transition-colors duration-200"
                  style={{ color: "var(--accent)" }}
                />
                <span
                  className="text-sm leading-relaxed transition-colors duration-200 group-hover:underline"
                  style={{ color: "var(--text)" }}
                >
                  {BUSINESS.address}, {BUSINESS.postalCode} {BUSINESS.city}
                </span>
              </a>

              <a
                href="tel:+31455117476"
                className="flex items-center gap-3 no-underline group"
              >
                <Phone
                  size={18}
                  className="shrink-0 transition-colors duration-200"
                  style={{ color: "var(--accent)" }}
                />
                <span
                  className="text-sm transition-colors duration-200 group-hover:underline"
                  style={{ color: "var(--text)" }}
                >
                  {BUSINESS.phone}
                </span>
              </a>

              <a
                href="mailto:info@brenda-hairstyle.nl"
                className="flex items-center gap-3 no-underline group"
              >
                <Mail
                  size={18}
                  className="shrink-0 transition-colors duration-200"
                  style={{ color: "var(--accent)" }}
                />
                <span
                  className="text-sm transition-colors duration-200 group-hover:underline"
                  style={{ color: "var(--text)" }}
                >
                  info@brenda-hairstyle.nl
                </span>
              </a>

              <a
                href={BUSINESS.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 no-underline group"
              >
                <Facebook
                  size={18}
                  className="shrink-0 transition-colors duration-200"
                  style={{ color: "var(--accent)" }}
                />
                <span
                  className="text-sm transition-colors duration-200 group-hover:underline"
                  style={{ color: "var(--text)" }}
                >
                  Facebook
                </span>
              </a>
            </div>
          </motion.div>

          {/* Right column: Contact form */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            <form
              className="rounded-xl p-6 md:p-8 flex flex-col gap-5"
              style={{
                backgroundColor: "var(--card-bg)",
                border: "1px solid var(--card-border)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
              onSubmit={(e) => e.preventDefault()}
            >
              <h3
                className="text-xl font-medium mb-1"
                style={{ fontFamily: "var(--font-serif)", color: "var(--text)" }}
              >
                Stuur een bericht
              </h3>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="contact-name"
                  className="text-sm font-medium"
                  style={{ color: "var(--text)" }}
                >
                  Naam
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  placeholder="Uw naam"
                  className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all duration-200"
                  style={{
                    backgroundColor: "var(--bg)",
                    border: "1px solid var(--card-border)",
                    color: "var(--text)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--accent)"
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(196, 22, 126, 0.1)"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--card-border)"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="contact-phone"
                  className="text-sm font-medium"
                  style={{ color: "var(--text)" }}
                >
                  Telefoonnummer
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  placeholder="Uw telefoonnummer"
                  className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all duration-200"
                  style={{
                    backgroundColor: "var(--bg)",
                    border: "1px solid var(--card-border)",
                    color: "var(--text)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--accent)"
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(196, 22, 126, 0.1)"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--card-border)"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="contact-email"
                  className="text-sm font-medium"
                  style={{ color: "var(--text)" }}
                >
                  E-mail
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  placeholder="uw@email.nl"
                  className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all duration-200"
                  style={{
                    backgroundColor: "var(--bg)",
                    border: "1px solid var(--card-border)",
                    color: "var(--text)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--accent)"
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(196, 22, 126, 0.1)"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--card-border)"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="contact-message"
                  className="text-sm font-medium"
                  style={{ color: "var(--text)" }}
                >
                  Vraag / Opmerking
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  placeholder="Waar kunnen wij u mee helpen?"
                  className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all duration-200 resize-y"
                  style={{
                    backgroundColor: "var(--bg)",
                    border: "1px solid var(--card-border)",
                    color: "var(--text)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--accent)"
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(196, 22, 126, 0.1)"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--card-border)"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full py-3.5 text-sm font-semibold text-white border-0 cursor-pointer transition-all duration-200 hover:brightness-110 hover:scale-[1.01] active:scale-[0.99] mt-1"
                style={{ backgroundColor: "var(--accent)" }}
              >
                Verstuur bericht
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

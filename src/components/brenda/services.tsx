"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"

type ServiceItem = { name: string; price: string }

type Category = {
  label: string
  items: ServiceItem[]
}

const categories: Category[] = [
  {
    label: "Dames",
    items: [
      { name: "Knippen en drogen", price: "\u20AC20,50" },
      { name: "Pony knippen", price: "\u20AC5,00" },
      { name: "F\u00F6hnen", price: "v.a. \u20AC22,50" },
      { name: "Watergolf", price: "\u20AC22,50" },
      { name: "Stijlen", price: "v.a. \u20AC19,50" },
      { name: "Krullen", price: "v.a. \u20AC22,50" },
      { name: "Opsteken", price: "v.a. \u20AC29,50" },
      { name: "Vlechten", price: "v.a. \u20AC15,00" },
    ],
  },
  {
    label: "Heren",
    items: [
      { name: "Knippen", price: "\u20AC20,50" },
      { name: "Knippen+figuren", price: "v.a. \u20AC22,50" },
      { name: "Tondeuse 1 lengte", price: "\u20AC15,00" },
      { name: "Tondeuse 2 lengtes", price: "\u20AC17,50" },
    ],
  },
  {
    label: "Verven",
    items: [
      { name: "Uitgroei", price: "v.a. \u20AC35,50" },
      { name: "Helemaal", price: "v.a. \u20AC39,50" },
      { name: "Kleurspoeling", price: "v.a. \u20AC19,50" },
      { name: "Highlights", price: "v.a. \u20AC59,50" },
      { name: "Blonderen", price: "v.a. \u20AC25,00" },
      { name: "Coup soleil", price: "v.a. \u20AC19,50" },
    ],
  },
  {
    label: "Kids",
    items: [
      { name: "Knippen", price: "\u20AC14,50" },
      { name: "Met figuren", price: "v.a. \u20AC16,00" },
    ],
  },
  {
    label: "Permanent",
    items: [
      { name: "Incl. knippen/drogen", price: "\u20AC79,50" },
      { name: "Incl. knippen+f\u00F6hnen", price: "\u20AC89,50" },
    ],
  },
  {
    label: "Overig",
    items: [
      { name: "Extensions p.st.", price: "\u20AC4,45" },
      { name: "Complete 100st", price: "\u20AC445,00" },
      { name: "Wave complete", price: "\u20AC445,00" },
      { name: "Wave opnieuw", price: "\u20AC65,00" },
      { name: "Epileren", price: "\u20AC10,00" },
      { name: "Wenkbrauwen", price: "\u20AC10,00" },
    ],
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.08,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  }),
}

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
}

const rowVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  },
}

export function Services() {
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" })

  const activeCategory = categories[activeIndex]

  return (
    <section
      id="diensten"
      ref={sectionRef}
      className="py-24 md:py-32"
      style={{ backgroundColor: "var(--bg-dark)" }}
    >
      <div className="s-container">
        {/* Heading */}
        <motion.div
          className="text-center mb-14"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          custom={0}
        >
          <span
            className="text-xs font-semibold tracking-[0.2em] uppercase"
            style={{ color: "var(--accent)" }}
          >
            Prijslijst
          </span>
          <h2
            className="mt-4 text-3xl md:text-4xl lg:text-[2.75rem] font-light leading-tight"
            style={{
              fontFamily: "var(--font-serif)",
              color: "var(--text-on-dark)",
            }}
          >
            Onze{" "}
            <span
              className="italic font-medium"
              style={{ color: "var(--accent)" }}
            >
              behandelingen
            </span>
          </h2>
        </motion.div>

        {/* Category Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          custom={1}
        >
          {categories.map((cat, i) => {
            const isActive = i === activeIndex
            return (
              <button
                key={cat.label}
                onClick={() => setActiveIndex(i)}
                className="relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer border"
                style={{
                  backgroundColor: isActive ? "var(--accent)" : "transparent",
                  color: isActive ? "#ffffff" : "var(--text-on-dark)",
                  borderColor: isActive
                    ? "var(--accent)"
                    : "rgba(255, 255, 255, 0.15)",
                }}
              >
                {cat.label}
              </button>
            )
          })}
        </motion.div>

        {/* Service List */}
        <motion.div
          className="max-w-2xl mx-auto"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          custom={2}
        >
          <AnimatePresence mode="wait">
            <motion.ul
              key={activeCategory.label}
              className="list-none p-0 m-0"
              variants={listVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {activeCategory.items.map((item, i) => (
                <motion.li
                  key={`${activeCategory.label}-${item.name}`}
                  className="flex items-baseline justify-between py-4"
                  style={{
                    borderBottom:
                      i < activeCategory.items.length - 1
                        ? "1px solid rgba(255, 255, 255, 0.08)"
                        : "none",
                  }}
                  variants={rowVariants}
                >
                  <span
                    className="text-base"
                    style={{ color: "var(--text-on-dark)" }}
                  >
                    {item.name}
                  </span>
                  <span
                    className="text-base font-semibold ml-4 whitespace-nowrap"
                    style={{ color: "var(--accent-light)" }}
                  >
                    {item.price}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

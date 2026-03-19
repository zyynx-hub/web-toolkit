import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

const projects = [
  {
    slug: "brenda",
    title: "Brenda's Hairstyle",
    description: "Kapsalon website redesign — Hoensbroek, NL",
    tags: ["Next.js", "Framer Motion", "Tailwind"],
    color: "#EC4899",
    year: "2026",
  },
  // Add more projects here
]

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Hero */}
      <header className="flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
        <p className="text-sm font-medium tracking-widest uppercase text-zinc-500 mb-4">
          Portfolio
        </p>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Robin<span className="text-zinc-500">.</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-md leading-relaxed">
          Web design &amp; development. Building beautiful, performant websites.
        </p>
      </header>

      {/* Projects grid */}
      <main className="max-w-5xl mx-auto px-6 pb-32">
        <div className="grid gap-6">
          {projects.map((p) => (
            <Link
              key={p.slug}
              href={`/${p.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 md:p-12 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ background: p.color }}
                    />
                    <span className="text-xs text-zinc-500 font-medium">{p.year}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2 group-hover:text-white transition-colors">
                    {p.title}
                  </h2>
                  <p className="text-zinc-400 text-base mb-6">
                    {p.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <ArrowUpRight
                  size={24}
                  className="text-zinc-600 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300"
                />
              </div>

              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(600px circle at 80% 50%, ${p.color}08, transparent 60%)`,
                }}
              />
            </Link>
          ))}
        </div>

        {/* Empty state hint */}
        {projects.length <= 1 && (
          <p className="text-center text-zinc-600 text-sm mt-12">
            More projects coming soon.
          </p>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 text-center text-sm text-zinc-600">
        &copy; {new Date().getFullYear()} Robin. All rights reserved.
      </footer>
    </div>
  )
}

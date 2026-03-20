import type { Metadata } from "next"
import { Press_Start_2P, VT323 } from "next/font/google"
import "./codex.css"

const pressStart = Press_Start_2P({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
})

const vt323 = VT323({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
})

export const metadata: Metadata = {
  title: "CODEX — Anime Platformer | Godot 4",
  description:
    "A 2D side-scrolling anime platformer built in Godot 4 with GDScript. Features quest system, cat companion, boss fights, portals, and more.",
}

export default function CodexLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${pressStart.variable} ${vt323.variable} min-h-screen antialiased`}>
      {children}
    </div>
  )
}

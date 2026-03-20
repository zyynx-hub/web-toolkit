import type { Metadata } from "next"
import { JetBrains_Mono, IBM_Plex_Sans } from "next/font/google"
import "./mcp.css"

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "MCP Servers — Extending AI with Game Dev Superpowers",
  description:
    "Custom Model Context Protocol servers for Unreal Engine 5, Blender, and game development. Blueprint nodes, editor control, graph navigation, and UMG design.",
}

export default function McpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${jetbrainsMono.variable} ${ibmPlexSans.variable} min-h-screen antialiased`}>
      {children}
    </div>
  )
}

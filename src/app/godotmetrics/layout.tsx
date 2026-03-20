import type { Metadata } from "next"
import { JetBrains_Mono, IBM_Plex_Sans } from "next/font/google"
import "./godotmetrics.css"

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
  title: "GodotMetrics — Telemetry Plugin for Godot 4",
  description:
    "Privacy-respecting telemetry and analytics plugin for Godot 4. Track player behavior, session data, and events with Supabase integration.",
}

export default function GodotMetricsLayout({
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

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./backrooms.css"

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "THE BACKROOMS — UE5 Horror Game",
  description:
    "A first-person horror game set in the Backrooms. Procedurally generated liminal spaces, entity AI, and VHS camcorder aesthetic. Built in Unreal Engine 5.",
}

export default function BackroomsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${inter.variable} min-h-screen antialiased`}>
      {children}
    </div>
  )
}

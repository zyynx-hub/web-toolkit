import type { Metadata } from "next"
import { Nunito_Sans } from "next/font/google"
import "./brenda.css"

const nunito = Nunito_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Brenda's Hairstyle — Kapsalon Hoensbroek",
  description:
    "De kapsalon in Hoensbroek voor dames, heren en kinderen. Persoonlijk advies, vakmanschap en altijd op afspraak.",
}

export default function BrendaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${nunito.variable} min-h-screen antialiased`}>
      {children}
    </div>
  )
}

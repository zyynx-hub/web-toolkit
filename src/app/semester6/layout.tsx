import type { Metadata } from "next"
import { EB_Garamond, Crimson_Text } from "next/font/google"
import "./semester6.css"

const ebGaramond = EB_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

const crimsonText = Crimson_Text({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700"],
})

export const metadata: Metadata = {
  title: "Semester 6 — HBO-ICT Graduation Portfolio",
  description:
    "Documentation portfolio for HBO-ICT Semester 6 graduation project using the DOT Framework research methodology.",
}

export default function Semester6Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${ebGaramond.variable} ${crimsonText.variable} min-h-screen antialiased`}>
      {children}
    </div>
  )
}

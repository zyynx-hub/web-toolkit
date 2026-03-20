import type { Metadata } from "next"
import { EB_Garamond, Lato } from "next/font/google"
import "./spss.css"

const ebGaramond = EB_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

const lato = Lato({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "700"],
})

export const metadata: Metadata = {
  title: "SPSS-Migratie — CBS Migration Toolkit",
  description:
    "Automated migration toolkit converting legacy SPSS syntax to modern Python for CBS statistical workflows.",
}

export default function SPSSLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${ebGaramond.variable} ${lato.variable} min-h-screen antialiased`}>
      {children}
    </div>
  )
}

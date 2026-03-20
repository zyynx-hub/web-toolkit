import type { Metadata } from "next"
import { Fira_Code, Fira_Sans } from "next/font/google"
import "./filestudio.css"

const firaCode = Fira_Code({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

const firaSans = Fira_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "FileStudio — CLS Classification Analysis Tool",
  description:
    "Browser-based CLS analysis tool for CBS. Hierarchical tree navigation, dataset detection, column mapping, and auto-numbering.",
}

export default function FileStudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${firaCode.variable} ${firaSans.variable} min-h-screen antialiased`}>
      {children}
    </div>
  )
}

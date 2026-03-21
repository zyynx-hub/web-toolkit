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
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Brenda's Hairstyle — Kapsalon Hoensbroek",
    description:
      "De kapsalon in Hoensbroek voor dames, heren en kinderen. Persoonlijk advies, vakmanschap en altijd op afspraak.",
    url: "https://robin-portfolio-flax.vercel.app/brenda",
    siteName: "Brenda's Hairstyle",
    locale: "nl_NL",
    type: "website",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  name: "Brenda's Hairstyle",
  url: "https://robin-portfolio-flax.vercel.app/brenda",
  telephone: "045 - 511 74 76",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Akerstraat-Noord 224",
    addressLocality: "Hoensbroek",
    postalCode: "6431 HT",
    addressCountry: "NL",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "09:00",
      closes: "16:00",
    },
  ],
}

export default function BrendaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${nunito.variable} min-h-screen antialiased`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </div>
  )
}

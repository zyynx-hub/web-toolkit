import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import Analytics from "@/components/Analytics";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Robin — Web Developer & Designer",
  description: "Building digital experiences that feel alive. Based in the Netherlands.",
  openGraph: {
    title: "Robin — Web Developer & Designer",
    description: "Building digital experiences that feel alive. Based in the Netherlands.",
    url: "https://robin-portfolio-flax.vercel.app",
    siteName: "Robin Portfolio",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Robin — Web Developer & Designer",
    description: "Building digital experiences that feel alive. Based in the Netherlands.",
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {modal}
        <Analytics />
      </body>
    </html>
  );
}

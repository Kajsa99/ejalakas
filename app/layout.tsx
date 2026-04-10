import type { Metadata } from "next"
import { Geist, Figtree, IM_Fell_English } from "next/font/google"
import { ThemeProvider } from "next-themes"
import "./globals.css"
import { cn } from "@/lib/utils"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Header from "@/components/header"
import { Suspense } from "react"

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" })

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000"

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "E. Jalakas",
  description: "Website for E. Jalakas artwork and events",
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
})

const imFellEnglish = IM_Fell_English({
  variable: "--font-im-fell",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", figtree.variable, imFellEnglish.variable)}
    >
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<div>Loading...</div>}>
            <Header />
            {children}
            <Navbar />

            <main>
              <Footer />
            </main>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}

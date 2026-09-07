"use client"

import Link from "next/link"
import { IM_Fell_English } from "next/font/google"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const imFellEnglish = IM_Fell_English({
  variable: "--font-im-fell",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
})

export default function Header() {
  const pathname = usePathname()

  if (pathname === "/") {
    return null
  }

  return (
    <header className="fixed top-0 right-0 left-0 z-40 flex gap-4 border-b border-foreground/10 bg-background/90 p-4 backdrop-blur-md md:hidden">
      <Link
        href="/"
        className={cn(
          "p-2 font-heading text-2xl text-primary",
          imFellEnglish.className
        )}
      >
        E. Jalakas
      </Link>
    </header>
  )
}

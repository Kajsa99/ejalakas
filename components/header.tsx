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
    <header className="justify-left fixed top-0 right-0 left-0 z-50 flex gap-4 p-4 max-md:bg-background/80 max-md:backdrop-blur-md">
      <Link
        href="/"
        className={cn(
          "rounded-md p-2 text-2xl font-bold text-primary",
          imFellEnglish.className
        )}
      >
        E. Jalakas
      </Link>
    </header>
  )
}

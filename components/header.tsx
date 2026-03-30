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
    <header className="justify-left flex p-4">
      <Link
        href="/"
        className={cn(
          "text-2xl font-bold text-primary",
          imFellEnglish.className
        )}
      >
        E. Jalakas
      </Link>
    </header>
  )
}

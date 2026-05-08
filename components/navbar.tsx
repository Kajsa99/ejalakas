"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { MenuIcon, XIcon } from "lucide-react"

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  // Hide navbar on admin pages
  const pathname = usePathname()
  if (pathname.startsWith("/admin")) {
    return null
  }

  const links = [
    { href: "/", label: "Hem" },
    { href: "/art", label: "Konstverk" },
    { href: "/collections", label: "Kollektioner" },
    { href: "/exhibitions", label: "Utställningar" },
    { href: "/courses", label: "Kurser" },
    { href: "/about", label: "Om mig" },
    { href: "/contact", label: "Kontakt" },
    { href: "/admin", label: "Login" },
  ]

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <>
      <nav className="bg-background-transparent fixed top-0 right-4 z-50 hidden h-16 items-center gap-1 rounded-md p-2 md:flex">
        <div className="flex flex-row flex-wrap items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-2 py-1 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground ${
                isActiveLink(link.href)
                  ? "bg-primary text-primary-foreground"
                  : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <ThemeSwitcher />
      </nav>

      <nav className="fixed top-4 right-4 z-50 md:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="bg-background-transparent rounded-md p-2 text-sm font-medium backdrop-blur transition-colors hover:bg-primary hover:text-primary-foreground"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-menu"
        >
          <MenuIcon className="size-4 text-foreground" />
        </button>
        {mobileOpen && (
          <div
            id="mobile-nav-menu"
            className="fixed inset-0 z-50 flex min-h-dvh flex-col gap-3 overflow-x-hidden overflow-y-auto bg-background/80 p-4 backdrop-blur-md"
          >
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="ml-auto rounded-md p-2 text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              aria-label="Close menu"
            >
              <XIcon className="size-6" />
            </button>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`w-full rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-primary hover:text-primary-foreground ${
                  isActiveLink(link.href)
                    ? "bg-primary text-primary-foreground"
                    : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2">
              <ThemeSwitcher />
            </div>
          </div>
        )}
      </nav>
    </>
  )
}

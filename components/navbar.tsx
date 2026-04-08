import Link from "next/link"
import { ThemeSwitcher } from "@/components/theme-switcher"

export default function Navbar() {
  const links = [
    { href: "/", label: "Hem" },
    { href: "/art", label: "Konstverk" },
    { href: "/collections", label: "Kollektioner" },
    { href: "/exhibitions", label: "Utställningar" },
    { href: "/courses", label: "Kurser" },
    { href: "/about", label: "Om mig" },
    { href: "/contact", label: "Kontakt" },
  ]

  return (
    <nav className="bg-background-transparent fixed top-4 right-4 z-50 flex flex-col items-end gap-1 p-2 backdrop-blur">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="rounded-md px-2 py-1 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          {link.label}
        </Link>
      ))}
      <ThemeSwitcher />
    </nav>
  )
}

import Link from "next/link"

export default function Navbar() {
  const links = [
    { href: "/", label: "Home" },
    { href: "/art", label: "Artwork" },
    { href: "/exhibitions", label: "Exhibitions" },
    { href: "/courses", label: "Courses" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
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
    </nav>
  )
}

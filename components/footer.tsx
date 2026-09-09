"use client"

import Link from "next/link"
import { Facebook, Instagram, Youtube } from "lucide-react"
import { usePathname } from "next/navigation"

export default function Footer() {
  const pathname = usePathname()

  if (pathname === "/admin") {
    return null
  }

  return (
    <footer className="flex w-full justify-center border-t border-foreground/15 bg-foreground px-6 py-14 text-background">
      <div className="flex w-full max-w-7xl flex-col gap-10 md:flex-row md:justify-between">
        <div className="mx-auto flex w-full max-w-sm flex-col gap-2 md:w-1/3">
          <h2 className="eyebrow">Sociala medier</h2>
          <p className="group flex flex-row gap-2">
            <Instagram className="size-4" />{" "}
            <Link
              href="https://www.instagram.com/bettliz/"
              className="artwork-details-link pb-1 text-sm"
            >
              @bettliz
            </Link>
          </p>
          <p className="group flex flex-row gap-2">
            <Facebook className="size-4" />{" "}
            <Link
              href="https://www.facebook.com/ejalakas/"
              className="artwork-details-link pb-1 text-sm"
            >
              @ejalakas
            </Link>
          </p>
          <p className="group flex flex-row gap-2">
            <Youtube className="size-4" />{" "}
            <Link
              href="https://www.youtube.com/ejalakas/"
              className="artwork-details-link pb-1 text-sm"
            >
              @ejalakas
            </Link>
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 md:w-1/3">
          <Link href="/contact" className="group artwork-details-link eyebrow">
            Kontakt
          </Link>
          <p className="group text-sm">
            Vid frågor kring min konst, samarbeten eller förfrågningar, kontakta
            mig på{" "}
            <Link
              href="mailto:jalakasart@gmail.com"
              className="artwork-details-link pb-1 text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              jalakasart@gmail.com
            </Link>{" "}
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 md:w-1/3">
          <Link href="/about" className="group artwork-details-link eyebrow">
            Om mig
          </Link>
          <p className="text-sm">
            Konstnär baserad i Göteborg. Skapar i olja, akvarell, collage och
            teckning med olika tekniker och verktyg.{" "}
            <Link href="/exhibitions" className="artwork-details-link pb-1">
              Se aktuella utställningar
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}

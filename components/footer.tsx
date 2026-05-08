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
    <footer className="sticky bottom-0 flex w-full justify-center bg-amber-200 p-14 dark:bg-zinc-900">
      <div className="mt-20 mb-20 flex w-full max-w-7xl flex-col gap-6 md:flex-row md:justify-between">
        <div className="mx-auto flex w-full max-w-sm flex-col gap-2 md:w-1/3">
          <h2 className="text-xl font-bold">Sociala medier</h2>
          <p className="flex flex-row gap-2">
            <Instagram className="size-4" />{" "}
            <Link
              href="https://www.instagram.com/ejalakas/"
              className="text-sm hover:underline"
            >
              @ejalakas
            </Link>
          </p>
          <p className="flex flex-row gap-2">
            <Facebook className="size-4" />{" "}
            <Link
              href="https://www.facebook.com/ejalakas/"
              className="text-sm hover:underline"
            >
              @ejalakas
            </Link>
          </p>
          <p className="flex flex-row gap-2">
            <Youtube className="size-4" />{" "}
            <Link
              href="https://www.youtube.com/ejalakas/"
              className="text-sm hover:underline"
            >
              @ejalakas
            </Link>
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 md:w-1/3">
          <Link
            href="/contact"
            className="text-xl font-bold hover:text-primary hover:underline"
          >
            Kontakt
          </Link>
          <p className="text-sm">
            Vid frågor kring min konst, samarbeten eller förfrågningar, kontakta
            mig på{" "}
            <Link
              href="mailto:elisabetsjalakas@gmail.com"
              className="text-primary hover:underline"
            >
              ejalakasart@gmail.com
            </Link>{" "}
            eller telefon{" "}
            <Link
              href="tel:0707297220"
              className="text-primary hover:underline"
            >
              070-729 72 20
            </Link>
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 md:w-1/3">
          <Link
            href="/about"
            className="text-xl font-bold hover:text-primary hover:underline"
          >
            Om mig
          </Link>
          <p className="text-sm">
            Konstnär baserad i Lindome, Göteborg. Skapar i olja, akvarell,
            collage och teckning med olika tekniker och verktyg.{" "}
            <Link href="/exhibitions" className="text-primary hover:underline">
              Se aktuella utställningar
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}

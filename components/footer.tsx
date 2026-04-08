import Link from "next/link"
import { Facebook, Instagram, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="flex max-w-7xl justify-center bg-amber-200 p-14 sm:mx-4 sm:my-4 md:mx-30 lg:mx-auto lg:my-30">
      <div className="flex w-full flex-col gap-6 md:flex-row md:justify-between">
        <div className="flex w-full flex-col gap-2 md:w-1/3">
          <h2 className="text-xl font-bold">Sociala medier</h2>
          <p className="flex flex-row gap-2">
            <Instagram className="size-4" />{" "}
            <Link
              href="https://www.instagram.com/elisabetsjalakas/"
              className="text-sm hover:underline"
            >
              @elisabetsjalakas
            </Link>
          </p>
          <p className="flex flex-row gap-2">
            <Facebook className="size-4" />{" "}
            <Link
              href="https://www.facebook.com/elisabetsjalakas/"
              className="text-sm hover:underline"
            >
              @elisabetsjalakas
            </Link>
          </p>
          <p className="flex flex-row gap-2">
            <Youtube className="size-4" />{" "}
            <Link
              href="https://www.youtube.com/elisabetsjalakas/"
              className="text-sm hover:underline"
            >
              @elisabetsjalakas
            </Link>
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 md:w-1/3">
          <h2 className="text-xl font-bold">Kontakt</h2>
          <p className="text-sm">
            Vid frågor kring min konst, samarbeten eller beställningar, kontakta
            mig på{" "}
            <Link
              href="mailto:elisabetsjalakas@gmail.com"
              className="hover:underline"
            >
              elisabetsjalakas@gmail.com
            </Link>{" "}
            eller på{" "}
            <Link href="tel:0707297220" className="hover:underline">
              070-729 72 20
            </Link>
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 md:w-1/3">
          <Link href="/about" className="text-xl font-bold">
            Om mig
          </Link>
          <p className="text-sm">
            Konstnär baserad i Lindome, Göteborg. Spontant och lekfullt skapar
            Elisabet med collage, akvarell, oljefärg, tryck och teckningar.{" "}
          </p>
        </div>
      </div>
    </footer>
  )
}

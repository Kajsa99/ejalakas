import Link from "next/link"
import { Facebook, Instagram, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="mx-30 my-30 flex justify-center bg-amber-200 p-14">
      <div className="flex w-full flex-row justify-between gap-2">
        <div className="flex w-1/3 flex-col gap-2">
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
        <div className="flex w-1/3 flex-col gap-2">
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
        <div className="flex w-1/3 flex-col gap-2">
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

import ContactForm from "./contact-form"
import Link from "next/link"
import Newsletter from "@/components/newletter"

export default function Page() {
  return (
    <div className="my-20 flex min-h-svh flex-col items-center justify-center gap-10 p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-center">
        <h1 className="text-3xl font-bold">
          För samarbeten, förfrågningar eller beställningar
        </h1>

        <div>
          <p className="text-md">Kontakta mig på</p>
          <Link
            href="mailto:elisabetsjalakas@gmail.com"
            className="text-primary hover:underline"
          >
            elisabetsjalakas@gmail.com
          </Link>{" "}
          eller telefon{" "}
          <Link href="tel:0707297220" className="text-primary hover:underline">
            070-729 72 20
          </Link>
        </div>
      </div>
      <ContactForm />
      <Newsletter />
    </div>
  )
}

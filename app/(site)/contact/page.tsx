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
            href="mailto:jalakasart@gmail.com"
            className="text-foreground/80 hover:underline"
          >
            jalakasart@gmail.com
          </Link>{" "}
        </div>
      </div>
      <ContactForm />
      <Newsletter />
    </div>
  )
}

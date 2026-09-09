import ContactForm from "./contact-form"
import Link from "next/link"
import Newsletter from "@/components/newletter"

export default function Page() {
  return (
    <div className="site-page">
      <div className="site-intro">
        <div className="max-w-2xl">
          <p className="eyebrow mb-4 text-foreground">E. Jalakas / Kontakt</p>
          <h1 className="page-heading">
            För samarbeten, förfrågningar eller beställningar
          </h1>
          <p className="site-intro-copy mt-6">
            Kontakta mig på{" "}
            <Link
              href="mailto:jalakasart@gmail.com"
              className="text-primary hover:underline"
            >
              jalakasart@gmail.com
            </Link>
          </p>
        </div>
      </div>
      <div className="w-full pt-12">
        <ContactForm />
      </div>
      <Newsletter />
    </div>
  )
}

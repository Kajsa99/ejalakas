import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon, CalendarIcon, MapPinIcon } from "lucide-react"

interface Exhibition {
  id: number
  name: string
  date: string
  description: string
  image: string
  location: string
}

const formatExhibitionDate = (dateString: string) => {
  const date = new Date(dateString)

  if (Number.isNaN(date.getTime())) {
    return dateString
  }

  const year = date.getFullYear()
  const month = date.toLocaleString("sv-SE", { month: "long" })
  const day = date.getDate()

  return `${day} ${month} - ${year}`
}

export default async function ExhibitionIdPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: exhibition } = await supabase
    .from("exhibition")
    .select("*")
    .eq("id", Number(id))
    .single<Exhibition>()

  if (!exhibition) {
    notFound()
  }

  return (
    <div className="site-page">
      <div className="mb-10">
        <Link
          href="/exhibitions"
          className="eyebrow inline-flex w-fit items-center gap-2 text-foreground hover:underline"
        >
          <ArrowLeftIcon className="size-4" />
          Tillbaka
        </Link>
      </div>
      <article className="mb-20 grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.6fr)] md:items-start md:gap-12">
        <div className="relative overflow-hidden">
          <Image
            src={exhibition.image}
            alt={exhibition.name}
            width={900}
            height={700}
            priority
            className="aspect-4/3 h-auto w-full object-cover"
          />
        </div>

        <div className="flex flex-col border-t border-foreground/20 pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-8">
          <p className="eyebrow text-foreground">E. Jalakas / Utställning</p>
          <h1 className="mt-4 font-heading text-4xl leading-none md:text-5xl">
            {exhibition.name}
          </h1>
          <div className="mt-8 space-y-3 border-t border-foreground/15 pt-5 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <CalendarIcon className="size-4" />
              {formatExhibitionDate(exhibition.date)}
            </p>
            <p className="flex items-center gap-2">
              <MapPinIcon className="size-4" />
              {exhibition.location}
            </p>
          </div>
          <p className="merriweather-long-text mt-8 text-base leading-relaxed text-muted-foreground">
            {exhibition.description}
          </p>
        </div>
      </article>
    </div>
  )
}

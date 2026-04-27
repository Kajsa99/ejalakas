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
    <div className="my-20 flex flex-col items-center p-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <Link
          href="/exhibitions"
          className="text-md flex w-fit flex-row items-center gap-2 self-start text-primary hover:underline"
        >
          <ArrowLeftIcon className="size-4" />
          Tillbaka
        </Link>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="relative">
            <Image
              src={exhibition.image}
              alt={exhibition.name}
              width={900}
              height={700}
              priority
              className="h-auto w-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-medium">{exhibition.name}</h1>
            <p className="text-md flex items-center gap-2 text-muted-foreground">
              <CalendarIcon className="size-4" />
              {formatExhibitionDate(exhibition.date)}
            </p>
            <p className="text-md flex items-center gap-2 text-muted-foreground">
              <MapPinIcon className="size-4" />
              {exhibition.location}
            </p>
            <p className="merriweather-long-text mx-4 max-w-sm text-sm leading-loose">
              {exhibition.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

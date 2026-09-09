"use client"

import { createClient } from "@/lib/supabase/client"
import { CalendarIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

interface Exhibition {
  id: number
  name: string
  date: string
  description: string
  image: string
}

const getStartOfToday = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
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

export default function UpcomingExhibitions() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchExhibitions = async () => {
      const supabase = await createClient()
      const { data } = await supabase
        .from("exhibition")
        .select("*")
        .order("date", { ascending: true })

      setExhibitions(data ?? [])
      setIsLoading(false)
    }

    fetchExhibitions()
  }, [])

  const upcomingExhibitions = useMemo(() => {
    const startOfToday = getStartOfToday()
    return exhibitions.filter((exhibition) => {
      const exhibitionDate = new Date(exhibition.date)
      return (
        !Number.isNaN(exhibitionDate.getTime()) &&
        exhibitionDate >= startOfToday
      )
    })
  }, [exhibitions])

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl text-sm text-muted-foreground">
        Laddar kommande utställningar...
      </div>
    )
  }

  if (upcomingExhibitions.length === 0) {
    return null
  }

  return (
    <section className="flex w-full flex-col gap-8">
      <div className="border-b border-foreground/20 pb-4">
        <p className="eyebrow text-foreground">På gång</p>
        <h2 className="mt-3 font-heading text-4xl leading-none md:text-5xl">
          Kommande utställningar
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {upcomingExhibitions.map((exhibition) => (
          <article
            key={exhibition.id}
            className="group flex h-full flex-col border-b border-foreground/20 pb-8"
          >
            <div className="relative overflow-hidden">
              <Image
                src={exhibition.image}
                alt={exhibition.name}
                width={600}
                height={400}
                className="aspect-4/3 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col gap-4 pt-5">
              <h3 className="font-heading text-3xl leading-tight">
                {exhibition.name}
              </h3>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarIcon className="size-4" />
                {formatExhibitionDate(exhibition.date)}
              </p>
              <p className="merriweather-long-text line-clamp-4 text-base leading-relaxed text-muted-foreground">
                {exhibition.description}
              </p>
              <Link
                href={`/exhibitions/${exhibition.id}`}
                className="artwork-details-link mt-auto pt-4 text-base"
              >
                Se detaljer
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

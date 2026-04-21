"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
    <section className="my-10 flex w-full max-w-6xl flex-col gap-6">
      <h2 className="text-xl font-medium">Kommande utställningar</h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {upcomingExhibitions.map((exhibition) => (
          <Card key={exhibition.id} className="flex h-full max-w-md flex-col">
            <CardHeader className="p-4">
              <CardTitle className="text-center text-xl font-medium">
                {exhibition.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-2">
              <Image
                src={exhibition.image}
                alt={exhibition.name}
                width={300}
                height={200}
                className="h-64 w-full object-cover"
              />
              <p className="text-md flex items-center gap-2">
                <CalendarIcon className="size-4" />
                {formatExhibitionDate(exhibition.date)}
              </p>
              <p className="merriweather-long-text text-md m-4 line-clamp-4 leading-loose">
                {exhibition.description}
              </p>
            </CardContent>
            <CardFooter>
              <Link href={`/exhibitions/${exhibition.id}`} className="w-full">
                <Button className="w-full">Se detaljer</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}

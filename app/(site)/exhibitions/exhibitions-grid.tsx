"use client"

import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ExhibitionsGrid() {
  interface Exhibition {
    id: number
    name: string
    date: string
    description: string
    image: string
  }

  //   Exhibitions order by date descending
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([])
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const fetchExhibitions = async () => {
      const supabase = await createClient()
      const { data } = await supabase
        .from("exhibition")
        .select("*")
        .order("date", { ascending: false })
      setExhibitions(data ?? [])
      setIsLoading(false)
    }
    fetchExhibitions()
  }, [])

  //   dropdown to select by year
  const availableYears = useMemo(() => {
    const years = exhibitions
      .map((exhibition) => new Date(exhibition.date).getFullYear())
      .filter((year) => Number.isFinite(year))

    return Array.from(new Set(years)).sort((a, b) => b - a)
  }, [exhibitions])

  const filteredExhibitions = useMemo(() => {
    if (selectedYear === "all") {
      return exhibitions
    }

    const targetYear = Number(selectedYear)
    return exhibitions.filter(
      (exhibition) => new Date(exhibition.date).getFullYear() === targetYear
    )
  }, [exhibitions, selectedYear])

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">
        Laddar utställningar...
      </div>
    )
  }

  return (
    <div className="mt-6 flex flex-col gap-8">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-end">
        <Label className="flex items-center gap-2 text-sm text-muted-foreground">
          År:
          <Select
            value={selectedYear}
            onValueChange={(value) => setSelectedYear(value ?? "all")}
          >
            <SelectTrigger className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground">
              <SelectValue placeholder="Välj år" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alla år</SelectItem>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Label>
      </div>

      {filteredExhibitions.length === 0 ? (
        <div className="mx-auto w-full max-w-6xl text-sm text-muted-foreground">
          Inga utställningar hittades för valt år.
        </div>
      ) : (
        filteredExhibitions.map((exhibition: Exhibition) => (
          <div key={exhibition.id}>
            <div className="mx-auto flex w-full max-w-6xl flex-row items-start gap-4">
              <div className="relative w-1/2">
                <Link href={`/exhibitions/${exhibition.id}`}>
                  <Image
                    src={exhibition.image}
                    alt={exhibition.name}
                    width={800}
                    height={500}
                    className="h-[360px] w-full object-cover"
                  />
                </Link>
              </div>
              <div className="flex w-1/2 flex-col items-start justify-start gap-2">
                <h2 className="text-3xl font-medium">{exhibition.name}</h2>
                <p className="text-lg text-muted-foreground">
                  {new Date(exhibition.date).toLocaleDateString("sv-SE", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="merriweather-long-text text-md">
                  {exhibition.description}
                </p>
                <Link
                  href={`/exhibitions/${exhibition.id}`}
                  className="mt-2 inline-block text-sm underline-offset-4 hover:text-primary hover:underline"
                >
                  Se detaljer
                </Link>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

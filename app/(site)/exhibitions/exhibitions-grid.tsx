"use client"

import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CalendarIcon } from "lucide-react"

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
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const itemsPerPage = 6

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
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    const years = exhibitions
      .filter((exhibition) => {
        const exhibitionDate = new Date(exhibition.date)
        return (
          !Number.isNaN(exhibitionDate.getTime()) &&
          exhibitionDate < startOfToday
        )
      })
      .map((exhibition) => new Date(exhibition.date).getFullYear())
      .filter((year) => Number.isFinite(year))

    return Array.from(new Set(years)).sort((a, b) => b - a)
  }, [exhibitions])

  const filteredExhibitions = useMemo(() => {
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    const pastAndCurrentExhibitions = exhibitions.filter((exhibition) => {
      const exhibitionDate = new Date(exhibition.date)
      return (
        !Number.isNaN(exhibitionDate.getTime()) && exhibitionDate < startOfToday
      )
    })

    if (selectedYear === "all") {
      return pastAndCurrentExhibitions
    }

    const targetYear = Number(selectedYear)
    return pastAndCurrentExhibitions.filter(
      (exhibition) => new Date(exhibition.date).getFullYear() === targetYear
    )
  }, [exhibitions, selectedYear])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedYear])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredExhibitions.length / itemsPerPage)
  )
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedExhibitions = filteredExhibitions.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">
        Laddar utställningar...
      </div>
    )
  }

  if (exhibitions.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        Inga utställningar hittades
      </div>
    )
  }

  return (
    <section className="mt-20 flex w-full flex-col gap-8">
      <div className="flex flex-col gap-5 border-b border-foreground/20 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow text-foreground">Arkiv</p>
          <h2 className="mt-3 font-heading text-4xl leading-none md:text-5xl">
            Tidigare utställningar
          </h2>
        </div>
        <Label className="flex items-center gap-2 text-sm">
          Filtrera efter år:
          <Select
            value={selectedYear}
            onValueChange={(value) => setSelectedYear(value ?? "alla")}
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
        <div className="flex w-full flex-col gap-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {paginatedExhibitions.map((exhibition: Exhibition) => (
              <article
                key={exhibition.id}
                className="group flex h-full flex-col"
              >
                <Link
                  href={`/exhibitions/${exhibition.id}`}
                  className="relative block overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                >
                  <Image
                    src={exhibition.image}
                    alt={exhibition.name}
                    width={600}
                    height={400}
                    className="aspect-4/3 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </Link>
                <div className="flex flex-1 flex-col gap-4 pt-5">
                  <Link
                    href={`/exhibitions/${exhibition.id}`}
                    className="relative block overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                  >
                    <h3 className="font-heading text-3xl leading-tight">
                      {exhibition.name}
                    </h3>
                  </Link>
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

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    text="Föregående"
                    onClick={(event) => {
                      event.preventDefault()
                      setCurrentPage(Math.max(1, currentPage - 1))
                    }}
                    aria-disabled={currentPage === 1}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={page === currentPage}
                      onClick={(event) => {
                        event.preventDefault()
                        setCurrentPage(page)
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    text="Nästa"
                    onClick={(event) => {
                      event.preventDefault()
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }}
                    aria-disabled={currentPage === totalPages}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </section>
  )
}

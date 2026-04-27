"use client"

import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
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
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
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
    <div className="my-10 flex flex-col gap-8">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <h2 className="text-xl font-medium">Tidigare utställningar</h2>
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
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {paginatedExhibitions.map((exhibition: Exhibition) => (
              <div key={exhibition.id}>
                <Card className="flex h-full max-w-md flex-col">
                  <CardHeader className="p-4">
                    <CardTitle className="text-center text-xl font-medium">
                      {exhibition.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-2">
                      <Image
                        src={exhibition.image}
                        alt={exhibition.name}
                        width={300}
                        height={200}
                        className="h-64 w-full object-cover"
                      />
                    </div>
                    <p className="text-md flex items-center gap-2">
                      <CalendarIcon className="size-4" />
                      {formatExhibitionDate(exhibition.date)}
                    </p>
                    <p className="merriweather-long-text text-md m-4 line-clamp-4 leading-loose">
                      {exhibition.description}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Link
                      href={`/exhibitions/${exhibition.id}`}
                      className="w-full"
                    >
                      <Button className="w-full">Se detaljer</Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
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

                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (page) => (
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
                  )
                )}

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
    </div>
  )
}

"use client"

import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function CollectionGrid() {
  interface Collection {
    id: number
    name: string
    year: number
    description: string
    image: string
  }

  //   Collections order by year descending
  const [collections, setCollections] = useState<Collection[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const isMobile = useIsMobile()
  const itemsPerPage = isMobile ? 3 : 4

  useEffect(() => {
    setCurrentPage(1)
  }, [isMobile])

  useEffect(() => {
    const fetchCollections = async () => {
      const supabase = await createClient()
      const { data } = await supabase
        .from("collection")
        .select("*")
        .order("year", { ascending: false })
      setCollections(data ?? [])
    }
    fetchCollections()
  }, [])

  if (!collections || collections.length === 0) {
    return (
      <div className="mx-auto w-full max-w-2xl min-w-0 text-center text-sm text-muted-foreground">
        Laddar kollektioner...
      </div>
    )
  }

  const totalPages = Math.max(1, Math.ceil(collections.length / itemsPerPage))
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCollections = collections.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  return (
    <div className="mx-auto mt-6 flex w-full max-w-2xl min-w-0 flex-col gap-10 md:max-w-4xl md:gap-8 lg:max-w-5xl">
      {paginatedCollections.map((collection: Collection) => (
        <Link
          key={collection.id}
          href={`/collections/${collection.id}`}
          className="group block w-full pb-10 last:pb-0 md:pb-0"
        >
          <article className="flex w-full min-w-0 flex-col gap-5 md:flex-row md:items-stretch md:gap-8">
            <div className="relative overflow-hidden md:w-1/2 md:shrink-0">
              <Image
                src={collection.image}
                alt={collection.name}
                width={600}
                height={450}
                sizes="(max-width: 767px) 100vw, 50vw"
                className="aspect-4/3 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col items-center gap-3 px-1 pt-4 text-center md:items-start md:px-6 md:pt-1 md:text-left">
              <h2 className="font-heading text-3xl leading-tight transition-transform duration-300 group-hover:translate-x-1 sm:text-4xl">
                {collection.name}
              </h2>
              <p className="text-xs font-semibold tracking-[0.18em] uppercase">
                {collection.year}
              </p>
              <p className="merriweather-long-text line-clamp-5 text-base leading-relaxed md:line-clamp-none md:text-lg">
                {collection.description}
              </p>
              <span className="artwork-details-link mt-auto translate-y-2 py-2 text-base opacity-0 transition-all duration-500 ease-out group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100">
                Se detaljer
              </span>
            </div>
          </article>
        </Link>
      ))}

      {totalPages > 1 && (
        <Pagination className="mx-auto w-full max-w-full px-2">
          <PaginationContent className="flex-wrap justify-center gap-1">
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
  )
}

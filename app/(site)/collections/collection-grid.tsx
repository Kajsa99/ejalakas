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
        <article
          key={collection.id}
          className="flex w-full min-w-0 flex-col gap-4 border-b border-border pb-10 last:border-b-0 last:pb-0 md:flex-row md:items-start md:gap-6 md:border-0 md:pb-0"
        >
          <Link
            href={`/collections/${collection.id}`}
            className="relative mx-auto block w-full max-w-xs shrink-0 sm:max-w-sm md:mx-0 md:max-w-[220px]"
          >
            <Image
              src={collection.image}
              alt={collection.name}
              width={400}
              height={400}
              sizes="(max-width: 767px) 100vw, 220px"
              className="aspect-square w-full object-cover"
            />
          </Link>
          <div className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center md:items-start md:text-left">
            <h2 className="text-xl font-medium sm:text-2xl md:text-3xl">
              {collection.name}
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base md:text-lg">
              {collection.year}
            </p>
            <p className="merriweather-long-text text-md line-clamp-5 md:line-clamp-none">
              {collection.description}
            </p>
            <Link
              href={`/collections/${collection.id}`}
              className="mt-2 inline-block text-sm underline-offset-4 hover:underline"
            >
              Se detaljer
            </Link>
          </div>
        </article>
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

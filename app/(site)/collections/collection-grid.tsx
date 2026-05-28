"use client"

import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import { useEffect, useState } from "react"
import Link from "next/link"
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
  const itemsPerPage = 4

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
      <div className="mx-auto w-full max-w-2xl min-w-80 text-center text-sm text-muted-foreground">
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
    <div className="mx-auto mt-6 flex w-full max-w-2xl min-w-lg flex-col gap-8">
      {paginatedCollections.map((collection: Collection) => (
        <div key={collection.id}>
          <div className="flex w-full flex-col items-center gap-4 md:flex-row md:items-start md:justify-center md:gap-6">
            <div className="relative w-full max-w-[180px] shrink-0 sm:max-w-[220px]">
              <Link href={`/collections/${collection.id}`} className="block">
                <Image
                  src={collection.image}
                  alt={collection.name}
                  width={400}
                  height={400}
                  sizes="(max-width: 767px) 180px, 220px"
                  className="aspect-square w-full object-cover"
                />
              </Link>
            </div>
            <div className="flex min-w-0 flex-col items-center justify-start gap-2 text-center md:items-start md:text-left">
              <h2 className="text-2xl font-medium md:text-3xl">
                {collection.name}
              </h2>
              <p className="text-base text-muted-foreground md:text-lg">
                {collection.year}
              </p>
              <p className="merriweather-long-text text-md">
                {collection.description}
              </p>
              <Link
                href={`/collections/${collection.id}`}
                className="mt-2 inline-block text-sm underline-offset-4 hover:text-primary hover:underline"
              >
                Se detaljer
              </Link>
            </div>
          </div>
        </div>
      ))}

      {totalPages > 1 && (
        <Pagination className="mx-auto w-fit">
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
  )
}

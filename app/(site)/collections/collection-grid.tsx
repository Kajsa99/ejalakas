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
      <div className="text-sm text-muted-foreground">
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
    <div className="mt-6 flex flex-col gap-8">
      {paginatedCollections.map((collection: Collection) => (
        <div key={collection.id}>
          <div className="mx-auto flex w-full max-w-6xl flex-row items-start gap-4">
            <div className="relative w-1/2">
              <Link href={`/collections/${collection.id}`}>
                <Image
                  src={collection.image}
                  alt={collection.name}
                  width={800}
                  height={500}
                  className="h-[360px] w-full object-cover"
                />
              </Link>
            </div>
            <div className="flex w-1/2 flex-col items-start justify-start gap-2">
              <h2 className="text-3xl font-medium">{collection.name}</h2>
              <p className="text-lg text-muted-foreground">{collection.year}</p>
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
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
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
                  currentPage === totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

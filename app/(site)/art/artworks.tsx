"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import Link from "next/link"
import { ForSaleBadge } from "@/components/for-sale-badge"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface Artwork {
  id: number
  name: string
  image: string
  description: string
  price: number
  status: boolean
  year: number
}

interface AllArtworksProps {
  artworks: Artwork[]
}

export default function Artworks() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  useEffect(() => {
    const fetchArtworks = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("art").select("*")
      setArtworks(data ?? [])
    }
    fetchArtworks()
  }, [])
  const totalPages = Math.max(1, Math.ceil(artworks.length / itemsPerPage))
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedArtworks = artworks.slice(startIndex, startIndex + itemsPerPage)

  return artworks.length > 0 ? (
    <AllArtworks
      artworks={paginatedArtworks}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
    />
  ) : (
    <div>No artworks found</div>
  )
}

function AllArtworks({
  artworks,
  currentPage,
  totalPages,
  onPageChange,
}: AllArtworksProps & {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {artworks.map((art) => (
          <article
            key={art.id}
            className="outfit-uniquifier mt-6 w-full max-w-md overflow-hidden bg-amber-50"
          >
            <div className="relative">
              <Link href={`/art/${art.id}`}>
                <Image
                  src={art.image}
                  alt={art.name}
                  width={400}
                  height={400}
                  className="block h-[240px] w-full object-cover"
                />
              </Link>
              <div className="absolute right-2 bottom-2 z-10">
                <ForSaleBadge sold={art.status} />
              </div>
            </div>
            <div className="flex flex-col p-4">
              <div className="flex w-full flex-row items-center justify-between">
                <h2 className="outfit-uniquifier text-lg">{art.name}</h2>
                <p className="text-md text-muted-foreground">{art.year}</p>
              </div>
              <div className="flex w-full justify-end">
                <Link
                  href={`/art/${art.id}`}
                  className="mt-2 inline-block text-sm underline-offset-4 hover:text-primary hover:underline"
                >
                  Se detaljer
                </Link>
              </div>
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
                  onPageChange(Math.max(1, currentPage - 1))
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
                      onPageChange(page)
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
                  onPageChange(Math.min(totalPages, currentPage + 1))
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

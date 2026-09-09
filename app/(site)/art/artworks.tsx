"use client"

import { useEffect, useMemo, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import ArtworkCard from "@/components/artwork-card"
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

interface Artwork {
  id: number
  name: string
  image: string
  description: string
  price: number
  status: boolean
  year: number
}

type ArtSortOption =
  | "newest"
  | "oldest"
  | "name-asc"
  | "name-desc"
  | "for-sale-first"
  | "sold-first"

const ART_SORT_LABELS: Record<ArtSortOption, string> = {
  newest: "Nyast först",
  oldest: "Äldst först",
  "name-asc": "Namn (A–Ö)",
  "name-desc": "Namn (Ö–A)",
  "for-sale-first": "Till salu först",
  "sold-first": "Sålda först",
}

const ART_SORT_OPTIONS = Object.entries(ART_SORT_LABELS) as [
  ArtSortOption,
  string,
][]

function sortArtworks(artworks: Artwork[], sort: ArtSortOption): Artwork[] {
  const sorted = [...artworks]

  switch (sort) {
    case "newest":
      return sorted.sort((a, b) => b.id - a.id)
    case "oldest":
      return sorted.sort((a, b) => a.id - b.id)
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name, "sv-SE"))
    case "name-desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name, "sv-SE"))
    case "for-sale-first":
      return sorted.sort((a, b) => Number(a.status) - Number(b.status))
    case "sold-first":
      return sorted.sort((a, b) => Number(b.status) - Number(a.status))
  }
}

interface AllArtworksProps {
  artworks: Artwork[]
}

export default function Artworks() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [sortOption, setSortOption] = useState<ArtSortOption>("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  useEffect(() => {
    const fetchArtworks = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("art").select("*")
      setArtworks(data ?? [])
    }
    fetchArtworks()
  }, [])

  const sortedArtworks = useMemo(
    () => sortArtworks(artworks, sortOption),
    [artworks, sortOption]
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [sortOption])

  const totalPages = Math.max(
    1,
    Math.ceil(sortedArtworks.length / itemsPerPage)
  )
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedArtworks = sortedArtworks.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  return artworks.length > 0 ? (
    <AllArtworks
      artworks={paginatedArtworks}
      sortOption={sortOption}
      onSortChange={setSortOption}
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
  sortOption,
  onSortChange,
  currentPage,
  totalPages,
  onPageChange,
}: AllArtworksProps & {
  sortOption: ArtSortOption
  onSortChange: (sort: ArtSortOption) => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex w-full items-center justify-end">
        <Label className="flex items-center gap-2 text-base">
          Sortera:
          <Select
            value={sortOption}
            onValueChange={(value) => {
              if (value) {
                onSortChange(value as ArtSortOption)
              }
            }}
          >
            <SelectTrigger className="h-10 min-w-48 rounded-md border border-border bg-background px-3 py-2 text-base text-foreground">
              <SelectValue className="text-base">
                {ART_SORT_LABELS[sortOption]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="text-base">
              {ART_SORT_OPTIONS.map(([value, label]) => (
                <SelectItem
                  key={value}
                  value={value}
                  className="min-h-10 py-2 text-base"
                >
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Label>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {artworks.map((art) => (
          <ArtworkCard
            key={art.id}
            id={art.id}
            name={art.name}
            image={art.image}
            year={art.year}
            status={art.status}
          />
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

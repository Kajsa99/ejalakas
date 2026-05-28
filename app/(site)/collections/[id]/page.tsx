import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import ArtworkCard from "@/components/artwork-card"
import { ArrowLeftIcon } from "lucide-react"

interface Artwork {
  id: number
  name: string
  image: string
  year: number
  status: boolean
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: collection } = await supabase
    .from("collection")
    .select("*")
    .eq("id", Number(id))
    .single()

  if (!collection) {
    notFound()
  }

  //   Artworks order by name ascending
  const { data: artworks } = await supabase
    .from("art")
    .select("*")
    .eq("collection_id", Number(id))
    .order("name", { ascending: true })

  return (
    <div className="min-h-screen px-4 pt-20 pb-12 sm:px-6">
      <div className="mx-auto flex w-full max-w-7xl min-w-0 flex-col">
        <Link
          href="/collections"
          className="text-md mb-4 flex w-fit flex-row items-center gap-2 text-primary hover:underline sm:mb-6"
        >
          <ArrowLeftIcon className="size-4" />
          Tillbaka
        </Link>
        <div className="flex w-full max-w-4xl min-w-0 flex-col gap-4 md:flex-row md:items-start md:gap-6">
          <div className="flex w-full min-w-0 flex-col gap-2">
            <h1 className="text-xl font-medium sm:text-2xl">
              Kollektion {collection.name}
            </h1>
            <p className="text-sm text-muted-foreground">{collection.year}</p>
            <p className="merriweather-long-text text-md">
              {collection.description}
            </p>
          </div>
        </div>

        <div className="mt-10 w-full">
          <p className="text-xl">Alla verk i kollektionen</p>
          {!artworks || artworks.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Inga verk hittades i den här kollektionen.
            </p>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(artworks as Artwork[]).map((artwork) => (
                <ArtworkCard
                  key={artwork.id}
                  id={artwork.id}
                  name={artwork.name}
                  image={artwork.image}
                  year={artwork.year}
                  status={artwork.status}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

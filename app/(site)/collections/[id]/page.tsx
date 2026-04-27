import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ForSaleBadge } from "@/components/for-sale-badge"
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
    <div className="my-20 flex min-h-svh flex-col items-center p-6">
      <Link
        href="/collections"
        className="text-md flex w-fit flex-row items-center gap-2 self-start text-primary hover:underline"
      >
        <ArrowLeftIcon className="size-4" />
        Tillbaka
      </Link>
      <div className="flex max-w-4xl flex-row gap-4">
        <Image
          src={collection.image}
          alt={collection.name}
          width={500}
          height={500}
          className="h-auto w-1/2 object-cover"
          unoptimized
        />
        <div className="flex w-1/2 flex-col gap-2">
          <h1 className="text-2xl font-medium">Kollektion {collection.name}</h1>
          <p className="text-sm text-muted-foreground">{collection.year}</p>
          <p className="merriweather-long-text text-md">{collection.description}</p>
        </div>
      </div>
      <div className="mx-auto mt-10 w-full max-w-7xl">
        {!artworks || artworks.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Inga verk hittades i den här kollektionen.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(artworks as Artwork[]).map((artwork) => (
              <article
                key={artwork.id}
                className="w-full overflow-hidden bg-amber-50"
              >
                <div className="relative">
                  <Link href={`/art/${artwork.id}`}>
                    <Image
                      src={artwork.image}
                      alt={artwork.name}
                      width={400}
                      height={300}
                      className="block h-[220px] w-full object-cover"
                    />
                  </Link>
                  <div className="absolute right-2 bottom-2 z-10">
                    <ForSaleBadge sold={artwork.status} />
                  </div>
                </div>
                <div className="p-4">
                  <div className="mt-3 flex items-center justify-between">
                    <h2 className="text-base">{artwork.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {artwork.year}
                    </p>
                  </div>
                  <Link
                    href={`/art/${artwork.id}`}
                    className="mt-2 inline-block text-sm text-primary underline-offset-4 hover:underline"
                  >
                    Se detaljer
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

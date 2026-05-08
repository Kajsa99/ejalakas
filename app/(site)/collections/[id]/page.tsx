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
          <div className="relative w-full shrink-0 overflow-hidden md:w-1/2">
            <Image
              src={collection.image}
              alt={collection.name}
              width={500}
              height={500}
              sizes="(max-width: 767px) 100vw, 448px"
              className="aspect-square w-full object-cover md:aspect-auto md:h-auto"
              unoptimized
            />
          </div>
          <div className="flex w-full min-w-0 flex-col gap-2 md:w-1/2">
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
          {!artworks || artworks.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Inga verk hittades i den här kollektionen.
            </p>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(artworks as Artwork[]).map((artwork) => (
                <article
                  key={artwork.id}
                  className="w-full overflow-hidden bg-amber-50 dark:bg-zinc-900"
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
    </div>
  )
}

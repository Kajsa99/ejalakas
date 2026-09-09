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

  // Artworks order by name ascending
  const { data: artworks } = await supabase
    .from("art")
    .select("*")
    .eq("collection_id", Number(id))
    .order("name", { ascending: true })

  return (
    <div className="site-page">
      <div className="site-intro">
        <div className="max-w-3xl">
          <Link
            href="/collections"
            className="eyebrow mb-8 inline-flex w-fit items-center gap-2 text-foreground hover:underline"
          >
            <ArrowLeftIcon className="size-4" />
            Tillbaka
          </Link>
          <p className="eyebrow mb-4 text-foreground">E. Jalakas / Samling</p>
          <h1 className="page-heading">{collection.name}</h1>
          <p className="mt-5 text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            {collection.year}
          </p>
          <p className="site-intro-copy mt-6 max-w-2xl">
            {collection.description}
          </p>
        </div>
      </div>

      <section className="w-full border-foreground/20 pt-8">
        <div className="mb-8">
          <h2 className="mt-3 font-heading text-4xl leading-none md:text-5xl">
            Alla verk
          </h2>
        </div>
        <div className="mb-8">
          <p className="text-sm text-muted-foreground">
            Här hittar du alla konstverk i den här kollektionen.
          </p>
        </div>
        {!artworks || artworks.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Inga verk hittades i den här kollektionen.
          </p>
        ) : (
          <div className="mb-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
      </section>
    </div>
  )
}

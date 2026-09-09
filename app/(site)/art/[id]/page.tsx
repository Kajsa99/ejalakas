import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { STORAGE_BUCKET, STORAGE_IMAGE_PATHS } from "@/lib/storage-image-paths"
import { Badge } from "@/components/ui/badge"
import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "lucide-react"
import { ArtImageViewer } from "./art-image-viewer"
import { ArtStatusBadge } from "./art-status-badge"

export default async function ArtIdPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <Suspense fallback={<ArtDetailFallback />}>
      <ArtDetail id={Number(id)} />
    </Suspense>
  )
}

async function ArtDetail({ id }: { id: number }) {
  const supabase = await createClient()

  const { data: artwork } = await supabase
    .from("art")
    .select("*")
    .eq("id", Number(id))
    .single()

  if (!artwork) {
    notFound()
  }

  let collection: { id: number; name: string } | null = null
  if (artwork.collection_id !== null && artwork.collection_id !== undefined) {
    const { data } = await supabase
      .from("collection")
      .select("id, name")
      .eq("id", Number(artwork.collection_id))
      .maybeSingle()
    collection = data
  }

  const dbImagePath = String(artwork.image ?? "").trim()
  const isAbsoluteUrl =
    dbImagePath.startsWith("http://") || dbImagePath.startsWith("https://")
  const storageImagePath = dbImagePath
    ? dbImagePath.startsWith("img/")
      ? dbImagePath
      : `img/${dbImagePath}`
    : STORAGE_IMAGE_PATHS.artFallback
  const imageSrc = isAbsoluteUrl
    ? dbImagePath
    : supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storageImagePath).data
        .publicUrl

  return (
    <div className="site-page">
      <div className="mb-10">
        <Link
          href="/art"
          className="eyebrow inline-flex w-fit items-center gap-2 text-foreground hover:underline"
        >
          <ArrowLeftIcon className="size-4" />
          Tillbaka
        </Link>
      </div>

      <article className="w-full">
        <div className="mb-20 grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.6fr)] md:items-start md:gap-20">
          <div className="relative w-full">
            <ArtImageViewer src={imageSrc} alt={artwork.name} />
          </div>

          <div className="flex w-full flex-col border-t border-foreground/20 pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-8">
            <p className="eyebrow text-foreground">E. Jalakas / Galleri</p>
            <div className="mt-4 flex items-start justify-between gap-4">
              <h1 className="font-heading text-4xl leading-none md:text-5xl">
                {artwork.name}
              </h1>
              <p className="shrink-0 text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                {artwork.year}
              </p>
            </div>

            <p className="merriweather-long-text mt-8 text-base leading-relaxed text-muted-foreground">
              {artwork.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-foreground/15 pt-5">
              <Badge variant="outline" className="text-sm">
                {artwork.price}kr
              </Badge>
              <ArtStatusBadge sold={artwork.status} />
            </div>

            {collection ? (
              <Link
                href={`/collections/${collection.id}`}
                className="mt-6 text-base text-foreground/80 hover:underline"
              >
                Kollektion {collection.name}
              </Link>
            ) : null}

            <div className="mt-10 flex w-full justify-start">
              {artwork.status ? (
                <p className="text-base text-muted-foreground">
                  Tavlan är såld
                </p>
              ) : (
                <Link href={`/art/${id}/buy`}>
                  <Button variant="default" className="px-5 py-4 text-base">
                    Skicka förfrågan
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}

function ArtDetailFallback() {
  return (
    <div className="mx-auto w-full max-w-5xl p-6 text-sm text-muted-foreground">
      Laddar konstverk...
    </div>
  )
}

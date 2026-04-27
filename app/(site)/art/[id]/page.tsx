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
    <div className="my-20 min-h-screen p-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col">
        <Link
          href="/art"
          className="text-md mb-6 flex w-fit flex-row items-center gap-2 text-primary hover:underline"
        >
          <ArrowLeftIcon className="size-4" />
          Tillbaka
        </Link>

        <article className="w-full">
          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            <div className="relative w-full md:w-2/3">
              <ArtImageViewer src={imageSrc} alt={artwork.name} />
            </div>

            <div className="flex w-full flex-col gap-5 rounded-md p-4 md:w-[460px] md:shrink-0 dark:bg-zinc-900">
              <div className="flex flex-row items-center justify-between gap-2">
                <h1 className="outfit-uniquifier text-2xl">{artwork.name}</h1>
                <p className="outfit-uniquifier text-md text-muted-foreground">
                  {artwork.year}
                </p>
              </div>

              <div className="space-y-4 bg-amber-50 p-4 pr-1">
                <p className="merriweather-long-text text-sm leading-loose text-muted-foreground">
                  {artwork.description}
                </p>

                <div className="outfit-uniquifier flex flex-row items-center gap-2 pt-1">
                  <Badge variant={"outline"} className="text-sm">
                    {artwork.price}kr
                  </Badge>
                  <ArtStatusBadge sold={artwork.status} />
                </div>

                {collection ? (
                  <div className="pt-1">
                    <Link href={`/collections/${collection.id}`}>
                      <p className="outfit-uniquifier text-md font-medium text-primary hover:underline">
                        Kollektion {collection?.name}
                      </p>
                    </Link>
                  </div>
                ) : null}
              </div>

              <div className="flex w-full justify-end pt-1">
                {artwork.status ? (
                  <p className="text-base text-muted-foreground">
                    Tavlan är såld
                  </p>
                ) : (
                  <Link href={`/art/${id}/buy`}>
                    <Button variant={"default"} className="p-4 text-lg">
                      Skicka förfågan
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </article>
      </div>
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

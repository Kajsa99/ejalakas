import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ForSaleBadge } from "@/components/for-sale-badge"
import { STORAGE_BUCKET, STORAGE_IMAGE_PATHS } from "@/lib/storage-image-paths"
import { Badge } from "@/components/ui/badge"
import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "lucide-react"

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
    <div className="my-20 p-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col">
      <Link
        href="/art"
        className="text-md mb-6 flex w-fit flex-row items-center gap-2 text-primary hover:underline"
      >
        <ArrowLeftIcon className="size-4" />
        Tillbaka
      </Link>

      <article className="w-full overflow-hidden bg-amber-50 dark:bg-zinc-900">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative w-full md:w-2/3">
            <Image
              src={imageSrc}
              alt={artwork.name}
              width={900}
              height={900}
              priority
              className="block h-[520px] w-full object-cover"
              unoptimized
            />
            <div className="outfit-uniquifier absolute right-2 bottom-2 z-10">
              <ForSaleBadge sold={artwork.status} />
            </div>
          </div>

          <div className="flex w-full flex-col p-4 md:w-1/3">
            <div className="flex flex-row items-center justify-between gap-2">
              <h1 className="outfit-uniquifier text-2xl">{artwork.name}</h1>
              <p className="outfit-uniquifier text-md text-muted-foreground">
                {artwork.year}
              </p>
            </div>
            <p className="merriweather-long-text mt-4 text-sm leading-loose text-muted-foreground">
              {artwork.description}
            </p>
            <div className="outfit-uniquifier mt-2 flex flex-row items-baseline gap-2">
              <Badge variant={"outline"} className="text-sm">
                {artwork.price}kr
              </Badge>
            </div>
            {collection ? (
              <Link href={`/collections/${collection.id}`}>
                <p className="outfit-uniquifier text-md mt-2 font-medium text-primary hover:underline">
                  Kollektion {collection?.name}
                </p>
              </Link>
            ) : null}
            <div className="mt-auto flex w-full justify-end pt-2">
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

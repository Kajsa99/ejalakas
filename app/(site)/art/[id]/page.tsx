import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ForSaleBadge } from "@/components/for-sale-badge"
import { STORAGE_BUCKET, STORAGE_IMAGE_PATHS } from "@/lib/storage-image-paths"
import { Badge } from "@/components/ui/badge"
import { Suspense } from "react"

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
    <div className="mx-auto mt-20 flex w-full max-w-5xl flex-col gap-6 bg-amber-50 p-6 md:flex-row">
      <div className="relative w-full md:w-1/2">
        <div className="relative">
          <Image
            src={imageSrc}
            alt={artwork.name}
            width={900}
            height={900}
            priority
            className="h-auto w-full object-cover"
            unoptimized
          />
          <div className="absolute right-2 bottom-2 z-10">
            <ForSaleBadge sold={artwork.status} />
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3 md:w-1/2">
        <div className="flex flex-row items-baseline gap-2">
          <h1 className="text-3xl font-semibold">{artwork.name}</h1>
          <p className="text-lg text-muted-foreground">{artwork.year}</p>
        </div>
        <div className="flex flex-row items-baseline gap-2">
          <Badge variant={"outline"} className="text-sm">
            {artwork.price}kr
          </Badge>
        </div>
        <p className="text-base">{artwork.description}</p>
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

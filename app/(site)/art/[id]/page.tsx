import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { STORAGE_BUCKET, STORAGE_IMAGE_PATHS } from "@/lib/storage-image-paths"

export default async function ArtIdPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
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
  const imagePath = dbImagePath.startsWith("img/")
    ? dbImagePath
    : STORAGE_IMAGE_PATHS.artFallback
  const imageSrc = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(imagePath)
    .data.publicUrl

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6 md:flex-row">
      <div className="relative w-full md:w-1/2">
        <Image
          src={imageSrc}
          alt={artwork.name}
          width={900}
          height={900}
          className="h-full w-full object-cover"
          unoptimized
        />
        <Badge className="text-md absolute right-3 bottom-3">
          {artwork.status}
        </Badge>
      </div>

      <div className="flex w-full flex-col gap-3 md:w-1/2">
        <h1 className="text-3xl font-semibold">{artwork.name}</h1>
        <div className="flex flex-row gap-2 text-sm">
          <p className="text-sm text-muted-foreground">{artwork.year}</p>{" "}
          <p className="font-medium">{artwork.price} kr</p>
        </div>
        <p className="text-base">{artwork.description}</p>
      </div>
    </div>
  )
}

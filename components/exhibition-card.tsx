import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import Image from "next/image"
import { STORAGE_BUCKET, STORAGE_IMAGE_PATHS } from "@/lib/storage-image-paths"

async function ExhibitionSection() {
  const supabase = await createClient()
  const { data } = await supabase.from("exhibition").select("*").limit(1)
  const dbImagePath = String(data?.[0]?.image ?? "").trim()
  const imagePath = dbImagePath.startsWith("img/")
    ? dbImagePath
    : STORAGE_IMAGE_PATHS.exhibitionFallback
  const imageSrc = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(imagePath)
    .data.publicUrl

  return (
    <article className="outfit-uniquifier mt-6 w-full max-w-md overflow-hidden bg-amber-50 dark:bg-zinc-900">
      <Link href="/exhibitions" className="block text-primary hover:underline">
        <Image
          src={imageSrc}
          alt={data?.[0]?.name ?? "Laddar..."}
          width={400}
          height={400}
          className="block h-[240px] w-full object-cover"
          unoptimized
        />
        <div className="flex flex-col p-4 text-lg">Utställningar</div>
      </Link>
    </article>
  )
}

export default function ExhibitionCard() {
  return (
    <Suspense
      fallback={<div className="p-3 text-sm text-gray-500">Laddar...</div>}
    >
      <ExhibitionSection />
    </Suspense>
  )
}

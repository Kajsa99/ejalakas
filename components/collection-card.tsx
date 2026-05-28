import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import Image from "next/image"
import { STORAGE_BUCKET, STORAGE_IMAGE_PATHS } from "@/lib/storage-image-paths"
import ContentCardSkeleton from "@/components/content-card-skeleton"

async function CollectionSection() {
  const supabase = await createClient()
  const { data } = await supabase.from("collection").select("*").limit(1)
  const dbImagePath = String(data?.[0]?.image ?? "").trim()
  const imagePath = dbImagePath.startsWith("img/")
    ? dbImagePath
    : STORAGE_IMAGE_PATHS.collectionFallback
  const imageSrc = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(imagePath)
    .data.publicUrl

  return (
    <article className="outfit-uniquifier mt-6 w-full max-w-sm overflow-hidden bg-amber-50 dark:bg-zinc-900">
      <Link
        href="/collections"
        className="group relative block text-primary hover:no-underline"
      >
        <Image
          src={imageSrc}
          alt={data?.[0]?.name ?? "Laddar..."}
          width={420}
          height={560}
          className="block h-[420px] w-full object-cover"
          unoptimized
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-pink-400/45 opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">
          <span className="text-3xl font-semibold text-white">Kollektioner</span>
        </div>
      </Link>
    </article>
  )
}

export default function CollectionCard() {
  return (
    <Suspense fallback={<ContentCardSkeleton labelWidthClass="w-32" />}>
      <CollectionSection />
    </Suspense>
  )
}

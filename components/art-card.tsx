import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Suspense } from "react"
import Image from "next/image"
import { STORAGE_BUCKET, STORAGE_IMAGE_PATHS } from "@/lib/storage-image-paths"
import ContentCardSkeleton from "@/components/content-card-skeleton"
import { ArrowUpRight } from "lucide-react"

async function ArtworkSection() {
  const supabase = await createClient()
  const { data } = await supabase.from("art").select("*").limit(1)
  const dbImagePath = String(data?.[0]?.image ?? "").trim()
  const imagePath = dbImagePath.startsWith("img/")
    ? dbImagePath
    : STORAGE_IMAGE_PATHS.artFallback
  const imageSrc = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(imagePath)
    .data.publicUrl
  return (
    <article className="home-card outfit-uniquifier group/card w-full overflow-hidden rounded-[4px] border border-foreground/10 bg-card shadow-[0_14px_35px_-24px_rgba(20,15,10,0.55)]">
      <Link
        href="/art"
        className="group relative block text-foreground hover:no-underline"
      >
        <div className="relative overflow-hidden">
          <Image
            src={imageSrc}
            alt={data?.[0]?.name ?? "Laddar..."}
            width={420}
            height={560}
            className="block aspect-[4/5] h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            unoptimized
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-100" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
          <span className="translate-y-2 font-heading text-4xl text-white/80 transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-110 group-hover:tracking-wide group-hover:text-white">
            Konstverk
          </span>
          <ArrowUpRight
            className="size-6 shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            aria-hidden="true"
          />
        </div>
      </Link>
    </article>
  )
}

export default function ArtCard() {
  return (
    <Suspense fallback={<ContentCardSkeleton labelWidthClass="w-24" />}>
      <ArtworkSection />
    </Suspense>
  )
}

import { createClient } from "@/lib/supabase/server"
import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { ForSaleBadge } from "@/components/for-sale-badge"
import { Badge } from "@/components/ui/badge"

async function ArtHighlightSection() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("art")
    .select("*")
    .limit(1)
    .order("id", { ascending: false })

  return (
    <article className="w-full max-w-4xl overflow-hidden bg-amber-50 dark:bg-zinc-900">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative w-full md:w-2/3">
          <Link href={`/art/${data?.[0]?.id ?? ""}`}>
            <Image
              src={data?.[0]?.image ?? ""}
              alt={data?.[0]?.name ?? "Laddar..."}
              width={800}
              height={500}
              className="block h-[360px] w-full object-cover"
              unoptimized
            />
          </Link>
          <div className="outfit-uniquifier absolute right-2 bottom-2 z-10">
            <ForSaleBadge sold={data?.[0]?.status ?? false} />
          </div>
        </div>

        <div className="flex w-full flex-col p-4 md:w-1/3">
          <div className="flex w-full flex-row items-center justify-between">
            <h2 className="outfit-uniquifier text-xl">
              {data?.[0]?.name ?? "Laddar..."}
            </h2>
            <p className="outfit-uniquifier text-md text-muted-foreground">
              {data?.[0]?.year ?? "Laddar..."}
            </p>
          </div>
          <p className="merriweather-long-text mt-2 text-sm text-muted-foreground">
            {data?.[0]?.description ?? "Laddar..."}
          </p>
          <div className="outfit-uniquifier mt-2 flex flex-row items-center gap-2">
            <Badge variant="outline" className="text-sm">
              {data?.[0]?.price ?? "Laddar..."}kr
            </Badge>
          </div>
          <div className="outfit-uniquifier mt-auto flex w-full justify-end px-0">
            <Link
              href={`/art/${data?.[0]?.id ?? ""}`}
              className="mt-2 inline-block text-sm underline-offset-4 hover:text-primary hover:underline"
            >
              Se detaljer
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function ArtHighlight() {
  return (
    <Suspense
      fallback={<div className="p-3 text-sm text-gray-500">Laddar...</div>}
    >
      <ArtHighlightSection />
    </Suspense>
  )
}

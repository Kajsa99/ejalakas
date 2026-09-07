import { createClient } from "@/lib/supabase/server"
import { Suspense } from "react"
import ArtHighlightCarousel from "@/app/(site)/art/art-highlight-carousel"

async function ArtHighlightSection() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("art")
    .select("*")
    .limit(3)
    .order("id", { ascending: false })

  return <ArtHighlightCarousel artworks={data ?? []} />
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

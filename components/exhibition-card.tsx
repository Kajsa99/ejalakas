import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Card, CardContent, CardAction } from "@/components/ui/card"
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
    <div>
      <Card className="w-full bg-amber-50 shadow-lg">
        <CardContent className="text-center">
          <Image
            src={imageSrc}
            alt={data?.[0]?.name ?? "Laddar..."}
            width={250}
            height={800}
            className="mx-auto h-auto w-[250px]"
            unoptimized
          />
          {data?.[0]?.name ?? "Laddar..."}
          <CardAction>
            <Link href="/collection" className="text-sm text-primary">
              Utställningar
            </Link>
          </CardAction>
        </CardContent>
      </Card>
    </div>
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

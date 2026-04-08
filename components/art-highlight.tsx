import { createClient } from "@/lib/supabase/server"
import { Suspense } from "react"
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import Image from "next/image"
import { STORAGE_BUCKET, STORAGE_IMAGE_PATHS } from "@/lib/storage-image-paths"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ForSaleBadge } from "@/components/for-sale-badge"

async function ArtHighlightSection() {
  const supabase = await createClient()
  const { data } = await supabase.from("art").select("*").limit(1)
  const dbImagePath = String(data?.[0]?.image ?? "").trim()
  const imagePath = dbImagePath.startsWith("img/")
    ? dbImagePath
    : STORAGE_IMAGE_PATHS.artFallback
  const imageSrc = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(imagePath)
    .data.publicUrl
  return (
    <Card className="flex flex-row overflow-hidden bg-amber-50">
      <div className="relative w-2/3 p-6">
        <div className="relative">
          <Image
            src={imageSrc}
            alt={data?.[0]?.name ?? "Laddar..."}
            width={500}
            height={500}
            className="h-[400px] object-cover"
            unoptimized
          />
          <div className="absolute right-2 bottom-2 z-10">
            <ForSaleBadge sold={data?.[0]?.status ?? false} />
          </div>
        </div>
      </div>

      <CardContent className="flex w-1/3 flex-col gap-2 p-6 text-left">
        <CardTitle>{data?.[0]?.name ?? "Laddar..."}</CardTitle>
        <CardDescription>
          {data?.[0]?.description ?? "Laddar..."}
        </CardDescription>
        <CardDescription>{data?.[0]?.year ?? "Laddar..."}</CardDescription>
        <CardDescription>{data?.[0]?.price ?? "Laddar..."}kr</CardDescription>

        <CardFooter className="mt-auto px-0">
          <Button variant="outline">
            <Link href={`/art/${data?.[0]?.id ?? ""}`}>Se detaljer</Link>
          </Button>
        </CardFooter>
      </CardContent>
    </Card>
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

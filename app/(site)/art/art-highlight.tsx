import { createClient } from "@/lib/supabase/server"
import { Suspense } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import Image from "next/image"
import { STORAGE_BUCKET, STORAGE_IMAGE_PATHS } from "@/lib/storage-image-paths"
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
    <Card className="w-full max-w-4xl bg-amber-50">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative w-full md:w-2/3">
            <CardHeader className="p-0">
              <Link href={`/art/${data?.[0]?.id ?? ""}`}>
                <Image
                  src={imageSrc}
                  alt={data?.[0]?.name ?? "Laddar..."}
                  width={800}
                  height={500}
                  className="h-[360px] w-full object-cover"
                  unoptimized
                />
              </Link>
            </CardHeader>
            <div className="absolute right-2 bottom-2 z-10">
              <ForSaleBadge sold={data?.[0]?.status ?? false} />
            </div>
          </div>

          <div className="flex w-full flex-col md:w-1/3">
            <div className="flex w-full flex-row items-center justify-between">
              <CardTitle className="text-lg">
                {data?.[0]?.name ?? "Laddar..."}
              </CardTitle>
              <CardDescription className="text-md">
                {data?.[0]?.year ?? "Laddar..."}
              </CardDescription>
            </div>
            <CardDescription className="text-md mt-2">
              {data?.[0]?.description ?? "Laddar..."}
            </CardDescription>
            <CardDescription className="text-md mt-2">
              {data?.[0]?.price ?? "Laddar..."}kr
            </CardDescription>
            <CardFooter className="mt-auto flex w-full justify-end px-0">
              <Link
                href={`/art/${data?.[0]?.id ?? ""}`}
                className="mt-2 inline-block text-sm underline-offset-4 hover:text-primary hover:underline"
              >
                Se detaljer
              </Link>
            </CardFooter>
          </div>
        </div>
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

import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Suspense } from "react"
import { Card, CardAction, CardContent } from "@/components/ui/card"
import Image from "next/image"
import artImage from "../app/(photos)/image0(1).jpeg"

async function ArtworkSection() {
  const supabase = await createClient()
  const { data } = await supabase.from("art").select("*").limit(1)
  return (
    <Card className="shadow-lg">
      <CardContent className="text-center">
        {data?.[0]?.name ?? "Laddar..."}
        {/* temporär img */}
        <Image
          src={artImage}
          alt={data?.[0]?.name ?? "Laddar..."}
          width={200}
          height={800}
        />
        <CardAction>
          <Link href="/art" className="text-sm text-primary">
            Till Salu
          </Link>
        </CardAction>
      </CardContent>
    </Card>
  )
}

export default function ArtCard() {
  return (
    <Suspense
      fallback={<div className="p-3 text-sm text-gray-500">Laddar...</div>}
    >
      <ArtworkSection />
    </Suspense>
  )
}

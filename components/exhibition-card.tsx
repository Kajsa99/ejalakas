import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Card, CardContent, CardAction } from "@/components/ui/card"
import Image from "next/image"
import exhibitionImage from "../app/(photos)/image10.jpeg"

async function ExhibitionSection() {
  const supabase = await createClient()
  const { data } = await supabase.from("exhibition").select("*").limit(1)
  return (
    <div>
      <Card className="w-full shadow-lg">
        <CardContent className="text-center">
          {/* temporär img */}
          <Image
            src={exhibitionImage}
            alt={data?.[0]?.name ?? "Laddar..."}
            width={250}
            height={1000}
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

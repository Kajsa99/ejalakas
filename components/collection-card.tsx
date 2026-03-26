import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Card, CardContent, CardAction } from "@/components/ui/card"
import Image from "next/image"
import collectionImage from "../app/(photos)/image4 (2).jpeg"

async function CollectionSection() {
  const supabase = await createClient()
  const { data } = await supabase.from("collection").select("*").limit(1)
  return (
    <div>
      <Card className="shadow-lg">
        <CardContent className="text-center">
          {/* temporär img */}
          <Image
            src={collectionImage}
            alt={data?.[0]?.name ?? "Laddar..."}
            width={200}
            height={800}
          />
          {data?.[0]?.name ?? "Laddar..."}
          <CardAction>
            <Link href="/collection" className="text-sm text-primary">
              Kollektioner
            </Link>
          </CardAction>
        </CardContent>
      </Card>
    </div>
  )
}

export default function CollectionCard() {
  return (
    <Suspense
      fallback={<div className="p-3 text-sm text-gray-500">Laddar...</div>}
    >
      <CollectionSection />
    </Suspense>
  )
}

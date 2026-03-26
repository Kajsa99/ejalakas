import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Suspense } from "react"
import { Card, CardContent, CardTitle } from "@/components/ui/card"

async function ArtworkSection() {
  const supabase = await createClient()
  const { data } = await supabase.from("art").select("*").limit(1)
  return (
    <Card>
      <CardContent>
        <Link href="/art">
          {" "}
          {data?.[0]?.name ?? "Laddar..."}
          <CardTitle className="text-center">Till Salu</CardTitle>
        </Link>
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

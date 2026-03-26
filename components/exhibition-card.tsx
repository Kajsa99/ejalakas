import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

async function ExhibitionSection() {
  const supabase = await createClient()
  const { data } = await supabase.from("exhibition").select("*").limit(1)
  return (
    <div>
      <Link href="/exhibitions">
        Utställningar {data?.[0]?.name ?? "Laddar..."}
      </Link>
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

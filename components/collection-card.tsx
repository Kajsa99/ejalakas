import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

async function CollectionSection() {
  const supabase = await createClient()
  const { data } = await supabase.from("collection").select("*").limit(1)
  return (
    <div>
      <Link href="/collections">
        Kollektioner {data?.[0]?.name ?? "Laddar..."}
      </Link>
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

import { createClient } from "@/lib/supabase/server"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { Suspense } from "react"

async function getData() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("art").select("*").limit(5)
  return { data, error }
}

async function SupabaseArtSection() {
  const { data, error } = await getData()

  if (error) {
    return (
      <div className="rounded border p-3 text-red-600">
        Error: {error.message}
      </div>
    )
  }

  return (
    // testar att supabase är kopplad och kan hämta data
    <div className="rounded border p-3">
      <p className="font-medium">Supabase test (art)</p>
      {data && data.length > 0 ? (
        data.map((art) => (
          <div key={art.id} className="mt-2">
            <h2>{art.name}</h2>
            <p>{art.description}</p>
            <p>{art.price}kr</p>
            <p>{art.year} år</p>
          </div>
        ))
      ) : (
        <p className="mt-2 text-xs opacity-70">No rows found in art.</p>
      )}
    </div>
  )
}

export default function Page() {
  return (
    <div className="flex items-center justify-center p-6">
      <div className="flex flex-col gap-4 text-sm">
        <h1 className="text-2xl font-bold">E. Jalakas</h1>
        <p className="text-sm">
          Spontant och lekfullt skapar Elisabet med collage, akvarell, oljefärg,
          tryck och teckningar
        </p>

        <Suspense
          fallback={<div className="rounded border p-3">Loading...</div>}
        >
          <SupabaseArtSection />
        </Suspense>
        <ThemeSwitcher />
      </div>
    </div>
  )
}

import { NextResponse } from "next/server"

import { requireAdmin } from "@/lib/admin-auth"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()
  const auth = await requireAdmin(supabase)
  if (!auth.ok) return auth.response

  const { data, error } = await supabase
    .from("contact_message")
    .select("id, name, email, phone, art_id, message, created_at")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json(
      {
        error:
          error.message === 'relation "public.contact_message" does not exist'
            ? "Inbox-tabellen saknas i databasen (contact_message)."
            : error.message,
      },
      { status: 400 }
    )
  }

  const messagesData = data ?? []
  const artIds = Array.from(
    new Set(
      messagesData
        .map((entry) => entry.art_id)
        .filter(
          (value): value is string | number =>
            typeof value === "string" || typeof value === "number"
        )
    )
  )

  let artNameById = new Map<string, string>()
  if (artIds.length > 0) {
    const { data: artRows } = await supabase
      .from("art")
      .select("id, name")
      .in("id", artIds)

    artNameById = new Map(
      (artRows ?? [])
        .filter(
          (row) =>
            (typeof row.id === "string" || typeof row.id === "number") &&
            typeof row.name === "string"
        )
        .map((row) => [String(row.id), row.name])
    )
  }

  const messages = messagesData.map((entry) => ({
    id: entry.id,
    name: entry.name,
    email: entry.email,
    phone: entry.phone,
    art_id: entry.art_id,
    message: entry.message,
    created_at: entry.created_at,
    art_name:
      typeof entry.art_id === "string" || typeof entry.art_id === "number"
        ? (artNameById.get(String(entry.art_id)) ?? null)
        : null,
  }))

  return NextResponse.json({ messages })
}

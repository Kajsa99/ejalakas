import { NextResponse } from "next/server"

import { requireAdmin } from "@/lib/admin-auth"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()
  const auth = await requireAdmin(supabase)
  if (!auth.ok) return auth.response

  const { data, error } = await supabase
    .from("contact_message")
    .select("id, name, email, phone, message, created_at")
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

  return NextResponse.json({ messages: data ?? [] })
}

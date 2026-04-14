import { NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  const supabase = await createClient()
  const formData = await request.formData()

  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const phone = String(formData.get("phone") ?? "").trim()
  const message = String(formData.get("message") ?? "").trim()
  const rawArtId = String(formData.get("art_id") ?? "").trim()
  const artId =
    rawArtId !== "" && Number.isFinite(Number(rawArtId))
      ? Number(rawArtId)
      : null

  if (!name || !email ) {
    return NextResponse.json({ error: "Fyll i alla obligatoriska fält" }, { status: 400 })
  }

  const { error } = await supabase.from("contact_message").insert({
    name,
    email,
    phone,
    message,
    art_id: artId,
  })

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

  return NextResponse.json({ message: "Tack! Ditt meddelande är skickat." }, { status: 201 })
}

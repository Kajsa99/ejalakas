import { NextResponse } from "next/server"

import { requireAdmin } from "@/lib/admin-auth"
import { removeAdminImage, uploadAdminImage } from "@/lib/admin-image-upload"
import { createClient } from "@/lib/supabase/server"

// Get all exhibition items
export async function GET() {
  const supabase = await createClient()
  const auth = await requireAdmin(supabase)
  if (!auth.ok) return auth.response

  const { data, error } = await supabase
    .from("exhibition")
    .select("id, name, description, date")
    .order("date", { ascending: false })
    .order("name", { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  const items = (data ?? []).map((item) => ({
    id: String(item.id),
    label: `${item.name} (${item.date})`,
    values: {
      name: item.name,
      description: item.description,
      date: item.date,
    },
  }))

  return NextResponse.json({ items })
}

// Create a new exhibition item
export async function POST(request: Request) {
  const supabase = await createClient()
  const auth = await requireAdmin(supabase)
  if (!auth.ok) return auth.response

  const formData = await request.formData()
  const name = String(formData.get("name") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const date = String(formData.get("date") ?? "").trim()
  const file = formData.get("image")

  if (!name || !description || !date) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  if (Number.isNaN(new Date(date).getTime())) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 })
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing image file" }, { status: 400 })
  }

  let uploadedFilePath: string | null = null

  try {
    const upload = await uploadAdminImage(supabase, "exhibition", file)
    uploadedFilePath = upload.filePath

    const { data, error } = await supabase
      .from("exhibition")
      .insert({
        name,
        description,
        date,
        image: upload.publicUrl,
      })
      .select("id")
      .single()

    if (error) {
      await removeAdminImage(supabase, uploadedFilePath)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: "Exhibition created", id: data.id }, { status: 201 })
  } catch (error) {
    await removeAdminImage(supabase, uploadedFilePath)
    const message = error instanceof Error ? error.message : "Upload failed"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

// Update an existing exhibition item
export async function PUT(request: Request) {
  const supabase = await createClient()
  const auth = await requireAdmin(supabase)
  if (!auth.ok) return auth.response

  const formData = await request.formData()
  const id = String(formData.get("id") ?? "").trim()
  const name = String(formData.get("name") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const date = String(formData.get("date") ?? "").trim()
  const file = formData.get("image")

  if (!id || !name || !description || !date) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  if (Number.isNaN(new Date(date).getTime())) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 })
  }

  let imageUrl: string | undefined
  if (file instanceof File && file.size > 0) {
    try {
      const upload = await uploadAdminImage(supabase, "exhibition", file)
      imageUrl = upload.publicUrl
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed"
      return NextResponse.json({ error: message }, { status: 400 })
    }
  }

  const updates: Record<string, unknown> = {
    name,
    description,
    date,
  }

  if (imageUrl) {
    updates.image = imageUrl
  }

  const { data, error } = await supabase
    .from("exhibition")
    .update(updates)
    .eq("id", id)
    .select("id, name, description, date")
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({
    message: "Exhibition updated",
    item: {
      id: String(data.id),
      label: `${data.name} (${data.date})`,
      values: {
        name: data.name,
        description: data.description,
        date: data.date,
      },
    },
  })
}

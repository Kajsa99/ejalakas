import { NextResponse } from "next/server"

import { requireAdmin } from "@/lib/admin-auth"
import { removeAdminImage, uploadAdminImage } from "@/lib/admin-image-upload"
import { createClient } from "@/lib/supabase/server"

// Get all art items
export async function GET() {
  const supabase = await createClient()
  const auth = await requireAdmin(supabase)
  if (!auth.ok) return auth.response

  const { data, error } = await supabase
    .from("art")
    .select("id, name, description, year, price, status")
    .order("year", { ascending: false })
    .order("name", { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  const items = (data ?? []).map((item) => ({
    id: String(item.id),
    label: `${item.name} (${item.year})`,
    values: {
      name: item.name,
      description: item.description,
      year: item.year,
      price: item.price,
      status: item.status,
    },
  }))

  return NextResponse.json({ items })
}

// Create a new art item
export async function POST(request: Request) {
  const supabase = await createClient()
  const auth = await requireAdmin(supabase)
  if (!auth.ok) return auth.response

  const formData = await request.formData()
  const name = String(formData.get("name") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const year = Number(formData.get("year"))
  const price = Number(formData.get("price"))
  const status = String(formData.get("status") ?? "").trim() === "true"
  const file = formData.get("image")

  if (!name || !description || !Number.isFinite(year) || !Number.isFinite(price)) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing image file" }, { status: 400 })
  }

  let uploadedFilePath: string | null = null

  try {
    const upload = await uploadAdminImage(supabase, "art", file)
    uploadedFilePath = upload.filePath

    const { data, error } = await supabase
      .from("art")
      .insert({
        name,
        description,
        year,
        price,
        status,
        image: upload.publicUrl,
      })
      .select("id")
      .single()

    if (error) {
      await removeAdminImage(supabase, uploadedFilePath)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: "Art created", id: data.id }, { status: 201 })
  } catch (error) {
    await removeAdminImage(supabase, uploadedFilePath)
    const message = error instanceof Error ? error.message : "Upload failed"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

// Update an existing art item
export async function PUT(request: Request) {
  const supabase = await createClient()
  const auth = await requireAdmin(supabase)
  if (!auth.ok) return auth.response

  const formData = await request.formData()
  const id = String(formData.get("id") ?? "").trim()
  const name = String(formData.get("name") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const year = Number(formData.get("year"))
  const price = Number(formData.get("price"))
  const status = String(formData.get("status") ?? "").trim() === "true"
  const file = formData.get("image")

  if (!id || !name || !description || !Number.isFinite(year) || !Number.isFinite(price)) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  let imageUrl: string | undefined

  if (file instanceof File && file.size > 0) {
    try {
      const upload = await uploadAdminImage(supabase, "art", file)
      imageUrl = upload.publicUrl
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed"
      return NextResponse.json({ error: message }, { status: 400 })
    }
  }

  const updates: Record<string, unknown> = {
    name,
    description,
    year,
    price,
    status,
  }

  if (imageUrl) {
    updates.image = imageUrl
  }

  const { data, error } = await supabase
    .from("art")
    .update(updates)
    .eq("id", id)
    .select("id, name, description, year, price, status")
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({
    message: "Art updated",
    item: {
      id: String(data.id),
      label: `${data.name} (${data.year})`,
      values: {
        name: data.name,
        description: data.description,
        year: data.year,
        price: data.price,
        status: data.status,
      },
    },
  })
}

// Delete an existing art item
export async function DELETE(request: Request) {
  const supabase = await createClient()
  const auth = await requireAdmin(supabase)
  if (!auth.ok) return auth.response

  const formData = await request.formData()
  const id = String(formData.get("id") ?? "").trim()

  if (!id) {
    return NextResponse.json({ error: "Missing item id" }, { status: 400 })
  }

  const { data: existing, error: existingError } = await supabase
    .from("art")
    .select("image")
    .eq("id", id)
    .single()

  if (existingError) {
    return NextResponse.json({ error: existingError.message }, { status: 400 })
  }

  const { error } = await supabase.from("art").delete().eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  const imageUrl = String(existing?.image ?? "")
  const splitToken = "/storage/v1/object/public/images/"
  const storagePath = imageUrl.includes(splitToken)
    ? imageUrl.split(splitToken)[1]
    : null
  await removeAdminImage(supabase, storagePath)

  return NextResponse.json({ message: "Art deleted" })
}

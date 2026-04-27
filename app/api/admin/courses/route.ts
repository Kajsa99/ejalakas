import { NextResponse } from "next/server"

import { requireAdmin } from "@/lib/admin-auth"
import { removeAdminImage, uploadAdminImage } from "@/lib/admin-image-upload"
import { createClient } from "@/lib/supabase/server"

// Get all course items
export async function GET() {
  const supabase = await createClient()
  const auth = await requireAdmin(supabase)
  if (!auth.ok) return auth.response

  const { data, error } = await supabase
    .from("course")
    .select("id, name, description, date, location, price, people")
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
      location: item.location,
      price: item.price,
      people: item.people,
    },
  }))

  return NextResponse.json({ items })
}

// Create a new course item
export async function POST(request: Request) {
  const supabase = await createClient()
  const auth = await requireAdmin(supabase)
  if (!auth.ok) return auth.response

  const formData = await request.formData()
  const name = String(formData.get("name") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const date = String(formData.get("date") ?? "").trim()
  const location = String(formData.get("location") ?? "").trim()
  const price = Number(formData.get("price"))
  const people = Number(formData.get("people"))
  const file = formData.get("image")

  if (
    !name ||
    !description ||
    !date ||
    !location ||
    !Number.isFinite(price) ||
    !Number.isFinite(people)
  ) {
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
    const upload = await uploadAdminImage(supabase, "course", file)
    uploadedFilePath = upload.filePath

    const { data, error } = await supabase
      .from("course")
      .insert({
        name,
        description,
        date,
        location,
        price,
        people,
        image: upload.publicUrl,
      })
      .select("id")
      .single()

    if (error) {
      await removeAdminImage(supabase, uploadedFilePath)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: "Course created", id: data.id }, { status: 201 })
  } catch (error) {
    await removeAdminImage(supabase, uploadedFilePath)
    const message = error instanceof Error ? error.message : "Upload failed"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

// Update an existing course item
export async function PUT(request: Request) {
  const supabase = await createClient()
  const auth = await requireAdmin(supabase)
  if (!auth.ok) return auth.response

  const formData = await request.formData()
  const id = String(formData.get("id") ?? "").trim()
  const name = String(formData.get("name") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const date = String(formData.get("date") ?? "").trim()
  const location = String(formData.get("location") ?? "").trim()
  const price = Number(formData.get("price"))
  const people = Number(formData.get("people"))
  const file = formData.get("image")

  if (
    !id ||
    !name ||
    !description ||
    !date ||
    !location ||
    !Number.isFinite(price) ||
    !Number.isFinite(people)
  ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  if (Number.isNaN(new Date(date).getTime())) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 })
  }

  let imageUrl: string | undefined
  if (file instanceof File && file.size > 0) {
    try {
      const upload = await uploadAdminImage(supabase, "course", file)
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
    location,
    price,
    people,
  }

  if (imageUrl) {
    updates.image = imageUrl
  }

  const { data, error } = await supabase
    .from("course")
    .update(updates)
    .eq("id", id)
    .select("id, name, description, date, location, price, people")
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({
    message: "Course updated",
    item: {
      id: String(data.id),
      label: `${data.name} (${data.date})`,
      values: {
        name: data.name,
        description: data.description,
        date: data.date,
        location: data.location,
        price: data.price,
        people: data.people,
      },
    },
  })
}

// Delete an existing course item
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
    .from("course")
    .select("image")
    .eq("id", id)
    .single()

  if (existingError) {
    return NextResponse.json({ error: existingError.message }, { status: 400 })
  }

  const { error } = await supabase.from("course").delete().eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  const imageUrl = String(existing?.image ?? "")
  const splitToken = "/storage/v1/object/public/images/"
  const storagePath = imageUrl.includes(splitToken)
    ? imageUrl.split(splitToken)[1]
    : null
  await removeAdminImage(supabase, storagePath)

  return NextResponse.json({ message: "Course deleted" })
}

import { NextResponse } from "next/server"
import sharp from "sharp"

import { createClient } from "@/lib/supabase/server"
import { STORAGE_BASE_PATH, STORAGE_BUCKET } from "@/lib/storage-image-paths"

const MAX_EDGE = 1600
const WEBP_QUALITY = 82

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get("file")
  const artId = String(formData.get("artId") ?? "").trim()

  if (!artId) {
    return NextResponse.json({ error: "Missing artId" }, { status: 400 })
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 })
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 })
  }

  const inputBuffer = Buffer.from(await file.arrayBuffer())
  const optimizedBuffer = await sharp(inputBuffer)
    .rotate()
    .resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer()

  const filePath = `${STORAGE_BASE_PATH}/${artId}-${Date.now()}.webp`

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, optimizedBuffer, {
      contentType: "image/webp",
      upsert: false,
    })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 400 })
  }

  const { error: updateError } = await supabase
    .from("art")
    .update({ image: filePath })
    .eq("id", artId)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 })
  }

  const { data: publicData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath)

  return NextResponse.json({
    message: "Image uploaded",
    imagePath: filePath,
    imageUrl: publicData.publicUrl,
  })
}


import type { SupabaseClient } from "@supabase/supabase-js"
import sharp from "sharp"

import { STORAGE_BASE_PATH, STORAGE_BUCKET } from "@/lib/storage-image-paths"

const MAX_EDGE = 1600
const WEBP_QUALITY = 82
const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024

export async function uploadAdminImage(
  supabase: SupabaseClient,
  tableName: string,
  file: File
) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed")
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("Image file is too large (max 8MB)")
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

  const filePath = `${STORAGE_BASE_PATH}/${tableName}-${Date.now()}.webp`
  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, optimizedBuffer, {
      contentType: "image/webp",
      upsert: false,
    })

  if (uploadError) {
    throw new Error(uploadError.message)
  }

  const { data: publicData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath)

  return {
    filePath,
    publicUrl: publicData.publicUrl,
  }
}

export async function removeAdminImage(
  supabase: SupabaseClient,
  filePath: string | null | undefined
) {
  if (!filePath) return
  await supabase.storage.from(STORAGE_BUCKET).remove([filePath])
}

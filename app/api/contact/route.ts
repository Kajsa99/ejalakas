import { NextResponse } from "next/server"

import { formatCourseSignUpMessage } from "@/lib/course-sign-up-message"
import { createClient } from "@/lib/supabase/server"
export async function POST(request: Request) {
  const supabase = await createClient()
  const formData = await request.formData()

  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const phone = String(formData.get("phone") ?? "").trim()
  const message = String(formData.get("message") ?? "").trim()
  const rawCourseAmount = String(formData.get("course_amount") ?? "").trim()
  const rawArtId = String(formData.get("art_id") ?? "").trim()
  const rawCourseId = String(formData.get("course_id") ?? "").trim()
  const artId =
    rawArtId !== "" && Number.isFinite(Number(rawArtId))
      ? Number(rawArtId)
      : null
  const courseId =
    rawCourseId !== "" && Number.isFinite(Number(rawCourseId))
      ? Number(rawCourseId)
      : null
  const participantCount =
    courseId !== null &&
    rawCourseAmount !== "" &&
    Number.isFinite(Number(rawCourseAmount))
      ? Math.max(1, Math.floor(Number(rawCourseAmount)))
      : 1

  if (!name || !email ) {
    return NextResponse.json({ error: "Fyll i alla obligatoriska fält" }, { status: 400 })
  }

  const storedMessage =
    courseId !== null
      ? formatCourseSignUpMessage(participantCount, message)
      : message

  const { error } = await supabase.from("contact_message").insert({
    name,
    email,
    phone,
    message: storedMessage,
    art_id: artId,
    course_id: courseId,
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

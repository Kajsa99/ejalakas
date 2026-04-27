import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"

import { createClient } from "@/lib/supabase/server"

import CourseSignUpForm from "./course-sign-up-form"

export default async function CourseSignUpPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const courseId = Number(id)

  if (!Number.isFinite(courseId)) {
    notFound()
  }

  const supabase = await createClient()

  const { data: course } = await supabase
    .from("course")
    .select("id, name, date, location")
    .eq("id", courseId)
    .single()

  if (!course) {
    notFound()
  }

  return (
    <div className="my-10 min-h-screen p-6">
      <div className="mx-auto flex w-full max-w-2xl flex-col">
        <Link
          href="/courses"
          className="text-md mb-6 flex w-fit flex-row items-center gap-2 text-primary hover:underline"
        >
          <ArrowLeftIcon className="size-4" />
          Tillbaka
        </Link>
        <div className="flex w-full flex-col items-center gap-6 p-6 dark:bg-zinc-950">
          <div className="mx-6 text-center">
            <h1 className="my-4 text-2xl font-bold">
              Kursanmälan: {course.name}
            </h1>
            <div className="my-6 space-y-1 text-sm">
              <p>
                <strong>Datum:</strong>{" "}
                {new Date(course.date).toLocaleDateString("sv-SE")}
              </p>
              <p>
                <strong>Plats:</strong> {course.location}
              </p>
            </div>
            <CourseSignUpForm courseId={course.id} />
          </div>
        </div>
      </div>
    </div>
  )
}

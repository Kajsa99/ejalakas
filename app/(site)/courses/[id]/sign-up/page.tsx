import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"

import { createClient } from "@/lib/supabase/server"

import { isUpcomingCourse } from "../../course-utils"
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

  if (!isUpcomingCourse(course.date)) {
    notFound()
  }

  return (
    <div className="site-page">
      <div className="mb-10">
        <Link
          href="/courses"
          className="eyebrow inline-flex w-fit items-center gap-2 text-foreground hover:underline"
        >
          <ArrowLeftIcon className="size-4" />
          Tillbaka
        </Link>
      </div>
      <div className="site-intro">
        <div className="max-w-3xl">
          <p className="eyebrow mb-4 text-foreground">E. Jalakas / Kurs</p>
          <h1 className="page-heading">Kursanmälan</h1>
          <p className="mt-5 font-heading text-3xl leading-tight md:text-4xl">
            {course.name}
          </p>
          <div className="site-intro-copy mt-6 space-y-1">
            <p>Datum: {new Date(course.date).toLocaleDateString("sv-SE")}</p>
            <p>Plats: {course.location}</p>
          </div>
        </div>
      </div>
      <div className="w-full max-w-3xl pt-12 pb-16">
        <CourseSignUpForm courseId={course.id} />
      </div>
    </div>
  )
}

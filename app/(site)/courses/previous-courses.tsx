"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import {
  CalendarIcon,
  HandCoinsIcon,
  MapPinIcon,
  UsersIcon,
} from "lucide-react"

import { createClient } from "@/lib/supabase/client"

import { Course, formatCourseDate, isPreviousCourse } from "./course-utils"

export default function PreviousCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from("course")
        .select("*")
        .order("date", { ascending: false })

      setCourses(data ?? [])
      setIsLoading(false)
    }

    fetchCourses()
  }, [])

  const previousCourses = useMemo(() => {
    return courses.filter((course) => isPreviousCourse(course.date))
  }, [courses])

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl text-sm text-muted-foreground">
        Laddar tidigare kurser...
      </div>
    )
  }

  if (previousCourses.length === 0) {
    return null
  }

  return (
    <section className="mt-20 flex w-full flex-col gap-8">
      <div className="border-b border-foreground/20 pb-4">
        <p className="eyebrow text-foreground">Arkiv</p>
        <h2 className="mt-3 font-heading text-4xl leading-none md:text-5xl">
          Tidigare kurser
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {previousCourses.map((course) => (
          <article key={course.id} className="group flex h-full flex-col pb-8">
            <div className="relative overflow-hidden">
              <Image
                src={course.image}
                alt={course.name}
                width={600}
                height={400}
                className="aspect-4/3 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col gap-4 pt-5">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-heading text-3xl leading-tight">
                  {course.name}
                </h3>
                <span className="eyebrow shrink-0 text-muted-foreground">
                  Arkiv
                </span>
              </div>
              <p className="merriweather-long-text text-base leading-relaxed text-muted-foreground">
                {course.description}
              </p>
              <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="size-4" />
                  {formatCourseDate(course.date)}
                </div>
                <div className="flex items-center gap-2">
                  <MapPinIcon className="size-4" />
                  {course.location}
                </div>
                <div className="flex items-center gap-2">
                  <HandCoinsIcon className="size-4" />
                  {course.price}kr per person
                </div>
                <div className="flex items-center gap-2">
                  <UsersIcon className="size-4" />
                  {course.people} platser totalt
                </div>
              </div>
              <span className="mt-auto pt-4 text-base text-muted-foreground">
                Anmälan stängd
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

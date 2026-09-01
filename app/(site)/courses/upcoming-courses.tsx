"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  CalendarIcon,
  HandCoinsIcon,
  MapPinIcon,
  UsersIcon,
} from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Course, formatCourseDate, isUpcomingCourse } from "./course-utils"

export default function UpcomingCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from("course")
        .select("*")
        .order("date", { ascending: true })

      setCourses(data ?? [])
      setIsLoading(false)
    }

    fetchCourses()
  }, [])

  const upcomingCourses = useMemo(() => {
    return courses.filter((course) => isUpcomingCourse(course.date))
  }, [courses])

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl text-sm text-muted-foreground">
        Laddar kommande kurser...
      </div>
    )
  }

  if (upcomingCourses.length === 0) {
    return null
  }

  return (
    <section className="my-10 flex w-full max-w-6xl flex-col gap-6">
      <h2 className="text-xl font-medium">Kommande kurser</h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {upcomingCourses.map((course) => (
          <Card
            key={course.id}
            className="flex h-full max-w-md flex-col dark:border-zinc-800 dark:bg-zinc-900"
          >
            <CardHeader className="p-4">
              <CardTitle className="text-center text-xl font-medium">
                {course.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-2">
              <Image
                src={course.image}
                alt={course.name}
                width={300}
                height={200}
                className="max-h-80 w-full object-cover"
              />
              <div className="merriweather-long-text text-md m-4 leading-loose">
                {course.description}
              </div>
              <div className="text-md flex items-center gap-2">
                <CalendarIcon className="size-4" />
                {formatCourseDate(course.date)}
              </div>
              <div className="text-md flex items-center gap-2">
                <MapPinIcon className="size-4" />
                {course.location}
              </div>
              <div className="text-md flex items-center gap-2">
                <HandCoinsIcon className="size-4" />
                {course.price}kr per person
              </div>
              <div className="text-md flex items-center gap-2">
                <UsersIcon className="size-4" />
                {course.people} platser totalt
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/courses/${course.id}/sign-up`} className="w-full">
                <Button className="w-full">Anmäl dig</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}

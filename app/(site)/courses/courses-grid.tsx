"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import Image from "next/image"
import {
  MapPinIcon,
  CalendarIcon,
  HandCoinsIcon,
  UsersIcon,
} from "lucide-react"

export default function CoursesGrid() {
  const [courses, setCourses] = useState<Course[]>([])
  const supabase = createClient()
  interface Course {
    id: number
    name: string
    description: string
    date: string
    location: string
    price: number
    image: string
    people: number
  }
  const [isLoading, setIsLoading] = useState(true)

  //   format to dd month - yyyy svenska månader
  const formatCourseDate = (dateString: string) => {
    const date = new Date(dateString)

    if (Number.isNaN(date.getTime())) {
      return dateString
    }

    const year = date.getFullYear()
    const month = date.toLocaleString("sv-SE", { month: "long" })
    const day = date.getDate()

    return `${day} ${month} - ${year}`
  }

  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await supabase.from("course").select("*")
      setCourses(data ?? [])
      setIsLoading(false)
    }
    fetchCourses()
  }, [])
  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Laddar kurser...</div>
  }
  if (courses.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">Inga kurser hittades</div>
    )
  }

  return (
    <div className="mt-6 flex flex-col gap-8">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-8">
        {courses.map((course) => (
          <div key={course.id}>
            <Card className="max-w-md">
              <CardHeader className="p-4">
                <CardTitle className="text-center text-xl font-medium">
                  {course.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                  <Image
                    src={course.image}
                    alt={course.name}
                    width={300}
                    height={200}
                    className="max-h-80 w-full object-cover"
                  />
                </div>
                <div className="text-md">{course.description}</div>
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
                <Button className="w-full">Anmäl dig</Button>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}

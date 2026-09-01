export interface Course {
  id: number
  name: string
  description: string
  date: string
  location: string
  price: number
  image: string
  people: number
}

export const getStartOfToday = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

export const formatCourseDate = (dateString: string) => {
  const date = new Date(dateString)

  if (Number.isNaN(date.getTime())) {
    return dateString
  }

  const year = date.getFullYear()
  const month = date.toLocaleString("sv-SE", { month: "long" })
  const day = date.getDate()

  return `${day} ${month} - ${year}`
}

export const isUpcomingCourse = (dateString: string) => {
  const courseDate = new Date(dateString)

  if (Number.isNaN(courseDate.getTime())) {
    return false
  }

  return courseDate >= getStartOfToday()
}

export const isPreviousCourse = (dateString: string) =>
  !isUpcomingCourse(dateString)

import UpcomingCourses from "./upcoming-courses"
import PreviousCourses from "./previous-courses"
import Newsletter from "@/components/newletter"

export default function Page() {
  return (
    <div className="site-page">
      <div className="site-intro">
        <div className="max-w-2xl">
          <p className="eyebrow mb-4 text-foreground">E. Jalakas / Lärande</p>
          <h1 className="page-heading">Kurser</h1>
          <p className="site-intro-copy mt-6">
            Jag håller i kurser där jag lär ut olika tekniker och metoder som
            jag själv använder. Lärandet är en del av processen som konstnär och
            dela med sig är lika viktigt som att skapa. Bli en del av skapandet
            och våga göra nya saker.
          </p>
        </div>
      </div>
      <div className="w-full pt-12">
        <UpcomingCourses />
        <PreviousCourses />
      </div>
      <Newsletter />
    </div>
  )
}

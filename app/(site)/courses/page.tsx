import CoursesGrid from "./courses-grid"
import Newsletter from "@/components/newletter"

export default function Page() {
  return (
    <div className="mt-20 flex flex-col items-center p-6">
      <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col items-center gap-4 text-sm">
        <h1 className="text-2xl font-medium">Kurser</h1>
        <p className="text-md max-w-2xl text-muted-foreground">
          Jag håller i kurser där jag lär ut olika tekniker och metoder som jag
          själv använder. Lärandet är en del av processen som konstnär och dela
          med sig är lika viktigt som att skapa. Bli en del av skapandet och
          våga göra nya saker.
        </p>
      </div>
      <CoursesGrid />
      <Newsletter />
    </div>
  )
}

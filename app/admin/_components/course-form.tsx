import { ContentForm } from "./content-form"
import { EditContentForm } from "./edit-content-form"

const courseFields = [
  { name: "name", label: "Namn", type: "text", required: true },
  {
    name: "description",
    label: "Beskrivning",
    type: "textarea",
    required: true,
  },
  { name: "date", label: "Datum", type: "date", required: true },
  { name: "location", label: "Plats", type: "text", required: true },
  {
    name: "price",
    label: "Pris",
    type: "number",
    required: true,
    min: 0,
    step: "50",
  },
  {
    name: "people",
    label: "Antal platser",
    type: "number",
    required: true,
    min: 1,
    step: "1",
  },
  {
    name: "image",
    label: "Bild",
    type: "file",
    required: true,
    accept: "image/*",
  },
] as const

export function CourseForm() {
  return (
    <ContentForm
      endpoint="/api/admin/courses"
      title="Lägg till kurs"
      description="Skapa en ny kurs med platsinformation och bild."
      fields={[...courseFields]}
    />
  )
}

export function EditCourseForm() {
  return (
    <EditContentForm
      endpoint="/api/admin/courses"
      title="Redigera kurs"
      description="Välj en kurs i listan och uppdatera innehållet."
      fields={[
        ...courseFields.map((field) =>
          field.name === "image"
            ? { ...field, label: "Ny bild (valfri)", required: false }
            : field
        ),
      ]}
    />
  )
}

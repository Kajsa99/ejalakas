import { ContentForm } from "./content-form"
import { EditContentForm } from "./edit-content-form"

const yearOptions = Array.from(
  { length: new Date().getFullYear() - 1980 },
  (_, index) => {
    const year = new Date().getFullYear() - index
    return { label: year.toString(), value: year.toString() }
  }
)

const artFields = [
  { name: "name", label: "Namn", type: "text", required: true },
  {
    name: "description",
    label: "Beskrivning",
    type: "textarea",
    required: true,
  },
  {
    name: "year",
    label: "År",
    type: "select",
    required: true,
    options: yearOptions,
  },
  {
    name: "price",
    label: "Pris",
    type: "number",
    required: true,
    min: 0,
    step: "1000",
  },
  { name: "status", label: "Såld", type: "checkbox" },
  {
    name: "image",
    label: "Bild",
    type: "file",
    required: true,
    accept: "image/*",
  },
] as const

export function ArtForm() {
  return (
    <ContentForm
      endpoint="/api/admin/art"
      title="Lägg till tavla"
      description="Fyll i formuläret för att lägga till en ny tavla."
      fields={[...artFields]}
    />
  )
}

export function EditArtForm() {
  return (
    <EditContentForm
      endpoint="/api/admin/art"
      title="Redigera tavla"
      description="Välj en tavla i listan och uppdatera innehållet."
      fields={[
        ...artFields.map((field) =>
          field.name === "image"
            ? { ...field, label: "Ny bild (valfri)", required: false }
            : field
        ),
      ]}
    />
  )
}

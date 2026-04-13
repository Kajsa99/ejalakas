import { ContentForm } from "./content-form"
import { EditContentForm } from "./edit-content-form"

const exhibitionFields = [
  { name: "name", label: "Namn", type: "text", required: true },
  {
    name: "description",
    label: "Beskrivning",
    type: "textarea",
    required: true,
  },
  { name: "date", label: "Datum", type: "date", required: true },
  {
    name: "image",
    label: "Bild",
    type: "file",
    required: true,
    accept: "image/*",
  },
] as const

export function ExhibitionForm() {
  return (
    <ContentForm
      endpoint="/api/admin/exhibitions"
      title="Lägg till utställning"
      description="Skapa en ny utställning med datum och bild."
      fields={[...exhibitionFields]}
    />
  )
}

export function EditExhibitionForm() {
  return (
    <EditContentForm
      endpoint="/api/admin/exhibitions"
      title="Redigera utställning"
      description="Välj en utställning i listan och uppdatera innehållet."
      fields={[
        ...exhibitionFields.map((field) =>
          field.name === "image"
            ? { ...field, label: "Ny bild (valfri)", required: false }
            : field
        ),
      ]}
    />
  )
}

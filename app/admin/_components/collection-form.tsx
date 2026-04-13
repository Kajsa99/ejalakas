import { ContentForm } from "./content-form"
import { EditContentForm } from "./edit-content-form"

const yearOptions = Array.from(
  { length: new Date().getFullYear() - 1980 },
  (_, index) => {
    const year = new Date().getFullYear() - index
    return { label: year.toString(), value: year.toString() }
  }
)

const collectionFields = [
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
    name: "image",
    label: "Bild",
    type: "file",
    required: true,
    accept: "image/*",
  },
] as const

export function CollectionForm() {

  return (
    <ContentForm
      endpoint="/api/admin/collections"
      title="Lägg till kollektion"
      description="Skapa en ny kollektion med bild."
      fields={[...collectionFields]}
    />
  )
}

export function EditCollectionForm() {
  return (
    <EditContentForm
      endpoint="/api/admin/collections"
      title="Redigera kollektion"
      description="Välj en kollektion i listan och uppdatera innehållet."
      fields={[
        ...collectionFields.map((field) =>
          field.name === "image"
            ? { ...field, label: "Ny bild (valfri)", required: false }
            : field
        ),
      ]}
    />
  )
}

"use client"

import { useEffect, useMemo, useState } from "react"

import { ContentForm } from "./content-form"
import { EditContentForm } from "./edit-content-form"

const yearOptions = Array.from(
  { length: new Date().getFullYear() - 1980 },
  (_, index) => {
    const year = new Date().getFullYear() - index
    return { label: year.toString(), value: year.toString() }
  }
)

const baseArtFields = [
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
    name: "collection_id",
    label: "Kollektion",
    type: "select",
    options: [{ label: "(Ingen kollektion)", value: "" }],
  },
  {
    name: "price",
    label: "Pris",
    type: "number",
    required: false,
    min: 0,
    step: "100",
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

interface CollectionItem {
  id: string
  label: string
}

function useCollectionOptions() {
  const [collectionOptions, setCollectionOptions] = useState<
    { label: string; value: string }[]
  >([{ label: "(Ingen kollektion)", value: "" }])

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const response = await fetch("/api/admin/collections")
        if (!response.ok) return

        const payload = (await response.json()) as { items?: CollectionItem[] }
        const options = (payload.items ?? []).map((item) => ({
          label: item.label,
          value: item.id,
        }))

        setCollectionOptions([
          { label: "(Ingen kollektion)", value: "" },
          ...options,
        ])
      } catch {
        setCollectionOptions([{ label: "(Ingen kollektion)", value: "" }])
      }
    }

    void loadCollections()
  }, [])

  return collectionOptions
}

export function ArtForm() {
  const collectionOptions = useCollectionOptions()
  const fields = useMemo(
    () =>
      baseArtFields.map((field) =>
        field.name === "collection_id"
          ? { ...field, options: collectionOptions }
          : field
      ),
    [collectionOptions]
  )

  return (
    <ContentForm
      endpoint="/api/admin/art"
      title="Lägg till tavla"
      description="Fyll i formuläret för att lägga till en ny tavla."
      fields={fields}
    />
  )
}

export function EditArtForm() {
  const collectionOptions = useCollectionOptions()
  const fields = useMemo(
    () =>
      baseArtFields.map((field) =>
        field.name === "collection_id"
          ? { ...field, options: collectionOptions }
          : field
      ),
    [collectionOptions]
  )

  return (
    <EditContentForm
      endpoint="/api/admin/art"
      title="Redigera tavla"
      description="Välj en tavla i listan och uppdatera innehållet."
      fields={[
        ...fields.map((field) =>
          field.name === "image"
            ? { ...field, label: "Ny bild (valfri)", required: false }
            : field
        ),
      ]}
    />
  )
}

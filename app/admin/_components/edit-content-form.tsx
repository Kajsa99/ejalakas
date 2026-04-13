"use client"

import { useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { FormField } from "./content-form"

interface EditableItem {
  id: string
  label: string
  values: Record<string, string | number | boolean | null>
}

interface EditContentFormProps {
  endpoint: string
  title: string
  description: string
  fields: FormField[]
}

export function EditContentForm({
  endpoint,
  title,
  description,
  fields,
}: EditContentFormProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [items, setItems] = useState<EditableItem[]>([])
  const [selectedId, setSelectedId] = useState("")
  const [formValues, setFormValues] = useState<
    Record<string, string | boolean>
  >({})

  useEffect(() => {
    const loadItems = async () => {
      setIsLoading(true)
      setError(null)
      setSuccess(null)
      try {
        const response = await fetch(endpoint)
        const payload = (await response.json()) as {
          error?: string
          items?: EditableItem[]
        }

        if (!response.ok) {
          throw new Error(payload.error ?? "Could not load items")
        }

        const loadedItems = payload.items ?? []
        setItems(loadedItems)
        setSelectedId(loadedItems[0]?.id ?? "")
      } catch (loadError) {
        const message =
          loadError instanceof Error
            ? loadError.message
            : "Could not load items"
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }

    loadItems()
  }, [endpoint])

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedId) ?? null,
    [items, selectedId]
  )

  const normalizeValue = (value: unknown, fieldType: FormField["type"]) => {
    if (value == null) return ""
    if (fieldType === "date" && typeof value === "string") {
      return value.slice(0, 10)
    }
    return String(value)
  }

  useEffect(() => {
    if (!selectedItem) {
      setFormValues({})
      return
    }

    const nextValues: Record<string, string | boolean> = {}
    for (const field of fields) {
      const rawValue = selectedItem.values[field.name]
      if (field.type === "checkbox") {
        nextValues[field.name] = Boolean(rawValue)
      } else {
        nextValues[field.name] = normalizeValue(rawValue, field.type)
      }
    }
    setFormValues(nextValues)
  }, [fields, selectedItem])

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedItem) return

    const form = event.currentTarget
    const formData = new FormData()
    formData.append("id", selectedItem.id)

    for (const field of fields) {
      if (field.type === "file") {
        const fileInput = form.elements.namedItem(field.name)
        if (fileInput instanceof HTMLInputElement && fileInput.files?.[0]) {
          formData.append(field.name, fileInput.files[0])
        }
        continue
      }

      const value = formValues[field.name]
      if (field.type === "checkbox") {
        formData.append(field.name, value ? "true" : "false")
        continue
      }

      formData.append(field.name, typeof value === "string" ? value : "")
    }

    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        body: formData,
      })

      const payload = (await response.json()) as {
        error?: string
        message?: string
        item?: EditableItem
      }

      if (!response.ok) {
        throw new Error(payload.error ?? "Could not save changes")
      }

      const updatedItem = payload.item
      if (updatedItem) {
        setItems((current) =>
          current.map((item) =>
            item.id === updatedItem.id ? updatedItem : item
          )
        )
      }
      setSuccess(payload.message ?? "Updated")
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Could not save changes"
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="p-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mb-4 text-sm text-muted-foreground">{description}</p>

      <div className="space-y-2">
        <Label htmlFor="selected-item">Tillgängliga objekt</Label>
        <select
          id="selected-item"
          value={selectedId}
          disabled={isLoading || items.length === 0}
          onChange={(event) => setSelectedId(event.target.value)}
          className="h-7 w-full overflow-y-auto rounded-md border border-input bg-input/20 px-2 outline-none"
        >
          {items.length === 0 && (
            <option value="">Inga objekt tillgängliga</option>
          )}
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {selectedItem ? (
        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          {fields.map((field) => {
            if (field.type === "textarea") {
              return (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    required={field.required}
                    value={String(formValues[field.name] ?? "")}
                    onChange={(event) =>
                      setFormValues((current) => ({
                        ...current,
                        [field.name]: event.target.value,
                      }))
                    }
                    className="h-24 resize-y"
                  />
                </div>
              )
            }

            if (field.type === "checkbox") {
              return (
                <div key={field.name} className="flex items-center gap-2">
                  <input
                    id={field.name}
                    name={field.name}
                    type="checkbox"
                    value="true"
                    checked={Boolean(formValues[field.name])}
                    onChange={(event) =>
                      setFormValues((current) => ({
                        ...current,
                        [field.name]: event.target.checked,
                      }))
                    }
                  />
                  <Label htmlFor={field.name}>{field.label}</Label>
                </div>
              )
            }

            if (field.type === "select") {
              return (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  <select
                    id={field.name}
                    name={field.name}
                    required={field.required}
                    value={String(formValues[field.name] ?? "")}
                    onChange={(event) =>
                      setFormValues((current) => ({
                        ...current,
                        [field.name]: event.target.value,
                      }))
                    }
                    className="h-7 w-full overflow-y-auto rounded-md border border-input bg-input/20 px-2 outline-none"
                  >
                    {(field.options ?? []).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )
            }

            return (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>{field.label}</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  required={field.required}
                  min={field.min}
                  step={field.step}
                  accept={field.accept}
                  value={String(formValues[field.name] ?? "")}
                  onChange={(event) =>
                    setFormValues((current) => ({
                      ...current,
                      [field.name]: event.target.value,
                    }))
                  }
                />
              </div>
            )
          })}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sparar..." : "Spara ändringar"}
          </Button>
        </form>
      ) : null}

      {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
      {success ? (
        <p className="mt-2 text-sm text-green-700">{success}</p>
      ) : null}
    </section>
  )
}

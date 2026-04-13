"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type FieldType =
  | "text"
  | "number"
  | "date"
  | "textarea"
  | "checkbox"
  | "file"
  | "select"

interface SelectOption {
  label: string
  value: string
}

export interface FormField {
  name: string
  label: string
  type: FieldType
  required?: boolean
  min?: number
  step?: string
  accept?: string
  options?: SelectOption[]
}

interface ContentFormProps {
  endpoint: string
  title: string
  description: string
  fields: FormField[]
}

export function ContentForm({
  endpoint,
  title,
  description,
  fields,
}: ContentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      })

      const payload = (await response.json()) as {
        error?: string
        message?: string
      }
      if (!response.ok) {
        throw new Error(payload.error ?? "Could not save content")
      }

      form.reset()
      setSuccess(payload.message ?? "Saved")
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Could not save content"
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="p-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mb-4 text-sm text-muted-foreground">{description}</p>
      <form onSubmit={onSubmit} className="space-y-4">
        {fields.map((field) => {
          if (field.type === "textarea") {
            return (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>{field.label}</Label>
                <Textarea
                  id={field.name}
                  name={field.name}
                  required={field.required}
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
                  defaultValue=""
                  className="h-7 w-full overflow-y-auto rounded-md border border-input bg-input/20 px-2 text-sm outline-none"
                >
                  <option value="" disabled>
                    Välj {field.label.toLowerCase()}
                  </option>
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
              />
            </div>
          )
        })}

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {success ? <p className="text-sm text-green-700">{success}</p> : null}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sparar..." : "Spara"}
        </Button>
      </form>
    </section>
  )
}

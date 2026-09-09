"use client"

import { useState } from "react"

import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface CourseSignUpFormProps {
  courseId: number
}

export default function CourseSignUpForm({ courseId }: CourseSignUpFormProps) {
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
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      })

      const payload = (await response.json()) as {
        error?: string
        message?: string
      }

      if (!response.ok) {
        throw new Error(payload.error ?? "Kunde inte skicka anmälan")
      }

      form.reset()
      setSuccess(
        payload.message ??
          "Tack! Din anmälan är skickad. Vi återkommer så snart som möjligt."
      )
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Kunde inte skicka anmälan"
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-2xl pt-8">
      <p className="eyebrow mb-6 text-foreground">
        Skicka in din anmälan via formuläret nedan. Vi återkommer så snart som
        möjligt.
      </p>
      <form onSubmit={onSubmit} className="grid gap-6 md:grid-cols-2">
        <Input type="hidden" name="course_id" value={courseId} />
        <div className="grid gap-2">
          <Label htmlFor="name">Namn *</Label>
          <Input id="name" name="name" type="text" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Telefon</Label>
          <Input id="phone" name="phone" type="tel" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="course_amount">Antal deltagare</Label>
          <Input
            id="course_amount"
            name="course_amount"
            type="number"
            min={1}
            max={10}
            defaultValue={1}
          />
        </div>
        <div className="grid gap-2 md:col-span-2">
          <Label htmlFor="message">Övrigt meddelande</Label>
          <Textarea
            id="message"
            name="message"
            rows={5}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground"
            placeholder="Skriv gärna om du har frågor"
          />
        </div>
        {error ? (
          <p className="text-sm text-destructive md:col-span-2">{error}</p>
        ) : null}
        {success ? (
          <p className="text-sm text-green-700 md:col-span-2 dark:text-green-400">
            {success}
          </p>
        ) : null}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="md:col-span-2 md:w-fit"
        >
          {isSubmitting ? "Skickar..." : "Skicka anmälan"}
        </Button>
      </form>
    </div>
  )
}

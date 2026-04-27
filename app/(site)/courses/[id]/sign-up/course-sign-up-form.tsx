"use client"

import { useState } from "react"

import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { CardHeader, CardTitle } from "@/components/ui/card"

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
    const userMessage = String(formData.get("message") ?? "").trim()
    const rawAmount = String(formData.get("course_amount") ?? "1").trim()
    const participantAmount =
      rawAmount !== "" && Number.isFinite(Number(rawAmount))
        ? Math.max(1, Number(rawAmount))
        : 1

    formData.set(
      "message",
      `Kursanmälan\nAntal deltagare: ${participantAmount}\n\nMeddelande från deltagare:\n${userMessage || "-"}`
    )

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
    <div className="w-full text-center">
      <Card className="rounded-lg border bg-amber-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <CardHeader>
          <CardTitle>Anmäl dig till kursen via formuläret</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <Input type="hidden" name="course_id" value={courseId} />
            <div className="grid gap-2">
              <Label htmlFor="name">Namn *</Label>
              <Input id="name" name="name" type="text" required />
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
            <div className="grid gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input id="phone" name="phone" type="tel" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Övrigt meddelande</Label>
              <Textarea
                id="message"
                name="message"
                rows={5}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground"
                placeholder="Skriv gärna om du har frågor eller särskilda önskemål."
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            {success ? (
              <p className="text-sm text-green-700 dark:text-green-400">
                {success}
              </p>
            ) : null}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="p-4 text-lg"
            >
              {isSubmitting ? "Skickar..." : "Skicka anmälan"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState } from "react"

import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ContactForm() {
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
        throw new Error(payload.error ?? "Kunde inte skicka meddelandet")
      }

      form.reset()
      setSuccess(payload.message ?? "Meddelandet är skickat")
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Kunde inte skicka meddelandet"
      setError(message)
      // } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-2xl pt-8">
      <p className="eyebrow mb-6 text-foreground">
        Du kan även ta kontakt via formuläret
      </p>
      <form onSubmit={onSubmit} className="grid gap-6 md:grid-cols-2">
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
        <div className="grid gap-2 md:col-span-2">
          <Label htmlFor="message">Meddelande</Label>
          <Textarea
            id="message"
            name="message"
            required
            rows={5}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground"
          />
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {success ? <p className="text-sm text-green-700">{success}</p> : null}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="md:col-span-2 md:w-fit"
        >
          {isSubmitting ? "Skickar..." : "Skicka"}
        </Button>
      </form>
    </div>
  )
}

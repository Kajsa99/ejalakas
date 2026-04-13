"use client"

import { useState } from "react"

import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

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
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-4 text-center">
      <Card className="bg-amber-50 p-4">
        <CardHeader>
          <CardTitle className="mt-4 text-lg font-medium">
            Du kan även kontakta mig via formuläret
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="mx-auto flex max-w-sm flex-col gap-4 p-4">
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
            </div>
            <Input id="phone" name="phone" type="tel" />
            <div className="grid gap-2">
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Skickar..." : "Skicka"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

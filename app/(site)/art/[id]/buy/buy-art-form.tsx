"use client"

import { useState } from "react"

import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { CardHeader, CardTitle } from "@/components/ui/card"

export default function BuyArtForm({ artworkId }: { artworkId: number }) {
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
        throw new Error(payload.error ?? "Kunde inte skicka förfrågan")
      }

      form.reset()
      setSuccess(payload.message ?? "Förfrågan är skickat")
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Kunde inte skicka förfrågan"
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full text-center">
      <Card className="rounded-lg p-4 dark:bg-zinc-900">
        <CardHeader>
          <CardTitle>Eller fyll i formuläret nedan</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <Input type="hidden" name="art_id" value={artworkId} />
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
                rows={5}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground"
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
              {isSubmitting ? "Skickar..." : "Skicka förfrågan"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

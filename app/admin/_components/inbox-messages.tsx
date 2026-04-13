"use client"

import { useEffect, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface InboxMessage {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  created_at: string
}

export function InboxMessages() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<InboxMessage[]>([])

  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/admin/inbox")
        const payload = (await response.json()) as {
          error?: string
          messages?: InboxMessage[]
        }

        if (!response.ok) {
          throw new Error(payload.error ?? "Kunde inte hämta inbox")
        }

        setMessages(payload.messages ?? [])
      } catch (loadError) {
        const message =
          loadError instanceof Error
            ? loadError.message
            : "Kunde inte hämta inbox"
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }

    loadMessages()
  }, [])

  return (
    <section className="space-y-4 bg-amber-50 p-4">
      <div>
        <h2 className="text-lg font-semibold">Inbox</h2>
        <p className="text-sm text-muted-foreground">
          Meddelanden från kontaktformuläret.
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Laddar...</p>
      ) : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {!isLoading && !error && messages.length === 0 ? (
        <p className="text-sm text-muted-foreground">Inga meddelanden än.</p>
      ) : null}

      <div className="space-y-3">
        <ScrollArea className="h-[500px]">
          {messages.map((entry) => (
            <article
              key={entry.id}
              className="space-y-1 rounded-md border bg-background p-3"
            >
              <p className="text-sm font-medium">{entry.name}</p>
              <p className="text-xs text-muted-foreground">{entry.email}</p>
              {entry.phone ? (
                <p className="text-xs text-muted-foreground">
                  Telefon: {entry.phone}
                </p>
              ) : null}
              <p className="text-sm whitespace-pre-wrap">{entry.message}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(entry.created_at).toLocaleString("sv-SE")}
              </p>
            </article>
          ))}
        </ScrollArea>
      </div>
    </section>
  )
}

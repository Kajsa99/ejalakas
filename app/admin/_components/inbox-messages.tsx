"use client"

import { useEffect, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageFiltersBar, type MessageFilters } from "./message-filters"
import { Badge } from "@/components/ui/badge"

interface InboxMessage {
  id: string
  name: string
  email: string
  phone: string | null
  art_id: string | null
  art_name: string | null
  course_id: string | null
  course_name: string | null
  course_amount: number | null
  message: string
  created_at: string
}

export function InboxMessages() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<InboxMessage[]>([])
  const [filters, setFilters] = useState<MessageFilters>({
    sortBy: "newest",
    onlyWithArtId: false,
  })

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

  const displayedMessages = messages
    .filter((message) => {
      if (filters.onlyWithArtId && !message.art_id) return false
      return true
    })
    .sort((a, b) => {
      if (filters.sortBy === "name") {
        return a.name.localeCompare(b.name, "sv")
      }
      if (filters.sortBy === "oldest") {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

  return (
    <section className="space-y-4 p-4">
      <div>
        <h2 className="text-lg font-semibold">Inbox</h2>
        <p className="text-sm text-muted-foreground">Meddelanden</p>
      </div>
      <div className="flex justify-end">
        <MessageFiltersBar onChange={setFilters} />
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
          {displayedMessages.map((entry) => (
            <article
              key={entry.id}
              className="mb-2 flex flex-col gap-2 rounded-md border bg-white p-3"
            >
              <div className="flex flex-row items-center gap-2">
                <p className="text-sm font-medium">{entry.name}</p>
                <p className="text-sm text-muted-foreground">{entry.email}</p>
                {entry.phone ? (
                  <p className="text-sm text-muted-foreground">{entry.phone}</p>
                ) : null}
                {entry.course_amount ? (
                  <p className="text-sm text-muted-foreground">
                    Antal deltagare: {entry.course_amount}
                  </p>
                ) : null}
                {entry.art_id ? (
                  <Badge
                    variant="secondary"
                    className="text-md border-red-200 bg-red-100 text-red-800"
                  >
                    Art id: {entry.art_id}, &quot;{entry.art_name}&quot;
                  </Badge>
                ) : null}
                {entry.course_id ? (
                  <Badge
                    variant="secondary"
                    className="text-md border-yellow-200 bg-yellow-100 text-yellow-800"
                  >
                    Kursanmälan: {entry.course_id}, &quot;{entry.course_name}
                    &quot;
                  </Badge>
                ) : null}
              </div>
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

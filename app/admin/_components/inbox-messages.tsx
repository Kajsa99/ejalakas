"use client"

import { useEffect, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageFiltersBar, type MessageFilters } from "./message-filters"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

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
  const [searchQuery, setSearchQuery] = useState("")
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

  const normalizedSearchQuery = searchQuery.trim().toLocaleLowerCase("sv")

  const displayedMessages = messages
    .filter((message) => {
      if (filters.onlyWithArtId && !message.art_id) return false

      if (!normalizedSearchQuery) return true

      const searchableValues = [
        message.name,
        message.email,
        message.phone,
        message.art_id,
        message.art_name,
        message.course_id,
        message.course_name,
        message.course_amount,
        message.message,
      ]
        .filter(
          (value) => value !== null && value !== undefined && value !== ""
        )
        .map((value) => String(value).toLocaleLowerCase("sv"))

      return searchableValues.some((value) =>
        value.includes(normalizedSearchQuery)
      )
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
    <section className="flex h-screen max-h-screen min-h-0 flex-col gap-4 overflow-hidden p-4">
      <div className="z-10 space-y-4 bg-white pb-2">
        <div>
          <h2 className="text-lg font-semibold">Inbox</h2>
          <p className="text-sm text-muted-foreground">Meddelanden</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Sök i meddelanden..."
            className="w-full sm:max-w-sm"
            aria-label="Sök meddelanden"
          />
          <MessageFiltersBar onChange={setFilters} />
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Laddar...</p>
      ) : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {!isLoading && !error && messages.length === 0 ? (
        <p className="text-sm text-muted-foreground">Inga meddelanden än.</p>
      ) : null}
      {!isLoading &&
      !error &&
      messages.length > 0 &&
      displayedMessages.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Inga meddelanden matchar din sökning.
        </p>
      ) : null}

      <div className="min-h-0 flex-1">
        <ScrollArea className="h-full">
          {displayedMessages.map((entry) => (
            <article
              key={entry.id}
              className="mb-2 flex flex-col gap-2 rounded-md border bg-white p-3"
            >
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

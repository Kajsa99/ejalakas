"use client"

import { useEffect, useMemo, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageFiltersBar, type MessageFilters } from "./message-filters"
import {
  InboxMessageCard,
  type InboxMessage,
} from "./inbox-message-card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type MessageCategory = "köpförfrågan" | "kursanmälan" | "frågor"

const MESSAGE_CATEGORIES: { id: MessageCategory; label: string }[] = [
  { id: "köpförfrågan", label: "Köpförfrågan" },
  { id: "kursanmälan", label: "Kursanmälan" },
  { id: "frågor", label: "Frågor" },
]

function getMessageCategory(message: InboxMessage): MessageCategory {
  if (message.art_id) return "köpförfrågan"
  if (message.course_id) return "kursanmälan"
  return "frågor"
}

export function InboxMessages() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<InboxMessage[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState<MessageCategory>("köpförfrågan")
  const [filters, setFilters] = useState<MessageFilters>({
    sortBy: "newest",
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

  const searchFilteredMessages = useMemo(
    () =>
      messages.filter((message) => {
        if (!normalizedSearchQuery) return true

        const searchableValues = [
          message.name,
          message.email,
          message.phone,
          message.art_id,
          message.art_name,
          message.course_id,
          message.course_name,
          message.message,
        ]
          .filter(
            (value) => value !== null && value !== undefined && value !== ""
          )
          .map((value) => String(value).toLocaleLowerCase("sv"))

        return searchableValues.some((value) =>
          value.includes(normalizedSearchQuery)
        )
      }),
    [messages, normalizedSearchQuery]
  )

  const categoryCounts = useMemo(() => {
    const counts: Record<MessageCategory, number> = {
      köpförfrågan: 0,
      kursanmälan: 0,
      frågor: 0,
    }

    for (const message of searchFilteredMessages) {
      counts[getMessageCategory(message)] += 1
    }

    return counts
  }, [searchFilteredMessages])

  const displayedMessages = searchFilteredMessages
    .filter((message) => getMessageCategory(message) === category)

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
        <Tabs
          value={category}
          onValueChange={(value) => {
            if (value) setCategory(value as MessageCategory)
          }}
        >
          <TabsList className="h-auto w-full flex-wrap justify-start gap-1 p-1">
            {MESSAGE_CATEGORIES.map((entry) => (
              <TabsTrigger
                key={entry.id}
                value={entry.id}
                className="px-3 py-1.5 text-sm"
              >
                {entry.label}
                <span className="text-muted-foreground">
                  ({categoryCounts[entry.id]})
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
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
          {searchFilteredMessages.length === 0
            ? "Inga meddelanden matchar din sökning."
            : `Inga meddelanden i kategorin ${
                MESSAGE_CATEGORIES.find((entry) => entry.id === category)
                  ?.label ?? category
              }.`}
        </p>
      ) : null}

      <div className="min-h-0 flex-1">
        <ScrollArea className="h-full pr-3">
          <div className="space-y-4 pb-4">
            {displayedMessages.map((message) => (
              <InboxMessageCard key={message.id} message={message} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </section>
  )
}

"use client"

import { useState } from "react"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface MessageFilters {
  sortBy: "newest" | "oldest" | "name"
}

interface MessageFiltersBarProps {
  onChange: (filters: MessageFilters) => void
}

export function MessageFiltersBar({ onChange }: MessageFiltersBarProps) {
  const [filters, setFilters] = useState<MessageFilters>({
    sortBy: "newest",
  })

  const updateFilters = (next: Partial<MessageFilters>) => {
    const updated = { ...filters, ...next }
    setFilters(updated)
    onChange(updated)
  }

  return (
    <div className="w-full p-3">
      <div className="flex flex-row items-center justify-end gap-4">
        <Label className="flex min-w-40 flex-col items-start gap-2 text-sm">
          <Select
            value={filters.sortBy}
            onValueChange={(value) =>
              updateFilters({ sortBy: value ?? "newest" })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Välj sortering" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Nyast först</SelectItem>
              <SelectItem value="oldest">Äldst först</SelectItem>
              <SelectItem value="name">Namn (A-Ö)</SelectItem>
            </SelectContent>
          </Select>
        </Label>
      </div>
    </div>
  )
}

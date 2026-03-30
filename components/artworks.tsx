"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface Artwork {
  id: number
  name: string
  image: string
  description: string
  price: number
  status: string
  year: number
}

interface AllArtworksProps {
  artworks: Artwork[]
}

export default function Artworks() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  useEffect(() => {
    const fetchArtworks = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("art").select("*")
      setArtworks(data ?? [])
    }
    fetchArtworks()
  }, [])
  return artworks.length > 0 ? (
    <AllArtworks artworks={artworks} />
  ) : (
    <div>No artworks found</div>
  )
}

function AllArtworks({ artworks }: AllArtworksProps) {
  return (
    <div className="grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 md:justify-items-start lg:grid-cols-4">
      {artworks.map((art) => (
        <Card key={art.id} className="h-[460px] w-[320px]">
          <CardContent className="flex h-full flex-col p-4">
            <CardHeader className="flex h-full flex-col p-0">
              <div className="relative">
                <Image
                  src={art.image}
                  alt={art.name}
                  width={400}
                  height={400}
                  className="h-[240px] object-cover"
                />
                <Badge
                  variant="default"
                  className="text-md absolute right-2 bottom-2 z-10"
                >
                  {art.status}
                </Badge>
              </div>
              <CardTitle>{art.name}</CardTitle>
              <CardDescription>{art.description}</CardDescription>
              <CardDescription>{art.year}</CardDescription>
              <CardDescription>{art.price}kr</CardDescription>
              <CardFooter className="mt-auto px-0">
                <Button variant="outline">
                  <Link href={`/art/${art.id}`}>Se detaljer</Link>
                </Button>
              </CardFooter>
            </CardHeader>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

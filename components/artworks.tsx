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
import { ForSaleBadge } from "@/components/for-sale-badge"

interface Artwork {
  id: number
  name: string
  image: string
  description: string
  price: number
  status: boolean
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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {artworks.map((art) => (
        <Card key={art.id} className="mt-6 w-full max-w-md bg-amber-50">
          <CardContent className="flex flex-col p-4">
            <CardHeader className="flex flex-col">
              <div className="relative">
                <Image
                  src={art.image}
                  alt={art.name}
                  width={400}
                  height={400}
                  className="h-[240px] object-cover"
                />
                <div className="absolute right-2 bottom-2 z-10">
                  <ForSaleBadge sold={art.status} />
                </div>
              </div>
              <div className="flex w-full flex-row items-center justify-between">
                <CardTitle className="text-lg">{art.name}</CardTitle>
                <CardDescription className="text-md">
                  {art.year}
                </CardDescription>
              </div>
              <CardFooter className="flex w-full justify-end">
                <Button variant="outline" size="lg">
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

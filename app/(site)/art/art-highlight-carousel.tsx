"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ForSaleBadge } from "@/components/for-sale-badge"
import { Badge } from "@/components/ui/badge"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

type HighlightArtwork = {
  id: number
  name: string | null
  image: string | null
  description: string | null
  price: number | string | null
  status: boolean | null
  year: number | string | null
}

interface ArtHighlightCarouselProps {
  artworks: HighlightArtwork[]
}

export default function ArtHighlightCarousel({
  artworks,
}: ArtHighlightCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (!api) return

    const updateActiveIndex = () => {
      setActiveIndex(api.selectedScrollSnap())
    }

    updateActiveIndex()
    api.on("select", updateActiveIndex)
    api.on("reInit", updateActiveIndex)

    const rotation = window.setInterval(() => {
      api.scrollNext()
    }, 9000)

    return () => {
      api.off("select", updateActiveIndex)
      api.off("reInit", updateActiveIndex)
      window.clearInterval(rotation)
    }
  }, [api])

  if (artworks.length === 0) {
    return (
      <div className="p-3 text-sm text-gray-500">Inga konstverk hittades</div>
    )
  }

  return (
    <Carousel
      setApi={setApi}
      opts={{ loop: artworks.length > 1, duration: 65 }}
      className="w-full max-w-5xl"
    >
      <CarouselContent>
        {artworks.map((artwork) => (
          <CarouselItem key={artwork.id}>
            <article className="overflow-hidden border border-foreground/10 bg-card shadow-[0_18px_45px_-30px_hsl(var(--foreground)/0.6)]">
              <div className="flex flex-col md:flex-row">
                <div className="relative w-full md:w-2/3">
                  <Link href={`/art/${artwork.id}`}>
                    <Image
                      src={artwork.image ?? ""}
                      alt={artwork.name ?? "Konstverk"}
                      width={800}
                      height={500}
                      className="block h-[360px] w-full object-cover transition-transform duration-650 md:h-[430px]"
                      unoptimized
                    />
                  </Link>
                  <div className="absolute right-2 bottom-2 z-10">
                    <ForSaleBadge sold={artwork.status ?? false} />
                  </div>
                </div>

                <div className="flex w-full flex-col p-6 md:w-1/3">
                  <div className="flex w-full flex-row items-start justify-between gap-4">
                    <h2 className="font-heading text-3xl leading-none">
                      {artwork.name ?? "Laddar..."}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {artwork.year ?? "Laddar..."}
                    </p>
                  </div>
                  <p className="merriweather-long-text mt-4 text-sm leading-relaxed text-muted-foreground">
                    {artwork.description ?? "Laddar..."}
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <Badge variant="outline" className="text-sm">
                      {artwork.price ?? "Laddar..."}kr
                    </Badge>
                  </div>
                  <Link
                    href={`/art/${artwork.id}`}
                    className="mt-auto pt-8 text-sm underline-offset-4 hover:underline"
                  >
                    Se detaljer
                  </Link>
                </div>
              </div>
            </article>
          </CarouselItem>
        ))}
      </CarouselContent>
      {artworks.length > 1 && (
        <>
          <CarouselPrevious
            className="left-2 md:-left-12"
            aria-label="Föregående konstverk"
          />
          <CarouselNext
            className="right-2 md:-right-12"
            aria-label="Nästa konstverk"
          />
          <div className="mt-4 flex justify-center gap-2">
            {artworks.map((artwork, index) => (
              <button
                key={artwork.id}
                type="button"
                aria-label={`Visa konstverk ${index + 1}`}
                aria-current={activeIndex === index}
                onClick={() => api?.scrollTo(index)}
                className="h-1.5 w-8 bg-foreground/20 transition-colors aria-[current=true]:bg-primary"
              />
            ))}
          </div>
        </>
      )}
    </Carousel>
  )
}

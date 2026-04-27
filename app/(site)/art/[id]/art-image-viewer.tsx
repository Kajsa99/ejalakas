"use client"

import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { SearchIcon, XIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react"

type ArtImageViewerProps = {
  src: string
  alt: string
}

const MIN_ZOOM = 1
const MAX_ZOOM = 4
const ZOOM_STEP = 0.25

export function ArtImageViewer({ src, alt }: ArtImageViewerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [zoom, setZoom] = useState(1)

  const closeModal = useCallback(() => {
    setIsOpen(false)
    setZoom(1)
  }, [])

  const zoomIn = useCallback(() => {
    setZoom((prev) => Math.min(MAX_ZOOM, Number((prev + ZOOM_STEP).toFixed(2))))
  }, [])

  const zoomOut = useCallback(() => {
    setZoom((prev) => Math.max(MIN_ZOOM, Number((prev - ZOOM_STEP).toFixed(2))))
  }, [])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal()
      }
      if (event.key === "+") {
        zoomIn()
      }
      if (event.key === "-") {
        zoomOut()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [isOpen, closeModal, zoomIn, zoomOut])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen])

  return (
    <>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group block w-full cursor-zoom-in"
          aria-label="Öppna bild i full storlek"
        >
          <Image
            src={src}
            alt={alt}
            width={900}
            height={900}
            priority
            className="block h-auto max-h-[80vh] w-full object-contain"
            unoptimized
          />
          <span className="pointer-events-none absolute right-3 bottom-3 inline-flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
            <SearchIcon className="size-3" />
            Klicka för att förstora
          </span>
        </button>
      </div>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Förstorad konstbild"
          onClick={closeModal}
        >
          <div
            className="relative mt-16 flex h-[calc(100%-4rem)] max-h-[calc(100vh-4rem)] w-full max-w-5xl flex-col gap-2 sm:mt-20 sm:h-[calc(100%-5rem)] sm:max-h-[calc(100vh-5rem)] sm:gap-3"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={zoomOut}
                disabled={zoom <= MIN_ZOOM}
                aria-label="Zooma ut"
              >
                <ZoomOutIcon />
              </Button>
              <span className="min-w-12 text-center text-sm text-white sm:min-w-14">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={zoomIn}
                disabled={zoom >= MAX_ZOOM}
                aria-label="Zooma in"
              >
                <ZoomInIcon />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={closeModal}
                aria-label="Stäng"
              >
                <XIcon />
              </Button>
            </div>

            <div
              className="flex min-h-0 flex-1 items-center justify-center overflow-auto rounded-md"
              onWheel={(event) => {
                event.preventDefault()
                if (event.deltaY < 0) zoomIn()
                if (event.deltaY > 0) zoomOut()
              }}
            >
              <div className="flex min-h-0 w-full items-center justify-center">
                <Image
                  src={src}
                  alt={alt}
                  width={2000}
                  height={2000}
                  className="h-auto max-h-[70vh] w-auto max-w-[85vw] origin-center object-contain transition-transform duration-150"
                  style={{ transform: `scale(${zoom})` }}
                  unoptimized
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

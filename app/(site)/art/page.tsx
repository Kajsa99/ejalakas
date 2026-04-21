import Artworks from "@/app/(site)/art/artworks"
import Link from "next/link"
import ArtHighlight from "@/app/(site)/art/art-highlight"
import Newsletter from "@/components/newletter"

export default function Page() {
  return (
    <div className="my-20 flex flex-col p-6">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="outfit-uniquifier text-2xl font-medium">Konstverk</h1>
        <p className="merriweather-long-text mt-2 text-sm">
          Urval av konstverk från ateljén.
        </p>
        <Link
          href="/collections"
          className="text-sm text-primary hover:underline"
        >
          Se alla kollektioner
        </Link>
      </div>
      <div className="mt-10 flex flex-col items-center justify-center gap-2">
        <ArtHighlight />
      </div>
      <div className="mx-auto mt-10 w-full max-w-7xl">
        <Artworks />
      </div>
      <Newsletter />
    </div>
  )
}

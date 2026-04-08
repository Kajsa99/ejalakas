import Artworks from "@/components/artworks"
import Link from "next/link"
import ArtHighlight from "@/components/art-highlight"

export default function Page() {
  return (
    <div className="flex flex-col p-6">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-2xl font-medium">Konstverk</h1>
        <p className="mt-2 text-sm">
          Urval av konstverk från ateljén. Se även kollektioner och
          utställningar.
        </p>
        <Link
          href="/collections"
          className="text-sm text-primary hover:underline"
        >
          Kollektioner
        </Link>
      </div>
      <div className="mt-10 flex flex-col items-center justify-center gap-2">
        <ArtHighlight />
      </div>
      <div className="mx-auto mt-10 w-full max-w-7xl">
        <Artworks />
      </div>
    </div>
  )
}

import Artworks from "@/app/(site)/art/artworks"
import Link from "next/link"
import ArtHighlight from "@/app/(site)/art/art-highlight"
import Newsletter from "@/components/newletter"

export default function Page() {
  return (
    <div className="site-page">
      <div className="site-intro">
        <div>
          <p className="eyebrow mb-4 text-foreground">E. Jalakas / Galleri</p>
          <h1 className="page-heading">Konstverk</h1>
        </div>
        <p className="site-intro-copy">Urval av konstverk från ateljén.</p>
        <Link
          href="/collections"
          className="eyebrow text-foreground hover:underline md:col-start-2"
        >
          Se alla kollektioner
        </Link>
      </div>
      <div className="mt-12 flex flex-col items-center justify-center gap-2">
        <ArtHighlight />
      </div>
      <div className="mx-auto mt-6 w-full max-w-6xl">
        <Artworks />
      </div>
      <Newsletter />
    </div>
  )
}

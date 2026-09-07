import CollectionGrid from "@/app/(site)/collections/collection-grid"
import Newsletter from "@/components/newletter"

export default function Page() {
  return (
    <div className="site-page">
      <div className="site-intro">
        <div>
          <p className="eyebrow mb-4 text-foreground">E. Jalakas / Samlingar</p>
          <h1 className="page-heading">Kollektioner</h1>
        </div>
        <p className="site-intro-copy">
          Här en alla samlade kollektioner från E. Jalakas, upptäck de som
          inspirerar dig. Jag målar i kollektioner då jag blir nyfiken och
          inspierad så att jag vill fånga det på flera olika sätt. Jag byter
          medium, färger och vinklar tills jag fångat det jag såg.
        </p>
      </div>
      <div className="w-full pt-12">
        <CollectionGrid />
      </div>
      <Newsletter />
    </div>
  )
}

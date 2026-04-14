import CollectionGrid from "@/app/(site)/collections/collection-grid"
import Newsletter from "@/components/newletter"

export default function Page() {
  return (
    <div className="my-20 flex flex-col items-center p-6">
      <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col items-center gap-4 text-sm">
        <h1 className="text-2xl font-medium">Kollektioner</h1>
        <p className="text-md max-w-2xl text-muted-foreground">
          Här en alla samlade kollektioner från E. Jalakas, upptäck de som
          inspirerar dig. Jag målar i kollektioner då jag blir nyfiken och
          inspierad så att jag vill fånga det på flera olika sätt. Jag byter
          medium, färger och vinklar tills jag fångat det jag såg.
        </p>
        <CollectionGrid />
      </div>
      <Newsletter />
    </div>
  )
}

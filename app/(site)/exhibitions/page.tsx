import ExhibitionsGrid from "@/app/(site)/exhibitions/exhibitions-grid"

export default function Page() {
  return (
    <div className="mt-20 flex flex-col items-center p-6">
      <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col items-center gap-4 text-sm">
        <h1 className="text-2xl font-medium">Utställningar</h1>
        <p className="text-md max-w-2xl text-muted-foreground">
          Kommande och avslutade utställningar.
        </p>
      </div>
      <ExhibitionsGrid />
    </div>
  )
}

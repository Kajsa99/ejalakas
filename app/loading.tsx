import ContentCardSkeleton from "@/components/content-card-skeleton"

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center gap-4 bg-amber-100 p-6 dark:bg-zinc-950">
      <div className="mt-20 flex flex-col items-center gap-4 text-sm">
        <div className="h-[420px] w-[300px] animate-pulse bg-amber-200/70 dark:bg-zinc-800" />
        <div className="-mt-10 h-12 w-52 animate-pulse bg-amber-200/70 dark:bg-zinc-800" />
        <div className="h-20 w-full max-w-lg animate-pulse bg-amber-200/70 dark:bg-zinc-800" />
      </div>

      <div className="mb-20 flex w-full flex-col items-center justify-center gap-10 p-10 md:flex-row">
        <ContentCardSkeleton labelWidthClass="w-24" />
        <ContentCardSkeleton labelWidthClass="w-36" />
        <ContentCardSkeleton labelWidthClass="w-32" />
      </div>

      <div className="mx-auto mt-16 mb-20 w-full max-w-lg">
        <div className="mx-auto my-8 h-8 w-80 animate-pulse bg-amber-200/70 dark:bg-zinc-800" />
        <div className="mx-auto flex max-w-sm flex-col items-center justify-center gap-4">
          <div className="h-10 w-full max-w-xs animate-pulse bg-amber-200/70 dark:bg-zinc-800" />
          <div className="h-10 w-32 animate-pulse bg-amber-200/70 dark:bg-zinc-800" />
        </div>
      </div>
    </div>
  )
}

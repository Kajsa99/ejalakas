type ContentCardSkeletonProps = {
  labelWidthClass?: string
}

export default function ContentCardSkeleton({
  labelWidthClass = "w-28",
}: ContentCardSkeletonProps) {
  return (
    <article className="mt-6 w-full max-w-md overflow-hidden bg-amber-50 dark:bg-zinc-900">
      <div className="h-[240px] w-full animate-pulse bg-amber-200/70 dark:bg-zinc-800" />
      <div className="p-4">
        <div
          className={`h-6 animate-pulse rounded bg-amber-200/70 dark:bg-zinc-800 ${labelWidthClass}`}
        />
      </div>
    </article>
  )
}

export function BookCardSkeleton() {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm animate-pulse">
      {/* Book cover placeholder */}
      <div className="aspect-[3/4] bg-gray-200" />

      {/* Book info */}
      <div className="flex flex-1 flex-col p-4">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-1" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />

        {/* Availability badge */}
        <div className="mt-3">
          <div className="h-6 bg-gray-200 rounded-full w-24" />
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-col gap-2">
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  )
}

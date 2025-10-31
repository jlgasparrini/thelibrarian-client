export function BorrowingCardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />

          {/* Dates */}
          <div className="space-y-1">
            <div className="h-4 bg-gray-200 rounded w-40" />
            <div className="h-4 bg-gray-200 rounded w-40" />
          </div>

          {/* Status */}
          <div className="mt-3 flex items-center gap-2">
            <div className="h-6 bg-gray-200 rounded-full w-20" />
            <div className="h-4 bg-gray-200 rounded w-32" />
          </div>
        </div>

        {/* Button */}
        <div className="h-10 w-24 bg-gray-200 rounded" />
      </div>
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-lg bg-white p-6 shadow animate-pulse">
      <div className="flex items-center">
        <div className="flex-shrink-0 rounded-md bg-gray-200 h-12 w-12" />
        <div className="ml-4 flex-1">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
          <div className="h-8 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  )
}

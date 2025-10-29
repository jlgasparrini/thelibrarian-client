import { useBorrowings } from '@/hooks/useBorrowings'
import { BorrowingCard } from '@/components/borrowings/BorrowingCard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { BookOpen } from 'lucide-react'

export function MyHistoryPage() {
  const { data, isLoading, isError, error } = useBorrowings()

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <p className="text-sm text-red-800">
          Error loading history: {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    )
  }

  const returnedBorrowings = data?.borrowings.filter((b) => b.returned_at) || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Borrowing History</h1>
        <p className="mt-1 text-sm text-gray-600">
          View all your past book borrowings
        </p>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : returnedBorrowings.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-12 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No borrowing history
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            You haven't returned any books yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {returnedBorrowings.map((borrowing) => (
            <BorrowingCard
              key={borrowing.id}
              borrowing={borrowing}
              showReturnButton={false}
            />
          ))}
        </div>
      )}
    </div>
  )
}

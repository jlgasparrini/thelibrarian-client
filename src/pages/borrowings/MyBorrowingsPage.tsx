import { useState } from 'react'
import { useBorrowings, useReturnBook } from '@/hooks/useBorrowings'
import { BorrowingCard } from '@/components/borrowings/BorrowingCard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { toast } from 'sonner'
import { BookOpen } from 'lucide-react'

type TabType = 'active' | 'all'

export function MyBorrowingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('active')
  const { data, isLoading, isError, error } = useBorrowings()
  const returnMutation = useReturnBook()

  const handleReturn = async (borrowingId: number) => {
    if (!confirm('Are you sure you want to return this book?')) {
      return
    }

    try {
      await returnMutation.mutateAsync(borrowingId)
      toast.success('Book returned successfully!')
    } catch {
      toast.error('Failed to return book. Please try again.')
    }
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <p className="text-sm text-red-800">
          Error loading borrowings: {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    )
  }

  const activeBorrowings = data?.borrowings.filter((b) => !b.returned_at) || []
  const allBorrowings = data?.borrowings || []
  const displayedBorrowings = activeTab === 'active' ? activeBorrowings : allBorrowings

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Borrowings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your borrowed books and view your borrowing history
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('active')}
            className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
              activeTab === 'active'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Active Borrowings
            {activeBorrowings.length > 0 && (
              <span className="ml-2 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                {activeBorrowings.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
              activeTab === 'all'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            All Borrowings
            {allBorrowings.length > 0 && (
              <span className="ml-2 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                {allBorrowings.length}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : displayedBorrowings.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-12 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {activeTab === 'active' ? 'No active borrowings' : 'No borrowings yet'}
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            {activeTab === 'active'
              ? 'You don\'t have any books currently borrowed.'
              : 'You haven\'t borrowed any books yet. Visit the books page to get started!'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedBorrowings.map((borrowing) => (
            <BorrowingCard
              key={borrowing.id}
              borrowing={borrowing}
              onReturn={handleReturn}
              showReturnButton={!borrowing.returned_at}
            />
          ))}
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { useBorrowings, useReturnBook } from '@/hooks/useBorrowings'
import { BorrowingCard } from '@/components/borrowings/BorrowingCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { BorrowingCardSkeleton } from '@/components/ui/BorrowingCardSkeleton'
import { toast } from 'sonner'
import { BookOpen } from 'lucide-react'
import { getErrorMessage } from '@/lib/utils'
import { Link } from 'react-router-dom'

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
    } catch (error) {
      toast.error(getErrorMessage(error))
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
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <BorrowingCardSkeleton key={i} />
          ))}
        </div>
      ) : displayedBorrowings.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={activeTab === 'active' ? 'No active borrowings' : 'No borrowings yet'}
          description={
            activeTab === 'active'
              ? "You don't have any books currently borrowed."
              : "You haven't borrowed any books yet. Visit the books page to get started!"
          }
          action={
            activeTab !== 'active' ? (
              <Link
                to="/books"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Browse Books
              </Link>
            ) : undefined
          }
        />
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

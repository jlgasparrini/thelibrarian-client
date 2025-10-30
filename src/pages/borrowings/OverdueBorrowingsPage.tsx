import { Link } from 'react-router-dom'
import { useBorrowings, useReturnBook } from '@/hooks/useBorrowings'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { toast } from 'sonner'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { formatDate, getDaysUntilDue } from '@/lib/utils'

export function OverdueBorrowingsPage() {
  const { data, isLoading, isError, error } = useBorrowings()
  const returnMutation = useReturnBook()

  const handleReturn = async (borrowingId: number) => {
    if (!confirm('Are you sure you want to mark this book as returned?')) {
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
          Error loading overdue borrowings: {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    )
  }

  // Filter and sort overdue borrowings
  const overdueBorrowings = (data?.borrowings || [])
    .filter(b => b['overdue?'] && !b.returned_at)
    .sort((a, b) => {
      // Sort by most overdue first (oldest due date)
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
    })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/borrowings"
          className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to All Borrowings
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Overdue Borrowings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Books that are past their due date and need to be returned
        </p>
      </div>

      {/* Stats */}
      <div className="rounded-lg bg-red-50 p-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="ml-2 text-sm font-medium text-red-800">
            {overdueBorrowings.length} {overdueBorrowings.length === 1 ? 'book is' : 'books are'} currently overdue
          </span>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : overdueBorrowings.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-12 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No overdue borrowings
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            All books are either returned or within their due date.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {overdueBorrowings.map((borrowing) => {
            const daysOverdue = Math.abs(getDaysUntilDue(borrowing.due_date))
            
            return (
              <div
                key={borrowing.id}
                className="rounded-lg border-2 border-red-300 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Book Info */}
                    <div className="mb-4">
                      <Link
                        to={`/books/${borrowing.book.id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                      >
                        {borrowing.book.title}
                      </Link>
                      <p className="mt-1 text-sm text-gray-600">{borrowing.book.author}</p>
                    </div>

                    {/* Member Info */}
                    <div className="mb-4 rounded-lg bg-gray-50 p-4">
                      <h4 className="text-sm font-medium text-gray-700">Member Information</h4>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">Email:</span> {borrowing.user.email}
                        </p>
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">Member ID:</span> #{borrowing.user.id}
                        </p>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Borrowed</dt>
                        <dd className="mt-1 text-sm text-gray-900">{formatDate(borrowing.borrowed_at)}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Due Date</dt>
                        <dd className="mt-1 text-sm text-gray-900">{formatDate(borrowing.due_date)}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Days Overdue</dt>
                        <dd className="mt-1">
                          <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-800">
                            {daysOverdue} {daysOverdue === 1 ? 'day' : 'days'}
                          </span>
                        </dd>
                      </div>
                    </div>
                  </div>

                  {/* Return Button */}
                  <div className="ml-6 flex-shrink-0">
                    <button
                      onClick={() => handleReturn(borrowing.id)}
                      disabled={returnMutation.isPending}
                      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {returnMutation.isPending ? 'Returning...' : 'Return Book'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

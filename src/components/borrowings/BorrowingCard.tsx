import { Link } from 'react-router-dom'
import { Calendar, AlertCircle, CheckCircle } from 'lucide-react'
import type { Borrowing } from '@/types'
import { formatDate, getDaysUntilDue, getStatusBadge } from '@/lib/utils'

interface BorrowingCardProps {
  borrowing: Borrowing
  onReturn?: (borrowingId: number) => void
  showReturnButton?: boolean
}

export function BorrowingCard({ borrowing, onReturn, showReturnButton = true }: BorrowingCardProps) {
  const isOverdue = borrowing['overdue?']
  const isReturned = !!borrowing.returned_at
  const daysUntilDue = getDaysUntilDue(borrowing.due_date)
  const statusBadge = getStatusBadge(borrowing)

  return (
    <div className={`rounded-lg border bg-white p-4 shadow-sm ${isOverdue && !isReturned ? 'border-red-300' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Book info */}
          <Link
            to={`/books/${borrowing.book.id}`}
            className="text-lg font-semibold text-gray-900 hover:text-blue-600"
          >
            {borrowing.book.title}
          </Link>
          <p className="mt-1 text-sm text-gray-600">{borrowing.book.author}</p>

          {/* Dates */}
          <div className="mt-3 space-y-1 text-sm">
            <div className="flex items-center text-gray-600">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Borrowed: {formatDate(borrowing.borrowed_at)}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Due: {formatDate(borrowing.due_date)}</span>
            </div>
            {borrowing.returned_at && (
              <div className="flex items-center text-gray-600">
                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                <span>Returned: {formatDate(borrowing.returned_at)}</span>
              </div>
            )}
          </div>

          {/* Status and days until due */}
          <div className="mt-3 flex items-center gap-2">
            <span className={statusBadge.className}>{statusBadge.text}</span>
            {!isReturned && (
              <>
                {isOverdue ? (
                  <span className="flex items-center text-sm text-red-600">
                    <AlertCircle className="mr-1 h-4 w-4" />
                    Overdue by {Math.abs(daysUntilDue)} days
                  </span>
                ) : daysUntilDue <= 3 ? (
                  <span className="flex items-center text-sm text-orange-600">
                    <AlertCircle className="mr-1 h-4 w-4" />
                    Due in {daysUntilDue} {daysUntilDue === 1 ? 'day' : 'days'}
                  </span>
                ) : (
                  <span className="text-sm text-gray-600">
                    {daysUntilDue} days remaining
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Return button */}
        {showReturnButton && !isReturned && onReturn && (
          <button
            onClick={() => onReturn(borrowing.id)}
            className="ml-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Return Book
          </button>
        )}
      </div>
    </div>
  )
}

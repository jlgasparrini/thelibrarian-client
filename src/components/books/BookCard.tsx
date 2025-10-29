import { Link } from 'react-router-dom'
import { BookOpen, Edit, Trash2 } from 'lucide-react'
import type { Book } from '@/types'
import { useAuthStore } from '@/stores/authStore'

interface BookCardProps {
  book: Book
  onBorrow?: (bookId: number) => void
  onEdit?: (bookId: number) => void
  onDelete?: (bookId: number) => void
}

export function BookCard({ book, onBorrow, onEdit, onDelete }: BookCardProps) {
  const { user } = useAuthStore()
  const isLibrarian = user?.role === 'librarian'
  const isMember = user?.role === 'member'
  const isAvailable = book.available_copies > 0

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Book cover placeholder */}
      <div className="aspect-[3/4] bg-gradient-to-br from-blue-100 to-blue-200 p-6">
        <div className="flex h-full items-center justify-center">
          <BookOpen className="h-16 w-16 text-blue-600" />
        </div>
      </div>

      {/* Book info */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {book.title}
        </h3>
        <p className="mt-1 text-sm text-gray-600">{book.author}</p>
        <p className="mt-1 text-xs text-gray-500">{book.genre}</p>

        {/* Availability badge */}
        <div className="mt-3">
          {isAvailable ? (
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
              {book.available_copies} / {book.total_copies} available
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
              Not available
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-col gap-2">
          <Link
            to={`/books/${book.id}`}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            View Details
          </Link>

          {isMember && isAvailable && onBorrow && (
            <button
              onClick={() => onBorrow(book.id)}
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Borrow Book
            </button>
          )}

          {isLibrarian && (
            <div className="flex gap-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(book.id)}
                  className="flex-1 inline-flex items-center justify-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(book.id)}
                  className="flex-1 inline-flex items-center justify-center gap-1 rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

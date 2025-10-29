import { useNavigate, useParams, Link } from 'react-router-dom'
import { useBook, useDeleteBook } from '@/hooks/useBooks'
import { useBorrowBook } from '@/hooks/useBorrowings'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useAuthStore } from '@/stores/authStore'
import { toast } from 'sonner'
import { ArrowLeft, Edit, Trash2, BookOpen } from 'lucide-react'
import { useState } from 'react'

export function BookDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { data, isLoading, isError } = useBook(Number(id))
  const deleteMutation = useDeleteBook()
  const borrowMutation = useBorrowBook()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const isLibrarian = user?.role === 'librarian'
  const isMember = user?.role === 'member'

  const handleDelete = async () => {
    if (!id) return

    try {
      await deleteMutation.mutateAsync(Number(id))
      toast.success('Book deleted successfully!')
      navigate('/books')
    } catch {
      toast.error('Failed to delete book')
    }
  }

  const handleBorrow = async () => {
    if (!id) return

    try {
      await borrowMutation.mutateAsync({ book_id: Number(id) })
      toast.success('Book borrowed successfully!')
    } catch {
      toast.error('Failed to borrow book')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (isError || !data?.book) {
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <p className="text-sm text-red-800">Failed to load book details</p>
      </div>
    )
  }

  const book = data.book
  const isAvailable = book.available_copies > 0

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/books"
          className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Books
        </Link>
      </div>

      {/* Book Details */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
              <p className="mt-2 text-xl text-gray-600">{book.author}</p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-blue-200">
                <BookOpen className="h-16 w-16 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Genre</dt>
              <dd className="mt-1 text-sm text-gray-900">{book.genre}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">ISBN</dt>
              <dd className="mt-1 text-sm text-gray-900">{book.isbn}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Total Copies</dt>
              <dd className="mt-1 text-sm text-gray-900">{book.total_copies}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Available Copies</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    isAvailable
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {book.available_copies} / {book.total_copies}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Times Borrowed</dt>
              <dd className="mt-1 text-sm text-gray-900">{book.borrowings_count}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Availability</dt>
              <dd className="mt-1">
                {isAvailable ? (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Available
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                    Not Available
                  </span>
                )}
              </dd>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            {isMember && isAvailable && (
              <button
                onClick={handleBorrow}
                disabled={borrowMutation.isPending}
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <BookOpen className="h-4 w-4" />
                {borrowMutation.isPending ? 'Borrowing...' : 'Borrow Book'}
              </button>
            )}

            {isLibrarian && (
              <>
                <Link
                  to={`/books/${id}/edit`}
                  className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Book
                </Link>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center gap-2 rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Book
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Delete Book
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete "{book.title}"? This action cannot be
                        undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleteMutation.isPending}
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

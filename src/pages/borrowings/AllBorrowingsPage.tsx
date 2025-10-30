import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useBorrowings, useReturnBook } from '@/hooks/useBorrowings'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Pagination } from '@/components/ui/Pagination'
import { toast } from 'sonner'
import { Search, X } from 'lucide-react'
import { formatDate, getStatusBadgeColor, getStatusText, getDaysUntilDue } from '@/lib/utils'

type StatusFilter = 'all' | 'active' | 'returned' | 'overdue'

export function AllBorrowingsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  
  const statusFilter = (searchParams.get('status') || 'all') as StatusFilter
  const page = Number(searchParams.get('page')) || 1
  const perPage = Number(searchParams.get('per_page')) || 25

  const { data, isLoading, isError, error } = useBorrowings()
  const returnMutation = useReturnBook()

  const handleStatusChange = (status: StatusFilter) => {
    const params = new URLSearchParams(searchParams)
    if (status === 'all') {
      params.delete('status')
    } else {
      params.set('status', status)
    }
    params.set('page', '1')
    setSearchParams(params)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    if (searchQuery) {
      params.set('search', searchQuery)
    } else {
      params.delete('search')
    }
    params.set('page', '1')
    setSearchParams(params)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    const params = new URLSearchParams(searchParams)
    params.delete('search')
    setSearchParams(params)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
    setSearchParams(params)
  }

  const handlePerPageChange = (newPerPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('per_page', String(newPerPage))
    params.set('page', '1')
    setSearchParams(params)
  }

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
          Error loading borrowings: {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    )
  }

  // Filter borrowings
  let filteredBorrowings = data?.borrowings || []
  
  // Apply status filter
  if (statusFilter === 'active') {
    filteredBorrowings = filteredBorrowings.filter(b => !b.returned_at)
  } else if (statusFilter === 'returned') {
    filteredBorrowings = filteredBorrowings.filter(b => b.returned_at)
  } else if (statusFilter === 'overdue') {
    filteredBorrowings = filteredBorrowings.filter(b => b['overdue?'] && !b.returned_at)
  }

  // Apply search filter
  const searchLower = searchQuery.toLowerCase()
  if (searchQuery) {
    filteredBorrowings = filteredBorrowings.filter(
      b =>
        b.user.email.toLowerCase().includes(searchLower) ||
        b.book.title.toLowerCase().includes(searchLower) ||
        b.book.author.toLowerCase().includes(searchLower)
    )
  }

  // Pagination
  const totalItems = filteredBorrowings.length
  const totalPages = Math.ceil(totalItems / perPage)
  const startIndex = (page - 1) * perPage
  const endIndex = startIndex + perPage
  const paginatedBorrowings = filteredBorrowings.slice(startIndex, endIndex)

  const statusCounts = {
    all: data?.borrowings.length || 0,
    active: data?.borrowings.filter(b => !b.returned_at).length || 0,
    returned: data?.borrowings.filter(b => b.returned_at).length || 0,
    overdue: data?.borrowings.filter(b => b['overdue?'] && !b.returned_at).length || 0,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Borrowings</h1>
        <p className="mt-1 text-sm text-gray-600">
          View and manage all library borrowings
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by member email, book title, or author..."
            className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Search
        </button>
      </form>

      {/* Status Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {(['all', 'active', 'overdue', 'returned'] as StatusFilter[]).map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                statusFilter === status
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className={`ml-2 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                statusFilter === status
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {statusCounts[status]}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : paginatedBorrowings.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-12 text-center">
          <h3 className="text-lg font-medium text-gray-900">No borrowings found</h3>
          <p className="mt-2 text-sm text-gray-600">
            {searchQuery
              ? 'Try adjusting your search query'
              : 'No borrowings match the selected filter'}
          </p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Book
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Borrowed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {paginatedBorrowings.map((borrowing) => {
                    const daysUntilDue = getDaysUntilDue(borrowing.due_date)
                    const isOverdue = borrowing['overdue?']
                    const isReturned = !!borrowing.returned_at

                    return (
                      <tr key={borrowing.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          {borrowing.user.email}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <Link
                            to={`/books/${borrowing.book.id}`}
                            className="font-medium text-gray-900 hover:text-blue-600"
                          >
                            {borrowing.book.title}
                          </Link>
                          <p className="text-gray-500">{borrowing.book.author}</p>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {formatDate(borrowing.borrowed_at)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          <div className="text-gray-900">{formatDate(borrowing.due_date)}</div>
                          {!isReturned && (
                            <div className={`text-xs ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
                              {isOverdue
                                ? `${Math.abs(daysUntilDue)} days overdue`
                                : `${daysUntilDue} days remaining`}
                            </div>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(borrowing)}`}>
                            {getStatusText(borrowing)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          {!isReturned && (
                            <button
                              onClick={() => handleReturn(borrowing.id)}
                              disabled={returnMutation.isPending}
                              className="text-blue-600 hover:text-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Return
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              perPage={perPage}
              onPerPageChange={handlePerPageChange}
            />
          )}
        </>
      )}
    </div>
  )
}

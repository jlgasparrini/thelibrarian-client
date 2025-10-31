import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useBorrowings, useReturnBook } from '@/hooks/useBorrowings'
import { TableSkeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { Pagination } from '@/components/ui/Pagination'
import { toast } from 'sonner'
import { Search, X, ArrowUpDown, ArrowUp, ArrowDown, BookOpen } from 'lucide-react'
import { formatDate, getStatusBadgeColor, getStatusText, getDaysUntilDue, getErrorMessage } from '@/lib/utils'

type StatusFilter = 'all' | 'active' | 'returned' | 'overdue'
type SortField = 'member' | 'book' | 'borrowed' | 'due' | 'status'
type SortDirection = 'asc' | 'desc'

export function AllBorrowingsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  
  const statusFilter = (searchParams.get('status') || 'all') as StatusFilter
  const page = Number(searchParams.get('page')) || 1
  const perPage = Number(searchParams.get('per_page')) || 25
  const sortField = (searchParams.get('sort') || 'borrowed') as SortField
  const sortDirection = (searchParams.get('dir') || 'desc') as SortDirection

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

  const handleSort = (field: SortField) => {
    const params = new URLSearchParams(searchParams)
    if (sortField === field) {
      // Toggle direction
      params.set('dir', sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // New field, default to asc
      params.set('sort', field)
      params.set('dir', 'asc')
    }
    setSearchParams(params)
  }

  const handleReturn = async (borrowingId: number) => {
    if (!confirm('Are you sure you want to mark this book as returned?')) {
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

  // Apply sorting
  filteredBorrowings = [...filteredBorrowings].sort((a, b) => {
    let comparison = 0
    
    switch (sortField) {
      case 'member':
        comparison = a.user.email.localeCompare(b.user.email)
        break
      case 'book':
        comparison = a.book.title.localeCompare(b.book.title)
        break
      case 'borrowed':
        comparison = new Date(a.borrowed_at).getTime() - new Date(b.borrowed_at).getTime()
        break
      case 'due':
        comparison = new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
        break
      case 'status': {
        const statusOrder = { returned: 0, active: 1, overdue: 2 }
        const aStatus = a.returned_at ? 'returned' : a['overdue?'] ? 'overdue' : 'active'
        const bStatus = b.returned_at ? 'returned' : b['overdue?'] ? 'overdue' : 'active'
        comparison = statusOrder[aStatus] - statusOrder[bStatus]
        break
      }
    }
    
    return sortDirection === 'asc' ? comparison : -comparison
  })

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
        <TableSkeleton rows={perPage > 10 ? 10 : perPage} columns={6} />
      ) : paginatedBorrowings.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No borrowings found"
          description={
            searchQuery
              ? 'Try adjusting your search query or filters'
              : 'No borrowings match the selected filter'
          }
          action={
            searchQuery || statusFilter !== 'all' ? (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSearchParams({})
                }}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Clear filters
              </button>
            ) : undefined
          }
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden rounded-lg bg-white shadow">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      <button
                        onClick={() => handleSort('member')}
                        className="flex items-center gap-1 hover:text-gray-700"
                      >
                        Member
                        {sortField === 'member' ? (
                          sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                        ) : (
                          <ArrowUpDown className="h-4 w-4 opacity-50" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      <button
                        onClick={() => handleSort('book')}
                        className="flex items-center gap-1 hover:text-gray-700"
                      >
                        Book
                        {sortField === 'book' ? (
                          sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                        ) : (
                          <ArrowUpDown className="h-4 w-4 opacity-50" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      <button
                        onClick={() => handleSort('borrowed')}
                        className="flex items-center gap-1 hover:text-gray-700"
                      >
                        Borrowed
                        {sortField === 'borrowed' ? (
                          sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                        ) : (
                          <ArrowUpDown className="h-4 w-4 opacity-50" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      <button
                        onClick={() => handleSort('due')}
                        className="flex items-center gap-1 hover:text-gray-700"
                      >
                        Due Date
                        {sortField === 'due' ? (
                          sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                        ) : (
                          <ArrowUpDown className="h-4 w-4 opacity-50" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      <button
                        onClick={() => handleSort('status')}
                        className="flex items-center gap-1 hover:text-gray-700"
                      >
                        Status
                        {sortField === 'status' ? (
                          sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                        ) : (
                          <ArrowUpDown className="h-4 w-4 opacity-50" />
                        )}
                      </button>
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

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {paginatedBorrowings.map((borrowing) => {
              const daysUntilDue = getDaysUntilDue(borrowing.due_date)
              const isOverdue = borrowing['overdue?']
              const isReturned = !!borrowing.returned_at

              return (
                <div key={borrowing.id} className="rounded-lg bg-white p-4 shadow">
                  <div className="space-y-3">
                    <div>
                      <Link
                        to={`/books/${borrowing.book.id}`}
                        className="font-medium text-gray-900 hover:text-blue-600"
                      >
                        {borrowing.book.title}
                      </Link>
                      <p className="text-sm text-gray-500">{borrowing.book.author}</p>
                    </div>
                    
                    <div className="text-sm">
                      <span className="text-gray-500">Member: </span>
                      <span className="text-gray-900">{borrowing.user.email}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <div className="text-gray-500">Borrowed</div>
                        <div className="text-gray-900">{formatDate(borrowing.borrowed_at)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-500">Due Date</div>
                        <div className="text-gray-900">{formatDate(borrowing.due_date)}</div>
                        {!isReturned && (
                          <div className={`text-xs ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
                            {isOverdue
                              ? `${Math.abs(daysUntilDue)} days overdue`
                              : `${daysUntilDue} days remaining`}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(borrowing)}`}>
                        {getStatusText(borrowing)}
                      </span>
                      {!isReturned && (
                        <button
                          onClick={() => handleReturn(borrowing.id)}
                          disabled={returnMutation.isPending}
                          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Return
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
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

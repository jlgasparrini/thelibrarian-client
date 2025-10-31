import { useSearchParams, useNavigate } from 'react-router-dom'
import { useBooks } from '@/hooks/useBooks'
import { useBorrowBook } from '@/hooks/useBorrowings'
import { SearchBar } from '@/components/books/SearchBar'
import { FilterPanel } from '@/components/books/FilterPanel'
import { BookCard } from '@/components/books/BookCard'
import { Pagination } from '@/components/ui/Pagination'
import { BooksGridSkeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { toast } from 'sonner'
import { Plus, BookOpen } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { getErrorMessage } from '@/lib/utils'

export function BooksPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const isLibrarian = user?.role === 'librarian'

  // Get params from URL
  const query = searchParams.get('query') || ''
  const genre = searchParams.get('genre') || ''
  const availableParam = searchParams.get('available')
  const available = availableParam === 'true' ? true : availableParam === 'false' ? false : undefined
  const sort = searchParams.get('sort') || 'title_asc'
  const page = Number(searchParams.get('page')) || 1
  const perPage = Number(searchParams.get('per_page')) || 25

  // Fetch books
  const { data, isLoading, isError, error } = useBooks({
    query: query || undefined,
    genre: genre || undefined,
    available,
    sort,
    page,
    per_page: perPage,
  })

  const borrowMutation = useBorrowBook()

  // Update URL params
  const updateParams = (updates: Record<string, string | number | boolean | undefined>) => {
    const newParams = new URLSearchParams(searchParams)
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === '' || value === null) {
        newParams.delete(key)
      } else {
        newParams.set(key, String(value))
      }
    })
    
    setSearchParams(newParams)
  }

  const handleSearch = (value: string) => {
    updateParams({ query: value, page: 1 })
  }

  const handleGenreChange = (value: string) => {
    updateParams({ genre: value, page: 1 })
  }

  const handleAvailableChange = (value: boolean | undefined) => {
    updateParams({ available: value, page: 1 })
  }

  const handleSortChange = (value: string) => {
    updateParams({ sort: value, page: 1 })
  }

  const handlePageChange = (newPage: number) => {
    updateParams({ page: newPage })
  }

  const handlePerPageChange = (newPerPage: number) => {
    updateParams({ per_page: newPerPage, page: 1 })
  }

  const handleClearFilters = () => {
    setSearchParams({})
  }

  const handleBorrow = async (bookId: number) => {
    try {
      await borrowMutation.mutateAsync({ book_id: bookId })
      toast.success('Book borrowed successfully!')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleEdit = (bookId: number) => {
    navigate(`/books/${bookId}/edit`)
  }

  const handleDelete = () => {
    // TODO: Implement delete confirmation modal
    toast.info('Delete functionality coming soon')
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <p className="text-sm text-red-800">
          Error loading books: {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Books</h1>
          <p className="mt-1 text-sm text-gray-600">
            Browse and search our library collection
          </p>
        </div>
        {isLibrarian && (
          <button
            onClick={() => navigate('/books/new')}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="h-5 w-5" />
            Add Book
          </button>
        )}
      </div>

      {/* Search */}
      <SearchBar value={query} onChange={handleSearch} />

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Filters */}
        <div className="lg:col-span-1">
          <FilterPanel
            genre={genre}
            available={available}
            sort={sort}
            onGenreChange={handleGenreChange}
            onAvailableChange={handleAvailableChange}
            onSortChange={handleSortChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Books grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <BooksGridSkeleton count={perPage > 12 ? 12 : perPage} />
          ) : data?.books.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No books found"
              description="Try adjusting your search or filters to find what you're looking for."
              action={
                query || genre || available !== undefined ? (
                  <button
                    onClick={handleClearFilters}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Clear filters
                  </button>
                ) : undefined
              }
            />
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {data?.books.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onBorrow={handleBorrow}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>

              {/* Pagination */}
              {data && data.pagination.total_pages > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={data.pagination.current_page}
                    totalPages={data.pagination.total_pages}
                    onPageChange={handlePageChange}
                    perPage={perPage}
                    onPerPageChange={handlePerPageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

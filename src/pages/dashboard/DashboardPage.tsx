import { useAuthStore } from '@/stores/authStore'
import { useDashboard } from '@/hooks/useDashboard'
import { StatCard } from '@/components/dashboard/StatCard'
import { BorrowingCard } from '@/components/borrowings/BorrowingCard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { BookOpen, AlertCircle, Clock, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDate, getStatusBadgeColor, getStatusText } from '@/lib/utils'
import type { MemberDashboard, LibrarianDashboard } from '@/types'

export function DashboardPage() {
  const { user } = useAuthStore()
  const { data, isLoading, isError } = useDashboard()

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <p className="text-sm text-red-800">Failed to load dashboard data</p>
      </div>
    )
  }

  const isMember = user?.role === 'member'
  const memberData = data?.dashboard as MemberDashboard
  const librarianData = data?.dashboard as LibrarianDashboard

  if (!isMember) {
    // Librarian dashboard
    return (
      <div className="space-y-6">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Library Overview</h1>
          <p className="mt-1 text-sm text-gray-600">
            Monitor library-wide statistics and activity
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={BookOpen}
            label="Total Books"
            value={librarianData?.total_books || 0}
            variant="default"
          />
          <StatCard
            icon={BookOpen}
            label="Available Books"
            value={librarianData?.total_available_books || 0}
            variant="success"
          />
          <StatCard
            icon={Clock}
            label="Active Borrowings"
            value={librarianData?.total_borrowed_books || 0}
            variant="default"
          />
          <StatCard
            icon={AlertCircle}
            label="Overdue Books"
            value={librarianData?.overdue_books || 0}
            variant={librarianData?.overdue_books > 0 ? 'danger' : 'default'}
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid gap-5 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-4 shadow">
            <dt className="text-sm font-medium text-gray-500">Books Due Today</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900">
              {librarianData?.books_due_today || 0}
            </dd>
          </div>
          <div className="rounded-lg bg-white p-4 shadow">
            <dt className="text-sm font-medium text-gray-500">Total Members</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900">
              {librarianData?.total_members || 0}
            </dd>
          </div>
          <div className="rounded-lg bg-white p-4 shadow">
            <dt className="text-sm font-medium text-gray-500">Members with Overdue</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900">
              {librarianData?.members_with_overdue_books || 0}
            </dd>
          </div>
        </div>

        {/* Recent Borrowings */}
        {librarianData?.recent_borrowings && librarianData.recent_borrowings.length > 0 && (
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Borrowings</h2>
              <Link
                to="/borrowings"
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {librarianData.recent_borrowings.slice(0, 10).map((borrowing) => (
                    <tr key={borrowing.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {borrowing.user.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <Link
                          to={`/books/${borrowing.book.id}`}
                          className="hover:text-blue-600"
                        >
                          {borrowing.book.title}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {formatDate(borrowing.borrowed_at)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {formatDate(borrowing.due_date)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(borrowing)}`}>
                          {getStatusText(borrowing)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Two Column Layout for Popular Books and Overdue */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Popular Books */}
          {librarianData?.popular_books && librarianData.popular_books.length > 0 && (
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Popular Books</h2>
              <div className="space-y-3">
                {librarianData.popular_books.slice(0, 10).map((book) => (
                  <Link
                    key={book.id}
                    to={`/books/${book.id}`}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {book.title}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{book.author}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        {book.borrowings_count} borrows
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Overdue Borrowings */}
          {librarianData?.overdue_borrowings && librarianData.overdue_borrowings.length > 0 && (
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Overdue Borrowings</h2>
              <div className="space-y-3">
                {librarianData.overdue_borrowings.slice(0, 10).map((borrowing) => {
                  const daysOverdue = Math.abs(
                    Math.ceil(
                      (new Date(borrowing.due_date).getTime() - new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                    )
                  )
                  return (
                    <div
                      key={borrowing.id}
                      className="rounded-lg border border-red-200 bg-red-50 p-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/books/${borrowing.book.id}`}
                            className="text-sm font-medium text-gray-900 hover:text-blue-600 truncate block"
                          >
                            {borrowing.book.title}
                          </Link>
                          <p className="text-sm text-gray-600 truncate">
                            {borrowing.user.email}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Due: {formatDate(borrowing.due_date)}
                          </p>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                            {daysOverdue} {daysOverdue === 1 ? 'day' : 'days'} overdue
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              to="/books/new"
              className="flex items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div>
                <BookOpen className="mx-auto h-8 w-8 text-gray-400" />
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Add New Book
                </span>
              </div>
            </Link>
            <Link
              to="/books"
              className="flex items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div>
                <BookOpen className="mx-auto h-8 w-8 text-gray-400" />
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Manage Books
                </span>
              </div>
            </Link>
            <Link
              to="/borrowings"
              className="flex items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div>
                <Clock className="mx-auto h-8 w-8 text-gray-400" />
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  All Borrowings
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
        <p className="mt-1 text-sm text-gray-600">
          Here's an overview of your library activity
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={BookOpen}
          label="Active Borrowings"
          value={memberData?.active_borrowings_count || 0}
          variant="default"
        />
        <StatCard
          icon={AlertCircle}
          label="Overdue Books"
          value={memberData?.overdue_borrowings_count || 0}
          variant={memberData?.overdue_borrowings_count > 0 ? 'danger' : 'default'}
        />
        <StatCard
          icon={Clock}
          label="Due Soon"
          value={memberData?.books_due_soon || 0}
          variant={memberData?.books_due_soon > 0 ? 'warning' : 'default'}
        />
      </div>

      {/* Active Borrowings */}
      {memberData?.borrowed_books && memberData.borrowed_books.length > 0 && (
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Active Borrowings</h2>
            <Link
              to="/my-borrowings"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {memberData.borrowed_books.slice(0, 5).map((borrowing) => (
              <BorrowingCard
                key={borrowing.id}
                borrowing={borrowing}
                showReturnButton={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/books"
            className="flex items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div>
              <BookOpen className="mx-auto h-8 w-8 text-gray-400" />
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Browse Books
              </span>
            </div>
          </Link>
          <Link
            to="/my-borrowings"
            className="flex items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div>
              <Clock className="mx-auto h-8 w-8 text-gray-400" />
              <span className="mt-2 block text-sm font-medium text-gray-900">
                My Borrowings
              </span>
            </div>
          </Link>
          <Link
            to="/my-history"
            className="flex items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div>
              <AlertCircle className="mx-auto h-8 w-8 text-gray-400" />
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Borrowing History
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

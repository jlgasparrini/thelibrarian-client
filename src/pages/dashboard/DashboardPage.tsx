import { useAuthStore } from '@/stores/authStore'
import { useDashboard } from '@/hooks/useDashboard'
import { StatCard } from '@/components/dashboard/StatCard'
import { BorrowingCard } from '@/components/borrowings/BorrowingCard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { BookOpen, AlertCircle, Clock, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { MemberDashboard } from '@/types'

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

  if (!isMember) {
    // Librarian dashboard - placeholder for now
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-2xl font-bold text-gray-900">Welcome, Librarian!</h2>
        <p className="mt-2 text-gray-600">
          Librarian dashboard coming soon. Use the navigation to manage books and borrowings.
        </p>
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

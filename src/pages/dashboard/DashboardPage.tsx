import { useAuthStore } from '@/stores/authStore'

export function DashboardPage() {
  const { user } = useAuthStore()

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="text-2xl font-bold text-gray-900">
        Welcome, {user?.role === 'librarian' ? 'Librarian' : 'Member'}!
      </h2>
      <p className="mt-2 text-gray-600">
        This is your dashboard. More features coming soon!
      </p>
      
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900">Email</h3>
          <p className="mt-1 text-sm text-gray-600">{user?.email}</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900">Role</h3>
          <p className="mt-1 text-sm text-gray-600 capitalize">{user?.role}</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900">Status</h3>
          <p className="mt-1 text-sm text-green-600">Active</p>
        </div>
      </div>
    </div>
  )
}

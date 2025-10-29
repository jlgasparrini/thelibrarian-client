import { useAuthStore } from '@/stores/authStore'
import { useSignOut } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export function DashboardPage() {
  const { user, logout } = useAuthStore()
  const signOutMutation = useSignOut()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOutMutation.mutateAsync()
      logout()
      toast.success('Logged out successfully')
      navigate('/login')
    } catch {
      // Even if API call fails, logout locally
      logout()
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <h1 className="text-xl font-bold text-gray-900">Library System</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user?.email} ({user?.role})
              </span>
              <button
                onClick={handleLogout}
                className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
      </main>
    </div>
  )
}

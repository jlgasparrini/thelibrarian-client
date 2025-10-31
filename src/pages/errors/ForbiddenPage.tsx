import { Link } from 'react-router-dom'
import { ShieldAlert, Home } from 'lucide-react'

export function ForbiddenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
          <ShieldAlert className="h-12 w-12 text-red-600" />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-gray-900">Access Denied</h1>
        <p className="mt-2 text-lg text-gray-600">
          You don't have permission to access this page.
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Please contact an administrator if you believe this is an error.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Home className="mr-2 h-4 w-4" />
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

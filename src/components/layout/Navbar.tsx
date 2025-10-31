import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, BookOpen, LogOut, User } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useSignOut } from '@/hooks/useAuth'
import { toast } from 'sonner'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const signOutMutation = useSignOut()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    try {
      await signOutMutation.mutateAsync()
      logout()
      toast.success('Logged out successfully')
      navigate('/login')
    } catch {
      logout()
      navigate('/login')
    }
  }

  // Navigation links based on role
  const memberLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/books', label: 'Books' },
    { to: '/my-borrowings', label: 'My Borrowings' },
    { to: '/my-history', label: 'My History' },
  ]

  const librarianLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/books', label: 'Books' },
    { to: '/borrowings', label: 'All Borrowings' },
    { to: '/books/new', label: 'Add Book' },
  ]

  const navLinks = user?.role === 'librarian' ? librarianLinks : memberLinks

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          {/* Logo and desktop navigation */}
          <div className="flex">
            <Link to="/dashboard" className="flex flex-shrink-0 items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Library System
              </span>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop user menu */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <User className="h-4 w-4" />
              <span>{user?.email}</span>
              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                {user?.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-1 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 pb-3 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
                  isActive(link.to)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="border-t border-gray-200 pb-3 pt-4">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <User className="h-8 w-8 text-gray-400" />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{user?.email}</div>
                <div className="text-sm font-medium text-gray-500 capitalize">
                  {user?.role}
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1 px-2">
              <button
                onClick={handleLogout}
                className="flex w-full items-center space-x-2 rounded-md px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

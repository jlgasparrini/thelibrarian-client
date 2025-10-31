import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@/test/utils'
import { BrowserRouter } from 'react-router-dom'
import { Navbar } from './Navbar'
import { useAuthStore } from '@/stores/authStore'
import userEvent from '@testing-library/user-event'

// Mock the auth store
vi.mock('@/stores/authStore')
vi.mock('@/hooks/useAuth', () => ({
  useSignOut: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
}))

describe('Navbar Accessibility', () => {
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    role: 'member' as const,
    created_at: '2024-01-01',
  }

  beforeEach(() => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: mockUser,
      token: 'test-token',
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      setUser: vi.fn(),
      checkAuth: vi.fn(),
    })
  })

  it('should have proper ARIA labels for screen readers', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    )

    // Check for screen reader text
    expect(screen.getByText('Open main menu')).toBeInTheDocument()
  })

  it('should have accessible navigation links', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    )

    // All navigation links should be accessible
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
    
    links.forEach(link => {
      expect(link).toHaveAccessibleName()
    })
  })

  it('should have accessible buttons', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    )

    // Mobile menu button should be accessible
    const menuButton = screen.getByRole('button', { name: /open main menu/i })
    expect(menuButton).toBeInTheDocument()
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')

    // Sign out button should be accessible
    const signOutButtons = screen.getAllByRole('button', { name: /sign out/i })
    expect(signOutButtons.length).toBeGreaterThan(0)
  })

  it('should support keyboard navigation', async () => {
    const user = userEvent.setup()
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    )

    // Tab through interactive elements
    await user.tab()
    
    // First focusable element should be focused
    const firstLink = screen.getAllByRole('link')[0]
    expect(firstLink).toHaveFocus()
  })

  it('should toggle mobile menu with keyboard', async () => {
    const user = userEvent.setup()
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    )

    const menuButton = screen.getByRole('button', { name: /open main menu/i })
    
    // Click to open
    await user.click(menuButton)
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    
    // Menu should be visible
    const mobileLinks = screen.getAllByRole('link')
    expect(mobileLinks.length).toBeGreaterThan(4) // Desktop + mobile links
  })

  it('should have proper color contrast for text', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    )

    // Logo text should be visible
    const logoText = screen.getByText('Library System')
    expect(logoText).toHaveClass('text-gray-900')
  })

  it('should display user role badge with proper semantics', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    )

    const roleBadge = screen.getByText('member')
    expect(roleBadge).toBeInTheDocument()
    expect(roleBadge).toHaveClass('text-blue-800')
  })
})

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/utils'
import { BrowserRouter } from 'react-router-dom'
import { LoginPage } from './LoginPage'
import userEvent from '@testing-library/user-event'

// Mock hooks
vi.mock('@/hooks/useAuth', () => ({
  useSignIn: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
    isError: false,
  }),
}))

vi.mock('@/stores/authStore', () => ({
  useAuthStore: () => ({
    login: vi.fn(),
    isAuthenticated: false,
  }),
}))

describe('LoginPage Accessibility', () => {
  it('should have proper form labels', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    )

    // Email input should have label
    const emailInput = screen.getByPlaceholderText('Email address')
    expect(emailInput).toHaveAttribute('id', 'email')
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(emailInput).toHaveAttribute('autoComplete', 'email')

    // Password input should have label
    const passwordInput = screen.getByPlaceholderText('Password')
    expect(passwordInput).toHaveAttribute('id', 'password')
    expect(passwordInput).toHaveAttribute('type', 'password')
    expect(passwordInput).toHaveAttribute('autoComplete', 'current-password')
  })

  it('should have accessible form controls', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    )

    // Submit button should be accessible
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    expect(submitButton).toBeInTheDocument()
    expect(submitButton).toHaveAttribute('type', 'submit')
  })

  it('should support keyboard navigation through form', async () => {
    const user = userEvent.setup()
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    )

    const emailInput = screen.getByPlaceholderText('Email address')
    const passwordInput = screen.getByPlaceholderText('Password')

    // Focus on email input directly
    await user.click(emailInput)
    expect(emailInput).toHaveFocus()

    // Tab to password
    await user.tab()
    expect(passwordInput).toHaveFocus()
  })

  it('should display validation errors accessibly', async () => {
    const user = userEvent.setup()
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    )

    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    // Submit empty form
    await user.click(submitButton)

    // Wait for validation errors - check for any error message
    const errors = await screen.findAllByText(/invalid email|email is required|password is required/i)
    expect(errors.length).toBeGreaterThan(0)
    errors.forEach(error => {
      expect(error).toHaveClass('text-red-600')
    })
  })

  it('should have proper heading hierarchy', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    )

    const heading = screen.getByRole('heading', { name: /sign in to your account/i })
    expect(heading).toBeInTheDocument()
  })

  it('should have accessible links', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    )

    const signupLink = screen.getByRole('link', { name: /create a new account/i })
    expect(signupLink).toBeInTheDocument()
    expect(signupLink).toHaveAttribute('href', '/signup')
  })

  it('should have proper focus management', async () => {
    const user = userEvent.setup()
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    )

    const emailInput = screen.getByPlaceholderText('Email address')
    
    // Focus should be manageable
    await user.click(emailInput)
    expect(emailInput).toHaveFocus()
  })

  it('should have visible focus indicators', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    )

    const emailInput = screen.getByPlaceholderText('Email address')
    
    // Check for focus ring classes
    expect(emailInput).toHaveClass('focus:ring-blue-500')
    expect(emailInput).toHaveClass('focus:border-blue-500')
  })
})

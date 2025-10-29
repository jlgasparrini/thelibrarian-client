import { http, HttpResponse } from 'msw'
import type { Book, Borrowing, User } from '@/types'

// Match the base URL from the API client
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

// Mock data
const mockUser: User = {
  id: 1,
  email: 'test@library.com',
  role: 'member',
  created_at: '2025-10-29T00:00:00.000Z',
}

const mockBooks: Book[] = [
  {
    id: 1,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    genre: 'Programming',
    isbn: '9780132350884',
    total_copies: 5,
    available_copies: 3,
    borrowings_count: 2,
    created_at: '2025-10-29T00:00:00.000Z',
    updated_at: '2025-10-29T00:00:00.000Z',
  },
  {
    id: 2,
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt',
    genre: 'Programming',
    isbn: '9780135957059',
    total_copies: 3,
    available_copies: 1,
    borrowings_count: 2,
    created_at: '2025-10-29T00:00:00.000Z',
    updated_at: '2025-10-29T00:00:00.000Z',
  },
]

const mockBorrowings: Borrowing[] = [
  {
    id: 1,
    borrowed_at: '2025-10-24T00:00:00.000Z',
    due_date: '2025-11-07T00:00:00.000Z',
    returned_at: null,
    'overdue?': false,
    book: {
      id: 1,
      title: 'Clean Code',
      author: 'Robert C. Martin',
      isbn: '9780132350884',
    },
    user: {
      id: 1,
      email: 'test@library.com',
    },
  },
]

export const handlers = [
  // Auth endpoints
  http.post(`${API_URL}/auth/sign_up`, async () => {
    return HttpResponse.json({
      message: 'Signed up successfully',
      user: mockUser,
    }, { status: 201 })
  }),

  http.post(`${API_URL}/auth/sign_in`, async () => {
    return HttpResponse.json(
      {
        message: 'Logged in successfully',
        user: mockUser,
      },
      {
        status: 200,
        headers: {
          Authorization: 'Bearer mock-jwt-token',
        },
      }
    )
  }),

  http.delete(`${API_URL}/auth/sign_out`, () => {
    return HttpResponse.json({
      message: 'Logged out successfully',
    })
  }),

  http.get(`${API_URL}/users/me`, () => {
    return HttpResponse.json({
      user: mockUser,
    })
  }),

  // Books endpoints
  http.get(`${API_URL}/books`, ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page')) || 1
    const perPage = Number(url.searchParams.get('per_page')) || 25

    return HttpResponse.json({
      books: mockBooks,
      pagination: {
        current_page: page,
        total_pages: 1,
        total_count: mockBooks.length,
        per_page: perPage,
      },
    })
  }),

  http.get(`${API_URL}/books/:id`, ({ params }) => {
    const book = mockBooks.find((b) => b.id === Number(params.id))
    if (!book) {
      return HttpResponse.json({ error: 'Book not found' }, { status: 404 })
    }
    return HttpResponse.json({ book })
  }),

  http.post(`${API_URL}/books`, async ({ request }) => {
    const body = (await request.json()) as { book: Partial<Book> }
    const newBook: Book = {
      id: mockBooks.length + 1,
      ...body.book,
      borrowings_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Book
    return HttpResponse.json(
      {
        book: newBook,
        message: 'Book created successfully',
      },
      { status: 201 }
    )
  }),

  http.put(`${API_URL}/books/:id`, async ({ params, request }) => {
    const book = mockBooks.find((b) => b.id === Number(params.id))
    if (!book) {
      return HttpResponse.json({ error: 'Book not found' }, { status: 404 })
    }
    const body = (await request.json()) as { book: Partial<Book> }
    const updatedBook = { ...book, ...body.book }
    return HttpResponse.json({
      book: updatedBook,
      message: 'Book updated successfully',
    })
  }),

  http.delete(`${API_URL}/books/:id`, () => {
    return HttpResponse.json({
      message: 'Book deleted successfully',
    })
  }),

  // Borrowings endpoints
  http.get(`${API_URL}/borrowings`, ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page')) || 1
    const perPage = Number(url.searchParams.get('per_page')) || 25

    return HttpResponse.json({
      borrowings: mockBorrowings,
      pagination: {
        current_page: page,
        total_pages: 1,
        total_count: mockBorrowings.length,
        per_page: perPage,
      },
    })
  }),

  http.get(`${API_URL}/borrowings/:id`, ({ params }) => {
    const borrowing = mockBorrowings.find((b) => b.id === Number(params.id))
    if (!borrowing) {
      return HttpResponse.json({ error: 'Borrowing not found' }, { status: 404 })
    }
    return HttpResponse.json({ borrowing })
  }),

  http.post(`${API_URL}/borrowings`, async ({ request }) => {
    const body = (await request.json()) as { borrowing: { book_id: number } }
    const newBorrowing: Borrowing = {
      id: mockBorrowings.length + 1,
      borrowed_at: new Date().toISOString(),
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      returned_at: null,
      'overdue?': false,
      book: mockBooks[0].id === body.borrowing.book_id ? {
        id: mockBooks[0].id,
        title: mockBooks[0].title,
        author: mockBooks[0].author,
        isbn: mockBooks[0].isbn,
      } : {
        id: mockBooks[1].id,
        title: mockBooks[1].title,
        author: mockBooks[1].author,
        isbn: mockBooks[1].isbn,
      },
      user: {
        id: mockUser.id,
        email: mockUser.email,
      },
    }
    return HttpResponse.json(
      {
        borrowing: newBorrowing,
        message: 'Book borrowed successfully',
      },
      { status: 201 }
    )
  }),

  http.put(`${API_URL}/borrowings/:id`, ({ params }) => {
    const borrowing = mockBorrowings.find((b) => b.id === Number(params.id))
    if (!borrowing) {
      return HttpResponse.json({ error: 'Borrowing not found' }, { status: 404 })
    }
    const returnedBorrowing = {
      ...borrowing,
      returned_at: new Date().toISOString(),
    }
    return HttpResponse.json({
      borrowing: returnedBorrowing,
      message: 'Book returned successfully',
    })
  }),

  http.get(`${API_URL}/borrowings/overdue`, ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page')) || 1
    const perPage = Number(url.searchParams.get('per_page')) || 25

    return HttpResponse.json({
      borrowings: [],
      pagination: {
        current_page: page,
        total_pages: 0,
        total_count: 0,
        per_page: perPage,
      },
    })
  }),

  // Dashboard endpoint
  http.get(`${API_URL}/dashboard`, () => {
    return HttpResponse.json({
      dashboard: {
        active_borrowings_count: 1,
        overdue_borrowings_count: 0,
        books_due_soon: 0,
        borrowed_books: mockBorrowings,
        borrowing_history: [],
      },
    })
  }),
]

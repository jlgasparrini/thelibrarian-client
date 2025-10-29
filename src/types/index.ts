// User types
export interface User {
  id: number
  email: string
  role: 'member' | 'librarian'
  created_at: string
}

// Book types
export interface Book {
  id: number
  title: string
  author: string
  genre: string
  isbn: string
  total_copies: number
  available_copies: number
  borrowings_count: number
  created_at: string
  updated_at: string
}

// Borrowing types
export interface Borrowing {
  id: number
  borrowed_at: string
  due_date: string
  returned_at: string | null
  'overdue?'?: boolean
  book: {
    id: number
    title: string
    author: string
    isbn?: string
  }
  user: {
    id: number
    email: string
  }
}

// Pagination types
export interface PaginationMeta {
  current_page: number
  total_pages: number
  total_count: number
  per_page: number
}

// Dashboard types
export interface LibrarianDashboard {
  total_books: number
  total_available_books: number
  total_borrowed_books: number
  books_due_today: number
  overdue_books: number
  total_members: number
  members_with_overdue_books: number
  recent_borrowings: Borrowing[]
  popular_books: Book[]
  overdue_borrowings: Borrowing[]
}

export interface MemberDashboard {
  active_borrowings_count: number
  overdue_borrowings_count: number
  books_due_soon: number
  borrowed_books: Borrowing[]
  borrowing_history: Borrowing[]
}

// API Response types
export interface ApiResponse<T> {
  data?: T
  message?: string
  error?: string
  errors?: string[]
}

export interface BooksResponse {
  books: Book[]
  pagination: PaginationMeta
}

export interface BorrowingsResponse {
  borrowings: Borrowing[]
  pagination: PaginationMeta
}

export interface BookResponse {
  book: Book
  message?: string
}

export interface BorrowingResponse {
  borrowing: Borrowing
  message?: string
}

export interface DashboardResponse {
  dashboard: LibrarianDashboard | MemberDashboard
}

export interface UserResponse {
  user: User
  message?: string
}

// Auth types
export interface SignUpData {
  email: string
  password: string
  password_confirmation: string
  role?: 'member' | 'librarian'
}

export interface SignInData {
  email: string
  password: string
}

// Form types
export interface BookFormData {
  title: string
  author: string
  genre: string
  isbn: string
  total_copies: number
  available_copies: number
}

export interface BorrowingFormData {
  book_id: number
}

// Query params types
export interface BooksQueryParams {
  query?: string
  genre?: string
  available?: boolean
  sort?: 'title' | 'author' | 'created_at'
  page?: number
  per_page?: number
}

export interface BorrowingsQueryParams {
  status?: 'active' | 'returned' | 'overdue'
  page?: number
  per_page?: number
}

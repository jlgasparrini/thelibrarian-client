export const GENRES = [
  'Fiction',
  'Non-Fiction',
  'Science Fiction',
  'Fantasy',
  'Mystery',
  'Thriller',
  'Romance',
  'Horror',
  'Biography',
  'History',
  'Science',
  'Programming',
  'Business',
  'Self-Help',
  'Poetry',
  'Drama',
  'Other',
] as const

export const SORT_OPTIONS = [
  { value: 'title', label: 'Title' },
  { value: 'author', label: 'Author' },
  { value: 'created_at', label: 'Date Added' },
] as const

export const BORROWING_STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'returned', label: 'Returned' },
  { value: 'overdue', label: 'Overdue' },
] as const

export const ITEMS_PER_PAGE = 25
export const BORROWING_PERIOD_DAYS = 14
export const DUE_SOON_DAYS = 3

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  BOOKS: '/books',
  BOOK_DETAIL: '/books/:id',
  BOOK_NEW: '/books/new',
  BOOK_EDIT: '/books/:id/edit',
  MY_BORROWINGS: '/my-borrowings',
  MY_HISTORY: '/my-history',
  ALL_BORROWINGS: '/borrowings',
  OVERDUE_BORROWINGS: '/borrowings/overdue',
} as const

import { z } from 'zod'

// Auth validators
export const signUpSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    password_confirmation: z.string(),
    role: z.enum(['member', 'librarian']).optional(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ['password_confirmation'],
  })

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Book validators
export const bookSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  author: z.string().min(1, 'Author is required').max(255, 'Author is too long'),
  genre: z.string().min(1, 'Genre is required'),
  isbn: z
    .string()
    .min(1, 'ISBN is required')
    .regex(/^(?:\d{10}|\d{13})$/, 'ISBN must be 10 or 13 digits'),
  total_copies: z
    .number()
    .int('Must be a whole number')
    .min(0, 'Must be at least 0'),
  available_copies: z
    .number()
    .int('Must be a whole number')
    .min(0, 'Must be at least 0'),
})
  .refine((data) => data.available_copies <= data.total_copies, {
    message: 'Available copies cannot exceed total copies',
    path: ['available_copies'],
  })

// Search and filter validators
export const booksQuerySchema = z.object({
  query: z.string().optional(),
  genre: z.string().optional(),
  available: z.boolean().optional(),
  sort: z.enum(['title', 'author', 'created_at']).optional(),
  page: z.number().int().min(1).optional(),
  per_page: z.number().int().min(1).max(100).optional(),
})

export const borrowingsQuerySchema = z.object({
  status: z.enum(['active', 'returned', 'overdue']).optional(),
  page: z.number().int().min(1).optional(),
  per_page: z.number().int().min(1).max(100).optional(),
})

export type SignUpFormData = z.infer<typeof signUpSchema>
export type SignInFormData = z.infer<typeof signInSchema>
export type BookFormData = z.infer<typeof bookSchema>
export type BooksQueryFormData = z.infer<typeof booksQuerySchema>
export type BorrowingsQueryFormData = z.infer<typeof borrowingsQuerySchema>

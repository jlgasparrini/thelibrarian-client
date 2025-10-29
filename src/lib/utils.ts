import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getDaysUntilDue(dueDate: string): number {
  const due = new Date(dueDate)
  const now = new Date()
  const diffTime = due.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export function isOverdue(dueDate: string, returnedAt: string | null): boolean {
  if (returnedAt) return false
  return new Date(dueDate) < new Date()
}

export function isDueSoon(dueDate: string, returnedAt: string | null, days: number = 3): boolean {
  if (returnedAt) return false
  const daysUntil = getDaysUntilDue(dueDate)
  return daysUntil > 0 && daysUntil <= days
}

export function getStatusColor(borrowing: { due_date: string; returned_at: string | null }): string {
  if (borrowing.returned_at) return 'text-green-600'
  if (isOverdue(borrowing.due_date, borrowing.returned_at)) return 'text-red-600'
  if (isDueSoon(borrowing.due_date, borrowing.returned_at)) return 'text-yellow-600'
  return 'text-blue-600'
}

export function getStatusBadgeColor(borrowing: { due_date: string; returned_at: string | null }): string {
  if (borrowing.returned_at) return 'bg-green-100 text-green-800'
  if (isOverdue(borrowing.due_date, borrowing.returned_at)) return 'bg-red-100 text-red-800'
  if (isDueSoon(borrowing.due_date, borrowing.returned_at)) return 'bg-yellow-100 text-yellow-800'
  return 'bg-blue-100 text-blue-800'
}

export function getStatusText(borrowing: { due_date: string; returned_at: string | null }): string {
  if (borrowing.returned_at) return 'Returned'
  if (isOverdue(borrowing.due_date, borrowing.returned_at)) return 'Overdue'
  if (isDueSoon(borrowing.due_date, borrowing.returned_at)) return 'Due Soon'
  return 'Active'
}

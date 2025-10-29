import { describe, it, expect } from 'vitest'
import {
  formatDate,
  getDaysUntilDue,
  isOverdue,
  isDueSoon,
  getStatusText,
} from './utils'

describe('utils', () => {
  describe('formatDate', () => {
    it('formats ISO date string correctly', () => {
      const date = '2025-10-29T12:00:00.000Z'
      const formatted = formatDate(date)
      expect(formatted).toMatch(/Oct (28|29), 2025/)
    })
  })

  describe('getDaysUntilDue', () => {
    it('returns positive days for future date', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 5)
      const days = getDaysUntilDue(futureDate.toISOString())
      expect(days).toBeGreaterThanOrEqual(4)
      expect(days).toBeLessThanOrEqual(5)
    })

    it('returns negative days for past date', () => {
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 5)
      const days = getDaysUntilDue(pastDate.toISOString())
      expect(days).toBeLessThanOrEqual(-4)
    })
  })

  describe('isOverdue', () => {
    it('returns true for past due date with no return', () => {
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 1)
      expect(isOverdue(pastDate.toISOString(), null)).toBe(true)
    })

    it('returns false for future due date', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 1)
      expect(isOverdue(futureDate.toISOString(), null)).toBe(false)
    })

    it('returns false if book is returned', () => {
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 1)
      expect(isOverdue(pastDate.toISOString(), new Date().toISOString())).toBe(
        false
      )
    })
  })

  describe('isDueSoon', () => {
    it('returns true for date within 3 days', () => {
      const soonDate = new Date()
      soonDate.setDate(soonDate.getDate() + 2)
      expect(isDueSoon(soonDate.toISOString(), null)).toBe(true)
    })

    it('returns false for date more than 3 days away', () => {
      const farDate = new Date()
      farDate.setDate(farDate.getDate() + 5)
      expect(isDueSoon(farDate.toISOString(), null)).toBe(false)
    })

    it('returns false if book is returned', () => {
      const soonDate = new Date()
      soonDate.setDate(soonDate.getDate() + 2)
      expect(isDueSoon(soonDate.toISOString(), new Date().toISOString())).toBe(
        false
      )
    })
  })

  describe('getStatusText', () => {
    it('returns "Returned" for returned book', () => {
      const borrowing = {
        due_date: new Date().toISOString(),
        returned_at: new Date().toISOString(),
      }
      expect(getStatusText(borrowing)).toBe('Returned')
    })

    it('returns "Overdue" for overdue book', () => {
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 1)
      const borrowing = {
        due_date: pastDate.toISOString(),
        returned_at: null,
      }
      expect(getStatusText(borrowing)).toBe('Overdue')
    })

    it('returns "Due Soon" for book due within 3 days', () => {
      const soonDate = new Date()
      soonDate.setDate(soonDate.getDate() + 2)
      const borrowing = {
        due_date: soonDate.toISOString(),
        returned_at: null,
      }
      expect(getStatusText(borrowing)).toBe('Due Soon')
    })

    it('returns "Active" for active book not due soon', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 10)
      const borrowing = {
        due_date: futureDate.toISOString(),
        returned_at: null,
      }
      expect(getStatusText(borrowing)).toBe('Active')
    })
  })
})

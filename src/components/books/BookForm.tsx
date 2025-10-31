import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { bookSchema, type BookFormData } from '@/lib/validators'
import { GENRES } from '@/lib/constants'
import type { Book } from '@/types'

interface BookFormProps {
  initialData?: Book
  onSubmit: (data: BookFormData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export function BookForm({ initialData, onSubmit, onCancel, isSubmitting = false }: BookFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          author: initialData.author,
          genre: initialData.genre,
          isbn: initialData.isbn,
          total_copies: initialData.total_copies,
          available_copies: initialData.available_copies,
        }
      : {
          title: '',
          author: '',
          genre: '',
          isbn: '',
          total_copies: 1,
          available_copies: 1,
        },
  })

  const totalCopies = watch('total_copies')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title <span className="text-red-600">*</span>
        </label>
        <input
          {...register('title')}
          type="text"
          id="title"
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 ${
            errors.title
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Author */}
      <div>
        <label htmlFor="author" className="block text-sm font-medium text-gray-700">
          Author <span className="text-red-600">*</span>
        </label>
        <input
          {...register('author')}
          type="text"
          id="author"
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 ${
            errors.author
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
        />
        {errors.author && (
          <p className="mt-1 text-sm text-red-600">{errors.author.message}</p>
        )}
      </div>

      {/* Genre */}
      <div>
        <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
          Genre <span className="text-red-600">*</span>
        </label>
        <select
          {...register('genre')}
          id="genre"
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 ${
            errors.genre
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
        >
          <option value="">Select a genre</option>
          {GENRES.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
        {errors.genre && (
          <p className="mt-1 text-sm text-red-600">{errors.genre.message}</p>
        )}
      </div>

      {/* ISBN */}
      <div>
        <label htmlFor="isbn" className="block text-sm font-medium text-gray-700">
          ISBN <span className="text-red-600">*</span>
        </label>
        <input
          {...register('isbn')}
          type="text"
          id="isbn"
          placeholder="10 or 13 digits"
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 ${
            errors.isbn
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
        />
        {errors.isbn && (
          <p className="mt-1 text-sm text-red-600">{errors.isbn.message}</p>
        )}
      </div>

      {/* Total Copies */}
      <div>
        <label htmlFor="total_copies" className="block text-sm font-medium text-gray-700">
          Total Copies <span className="text-red-600">*</span>
        </label>
        <input
          {...register('total_copies', { valueAsNumber: true })}
          type="number"
          id="total_copies"
          min="0"
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 ${
            errors.total_copies
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
        />
        {errors.total_copies && (
          <p className="mt-1 text-sm text-red-600">{errors.total_copies.message}</p>
        )}
      </div>

      {/* Available Copies */}
      <div>
        <label htmlFor="available_copies" className="block text-sm font-medium text-gray-700">
          Available Copies <span className="text-red-600">*</span>
        </label>
        <input
          {...register('available_copies', { valueAsNumber: true })}
          type="number"
          id="available_copies"
          min="0"
          max={totalCopies}
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 ${
            errors.available_copies
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
        />
        {errors.available_copies && (
          <p className="mt-1 text-sm text-red-600">{errors.available_copies.message}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          Must be between 0 and {totalCopies} (total copies)
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Book' : 'Create Book'}
        </button>
      </div>
    </form>
  )
}

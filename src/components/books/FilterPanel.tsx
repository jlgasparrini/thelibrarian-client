import { GENRES, SORT_OPTIONS } from '@/lib/constants'
import { Filter } from 'lucide-react'

interface FilterPanelProps {
  genre: string
  available: boolean | undefined
  sort: string
  onGenreChange: (genre: string) => void
  onAvailableChange: (available: boolean | undefined) => void
  onSortChange: (sort: string) => void
  onClearFilters: () => void
}

export function FilterPanel({
  genre,
  available,
  sort,
  onGenreChange,
  onAvailableChange,
  onSortChange,
  onClearFilters,
}: FilterPanelProps) {
  const hasActiveFilters = genre !== '' || available !== undefined || sort !== 'title_asc'

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Genre filter */}
        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
            Genre
          </label>
          <select
            id="genre"
            value={genre}
            onChange={(e) => onGenreChange(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Genres</option>
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* Availability filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Availability
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                checked={available === undefined}
                onChange={() => onAvailableChange(undefined)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">All Books</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={available === true}
                onChange={() => onAvailableChange(true)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Available Only</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={available === false}
                onChange={() => onAvailableChange(false)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Unavailable Only</span>
            </label>
          </div>
        </div>

        {/* Sort */}
        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

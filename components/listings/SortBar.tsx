'use client'
import { useRouter, useSearchParams } from 'next/navigation'

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
]

interface SortBarProps {
  count: number
  total: number
}

export default function SortBar({ count, total }: SortBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get('sort') || 'popular'

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', value)
    router.push(`/listings?${params.toString()}`)
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-4 border-b border-gray-100 mb-6">
      <p className="text-sm text-ink/60">
        Showing <span className="font-semibold text-ink">{count}</span> of <span className="font-semibold text-ink">{total}</span> properties
      </p>
      <div className="flex items-center gap-2">
        <label className="text-sm text-ink/60 whitespace-nowrap">Sort by:</label>
        <select
          value={currentSort}
          onChange={e => handleSort(e.target.value)}
          className="text-sm font-medium text-ink bg-white border border-gray-200 rounded-btn px-3 py-1.5 outline-none focus:border-orange cursor-pointer"
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

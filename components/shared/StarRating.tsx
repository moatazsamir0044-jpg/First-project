import { Star } from 'lucide-react'
import { clsx } from 'clsx'

interface StarRatingProps {
  rating: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  className?: string
}

export default function StarRating({ rating, max = 5, size = 'md', showValue = false, className }: StarRatingProps) {
  const stars = Array.from({ length: max }, (_, i) => {
    const filled = i < Math.floor(rating)
    const partial = !filled && i < rating
    return { filled, partial }
  })

  const sizeClass = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size]

  return (
    <div className={clsx('flex items-center gap-0.5', className)}>
      {stars.map((star, i) => (
        <Star
          key={i}
          className={clsx(sizeClass, star.filled ? 'fill-orange text-orange' : 'fill-gray-200 text-gray-200')}
        />
      ))}
      {showValue && (
        <span className="ml-1 text-sm font-semibold text-ink">{rating.toFixed(1)}</span>
      )}
    </div>
  )
}

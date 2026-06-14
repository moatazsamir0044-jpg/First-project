import StarRating from '@/components/shared/StarRating'

interface Review {
  id: string
  authorName: string
  authorCountry: string
  rating: number
  comment: string
  source: string
  createdAt: Date | string
}

interface ReviewsSectionProps {
  reviews: Review[]
  rating: number
  reviewCount: number
}

export default function ReviewsSection({ reviews, rating, reviewCount }: ReviewsSectionProps) {
  const breakdown = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => Math.round(r.rating) === star).length,
    pct: reviews.length ? (reviews.filter(r => Math.round(r.rating) === star).length / reviews.length) * 100 : 0,
  }))

  return (
    <div>
      <h2 className="font-heading text-xl font-semibold text-ink mb-6">Guest Reviews</h2>

      {/* Overall */}
      <div className="flex flex-col md:flex-row gap-8 mb-8 p-6 bg-cream rounded-card">
        <div className="text-center shrink-0">
          <div className="font-heading text-5xl font-semibold text-ink mb-2">{rating.toFixed(1)}</div>
          <StarRating rating={rating} size="md" />
          <p className="text-sm text-ink/50 mt-1">{reviewCount} reviews</p>
        </div>
        <div className="flex-1 space-y-2">
          {breakdown.map(b => (
            <div key={b.star} className="flex items-center gap-3">
              <span className="text-xs font-medium text-ink w-3">{b.star}</span>
              <div className="flex-1 bg-white rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-orange rounded-full transition-all duration-500"
                  style={{ width: `${b.pct}%` }}
                />
              </div>
              <span className="text-xs text-ink/50 w-5">{b.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reviews.map(review => (
          <div key={review.id} className="bg-white border border-gray-100 rounded-card p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-orange/10 flex items-center justify-center text-orange font-semibold text-sm">
                  {review.authorName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm text-ink">{review.authorName}</p>
                  <p className="text-xs text-ink/40">{review.authorCountry}</p>
                </div>
              </div>
              <StarRating rating={review.rating} size="sm" />
            </div>
            <p className="text-sm text-ink/70 leading-relaxed">{review.comment}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-ink/30">
                {new Date(review.createdAt).toLocaleDateString('en-EG', { month: 'short', year: 'numeric' })}
              </span>
              {review.source !== 'BirdNest' && (
                <span className="text-xs text-ink/40">via {review.source}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

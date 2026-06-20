import { clsx } from 'clsx'

interface UrgencyBadgeProps {
  lastBooked?: Date | null
  viewCount?: number
  rating?: number
  className?: string
}

export default function UrgencyBadge({ lastBooked, viewCount, rating, className }: UrgencyBadgeProps) {
  let message = ''
  let variant: 'orange' | 'green' = 'orange'

  if (lastBooked) {
    const hoursAgo = Math.floor((Date.now() - new Date(lastBooked).getTime()) / (1000 * 60 * 60))
    if (hoursAgo < 1) {
      message = 'Just booked!'
    } else if (hoursAgo < 24) {
      message = `Booked ${hoursAgo}h ago`
    } else if (hoursAgo < 72) {
      message = 'Booked recently'
    }
  }

  if (!message && viewCount && viewCount > 20) {
    if (viewCount > 200) message = `${viewCount} views this week`
    else if (viewCount > 80) message = 'High demand'
    else message = 'Popular choice'
  }

  if (!message && rating && rating >= 4.8) {
    message = 'Top rated'
    variant = 'green'
  }

  if (!message) return null

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-pill text-xs font-semibold backdrop-blur-sm',
        variant === 'orange' ? 'bg-orange/90 text-white' : 'bg-[#237c58]/90 text-white',
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
      {message}
    </span>
  )
}

import { clsx } from 'clsx'

interface UrgencyBadgeProps {
  lastBooked?: Date | null
  viewCount?: number
  className?: string
}

export default function UrgencyBadge({ lastBooked, viewCount, className }: UrgencyBadgeProps) {
  if (!lastBooked && !viewCount) return null

  let message = ''

  if (lastBooked) {
    const hoursAgo = Math.floor((Date.now() - new Date(lastBooked).getTime()) / (1000 * 60 * 60))
    if (hoursAgo < 1) {
      message = 'Just booked!'
    } else if (hoursAgo < 24) {
      message = `Booked ${hoursAgo}h ago`
    } else if (hoursAgo < 48) {
      message = 'Booked yesterday'
    }
  }

  if (!message && viewCount && viewCount > 100) {
    message = `${viewCount} views today`
  }

  if (!message) return null

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-pill text-xs font-semibold bg-orange/10 text-orange',
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-orange animate-pulse" />
      {message}
    </span>
  )
}

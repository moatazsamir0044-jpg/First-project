import { clsx } from 'clsx'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'green' | 'orange' | 'red' | 'cream' | 'sky'
  className?: string
}

export default function Badge({ children, variant = 'cream', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-pill text-xs font-semibold',
        {
          'bg-green/10 text-green': variant === 'green',
          'bg-orange/10 text-orange': variant === 'orange',
          'bg-red-100 text-red-700': variant === 'red',
          'bg-cream text-ink': variant === 'cream',
          'bg-sky text-ink': variant === 'sky',
        },
        className
      )}
    >
      {children}
    </span>
  )
}

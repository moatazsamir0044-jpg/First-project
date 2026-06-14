import { clsx } from 'clsx'

interface RefundBadgeProps {
  policy: string
  className?: string
}

const POLICY_CONFIG = {
  flexible: {
    label: 'Free cancellation',
    color: 'bg-green/10 text-green',
    icon: '✓',
  },
  moderate: {
    label: 'Moderate refund',
    color: 'bg-orange/10 text-orange',
    icon: '~',
  },
  'non-refundable': {
    label: 'Non-refundable',
    color: 'bg-red-100 text-red-600',
    icon: '×',
  },
}

export default function RefundBadge({ policy, className }: RefundBadgeProps) {
  const config = POLICY_CONFIG[policy as keyof typeof POLICY_CONFIG] || POLICY_CONFIG.moderate

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-pill text-xs font-semibold',
        config.color,
        className
      )}
    >
      <span className="font-bold">{config.icon}</span>
      {config.label}
    </span>
  )
}

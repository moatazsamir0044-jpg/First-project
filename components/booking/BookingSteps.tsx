import { clsx } from 'clsx'
import { Check } from 'lucide-react'

const STEPS = [
  { number: 1, label: 'Review' },
  { number: 2, label: 'Details' },
  { number: 3, label: 'Eligibility' },
  { number: 4, label: 'Payment' },
]

interface BookingStepsProps {
  currentStep: number
}

export default function BookingSteps({ currentStep }: BookingStepsProps) {
  return (
    <nav aria-label="Booking steps" className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((step, i) => (
        <div key={step.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              aria-current={currentStep === step.number ? 'step' : undefined}
              className={clsx(
                'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 border-2',
                currentStep > step.number
                  ? 'bg-[var(--color-accent-secondary)] border-[var(--color-accent-secondary)] text-white'
                  : currentStep === step.number
                  ? 'bg-[var(--color-accent-primary)] border-[var(--color-accent-primary)] text-white shadow-md shadow-orange/30'
                  : 'bg-white border-gray-200 text-[var(--color-text)]/40'
              )}
            >
              {currentStep > step.number ? <Check className="w-4 h-4" /> : step.number}
            </div>
            <span
              className={clsx(
                'text-xs mt-1.5 font-medium tracking-wide',
                currentStep >= step.number
                  ? 'text-[var(--color-text)]'
                  : 'text-[var(--color-text)]/35'
              )}
            >
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={clsx(
                'w-10 md:w-16 h-0.5 mx-1.5 mb-4 rounded-full transition-all duration-300',
                currentStep > step.number
                  ? 'bg-[var(--color-accent-secondary)]'
                  : 'bg-gray-200'
              )}
            />
          )}
        </div>
      ))}
    </nav>
  )
}

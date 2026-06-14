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
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((step, i) => (
        <div key={step.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={clsx(
                'w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
                currentStep > step.number
                  ? 'bg-green text-white'
                  : currentStep === step.number
                  ? 'bg-orange text-white'
                  : 'bg-gray-200 text-gray-500'
              )}
            >
              {currentStep > step.number ? <Check className="w-4 h-4" /> : step.number}
            </div>
            <span
              className={clsx(
                'text-xs mt-1 font-medium',
                currentStep >= step.number ? 'text-ink' : 'text-ink/40'
              )}
            >
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={clsx(
                'w-12 md:w-20 h-0.5 mx-2 mb-4 transition-colors',
                currentStep > step.number ? 'bg-green' : 'bg-gray-200'
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}

import { clsx } from 'clsx'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'green'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth = false, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-btn disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-orange text-white hover:bg-orange-dk active:scale-95': variant === 'primary',
            'bg-cream text-ink hover:bg-gray-200 active:scale-95': variant === 'secondary',
            'border-2 border-orange text-orange hover:bg-orange hover:text-white active:scale-95': variant === 'outline',
            'text-ink hover:bg-gray-100 active:scale-95': variant === 'ghost',
            'bg-green text-white hover:bg-green-dk active:scale-95': variant === 'green',
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-5 py-2.5 text-base': size === 'md',
            'px-7 py-3.5 text-lg': size === 'lg',
            'w-full': fullWidth,
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button

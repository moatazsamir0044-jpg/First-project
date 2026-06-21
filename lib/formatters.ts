export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-EG', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function generateBookingRef(): string {
  // Cryptographically secure, non-guessable reference (avoids Math.random enumeration)
  const bytes = crypto.getRandomValues(new Uint8Array(6))
  const ref = Array.from(bytes)
    .map((b) => (b % 36).toString(36))
    .join('')
    .slice(0, 8)
    .toUpperCase()
  return 'BN-' + ref
}

export function calculateNights(checkIn: Date, checkOut: Date): number {
  return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
}

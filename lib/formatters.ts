export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-EG', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function generateBookingRef(): string {
  return 'BN-' + Math.random().toString(36).substring(2, 8).toUpperCase()
}

export function calculateNights(checkIn: Date, checkOut: Date): number {
  return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
}

export const CANCELLATION_POLICY = {
  flexible: {
    label: 'Flexible',
    color: 'green' as const,
    description: 'Full refund if cancelled within 48 hours of booking (check-in at least 14 days away). 50% refund if cancelled 7+ days before check-in. No refund within 7 days of check-in.',
    rules: [
      'Full refund: Cancel within 48 hours of booking, with check-in at least 14 days away',
      '50% refund: Cancel at least 7 days before check-in',
      'No refund: Cancellations within 7 days of check-in',
    ],
  },
  moderate: {
    label: 'Moderate',
    color: 'orange' as const,
    description: '50% refund if cancelled at least 7 days before check-in. No refund within 7 days of check-in.',
    rules: [
      '50% refund: Cancel at least 7 days before check-in',
      'No refund: Cancellations within 7 days of check-in',
    ],
  },
  'non-refundable': {
    label: 'Non-Refundable',
    color: 'red' as const,
    description: 'No refunds available for this property. Please ensure your dates are confirmed before booking.',
    rules: ['No refund on cancellation'],
  },
}

export const ELIGIBILITY_POLICY = {
  arabNational: `As an Arab national, Egyptian law requires an official marriage certificate if you are staying as a couple. Unofficial documents (Orfi) are not accepted. Please ensure you have the official documentation at check-in.`,
  nonArab: `As a non-Arab national, you are welcome without requiring a marriage certificate. We look forward to hosting you!`,
  general: `Following Egyptian law: Arab nationals and Egyptians must provide an official marriage certificate if staying as a couple. Non-Arab passport holders are welcomed without this requirement. "Orfi" or unofficial documents are not accepted.`,
}

export const VISITS_POLICY = `For Arab guests, visitors are only allowed if of the same gender, or if mixed, they must be relatives of the 1st or 2nd degree. Otherwise, guests should meet in public areas.`

export const PETS_POLICY = `Pet policy depends on each individual property. Please check the specific listing for pet information before booking.`

export const CONTACT_INFO = {
  address: 'District 5, New Cairo, Egypt',
  email: 'info@birdnestlife.com',
  phone: '01000005030',
  whatsapp: '+201000005030',
  whatsappUrl: 'https://wa.me/201000005030',
}

export const ARAB_COUNTRIES = [
  'Egypt', 'Saudi Arabia', 'United Arab Emirates', 'Kuwait', 'Qatar',
  'Bahrain', 'Oman', 'Jordan', 'Lebanon', 'Syria', 'Iraq', 'Palestine',
  'Yemen', 'Libya', 'Tunisia', 'Algeria', 'Morocco', 'Sudan',
  'Mauritania', 'Comoros', 'Djibouti', 'Somalia',
]

export function isArabNational(nationality: string): boolean {
  return ARAB_COUNTRIES.some(c => c.toLowerCase() === nationality.toLowerCase())
}

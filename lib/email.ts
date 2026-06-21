import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'BirdNest <noreply@birdnestlife.com>'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'hello@birdnestlife.com'

export async function sendBookingConfirmation(booking: {
  reference: string
  guestName: string
  guestEmail: string
  listingTitle: string
  checkIn: Date
  checkOut: Date
  guests: number
  totalPrice: number
  cleaningFee: number
  nights: number
  pricePerNight: number
}) {
  const formatDate = (d: Date) =>
    new Date(d).toLocaleDateString('en-EG', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
  const formatPrice = (n: number) =>
    new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(n)

  if (!process.env.RESEND_API_KEY) return

  await resend.emails.send({
    from: FROM,
    to: booking.guestEmail,
    subject: `Booking Confirmed — ${booking.reference} | BirdNest`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a2e;">
        <div style="background: #1a1a2e; padding: 32px; text-align: center;">
          <h1 style="color: #d4af37; margin: 0; font-size: 28px;">BirdNest</h1>
          <p style="color: #fff; margin: 8px 0 0; opacity: 0.8;">Your nest is confirmed</p>
        </div>
        <div style="padding: 32px; background: #fff;">
          <h2 style="margin-top: 0;">Hi ${booking.guestName},</h2>
          <p>Your booking is confirmed! Here are your details:</p>
          <div style="background: #f8f8f8; border-radius: 8px; padding: 24px; margin: 24px 0;">
            <h3 style="margin-top: 0; color: #1a1a2e;">${booking.listingTitle}</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #666;">Booking Reference</td><td style="padding: 8px 0; font-weight: bold;">${booking.reference}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;">Check-in</td><td style="padding: 8px 0;">${formatDate(booking.checkIn)}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;">Check-out</td><td style="padding: 8px 0;">${formatDate(booking.checkOut)}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;">Guests</td><td style="padding: 8px 0;">${booking.guests}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;">${booking.nights} nights × ${formatPrice(booking.pricePerNight)}</td><td style="padding: 8px 0;">${formatPrice(booking.nights * booking.pricePerNight)}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;">Cleaning fee</td><td style="padding: 8px 0;">${formatPrice(booking.cleaningFee)}</td></tr>
              <tr style="border-top: 2px solid #1a1a2e;"><td style="padding: 12px 0; font-weight: bold;">Total</td><td style="padding: 12px 0; font-weight: bold; color: #1a1a2e;">${formatPrice(booking.totalPrice)}</td></tr>
            </table>
          </div>
          <p style="color: #666;">Need help? Reply to this email or contact us via WhatsApp.</p>
          <p style="margin-bottom: 0; color: #666;">Enjoy your nest! 🐦</p>
        </div>
        <div style="background: #f8f8f8; padding: 16px; text-align: center; color: #999; font-size: 12px;">
          © ${new Date().getFullYear()} BirdNest. All rights reserved.
        </div>
      </div>
    `,
  })
}

export async function sendBookingNotificationToAdmin(booking: {
  reference: string
  guestName: string
  guestEmail: string
  guestPhone: string
  listingTitle: string
  checkIn: Date
  checkOut: Date
  guests: number
  totalPrice: number
  nationality: string
}) {
  if (!process.env.RESEND_API_KEY) return

  const formatDate = (d: Date) =>
    new Date(d).toLocaleDateString('en-EG', { day: 'numeric', month: 'short', year: 'numeric' })
  const formatPrice = (n: number) =>
    new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(n)

  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `New Booking ${booking.reference} — ${booking.listingTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Booking Received</h2>
        <p><strong>Reference:</strong> ${booking.reference}</p>
        <p><strong>Property:</strong> ${booking.listingTitle}</p>
        <p><strong>Guest:</strong> ${booking.guestName} (${booking.nationality})</p>
        <p><strong>Email:</strong> ${booking.guestEmail}</p>
        <p><strong>Phone:</strong> ${booking.guestPhone}</p>
        <p><strong>Dates:</strong> ${formatDate(booking.checkIn)} – ${formatDate(booking.checkOut)}</p>
        <p><strong>Guests:</strong> ${booking.guests}</p>
        <p><strong>Total:</strong> ${formatPrice(booking.totalPrice)}</p>
      </div>
    `,
  })
}

export async function sendContactNotification(data: {
  name: string
  email: string
  enquiryType: string
  message: string
}) {
  if (!process.env.RESEND_API_KEY) return

  await Promise.all([
    resend.emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      subject: `New Contact — ${data.enquiryType} from ${data.name}`,
      html: `
        <div style="font-family: sans-serif;">
          <h2>New Contact Submission</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Type:</strong> ${data.enquiryType}</p>
          <p><strong>Message:</strong></p>
          <p style="background: #f8f8f8; padding: 16px; border-radius: 4px;">${data.message.replace(/\n/g, '<br>')}</p>
        </div>
      `,
    }),
    resend.emails.send({
      from: FROM,
      to: data.email,
      subject: `We got your message — BirdNest`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1a1a2e; padding: 32px; text-align: center;">
            <h1 style="color: #d4af37; margin: 0;">BirdNest</h1>
          </div>
          <div style="padding: 32px;">
            <h2>Thanks, ${data.name}!</h2>
            <p>We've received your message and will get back to you within 2 hours.</p>
            <p>In the meantime, feel free to browse our listings or contact us on WhatsApp for an immediate response.</p>
          </div>
        </div>
      `,
    }),
  ])
}

export async function sendBookingCancellation(booking: {
  reference: string
  guestName: string
  guestEmail: string
  listingTitle: string
  refundAmount?: number
}) {
  if (!process.env.RESEND_API_KEY) return

  const formatPrice = (n: number) =>
    new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(n)

  await resend.emails.send({
    from: FROM,
    to: booking.guestEmail,
    subject: `Booking Cancelled — ${booking.reference} | BirdNest`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1a1a2e; padding: 32px; text-align: center;">
          <h1 style="color: #d4af37; margin: 0;">BirdNest</h1>
        </div>
        <div style="padding: 32px;">
          <h2>Booking Cancelled</h2>
          <p>Hi ${booking.guestName},</p>
          <p>Your booking <strong>${booking.reference}</strong> for ${booking.listingTitle} has been cancelled.</p>
          ${booking.refundAmount ? `<p>A refund of <strong>${formatPrice(booking.refundAmount)}</strong> has been initiated and will appear in 5–10 business days.</p>` : ''}
          <p>We hope to see you again soon. Feel free to browse other properties on BirdNest.</p>
        </div>
      </div>
    `,
  })
}

// Transactional email via Resend. No-ops safely when RESEND_API_KEY is unset,
// so the booking flow never breaks in demo mode.

import { Resend } from 'resend'
import { isEmailConfigured, fromEmail, adminEmail } from './env'
import { formatPrice, formatDate } from './formatters'

const resend = isEmailConfigured() ? new Resend(process.env.RESEND_API_KEY!) : null

export type BookingEmailData = {
  reference: string
  guestName: string
  guestEmail: string
  listingTitle: string
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
}

export async function sendBookingConfirmation(data: BookingEmailData): Promise<void> {
  if (!resend) {
    console.log('[email:demo] would send booking confirmation', data.reference)
    return
  }

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
      <h2 style="color:#c2410c">Your BirdNest booking is confirmed 🪺</h2>
      <p>Hi ${escapeHtml(data.guestName)},</p>
      <p>Thank you for booking with BirdNest. Here are your details:</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <tr><td style="padding:6px 0"><strong>Reference</strong></td><td>${data.reference}</td></tr>
        <tr><td style="padding:6px 0"><strong>Property</strong></td><td>${escapeHtml(data.listingTitle)}</td></tr>
        <tr><td style="padding:6px 0"><strong>Check-in</strong></td><td>${formatDate(data.checkIn)}</td></tr>
        <tr><td style="padding:6px 0"><strong>Check-out</strong></td><td>${formatDate(data.checkOut)}</td></tr>
        <tr><td style="padding:6px 0"><strong>Guests</strong></td><td>${data.guests}</td></tr>
        <tr><td style="padding:6px 0"><strong>Total</strong></td><td>${formatPrice(data.totalPrice)}</td></tr>
      </table>
      <p>Our team will contact you within 2 hours with check-in details.</p>
      <p style="color:#888;font-size:13px">BirdNest — Furnished stays in Egypt</p>
    </div>`

  try {
    await resend.emails.send({
      from: fromEmail(),
      to: data.guestEmail,
      subject: `Booking confirmed — ${data.reference}`,
      html,
    })
    // Notify the team
    await resend.emails.send({
      from: fromEmail(),
      to: adminEmail(),
      subject: `New booking: ${data.reference} — ${data.listingTitle}`,
      html: `<p>New booking <strong>${data.reference}</strong> from ${escapeHtml(
        data.guestName
      )} (${escapeHtml(data.guestEmail)}) for ${escapeHtml(data.listingTitle)}, ${formatDate(
        data.checkIn
      )} → ${formatDate(data.checkOut)}, ${data.guests} guest(s), ${formatPrice(data.totalPrice)}.</p>`,
    })
  } catch (err) {
    // Never let email failure break a confirmed booking — log for follow-up.
    console.error('[email] send failed for', data.reference, err)
  }
}

export async function sendContactNotification(data: {
  name: string
  email: string
  enquiryType: string
  message: string
}): Promise<void> {
  if (!resend) {
    console.log('[email:demo] would send contact notification from', data.email)
    return
  }
  try {
    await resend.emails.send({
      from: fromEmail(),
      to: adminEmail(),
      replyTo: data.email,
      subject: `Contact form: ${data.enquiryType} — ${data.name}`,
      html: `<p><strong>${escapeHtml(data.name)}</strong> (${escapeHtml(
        data.email
      )})</p><p>Type: ${escapeHtml(data.enquiryType)}</p><p>${escapeHtml(data.message)}</p>`,
    })
  } catch (err) {
    console.error('[email] contact notification failed', err)
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

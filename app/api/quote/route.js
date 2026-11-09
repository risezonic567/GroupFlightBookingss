import { NextResponse } from 'next/server'
import { isRateLimited, recordSubmission } from '@/lib/rateLimit'
import { lookupLocation } from '@/lib/geo'
import { getTransporter } from '@/lib/mailer'
import { generateEmail } from '@/lib/emailTemplate'
import { emailDomainOk, isDisposableEmail, validateEmail, validatePhone } from '@/lib/validators'

export const runtime = 'nodejs'

async function validatePayload(payload) {
  const errors = []
  const trimAndCap = (value) => {
    if (typeof value !== 'string') return ''
    return value.trim().slice(0, 120).replace(/[\r\n]/g, '')
  }
  const sanitized = {}
  const fields = [
    'tripType',
    'origin',
    'destination',
    'departure',
    'returnDate',
    'passengers',
    'cabin',
    'occasion',
    'countryCode',
    'website',
  ]
  for (const f of fields) sanitized[f] = trimAndCap(payload[f] ?? '')

  const { tripType, passengers } = sanitized
  const email = typeof payload.email === 'string' ? payload.email : ''
  const phone = typeof payload.phone === 'string' ? payload.phone.trim().slice(0, 120) : ''
  sanitized.email = email
  sanitized.phone = phone

  const required = ['tripType', 'origin', 'destination', 'departure', 'passengers', 'cabin', 'email', 'phone']
  for (const r of required) {
    if (!sanitized[r]) errors.push(r)
  }

  if (tripType === 'Round Trip' && !sanitized.returnDate) errors.push('returnDate')
  if (!['Round Trip', 'One Way'].includes(tripType)) errors.push('tripType')

  const pax = Number(passengers)
  if (!Number.isInteger(pax) || pax < 1 || pax > 999) errors.push('passengers')

  if (!validateEmail(email) || isDisposableEmail(email) || !(await emailDomainOk(email))) {
    errors.push('email')
  } else {
    sanitized.email = email.toLowerCase()
  }

  const validatedPhone = validatePhone(sanitized.countryCode, phone)
  if (!validatedPhone.valid) errors.push('phone')
  sanitized.phoneE164 = validatedPhone.e164

  return { sanitized, errors: [...new Set(errors)] }
}

export async function POST(request) {
  try {
    const body = await request.json()
    if (body.website && String(body.website).trim() !== '') {
      return NextResponse.json({ success: true })
    }

    const { sanitized, errors } = await validatePayload(body)
    if (errors.length) {
      return NextResponse.json(
        { success: false, error: 'Please check the form and try again.', fields: errors },
        { status: 400 },
      )
    }

    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    let ip = 'unknown'
    if (forwarded) ip = forwarded.split(',')[0].trim()
    else if (realIp) ip = realIp.trim()

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: 'We have already received your requests. Our team will contact you shortly.' },
        { status: 429 },
      )
    }

    const originHeader = request.headers.get('origin') || request.headers.get('host')
    let hostname = ''
    if (originHeader) {
      try {
        const url = new URL(originHeader.startsWith('http') ? originHeader : `https://${originHeader}`)
        hostname = url.hostname
      } catch {
        hostname = originHeader
      }
    }
    if (!hostname) hostname = process.env.SITE_DOMAIN || 'groupflightbookings.com'
    const brandName = process.env.SITE_NAME || 'Group Flight Bookings'

    const location = await lookupLocation(ip)

    let transporter
    try {
      transporter = getTransporter()
    } catch (e) {
      console.error('SMTP configuration error:', e)
      return NextResponse.json(
        { success: false, error: 'Server configuration error. Please try again later.' },
        { status: 500 },
      )
    }

    const { html, text } = generateEmail({ ...sanitized }, hostname, location, ip)
    await transporter.sendMail({
      from: `"${brandName}" <${process.env.SMTP_USER}>`,
      to: process.env.QUOTE_RECEIVER_EMAIL,
      replyTo: sanitized.email,
      subject: `New Group Quote: ${sanitized.origin} → ${sanitized.destination} (${sanitized.tripType}) | ${hostname}`,
      text,
      html,
    })

    recordSubmission(ip)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Quote API error:', err)
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 },
    )
  }
}

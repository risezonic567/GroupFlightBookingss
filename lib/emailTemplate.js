function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function generateEmail(data, hostname, location, ip) {
  const {
    tripType,
    origin,
    destination,
    departure,
    returnDate,
    passengers,
    cabin,
    occasion,
    email,
    countryCode,
    phone,
    phoneE164,
  } = data

  const esc = escapeHtml
  const rowEsc = (label, value) => `
    <tr>
      <td style="padding: 6px 8px; font-weight: bold; vertical-align: top;">${esc(label)}</td>
      <td style="padding: 6px 8px; vertical-align: top;">${esc(value)}</td>
    </tr>`
  const rowHtml = (label, htmlValue) => `
    <tr>
      <td style="padding: 6px 8px; font-weight: bold; vertical-align: top;">${esc(label)}</td>
      <td style="padding: 6px 8px; vertical-align: top;">${htmlValue}</td>
    </tr>`

  let detailsRows = ''
  detailsRows += rowEsc('Trip Type', tripType)
  detailsRows += rowEsc('Flying From', origin)
  detailsRows += rowEsc('Flying To', destination)
  detailsRows += rowEsc('Departure', departure)
  if (tripType === 'Round Trip') detailsRows += rowEsc('Return Date', returnDate)
  detailsRows += rowEsc('Passengers', passengers)
  detailsRows += rowEsc('Class', cabin)
  if (occasion) detailsRows += rowEsc('Occasion', occasion)

  const safeEmail = esc(email)
  const emailLink = `<a href="mailto:${safeEmail}">${safeEmail}</a>`
  const displayPhone = `${countryCode} ${phone}`.trim()
  const phoneLink = `<a href="tel:${esc(phoneE164)}">${esc(displayPhone)}</a>`

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; color: #333;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0b1522; color:#fff;">
        <tr><td style="padding:20px; text-align:center;">
          <h1 style="margin:0; font-size:24px;">New Group Quote Request</h1>
          <div style="font-size:14px; color:#9bb3cf;">${esc(hostname)}</div>
        </td></tr>
      </table>
      <div style="padding:20px; max-width:600px; margin:auto;">
        <div style="margin-bottom:12px;">
          <span style="background:#e6edf6; color:#152233; padding:4px 8px; border-radius:4px; font-size:12px;">${esc(tripType)}</span>
        </div>
        <h2 style="font-size:20px; margin:0 0 12px;">${esc(origin)} → ${esc(destination)}</h2>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; border:1px solid #e5e7eb;">
          ${detailsRows}
        </table>
        <h3 style="margin-top:20px; margin-bottom:8px; font-size:16px;">Customer Details</h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; border:1px solid #e5e7eb;">
          ${rowHtml('Email', emailLink)}
          ${rowHtml('Phone', phoneLink)}
        </table>
        <h3 style="margin-top:20px; margin-bottom:8px; font-size:16px;">Request Info</h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; border:1px solid #e5e7eb;">
          ${rowEsc('Website', hostname)}
          ${rowEsc('Submitted at (UTC)', new Date().toISOString())}
          ${rowEsc('IP Address', ip)}
          ${rowEsc('Approx. location', location)}
        </table>
      </div>
    </div>`

  const text = `New Group Quote Request

Trip Type: ${tripType}
Flying From: ${origin}
Flying To: ${destination}
Departure: ${departure}
${tripType === 'Round Trip' ? `Return Date: ${returnDate}\n` : ''}Passengers: ${passengers}
Class: ${cabin}
${occasion ? `Occasion: ${occasion}\n` : ''}
Customer Details:
Email: ${email}
Phone: ${countryCode} ${phone}

Website: ${hostname}
IP: ${ip}
Location: ${location}`

  return { html, text }
}

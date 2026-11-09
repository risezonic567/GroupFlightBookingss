import nodemailer from 'nodemailer'

let transporter = null

function validateConfig() {
  const required = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_SECURE', 'SMTP_USER', 'SMTP_PASS']
  const missing = required.filter((key) => !process.env[key])
  if (missing.length) {
    throw new Error(`Missing SMTP configuration env vars: ${missing.join(', ')}`)
  }
}

export function getTransporter() {
  if (transporter) return transporter
  validateConfig()

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_SECURE === '1',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  return transporter
}

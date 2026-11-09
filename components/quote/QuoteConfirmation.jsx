'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { QUOTE_STORAGE_KEY } from '@/lib/quoteStorage'

export default function QuoteConfirmation() {
  const router = useRouter()
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(QUOTE_STORAGE_KEY)
      setDetails(stored ? JSON.parse(stored) : null)
    } catch {
      setDetails(null)
    } finally {
      setLoading(false)
    }
  }, [])

  if (loading) return null

  if (!details) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
        <div className="max-w-md rounded-[28px] border border-ink-100 bg-white p-8 text-center shadow-xl">
          <h1 className="font-display text-2xl font-bold text-ink-900">No quote data found</h1>
          <p className="mt-3 text-sm text-ink-500">Start a new group quote from the homepage.</p>
          <Link href="/" className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-bold text-white">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </div>
      </div>
    )
  }

  const travelerLabel = details.adults
    ? `${details.passengers} total (A${details.adults || 0} · C${details.children || 0} · I${Number(details.infantsInSeat || 0) + Number(details.infantsOnLap || 0)})`
    : details.passengers

  const rows = [
    ['Trip type', details.tripType],
    ['From', details.origin],
    ['To', details.destination],
    ['Departure', details.departure],
    ...(details.tripType === 'Round Trip' ? [['Return', details.returnDate]] : []),
    ['Travelers', travelerLabel],
    ['Cabin', details.cabin],
    ...(details.occasion ? [['Occasion', details.occasion]] : []),
    ['Email', details.email],
    ['Phone', `${details.countryCode} ${details.phone}`],
  ]

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="rounded-[32px] border border-ink-100 bg-white p-8 shadow-[0_30px_80px_-40px_rgba(11,21,34,0.45)]">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-1 h-8 w-8 text-skyline-600" />
          <div>
            <h1 className="font-display text-3xl font-bold text-ink-900">Quote request received</h1>
            <p className="mt-2 text-sm leading-6 text-ink-500">
              Our group desk will review your route and traveler count, then follow up on the contact details below.
            </p>
          </div>
        </div>

        <dl className="mt-8 divide-y divide-ink-100 rounded-2xl border border-ink-100">
          {rows.map(([label, value]) => (
            <div key={label} className="grid grid-cols-[140px_1fr] gap-3 px-4 py-3 text-sm">
              <dt className="font-semibold text-ink-500">{label}</dt>
              <dd className="font-medium text-ink-900">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem(QUOTE_STORAGE_KEY)
              router.push('/')
            }}
            className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-bold text-white"
          >
            <ArrowLeft className="h-4 w-4" /> New quote
          </button>
          <Link href="/occasions" className="inline-flex items-center rounded-full border border-ink-200 px-5 py-2.5 text-sm font-bold text-ink-800 hover:bg-ink-50">
            Browse occasions
          </Link>
        </div>
      </div>
    </div>
  )
}

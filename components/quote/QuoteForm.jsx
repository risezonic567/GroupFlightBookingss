'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ArrowLeftRight,
  ArrowRight,
  Check,
  ChevronDown,
  Minus,
  Plus,
  Users,
} from 'lucide-react'
import { QUOTE_STORAGE_KEY } from '@/lib/quoteStorage'
import { isDisposableEmail, sanitizePhoneInput, validateEmail, validatePhone } from '@/lib/validationRules'
import { occasions } from '@/data/occasions'
import AirportInput from './AirportInput'
import FlightDatePicker from './FlightDatePicker'

const CABINS = ['Economy', 'Premium Economy', 'Business', 'First Class']
const menuBtn =
  'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-ink-700 transition hover:bg-white'

function todayLocalISO() {
  const n = new Date()
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`
}

function useMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const onDoc = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])
  return { open, setOpen, ref }
}

export default function QuoteForm(props) {
  return (
    <Suspense fallback={null}>
      <QuoteFormInner {...props} />
    </Suspense>
  )
}

function QuoteFormInner({ compact = false, defaultOccasion = '' }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tripType, setTripType] = useState('round')
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [departure, setDeparture] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [pax, setPax] = useState({ adults: 1, children: 0, infantsInSeat: 0, infantsOnLap: 0 })
  const [draftPax, setDraftPax] = useState({ adults: 1, children: 0, infantsInSeat: 0, infantsOnLap: 0 })
  const [paxOpen, setPaxOpen] = useState(false)
  const paxWrapRef = useRef(null)
  const paxSnapshotRef = useRef(pax)
  const [cabin, setCabin] = useState('Economy')
  const [occasion, setOccasion] = useState(defaultOccasion || '')
  const [email, setEmail] = useState('')
  const [countryCode, setCountryCode] = useState('+1')
  const [phone, setPhone] = useState('')
  const [website, setWebsite] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  const tripMenu = useMenu()
  const cabinMenu = useMenu()
  const occasionMenu = useMenu()

  useEffect(() => {
    if (defaultOccasion) setOccasion(defaultOccasion)
  }, [defaultOccasion])

  useEffect(() => {
    const raw = searchParams.get('occasion')
    if (!raw) return
    if (raw.toLowerCase() === 'other') {
      setOccasion('Other')
      return
    }
    const match = occasions.find(
      (o) => o.slug === raw || o.title.toLowerCase() === raw.toLowerCase(),
    )
    if (match) setOccasion(match.title)
  }, [searchParams])

  const passengers =
    (Number(pax.adults) || 0) +
    (Number(pax.children) || 0) +
    (Number(pax.infantsInSeat) || 0) +
    (Number(pax.infantsOnLap) || 0)

  function totalDraft(next) {
    return (Number(next.adults) || 0) + (Number(next.children) || 0) + (Number(next.infantsInSeat) || 0) + (Number(next.infantsOnLap) || 0)
  }

  // Live total: draft while open, committed pax when closed
  const travelerCount = paxOpen ? totalDraft(draftPax) : passengers

  function bump(key, delta, min = 0) {
    setDraftPax((prev) => {
      let next = { ...prev, [key]: Math.max(min, (prev[key] || 0) + delta) }
      if (totalDraft(next) > 999) return prev
      if (key === 'adults' && next.infantsOnLap > next.adults) {
        next = { ...next, infantsOnLap: next.adults }
      }
      return next
    })
  }

  function openPaxMenu() {
    paxSnapshotRef.current = pax
    setDraftPax(pax)
    setPaxOpen(true)
  }

  function commitPaxAndClose() {
    setPax(draftPax)
    setPaxOpen(false)
  }

  function cancelPaxAndClose() {
    setDraftPax(paxSnapshotRef.current)
    setPax(paxSnapshotRef.current)
    setPaxOpen(false)
  }

  // Outside click / toggle: keep selected values (commit), Cancel alone reverts
  useEffect(() => {
    if (!paxOpen) return undefined
    function onDoc(e) {
      if (paxWrapRef.current && !paxWrapRef.current.contains(e.target)) {
        setPax(draftPax)
        setPaxOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [paxOpen, draftPax])

  function getEmailError(value) {
    return !validateEmail(value) || isDisposableEmail(value) ? 'Enter a valid email address.' : ''
  }

  function getPhoneError(code, value) {
    return validatePhone(code, value).valid ? '' : 'Enter a valid phone number for the selected country.'
  }

  function swapAirports() {
    setOrigin(destination)
    setDestination(origin)
  }

  async function submitQuote(event) {
    event.preventDefault()
    if (loading) return

    if (!origin.trim() || !destination.trim() || !departure || passengers < 1 || !cabin) {
      setError('Please complete from, to, dates, and travelers.')
      return
    }
    if ((pax.adults || 0) < 1) {
      setError('At least 1 adult is required.')
      return
    }
    if (tripType === 'round' && !returnDate) {
      setError('Select a return date for round trip.')
      return
    }

    const nextFieldErrors = {
      email: getEmailError(email),
      phone: getPhoneError(countryCode, phone),
    }
    if (nextFieldErrors.email || nextFieldErrors.phone) {
      setFieldErrors(Object.fromEntries(Object.entries(nextFieldErrors).filter(([, m]) => m)))
      setError(null)
      return
    }

    setFieldErrors({})
    setError(null)
    setLoading(true)

    const tripTypeLabel = tripType === 'round' ? 'Round Trip' : 'One Way'
    const payload = {
      tripType: tripTypeLabel,
      origin: origin.trim(),
      destination: destination.trim(),
      departure,
      returnDate: tripType === 'round' ? returnDate : '',
      passengers: String(passengers),
      adults: String(pax.adults),
      children: String(pax.children),
      infantsInSeat: String(pax.infantsInSeat),
      infantsOnLap: String(pax.infantsOnLap),
      cabin,
      occasion,
      email: email.trim().toLowerCase(),
      countryCode,
      phone,
      website,
    }

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (response.ok && data.success) {
        try {
          sessionStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(payload))
        } catch {}
        router.push('/quote-confirmation')
      } else {
        const fields = Array.isArray(data.fields) ? data.fields : []
        const returned = {}
        if (fields.includes('email')) returned.email = 'Enter a valid email address.'
        if (fields.includes('phone')) returned.phone = 'Enter a valid phone number for the selected country.'
        setFieldErrors(returned)
        setError(
          fields.some((f) => f !== 'email' && f !== 'phone') || !fields.length
            ? data.error || 'Something went wrong. Please try again.'
            : null,
        )
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={`relative w-full overflow-visible rounded-[28px] border border-white/60 bg-white/95 p-4 shadow-[0_30px_80px_-20px_rgba(11,21,34,0.45)] backdrop-blur-xl sm:p-5 lg:p-6 ${
        compact ? 'max-w-5xl' : 'max-w-6xl'
      }`}
    >
      <div className="pointer-events-none absolute -left-8 -top-8 h-28 w-28 rounded-full bg-skyline-500/15 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -right-6 h-32 w-32 rounded-full bg-ember-500/15 blur-2xl" />

      <form className="relative space-y-4" onSubmit={submitQuote} noValidate>
        <div className="flex flex-wrap items-center gap-1">
          <div className="relative" ref={tripMenu.ref}>
            <button
              type="button"
              className={`${menuBtn} ${tripMenu.open ? 'bg-white ring-1 ring-skyline-500/30' : ''}`}
              onClick={() => tripMenu.setOpen((v) => !v)}
            >
              <ArrowLeftRight className="h-3.5 w-3.5 text-ink-400" />
              {tripType === 'round' ? 'Round trip' : 'One way'}
              <ChevronDown className="h-3.5 w-3.5 text-ink-400" />
            </button>
            {tripMenu.open && (
              <ul className="absolute left-0 z-40 mt-1 min-w-[160px] overflow-hidden rounded-2xl border border-ink-200 bg-white py-1 shadow-xl">
                {[
                  { value: 'round', label: 'Round trip' },
                  { value: 'oneway', label: 'One way' },
                ].map((opt) => (
                  <li key={opt.value}>
                    <button
                      type="button"
                      className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-ink-50 ${
                        tripType === opt.value ? 'bg-skyline-500/10 font-semibold text-skyline-700' : 'text-ink-700'
                      }`}
                      onClick={() => {
                        setTripType(opt.value)
                        if (opt.value === 'oneway') setReturnDate('')
                        tripMenu.setOpen(false)
                      }}
                    >
                      <span className="w-4">{tripType === opt.value && <Check className="h-3.5 w-3.5" />}</span>
                      {opt.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="relative" ref={paxWrapRef}>
            <button
              type="button"
              className={`${menuBtn} ${paxOpen ? 'bg-white ring-1 ring-skyline-500/30' : ''}`}
              onClick={() => {
                if (paxOpen) commitPaxAndClose()
                else openPaxMenu()
              }}
            >
              <Users className="h-3.5 w-3.5 text-ink-400" />
              {travelerCount}
              <ChevronDown className="h-3.5 w-3.5 text-ink-400" />
            </button>
            {paxOpen && (
              <div className="absolute left-0 z-40 mt-1 w-[min(300px,calc(100vw-2rem))] rounded-2xl border border-ink-200 bg-white p-3 shadow-xl">
                {[
                  { key: 'adults', label: 'Adults', sub: '', min: 1 },
                  { key: 'children', label: 'Children', sub: 'Aged 2–11', min: 0 },
                  { key: 'infantsInSeat', label: 'Infants', sub: 'In seat', min: 0 },
                  { key: 'infantsOnLap', label: 'Infants', sub: 'On lap', min: 0 },
                ].map((row) => (
                  <div key={row.key} className="flex items-center justify-between gap-3 py-2">
                    <div>
                      <p className="text-sm font-medium text-ink-800">{row.label}</p>
                      {row.sub ? <p className="text-[11px] text-ink-400">{row.sub}</p> : null}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink-200 text-ink-600 disabled:opacity-30"
                        disabled={draftPax[row.key] <= row.min}
                        onClick={() => bump(row.key, -1, row.min)}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-5 text-center text-sm font-semibold tabular-nums">{draftPax[row.key]}</span>
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink-200 text-ink-600"
                        onClick={() => bump(row.key, 1, row.min)}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                <p className="mt-1 text-[11px] text-ink-400">Most airlines treat 10+ as a group request.</p>
                <div className="mt-2 flex justify-end gap-3 border-t border-ink-100 pt-2">
                  <button type="button" className="text-sm font-medium text-ink-500" onClick={cancelPaxAndClose}>
                    Cancel
                  </button>
                  <button type="button" className="text-sm font-bold text-skyline-600" onClick={commitPaxAndClose}>
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={cabinMenu.ref}>
            <button
              type="button"
              className={`${menuBtn} ${cabinMenu.open ? 'bg-white ring-1 ring-skyline-500/30' : ''}`}
              onClick={() => cabinMenu.setOpen((v) => !v)}
            >
              {cabin}
              <ChevronDown className="h-3.5 w-3.5 text-ink-400" />
            </button>
            {cabinMenu.open && (
              <ul className="absolute left-0 z-40 mt-1 min-w-[180px] overflow-hidden rounded-2xl border border-ink-200 bg-white py-1 shadow-xl">
                {CABINS.map((c) => (
                  <li key={c}>
                    <button
                      type="button"
                      className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-ink-50 ${
                        cabin === c ? 'bg-skyline-500/10 font-semibold text-skyline-700' : 'text-ink-700'
                      }`}
                      onClick={() => {
                        setCabin(c)
                        cabinMenu.setOpen(false)
                      }}
                    >
                      <span className="w-4">{cabin === c && <Check className="h-3.5 w-3.5" />}</span>
                      {c}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="relative" ref={occasionMenu.ref}>
            <button
              type="button"
              className={`${menuBtn} ${occasionMenu.open ? 'bg-white ring-1 ring-skyline-500/30' : ''}`}
              onClick={() => occasionMenu.setOpen((v) => !v)}
            >
              {occasion || 'Occasion'}
              <ChevronDown className="h-3.5 w-3.5 text-ink-400" />
            </button>
            {occasionMenu.open && (
              <ul className="absolute left-0 z-40 mt-1 max-h-64 min-w-[220px] overflow-auto rounded-2xl border border-ink-200 bg-white py-1 shadow-xl">
                <li>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-ink-700 hover:bg-ink-50"
                    onClick={() => {
                      setOccasion('')
                      occasionMenu.setOpen(false)
                    }}
                  >
                    Any occasion
                  </button>
                </li>
                {occasions.map((o) => (
                  <li key={o.slug}>
                    <button
                      type="button"
                      className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-ink-50 ${
                        occasion === o.title ? 'bg-skyline-500/10 font-semibold text-skyline-700' : 'text-ink-700'
                      }`}
                      onClick={() => {
                        setOccasion(o.title)
                        occasionMenu.setOpen(false)
                      }}
                    >
                      <span className="w-4">{occasion === o.title && <Check className="h-3.5 w-3.5" />}</span>
                      {o.title}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-ink-50 ${
                      occasion === 'Other' ? 'bg-skyline-500/10 font-semibold text-skyline-700' : 'text-ink-700'
                    }`}
                    onClick={() => {
                      setOccasion('Other')
                      occasionMenu.setOpen(false)
                    }}
                  >
                    <span className="w-4">{occasion === 'Other' && <Check className="h-3.5 w-3.5" />}</span>
                    Other
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
          <div className="relative grid min-w-0 flex-1 gap-2 sm:grid-cols-[1fr_auto_1fr]">
            <div>
              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-400">From</span>
              <AirportInput name="origin" value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Where from?" required />
            </div>
            <div className="flex items-end justify-center pb-1">
              <button
                type="button"
                onClick={swapAirports}
                title="Swap airports"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-600 shadow-sm transition hover:border-skyline-400 hover:text-skyline-600"
              >
                <ArrowLeftRight className="h-4 w-4" />
              </button>
            </div>
            <div>
              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-400">To</span>
              <AirportInput name="destination" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Where to?" required />
            </div>
          </div>

          <div className="min-w-0 flex-1 lg:max-w-md">
            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-400">Dates</span>
            <FlightDatePicker
              tripType={tripType}
              departureDate={departure}
              returnDate={returnDate}
              minDate={todayLocalISO()}
              onChange={({ departureDate, returnDate: nextReturn }) => {
                setDeparture(departureDate || '')
                setReturnDate(nextReturn || '')
              }}
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.2fr_1.2fr_auto]">
          <label className="block min-w-0">
            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-400">Email</span>
            <input
              className="h-[52px] w-full rounded-2xl border border-ink-200 bg-white px-3 text-sm font-medium text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-skyline-500 focus:ring-2 focus:ring-skyline-500/20"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => {
                const next = email.trim().toLowerCase()
                setEmail(next)
                setFieldErrors((c) => ({ ...c, email: getEmailError(next) || undefined }))
              }}
              placeholder="you@company.com"
              autoComplete="email"
              required
              aria-invalid={Boolean(fieldErrors.email)}
            />
            {fieldErrors.email && <span className="mt-1 block text-xs text-ember-600">{fieldErrors.email}</span>}
          </label>

          <div className="min-w-0">
            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-400">Phone</span>
            <span className="flex h-[52px] overflow-hidden rounded-2xl border border-ink-200 bg-white focus-within:border-skyline-500 focus-within:ring-2 focus-within:ring-skyline-500/20">
              <select
                aria-label="Country calling code"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="h-full w-[92px] shrink-0 border-r border-ink-200 bg-transparent px-2 text-sm font-medium text-ink-700 outline-none"
              >
                <option value="+1">US +1</option>
                <option value="+44">UK +44</option>
                <option value="+91">IN +91</option>
                <option value="+61">AU +61</option>
                <option value="+971">AE +971</option>
                <option value="+49">DE +49</option>
                <option value="+33">FR +33</option>
              </select>
              <input
                className="min-w-0 flex-1 bg-transparent px-3 text-sm font-medium text-ink-900 outline-none placeholder:text-ink-400"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(sanitizePhoneInput(e.target.value))}
                onBlur={() => setFieldErrors((c) => ({ ...c, phone: getPhoneError(countryCode, phone) || undefined }))}
                placeholder="Phone number"
                autoComplete="tel-national"
                required
                aria-invalid={Boolean(fieldErrors.phone)}
              />
            </span>
            {fieldErrors.phone && <span className="mt-1 block text-xs text-ember-600">{fieldErrors.phone}</span>}
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="group inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-ember-600 px-6 text-sm font-bold text-white shadow-lg shadow-ember-600/25 transition hover:bg-ember-700 focus:outline-none focus:ring-4 focus:ring-ember-500/25 disabled:opacity-70 lg:min-w-[160px]"
            >
              {loading ? 'Sending...' : 'Get free quote'}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        <input
          type="text"
          name="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-10000px] h-px w-px overflow-hidden"
        />

        {error && <p role="alert" className="text-sm font-medium text-ember-600">{error}</p>}
      </form>
    </div>
  )
}

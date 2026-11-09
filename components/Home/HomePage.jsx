'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ArrowRight } from 'lucide-react'
import { occasions } from '@/data/occasions'
import { revealOnScroll, safeRevert } from '@/lib/gsapSafe'
import QuoteForm from '@/components/quote/QuoteForm'
import AirlineLogoPin from './AirlineLogoPin'
import HowItWorks from './HowItWorks'

export default function HomePage() {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const hero = root.querySelectorAll('[data-reveal="hero"]')
    const form = root.querySelectorAll('[data-reveal="form"]')

    const ctx = gsap.context(() => {
      revealOnScroll(hero, { vars: { y: 28, stagger: 0.12, duration: 0.85 } })
      revealOnScroll(form, { vars: { y: 36, delay: 0.15, duration: 0.9, stagger: 0 } })
    }, root)

    return () => safeRevert(ctx, [...hero, ...form])
  }, [])

  return (
    <div ref={rootRef}>
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.22),transparent_42%),radial-gradient(circle_at_80%_10%,rgba(249,115,22,0.16),transparent_38%),linear-gradient(160deg,#0b1522_0%,#152233_48%,#1f3148_100%)]">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-950/40 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8">
          <div className="max-w-3xl">
            <p data-reveal="hero" className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Group Flight Bookings
            </p>
            <p data-reveal="hero" className="mt-5 max-w-xl text-base leading-7 text-ink-200 sm:text-lg">
              Global group air travel for weddings, teams, schools, and events — request a free quote in one clean search.
            </p>
            <div data-reveal="hero" className="mt-6 flex flex-wrap items-center gap-3 text-sm text-ink-300">
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5">10+ travelers</span>
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5">Worldwide routes</span>
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5">Human desk support</span>
            </div>
          </div>

          <div id="quote" data-reveal="form" className="mt-10 scroll-mt-28">
            <QuoteForm />
          </div>
        </div>
      </section>

      <HowItWorks />
      <AirlineLogoPin />

      <section className="relative overflow-hidden bg-ink-950 py-16 sm:py-20">
        <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-skyline-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-ember-500/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">Travel by occasion</h2>
              <p className="mt-3 max-w-xl text-base text-ink-300">
                Pick the trip type that matches your group — we tune holds and timelines accordingly.
              </p>
            </div>
            <Link href="/occasions" className="inline-flex items-center gap-2 text-sm font-bold text-skyline-400 hover:text-skyline-300">
              View all occasions <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {occasions.map((o) => (
              <Link
                key={o.slug}
                href={`/occasions/${o.slug}`}
                className="group rounded-[24px] border border-white/10 bg-white/5 p-5 transition hover:border-skyline-400/40 hover:bg-white/10"
              >
                <h3 className="font-display text-lg font-bold text-white group-hover:text-skyline-300">{o.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-300">{o.short}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[32px] bg-gradient-to-br from-ink-900 via-ink-800 to-skyline-700 px-6 py-12 text-center sm:px-10">
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Ready when your group is</h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-ink-200">
              Drop the route, traveler count, and your contact details — we will reply with a clear group outline.
            </p>
            <a
              href="#quote"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-ember-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-ember-700"
            >
              Start your quote <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

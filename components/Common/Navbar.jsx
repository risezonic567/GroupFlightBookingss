'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import {
  Briefcase,
  Cake,
  ChevronDown,
  ChevronRight,
  Church,
  Heart,
  Menu,
  Music2,
  Phone,
  Ship,
  Trophy,
  Users,
  GraduationCap,
  X,
} from 'lucide-react'
import contactDetails from '@/data/contact'

const MEGA_CATEGORIES = [
  {
    id: 'celebrations',
    label: 'Celebrations',
    heading: 'Celebrations',
    feature: {
      text: 'Most requested: weddings with guests from 3+ cities.',
      cta: 'Start wedding quote',
      href: '/occasions/weddings',
    },
    items: [
      { slug: 'weddings', title: 'Wedding groups', Icon: Heart },
      { slug: 'family-reunions', title: 'Family reunions', Icon: Users },
      { slug: 'family-reunions', title: 'Milestone trips', Icon: Cake, note: true },
    ],
  },
  {
    id: 'business',
    label: 'Business',
    heading: 'Business',
    feature: {
      text: 'Corporate offsites, summits, and incentive groups on shared flights.',
      cta: 'Start corporate quote',
      href: '/occasions/corporate',
    },
    items: [{ slug: 'corporate', title: 'Corporate & conferences', Icon: Briefcase }],
  },
  {
    id: 'teams',
    label: 'Teams',
    heading: 'Teams',
    feature: {
      text: 'Keep squads and staff together around fixtures and training camps.',
      cta: 'Start sports quote',
      href: '/occasions/sports',
    },
    items: [{ slug: 'sports', title: 'Sports teams', Icon: Trophy }],
  },
  {
    id: 'education',
    label: 'Education',
    heading: 'Education',
    feature: {
      text: 'School tours and university groups with flexible name lists.',
      cta: 'Start school quote',
      href: '/occasions/school-university',
    },
    items: [{ slug: 'school-university', title: 'School & university', Icon: GraduationCap }],
  },
  {
    id: 'faith',
    label: 'Faith',
    heading: 'Faith',
    feature: {
      text: 'Faith communities traveling together around ceremony dates.',
      cta: 'Start pilgrimage quote',
      href: '/occasions/religious-pilgrimage',
    },
    items: [{ slug: 'religious-pilgrimage', title: 'Religious & pilgrimage', Icon: Church }],
  },
  {
    id: 'events-travel',
    label: 'Events and travel',
    heading: 'Events and travel',
    feature: {
      text: 'Festivals, tours, and cruise fly-ins with timing that fits the schedule.',
      cta: 'Start events quote',
      href: '/occasions/music-events',
    },
    items: [
      { slug: 'music-events', title: 'Music & events', Icon: Music2 },
      { slug: 'cruise-connections', title: 'Cruise connections', Icon: Ship },
    ],
  },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [mobileOccasions, setMobileOccasions] = useState(false)
  const [activeCat, setActiveCat] = useState(MEGA_CATEGORIES[0].id)
  const megaRef = useRef(null)

  const category = MEGA_CATEGORIES.find((c) => c.id === activeCat) || MEGA_CATEGORIES[0]

  useEffect(() => {
    const onDoc = (e) => {
      if (megaRef.current && !megaRef.current.contains(e.target)) setMegaOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMegaOpen(false)
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  function closeAll() {
    setOpen(false)
    setMegaOpen(false)
    setMobileOccasions(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 shrink-0 items-center" onClick={closeAll} aria-label="Group Flight Bookings home">
          <Image
            src="/images/logo.jpeg"
            alt="Group Flight Bookings"
            width={360}
            height={96}
            priority
            className="h-14 w-auto max-w-[min(280px,62vw)] object-contain object-left sm:h-16 lg:h-[4.5rem]"
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <Link href="/#quote" className="rounded-full px-3 py-2 text-sm font-semibold text-ink-200 transition hover:bg-white/10 hover:text-white">
            Get a quote
          </Link>

          <div className="relative" ref={megaRef} onMouseEnter={() => setMegaOpen(true)} onMouseLeave={() => setMegaOpen(false)}>
            <button
              type="button"
              className={`inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold transition ${
                megaOpen ? 'bg-white/10 text-white' : 'text-ink-200 hover:bg-white/10 hover:text-white'
              }`}
              aria-expanded={megaOpen}
              onClick={() => setMegaOpen((v) => !v)}
            >
              Occasions
              <ChevronDown className={`h-4 w-4 transition ${megaOpen ? 'rotate-180' : ''}`} />
            </button>

            {megaOpen && (
              <div className="absolute left-1/2 top-full z-50 w-[min(860px,calc(100vw-2rem))] -translate-x-1/2 pt-3">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#161b22] shadow-2xl shadow-black/50">
                  <div className="grid md:grid-cols-[200px_1fr_240px]">
                    {/* Left categories */}
                    <div className="flex min-h-full flex-col border-b border-white/10 p-3 md:border-b-0 md:border-r">
                      <ul className="space-y-0.5">
                        {MEGA_CATEGORIES.map((cat) => {
                          const active = cat.id === activeCat
                          return (
                            <li key={cat.id}>
                              <button
                                type="button"
                                onMouseEnter={() => setActiveCat(cat.id)}
                                onFocus={() => setActiveCat(cat.id)}
                                onClick={() => setActiveCat(cat.id)}
                                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
                                  active
                                    ? 'bg-white/10 font-semibold text-white'
                                    : 'text-ink-200 hover:bg-white/5 hover:text-white'
                                }`}
                              >
                                {cat.label}
                                {active ? <ChevronRight className="h-4 w-4 text-ink-400" /> : <span className="w-4" />}
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                      <div className="mt-auto border-t border-white/15 pt-2">
                        <Link
                          href="/occasions"
                          onClick={closeAll}
                          className="flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-bold text-white transition hover:bg-white/10"
                        >
                          All occasions
                        </Link>
                      </div>
                    </div>

                    {/* Middle items */}
                    <div className="border-b border-white/10 p-5 md:border-b-0 md:border-r md:p-6">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink-400">{category.heading}</p>
                      <ul className="mt-4 space-y-1">
                        {category.items.map((item) => (
                          <li key={`${item.slug}-${item.title}`}>
                            <Link
                              href={`/occasions/${item.slug}`}
                              onClick={closeAll}
                              className="flex items-center gap-3 rounded-xl px-2 py-2.5 text-sm font-semibold text-white transition hover:bg-white/5"
                            >
                              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-skyline-500/15 text-skyline-400">
                                <item.Icon className="h-4 w-4" strokeWidth={1.75} />
                              </span>
                              {item.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Right feature */}
                    <div className="flex flex-col p-5 md:p-6">
                      <div
                        className="min-h-[120px] flex-1 rounded-xl border border-dashed border-white/20 bg-[repeating-linear-gradient(-45deg,transparent,transparent_6px,rgba(255,255,255,0.04)_6px,rgba(255,255,255,0.04)_7px)]"
                        aria-hidden="true"
                      />
                      <p className="mt-4 text-sm leading-6 text-ink-200">{category.feature.text}</p>
                      <Link
                        href={category.feature.href}
                        onClick={closeAll}
                        className="mt-4 inline-flex items-center justify-center rounded-full bg-ember-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-ember-700"
                      >
                        {category.feature.cta}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link href="/about" className="rounded-full px-3 py-2 text-sm font-semibold text-ink-200 transition hover:bg-white/10 hover:text-white">
            About
          </Link>
          <Link href="/contact" className="rounded-full px-3 py-2 text-sm font-semibold text-ink-200 transition hover:bg-white/10 hover:text-white">
            Contact
          </Link>
          <a
            href={contactDetails.phoneHref}
            className="ml-2 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-ink-900 transition hover:bg-ink-50"
          >
            <Phone className="h-4 w-4 text-skyline-600" />
            <span className="hidden xl:inline">{contactDetails.phoneDisplay}</span>
            <span className="xl:hidden">Call</span>
          </a>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-white lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-t border-white/10 bg-ink-950 px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            <Link href="/#quote" onClick={closeAll} className="rounded-xl px-3 py-3 text-sm font-semibold text-white hover:bg-white/10">
              Get a quote
            </Link>

            <button
              type="button"
              className="flex items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold text-white hover:bg-white/10"
              onClick={() => setMobileOccasions((v) => !v)}
              aria-expanded={mobileOccasions}
            >
              Occasions
              <ChevronDown className={`h-4 w-4 transition ${mobileOccasions ? 'rotate-180' : ''}`} />
            </button>

            {mobileOccasions && (
              <div className="mb-2 space-y-3 rounded-2xl bg-white/5 p-3">
                {MEGA_CATEGORIES.map((cat) => (
                  <div key={cat.id}>
                    <p className="px-1 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-400">{cat.label}</p>
                    <div className="mt-1.5 space-y-1">
                      {cat.items.map((item) => (
                        <Link
                          key={`${cat.id}-${item.title}`}
                          href={`/occasions/${item.slug}`}
                          onClick={closeAll}
                          className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm text-ink-100 hover:bg-white/10"
                        >
                          <item.Icon className="h-4 w-4 text-skyline-400" />
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                <Link
                  href="/occasions"
                  onClick={closeAll}
                  className="mt-2 block border-t border-white/10 px-1 pt-3 text-sm font-bold text-skyline-300"
                >
                  All occasions
                </Link>
              </div>
            )}

            <Link href="/about" onClick={closeAll} className="rounded-xl px-3 py-3 text-sm font-semibold text-white hover:bg-white/10">
              About
            </Link>
            <Link href="/contact" onClick={closeAll} className="rounded-xl px-3 py-3 text-sm font-semibold text-white hover:bg-white/10">
              Contact
            </Link>
            <a
              href={contactDetails.phoneHref}
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-ember-600 px-4 py-3 text-sm font-bold text-white"
            >
              <Phone className="h-4 w-4" />
              {contactDetails.phoneDisplay}
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

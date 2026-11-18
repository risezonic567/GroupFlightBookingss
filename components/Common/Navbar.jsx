'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Menu, Phone, X } from 'lucide-react'
import contactDetails from '@/data/contact'
import FillButton from '@/components/Common/FillButton'

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
      { slug: 'weddings', title: 'Wedding groups' },
      { slug: 'family-reunions', title: 'Family reunions' },
      { slug: 'family-reunions', title: 'Milestone trips' },
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
    items: [{ slug: 'corporate', title: 'Corporate & conferences' }],
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
    items: [{ slug: 'sports', title: 'Sports teams' }],
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
    items: [{ slug: 'school-university', title: 'School & university' }],
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
    items: [{ slug: 'religious-pilgrimage', title: 'Religious & pilgrimage' }],
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
      { slug: 'music-events', title: 'Music & events' },
      { slug: 'cruise-connections', title: 'Cruise connections' },
    ],
  },
]

const navLinkClass =
  'relative cursor-pointer px-1 py-1 text-[15px] font-semibold tracking-wide text-ink-900 transition-colors hover:text-ink-700 after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-ink-900 after:transition-transform after:duration-200 hover:after:scale-x-100'

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
    <header className="sticky top-0 z-50 border-b border-ink-200/80 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:h-[4.5rem] sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 shrink-0 cursor-pointer items-center" onClick={closeAll} aria-label="Group Flight Bookings home">
          <Image
            src="/images/logo-nav.jpeg"
            alt="Group Flight Bookings"
            width={480}
            height={156}
            priority
            className="h-11 w-auto max-w-[min(280px,70vw)] object-contain object-left sm:h-12 lg:h-14"
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          <Link href="/about" className={navLinkClass}>
            About
          </Link>

          <div className="relative" ref={megaRef} onMouseEnter={() => setMegaOpen(true)} onMouseLeave={() => setMegaOpen(false)}>
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-1.5 text-[15px] font-semibold tracking-wide text-ink-900 transition-colors hover:text-ink-700"
              aria-expanded={megaOpen}
              onClick={() => setMegaOpen((v) => !v)}
            >
              Occasions
              <ChevronDown className={`h-3.5 w-3.5 text-ink-500 transition duration-200 ${megaOpen ? 'rotate-180' : ''}`} />
            </button>

            {megaOpen && (
              <div className="absolute left-1/2 top-full z-50 w-[min(640px,calc(100vw-2rem))] -translate-x-1/2 pt-4">
                <div className="border border-ink-200 bg-white shadow-[0_20px_50px_rgba(15,34,51,0.12)]">
                  <div className="grid grid-cols-[180px_1fr]">
                    <div className="flex flex-col border-r border-ink-100 py-3">
                      <ul>
                        {MEGA_CATEGORIES.map((cat) => {
                          const active = cat.id === activeCat
                          return (
                            <li key={cat.id}>
                              <button
                                type="button"
                                onMouseEnter={() => setActiveCat(cat.id)}
                                onFocus={() => setActiveCat(cat.id)}
                                onClick={() => setActiveCat(cat.id)}
                                className={`flex w-full cursor-pointer items-center border-l-2 px-4 py-2.5 text-left text-[13px] transition-colors ${
                                  active
                                    ? 'border-ink-900 bg-ink-50 font-semibold text-ink-900'
                                    : 'border-transparent text-ink-600 hover:bg-ink-50 hover:text-ink-900'
                                }`}
                              >
                                {cat.label}
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                      <div className="mt-auto border-t border-ink-100 px-4 pt-3 pb-1">
                        <Link
                          href="/occasions"
                          onClick={closeAll}
                          className="cursor-pointer text-[12px] font-semibold tracking-wide text-ink-800 underline-offset-4 transition hover:underline"
                        >
                          All occasions
                        </Link>
                      </div>
                    </div>

                    <div className="px-6 py-5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-400">{category.heading}</p>
                      <ul className="mt-3 space-y-0.5">
                        {category.items.map((item) => (
                          <li key={`${item.slug}-${item.title}`}>
                            <Link
                              href={`/occasions/${item.slug}`}
                              onClick={closeAll}
                              className="group flex cursor-pointer items-center justify-between gap-3 py-2.5 text-[14px] font-medium text-ink-800 transition-colors hover:text-ink-950"
                            >
                              <span>{item.title}</span>
                              <span className="text-ink-400 transition group-hover:translate-x-0.5 group-hover:text-ink-600" aria-hidden>
                                →
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-5 border-t border-ink-100 pt-4">
                        <p className="text-[13px] leading-relaxed text-ink-500">{category.feature.text}</p>
                        <Link
                          href={category.feature.href}
                          onClick={closeAll}
                          className="mt-3 inline-flex cursor-pointer text-[13px] font-semibold text-ink-900 underline-offset-4 transition hover:underline"
                        >
                          {category.feature.cta}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link href="/blog" className={navLinkClass}>
            Blog
          </Link>
          <Link href="/contact" className={navLinkClass}>
            Contact
          </Link>

          <FillButton
            href={contactDetails.phoneHref}
            className="ml-1 inline-flex cursor-pointer items-center border border-ink-300 px-3.5 py-2 text-[14px] font-semibold tracking-wide text-ink-900 hover:border-ink-500"
          >
            <Phone className="h-3.5 w-3.5" strokeWidth={1.75} />
            <span className="hidden xl:inline">{contactDetails.phoneDisplay}</span>
            <span className="xl:hidden">Call</span>
          </FillButton>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 cursor-pointer items-center justify-center border border-ink-300 text-ink-900 transition hover:border-ink-500 hover:bg-ink-50 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-ink-100 bg-white px-4 py-5 lg:hidden">
          <div className="flex flex-col">
            <Link href="/about" onClick={closeAll} className="cursor-pointer border-b border-ink-100 py-3.5 text-[15px] font-medium text-ink-900">
              About
            </Link>

            <button
              type="button"
              className="flex cursor-pointer items-center justify-between border-b border-ink-100 py-3.5 text-left text-[15px] font-medium text-ink-900"
              onClick={() => setMobileOccasions((v) => !v)}
              aria-expanded={mobileOccasions}
            >
              Occasions
              <ChevronDown className={`h-4 w-4 text-ink-500 transition ${mobileOccasions ? 'rotate-180' : ''}`} />
            </button>

            {mobileOccasions && (
              <div className="space-y-4 border-b border-ink-100 py-4 pl-1">
                {MEGA_CATEGORIES.map((cat) => (
                  <div key={cat.id}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-400">{cat.label}</p>
                    <div className="mt-2 space-y-1">
                      {cat.items.map((item) => (
                        <Link
                          key={`${cat.id}-${item.title}`}
                          href={`/occasions/${item.slug}`}
                          onClick={closeAll}
                          className="block cursor-pointer py-1.5 text-[14px] text-ink-700 transition hover:text-ink-950"
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                <Link
                  href="/occasions"
                  onClick={closeAll}
                  className="inline-block cursor-pointer pt-1 text-[13px] font-semibold text-ink-900 underline-offset-4 hover:underline"
                >
                  All occasions
                </Link>
              </div>
            )}

            <Link href="/blog" onClick={closeAll} className="cursor-pointer border-b border-ink-100 py-3.5 text-[15px] font-medium text-ink-900">
              Blog
            </Link>
            <Link href="/contact" onClick={closeAll} className="cursor-pointer border-b border-ink-100 py-3.5 text-[15px] font-medium text-ink-900">
              Contact
            </Link>

            <FillButton
              href={contactDetails.phoneHref}
              className="mt-5 inline-flex cursor-pointer items-center justify-center border border-ink-300 py-3 text-[14px] font-semibold text-ink-900"
            >
              <Phone className="h-4 w-4" strokeWidth={1.75} />
              {contactDetails.phoneDisplay}
            </FillButton>
          </div>
        </div>
      )}

    </header>
  )
}

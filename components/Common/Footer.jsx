'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { Clock, Mail, Phone } from 'lucide-react'
import contactDetails from '@/data/contact'
import { occasions } from '@/data/occasions'

const COMPANY_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/occasions', label: 'All occasions' },
  { href: '/privacy-policy', label: 'Privacy policy' },
]

const linkFocus =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'

function placePillCircle(pill, circle, x, y, scale) {
  const { width, height } = pill.getBoundingClientRect()
  const size = Math.hypot(width, height) * 2
  circle.style.width = `${size}px`
  circle.style.height = `${size}px`
  circle.style.left = `${x}px`
  circle.style.top = `${y}px`
  circle.style.transform = `translate(-50%, -50%) scale(${scale})`
}

export default function Footer() {
  const wordmarkRef = useRef(null)

  function onWordmarkMove(e) {
    const el = wordmarkRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--x', `${e.clientX - rect.left}px`)
    el.style.setProperty('--y', `${e.clientY - rect.top}px`)
  }

  function onWordmarkLeave() {
    const el = wordmarkRef.current
    if (!el) return
    el.style.setProperty('--x', '-400px')
    el.style.setProperty('--y', '50%')
  }

  function onPillEnter(e) {
    const pill = e.currentTarget
    const circle = pill.querySelector('[data-fill-circle]')
    if (!circle) return
    const rect = pill.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    placePillCircle(pill, circle, x, y, 0)
    void circle.offsetHeight
    placePillCircle(pill, circle, x, y, 1)
  }

  function onPillLeave(e) {
    const pill = e.currentTarget
    const circle = pill.querySelector('[data-fill-circle]')
    if (!circle) return
    const rect = pill.getBoundingClientRect()
    placePillCircle(pill, circle, e.clientX - rect.left, e.clientY - rect.top, 0)
  }

  return (
    <footer className="overflow-hidden bg-ink-950 text-ink-300">
      <div className="relative h-10 border-t border-[#1c3a70]" aria-hidden>
        <div className="about-runway-line absolute top-1/2 right-8 left-8 h-0.5 -translate-y-1/2" />
      </div>
      <div className="mx-auto max-w-6xl px-6 pt-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <Link href="/" aria-label="Group Flight Bookings home" className={`inline-block bg-white px-2 py-1 ${linkFocus}`}>
              <Image
                src="/images/logo-nav.jpeg"
                alt="Group Flight Bookings"
                width={320}
                height={104}
                className="h-12 w-auto object-contain sm:h-14"
              />
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-white">
              Global group flight planning for weddings, teams, schools, and events — clear quotes, shared itineraries,
              human support.
            </p>

            <div className="mt-5 grid grid-cols-[1rem_1fr] items-start gap-x-2.5 gap-y-2 text-sm text-white">
              <Mail className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
              <a
                href={`mailto:${contactDetails.email}`}
                className={`transition hover:text-white/80 ${linkFocus}`}
              >
                {contactDetails.email}
              </a>

              <Phone className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
              <a
                href={contactDetails.phoneHref}
                className={`transition hover:text-white/80 ${linkFocus}`}
              >
                {contactDetails.phoneDisplay}
              </a>

              <Clock className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
              <p className="text-sm leading-5 text-white">Monday–Friday, 9:00–18:00 local desk time</p>
            </div>
          </div>

          <div>
            <p className="text-center font-display text-2xl font-medium tracking-tight text-white sm:text-3xl">
              Plan a trip for
            </p>
            <nav aria-label="Occasions" className="mt-5">
              <ul className="group/pills flex flex-wrap">
                {occasions.map((o) => (
                  <li key={o.slug} className="mr-2 mb-3">
                    <Link
                      href={`/occasions/${o.slug}`}
                      onMouseEnter={onPillEnter}
                      onMouseLeave={onPillLeave}
                      className={`relative inline-flex overflow-hidden rounded-full border border-ink-600/60 px-4 py-2 text-sm text-white transition-[opacity,transform,color,border-color] duration-300 group-hover/pills:opacity-35 hover:!opacity-100 hover:-translate-y-0.5 hover:border-white hover:text-[#0b1623] ${linkFocus}`}
                    >
                      <span
                        data-fill-circle
                        aria-hidden
                        className="pointer-events-none absolute rounded-full bg-white"
                        style={{
                          left: 0,
                          top: 0,
                          width: 0,
                          height: 0,
                          transform: 'translate(-50%, -50%) scale(0)',
                          transition: 'transform 500ms cubic-bezier(.22, 1, .36, 1)',
                        }}
                      />
                      <span className="relative z-10 transition-colors duration-[400ms]">{o.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <p
          ref={wordmarkRef}
          onMouseMove={onWordmarkMove}
          onMouseLeave={onWordmarkLeave}
          aria-hidden="true"
          className="mt-10 mb-6 select-none pb-1 text-center whitespace-nowrap font-display text-[clamp(40px,10.5vw,76px)] font-medium leading-none tracking-tight"
          style={{
            color: 'transparent',
            backgroundColor: '#16253a',
            backgroundImage:
              'radial-gradient(circle 150px at var(--x, -400px) var(--y, 50%), #8fb2e3 0%, #16253a 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
          }}
        >
          Group Flight Bookings
        </p>

        <nav
          aria-label="Company"
          className="flex flex-wrap justify-center gap-x-6 gap-y-2 border-t border-[#223349] py-4 text-sm text-white"
        >
          {COMPANY_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition hover:text-white/80 ${linkFocus}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-2 border-t border-[#223349] pt-3 pb-5 text-xs text-ink-500 md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} Group Flight Bookings. All rights reserved.</p>
          <p>Groups of 10+ · Worldwide routes</p>
        </div>
      </div>
    </footer>
  )
}

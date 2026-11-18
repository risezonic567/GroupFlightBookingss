'use client'

import { testimonials } from '@/data/testimonials'

const CARD_GAP = '1.25rem' // 20px
const MARQUEE_DURATION = '40s'

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function TestimonialCards({ items, inert = false }) {
  return items.map((item) => (
    <article
      key={`${inert ? 'dup' : 'src'}-${item.name}-${item.tag}`}
      className="flex w-[280px] shrink-0 flex-col rounded-2xl border border-line bg-ink-50 p-5 transition duration-200 hover:border-ink-900 hover:shadow-[0_10px_24px_-18px_rgba(15,34,51,0.3)] sm:w-[320px] sm:p-6"
      tabIndex={inert ? -1 : undefined}
    >
      <div className="flex gap-0.5 text-[#E0A526]" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className="text-sm leading-none">
            ★
          </span>
        ))}
      </div>

      <p className="mt-4 line-clamp-5 flex-1 text-[15px] leading-[1.55] text-ink-800 sm:text-base">
        “{item.quote}”
      </p>

      <div className="mt-5 flex items-center gap-3">
        <span
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-950 text-xs font-semibold text-white"
          aria-hidden
        >
          {initials(item.name)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink-950">{item.name}</p>
          <p className="truncate text-xs text-ink-500">{item.role}</p>
        </div>
        <span className="ml-auto shrink-0 rounded-full border border-line bg-white px-2.5 py-1 text-[11px] font-semibold text-ink-700">
          {item.tag}
        </span>
      </div>
    </article>
  ))
}

function MarqueeRow({ items, reverse = false }) {
  return (
    <div
      className={`testimonials-marquee group/marquee overflow-hidden ${
        reverse ? 'mt-5' : ''
      }`}
    >
      <div className="testimonials-marquee-fade">
        <div
          className={`testimonials-marquee-track flex items-stretch ${
            reverse ? 'testimonials-marquee-track--reverse' : ''
          }`}
          style={{
            gap: CARD_GAP,
            ['--marquee-duration']: MARQUEE_DURATION,
          }}
        >
          <div className="flex items-stretch" style={{ gap: CARD_GAP }}>
            <TestimonialCards items={items} />
          </div>
          <div className="flex items-stretch" style={{ gap: CARD_GAP }} aria-hidden="true">
            <TestimonialCards items={items} inert />
          </div>
        </div>
      </div>

      <div className="testimonials-marquee-static hidden gap-5 overflow-x-auto scroll-smooth px-4 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory">
        {items.map((item) => (
          <div key={`static-${item.name}-${item.tag}`} className="snap-start">
            <TestimonialCards items={[item]} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HomeTestimonials({ rows = 1 }) {
  const items =
    testimonials.length >= 4
      ? testimonials
      : Array.from({ length: Math.ceil(4 / Math.max(testimonials.length, 1)) }, () => testimonials).flat()

  return (
    <section
      className="bg-white py-16 sm:py-20"
      aria-label="Client testimonials"
      aria-labelledby="home-notes-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2
            id="home-notes-heading"
            className="font-display text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl"
          >
            From organizers who book groups
          </h2>
          <p className="mt-3 text-base leading-7 text-ink-600">
            Demo notes that mirror the trips we plan for — replace with your real client quotes when ready.
          </p>
        </div>
      </div>

      <div className="mt-10 border-y border-line py-8">
        <MarqueeRow items={items} />
        {rows === 2 ? <MarqueeRow items={[...items].reverse()} reverse /> : null}
      </div>
    </section>
  )
}

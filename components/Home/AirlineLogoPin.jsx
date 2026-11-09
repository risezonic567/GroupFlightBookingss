'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import airlines from '@/data/airlines'
import { ensureGsapPlugins, safeRevert } from '@/lib/gsapSafe'

export default function AirlineLogoPin() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    ensureGsapPlugins()

    const ctx = gsap.context(() => {
      const distance = () => Math.max(0, track.scrollWidth - section.clientWidth + 64)

      gsap.fromTo(
        track,
        { x: 40 },
        {
          x: () => -distance(),
          ease: 'none',
          immediateRender: false,
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${Math.max(distance() * 1.15, window.innerHeight * 1.2)}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        },
      )
    }, section)

    const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 120)

    return () => {
      window.clearTimeout(refreshId)
      safeRevert(ctx, track)
    }
  }, [])

  const row = [...airlines, ...airlines]

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-ink-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.18),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(249,115,22,0.12),transparent_35%)]" />
      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-skyline-400">Airline partners</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-5xl">
            Groups fly with the carriers you already trust
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-ink-300">
            Scroll to move through the lineup — the section stays pinned until every logo has crossed the frame.
          </p>
        </div>

        <div className="mt-12 overflow-hidden">
          <div ref={trackRef} className="flex w-max gap-4 pr-8 sm:gap-5">
            {row.map((airline, index) => (
              <div
                key={`${airline.name}-${index}`}
                className="flex h-28 w-[200px] shrink-0 flex-col items-center justify-center gap-3 rounded-[24px] border border-white/10 bg-white/[0.06] px-4 backdrop-blur-sm sm:h-32 sm:w-[220px]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={airline.logo} alt={airline.name} className="h-12 w-12 object-contain sm:h-14 sm:w-14" loading="lazy" />
                <span className="text-center text-sm font-semibold text-ink-100">{airline.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

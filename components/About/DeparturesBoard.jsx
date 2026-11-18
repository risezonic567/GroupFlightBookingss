'use client'

import { useEffect, useRef, useState } from 'react'
import { ensureGsapPlugins, revealOnScroll, safeRevert } from '@/lib/gsapSafe'
import { departures } from '@/lib/aboutContent'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

function FlipCell({ text, tone = 'yellow', animate = false, delay = 0 }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!animate || reduce) {
      el.textContent = text
      return undefined
    }

    let intervalId = 0
    let tick = 0
    const max = 6 + Math.floor(Math.random() * 13)
    const startId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        tick += 1
        if (tick >= max) {
          el.textContent = text
          window.clearInterval(intervalId)
          return
        }
        el.textContent = CHARS[Math.floor(Math.random() * CHARS.length)]
      }, 45)
    }, delay)

    return () => {
      window.clearTimeout(startId)
      window.clearInterval(intervalId)
    }
  }, [text, animate, delay])

  return (
    <span
      ref={ref}
      aria-hidden
      className={`inline-flex h-7 min-w-5 items-center justify-center rounded px-1 font-mono text-[11px] font-bold sm:h-8 sm:min-w-6 sm:text-xs ${
        tone === 'green' ? 'text-[#5df0a1]' : 'text-[#ffd24a]'
      } bg-[#06142e]`}
    >
      {text}
    </span>
  )
}

function FlipWord({ value, tone = 'yellow', delay = 0, start = false }) {
  const chars = value.split('')
  return (
    <span className="inline-flex flex-wrap gap-0.5">
      {chars.map((ch, i) =>
        ch === ' ' ? (
          <span key={`${value}-sp-${i}`} className="w-2" aria-hidden />
        ) : (
          <FlipCell
            key={`${value}-${i}`}
            text={ch}
            tone={tone}
            animate={start}
            delay={delay + i * 30}
          />
        ),
      )}
    </span>
  )
}

export default function DeparturesBoard() {
  const rootRef = useRef(null)
  const startedRef = useRef(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    ensureGsapPlugins()
    const nodes = root.querySelectorAll('[data-reveal]')
    const tween = revealOnScroll(nodes, { trigger: root, vars: { y: 20, stagger: 0.08 } })

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true
          setStarted(true)
          io.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    io.observe(root)

    return () => {
      io.disconnect()
      safeRevert({ revert: () => tween?.revert?.() }, nodes)
    }
  }, [])

  return (
    <section ref={rootRef} data-stage="CLIMBING" className="bg-[#071a3a] py-16 text-white sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p data-reveal className="text-xs font-semibold tracking-[0.22em] text-ember-500">
          {departures.eyebrow}
        </p>
        <h2 data-reveal className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {departures.heading}
        </h2>
        <p data-reveal className="mt-3 max-w-2xl text-base text-[#9fb3d1]">
          {departures.lead}
        </p>

        <div
          data-reveal
          className="mt-10 overflow-x-auto rounded-2xl border border-[#1c3a70] bg-[#0a2147] p-4 sm:p-5"
        >
          <div className="min-w-[520px] sm:min-w-0">
            <div className="grid grid-cols-[48px_1fr_auto] gap-3 border-b border-[#1c3a70] pb-3 text-[10px] font-semibold tracking-[0.18em] text-[#7f98c2] md:grid-cols-[56px_1.1fr_1.2fr_64px_1fr]">
              <span>NO</span>
              <span>SERVICE</span>
              <span className="hidden md:inline">DETAILS</span>
              <span className="hidden md:inline">GATE</span>
              <span>STATUS</span>
            </div>

            {departures.rows.map((row, rowIndex) => (
              <div
                key={row.no}
                className="grid grid-cols-[48px_1fr_auto] items-center gap-3 border-b border-[#1c3a70]/70 py-3 last:border-0 md:grid-cols-[56px_1.1fr_1.2fr_64px_1fr]"
              >
                <span className="font-mono text-sm text-[#9fb3d1]">{row.no}</span>
                <div>
                  <span className="sr-only">{row.service}</span>
                  <FlipWord value={row.service} delay={rowIndex * 350} start={started} />
                </div>
                <p className="hidden text-sm text-[#9fb3d1] md:block">{row.details}</p>
                <div className="hidden md:block">
                  <span className="sr-only">{row.gate}</span>
                  <FlipWord value={row.gate} delay={rowIndex * 350 + 80} start={started} />
                </div>
                <div>
                  <span className="sr-only">{row.status}</span>
                  <FlipWord value={row.status} tone="green" delay={rowIndex * 350 + 160} start={started} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

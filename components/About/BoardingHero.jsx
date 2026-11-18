'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import FillButton from '@/components/Common/FillButton'
import { revealOnScroll, safeRevert, ensureGsapPlugins } from '@/lib/gsapSafe'
import { hero } from '@/lib/aboutContent'

export default function BoardingHero() {
  const rootRef = useRef(null)
  const cardRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    ensureGsapPlugins()
    const nodes = root.querySelectorAll('[data-reveal]')
    const ctx = gsap.context(() => {
      revealOnScroll(nodes, {
        trigger: root,
        vars: { y: 22, stagger: 0.1, start: 'top 85%' },
      })
    }, root)
    return () => safeRevert(ctx, nodes)
  }, [])

  useEffect(() => {
    const card = cardRef.current
    if (!card) return undefined
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!fine.matches || reduce.matches) return undefined

    const onMove = (e) => {
      const rect = card.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width - 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5
      card.style.transform = `perspective(1200px) rotateY(${px * 9}deg) rotateX(${-py * 7}deg)`
    }
    const onLeave = () => {
      card.style.transform = 'perspective(1200px) rotateY(0deg) rotateX(0deg)'
    }

    card.addEventListener('pointermove', onMove)
    card.addEventListener('pointerleave', onLeave)
    return () => {
      card.removeEventListener('pointermove', onMove)
      card.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <section
      ref={rootRef}
      data-stage="CHECK-IN"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#dfe9f7_0%,#f4f7fb_55%,#ffffff_100%)] py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 data-reveal className="font-display text-4xl font-bold tracking-tight text-ink-950 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
            {hero.headlineLead}
            <span className="text-[#00338D]">{hero.headlineAccent}</span>
          </h1>
          <p data-reveal className="mx-auto mt-5 max-w-2xl text-base leading-7 text-ink-600 sm:text-lg">
            {hero.subtext}
          </p>
        </div>

        <div data-reveal className="mx-auto mt-12 max-w-[900px]">
          {/* cardRef wraps shadow layer + card so both tilt together */}
          <div ref={cardRef} className="relative transition-transform duration-200 ease-out">
            <i className="gfb-pass-shadow" aria-hidden />

            <div className="gfb-pass relative rounded-[22px] bg-white">
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[10px] font-semibold tracking-[0.22em] text-ink-400">BOARDING PASS</p>
                  <p className="text-[10px] font-semibold tracking-[0.18em] text-ink-400">{hero.pass.brand}</p>
                </div>

                <div className="mt-8 flex items-end justify-between gap-3">
                  <div>
                    <p className="font-display text-4xl font-bold tracking-tight text-ink-950 sm:text-5xl">{hero.pass.fromCode}</p>
                    <p className="mt-1 text-xs font-medium text-ink-500">{hero.pass.fromCity}</p>
                  </div>
                  <div className="mb-3 flex min-w-0 flex-1 items-center px-2">
                    <div className="lane" aria-hidden>
                      <span className="trail" />
                      <span className="pn">
                        <svg
                          viewBox="0 0 24 24"
                          width="30"
                          height="30"
                          fill="#ea580c"
                          stroke="#fff"
                          strokeWidth="1.4"
                          strokeLinejoin="round"
                          style={{ display: 'block', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,.25))' }}
                        >
                          <path d="M2 12 L10 10 L8 3 L11 3 L17 10 L22 10 C23.5 10 23.5 14 22 14 L17 14 L11 21 L8 21 L10 14 Z" />
                        </svg>
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-4xl font-bold tracking-tight text-ink-950 sm:text-5xl">{hero.pass.toCode}</p>
                    <p className="mt-1 text-xs font-medium text-ink-500">{hero.pass.toCity}</p>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
                  {hero.pass.fields.map((field) => (
                    <div key={field.label}>
                      <p className="text-[10px] font-semibold tracking-[0.18em] text-ink-400">{field.label}</p>
                      <p className="mt-1 text-sm font-bold text-ink-900">{field.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="gfb-pass-stub">
                <div className="flex h-full flex-col items-center justify-center gap-4 px-6 py-8 text-center">
                  <p className="text-[10px] font-semibold tracking-[0.22em] text-ink-400">{hero.pass.stubLabel}</p>
                  <p className="font-display text-5xl font-bold text-[#00338D]">{hero.pass.stubCode}</p>
                  <div
                    className="mt-2 h-16 w-full max-w-[140px]"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(90deg,#142033 0 2px,transparent 2px 5px,#142033 5px 6px,transparent 6px 10px,#142033 10px 13px,transparent 13px 15px)',
                    }}
                    aria-hidden
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div data-reveal className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <FillButton
            href={hero.quoteHref}
            className="inline-flex cursor-pointer items-center justify-center bg-ember-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_-12px_rgba(234,88,12,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-600"
          >
            Get a group quote
          </FillButton>
          <FillButton
            href={hero.callHref}
            className="inline-flex cursor-pointer items-center justify-center border border-ink-300 bg-white px-6 py-3 text-sm font-semibold text-ink-900 hover:border-ink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
          >
            {hero.callLabel}
          </FillButton>
        </div>
      </div>
    </section>
  )
}

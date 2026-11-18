'use client'

import { useEffect, useRef } from 'react'
import FillButton from '@/components/Common/FillButton'
import { occasions } from '@/data/occasions'
import { ensureGsapPlugins, revealOnScroll, safeRevert } from '@/lib/gsapSafe'
import { baggageTags } from '@/lib/aboutContent'

const ROTATIONS = [-2, 1.5, -1, 2, -1.5, 1, -2, 1.5, -1, 2]

export default function BaggageTags() {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    ensureGsapPlugins()
    const nodes = root.querySelectorAll('[data-reveal]')
    const tween = revealOnScroll(nodes, { trigger: root, vars: { y: 18, stagger: 0.05 } })
    return () => safeRevert({ revert: () => tween?.revert?.() }, nodes)
  }, [])

  return (
    <section
      ref={rootRef}
      data-stage="CRUISING"
      className="border-t border-line py-16 sm:py-20 lg:py-24"
      style={{
        backgroundColor: '#f4f7fb',
        backgroundImage: 'radial-gradient(#c5d0de 1.1px, transparent 1.5px)',
        backgroundSize: '18px 18px',
      }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p data-reveal className="text-xs font-semibold tracking-[0.22em] text-ember-600">
          {baggageTags.eyebrow}
        </p>
        <h2 data-reveal className="mt-3 font-display text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
          {baggageTags.heading}
        </h2>

        <div data-reveal className="mt-10 flex flex-wrap gap-4">
          {occasions.map((item, index) => (
            <FillButton
              key={item.slug}
              href={`/occasions/${item.slug}`}
              className="about-baggage-tag inline-flex cursor-pointer items-center border border-[#d3dce6] bg-white py-3 pr-5 pl-4 text-sm font-semibold text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00338D] [@media(hover:hover)_and_(pointer:fine)]:hover:rotate-0"
              contentClassName="gap-3"
              style={{
                borderRadius: '8px 16px 16px 8px',
                transform: `rotate(${ROTATIONS[index % ROTATIONS.length]}deg)`,
              }}
            >
              <span
                className="h-3.5 w-3.5 shrink-0 rounded-full border-[1.5px] border-[#00338D] bg-[#f4f7fb]"
                aria-hidden
              />
              {item.title}
            </FillButton>
          ))}
        </div>
      </div>
    </section>
  )
}

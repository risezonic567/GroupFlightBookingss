'use client'

import { useEffect, useRef } from 'react'
import FillButton from '@/components/Common/FillButton'
import { ensureGsapPlugins, revealOnScroll, safeRevert } from '@/lib/gsapSafe'
import { landing } from '@/lib/aboutContent'

export default function LandingCta() {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    ensureGsapPlugins()
    const nodes = root.querySelectorAll('[data-reveal]')
    const tween = revealOnScroll(nodes, { trigger: root, vars: { y: 20, stagger: 0.08 } })
    return () => safeRevert({ revert: () => tween?.revert?.() }, nodes)
  }, [])

  return (
    <section
      ref={rootRef}
      data-stage="LANDING"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#0b2a66_0%,#05122b_100%)] py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <h2 data-reveal className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {landing.heading}
        </h2>
        <p data-reveal className="mx-auto mt-4 max-w-xl text-base text-white/75">
          {landing.sub}
        </p>
        <div data-reveal className="mt-8">
          <FillButton
            href={landing.ctaHref}
            variant="invert"
            className="inline-flex cursor-pointer items-center justify-center bg-ember-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_-12px_rgba(234,88,12,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {landing.cta}
          </FillButton>
        </div>
      </div>
    </section>
  )
}

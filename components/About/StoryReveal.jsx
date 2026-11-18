'use client'

import { useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ensureGsapPlugins, safeRevert } from '@/lib/gsapSafe'
import { story } from '@/lib/aboutContent'

export default function StoryReveal() {
  const wrapRef = useRef(null)
  const wordsRef = useRef(null)

  const words = useMemo(() => story.text.split(/(\s+)/).filter((w) => w.length), [])

  useEffect(() => {
    const wrap = wrapRef.current
    const wordEls = wordsRef.current?.querySelectorAll('[data-word]')
    if (!wrap || !wordEls?.length) return undefined

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      wordEls.forEach((el) => el.classList.add('is-lit'))
      return undefined
    }

    ensureGsapPlugins()
    const total = wordEls.length
    const navyFrom = Math.max(0, total - story.navyTailWordCount)

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrap,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
        onUpdate: (self) => {
          const lit = Math.floor(self.progress * total * 1.08)
          wordEls.forEach((el, i) => {
            const on = i < lit
            el.classList.toggle('is-lit', on)
            el.classList.toggle('is-navy', on && i >= navyFrom)
          })
        },
      })
    }, wrap)

    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120)
    return () => {
      window.clearTimeout(id)
      safeRevert(ctx)
    }
  }, [words.length])

  return (
    <section ref={wrapRef} data-stage="BOARDING" className="relative h-[230vh] bg-white">
      <div className="sticky top-0 flex h-screen items-center">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.22em] text-ember-600">{story.eyebrow}</p>
          <p
            ref={wordsRef}
            className="mt-6 font-display text-[clamp(1.6rem,3.6vw,2.7rem)] font-semibold leading-[1.3] text-[#c3cfdf]"
          >
            {words.map((token, i) =>
              /^\s+$/.test(token) ? (
                <span key={`s-${i}`}>{token}</span>
              ) : (
                <span
                  key={`w-${i}`}
                  data-word
                  className="about-story-word transition-colors duration-200"
                >
                  {token}
                </span>
              ),
            )}
          </p>
        </div>
      </div>
    </section>
  )
}

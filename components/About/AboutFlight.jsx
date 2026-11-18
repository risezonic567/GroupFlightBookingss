'use client'

import { useEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ensureGsapPlugins } from '@/lib/gsapSafe'
import BoardingHero from './BoardingHero'
import StoryReveal from './StoryReveal'
import DeparturesBoard from './DeparturesBoard'
import RouteMap from './RouteMap'
import BaggageTags from './BaggageTags'
import LandingCta from './LandingCta'
import FlightHud from './FlightHud'

export default function AboutFlight() {
  const rootRef = useRef(null)
  const hudRef = useRef(null)
  const rafRef = useRef(0)

  useEffect(() => {
    ensureGsapPlugins()
    const root = rootRef.current
    if (!root) return undefined

    const stages = Array.from(root.querySelectorAll('[data-stage]'))

    const tick = () => {
      const doc = document.documentElement
      const max = Math.max(1, doc.scrollHeight - window.innerHeight)
      const progress = window.scrollY / max

      let stage = 'CHECK-IN'
      const mid = window.innerHeight * 0.5
      for (const el of stages) {
        const top = el.getBoundingClientRect().top
        if (top <= mid) stage = el.getAttribute('data-stage') || stage
      }

      hudRef.current?.update({ progress, stage })
      rafRef.current = 0
    }

    const onScroll = () => {
      if (rafRef.current) return
      rafRef.current = window.requestAnimationFrame(tick)
    }

    tick()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 160)
    const onLoad = () => ScrollTrigger.refresh()
    if (document.fonts?.ready) document.fonts.ready.then(onLoad)

    return () => {
      window.clearTimeout(refreshId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div ref={rootRef}>
      <FlightHud ref={hudRef} />
      <BoardingHero />
      <StoryReveal />
      <DeparturesBoard />
      <RouteMap />
      <BaggageTags />
      <LandingCta />
    </div>
  )
}

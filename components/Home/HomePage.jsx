'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { revealOnScroll, safeRevert } from '@/lib/gsapSafe'
import QuoteForm from '@/components/quote/QuoteForm'
import AirlineLogoPin from './AirlineLogoPin'
import HowItWorks from './HowItWorks'
import HomeAbout from './HomeAbout'
import HomeFaq from './HomeFaq'
import HomeTestimonials from './HomeTestimonials'
import HomeCta from './HomeCta'
import { occasions } from '@/data/occasions'

const PREVIEW_W = 220
const PREVIEW_H = 150
const LERP = 0.15
const OFFSET_X = 24
const OFFSET_Y = 18

export default function HomePage() {
  const rootRef = useRef(null)
  const gridRef = useRef(null)
  const previewRef = useRef(null)
  const rafRef = useRef(0)
  const targetRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })
  const enabledRef = useRef(false)
  const reducedRef = useRef(false)
  const visibleRef = useRef(false)

  const [activeIndex, setActiveIndex] = useState(-1)
  const [previewEnabled, setPreviewEnabled] = useState(false)
  const [previewVisible, setPreviewVisible] = useState(false)

  useEffect(() => {
    const root = rootRef.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const hero = root.querySelectorAll('[data-reveal="hero"]')
    const form = root.querySelectorAll('[data-reveal="form"]')

    const ctx = gsap.context(() => {
      revealOnScroll(hero, { vars: { y: 20, stagger: 0.08, duration: 0.7 } })
      revealOnScroll(form, { vars: { y: 28, delay: 0.1, duration: 0.8, stagger: 0 } })
    }, root)

    return () => safeRevert(ctx, [...hero, ...form])
  }, [])

  useEffect(() => {
    const mqHover = window.matchMedia('(hover: hover) and (pointer: fine)')
    const mqWidth = window.matchMedia('(min-width: 1024px)')
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const sync = () => {
      const on = mqHover.matches && mqWidth.matches
      enabledRef.current = on
      reducedRef.current = mqMotion.matches
      setPreviewEnabled(on)
      if (!on) {
        visibleRef.current = false
        setPreviewVisible(false)
        setActiveIndex(-1)
      }
    }

    sync()
    mqHover.addEventListener('change', sync)
    mqWidth.addEventListener('change', sync)
    mqMotion.addEventListener('change', sync)
    return () => {
      mqHover.removeEventListener('change', sync)
      mqWidth.removeEventListener('change', sync)
      mqMotion.removeEventListener('change', sync)
    }
  }, [])

  useEffect(() => {
    if (!previewEnabled) return undefined

    const tick = () => {
      const preview = previewRef.current
      if (preview) {
        const factor = reducedRef.current ? 1 : LERP
        currentRef.current.x += (targetRef.current.x - currentRef.current.x) * factor
        currentRef.current.y += (targetRef.current.y - currentRef.current.y) * factor
        const scale = reducedRef.current ? 1 : visibleRef.current ? 1 : 0.9
        preview.style.transform = `translate3d(${currentRef.current.x}px, ${currentRef.current.y}px, 0) scale(${scale})`
      }
      rafRef.current = window.requestAnimationFrame(tick)
    }

    rafRef.current = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(rafRef.current)
  }, [previewEnabled])

  function clampToGrid(clientX, clientY) {
    const grid = gridRef.current
    if (!grid) return { x: 0, y: 0 }
    const rect = grid.getBoundingClientRect()
    let x = clientX - rect.left + OFFSET_X
    let y = clientY - rect.top + OFFSET_Y
    const maxX = Math.max(0, rect.width - PREVIEW_W - 8)
    const maxY = Math.max(0, rect.height - PREVIEW_H - 8)
    x = Math.min(Math.max(8, x), maxX)
    y = Math.min(Math.max(8, y), maxY)
    return { x, y }
  }

  function onItemEnter(index, event) {
    if (!enabledRef.current) return
    const pos = clampToGrid(event.clientX, event.clientY)
    targetRef.current = pos
    if (!visibleRef.current) {
      currentRef.current = { ...pos }
      const preview = previewRef.current
      if (preview) {
        preview.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${reducedRef.current ? 1 : 0.9})`
      }
    }
    setActiveIndex(index)
    visibleRef.current = true
    setPreviewVisible(true)
  }

  function onItemMove(event) {
    if (!enabledRef.current || !visibleRef.current) return
    targetRef.current = clampToGrid(event.clientX, event.clientY)
  }

  function onGridLeave() {
    if (!enabledRef.current) return
    visibleRef.current = false
    setPreviewVisible(false)
    setActiveIndex(-1)
  }

  const hovering = activeIndex >= 0

  return (
    <div ref={rootRef}>
      <section className="relative overflow-hidden bg-ink-950">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-12 sm:px-6 sm:pb-16 sm:pt-16 lg:px-8">
          <div className="max-w-2xl">
            <p data-reveal="hero" className="font-display text-[2.35rem] font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.35rem]">
              Get seats together for your whole group.
            </p>
            <p data-reveal="hero" className="mt-5 max-w-lg text-[1.05rem] leading-7 text-ink-300">
              Weddings, teams, schools, and events — one route, shared flights, a free quote from a human desk.
            </p>
            <p data-reveal="hero" className="mt-6 text-sm text-ink-400">
              Groups of 10+ · Worldwide routes · Reply within one business day
            </p>
          </div>

          <div id="quote" data-reveal="form" className="relative mt-10 scroll-mt-28">
            <QuoteForm />
          </div>
        </div>
      </section>

      <HomeAbout />
      <HowItWorks />
      <AirlineLogoPin />
      <HomeTestimonials />
      <HomeFaq />

      <section className="border-y border-line bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl">Travel by occasion</h2>
              <p className="mt-3 max-w-xl text-base leading-7 text-ink-600">
                Choose the trip type that matches your group. We tune holds and timelines to it.
              </p>
            </div>
            <Link href="/occasions" className="text-sm font-semibold text-ink-900 underline-offset-4 hover:underline">
              All occasions
            </Link>
          </div>

          <div ref={gridRef} className="relative mt-10" onMouseLeave={onGridLeave}>
            <ul className="grid gap-0 border-t border-line sm:grid-cols-2">
              {occasions.slice(0, 8).map((item, index) => {
                const isActive = activeIndex === index
                const dimOthers = hovering && !isActive
                return (
                  <li key={item.slug} className="border-b border-line">
                    <Link
                      href={`/occasions/${item.slug}`}
                      onMouseEnter={(e) => onItemEnter(index, e)}
                      onMouseMove={onItemMove}
                      className={`group flex items-start justify-between gap-4 px-1 py-5 transition sm:px-3 ${
                        dimOthers ? 'opacity-45' : 'opacity-100'
                      }`}
                    >
                      <span>
                        <span
                          className={`block font-display text-lg font-semibold transition-colors ${
                            isActive ? 'text-ink-950' : 'text-ink-950 group-hover:text-ink-800'
                          }`}
                        >
                          {item.title}
                        </span>
                        <span className="mt-1 block max-w-md text-sm leading-6 text-ink-600">{item.short}</span>
                      </span>
                      <span
                        className={`mt-1 shrink-0 text-ink-400 transition duration-300 group-hover:text-ink-700 ${
                          isActive ? 'translate-x-1' : 'group-hover:translate-x-1'
                        }`}
                        aria-hidden
                      >
                        →
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>

            {previewEnabled && (
              <div
                ref={previewRef}
                className={`pointer-events-none absolute top-0 left-0 z-30 h-[150px] w-[220px] overflow-hidden rounded-xl border border-ink-200/80 bg-ink-100 shadow-[0_18px_40px_-18px_rgba(15,34,51,0.45)] transition-opacity duration-300 ease-out ${
                  previewVisible ? 'opacity-100' : 'opacity-0'
                }`}
                aria-hidden
              >
                {occasions.slice(0, 8).map((item, index) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={item.slug}
                    src={item.image}
                    alt=""
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ease-out ${
                      activeIndex === index ? 'opacity-100' : 'opacity-0'
                    }`}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.parentElement?.style.setProperty(
                        'background',
                        'linear-gradient(135deg, #e5ebf2 0%, #c7d2e0 50%, #9aadc4 100%)',
                      )
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <HomeCta />
    </div>
  )
}

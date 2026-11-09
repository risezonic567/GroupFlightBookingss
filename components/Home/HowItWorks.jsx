'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ensureGsapPlugins, revealOnScroll, safeRevert } from '@/lib/gsapSafe'

const steps = [
  {
    title: 'Get your Quote',
    copy: 'Drop us an email or call our dedicated and friendly experts to get your group quote.',
  },
  {
    title: 'Review the quote',
    copy: 'Reach out to your group and agree your quote. Check if anything extra is required.',
  },
  {
    title: 'Book your trip',
    copy: 'Call our dedicated Groups team to book your seats and add any extras.',
  },
  {
    title: 'Add names / split booking',
    copy: 'Provide names later and even split your booking into smaller groups if you are a tour operator or travel agent.',
  },
  {
    title: 'Check-In',
    copy: 'Once all names are provided, your passengers can check in and add extras to their booking.',
  },
  {
    title: 'Travel and enjoy your group trip',
    copy: 'Everyone on the same flights — clear docs, fewer surprises, trip day done right.',
  },
]

/** Visual grid order: 1-2, then 4-3, then 5-6 (zig-zag reading path). */
const DESKTOP_SLOTS = [0, 1, 3, 2, 4, 5]

function StepIcon({ index }) {
  const common = {
    fill: 'none',
    stroke: '#ea580c',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }

  const icons = [
    <g key="1">
      <path d="M8 8.5h12a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-5l-4 3.2V20.5H8a3 3 0 0 1-3-3v-6a3 3 0 0 1 3-3z" {...common} />
      <path d="M14.2 12.2c-.7-.5-1.7-.4-2.2.3-.4.6-.2 1.3.4 1.7l1.6 1c.7.4.9 1.2.5 1.8-.5.7-1.5.8-2.2.3" {...common} />
      <path d="M13.2 11.4v.6M13.2 17.2v.6" {...common} />
    </g>,
    <g key="2">
      <path d="M11 18.5h7.2a2 2 0 0 0 1.9-1.4l1.3-4.2a1.6 1.6 0 0 0-1.5-2.1H16V8.8A2.3 2.3 0 0 0 13.7 6.5c-.8 0-1.2.6-1.2 1.4v2.1L9.8 14.2" {...common} />
      <path d="M9.8 14.2H8.2A1.7 1.7 0 0 0 6.5 16v1a1.7 1.7 0 0 0 1.7 1.5h1.6" {...common} />
    </g>,
    <g key="3">
      <path d="M9 14.5a5 5 0 0 1 10 0" {...common} />
      <path d="M9 14.5v2.2a1.6 1.6 0 0 0 1.6 1.6H12" {...common} />
      <path d="M19 14.5v2.2a1.6 1.6 0 0 1-1.6 1.6H16.2" {...common} />
      <circle cx="14" cy="18.2" r="1.1" {...common} />
      <path d="M11.2 10.8c.7-1.2 1.9-2 2.8-2s2.1.8 2.8 2" {...common} />
    </g>,
    <g key="4">
      <rect x="9" y="8" width="10" height="13" rx="2" {...common} />
      <path d="M12 8.2V7.4a1.4 1.4 0 0 1 1.4-1.4h1.2A1.4 1.4 0 0 1 16 7.4v.8" {...common} />
      <path d="M11.5 13h5M11.5 16h5M11.5 19h3.2" {...common} />
    </g>,
    <g key="5">
      <rect x="10.5" y="6.5" width="7" height="15" rx="1.6" {...common} />
      <path d="M12.4 10.2h3.2v3.2h-3.2z" {...common} />
      <path d="M12.6 16.2l1.1 1.1 2.2-2.3" {...common} />
      <path d="M12.8 8.2h2.4" {...common} />
    </g>,
    <g key="6">
      <circle cx="14" cy="14" r="6.2" {...common} />
      <path d="M11.2 13.2h.1M16.8 13.2h.1" {...common} strokeWidth={2.4} />
      <path d="M11.2 15.8c.8 1.2 1.8 1.8 2.8 1.8s2-.6 2.8-1.8" {...common} />
    </g>,
  ]

  return (
    <svg viewBox="0 0 28 28" className="h-9 w-9 sm:h-10 sm:w-10" aria-hidden="true">
      {icons[index]}
    </svg>
  )
}

/** Orthogonal elbows through icon centers only — never across text blocks. */
function buildSmoothPath(points) {
  if (points.length < 2) return ''
  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`
  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1]
    const curr = points[i]
    const xChanged = Math.abs(prev.x - curr.x) > 6
    const yChanged = Math.abs(prev.y - curr.y) > 6
    if (xChanged && yChanged) {
      // Prefer vertical-first on same-side drops (2→3, 4→5), horizontal-first on row crossings
      const verticalFirst = Math.abs(prev.x - curr.x) < 120
      if (verticalFirst) {
        d += ` L ${prev.x.toFixed(1)} ${curr.y.toFixed(1)} L ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`
      } else {
        d += ` L ${curr.x.toFixed(1)} ${prev.y.toFixed(1)} L ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`
      }
    } else {
      d += ` L ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`
    }
  }
  return d
}

export default function HowItWorks() {
  const sectionRef = useRef(null)
  const desktopRef = useRef(null)
  const pathRef = useRef(null)
  const pathBgRef = useRef(null)
  const iconRefs = useRef([])
  const hoverLock = useRef(false)
  const [active, setActive] = useState(0)
  const [pathD, setPathD] = useState('')
  const [svgSize, setSvgSize] = useState({ w: 0, h: 0 })

  function setIconRef(stepIndex, node) {
    iconRefs.current[stepIndex] = node
  }

  function activate(index, fromHover = false) {
    if (fromHover) hoverLock.current = true
    setActive(index)
  }

  function releaseHover() {
    hoverLock.current = false
  }

  const redrawPath = () => {
    const root = desktopRef.current
    if (!root) return
    const rootBox = root.getBoundingClientRect()
    // Journey order through icon centers: 1→2→3→4→5→6
    const journey = [0, 1, 2, 3, 4, 5]
    const points = journey
      .map((stepIndex) => {
        const el = iconRefs.current[stepIndex]
        if (!el) return null
        const box = el.getBoundingClientRect()
        return {
          x: box.left - rootBox.left + box.width / 2,
          y: box.top - rootBox.top + box.height / 2,
        }
      })
      .filter(Boolean)

    if (points.length < 2) return
    const next = buildSmoothPath(points)
    setSvgSize((prev) =>
      prev.w === rootBox.width && prev.h === rootBox.height ? prev : { w: rootBox.width, h: rootBox.height },
    )
    setPathD((prev) => (prev === next ? prev : next))
  }

  useLayoutEffect(() => {
    redrawPath()
    const root = desktopRef.current
    if (!root || typeof ResizeObserver === 'undefined') return undefined
    const ro = new ResizeObserver(() => redrawPath())
    ro.observe(root)
    window.addEventListener('resize', redrawPath)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', redrawPath)
    }
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    const path = pathRef.current
    const pathBg = pathBgRef.current
    if (!section) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    ensureGsapPlugins()
    const desktopNodes = section.querySelectorAll('[data-steps-desktop] [data-step-node]')
    const mobileNodes = section.querySelectorAll('[data-steps-mobile] [data-step-node]')
    const isDesktop = window.matchMedia('(min-width: 768px)').matches
    const visibleNodes = isDesktop ? desktopNodes : mobileNodes

    const ctx = gsap.context(() => {
      revealOnScroll(visibleNodes, {
        trigger: section,
        vars: { y: 22, scale: 0.98, stagger: 0.08, start: 'top 85%' },
      })

      if (isDesktop && path && pathBg && pathD) {
        const length = path.getTotalLength()
        gsap.set([path, pathBg], {
          strokeDasharray: length,
          strokeDashoffset: length,
        })
        // Static guide (faint full route)
        gsap.set(pathBg, { strokeDashoffset: 0, opacity: 0.35 })

        gsap.to(path, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'bottom 55%',
            scrub: 0.85,
            onUpdate: (self) => {
              if (hoverLock.current) return
              const idx = Math.min(steps.length - 1, Math.floor(self.progress * steps.length))
              setActive(idx)
            },
          },
        })
      }

      // Mobile: glow step when its card enters view
      if (!isDesktop) {
        mobileNodes.forEach((node, index) => {
          ScrollTrigger.create({
            trigger: node,
            start: 'top 60%',
            end: 'bottom 40%',
            onEnter: () => {
              if (!hoverLock.current) setActive(index)
            },
            onEnterBack: () => {
              if (!hoverLock.current) setActive(index)
            },
          })
        })
      }
    }, section)

    const refreshId = window.setTimeout(() => {
      redrawPath()
      ScrollTrigger.refresh()
    }, 120)

    return () => {
      window.clearTimeout(refreshId)
      safeRevert(ctx, visibleNodes)
    }
  }, [pathD])

  return (
    <section ref={sectionRef} className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">Next steps</h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-ink-500">
          Scroll to travel the path — numbers glow with progress. Hover any step anytime.
        </p>

        {/* Mobile */}
        <ol data-steps-mobile className="relative mt-12 space-y-8 md:hidden">
          <span className="absolute bottom-3 left-[27px] top-3 w-px border-l border-dashed border-ink-200" aria-hidden="true" />
          {steps.map((step, index) => {
            const selected = active === index
            return (
              <li key={step.title}>
                <button
                  type="button"
                  data-step-node
                  onClick={() => activate(index, true)}
                  className="relative flex w-full items-start gap-4 text-left"
                >
                  <span
                    className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border bg-white transition duration-300 ${
                      selected
                        ? 'border-ember-500 shadow-[0_0_0_6px_rgba(234,88,12,0.12),0_12px_28px_-10px_rgba(234,88,12,0.45)]'
                        : 'border-ink-200'
                    }`}
                  >
                    <StepIcon index={index} />
                  </span>
                  <span className="min-w-0 pt-1">
                    <span className="block text-base font-bold text-ink-900">
                      <span className={`transition ${selected ? 'text-ember-600 drop-shadow-[0_0_8px_rgba(234,88,12,0.55)]' : 'text-ember-600'}`}>
                        {index + 1}.
                      </span>{' '}
                      {step.title}
                      {index < 5 ? ':' : ''}
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-ink-500">{step.copy}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>

        {/* Desktop — icons face the center so the path never crosses copy */}
        <div
          ref={desktopRef}
          data-steps-desktop
          className="relative mt-16 hidden md:block"
          onMouseLeave={releaseHover}
        >
          {pathD && svgSize.w > 0 && (
            <svg
              className="pointer-events-none absolute inset-0 z-0"
              width={svgSize.w}
              height={svgSize.h}
              viewBox={`0 0 ${svgSize.w} ${svgSize.h}`}
              aria-hidden="true"
            >
              <path
                ref={pathBgRef}
                d={pathD}
                fill="none"
                stroke="#d7e3f0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                ref={pathRef}
                d={pathD}
                fill="none"
                stroke="#7dd3fc"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}

          <div className="relative z-10 grid grid-cols-2 gap-x-16 gap-y-20 lg:gap-x-24 lg:gap-y-24">
            {DESKTOP_SLOTS.map((stepIndex, slot) => {
              const step = steps[stepIndex]
              const selected = active === stepIndex
              const isRightCol = slot % 2 === 1
              // Icons toward center: left col = icon on right, right col = icon on left
              const iconTowardCenter = isRightCol ? 'flex-row' : 'flex-row-reverse'
              const textAlign = isRightCol ? 'text-left' : 'text-right'
              const justify = isRightCol ? 'justify-self-start' : 'justify-self-end'

              return (
                <button
                  key={step.title}
                  type="button"
                  data-step-node
                  onMouseEnter={() => activate(stepIndex, true)}
                  onFocus={() => activate(stepIndex, true)}
                  onClick={() => activate(stepIndex, true)}
                  className={`group flex max-w-[340px] items-start gap-4 lg:max-w-[380px] lg:gap-5 ${iconTowardCenter} ${justify}`}
                >
                  <span
                    ref={(node) => setIconRef(stepIndex, node)}
                    className={`relative z-10 flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-full border bg-white transition duration-300 lg:h-[96px] lg:w-[96px] ${
                      selected
                        ? 'border-ember-500 shadow-[0_0_0_8px_rgba(234,88,12,0.12),0_16px_36px_-12px_rgba(234,88,12,0.5)] scale-[1.05]'
                        : 'border-ink-200 group-hover:border-ember-400'
                    }`}
                  >
                    <StepIcon index={stepIndex} />
                  </span>
                  <span className={`min-w-0 pt-2 ${textAlign}`}>
                    <span className="block text-lg font-bold leading-snug text-ink-900 lg:text-xl">
                      <span
                        className={`inline-block transition duration-300 ${
                          selected
                            ? 'text-ember-600 drop-shadow-[0_0_10px_rgba(234,88,12,0.65)]'
                            : 'text-ember-600'
                        }`}
                      >
                        {stepIndex + 1}.
                      </span>{' '}
                      {step.title}
                      {stepIndex < 5 ? ':' : ''}
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-ink-500 lg:text-[15px]">{step.copy}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

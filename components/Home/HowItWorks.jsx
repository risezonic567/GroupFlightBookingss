'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ensureGsapPlugins, revealOnScroll, safeRevert } from '@/lib/gsapSafe'

const NODE_SIZE = 64
const NODE_SIZE_MOBILE = 56
const TEXT_BLOCK_H = 128
const TEXT_NODE_GAP = 12
const WAVE_VIEWBOX_W = 600
const WAVE_VIEWBOX_H = 120
/** Top-row node centre Y — must match SVG top + peak (y=0). */
const TOP_NODE_CENTER_Y = TEXT_BLOCK_H + TEXT_NODE_GAP + NODE_SIZE / 2
const WAVE_SVG_TOP = TOP_NODE_CENTER_Y
const BOTTOM_NODE_CENTER_Y = TOP_NODE_CENTER_Y + WAVE_VIEWBOX_H
const TOP_NODE_TOP = TOP_NODE_CENTER_Y - NODE_SIZE / 2
const BOTTOM_NODE_TOP = BOTTOM_NODE_CENTER_Y - NODE_SIZE / 2
const DESKTOP_HEIGHT = BOTTOM_NODE_TOP + NODE_SIZE + TEXT_NODE_GAP + TEXT_BLOCK_H + 24
const WAVE_CTRL = 50
const NAVY = '#00338D'

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

const WAVE_POINTS = [
  { x: 50, y: 0 },
  { x: 150, y: 120 },
  { x: 250, y: 0 },
  { x: 350, y: 120 },
  { x: 450, y: 0 },
  { x: 550, y: 120 },
]

function buildWavePath(points) {
  if (points.length < 2) return ''
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1]
    const curr = points[i]
    d += ` C ${prev.x + WAVE_CTRL} ${prev.y}, ${curr.x - WAVE_CTRL} ${curr.y}, ${curr.x} ${curr.y}`
  }
  return d
}

const WAVE_PATH_D = buildWavePath(WAVE_POINTS)

function StepIcon({ index, active }) {
  const common = {
    fill: 'none',
    stroke: active ? '#c2410c' : '#ea580c',
    strokeWidth: 1.85,
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
    <svg viewBox="0 0 28 28" className="h-8 w-8" aria-hidden="true">
      {icons[index]}
    </svg>
  )
}

function nodeClasses(selected, passed, muted) {
  if (selected) {
    return 'scale-[1.06] border-ember-500 shadow-[0_0_0_6px_rgba(234,88,12,0.14),0_12px_28px_-10px_rgba(234,88,12,0.45)]'
  }
  if (passed) {
    return 'border-[#00338D]/55'
  }
  return `border-ink-200 group-hover:scale-[1.03] group-hover:border-ember-400 ${muted ? 'opacity-90' : ''}`
}

export default function HowItWorks() {
  const sectionRef = useRef(null)
  const pathRef = useRef(null)
  const activeRef = useRef(0)
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const [motionOff, setMotionOff] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      const path = pathRef.current
      if (path) {
        // pathLength="1" → dash units are normalized 0..1 (avoids getTotalLength mismatch)
        path.style.strokeDasharray = '1 2'
        path.style.strokeDashoffset = '0'
      }
      setMotionOff(true)
      setActive(0)
      setProgress(1)
      return undefined
    }

    ensureGsapPlugins()
    const isDesktop = window.matchMedia('(min-width: 768px)').matches
    const desktopNodes = section.querySelectorAll('[data-steps-desktop] [data-step-node]')
    const mobileNodes = section.querySelectorAll('[data-steps-mobile] [data-step-node]')
    const visibleNodes = isDesktop ? desktopNodes : mobileNodes
    const path = pathRef.current

    const ctx = gsap.context(() => {
      revealOnScroll(visibleNodes, {
        trigger: section,
        vars: { y: 22, stagger: 0.08, start: 'top 85%' },
      })

      if (isDesktop && path) {
        // Root cause of "100% but stops at step 5":
        // getTotalLength() is user-space, while non-scaling-stroke can make
        // dasharray resolve in screen px — dash was shorter than the real stroke.
        // pathLength="1" normalizes dash/offset to the full path (0 → 1).
        path.style.strokeDasharray = '1 2'
        path.style.strokeDashoffset = '1'

        // Start only once the section is clearly on screen, then fill fast
        // over a short scroll distance (avoids "already half-full on arrival").
        ScrollTrigger.create({
          trigger: section,
          start: 'top 45%',
          end: '+=420',
          scrub: 0.25,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress
            path.style.strokeDashoffset = String(1 - p)
            setProgress(p)
            const next = Math.min(5, Math.floor(p * 5 + 1e-6))
            if (next !== activeRef.current) {
              activeRef.current = next
              setActive(next)
            }
          },
          onLeave: () => {
            path.style.strokeDashoffset = '0'
            setProgress(1)
            activeRef.current = 5
            setActive(5)
          },
          onLeaveBack: () => {
            path.style.strokeDashoffset = '1'
            setProgress(0)
            activeRef.current = 0
            setActive(0)
          },
        })
      }

      if (!isDesktop) {
        mobileNodes.forEach((node, index) => {
          ScrollTrigger.create({
            trigger: node,
            start: 'top 60%',
            end: 'bottom 40%',
            onEnter: () => {
              activeRef.current = index
              setActive(index)
            },
            onEnterBack: () => {
              activeRef.current = index
              setActive(index)
            },
          })
        })
      }
    }, section)

    const refreshId = window.setTimeout(() => {
      ScrollTrigger.refresh()
    }, 120)

    return () => {
      window.clearTimeout(refreshId)
      safeRevert(ctx, visibleNodes)
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-x-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div
        className="pointer-events-none absolute -left-24 top-24 h-64 w-64 rounded-full bg-ember-500/5 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-[#00338D]/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">Next steps</h2>
          <p className="mt-3 text-base leading-7 text-ink-500">
            Scroll to travel the path — each step lights up as you go.
          </p>
          <p className="mt-4 text-sm font-semibold tabular-nums text-ink-400">
            Step <span className="text-ember-600">{active + 1}</span> / {steps.length}
            <span className="ml-3 text-ink-300">{Math.round(progress * 100)}%</span>
          </p>
        </div>

        {/* Mobile */}
        <ol data-steps-mobile className="relative mt-12 space-y-8 md:hidden">
          <span
            className="absolute bottom-3 left-[27px] top-3 w-px border-l border-dashed border-ink-200"
            aria-hidden="true"
          />
          {steps.map((step, index) => {
            const selected = active === index
            const passed = motionOff ? index !== active : index < active
            return (
              <li key={step.title}>
                <div
                  data-step-node
                  role="presentation"
                  onClick={() => {
                    activeRef.current = index
                    setActive(index)
                  }}
                  className="group relative flex w-full cursor-pointer items-start gap-4 text-left"
                >
                  <span
                    className={`relative z-10 flex shrink-0 items-center justify-center rounded-full border-2 bg-white transition duration-300 ${nodeClasses(
                      selected,
                      passed,
                      !selected && !passed,
                    )}`}
                    style={{ width: NODE_SIZE_MOBILE, height: NODE_SIZE_MOBILE }}
                  >
                    {selected && (
                      <span
                        className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(234,88,12,0.14),transparent_68%)]"
                        aria-hidden
                      />
                    )}
                    <StepIcon index={index} active={selected} />
                  </span>
                  <span className="min-w-0 pt-1">
                    <span className="block font-display text-base font-bold text-ink-900">
                      <span className="text-ember-600">{index + 1}.</span> {step.title}
                      {index < 5 ? ':' : ''}
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-ink-500">{step.copy}</span>
                  </span>
                </div>
              </li>
            )
          })}
        </ol>

        {/* Desktop wave */}
        <div
          data-steps-desktop
          className="relative mx-auto mt-16 hidden w-full md:block"
          style={{ height: DESKTOP_HEIGHT, maxWidth: '72rem' }}
        >
          <svg
            className="pointer-events-none absolute left-0 z-0 w-full overflow-visible"
            style={{ top: WAVE_SVG_TOP, height: WAVE_VIEWBOX_H }}
            viewBox={`0 0 ${WAVE_VIEWBOX_W} ${WAVE_VIEWBOX_H}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d={WAVE_PATH_D}
              fill="none"
              stroke="#c5d0e0"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            <path
              ref={pathRef}
              d={WAVE_PATH_D}
              fill="none"
              stroke={NAVY}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength="1"
            />
          </svg>

          <ol className="relative z-10 m-0 h-full w-full list-none p-0">
            {steps.map((step, index) => {
              const selected = active === index
              const passed = motionOff ? index !== active : index < active
              const isTop = index % 2 === 0
              const leftPct = ((index + 0.5) / steps.length) * 100
              const nodeTop = isTop ? TOP_NODE_TOP : BOTTOM_NODE_TOP

              return (
                <li
                  key={step.title}
                  className="absolute block h-full w-[16%] min-w-[150px]"
                  style={{
                    left: `${leftPct}%`,
                    top: 0,
                    transform: 'translateX(-50%)',
                  }}
                >
                  <div data-step-node className="group relative h-full w-full">
                    {/* Fixed node Y so centres sit on the wave peaks/valleys */}
                    <span
                      className={`absolute left-1/2 z-10 flex -translate-x-1/2 items-center justify-center rounded-full border-2 bg-white transition duration-300 ${nodeClasses(
                        selected,
                        passed,
                        !selected && !passed,
                      )}`}
                      style={{ top: nodeTop, width: NODE_SIZE, height: NODE_SIZE }}
                    >
                      {selected && (
                        <span
                          className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(234,88,12,0.14),transparent_68%)]"
                          aria-hidden
                        />
                      )}
                      <StepIcon index={index} active={selected} />
                    </span>

                    <span
                      className={`absolute left-0 right-0 flex flex-col text-center ${
                        isTop ? 'justify-end' : 'justify-start'
                      }`}
                      style={
                        isTop
                          ? { top: 0, height: TEXT_BLOCK_H }
                          : {
                              top: BOTTOM_NODE_TOP + NODE_SIZE + TEXT_NODE_GAP,
                              height: TEXT_BLOCK_H,
                            }
                      }
                    >
                      <span className="font-display text-base font-bold text-ink-900">
                        <span className="text-ember-600">{index + 1}.</span> {step.title}
                        {index < 5 ? ':' : ''}
                      </span>
                      <span className="mt-1 line-clamp-3 text-sm leading-6 text-ink-500">{step.copy}</span>
                    </span>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}

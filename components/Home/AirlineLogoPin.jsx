'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import airlines from '@/data/airlines'
import { ensureGsapPlugins } from '@/lib/gsapSafe'

/**
 * Root cause of the white-screen: multiple ScrollTriggers each used pin:true
 * on the same section (orbit + every logo face). That stacks pin-spacers and
 * can crash the page when the section activates.
 *
 * Fix: one timeline, one ScrollTrigger, one pin.
 */
export default function AirlineLogoPin() {
  const sectionRef = useRef(null)
  const orbitRef = useRef(null)
  const faceRefs = useRef([])

  useEffect(() => {
    const section = sectionRef.current
    const orbit = orbitRef.current
    if (!section || !orbit) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return undefined

    ensureGsapPlugins()

    let ctx
    let refreshId
    let disposed = false

    const setup = () => {
      if (disposed || !sectionRef.current || !orbitRef.current) return

      const faces = faceRefs.current.filter(Boolean)
      const count = airlines.length || 1

      try {
        ctx = gsap.context(() => {
          faces.forEach((el, i) => {
            gsap.set(el, {
              rotation: -((360 / count) * i),
              transformOrigin: '50% 50%',
            })
          })

          gsap.set(orbit, { rotation: 0, transformOrigin: '50% 50%' })

          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: () => `+=${Math.max(window.innerHeight * 1.5, 800)}`,
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              pinSpacing: true,
            },
          })

          tl.fromTo(orbit, { rotation: 0 }, { rotation: 360 }, 0)

          faces.forEach((el, i) => {
            const start = -((360 / count) * i)
            tl.fromTo(el, { rotation: start }, { rotation: start - 360 }, 0)
          })
        }, section)

        refreshId = window.setTimeout(() => {
          if (!disposed) ScrollTrigger.refresh()
        }, 100)
      } catch (err) {
        console.error('[AirlineLogoPin] scroll setup failed', err)
        try {
          ctx?.revert()
        } catch {
          /* ignore */
        }
      }
    }

    // Wait a frame so layout/pin math is stable (Strict Mode + images)
    const raf = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(setup)
    })

    return () => {
      disposed = true
      window.cancelAnimationFrame(raf)
      if (refreshId) window.clearTimeout(refreshId)
      try {
        ctx?.revert()
      } catch (err) {
        console.error('[AirlineLogoPin] cleanup failed', err)
      }
    }
  }, [])

  const count = airlines.length

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-ink-950 text-white">
      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">
            Groups fly with carriers you already know
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-ink-300">
            Scroll to turn the circle — our brand stays centered while airline partners complete one full orbit.
          </p>
        </div>

        <div className="gfb-orbit-stage relative mx-auto mt-10 h-[340px] w-[340px] sm:mt-12 sm:h-[460px] sm:w-[460px] lg:h-[520px] lg:w-[520px]">
          <style>{`
            .gfb-orbit-stage { --orbit-r: 132px; }
            @media (min-width: 640px) { .gfb-orbit-stage { --orbit-r: 178px; } }
            @media (min-width: 1024px) { .gfb-orbit-stage { --orbit-r: 200px; } }
          `}</style>

          <div className="pointer-events-none absolute inset-[10%] rounded-full border border-white/10" aria-hidden />
          <div
            className="pointer-events-none absolute inset-[26%] rounded-full border border-dashed border-white/10"
            aria-hidden
          />

          <div className="absolute left-1/2 top-1/2 z-20 flex h-[36%] w-[36%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white p-3 sm:p-4">
            <Image
              src="/images/logo-nav.jpeg"
              alt="Group Flight Bookings"
              width={220}
              height={72}
              className="h-auto w-full object-contain"
            />
          </div>

          <div ref={orbitRef} className="absolute inset-0 will-change-transform">
            {airlines.map((airline, index) => {
              const angle = (360 / count) * index
              return (
                <div
                  key={airline.name}
                  className="absolute left-1/2 top-1/2 h-0 w-0"
                  style={{
                    transform: `rotate(${angle}deg) translateY(calc(-1 * var(--orbit-r)))`,
                  }}
                >
                  <div
                    ref={(el) => {
                      faceRefs.current[index] = el
                    }}
                    className="flex h-14 w-14 flex-col items-center justify-center rounded-full border border-white/15 bg-white will-change-transform sm:h-16 sm:w-16"
                    style={{ marginLeft: '-50%', marginTop: '-50%' }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={airline.logo}
                      alt={airline.name}
                      className="h-8 w-8 object-contain sm:h-9 sm:w-9"
                      loading="lazy"
                      title={airline.name}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

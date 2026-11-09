import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let registered = false

export function ensureGsapPlugins() {
  if (registered || typeof window === 'undefined') return
  gsap.registerPlugin(ScrollTrigger)
  registered = true
}

/**
 * Safe reveal for React.
 * - Uses fromTo + clearProps so Strict Mode revert cannot leave opacity:0 stuck
 * - ScrollTrigger uses once + immediateRender:false
 * - Mount-only reveals (no trigger) use immediateRender:true then clear transforms
 */
export function revealOnScroll(targets, { trigger, vars = {} } = {}) {
  ensureGsapPlugins()
  const elements = gsap.utils.toArray(targets)
  if (!elements.length) return null

  const hasTrigger = Boolean(trigger)

  // Hard fallback: never leave content invisible if ST/React cleanup races
  const safety = window.setTimeout(() => {
    gsap.set(elements, { clearProps: 'all' })
  }, 1800)

  const tween = gsap.fromTo(
    elements,
    { autoAlpha: 0, y: vars.y ?? 24, scale: vars.scale ?? 1 },
    {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: vars.duration ?? 0.7,
      stagger: vars.stagger ?? 0.1,
      delay: vars.delay ?? 0,
      ease: vars.ease ?? 'power2.out',
      immediateRender: !hasTrigger,
      overwrite: 'auto',
      scrollTrigger: hasTrigger
        ? {
            trigger,
            start: vars.start ?? 'top 85%',
            once: true,
            toggleActions: 'play none none none',
          }
        : undefined,
      onComplete: () => {
        window.clearTimeout(safety)
        gsap.set(elements, { clearProps: 'transform' })
      },
    },
  )

  tween._gfbSafety = safety
  return tween
}

export function safeRevert(ctx, restoreTargets) {
  try {
    ctx?.revert()
  } finally {
    if (restoreTargets) {
      gsap.set(restoreTargets, { clearProps: 'all' })
    }
  }
}

export function clearRevealSafety(tween) {
  if (tween?._gfbSafety) window.clearTimeout(tween._gfbSafety)
}

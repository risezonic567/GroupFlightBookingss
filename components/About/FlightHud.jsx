'use client'

import { forwardRef, useImperativeHandle, useRef } from 'react'

const FlightHud = forwardRef(function FlightHud(_, ref) {
  const stageRef = useRef(null)
  const altRef = useRef(null)
  const dotRef = useRef(null)
  const altitude = useRef(0)

  useImperativeHandle(ref, () => ({
    update({ progress, stage }) {
      if (stageRef.current) stageRef.current.textContent = stage
      if (dotRef.current) {
        dotRef.current.style.top = `${Math.min(1, Math.max(0, progress)) * 240}px`
      }

      const p = Math.min(1, Math.max(0, progress))
      const climb = Math.min(1, p / 0.25)
      const descent = p > 0.9 ? (1 - p) / 0.1 : 1
      const target = 35000 * climb * Math.max(0, descent)
      altitude.current += (target - altitude.current) * 0.08
      const rounded = Math.round(altitude.current / 100) * 100
      if (altRef.current) {
        altRef.current.textContent = `${rounded.toLocaleString('en-US')} FT`
      }
    },
  }))

  return (
    <aside
      className="pointer-events-none fixed top-1/2 right-6 z-40 hidden -translate-y-1/2 min-[1180px]:block"
      aria-hidden="true"
    >
      <div className="flex items-start gap-3">
        <div className="pt-1 text-right font-mono text-[10px] leading-tight tracking-wide text-ink-500">
          <p ref={stageRef} className="font-semibold text-[#00338D]">
            CHECK-IN
          </p>
          <p ref={altRef} className="mt-1 tabular-nums">
            0 FT
          </p>
        </div>
        <div className="relative h-[240px] w-0.5 bg-ink-200">
          <span
            ref={dotRef}
            className="absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-500 shadow-[0_0_0_4px_rgba(234,88,12,0.2)]"
            style={{ top: 0 }}
          />
        </div>
      </div>
    </aside>
  )
})

export default FlightHud

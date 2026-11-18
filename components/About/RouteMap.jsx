'use client'

/* viewBox is 800x360. Do not change these coordinates, the card is sized by the SVG aspect ratio. */
const NODES = [
  [110, 210],
  [260, 120],
  [420, 190],
  [560, 100],
  [690, 230],
  [380, 300],
]

const ARCS = [
  { id: 'route-a1', d: 'M110 210 Q185 90 260 120' },
  { id: 'route-a2', d: 'M260 120 Q340 40 560 100' },
  { id: 'route-a3', d: 'M110 210 Q260 330 420 190' },
  { id: 'route-a4', d: 'M420 190 Q570 120 690 230' },
  { id: 'route-a5', d: 'M560 100 Q690 120 690 230' },
  { id: 'route-a6', d: 'M420 190 Q380 280 380 300' },
]

/* Only these 4 arcs carry a travelling plane dot. */
const TRAVELERS = [
  { arc: 'route-a1', dur: '5s' },
  { arc: 'route-a3', dur: '6s' },
  { arc: 'route-a4', dur: '5.5s' },
  { arc: 'route-a2', dur: '7s' },
]

export default function RouteMap() {
  return (
    <section data-stage="CRUISING" className="relative py-20 lg:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ember-600">Global by design</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl lg:text-[2.6rem] lg:leading-[1.12]">
            Routes across every region
          </h2>
          <p className="mt-4 text-lg leading-7 text-ink-500">
            The market is global. Whether your party is flying across a region or connecting continents, we focus on
            workable group options and human support.
          </p>
        </div>

        {/* Card: NO fixed height, NO overflow-hidden, NO aspect class. The SVG decides the height. */}
        <div
          className="rounded-3xl border border-[#d3dce6] bg-white p-2.5"
          style={{
            backgroundImage: 'radial-gradient(#b9c6d8 1.2px, transparent 1.6px)',
            backgroundSize: '16px 16px',
          }}
        >
          <svg viewBox="0 0 800 360" className="block h-auto w-full" aria-hidden="true">
            {ARCS.map((arc) => (
              <path
                key={arc.id}
                id={arc.id}
                d={arc.d}
                className="route-arc"
                fill="none"
                stroke="#00338D"
                strokeWidth="1.6"
                strokeDasharray="4 6"
                opacity="0.55"
              />
            ))}

            {NODES.map(([cx, cy]) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="6" fill="#00338D" />
            ))}

            {TRAVELERS.map((t) => (
              <circle key={t.arc} r="5" fill="#ea580c">
                <animateMotion dur={t.dur} repeatCount="indefinite">
                  <mpath href={`#${t.arc}`} />
                </animateMotion>
              </circle>
            ))}
          </svg>
        </div>
      </div>
    </section>
  )
}

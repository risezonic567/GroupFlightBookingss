import Link from 'next/link'
import { occasions } from '@/data/occasions'

export default function OccasionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-bold text-ink-900">Occasions</h1>
      <p className="mt-3 max-w-2xl text-base text-ink-600">
        Every group trip has different timing pressure. Pick your occasion and start a quote with that context already selected.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {occasions.map((o) => (
          <Link
            key={o.slug}
            href={`/occasions/${o.slug}`}
            className="rounded-[24px] border border-ink-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-skyline-600">{o.category}</p>
            <h2 className="mt-2 font-display text-xl font-bold text-ink-900">{o.title}</h2>
            <p className="mt-2 text-sm leading-6 text-ink-500">{o.short}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

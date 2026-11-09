import Link from 'next/link'
import QuoteForm from '@/components/quote/QuoteForm'

export default function OccasionDetailPage({ occasion }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <Link href="/occasions" className="text-sm font-semibold text-skyline-600 hover:text-skyline-700">
        ← All occasions
      </Link>
      <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-skyline-600">{occasion.category}</p>
      <h1 className="mt-2 font-display text-4xl font-bold text-ink-900">{occasion.title}</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-ink-600">{occasion.description}</p>
      <div className="mt-10">
        <QuoteForm defaultOccasion={occasion.title} />
      </div>
    </div>
  )
}

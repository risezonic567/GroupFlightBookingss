import contactDetails from '@/data/contact'
import QuoteForm from '@/components/quote/QuoteForm'

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl font-bold text-ink-900">Contact</h1>
        <p className="mt-3 text-base text-ink-600">Call, email, or send a quote request — same group desk either way.</p>
        <div className="mt-6 space-y-2 text-sm">
          <a href={contactDetails.phoneHref} className="block font-bold text-ink-900 hover:text-skyline-600">
            {contactDetails.phoneDisplay}
          </a>
          <a href={`mailto:${contactDetails.email}`} className="block text-ink-600 hover:text-ink-900">
            {contactDetails.email}
          </a>
        </div>
      </div>
      <div className="mt-10">
        <QuoteForm />
      </div>
    </div>
  )
}

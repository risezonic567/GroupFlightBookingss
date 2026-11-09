import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata({
  title: 'Privacy policy',
  description: 'Privacy policy for Group Flight Bookings.',
  path: '/privacy-policy',
})

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-bold text-ink-900">Privacy policy</h1>
      <p className="mt-5 text-base leading-7 text-ink-600">
        We collect the trip and contact details you submit so our team can respond to your group quote request.
        We do not sell your personal information. Demo contact details on this site may be replaced with production numbers later.
      </p>
      <p className="mt-4 text-base leading-7 text-ink-600">
        For privacy questions, email the address listed on our contact page.
      </p>
    </div>
  )
}

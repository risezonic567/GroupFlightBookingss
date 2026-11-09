import QuoteConfirmation from '@/components/quote/QuoteConfirmation'
import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata({
  title: 'Quote confirmation',
  description: 'Your group flight quote request has been received.',
  path: '/quote-confirmation',
})

export default function Page() {
  return <QuoteConfirmation />
}

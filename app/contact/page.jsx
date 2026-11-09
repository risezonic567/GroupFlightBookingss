import ContactPage from '@/components/Contact/ContactPage'
import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata({
  title: 'Contact',
  description: 'Contact Group Flight Bookings for group flight quotes and organizer support.',
  path: '/contact',
})

export default function Page() {
  return <ContactPage />
}

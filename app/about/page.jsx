import AboutPage from '@/components/About/AboutPage'
import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata({
  title: 'About',
  description: 'Learn how Group Flight Bookings helps organizers plan shared itineraries worldwide.',
  path: '/about',
})

export default function Page() {
  return <AboutPage />
}

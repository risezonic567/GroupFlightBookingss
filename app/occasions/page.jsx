import OccasionsPage from '@/components/Occasions/OccasionsPage'
import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata({
  title: 'Group travel occasions',
  description: 'Explore group flight planning by occasion — weddings, corporate, sports, schools, and more.',
  path: '/occasions',
})

export default function Page() {
  return <OccasionsPage />
}

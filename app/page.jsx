import HomePage from '@/components/Home/HomePage'
import JsonLd from '@/components/seo/JsonLd'
import { createPageMetadata, createPageSchema } from '@/lib/seo'

export const metadata = createPageMetadata({
  title: 'Group Flight Bookings | Global Group Flight Quotes',
  description:
    'Request a free group flight quote for 10 or more travelers. Global routes for weddings, corporate trips, sports teams, schools, and events.',
  path: '/',
})

export default function Page() {
  const schema = createPageSchema({
    name: 'Group Flight Bookings',
    description: 'Global group flight quotes for organizers and travel planners.',
    path: '/',
  })

  return (
    <>
      <JsonLd data={schema} />
      <HomePage />
    </>
  )
}

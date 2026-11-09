import { notFound } from 'next/navigation'
import OccasionDetailPage from '@/components/Occasions/OccasionDetailPage'
import { getOccasion, occasions } from '@/data/occasions'
import { createPageMetadata } from '@/lib/seo'

export function generateStaticParams() {
  return occasions.map((o) => ({ slug: o.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const occasion = getOccasion(slug)
  if (!occasion) return {}
  return createPageMetadata({
    title: `${occasion.title} group flights`,
    description: occasion.description,
    path: `/occasions/${occasion.slug}`,
  })
}

export default async function Page({ params }) {
  const { slug } = await params
  const occasion = getOccasion(slug)
  if (!occasion) notFound()
  return <OccasionDetailPage occasion={occasion} />
}

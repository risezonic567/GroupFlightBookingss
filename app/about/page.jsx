import AboutPage from '@/components/About/AboutPage'
import { createPageMetadata } from '@/lib/seo'
import { aboutMeta } from '@/lib/aboutContent'

export const metadata = createPageMetadata({
  title: aboutMeta.title,
  description: aboutMeta.description,
  path: '/about',
})

export default function Page() {
  return <AboutPage />
}

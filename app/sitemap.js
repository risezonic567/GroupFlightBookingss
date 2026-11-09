import { occasions } from '@/data/occasions'
import { SITE_URL } from '@/lib/seo'

export default function sitemap() {
  const staticPaths = ['', '/about', '/contact', '/occasions', '/privacy-policy']
  const occasionPaths = occasions.map((o) => `/occasions/${o.slug}`)

  return [...staticPaths, ...occasionPaths].map((path) => ({
    url: `${SITE_URL}${path || '/'}`,
    lastModified: new Date(),
  }))
}

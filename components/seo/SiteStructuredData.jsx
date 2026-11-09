import { BRAND, SITE_URL } from '@/lib/seo'
import contactDetails from '@/data/contact'
import JsonLd from './JsonLd'

export default function SiteStructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: BRAND,
        url: SITE_URL,
        email: contactDetails.email,
        telephone: contactDetails.phoneDisplay,
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: BRAND,
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
    ],
  }

  return <JsonLd data={data} />
}

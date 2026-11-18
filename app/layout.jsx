import { Archivo, Source_Sans_3 } from 'next/font/google'
import Navbar from '@/components/Common/Navbar'
import Footer from '@/components/Common/Footer'
import SiteStructuredData from '@/components/seo/SiteStructuredData'
import { BRAND, SITE_URL } from '@/lib/seo'
import './globals.css'

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
})

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND} | Global Group Flight Quotes`,
    template: `%s | ${BRAND}`,
  },
  description:
    'Group Flight Bookings helps organizers plan global group flights for weddings, teams, schools, and events. Request a free group flight quote online.',
  openGraph: {
    type: 'website',
    siteName: BRAND,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${archivo.variable} ${sourceSans.variable}`}>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-paper font-sans antialiased text-ink-900"
        style={{ fontFamily: 'var(--font-source-sans), sans-serif' }}
      >
        <style>{`.font-display{font-family:var(--font-archivo),sans-serif}`}</style>
        <SiteStructuredData />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}

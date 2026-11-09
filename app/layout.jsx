import { Manrope, Syne } from 'next/font/google'
import Navbar from '@/components/Common/Navbar'
import Footer from '@/components/Common/Footer'
import SiteStructuredData from '@/components/seo/SiteStructuredData'
import { BRAND, SITE_URL } from '@/lib/seo'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
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
    <html lang="en" className={`${manrope.variable} ${syne.variable}`}>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#f7fafc] font-sans antialiased"
        style={{ fontFamily: 'var(--font-manrope), sans-serif' }}
      >
        <style>{`.font-display{font-family:var(--font-syne),sans-serif}`}</style>
        <SiteStructuredData />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}

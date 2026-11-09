import Image from 'next/image'
import Link from 'next/link'
import contactDetails from '@/data/contact'
import { occasions } from '@/data/occasions'

export default function Footer() {
  return (
    <footer className="border-t border-ink-200 bg-ink-950 text-ink-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <Link href="/" aria-label="Group Flight Bookings home">
            <Image
              src="/images/logo.jpeg"
              alt="Group Flight Bookings"
              width={320}
              height={88}
              className="h-16 w-auto object-contain sm:h-[4.5rem]"
            />
          </Link>
          <p className="mt-4 max-w-md text-sm leading-6 text-ink-300">
            Global group flight planning for weddings, teams, schools, and events — clear quotes, shared itineraries, human support.
          </p>
          <a href={contactDetails.phoneHref} className="mt-5 inline-block text-lg font-bold text-white hover:text-skyline-400">
            {contactDetails.phoneDisplay}
          </a>
          <a href={`mailto:${contactDetails.email}`} className="mt-1 block text-sm text-ink-300 hover:text-white">
            {contactDetails.email}
          </a>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-400">Occasions</p>
          <ul className="mt-4 space-y-2 text-sm">
            {occasions.slice(0, 6).map((o) => (
              <li key={o.slug}>
                <Link href={`/occasions/${o.slug}`} className="hover:text-white">{o.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-400">Company</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-white">About</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-white">Privacy policy</Link></li>
            <li><Link href="/occasions" className="hover:text-white">All occasions</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-ink-400 sm:px-6">
        © {new Date().getFullYear()} Group Flight Bookings. All rights reserved.
      </div>
    </footer>
  )
}

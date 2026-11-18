import Image from 'next/image'
import FillButton from '@/components/Common/FillButton'

export default function HomeAbout() {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="home-about-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="relative">
            <div className="border border-line bg-paper p-6 sm:p-8">
              <Image
                src="/images/logo-nav.jpeg"
                alt="Group Flight Bookings"
                width={480}
                height={156}
                className="mx-auto h-auto w-full max-w-[320px] object-contain"
              />
            </div>
            <p className="mt-4 text-center text-sm text-ink-500 sm:text-left">
              Group Flight Bookings — fly together, travel further.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-ember-600">About us</p>
            <h2
              id="home-about-heading"
              className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]"
            >
              We plan the flights so your group arrives together
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-ink-600">
              Group Flight Bookings is a human desk for organizers who need 10+ travelers on shared itineraries —
              weddings with guests from several cities, school trips, sports teams, corporate offsites, and faith
              travel. You send one search; we come back with a clear outline you can take to your group.
            </p>
            <p className="mt-4 max-w-xl text-base leading-7 text-ink-600">
              Name lists can wait. Routes can be multi-city. The goal stays the same: everyone on the right flights,
              without a spreadsheet of separate bookings.
            </p>

            <dl className="mt-8 grid gap-6 border-t border-line pt-8 sm:grid-cols-3">
              <div>
                <dt className="font-display text-2xl font-semibold text-ink-950">10+</dt>
                <dd className="mt-1 text-sm leading-6 text-ink-600">Travelers for most group holds</dd>
              </div>
              <div>
                <dt className="font-display text-2xl font-semibold text-ink-950">1 desk</dt>
                <dd className="mt-1 text-sm leading-6 text-ink-600">Real people on quote and changes</dd>
              </div>
              <div>
                <dt className="font-display text-2xl font-semibold text-ink-950">Global</dt>
                <dd className="mt-1 text-sm leading-6 text-ink-600">Routes tuned to your event window</dd>
              </div>
            </dl>

            <FillButton
              href="/about"
              className="mt-8 inline-flex cursor-pointer border border-ink-300 bg-white px-5 py-3 text-sm font-semibold text-ink-900 hover:border-ink-500"
            >
              Read our full story
            </FillButton>
          </div>
        </div>
      </div>
    </section>
  )
}

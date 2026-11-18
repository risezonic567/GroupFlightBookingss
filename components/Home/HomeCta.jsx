import Link from 'next/link'
import contactDetails from '@/data/contact'
import FillButton from '@/components/Common/FillButton'

export default function HomeCta() {
  return (
    <section className="bg-paper py-16 sm:py-20" aria-labelledby="home-cta-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden border border-ink-800 bg-ink-950">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'radial-gradient(circle at 85% 20%, rgba(230,122,34,0.28), transparent 42%), radial-gradient(circle at 10% 80%, rgba(47,122,171,0.18), transparent 40%)',
            }}
            aria-hidden
          />

          <div className="relative grid gap-10 px-6 py-12 sm:px-10 sm:py-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-14 lg:px-14 lg:py-16">
            <div>
              <h2 id="home-cta-heading" className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
                Ready when your group is
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-ink-300">
                Add the route, traveler count, and your contact details. We reply with a clear group outline — free,
                with a human desk behind it.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <FillButton
                  href="#quote"
                  variant="invert"
                  className="inline-flex cursor-pointer items-center justify-center bg-ember-600 px-5 py-3 text-sm font-semibold text-white"
                >
                  Start your quote
                </FillButton>
                <FillButton
                  href={contactDetails.phoneHref}
                  variant="invert"
                  className="inline-flex cursor-pointer items-center justify-center border border-white/25 px-5 py-3 text-sm font-semibold text-white hover:border-white/45"
                >
                  Call {contactDetails.phoneDisplay}
                </FillButton>
              </div>
            </div>

            <div className="border border-white/10 bg-white/[0.04] p-6 sm:p-7">
              <p className="text-sm font-semibold text-white">What you get back</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-ink-300">
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ember-500" aria-hidden />
                  Route options that fit your event window
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ember-500" aria-hidden />
                  Traveler count and cabin guidance
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ember-500" aria-hidden />
                  Next steps from a real groups specialist
                </li>
              </ul>
              <Link href="/contact" className="mt-6 inline-flex text-sm font-semibold text-white underline-offset-4 hover:underline">
                Prefer email? Contact the desk
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

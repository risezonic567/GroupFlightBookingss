'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'How many travelers count as a group?',
    a: 'Most group fares start around 10 travelers. Smaller parties can still request a quote — we will tell you if a group hold or regular tickets fit better.',
  },
  {
    q: 'Do I need every passenger name on day one?',
    a: 'Usually no. Many group bookings allow you to hold seats first and add names closer to departure. Exact rules depend on the airline and fare.',
  },
  {
    q: 'Can guests fly from different cities?',
    a: 'Yes. Wedding and event groups often depart from multiple cities and meet at the destination. Tell us each origin when you request the quote.',
  },
  {
    q: 'Is the quote free?',
    a: 'Yes. Requesting a quote is free and does not lock you into a booking. We reply with options so you can decide with your group.',
  },
  {
    q: 'How fast will someone reply?',
    a: 'Aim for within one business day. Complex multi-city itineraries may take a little longer while we check availability.',
  },
]

export default function HomeFaq() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="border-y border-line bg-paper py-16 sm:py-20" aria-labelledby="home-faq-heading">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 id="home-faq-heading" className="font-display text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl">
            Questions before you quote
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-ink-600">
            Straight answers on group size, names, and timing. Still unsure? Start a quote and ask in the notes.
          </p>
        </div>

        <div className="mt-10 border-t border-line">
          {faqs.map((item, index) => {
            const open = openIndex === index
            return (
              <div key={item.q} className="border-b border-line">
                <button
                  type="button"
                  className="flex w-full cursor-pointer items-start justify-between gap-4 py-5 text-left"
                  aria-expanded={open}
                  onClick={() => setOpenIndex(open ? -1 : index)}
                >
                  <span className="font-display text-[1.05rem] font-semibold text-ink-950">{item.q}</span>
                  <ChevronDown
                    className={`mt-1 h-4 w-4 shrink-0 text-ink-500 transition-transform duration-300 ease-out ${
                      open ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className={`pb-5 pr-8 text-sm leading-7 text-ink-600 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}>
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

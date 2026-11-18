import contactDetails from '@/data/contact'

export const aboutMeta = {
  title: 'About Group Flight Bookings',
  description:
    'How Group Flight Bookings helps organizers plan shared group itineraries — same flights, flexible names, and a human desk.',
}

export const hero = {
  headlineLead: 'Everyone on the ',
  headlineAccent: 'same flight.',
  subtext:
    'Weddings, offsites, teams, schools and faith groups. Share your route and headcount; our desk returns a clear outline.',
  quoteHref: '/#quote',
  callLabel: `Call ${contactDetails.phoneDisplay}`,
  callHref: contactDetails.phoneHref,
  pass: {
    brand: 'GROUP FLIGHT BOOKINGS',
    fromCode: 'DEL',
    fromCity: 'Delhi',
    toCode: 'LHR',
    toCity: 'London',
    fields: [
      { label: 'PASSENGERS', value: 'Group of 42' },
      { label: 'SEATS', value: 'Together' },
      { label: 'NAMES', value: 'Add later ✓' },
      { label: 'FLIGHT', value: 'GFB 001' },
      { label: 'DESK', value: 'Mon to Fri' },
      { label: 'STATUS', value: 'Boarding' },
    ],
    stubLabel: 'GROUP',
    stubCode: '01',
  },
}

export const story = {
  eyebrow: 'OUR STORY',
  text:
    'The market is global, and organisers should not have to chase ten airlines. You tell us the route and headcount, and we come back with a clear outline. Same flights. Real people. Names later.',
  navyTailWordCount: 6,
}

export const departures = {
  eyebrow: 'DEPARTURES',
  heading: 'Everything a group booking needs',
  lead: 'From first quote to check-in.',
  rows: [
    { no: '01', service: 'GROUP QUOTES', details: 'Clear outline with timing', gate: 'A1', status: 'ON TIME' },
    { no: '02', service: 'FLEXIBLE NAMES', details: 'Add passenger names later', gate: 'B2', status: 'CONFIRMED' },
    { no: '03', service: 'SPLIT BOOKINGS', details: 'Smaller parties, one trip', gate: 'C3', status: 'BOARDING' },
    { no: '04', service: 'HUMAN SUPPORT', details: 'A desk that picks up', gate: 'D4', status: 'NOW OPEN' },
  ],
}

export const routeMap = {
  eyebrow: 'GLOBAL BY DESIGN',
  heading: 'Routes across every region',
  paragraph:
    'The market is global. Whether your party is flying across a region or connecting continents, we focus on workable group options and human support.',
}

export const baggageTags = {
  eyebrow: 'OCCASIONS',
  heading: 'Trips we plan for',
}

export const landing = {
  heading: 'Tell us your route and headcount.',
  sub: 'We will come back with a clear outline and next steps.',
  cta: 'Get your group quote',
  ctaHref: '/#quote',
}

export const desk = {
  phoneDisplay: contactDetails.phoneDisplay,
  phoneHref: contactDetails.phoneHref,
  email: contactDetails.email,
  hours: 'Monday to Friday, 9:00-18:00 local desk time',
}

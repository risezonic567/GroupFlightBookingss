export const occasions = [
  {
    slug: 'weddings',
    title: 'Wedding groups',
    category: 'Celebrations',
    short: 'Get everyone to the celebration on the same flights.',
    description:
      'Coordinate wedding parties, destination weddings, and guest travel with flexible holds and clear name-change windows.',
    image:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'family-reunions',
    title: 'Family reunions',
    category: 'Celebrations',
    short: 'Multi-city families, one shared journey.',
    description:
      'Bring relatives from different hubs onto overlapping flights without chasing ten separate bookings.',
    image:
      'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'corporate',
    title: 'Corporate & conferences',
    category: 'Business',
    short: 'Company offsites, summits, and incentive trips.',
    description:
      'Align teams on shared itineraries with cabin mix options, invoice-ready quotes, and organizer-friendly updates.',
    image:
      'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'sports',
    title: 'Sports teams',
    category: 'Teams',
    short: 'Tournaments, training camps, and fan travel.',
    description:
      'Keep squads and staff together with equipment-aware planning and schedule buffers around game days.',
    image:
      'https://images.unsplash.com/photo-1461896836934-ffe607ba6851?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'school-university',
    title: 'School & university',
    category: 'Education',
    short: 'Study abroad, tours, and class trips.',
    description:
      'Support chaperone ratios, student name lists that change, and clear deposit timelines for academic calendars.',
    image:
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'religious-pilgrimage',
    title: 'Religious & pilgrimage',
    category: 'Faith',
    short: 'Faith communities traveling together.',
    description:
      'Plan group movements around ceremony dates with seating proximity and flexible name finalization.',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'cruise-connections',
    title: 'Cruise connections',
    category: 'Travel',
    short: 'Fly-in and fly-home for embarkation ports.',
    description:
      'Sync air schedules with cruise check-in windows so the whole party arrives ready to board.',
    image:
      'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'music-events',
    title: 'Music & events',
    category: 'Events',
    short: 'Festivals, tours, and fan groups.',
    description:
      'Move artists, crew, or fan clubs with timing that respects load-in and show schedules.',
    image:
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'destination-weddings',
    title: 'Destination weddings',
    category: 'Celebrations',
    short: 'Guest travel for destination celebrations.',
    description:
      'Coordinate guest flights into destination wedding cities with shared holds and clear name-change windows.',
    image:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'milestone-trips',
    title: 'Milestone trips',
    category: 'Celebrations',
    short: 'Anniversaries, birthdays, and reunion travel.',
    description:
      'Bring everyone together for milestone celebrations with overlapping flights and flexible finalization.',
    image:
      'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'incentive-travel',
    title: 'Incentive travel',
    category: 'Business',
    short: 'Reward trips and company incentive groups.',
    description:
      'Plan incentive group flights with cabin mix options and organizer-friendly quote updates.',
    image:
      'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'tournament-travel',
    title: 'Tournament travel',
    category: 'Teams',
    short: 'Competition and championship group travel.',
    description:
      'Keep teams and staff together around tournament schedules with equipment-aware planning.',
    image:
      'https://images.unsplash.com/photo-1461896836934-ffe607ba6851?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'study-abroad',
    title: 'Study abroad groups',
    category: 'Education',
    short: 'Semester and exchange group flights.',
    description:
      'Support study-abroad cohorts with flexible name lists and academic calendar timelines.',
    image:
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'faith-group-travel',
    title: 'Faith group travel',
    category: 'Faith',
    short: 'Congregation and ministry group travel.',
    description:
      'Plan faith community travel around ceremony and ministry dates with seating proximity options.',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'pre-cruise-flights',
    title: 'Pre-cruise flights',
    category: 'Travel',
    short: 'Fly-in groups for cruise embarkation.',
    description:
      'Sync air schedules with cruise check-in windows so the whole party arrives ready to board.',
    image:
      'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'festival-groups',
    title: 'Festival groups',
    category: 'Events',
    short: 'Festival and concert fan group travel.',
    description:
      'Move fan groups with timing that respects show schedules and venue load-in windows.',
    image:
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80',
  },
]

export const occasionCategories = [...new Set(occasions.map((o) => o.category))]

export function getOccasion(slug) {
  return occasions.find((item) => item.slug === slug) || null
}

export function occasionsByCategory() {
  return occasionCategories.map((category) => ({
    category,
    items: occasions.filter((o) => o.category === category),
  }))
}

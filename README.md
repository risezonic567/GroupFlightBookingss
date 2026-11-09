# Group Flight Bookings

Next.js marketing site for **groupflightbookings.com** — global group flight quotes with a Google Flights–style search form (CRM look) plus email and phone.

## Stack

- Next.js App Router
- Tailwind CSS v4
- GSAP (home entrance motion)
- Nodemailer quote API

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Fill SMTP, `QUOTE_RECEIVER_EMAIL`, and `FLIGHT_SEARCH_TOKEN` (Duffel) in `.env.local`. Contact phone/email in `data/contact.js` are demo values for now.

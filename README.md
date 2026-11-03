# Deal Clock — Rocket Pro broker study

[![CI](https://github.com/sonzini/rocket-pro-deal-clock/actions/workflows/ci.yml/badge.svg)](https://github.com/sonzini/rocket-pro-deal-clock/actions/workflows/ci.yml)

Research, analysis and MVP by **Jorge Mariel**, prepared for the Rocket Pro interview process.

**Live site:** https://rocket-pro-deal-clock.vercel.app · **MVP:** https://rocket-pro-deal-clock.vercel.app/demo

**Thesis:** Rocket Pro sells certainty (same-day conditional approval, clear to close in 12 business days under Purchase Priority). But every purchase runs on two clocks — the contract's contingencies and closing date, and the loan's day 0 / day 1 / day 9 / day 12 milestones — and nobody lines them up. Deadlines collide quietly, agents chase brokers, brokers chase Rocket.

**MVP — Deal Clock:** the broker types the contract dates and gets:

1. **A plan** — contract deadlines mapped against Purchase Priority gates (4 p.m. ET cutoff, appraisal within 24h, day-9 lock/title/appraisal, day-12 clear to close) and the TRID 3-day Closing Disclosure wait, skipping weekends and federal holidays, with every collision flagged and the change to request.
2. **A link for the real estate agent** — broker-branded, milestones only, with the borrower's consent.
3. **A closing-certainty letter** to attach to the offer.

## Run locally

```bash
npm install
npm run dev
```

Run the calendar-engine tests with `npm test` (20 cases: business days, federal holidays, the 4 p.m. ET cutoff, Purchase Priority day 1/9/12, TRID Closing Disclosure timing, lock expiry and eligibility).

Open http://localhost:3000 for the report and http://localhost:3000/demo for the MVP. The contract is prefilled relative to today's date and fully editable.

## How it's built

- Next.js (App Router) + TypeScript + Tailwind CSS, fully static. English / Spanish toggle.
- `src/lib/dealclock.ts` — the calendar engine (tests in `src/lib/dealclock.test.ts`): business days, federal holidays, Purchase Priority milestones, TRID timing, lock expiry. Deterministic; no AI, no network calls.
- `src/app/demo/DealClock.tsx` — the MVP UI; `src/app/Report.tsx` — the report; `src/components/RoiCalculator.tsx` — the value model.

## Caveats

Program rules come from Rocket Pro's published Purchase Priority terms (Oct 6 – Dec 14, 2026); appraiser turn time, the standard timeline and lock buffer are editable assumptions. All dates are estimates, never a commitment to close or to any lender credit. Financial figures are estimates from public filings and industry data.

Independent work; not affiliated with or endorsed by Rocket Companies.

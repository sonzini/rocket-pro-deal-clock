# Clean File — Rocket Pro broker friction study

A research report and working MVP prepared for the Rocket Pro interview process.

**Thesis:** Rocket Pro has made the part it controls fast (same-day conditional approval, clear-to-close in 12 business days). The bottleneck now sits *before* that clock starts: brokers submit incomplete files, conditions come back in rounds, documents expire, and surprises show up near closing.

**MVP:** *Clean File* is a pre-submission check the broker runs before hitting "Submit":

- predicts the underwriting conditions a file is likely to get, with the public guideline behind each one;
- writes one plain-language request to the borrower, in English or Spanish;
- compares the realistic closing path with the contract closing date.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 for the report and http://localhost:3000/demo for the MVP. Use the sample-file buttons to try it without real data.

## How it's built

- Next.js (App Router) + TypeScript + Tailwind CSS, fully static.
- `src/lib/engine.ts` — the rules engine. Deterministic, no AI calls, no network: nothing typed leaves the browser.
- `src/app/Report.tsx` — the report; `src/components/RoiCalculator.tsx` — the business-case calculator.
- English / Spanish toggle in the header.

## Caveats

Rules are drawn from public Fannie Mae and HUD guidelines and common wholesale practice, not Rocket Pro's own overlays. It's a preparation checklist, not an underwriting decision. Financial figures are estimates from public filings and industry data, meant to be replaced with Rocket's internal data in a pilot.

Independent work; not affiliated with or endorsed by Rocket Companies.

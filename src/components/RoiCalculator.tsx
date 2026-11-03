"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";
import type { L } from "@/lib/types";

// Base figures from Rocket's Q3 2026 8-K (Rocket Pro $9.0B closed, 0.70% gain on sale), MBA/Optimal Blue
// (avg loan ~$386K, purchase ≈80% of locks) and NAR (16% of contracts delayed). Everything a slider
// touches is an estimate meant to be replaced with Rocket's data in a pilot.
type Inputs = {
  pullThrough: number; // extra percentage points of purchase locks that close
  statusCalls: number; // "where are we?" calls avoided per loan
  referrals: number; // extra purchase loans per year per broker using the agent link
};

const PURCHASE_LOCKS = 60000; // ~70% of ~85K annual Rocket Pro locks (Q3 2026 locks $8.2B × 4 ÷ $386K) — purchase share is an estimate
const GOS = 2705; // Rocket gain on sale per loan (0.70% × $386K)
const BROKER_COMP = 7700; // ~2% broker compensation per loan
const CALL_COST = 7; // ~10 min of AE/support time per status call
const ACTIVE_BROKERS = 2000; // e.g. brokers already engaged in Rocket's agent-facing programs (Compass)

const BASE: Inputs = { pullThrough: 1, statusCalls: 2, referrals: 0.5 };
const SCENARIOS: { name: L; v: Inputs }[] = [
  { name: { en: "Conservative", es: "Conservador" }, v: { pullThrough: 0.5, statusCalls: 1, referrals: 0.25 } },
  { name: { en: "Base", es: "Base" }, v: BASE },
  { name: { en: "Upside", es: "Optimista" }, v: { pullThrough: 1.8, statusCalls: 3, referrals: 1 } },
];
const fmtM = (n: number) => "$" + (n / 1e6).toFixed(1) + "M";

export function RoiCalculator() {
  const { t } = useLang();
  const [s, setS] = useState(1);
  const [v, setV] = useState<Inputs>(BASE);

  const savedClosings = (PURCHASE_LOCKS * v.pullThrough) / 100;
  const newLoans = ACTIVE_BROKERS * v.referrals;
  const rocket = {
    saved: savedClosings * GOS,
    calls: PURCHASE_LOCKS * v.statusCalls * CALL_COST,
    growth: newLoans * GOS,
  };
  const rocketTotal = rocket.saved + rocket.calls + rocket.growth;
  const brokerTotal = (savedClosings + newLoans) * BROKER_COMP;

  const slider = (k: keyof Inputs, label: L, min: number, max: number, step: number, show: (n: number) => string) => (
    <label key={k} className="block">
      <span className="flex justify-between gap-3 text-sm">
        <span className="text-muted">{t(label)}</span>
        <span className="num shrink-0 font-semibold">{show(v[k])}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={v[k]}
        onChange={(e) => { setS(-1); setV({ ...v, [k]: parseFloat(e.target.value) }); }}
        className="mt-1 w-full accent-[var(--accent)]" />
    </label>
  );

  return (
    <div className="grid gap-6 rounded-2xl border border-line bg-card p-5 sm:p-6 lg:grid-cols-[1.1fr_1fr]">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {SCENARIOS.map((x, i) => (
            <button key={i} onClick={() => { setS(i); setV(x.v); }}
              className={`rounded-full border px-3 py-1 text-sm ${s === i ? "border-ink bg-ink text-white" : "border-line hover:border-ink"}`}>
              {t(x.name)}
            </button>
          ))}
        </div>
        {slider("pullThrough", { en: "More purchase locks that close (pts)", es: "Más compras bloqueadas que cierran (pts)" }, 0, 3, 0.1, (n) => "+" + n.toFixed(1))}
        {slider("statusCalls", { en: "“Where are we?” calls avoided per loan", es: "Llamadas de “¿cómo vamos?” evitadas por préstamo" }, 0, 5, 0.5, (n) => n.toFixed(1))}
        {slider("referrals", { en: "Extra purchase loans per broker per year (agent referrals)", es: "Compras extra por broker por año (referidos de agentes)" }, 0, 4, 0.25, (n) => "+" + n.toFixed(2))}
        <p className="text-xs leading-relaxed text-muted">
          {t({
            en: `Fixed inputs (estimates): ~${PURCHASE_LOCKS.toLocaleString("en-US")} purchase locks/yr, $${GOS.toLocaleString("en-US")} gain on sale (0.70% of a $386K loan) and $${BROKER_COMP.toLocaleString("en-US")} broker comp (~2%) per loan, $${CALL_COST} per status call (~10 min of AE time), ${ACTIVE_BROKERS.toLocaleString("en-US")} brokers using the agent link. The referral lever is the most speculative — the pilot exists to measure it.`,
            es: `Datos fijos (estimados): ~${PURCHASE_LOCKS.toLocaleString("en-US")} compras bloqueadas/año, US$${GOS.toLocaleString("en-US")} de margen (0,70% de un préstamo de US$386.000) y US$${BROKER_COMP.toLocaleString("en-US")} de comisión (~2%) por préstamo, US$${CALL_COST} por llamada (~10 min de un ejecutivo), ${ACTIVE_BROKERS.toLocaleString("en-US")} brokers usando el link. Los referidos son la palanca más especulativa: el piloto existe para medirla.`,
          })}
        </p>
      </div>
      <div className="grid content-start gap-3">
        <div className="rounded-xl bg-ink p-5 text-white">
          <p className="text-xs uppercase tracking-wider text-white/60">{t({ en: "Annual value to Rocket", es: "Valor anual para Rocket" })}</p>
          <p className="num mt-1 font-display text-4xl font-semibold">{fmtM(rocketTotal)}</p>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-white/75">
            <dt>{t({ en: "Deals saved", es: "Operaciones salvadas" })}</dt><dd className="num text-right">{fmtM(rocket.saved)}</dd>
            <dt>{t({ en: "New purchase loans", es: "Compras nuevas" })}</dt><dd className="num text-right">{fmtM(rocket.growth)}</dd>
            <dt>{t({ en: "Status calls avoided", es: "Llamadas evitadas" })}</dt><dd className="num text-right">{fmtM(rocket.calls)}</dd>
          </dl>
        </div>
        <div className="rounded-xl border border-line bg-paper p-5">
          <p className="text-xs uppercase tracking-wider text-muted">{t({ en: "Annual value to Rocket Pro brokers", es: "Valor anual para los brokers de Rocket Pro" })}</p>
          <p className="num mt-1 font-display text-4xl font-semibold">{fmtM(brokerTotal)}</p>
          <p className="mt-2 text-sm text-muted">
            <span className="num">{Math.round(savedClosings + newLoans).toLocaleString("en-US")}</span> {t({ en: "more closed purchases a year", es: "compras cerradas más por año" })}
          </p>
        </div>
        <p className="text-xs text-muted">
          {t({
            en: "Gain on sale is revenue, not profit. Not included: buyers' lock-extension savings, fewer CFPB complaints, and brand value with real estate agents.",
            es: "El margen es ingreso, no ganancia. No incluye: lo que ahorran los compradores en extensiones de tasa, menos quejas ante la CFPB ni el valor de marca frente a los agentes inmobiliarios.",
          })}
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";
import type { L } from "@/lib/engine";

// Inputs and defaults come from the finance research (Rocket Q3 2026 8-K, MBA, Optimal Blue).
// Everything marked as an estimate is meant to be replaced by Rocket's internal numbers in a pilot.
type Inputs = {
  loans: number; // Rocket Pro loans closed per year
  locks: number; // Rocket Pro loans locked per year
  touches: number; // underwriting touches removed per loan
  costPerTouch: number; // fulfillment cost per touch ($)
  pullThrough: number; // extra percentage points of locks that close
  gosPerLoan: number; // Rocket gain on sale per loan ($)
  brokerComp: number; // broker compensation per loan ($)
  brokerHours: number; // broker processor hours saved per loan
};

const BASE: Inputs = { loans: 93200, locks: 85000, touches: 0.5, costPerTouch: 375, pullThrough: 1, gosPerLoan: 2705, brokerComp: 7700, brokerHours: 1.5 };
const SCENARIOS: { name: L; v: Partial<Inputs> }[] = [
  { name: { en: "Conservative", es: "Conservador" }, v: { touches: 0.25, costPerTouch: 200, pullThrough: 0.5, brokerHours: 0.75 } },
  { name: { en: "Base", es: "Base" }, v: {} },
  { name: { en: "Upside", es: "Optimista" }, v: { touches: 1, costPerTouch: 750, pullThrough: 1.8, brokerHours: 2.5 } },
];
const HOURLY = 40; // loaded cost of a broker processor hour [estimate]

const fmtM = (n: number) => "$" + (n / 1e6).toFixed(1) + "M";

export function RoiCalculator() {
  const { t } = useLang();
  const [s, setS] = useState(1);
  const [v, setV] = useState<Inputs>(BASE);
  const pick = (i: number) => {
    setS(i);
    setV({ ...BASE, ...SCENARIOS[i].v });
  };
  const extraClosings = (v.locks * v.pullThrough) / 100;
  const rocketTouch = v.loans * v.touches * v.costPerTouch;
  const rocketPT = extraClosings * v.gosPerLoan;
  const rocket = rocketTouch + rocketPT;
  const brokerPT = extraClosings * v.brokerComp;
  const brokerTime = v.loans * v.brokerHours * HOURLY;
  const broker = brokerPT + brokerTime;

  const slider = ({ k, label, min, max, step, fmt }: { k: keyof Inputs; label: L; min: number; max: number; step: number; fmt: (n: number) => string }) => (
    <label key={k} className="block">
      <span className="flex justify-between text-sm">
        <span className="text-muted">{t(label)}</span>
        <span className="num font-semibold">{fmt(v[k])}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={v[k]}
        onChange={(e) => {
          setS(-1);
          setV({ ...v, [k]: parseFloat(e.target.value) });
        }}
        className="mt-1 w-full accent-[var(--accent)]"
      />
    </label>
  );

  return (
    <div className="grid gap-6 rounded-2xl border border-line bg-card p-5 sm:p-6 lg:grid-cols-[1.1fr_1fr]">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {SCENARIOS.map((x, i) => (
            <button key={i} onClick={() => pick(i)} className={`rounded-full border px-3 py-1 text-sm ${s === i ? "border-ink bg-ink text-white" : "border-line hover:border-ink"}`}>
              {t(x.name)}
            </button>
          ))}
        </div>
        {slider({ k: "touches", label: { en: "Underwriting touches removed per loan", es: "Revisiones del analista evitadas por préstamo" }, min: 0, max: 1.5, step: 0.05, fmt: (n) => n.toFixed(2) })}
        {slider({ k: "costPerTouch", label: { en: "Rocket cost per underwriting touch", es: "Costo de Rocket por revisión" }, min: 100, max: 900, step: 25, fmt: (n) => "$" + n })}
        {slider({ k: "pullThrough", label: { en: "Extra locked loans that close (pts)", es: "Préstamos bloqueados extra que cierran (pts)" }, min: 0, max: 3, step: 0.1, fmt: (n) => "+" + n.toFixed(1) })}
        {slider({ k: "brokerHours", label: { en: "Broker processor hours saved per loan", es: "Horas de procesamiento ahorradas al broker por préstamo" }, min: 0, max: 4, step: 0.25, fmt: (n) => n.toFixed(2) + "h" })}
        <p className="text-xs leading-relaxed text-muted">
          {t({
            en: `Fixed inputs: ~${v.loans.toLocaleString("en-US")} Rocket Pro loans/yr (Q3 2026 $9.0B × 4 ÷ $386K avg), ~${v.locks.toLocaleString("en-US")} locks/yr, $${v.gosPerLoan.toLocaleString("en-US")} gain on sale per loan (0.70%), $${v.brokerComp.toLocaleString("en-US")} broker comp per loan, $${HOURLY}/h processor cost. Estimates — to be replaced with Rocket's internal data during the pilot.`,
            es: `Datos fijos: ~${v.loans.toLocaleString("en-US")} préstamos/año de Rocket Pro (US$9.0B del Q3 2026 × 4 ÷ US$386K promedio), ~${v.locks.toLocaleString("en-US")} bloqueos/año, US$${v.gosPerLoan.toLocaleString("en-US")} de margen por préstamo (0,70%), US$${v.brokerComp.toLocaleString("en-US")} de comisión del broker, US$${HOURLY}/h de procesamiento. Son estimaciones: se reemplazan con datos internos de Rocket en el piloto.`,
          })}
        </p>
      </div>
      <div className="grid content-start gap-3">
        <div className="rounded-xl bg-ink p-5 text-white">
          <p className="text-xs uppercase tracking-wider text-white/60">{t({ en: "Annual value to Rocket", es: "Valor anual para Rocket" })}</p>
          <p className="num mt-1 font-display text-4xl font-semibold">{fmtM(rocket)}</p>
          <p className="mt-2 text-sm text-white/70">
            {fmtM(rocketTouch)} {t({ en: "less rework", es: "menos retrabajo" })} · {fmtM(rocketPT)} {t({ en: "from", es: "por" })} <span className="num">{Math.round(extraClosings).toLocaleString("en-US")}</span> {t({ en: "extra closings", es: "cierres extra" })}
          </p>
        </div>
        <div className="rounded-xl border border-line bg-paper p-5">
          <p className="text-xs uppercase tracking-wider text-muted">{t({ en: "Annual value to Rocket Pro brokers", es: "Valor anual para los brokers de Rocket Pro" })}</p>
          <p className="num mt-1 font-display text-4xl font-semibold">{fmtM(broker)}</p>
          <p className="mt-2 text-sm text-muted">
            {fmtM(brokerPT)} {t({ en: "commission recovered", es: "comisiones recuperadas" })} · {fmtM(brokerTime)} {t({ en: "staff time", es: "tiempo de equipo" })}
          </p>
        </div>
        <p className="text-xs text-muted">
          {t({
            en: "Not included: more brokers reaching Orbit tier, faster activation of Moving Squad recruits, realtor referrals won by closing on time.",
            es: "No incluye: más brokers llegando al nivel Orbit, activación más rápida de los brokers que trae Moving Squad, ni referidos de agentes por cerrar en fecha.",
          })}
        </p>
      </div>
    </div>
  );
}

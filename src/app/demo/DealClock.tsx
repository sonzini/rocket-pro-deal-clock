"use client";

import { useEffect, useMemo, useState } from "react";
import { plan, defaultDeal, agentMessage, prettyDate, diffDays, addDays, type Deal, type Milestone, type State } from "@/lib/dealclock";
import { useLang } from "@/lib/i18n";
import type { L } from "@/lib/types";

type Tab = "plan" | "agent" | "letter";

const OWNER: Record<Milestone["owner"], L> = {
  broker: { en: "Broker", es: "Broker" },
  borrower: { en: "Borrower", es: "Cliente" },
  rocket: { en: "Rocket Pro", es: "Rocket Pro" },
  appraiser: { en: "Appraiser", es: "Tasador" },
  title: { en: "Title", es: "Escribanía" },
  agent: { en: "Agents", es: "Agentes" },
};
const DOT: Record<State, string> = { ok: "bg-good", tight: "bg-warn", late: "bg-bad", info: "bg-muted" };
const today = () => new Date().toISOString().slice(0, 10);

export function DealClock() {
  const { t, lang } = useLang();
  // Start from a fixed date so the static HTML matches, then move the contract to "today" on the client.
  const [deal, setDeal] = useState<Deal>(() => defaultDeal("2026-11-03"));
  useEffect(() => setDeal(defaultDeal(today())), []);
  const [tab, setTab] = useState<Tab>("plan");
  const [copied, setCopied] = useState(false);
  const p = useMemo(() => plan(deal), [deal]);
  const set = <K extends keyof Deal>(k: K, v: Deal[K]) => setDeal((d) => ({ ...d, [k]: v }));
  const d = (x: string) => prettyDate(x, lang);
  useEffect(() => setCopied(false), [tab, lang]);

  // One click applies every change the alerts ask for, to show the fixed plan.
  const applyFixes = () => {
    setDeal((x) => {
      const q = plan(x);
      const next = { ...x, afterCutoff: false, cdByMail: false };
      const needAppr = q.milestones.find((m) => m.id === "appr_back");
      if (q.alerts.some((a) => a.id === "appraisal_cont") && needAppr) next.appraisalContingencyDays = diffDays(x.acceptance, addDays(needAppr.date, 2));
      if (q.alerts.some((a) => a.id === "financing_cont")) next.financingContingencyDays = diffDays(x.acceptance, addDays(q.ctc, 2));
      const after = plan(next);
      if (after.slackDays < 0) next.closing = addDays(after.earliestClose, 1);
      const fin = plan(next);
      const needed = addDays(next.closing > fin.earliestClose ? next.closing : fin.earliestClose, 2);
      if (addDays(next.lockDate, next.lockTermDays) < needed) next.lockTermDays = [30, 45, 60, 75].find((n) => addDays(next.lockDate, n) >= needed) ?? 90;
      return next;
    });
  };

  const verdict: Record<typeof p.verdict, { label: L; color: string; bg: string }> = {
    on_track: { label: { en: "On track", es: "En fecha" }, color: "text-good", bg: "bg-good-soft" },
    tight: { label: { en: "Tight — watch it", es: "Justo: hay que vigilarlo" }, color: "text-warn", bg: "bg-warn-soft" },
    at_risk: { label: { en: "At risk — fix the contract dates now", es: "En riesgo: corregir las fechas del contrato ya" }, color: "text-bad", bg: "bg-bad-soft" },
  };
  const risks = p.alerts.filter((a) => a.level !== "info").length;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6">
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-widest text-accent">
          {t({ en: "Working MVP", es: "MVP funcionando" })} <span className="normal-case tracking-normal text-muted">· {t({ en: "by", es: "de" })} Jorge Mariel</span>
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold leading-tight sm:text-4xl">
          {t({ en: "Deal Clock: line up the contract with the loan before anyone signs", es: "Deal Clock: alinear el contrato con el préstamo antes de que alguien firme" })}
        </h1>
        <p className="mt-3 text-muted">
          {t({
            en: "Type the dates from the purchase contract. Deal Clock maps them against Rocket Pro's Purchase Priority milestones and TRID timing, flags every collision, and turns the result into a plan for the broker, a live link for the real estate agent, and a closing-certainty letter for the offer.",
            es: "Cargá las fechas del contrato de compra. Deal Clock las cruza con los plazos de Purchase Priority de Rocket Pro y los tiempos de TRID, marca cada choque y convierte el resultado en un plan para el broker, un link en vivo para el agente inmobiliario y una carta de certeza de cierre para la oferta.",
          })}
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
        {/* ---------------- Inputs ---------------- */}
        <div className="space-y-4">
          <Card title={t({ en: "Purchase contract", es: "Contrato de compra" })}>
            <Text label={t({ en: "Property", es: "Propiedad" })} value={deal.property} onChange={(v) => set("property", v)} />
            <div className="grid grid-cols-2 gap-3">
              <Text label={t({ en: "Buyer", es: "Comprador" })} value={deal.borrower} onChange={(v) => set("borrower", v)} />
              <Text label={t({ en: "Buyer's agent", es: "Agente del comprador" })} value={deal.agentName} onChange={(v) => set("agentName", v)} />
            </div>
            <DateIn label={t({ en: "Offer accepted", es: "Oferta aceptada" })} value={deal.acceptance} onChange={(v) => set("acceptance", v)} />
            <div className="grid grid-cols-2 gap-3">
              <Num label={t({ en: "Appraisal contingency (days)", es: "Cond. de tasación (días)" })} value={deal.appraisalContingencyDays} onChange={(v) => set("appraisalContingencyDays", v)} />
              <Num label={t({ en: "Financing contingency (days)", es: "Cond. de financiamiento (días)" })} value={deal.financingContingencyDays} onChange={(v) => set("financingContingencyDays", v)} />
            </div>
            <DateIn label={t({ en: "Closing date in the contract", es: "Fecha de cierre del contrato" })} value={deal.closing} onChange={(v) => set("closing", v)} />
          </Card>

          <Card title={t({ en: "Loan with Rocket Pro", es: "Préstamo con Rocket Pro" })}>
            <div className="grid grid-cols-2 gap-3">
              <Select label={t({ en: "Program", es: "Programa" })} value={deal.program} onChange={(v) => set("program", v as Deal["program"])} options={[["conventional", "Conventional"], ["fha", "FHA"], ["va", "VA"]]} />
              <Num label={t({ en: "Loan amount ($)", es: "Monto ($)" })} value={deal.loanAmount} onChange={(v) => set("loanAmount", v)} />
            </div>
            <DateIn label={t({ en: "Full package submission", es: "Envío de la carpeta completa" })} value={deal.submission} onChange={(v) => set("submission", v)} />
            <div className="grid grid-cols-2 gap-3">
              <DateIn label={t({ en: "Rate lock date", es: "Fecha de bloqueo" })} value={deal.lockDate} onChange={(v) => set("lockDate", v)} />
              <Select label={t({ en: "Lock term", es: "Plazo de bloqueo" })} value={String(deal.lockTermDays)} onChange={(v) => set("lockTermDays", Number(v))}
                options={[30, 45, 60, 75, 90].map((n) => [String(n), `${n} ${t({ en: "days", es: "días" })}`] as [string, string])} />
            </div>
            <Num label={t({ en: "Appraiser turn time (business days)", es: "Demora del tasador (días hábiles)" })} value={deal.appraisalTurnBizDays} onChange={(v) => set("appraisalTurnBizDays", v)} />
            <div className="grid gap-2">
              <Check label={t({ en: "Broker is an Orbit partner", es: "El broker es socio Orbit" })} checked={deal.orbitPartner} onChange={(v) => set("orbitPartner", v)} />
              <Check label={t({ en: "Complete package at submission", es: "Carpeta completa al enviar" })} checked={deal.fullPackage} onChange={(v) => set("fullPackage", v)} />
              <Check label={t({ en: "Submitted after 4:00 p.m. ET", es: "Enviado después de las 16 h (Este)" })} checked={deal.afterCutoff} onChange={(v) => set("afterCutoff", v)} />
              <Check label={t({ en: "Closing Disclosure by mail", es: "Divulgación de cierre por correo" })} checked={deal.cdByMail} onChange={(v) => set("cdByMail", v)} />
            </div>
          </Card>
          <button onClick={() => setDeal(defaultDeal(today()))} className="text-xs text-muted underline-offset-2 hover:underline">
            {t({ en: "Reset to the original contract", es: "Volver al contrato original" })}
          </button>
        </div>

        {/* ---------------- Output ---------------- */}
        <div className="min-w-0">
          <div className={`rounded-2xl border border-line p-5 ${verdict[p.verdict].bg}`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">{deal.property}</p>
                <p className={`mt-1 text-xl font-semibold ${verdict[p.verdict].color}`}>{t(verdict[p.verdict].label)}</p>
                <p className="mt-1 text-sm text-muted">
                  {p.eligible
                    ? t({ en: "Eligible for Purchase Priority: same-day conditional approval, clear to close in 12 business days.", es: "Califica para Purchase Priority: aprobación condicional en el día y final en 12 días hábiles." })
                    : t({ en: "Outside Purchase Priority — planned on a standard timeline.", es: "Fuera de Purchase Priority: se planifica con un plazo estándar." })}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <Kpi value={d(p.ctc)} label={t({ en: "clear to close", es: "aprobación final" })} />
                <Kpi value={d(p.earliestClose)} label={t({ en: "earliest closing", es: "cierre más temprano" })} />
                <Kpi value={(p.slackDays >= 0 ? "+" : "") + p.slackDays + "d"} label={t({ en: "cushion vs contract", es: "margen vs. contrato" })} tone={p.slackDays < 0 ? "bad" : p.slackDays <= 2 ? "warn" : "good"} />
              </div>
            </div>
            {risks > 0 && (
              <button onClick={applyFixes} className="mt-4 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95">
                {t({ en: "Apply the suggested contract changes", es: "Aplicar los cambios sugeridos al contrato" })}
              </button>
            )}
          </div>

          <div className="mt-4 flex gap-1 rounded-full border border-line bg-card p-1 text-sm" role="tablist">
            {([
              ["plan", { en: "1 · Broker plan", es: "1 · Plan del broker" }],
              ["agent", { en: "2 · Agent link", es: "2 · Link del agente" }],
              ["letter", { en: "3 · Offer letter", es: "3 · Carta para la oferta" }],
            ] as [Tab, L][]).map(([k, label]) => (
              <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
                className={`flex-1 whitespace-nowrap rounded-full px-3 py-2 font-medium transition ${tab === k ? "bg-ink text-white" : "text-muted hover:text-ink"}`}>
                {t(label)}
              </button>
            ))}
          </div>

          {tab === "plan" && (
            <div className="mt-4 space-y-4">
              {p.alerts.length > 0 && (
                <div className="space-y-2.5">
                  {p.alerts.map((a) => (
                    <div key={a.id} className={`rounded-xl border p-4 ${a.level === "risk" ? "border-bad/30 bg-card" : a.level === "warn" ? "border-warn/30 bg-card" : "border-line bg-card"}`}>
                      <p className="flex items-start gap-2 font-medium">
                        <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${a.level === "risk" ? "bg-bad" : a.level === "warn" ? "bg-warn" : "bg-muted"}`} />
                        {t(a.title)}
                      </p>
                      <p className="mt-1 pl-4 text-sm text-muted">{t(a.body)}</p>
                      <p className="mt-1 pl-4 text-sm"><span className="font-medium">{t({ en: "Do now: ", es: "Hacer ahora: " })}</span>{t(a.action)}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="rounded-2xl border border-line bg-card p-5">
                <div className="grid grid-cols-[1fr_auto_1fr] gap-x-3 text-xs font-semibold uppercase tracking-wider text-muted">
                  <span className="text-right">{t({ en: "Contract clock", es: "Reloj del contrato" })}</span>
                  <span />
                  <span>{t({ en: "Loan clock", es: "Reloj del préstamo" })}</span>
                </div>
                <ol className="mt-3 space-y-2">
                  {p.milestones.map((m) => (
                    <li key={m.id} className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-3">
                      <div className="text-right">{m.lane === "contract" && <Event m={m} t={t} align="right" />}</div>
                      <span className="num whitespace-nowrap rounded-full bg-paper px-2.5 py-1 text-xs font-medium">{d(m.date)}</span>
                      <div>{m.lane === "loan" && <Event m={m} t={t} align="left" />}</div>
                    </li>
                  ))}
                </ol>
                <p className="mt-4 text-xs text-muted">
                  {t({
                    en: "Business days exclude weekends and federal holidays. Closing Disclosure timing follows TRID (3 business days, Saturdays count). All dates are estimates.",
                    es: "Los días hábiles excluyen fines de semana y feriados federales. Los tiempos de la divulgación de cierre siguen TRID (3 días hábiles, cuentan los sábados). Todas las fechas son estimadas.",
                  })}
                </p>
              </div>
            </div>
          )}

          {tab === "agent" && (
            <div className="mt-4 grid gap-6 md:grid-cols-[300px_1fr]">
              <AgentPhone deal={deal} p={p} t={t} d={d} />
              <div className="space-y-4">
                <div className="rounded-2xl border border-line bg-card p-5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{t({ en: "Text to the agent (auto-written)", es: "Mensaje al agente (escrito solo)" })}</p>
                    <button
                      onClick={() => navigator.clipboard?.writeText(agentMessage(deal, p, lang)).then(() => setCopied(true))}
                      className="rounded-lg border border-line px-2.5 py-1 text-xs font-medium hover:border-ink">
                      {copied ? t({ en: "Copied", es: "Copiado" }) : t({ en: "Copy", es: "Copiar" })}
                    </button>
                  </div>
                  <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-paper p-4 font-sans text-sm leading-relaxed">{agentMessage(deal, p, lang)}</pre>
                </div>
                <div className="rounded-2xl border border-line bg-card p-5 text-sm text-muted">
                  <p className="font-semibold text-ink">{t({ en: "Why the agent sees this", es: "Por qué el agente ve esto" })}</p>
                  <ul className="mt-2 space-y-1.5">
                    <li>{t({ en: "• Buyers ask agents about the mortgage more than lenders (43% vs 29%). The agent decides who gets the next buyer.", es: "• Los compradores le preguntan por la hipoteca más al agente que al prestamista (43% vs 29%). El agente decide a quién manda el próximo comprador." })}</li>
                    <li>{t({ en: "• Broker-branded only — no Rocket retail contact — so it proves the no-poaching promise.", es: "• Solo con la marca del broker, sin contacto de Rocket retail: demuestra en la práctica la promesa de no quitarle clientes." })}</li>
                    <li>{t({ en: "• Milestones only, shared with the borrower's consent. No income, credit or loan terms.", es: "• Solo hitos, compartidos con consentimiento del cliente. Sin ingresos, crédito ni condiciones del préstamo." })}</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {tab === "letter" && <Letter deal={deal} p={p} t={t} d={d} />}

          <p className="mt-6 text-xs leading-relaxed text-muted">
            {t({
              en: "Prototype with a fictional contract; nothing typed here leaves the browser. Milestones follow Rocket Pro's published Purchase Priority terms (Oct 6 – Dec 14, 2026) and TRID; appraiser turn time, the standard timeline and lock buffer are editable assumptions. Estimates, not a commitment to close or to any lender credit.",
              es: "Prototipo con un contrato ficticio; nada de lo que se escribe sale del navegador. Los plazos siguen los términos publicados de Purchase Priority de Rocket Pro (6 oct. – 14 dic. 2026) y TRID; la demora del tasador, el plazo estándar y el margen del bloqueo son supuestos editables. Son estimaciones, no un compromiso de cierre ni de ningún crédito.",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

type T = (x: L) => string;

function Event({ m, t, align }: { m: Milestone; t: T; align: "left" | "right" }) {
  return (
    <div className={`inline-flex max-w-full items-start gap-2 rounded-xl border px-3 py-2 text-left ${m.state === "late" ? "border-bad/40 bg-bad-soft" : m.state === "tight" ? "border-warn/40 bg-warn-soft" : "border-line bg-paper"} ${align === "right" ? "flex-row-reverse text-right" : ""}`}>
      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${DOT[m.state]}`} />
      <span className="min-w-0">
        <span className="block text-sm font-medium leading-snug">{t(m.label)}</span>
        <span className="block text-[11px] text-muted">{t(OWNER[m.owner])}{m.detail ? " · " + t(m.detail) : ""}</span>
      </span>
    </div>
  );
}

function AgentPhone({ deal, p, t, d }: { deal: Deal; p: ReturnType<typeof plan>; t: T; d: (x: string) => string }) {
  const daysLeft = Math.max(0, diffDays(today(), deal.closing));
  const m = (id: string) => p.milestones.find((x) => x.id === id)!;
  const steps: [string, L][] = [
    ["cond", { en: "Approved with conditions", es: "Aprobado con condiciones" }],
    ["appr_back", { en: "Appraisal received", es: "Tasación recibida" }],
    ["ctc", { en: "Clear to close", es: "Aprobación final" }],
    ["cd", { en: "Closing Disclosure sent", es: "Divulgación de cierre enviada" }],
    ["earliest", { en: "Ready to close", es: "Listo para cerrar" }],
  ];
  const safe = (id: string, date: string) => {
    const ms = m(id);
    return ms.date <= date;
  };
  const apprCont = addDays(deal.acceptance, deal.appraisalContingencyDays);
  const finCont = addDays(deal.acceptance, deal.financingContingencyDays);
  return (
    <div className="mx-auto w-[280px] self-start rounded-[2.2rem] border-[10px] border-ink bg-ink shadow-xl">
      <div className="overflow-hidden rounded-[1.6rem] bg-card">
        <div className="bg-ink px-4 pb-4 pt-5 text-white">
          <p className="text-[11px] uppercase tracking-wider text-white/60">{deal.brokerCompany}</p>
          <p className="mt-1 text-sm font-semibold leading-snug">{deal.property}</p>
          <p className="mt-3 font-display text-3xl font-semibold">{daysLeft} <span className="text-base font-normal text-white/70">{t({ en: "days to closing", es: "días al cierre" })}</span></p>
          <p className="text-xs text-white/70">{d(deal.closing)} · {p.slackDays >= 0 ? t({ en: "on schedule", es: "en fecha" }) : t({ en: "needs a new date", es: "necesita nueva fecha" })}</p>
        </div>
        <div className="space-y-3 p-4 text-sm">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{t({ en: "Contingencies", es: "Condiciones" })}</p>
            <Row label={t({ en: "Appraisal", es: "Tasación" })} date={d(apprCont)} ok={safe("appr_back", apprCont)} t={t} />
            <Row label={t({ en: "Financing", es: "Financiamiento" })} date={d(finCont)} ok={safe("ctc", finCont)} t={t} />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{t({ en: "Loan progress", es: "Avance del préstamo" })}</p>
            <ol className="mt-1.5 space-y-1.5">
              {steps.map(([id, label], i) => (
                <li key={id} className="flex items-center gap-2">
                  <span className={`grid h-5 w-5 place-items-center rounded-full text-[10px] font-semibold ${i === 0 ? "bg-good text-white" : "bg-paper text-muted"}`}>{i === 0 ? "✓" : i + 1}</span>
                  <span className="flex-1">{t(label)}</span>
                  <span className="num text-[11px] text-muted">{d(m(id).date)}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-xl bg-paper p-3 text-xs">
            <p className="font-semibold">{deal.brokerName}</p>
            <p className="text-muted">{deal.brokerCompany} · {deal.brokerPhone}</p>
          </div>
          <p className="text-center text-[10px] text-muted">{t({ en: "Estimated dates · shared with the buyer's consent", es: "Fechas estimadas · compartido con consentimiento del comprador" })}</p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, date, ok, t }: { label: string; date: string; ok: boolean; t: T }) {
  return (
    <div className="mt-1.5 flex items-center justify-between gap-2 rounded-lg border border-line px-2.5 py-1.5">
      <span>{label} <span className="num text-[11px] text-muted">· {date}</span></span>
      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${ok ? "bg-good-soft text-good" : "bg-bad-soft text-bad"}`}>
        {ok ? t({ en: "on time", es: "a tiempo" }) : t({ en: "extend", es: "extender" })}
      </span>
    </div>
  );
}

function Letter({ deal, p, t, d }: { deal: Deal; p: ReturnType<typeof plan>; t: T; d: (x: string) => string }) {
  return (
    <div className="mt-4">
      <div className="rounded-2xl border border-line bg-card p-6 text-sm leading-relaxed shadow-sm sm:p-8">
        <div className="flex items-start justify-between gap-4 border-b border-line pb-4">
          <div>
            <p className="font-display text-lg font-semibold">{deal.brokerCompany}</p>
            <p className="text-xs text-muted">{deal.brokerName} · {deal.brokerPhone}</p>
          </div>
          <p className="num text-xs text-muted">{d(deal.acceptance)}</p>
        </div>
        <p className="mt-4 font-semibold">{t({ en: "Closing plan for the seller and listing agent", es: "Plan de cierre para el vendedor y su agente" })}</p>
        <p className="mt-2">
          {t({
            en: `${deal.borrower} is financing the purchase of ${deal.property} through our brokerage with Rocket Pro. Based on the contract dates, this is the plan we are working to:`,
            es: `${deal.borrower} financia la compra de ${deal.property} a través de nuestra empresa con Rocket Pro. Según las fechas del contrato, este es el plan en el que trabajamos:`,
          })}
        </p>
        <ul className="mt-3 space-y-1.5">
          <li>• {t({ en: "Full loan package submitted:", es: "Carpeta completa enviada:" })} <b>{d(p.day0)}</b></li>
          <li>• {t({ en: "Appraisal ordered within 24 hours, report expected:", es: "Tasación pedida dentro de las 24 h, informe estimado:" })} <b>{d(p.appraisalBack)}</b></li>
          <li>• {t({ en: "Estimated clear to close:", es: "Aprobación final estimada:" })} <b>{d(p.ctc)}</b></li>
          <li>• {t({ en: "Ready to close from:", es: "Listo para cerrar desde:" })} <b>{d(p.earliestClose)}</b> {t({ en: "— contract date", es: "— fecha del contrato" })} <b>{d(deal.closing)}</b></li>
        </ul>
        {p.eligible && (
          <p className="mt-3">
            {t({
              en: "This loan is planned under Rocket Pro's Purchase Priority program, which targets same-business-day conditional approval and clear to close within 12 business days of a complete submission.",
              es: "Este préstamo se planifica dentro del programa Purchase Priority de Rocket Pro, que apunta a aprobación condicional el mismo día hábil y aprobación final dentro de los 12 días hábiles desde un envío completo.",
            })}
          </p>
        )}
        <p className="mt-3">{t({ en: "You will receive milestone updates through a live link until closing.", es: "Vas a recibir las novedades de cada paso por un link en vivo hasta el cierre." })}</p>
        <p className="mt-6 text-xs text-muted">
          {t({
            en: "Estimated timeline, not a commitment to lend or to close on a specific date. Subject to underwriting, appraisal, title and program terms.",
            es: "Cronograma estimado; no es un compromiso de préstamo ni de cierre en una fecha determinada. Sujeto a análisis crediticio, tasación, título y términos del programa.",
          })}
        </p>
      </div>
      <p className="mt-3 text-sm text-muted">
        {t({
          en: "Why it matters: 27% of buyers paid all cash in September 2026. A dated closing plan is how a financed offer competes on certainty.",
          es: "Por qué importa: el 27% de los compradores pagó todo en efectivo en septiembre de 2026. Un plan de cierre con fechas es cómo una oferta financiada compite en certeza.",
        })}
      </p>
    </div>
  );
}

function Kpi({ value, label, tone }: { value: string; label: string; tone?: "good" | "warn" | "bad" }) {
  const c = tone === "bad" ? "text-bad" : tone === "warn" ? "text-warn" : tone === "good" ? "text-good" : "";
  return (
    <div className="rounded-xl bg-card px-3 py-2">
      <p className={`num text-sm font-semibold ${c}`}>{value}</p>
      <p className="text-[11px] text-muted">{label}</p>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 rounded-2xl border border-line bg-card p-5">
      <h2 className="font-semibold">{title}</h2>
      {children}
    </section>
  );
}
const inputCls = "num mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink";
function Text({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block text-sm">
      <span className="text-muted">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />
    </label>
  );
}
function DateIn({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block text-sm">
      <span className="text-muted">{label}</span>
      <input type="date" value={value} onChange={(e) => e.target.value && onChange(e.target.value)} className={inputCls} />
    </label>
  );
}
function Num({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block text-sm">
      <span className="text-muted">{label}</span>
      <input type="number" min={0} value={value} onChange={(e) => onChange(Math.max(0, parseInt(e.target.value) || 0))} className={inputCls} />
    </label>
  );
}
function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <label className="block text-sm">
      <span className="text-muted">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  );
}
function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-line bg-paper px-3 py-2 text-sm has-[:checked]:border-good has-[:checked]:bg-good-soft">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="accent-[var(--good)]" />
      {label}
    </label>
  );
}

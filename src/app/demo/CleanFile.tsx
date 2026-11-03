"use client";

import { useMemo, useState } from "react";
import { evaluate, borrowerMessage, SAMPLES, type LoanFile, type Finding, type Severity, type L } from "@/lib/engine";
import { useLang } from "@/lib/i18n";

const SAMPLE_TAGS: L[] = [
  { en: "Messy first-time buyer", es: "Comprador primerizo desordenado" },
  { en: "Self-employed purchase", es: "Compra de independiente" },
  { en: "Near-clean refinance", es: "Refinanciación casi limpia" },
];

const SEV: Record<Severity, { label: L; cls: string; dot: string }> = {
  blocker: { label: { en: "Blocker", es: "Bloqueante" }, cls: "bg-bad-soft text-bad", dot: "bg-bad" },
  likely: { label: { en: "Likely condition", es: "Condición probable" }, cls: "bg-warn-soft text-warn", dot: "bg-warn" },
  watch: { label: { en: "Watch", es: "Atención" }, cls: "bg-[#eceef3] text-muted", dot: "bg-muted" },
};

const OWNER: Record<Finding["owner"], L> = {
  borrower: { en: "Borrower", es: "Cliente" },
  broker: { en: "Broker", es: "Broker" },
  third_party: { en: "Third party", es: "Tercero" },
};

export function CleanFile() {
  const { t, lang } = useLang();
  const [sampleIdx, setSampleIdx] = useState(0);
  const [file, setFile] = useState<LoanFile>(SAMPLES[0]);
  const [initial, setInitial] = useState(() => evaluate(SAMPLES[0]));
  const [copied, setCopied] = useState(false);
  const r = useMemo(() => evaluate(file), [file]);
  const msg = borrowerMessage(file, r.findings, lang);

  const load = (i: number) => {
    setSampleIdx(i);
    setFile(SAMPLES[i]);
    setInitial(evaluate(SAMPLES[i]));
  };
  const set = <K extends keyof LoanFile>(k: K, v: LoanFile[K]) => setFile((f) => ({ ...f, [k]: v }));

  // One-click "fix" applies the change the broker would make before submitting.
  const fixes: Record<string, Partial<LoanFile>> = {
    paystub_stale: { paystubAgeDays: 7 },
    stmt_stale: { bankStatementAgeDays: 10 },
    large_deposit: { depositSourced: true },
    gift_letter: { giftLetter: true },
    gift_transfer: { giftTransferProof: true },
    se_returns: { taxReturns2y: true },
    se_pl: { ytdProfitLoss: true },
    inquiries: { inquiryLoe: true },
    condo: { condoQuestionnaire: true },
    hoi: { insuranceBinder: true },
    contract: { contractFullyExecuted: true },
    appraisal: { appraisalOrdered: true },
  };
  const fixAll = () => {
    let next = { ...file };
    for (const x of r.findings) if (fixes[x.id]) next = { ...next, ...fixes[x.id] };
    setFile(next);
  };

  const statusText: Record<string, L> = {
    ready: { en: "Ready to submit", es: "Listo para enviar" },
    almost: { en: "Almost ready", es: "Casi listo" },
    not_ready: { en: "Not ready — fix before submitting", es: "No está listo: corregir antes de enviar" },
  };
  const ring = r.status === "ready" ? "var(--good)" : r.status === "almost" ? "var(--warn)" : "var(--bad)";
  const fixable = r.findings.filter((x) => fixes[x.id]).length;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6">
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-widest text-accent">
          {t({ en: "Working MVP", es: "MVP funcionando" })} <span className="normal-case tracking-normal text-muted">· {t({ en: "by", es: "de" })} Jorge Mariel</span>
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold leading-tight sm:text-4xl">
          {t({ en: "Clean File: check the loan before the clock starts", es: "Clean File: revisá el préstamo antes de que arranque el reloj" })}
        </h1>
        <p className="mt-3 text-muted">
          {t({
            en: "The broker runs this before hitting “Submit” to Rocket Pro. It predicts the conditions underwriting will most likely issue, writes the borrower request in plain language, and shows whether the contract closing date is safe.",
            es: "El broker lo corre antes de apretar “Enviar” en Rocket Pro. Predice las condiciones que el analista probablemente va a pedir, redacta el pedido al cliente en lenguaje simple y muestra si la fecha de cierre del contrato está en riesgo.",
          })}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm text-muted">{t({ en: "Load a sample file:", es: "Cargar un caso de ejemplo:" })}</span>
        {SAMPLES.map((s, i) => (
          <button
            key={s.label}
            onClick={() => load(i)}
            className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
              sampleIdx === i ? "border-ink bg-ink text-white" : "border-line bg-card hover:border-ink"
            }`}
          >
            {t(SAMPLE_TAGS[i])}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.15fr]">
        {/* ---------- Form ---------- */}
        <div className="space-y-4">
          <Card title={t({ en: "Loan", es: "Préstamo" })} subtitle={file.label}>
            <Grid>
              <Select label={t({ en: "Purpose", es: "Destino" })} value={file.purpose} onChange={(v) => set("purpose", v as LoanFile["purpose"])}
                options={[["purchase", t({ en: "Purchase", es: "Compra" })], ["refinance", t({ en: "Refinance", es: "Refinanciación" })]]} />
              <Select label={t({ en: "Program", es: "Programa" })} value={file.program} onChange={(v) => set("program", v as LoanFile["program"])}
                options={[["conventional", "Conventional"], ["fha", "FHA"], ["va", "VA"]]} />
              <Select label={t({ en: "Property", es: "Propiedad" })} value={file.propertyType} onChange={(v) => set("propertyType", v as LoanFile["propertyType"])}
                options={[["sfr", t({ en: "Single family", es: "Casa" })], ["condo", "Condo"], ["multi", t({ en: "2–4 units", es: "2–4 unidades" })]]} />
              <Num label={t({ en: "Credit score", es: "Score crediticio" })} value={file.creditScore} onChange={(v) => set("creditScore", v)} />
              <Num label={t({ en: "Price / value ($)", es: "Precio / valor ($)" })} value={file.price} onChange={(v) => set("price", v)} />
              <Num label={t({ en: "Loan amount ($)", es: "Monto del préstamo ($)" })} value={file.loanAmount} onChange={(v) => set("loanAmount", v)} />
            </Grid>
          </Card>

          <Card title={t({ en: "Income", es: "Ingresos" })}>
            <Grid>
              <Select label={t({ en: "Income type", es: "Tipo de ingreso" })} value={file.incomeType} onChange={(v) => set("incomeType", v as LoanFile["incomeType"])}
                options={[["w2", t({ en: "W-2 employee", es: "Empleado (W-2)" })], ["self_employed", t({ en: "Self-employed", es: "Independiente" })], ["retired", t({ en: "Retired", es: "Jubilado" })]]} />
              <Num label={t({ en: "Monthly income ($)", es: "Ingreso mensual ($)" })} value={file.monthlyIncome} onChange={(v) => set("monthlyIncome", v)} />
              <Num label={t({ en: "Monthly debts incl. new payment ($)", es: "Deudas mensuales con nueva cuota ($)" })} value={file.monthlyDebts} onChange={(v) => set("monthlyDebts", v)} />
              <Num label={t({ en: "Years in job / business", es: "Años en el empleo / negocio" })} value={file.yearsInLine} step={0.5} onChange={(v) => set("yearsInLine", v)} />
              <Num label={t({ en: "Employment gap (months)", es: "Interrupción laboral (meses)" })} value={file.employmentGapMonths} onChange={(v) => set("employmentGapMonths", v)} />
              {file.incomeType === "w2" && <Num label={t({ en: "Paystub age (days)", es: "Antigüedad del recibo (días)" })} value={file.paystubAgeDays} onChange={(v) => set("paystubAgeDays", v)} />}
            </Grid>
            <Checks>
              {file.incomeType === "w2" && <Check label={t({ en: "Overtime / bonus used to qualify", es: "Usa horas extra / bonos" })} checked={file.variableIncome} onChange={(v) => set("variableIncome", v)} />}
              {file.incomeType === "self_employed" && (
                <>
                  <Check label={t({ en: "2 years of tax returns on file", es: "2 años de declaraciones cargadas" })} checked={file.taxReturns2y} onChange={(v) => set("taxReturns2y", v)} />
                  <Check label={t({ en: "Year-to-date P&L on file", es: "P&L del año cargado" })} checked={file.ytdProfitLoss} onChange={(v) => set("ytdProfitLoss", v)} />
                </>
              )}
            </Checks>
          </Card>

          <Card title={t({ en: "Assets & credit", es: "Activos y crédito" })}>
            <Grid>
              <Num label={t({ en: "Bank statement age (days)", es: "Antigüedad del extracto (días)" })} value={file.bankStatementAgeDays} onChange={(v) => set("bankStatementAgeDays", v)} />
              <Num label={t({ en: "Largest non-payroll deposit ($)", es: "Mayor depósito no salarial ($)" })} value={file.largestDepositAmount} onChange={(v) => set("largestDepositAmount", v)} />
              <Num label={t({ en: "Gift funds ($)", es: "Fondos donados ($)" })} value={file.giftAmount} onChange={(v) => set("giftAmount", v)} />
              <Num label={t({ en: "Credit inquiries (120 days)", es: "Consultas de crédito (120 días)" })} value={file.recentInquiries} onChange={(v) => set("recentInquiries", v)} />
            </Grid>
            <Checks>
              <Check label={t({ en: "Large deposit sourced", es: "Depósito grande justificado" })} checked={file.depositSourced} onChange={(v) => set("depositSourced", v)} />
              {file.giftAmount > 0 && (
                <>
                  <Check label={t({ en: "Signed gift letter", es: "Carta de donación firmada" })} checked={file.giftLetter} onChange={(v) => set("giftLetter", v)} />
                  <Check label={t({ en: "Gift transfer proof", es: "Comprobante de transferencia" })} checked={file.giftTransferProof} onChange={(v) => set("giftTransferProof", v)} />
                </>
              )}
              <Check label={t({ en: "Inquiry explanation on file", es: "Explicación de consultas cargada" })} checked={file.inquiryLoe} onChange={(v) => set("inquiryLoe", v)} />
            </Checks>
          </Card>

          <Card title={t({ en: "Property, third parties & dates", es: "Propiedad, terceros y fechas" })}>
            <Grid>
              <Num label={t({ en: "Days to contract closing date", es: "Días hasta la fecha de cierre del contrato" })} value={file.daysToContractClosing} onChange={(v) => set("daysToContractClosing", v)} />
            </Grid>
            <Checks>
              {file.purpose === "purchase" && <Check label={t({ en: "Contract fully signed", es: "Contrato firmado por todos" })} checked={file.contractFullyExecuted} onChange={(v) => set("contractFullyExecuted", v)} />}
              {file.purpose === "purchase" && <Check label={t({ en: "Insurance binder received", es: "Póliza de seguro recibida" })} checked={file.insuranceBinder} onChange={(v) => set("insuranceBinder", v)} />}
              {file.propertyType === "condo" && <Check label={t({ en: "Condo questionnaire ordered", es: "Cuestionario del condominio pedido" })} checked={file.condoQuestionnaire} onChange={(v) => set("condoQuestionnaire", v)} />}
              <Check label={t({ en: "Appraisal waiver (AUS)", es: "Exención de tasación (AUS)" })} checked={file.appraisalWaiver} onChange={(v) => set("appraisalWaiver", v)} />
              {!file.appraisalWaiver && <Check label={t({ en: "Appraisal ordered", es: "Tasación pedida" })} checked={file.appraisalOrdered} onChange={(v) => set("appraisalOrdered", v)} />}
            </Checks>
          </Card>
        </div>

        {/* ---------- Results ---------- */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-line bg-card p-5 shadow-[0_1px_0_rgba(0,0,0,0.03),0_12px_32px_-16px_rgba(18,21,28,0.18)]">
            <div className="flex items-center gap-5">
              <div
                className="grid h-24 w-24 shrink-0 place-items-center rounded-full"
                style={{ background: `conic-gradient(${ring} ${r.score * 3.6}deg, #eceae3 0deg)` }}
                aria-label={`Readiness ${r.score} / 100`}
              >
                <div className="grid h-[78px] w-[78px] place-items-center rounded-full bg-card">
                  <span className="num text-3xl font-semibold">{r.score}</span>
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-muted">{t({ en: "Submission readiness", es: "Preparación para enviar" })}</p>
                <p className="mt-1 text-lg font-semibold" style={{ color: ring }}>{t(statusText[r.status])}</p>
                <p className="mt-1 text-sm text-muted">
                  LTV <span className="num">{r.ltv.toFixed(1)}%</span> · DTI <span className="num">{r.dti.toFixed(1)}%</span> ·{" "}
                  {r.findings.length} {t({ en: "items", es: "puntos" })}
                  {initial.score !== r.score && (
                    <span className="ml-1 text-good">({t({ en: "was", es: "antes" })} {initial.score})</span>
                  )}
                </p>
              </div>
            </div>

            {/* Timeline */}
            {file.purpose === "purchase" && (
              <div className="mt-5 rounded-xl bg-paper p-4">
                <p className="text-sm font-semibold">{t({ en: "Will it close on the contract date?", es: "¿Cierra en la fecha del contrato?" })}</p>
                <TimelineBar
                  label={t({ en: "Submit as-is (conditions surface later)", es: "Enviar como está (condiciones aparecen después)" })}
                  days={r.timeline.typicalCloseDays}
                  contract={r.timeline.contractDays}
                />
                <TimelineBar
                  label={t({ en: "Submit a clean file", es: "Enviar la carpeta limpia" })}
                  days={r.timeline.cleanCloseDays}
                  contract={r.timeline.contractDays}
                  good
                />
                <p className="mt-2 text-xs text-muted">
                  {t({ en: "Contract closing in", es: "Cierre del contrato en" })} <span className="num">{r.timeline.contractDays}</span> {t({ en: "days", es: "días" })}.{" "}
                  {r.timeline.typicalSlipDays > 0 &&
                    t({
                      en: `Est. lock-extension cost of the slip: $${Math.round(r.timeline.lockExtensionCost).toLocaleString("en-US")}.`,
                      es: `Costo estimado de extender la tasa por el atraso: US$${Math.round(r.timeline.lockExtensionCost).toLocaleString("en-US")}.`,
                    })}
                </p>
              </div>
            )}

            {fixable > 0 && (
              <button onClick={fixAll} className="mt-4 w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95">
                {t({ en: `Simulate: collect the ${fixable} missing items before submitting`, es: `Simular: juntar los ${fixable} faltantes antes de enviar` })}
              </button>
            )}
            {initial.score !== r.score && (
              <button onClick={() => load(sampleIdx)} className="mt-2 w-full text-center text-xs text-muted underline-offset-2 hover:underline">
                {t({ en: "Reset sample", es: "Volver al ejemplo original" })}
              </button>
            )}
          </div>

          {/* Findings */}
          <div className="mt-4 space-y-2.5">
            {r.findings.length === 0 && (
              <div className="rounded-xl border border-line bg-good-soft p-4 text-sm text-good">
                {t({ en: "No predicted conditions. This file is ready to go.", es: "Sin condiciones previstas. Esta carpeta está lista." })}
              </div>
            )}
            {r.findings.map((x) => (
              <details key={x.id} className="group rounded-xl border border-line bg-card p-4 open:shadow-sm">
                <summary className="flex cursor-pointer list-none items-start gap-3">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${SEV[x.severity].dot}`} />
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium leading-snug">{t(x.title)}</span>
                    <span className="mt-1 flex flex-wrap gap-1.5 text-[11px] font-medium">
                      <span className={`rounded-full px-2 py-0.5 ${SEV[x.severity].cls}`}>{t(SEV[x.severity].label)}</span>
                      <span className="rounded-full bg-paper px-2 py-0.5 text-muted">{t(OWNER[x.owner])}</span>
                    </span>
                  </span>
                  {fixes[x.id] && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setFile((f) => ({ ...f, ...fixes[x.id] }));
                      }}
                      className="shrink-0 rounded-lg border border-line px-2.5 py-1 text-xs font-medium hover:border-ink"
                    >
                      {t({ en: "Mark fixed", es: "Resuelto" })}
                    </button>
                  )}
                </summary>
                <div className="mt-3 space-y-2 pl-5 text-sm">
                  <p className="text-muted">{t(x.why)}</p>
                  <p><span className="font-medium">{t({ en: "Do now: ", es: "Hacer ahora: " })}</span>{t(x.fix)}</p>
                  <p className="text-xs text-muted">{t({ en: "Reference: ", es: "Referencia: " })}{x.ref}</p>
                </div>
              </details>
            ))}
          </div>

          {/* Borrower message */}
          <div className="mt-4 rounded-2xl border border-line bg-card p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">{t({ en: "One message to the borrower, not five", es: "Un solo mensaje al cliente, no cinco" })}</p>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(msg).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  });
                }}
                className="rounded-lg border border-line px-2.5 py-1 text-xs font-medium hover:border-ink"
              >
                {copied ? t({ en: "Copied", es: "Copiado" }) : t({ en: "Copy", es: "Copiar" })}
              </button>
            </div>
            <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-paper p-4 font-sans text-sm leading-relaxed">{msg}</pre>
            <p className="mt-2 text-xs text-muted">{t({ en: "Switch EN/ES at the top to write it in Spanish.", es: "Cambiá EN/ES arriba para escribirlo en inglés." })}</p>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-muted">
            {t({
              en: "Prototype with sample data only. Rules are drawn from public Fannie Mae / HUD guidelines and common wholesale practice — not Rocket Pro overlays. It is a preparation checklist, not an underwriting decision. Nothing typed here leaves the browser.",
              es: "Prototipo solo con datos de ejemplo. Las reglas salen de guías públicas de Fannie Mae / HUD y prácticas comunes del canal mayorista, no de las reglas internas de Rocket Pro. Es una lista de preparación, no una decisión de crédito. Nada de lo que se escribe sale del navegador.",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

function TimelineBar({ label, days, contract, good }: { label: string; days: number; contract: number; good?: boolean }) {
  const max = Math.max(days, contract) * 1.1;
  const late = days > contract;
  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs">
        <span className="text-muted">{label}</span>
        <span className={`num font-semibold ${late ? "text-bad" : "text-good"}`}>~{days}d</span>
      </div>
      <div className="relative mt-1 h-2.5 rounded-full bg-[#eceae3]">
        <div className={`h-full rounded-full ${late ? "bg-bad" : good ? "bg-good" : "bg-warn"}`} style={{ width: `${(days / max) * 100}%` }} />
        <div className="absolute -top-1 h-[18px] w-0.5 bg-ink" style={{ left: `${(contract / max) * 100}%` }} title="contract" />
      </div>
    </div>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-card p-5">
      <h2 className="font-semibold">{title}</h2>
      {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}
const Grid = ({ children }: { children: React.ReactNode }) => <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>;
const Checks = ({ children }: { children: React.ReactNode }) => <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">{children}</div>;

function Num({ label, value, onChange, step = 1 }: { label: string; value: number; onChange: (v: number) => void; step?: number }) {
  return (
    <label className="block text-sm">
      <span className="text-muted">{label}</span>
      <input
        type="number"
        inputMode="decimal"
        step={step}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="num mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 outline-none focus:border-ink"
      />
    </label>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <label className="block text-sm">
      <span className="text-muted">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 outline-none focus:border-ink">
        {options.map(([v, l]) => (
          <option key={v} value={v}>{l}</option>
        ))}
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

// Deal Clock — lines up a purchase contract's deadlines with the loan's milestones.
// Deterministic calendar rules, no AI, no network calls. Every rule below is a published
// program term or regulation, or an editable assumption (marked ASSUMPTION).
// Estimates only: it never promises a closing date or a lender credit.

import type { L } from "./types";

/* ------------------------------------------------------------------ dates */

export type ISODate = string; // "YYYY-MM-DD"

const parse = (d: ISODate) => {
  const [y, m, day] = d.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, day));
};
const fmt = (d: Date): ISODate => d.toISOString().slice(0, 10);
export const addDays = (d: ISODate, n: number): ISODate => {
  const x = parse(d);
  x.setUTCDate(x.getUTCDate() + n);
  return fmt(x);
};
export const diffDays = (a: ISODate, b: ISODate) => Math.round((parse(b).getTime() - parse(a).getTime()) / 86400000);
const weekday = (d: ISODate) => parse(d).getUTCDay(); // 0 = Sunday

// US federal holidays (observed dates), 2026–2027.
export const HOLIDAYS: Record<ISODate, L> = {
  "2026-01-01": { en: "New Year's Day", es: "Año Nuevo" },
  "2026-01-19": { en: "MLK Day", es: "Día de MLK" },
  "2026-02-16": { en: "Presidents' Day", es: "Día de los Presidentes" },
  "2026-05-25": { en: "Memorial Day", es: "Memorial Day" },
  "2026-06-19": { en: "Juneteenth", es: "Juneteenth" },
  "2026-07-03": { en: "Independence Day (observed)", es: "Día de la Independencia (feriado trasladado)" },
  "2026-09-07": { en: "Labor Day", es: "Día del Trabajo" },
  "2026-10-12": { en: "Columbus Day", es: "Día de Colón" },
  "2026-11-11": { en: "Veterans Day", es: "Día de los Veteranos" },
  "2026-11-26": { en: "Thanksgiving", es: "Acción de Gracias" },
  "2026-12-25": { en: "Christmas", es: "Navidad" },
  "2027-01-01": { en: "New Year's Day", es: "Año Nuevo" },
  "2027-01-18": { en: "MLK Day", es: "Día de MLK" },
  "2027-02-15": { en: "Presidents' Day", es: "Día de los Presidentes" },
  "2027-05-31": { en: "Memorial Day", es: "Memorial Day" },
  "2027-06-18": { en: "Juneteenth (observed)", es: "Juneteenth (feriado trasladado)" },
  "2027-07-05": { en: "Independence Day (observed)", es: "Día de la Independencia (feriado trasladado)" },
  "2027-09-06": { en: "Labor Day", es: "Día del Trabajo" },
  "2027-10-11": { en: "Columbus Day", es: "Día de Colón" },
  "2027-11-11": { en: "Veterans Day", es: "Día de los Veteranos" },
  "2027-11-25": { en: "Thanksgiving", es: "Acción de Gracias" },
  "2027-12-24": { en: "Christmas (observed)", es: "Navidad (feriado trasladado)" },
};

// Program business day: Monday–Friday, excluding federal holidays (ASSUMPTION — confirm in Orbit terms).
const isBizDay = (d: ISODate) => weekday(d) !== 0 && weekday(d) !== 6 && !HOLIDAYS[d];
// TRID "precise" business day for CD timing: every day except Sundays and federal holidays (12 CFR 1026.2(a)(6)).
const isTridDay = (d: ISODate) => weekday(d) !== 0 && !HOLIDAYS[d];

const nextWhere = (d: ISODate, ok: (x: ISODate) => boolean) => {
  let x = d;
  while (!ok(x)) x = addDays(x, 1);
  return x;
};
const addWhere = (d: ISODate, n: number, ok: (x: ISODate) => boolean) => {
  let x = d;
  let left = n;
  while (left > 0) {
    x = addDays(x, 1);
    if (ok(x)) left--;
  }
  return x;
};
export const addBiz = (d: ISODate, n: number) => addWhere(d, n, isBizDay);
const addTrid = (d: ISODate, n: number) => addWhere(d, n, isTridDay);

/* ------------------------------------------------------------------ input */

export interface Deal {
  borrower: string;
  property: string;
  price: number;
  loanAmount: number;
  brokerName: string;
  brokerCompany: string;
  brokerPhone: string;
  agentName: string;
  program: "conventional" | "fha" | "va";
  orbitPartner: boolean;
  fullPackage: boolean; // all docs for conditional approval included at Full Package Submission
  acceptance: ISODate; // contract acceptance (day 0 of the contract)
  submission: ISODate; // planned Full Package Submission to Rocket Pro
  afterCutoff: boolean; // submitted after 4:00 p.m. ET
  appraisalContingencyDays: number; // calendar days from acceptance
  financingContingencyDays: number; // calendar days from acceptance
  closing: ISODate; // closing date in the contract
  appraisalTurnBizDays: number; // ASSUMPTION: appraiser turn time, business days
  lockDate: ISODate;
  lockTermDays: number;
  cdByMail: boolean;
}

/* ------------------------------------------------------------------ program config (editable) */

export const PROGRAM = {
  name: "Purchase Priority",
  ctcBizDays: 12, // clear to close within 12 business days of Folder Received
  day9: 9, // lock, structure, title, tax certs, appraisal cleared by 8:00 p.m. ET on business day 9
  appraisalOrderBizDays: 1, // appraisal ordered within 24 hours of Folder Received
  lastFolderReceived: "2026-12-14" as ISODate, // program window: Oct 6 – Dec 14, 2026 (4:00 p.m. ET)
  standardCtcBizDays: 18, // ASSUMPTION for loans outside the program (≈ ICE lock-to-close average)
  conditionRoundsBizDays: 3, // ASSUMPTION: extra time when the first package is incomplete
  appraisalReviewBizDays: 1, // ASSUMPTION: underwriter review after the report arrives
  lockBufferDays: 2, // ASSUMPTION: lock should outlive closing by a couple of days
  lockCostPerDay: 0.0002, // ~2 bps of loan amount per extension day
};

/* ------------------------------------------------------------------ output */

export type Lane = "contract" | "loan";
export type Owner = "broker" | "borrower" | "rocket" | "appraiser" | "title" | "agent";
export type State = "ok" | "tight" | "late" | "info";

export interface Milestone {
  id: string;
  date: ISODate;
  lane: Lane;
  label: L;
  owner: Owner;
  state: State;
  detail?: L;
}

export interface Alert {
  id: string;
  level: "risk" | "warn" | "info";
  title: L;
  body: L;
  action: L;
}

export interface Plan {
  eligible: boolean;
  eligibilityReasons: L[];
  day0: ISODate;
  milestones: Milestone[];
  alerts: Alert[];
  earliestClose: ISODate;
  slackDays: number; // contract closing − earliest feasible closing
  verdict: "on_track" | "tight" | "at_risk";
  ctc: ISODate;
  appraisalBack: ISODate;
  lockExpiry: ISODate;
  holidaysInWindow: { date: ISODate; name: L }[];
}

const L_ = (en: string, es: string): L => ({ en, es });
const fmtShort = (d: ISODate, lang: "en" | "es" = "en") =>
  parse(d).toLocaleDateString(lang === "en" ? "en-US" : "es-AR", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });
export const prettyDate = fmtShort;

export function plan(d: Deal): Plan {
  const reasons: L[] = [];
  if (!d.orbitPartner) reasons.push(L_("Broker is not an Orbit partner", "El broker no es socio Orbit"));
  if (d.program !== "conventional") reasons.push(L_("Only conventional purchase loans qualify", "Solo califican compras con préstamo convencional"));
  if (!d.fullPackage) reasons.push(L_("Package incomplete at submission", "Carpeta incompleta al enviar"));

  // Day 0 = Folder Received: same business day if before the 4:00 p.m. ET cutoff, otherwise the next one.
  let day0 = nextWhere(d.submission, isBizDay);
  if (d.afterCutoff && day0 === d.submission) day0 = addBiz(day0, 1);
  if (day0 > PROGRAM.lastFolderReceived) reasons.push(L_("Program window closes Dec 14, 2026", "La ventana del programa cierra el 14 de dic. de 2026"));
  const eligible = reasons.length === 0;

  const ctcBiz = eligible ? PROGRAM.ctcBizDays : PROGRAM.standardCtcBizDays + (d.fullPackage ? 0 : PROGRAM.conditionRoundsBizDays);
  const condApproval = eligible ? day0 : addBiz(day0, d.fullPackage ? 2 : 2 + PROGRAM.conditionRoundsBizDays);
  const appraisalOrdered = addBiz(day0, PROGRAM.appraisalOrderBizDays);
  const appraisalBack = addBiz(appraisalOrdered, d.appraisalTurnBizDays);
  const appraisalCleared = addBiz(appraisalBack, PROGRAM.appraisalReviewBizDays);
  const day9 = addBiz(day0, PROGRAM.day9);
  let ctc = addBiz(day0, ctcBiz);
  // If the appraisal can't be cleared by day 9, clear-to-close slips by the same amount.
  let appraisalSlipBiz = 0;
  if (appraisalCleared > day9) {
    let x = day9;
    while (x < appraisalCleared) {
      x = addBiz(x, 1);
      appraisalSlipBiz++;
    }
    ctc = addBiz(ctc, appraisalSlipBiz);
  }

  // TRID: CD can't go out before CTC; borrower must receive it 3 business days before consummation.
  const cdSent = ctc;
  const cdReceived = d.cdByMail ? addTrid(cdSent, 3) : cdSent;
  // TRID counts Saturdays, but title companies close on weekdays: use the next weekday that isn't a holiday.
  const earliestClose = nextWhere(addTrid(cdReceived, 3), isBizDay);
  const slackDays = diffDays(earliestClose, d.closing);
  const lockExpiry = addDays(d.lockDate, d.lockTermDays);

  const appraisalContingency = addDays(d.acceptance, d.appraisalContingencyDays);
  const financingContingency = addDays(d.acceptance, d.financingContingencyDays);

  const st = (date: ISODate, deadline: ISODate, tightDays = 2): State =>
    date > deadline ? "late" : diffDays(date, deadline) <= tightDays ? "tight" : "ok";

  const ms: Milestone[] = [
    { id: "accept", date: d.acceptance, lane: "contract", label: L_("Offer accepted", "Oferta aceptada"), owner: "agent", state: "info" },
    { id: "appr_cont", date: appraisalContingency, lane: "contract", label: L_("Appraisal contingency ends", "Vence la condición de tasación"), owner: "agent", state: st(appraisalCleared, appraisalContingency, 1) },
    { id: "fin_cont", date: financingContingency, lane: "contract", label: L_("Financing contingency ends", "Vence la condición de financiamiento"), owner: "agent", state: st(ctc, financingContingency, 1) },
    { id: "close", date: d.closing, lane: "contract", label: L_("Contract closing date", "Fecha de cierre del contrato"), owner: "agent", state: slackDays < 0 ? "late" : slackDays <= 2 ? "tight" : "ok" },

    { id: "day0", date: day0, lane: "loan", label: L_("Folder received by Rocket Pro (day 0)", "Rocket Pro recibe la carpeta (día 0)"), owner: "broker", state: day0 !== d.submission ? "tight" : "ok",
      detail: day0 !== d.submission ? L_("Cutoff or non-business day moved day 0", "El horario de corte o un día no hábil movió el día 0") : undefined },
    { id: "cond", date: condApproval, lane: "loan", label: eligible ? L_("Same-day conditional approval", "Aprobación condicional en el día") : L_("Conditional approval (est.)", "Aprobación condicional (estimada)"), owner: "rocket", state: "ok" },
    { id: "appr_order", date: appraisalOrdered, lane: "loan", label: L_("Appraisal ordered (≤24h)", "Tasación pedida (≤24 h)"), owner: "broker", state: "ok" },
    { id: "appr_back", date: appraisalBack, lane: "loan", label: L_("Appraisal report back (est.)", "Llega el informe de tasación (est.)"), owner: "appraiser", state: appraisalCleared > day9 ? "late" : "ok" },
    { id: "day9", date: day9, lane: "loan", label: L_("Day 9: lock, title, taxes, appraisal cleared", "Día 9: tasa, título, impuestos y tasación resueltos"), owner: "broker", state: d.lockDate > day9 || appraisalCleared > day9 ? "late" : "ok" },
    { id: "ctc", date: ctc, lane: "loan", label: eligible ? L_("Clear to close (day 12)", "Aprobación final (día 12)") : L_("Clear to close (est.)", "Aprobación final (est.)"), owner: "rocket", state: ctc > financingContingency ? "tight" : "ok" },
    { id: "cd", date: cdReceived, lane: "loan", label: L_("Closing Disclosure received", "El cliente recibe la divulgación de cierre"), owner: "borrower", state: "ok" },
    { id: "earliest", date: earliestClose, lane: "loan", label: L_("Earliest possible closing", "Cierre más temprano posible"), owner: "title", state: slackDays < 0 ? "late" : slackDays <= 2 ? "tight" : "ok" },
  ];
  ms.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.lane === "contract" ? -1 : 1));

  /* ---------------- alerts ---------------- */
  const A: Alert[] = [];
  const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

  if (!eligible) {
    A.push({
      id: "eligibility",
      level: "warn",
      title: L_("Not eligible for the 12-day lane", "No entra en el carril de 12 días"),
      body: {
        en: `${reasons.map((r) => r.en).join("; ")}. Planning with a standard ~${ctcBiz}-business-day clear-to-close instead.`,
        es: `${reasons.map((r) => r.es).join("; ")}. Se planifica con una aprobación final estándar de ~${ctcBiz} días hábiles.`,
      },
      action: d.fullPackage
        ? L_("Plan the contract dates around the standard timeline.", "Planificar las fechas del contrato con el plazo estándar.")
        : L_("Complete the package before submitting to unlock same-day approval and the 12-day lane.", "Completar la carpeta antes de enviar para acceder a la aprobación en el día y al carril de 12 días."),
    });
  }

  if (slackDays < 0) {
    A.push({
      id: "close_late",
      level: "risk",
      title: L_(`Closing date is ${-slackDays} days too early`, `La fecha de cierre está ${-slackDays} días antes de lo posible`),
      body: {
        en: `Earliest realistic closing is ${fmtShort(earliestClose)} (clear to close ${fmtShort(ctc)} + 3-business-day Closing Disclosure wait). The contract says ${fmtShort(d.closing)}.`,
        es: `El cierre realista más temprano es el ${fmtShort(earliestClose, "es")} (aprobación final el ${fmtShort(ctc, "es")} + 3 días hábiles de espera de la divulgación de cierre). El contrato dice ${fmtShort(d.closing, "es")}.`,
      },
      action: L_(
        `Ask the agents for a closing date on or after ${fmtShort(addDays(earliestClose, 1))} now — not on closing week.`,
        `Pedirles hoy a los agentes una fecha de cierre a partir del ${fmtShort(addDays(earliestClose, 1), "es")}, no en la semana del cierre.`,
      ),
    });
  } else if (slackDays <= 2) {
    A.push({
      id: "close_tight",
      level: "warn",
      title: L_(`Only ${slackDays} days of cushion before closing`, `Solo ${slackDays} días de margen antes del cierre`),
      body: L_("Any condition that surfaces late, or a mailed Closing Disclosure, pushes the closing date.", "Cualquier condición tardía, o una divulgación de cierre enviada por correo, corre la fecha de cierre."),
      action: L_("Send the Closing Disclosure electronically and confirm title and insurance by day 9.", "Enviar la divulgación de cierre en forma electrónica y confirmar título y seguro para el día 9."),
    });
  }

  if (appraisalCleared > appraisalContingency) {
    A.push({
      id: "appraisal_cont",
      level: "risk",
      title: L_("Appraisal contingency ends before the appraisal is reviewed", "La condición de tasación vence antes de que se revise la tasación"),
      body: {
        en: `The contingency ends ${fmtShort(appraisalContingency)}; with a ${d.appraisalTurnBizDays}-business-day appraiser turn time the report is reviewed ~${fmtShort(appraisalCleared)}. The buyer would have to decide blind.`,
        es: `La condición vence el ${fmtShort(appraisalContingency, "es")}; con ${d.appraisalTurnBizDays} días hábiles del tasador, el informe se revisa ~${fmtShort(appraisalCleared, "es")}. El comprador tendría que decidir a ciegas.`,
      },
      action: L_(
        `Ask for an appraisal contingency through ${fmtShort(addDays(appraisalCleared, 1))}, or order the appraisal the same day the folder is received.`,
        `Pedir extender la condición de tasación hasta el ${fmtShort(addDays(appraisalCleared, 1), "es")}, o pedir la tasación el mismo día que se recibe la carpeta.`,
      ),
    });
  }

  if (ctc > financingContingency) {
    A.push({
      id: "financing_cont",
      level: "risk",
      title: L_("Financing contingency ends before clear to close", "La condición de financiamiento vence antes de la aprobación final"),
      body: {
        en: `The buyer must release financing protection on ${fmtShort(financingContingency)}, but clear to close is expected ${fmtShort(ctc)}. If something fails after that, the buyer can lose the earnest money.`,
        es: `El comprador debe liberar la protección de financiamiento el ${fmtShort(financingContingency, "es")}, pero la aprobación final se espera el ${fmtShort(ctc, "es")}. Si algo falla después, puede perder la seña.`,
      },
      action: L_(
        `Ask for the financing contingency through ${fmtShort(addDays(ctc, 1))}.`,
        `Pedir extender la condición de financiamiento hasta el ${fmtShort(addDays(ctc, 1), "es")}.`,
      ),
    });
  }

  if (eligible && appraisalCleared > day9) {
    A.push({
      id: "day9_appraisal",
      level: "warn",
      title: L_("Appraisal won't be cleared by day 9", "La tasación no queda resuelta para el día 9"),
      body: L_(
        `Purchase Priority needs the appraisal reviewed and cleared by 8:00 p.m. ET on business day 9 (${fmtShort(day9)}).`,
        `Purchase Priority exige la tasación revisada y resuelta antes de las 20 h (hora del Este) del día hábil 9 (${fmtShort(day9, "es")}).`,
      ),
      action: L_("Use a faster appraiser panel or check for an appraisal waiver in DU.", "Usar un tasador más rápido o revisar si DU permite exención de tasación."),
    });
  }

  if (d.lockDate > day9) {
    A.push({
      id: "lock_day9",
      level: eligible ? "warn" : "info",
      title: L_("Rate lock planned after day 9", "Bloqueo de tasa previsto después del día 9"),
      body: L_(`Purchase Priority requires the rate locked for final review by day 9 (${fmtShort(day9)}).`, `Purchase Priority exige la tasa bloqueada para la revisión final antes del día 9 (${fmtShort(day9, "es")}).`),
      action: L_("Lock on or before day 9.", "Bloquear la tasa a más tardar el día 9."),
    });
  }

  const neededExpiry = addDays(d.closing > earliestClose ? d.closing : earliestClose, PROGRAM.lockBufferDays);
  if (lockExpiry < neededExpiry) {
    const days = diffDays(lockExpiry, neededExpiry);
    A.push({
      id: "lock_expiry",
      level: "risk",
      title: L_(`Rate lock expires ${days} days too early`, `El bloqueo de tasa vence ${days} días antes de lo necesario`),
      body: {
        en: `A ${d.lockTermDays}-day lock from ${fmtShort(d.lockDate)} expires ${fmtShort(lockExpiry)}. Extending ~${days} days costs about ${money(days * PROGRAM.lockCostPerDay * d.loanAmount)}.`,
        es: `Un bloqueo de ${d.lockTermDays} días desde el ${fmtShort(d.lockDate, "es")} vence el ${fmtShort(lockExpiry, "es")}. Extenderlo ~${days} días cuesta cerca de ${money(days * PROGRAM.lockCostPerDay * d.loanAmount)}.`,
      },
      action: L_("Choose a longer lock term now; it is usually cheaper than an extension.", "Elegir ahora un plazo de bloqueo más largo; suele salir más barato que una extensión."),
    });
  }

  if (d.afterCutoff) {
    A.push({
      id: "cutoff",
      level: "info",
      title: L_("Submitted after the 4:00 p.m. ET cutoff", "Envío después del corte de las 16 h (hora del Este)"),
      body: L_("The whole timeline starts one business day later.", "Todo el cronograma arranca un día hábil más tarde."),
      action: L_("Submit before 4:00 p.m. ET to gain a day.", "Enviar antes de las 16 h (hora del Este) para ganar un día."),
    });
  }
  if (d.cdByMail) {
    A.push({
      id: "cd_mail",
      level: "info",
      title: L_("Closing Disclosure by mail adds 3 days", "La divulgación de cierre por correo suma 3 días"),
      body: L_("Mailed disclosures are presumed received 3 business days after sending.", "Por correo, se presume recibida 3 días hábiles después del envío."),
      action: L_("Get e-consent from the borrower.", "Conseguir el consentimiento electrónico del cliente."),
    });
  }

  const holidaysInWindow = Object.entries(HOLIDAYS)
    .filter(([date]) => date >= d.acceptance && date <= (d.closing > earliestClose ? d.closing : earliestClose))
    .map(([date, name]) => ({ date, name }));
  if (holidaysInWindow.length) {
    A.push({
      id: "holidays",
      level: "info",
      title: L_(`${holidaysInWindow.length} federal holiday(s) inside the deal`, `${holidaysInWindow.length} feriado(s) federal(es) dentro de la operación`),
      body: {
        en: holidaysInWindow.map((h) => `${h.name.en} (${fmtShort(h.date)})`).join(", ") + " — already excluded from business-day counts.",
        es: holidaysInWindow.map((h) => `${h.name.es} (${fmtShort(h.date, "es")})`).join(", ") + ": ya descontados de los días hábiles.",
      },
      action: L_("Tell the borrower and agent which days nothing moves.", "Avisar al cliente y al agente qué días no se mueve nada."),
    });
  }

  const order = { risk: 0, warn: 1, info: 2 };
  A.sort((a, b) => order[a.level] - order[b.level]);

  const risks = A.filter((a) => a.level === "risk").length;
  const verdict: Plan["verdict"] = risks > 0 ? "at_risk" : A.some((a) => a.level === "warn") ? "tight" : "on_track";

  return { eligible, eligibilityReasons: reasons, day0, milestones: ms, alerts: A, earliestClose, slackDays, verdict, ctc, appraisalBack, lockExpiry, holidaysInWindow };
}

/* ------------------------------------------------------------------ default contract */

// A realistic purchase contract, dated relative to today so the demo always looks current.
export function defaultDeal(today: ISODate): Deal {
  const acceptance = addDays(today, -1);
  return {
    borrower: "Maria Gomez",
    property: "1452 Oak Ridge Dr, Austin, TX",
    price: 412000,
    loanAmount: 391400,
    brokerName: "Alex Rivera",
    brokerCompany: "Northline Home Loans",
    brokerPhone: "(512) 555-0142",
    agentName: "Dana Brooks",
    program: "conventional",
    orbitPartner: true,
    fullPackage: true,
    acceptance,
    submission: addDays(today, 1),
    afterCutoff: true,
    appraisalContingencyDays: 14,
    financingContingencyDays: 21,
    closing: addDays(acceptance, 30),
    appraisalTurnBizDays: 7,
    lockDate: addDays(today, 1),
    lockTermDays: 30,
    cdByMail: false,
  };
}

export function agentMessage(d: Deal, p: Plan, lang: "en" | "es"): string {
  const next = p.milestones.find((m) => m.lane === "loan" && m.date >= d.submission && m.id !== "day0");
  const daysLeft = Math.max(0, diffDays(new Date().toISOString().slice(0, 10), d.closing));
  if (lang === "es") {
    return `Hola ${d.agentName.split(" ")[0]}: novedades de ${d.property}.\n` +
      `• Cierre del contrato: ${fmtShort(d.closing, "es")} (${daysLeft} días). ${p.slackDays >= 0 ? "Vamos en fecha." : `Necesitamos mover el cierre al ${fmtShort(addDays(p.earliestClose, 1), "es")} o después.`}\n` +
      `• Aprobación final estimada: ${fmtShort(p.ctc, "es")}.\n` +
      (next ? `• Próximo paso: ${next.label.es} (${fmtShort(next.date, "es")}).\n` : "") +
      (p.alerts.filter((a) => a.level === "risk").length ? `• Para pedir ya: ${p.alerts.filter((a) => a.level === "risk").map((a) => a.action.es).join(" ")}\n` : "") +
      `Seguimiento en vivo: [link de seguimiento]\n— ${d.brokerName}, ${d.brokerCompany}`;
  }
  return `Hi ${d.agentName.split(" ")[0]}, update on ${d.property}.\n` +
    `• Contract closing: ${fmtShort(d.closing)} (${daysLeft} days). ${p.slackDays >= 0 ? "We're on track." : `We need to move closing to ${fmtShort(addDays(p.earliestClose, 1))} or later.`}\n` +
    `• Estimated clear to close: ${fmtShort(p.ctc)}.\n` +
    (next ? `• Next step: ${next.label.en} (${fmtShort(next.date)}).\n` : "") +
    (p.alerts.filter((a) => a.level === "risk").length ? `• Please request now: ${p.alerts.filter((a) => a.level === "risk").map((a) => a.action.en).join(" ")}\n` : "") +
    `Live tracker: [tracker link]\n— ${d.brokerName}, ${d.brokerCompany}`;
}

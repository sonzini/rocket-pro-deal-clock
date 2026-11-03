// Clean File — pre-submission readiness engine.
// Deterministic rules based on public agency guidelines (Fannie Mae Selling Guide, HUD 4000.1)
// and common wholesale practice. No AI, no network calls, no borrower data leaves the browser.
// This is a checklist that helps a broker prepare a file — it is NOT an underwriting decision.

export type Lang = "en" | "es";
export type L = { en: string; es: string };

export type Program = "conventional" | "fha" | "va";
export type Purpose = "purchase" | "refinance";
export type IncomeType = "w2" | "self_employed" | "retired";
export type PropertyType = "sfr" | "condo" | "multi";

export interface LoanFile {
  label: string;
  purpose: Purpose;
  program: Program;
  propertyType: PropertyType;
  price: number; // purchase price or estimated value
  loanAmount: number;
  creditScore: number;
  monthlyIncome: number;
  monthlyDebts: number; // all debts incl. proposed housing payment
  incomeType: IncomeType;
  yearsInLine: number; // years at current job / in business
  employmentGapMonths: number; // longest gap in the last 2 years
  variableIncome: boolean; // overtime, bonus, commission used to qualify
  taxReturns2y: boolean; // self-employed: 2 years personal + business returns on file
  ytdProfitLoss: boolean; // self-employed: year-to-date P&L on file
  paystubAgeDays: number;
  bankStatementAgeDays: number; // days since statement period end
  largestDepositAmount: number; // largest single non-payroll deposit in statements
  depositSourced: boolean;
  giftAmount: number;
  giftLetter: boolean;
  giftTransferProof: boolean;
  recentInquiries: number; // credit inquiries in last 120 days
  inquiryLoe: boolean;
  condoQuestionnaire: boolean;
  insuranceBinder: boolean;
  contractFullyExecuted: boolean;
  appraisalOrdered: boolean;
  appraisalWaiver: boolean;
  daysToContractClosing: number; // calendar days until the closing date in the contract
}

export type Severity = "blocker" | "likely" | "watch";
export type Owner = "borrower" | "broker" | "third_party";

export interface Finding {
  id: string;
  severity: Severity;
  owner: Owner;
  title: L;
  why: L;
  fix: L;
  ask?: L; // plain-language request to the borrower
  ref: string; // public guideline or practice reference
  cycleDays: number; // business days a late-surfacing version of this condition typically costs
}

export interface Timeline {
  typicalCloseDays: number; // calendar days to close if conditions surface after submission
  cleanCloseDays: number; // calendar days to close if fixed before submission
  contractDays: number;
  typicalSlipDays: number; // >0 means closing date at risk
  cleanSlipDays: number;
  lockExtensionCost: number; // est. cost of typical slip at 2 bps/day
}

export interface Result {
  score: number;
  status: "ready" | "almost" | "not_ready";
  findings: Finding[];
  ltv: number;
  dti: number;
  timeline: Timeline;
  conditionsAvoidable: number;
  cycleDaysAvoidable: number;
}

const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
const pct = (n: number) => (Math.round(n * 10) / 10).toFixed(1) + "%";

// Rocket Pro's public "Power Play" commitment: clear-to-close within 12 business days on
// eligible purchase loans (HousingWire, Jul 7 2026). Used as the post-submission baseline.
export const CTC_BUSINESS_DAYS = 12;
const CD_WAITING_BUSINESS_DAYS = 3; // TRID: borrower must receive the CD 3 business days before closing
const toCalendar = (businessDays: number) => Math.ceil(businessDays * 1.4);

export function evaluate(f: LoanFile): Result {
  const out: Finding[] = [];
  const ltv = f.price > 0 ? (f.loanAmount / f.price) * 100 : 0;
  const dti = f.monthlyIncome > 0 ? (f.monthlyDebts / f.monthlyIncome) * 100 : 0;
  const isPurchase = f.purpose === "purchase";

  // --- Eligibility / structure ---------------------------------------------------------
  const dtiMax = f.program === "conventional" ? 50 : f.program === "fha" ? 56.9 : 60;
  if (dti > dtiMax) {
    out.push({
      id: "dti_high",
      severity: "blocker",
      owner: "broker",
      title: { en: `DTI ${pct(dti)} is above the ${dtiMax}% ceiling`, es: `DTI ${pct(dti)} supera el tope de ${dtiMax}%` },
      why: {
        en: "The file is likely to come back ineligible or restructured after submission — the most expensive surprise of all.",
        es: "El préstamo probablemente vuelva como no elegible o haya que reestructurarlo después de enviarlo: la sorpresa más cara.",
      },
      fix: {
        en: "Restructure before submitting: pay off a debt, add a co-borrower, or lower the loan amount. Re-run AUS.",
        es: "Reestructurar antes de enviar: cancelar una deuda, sumar un co-deudor o bajar el monto. Volver a correr el AUS.",
      },
      ref: f.program === "conventional" ? "Fannie Mae B3-6-02 (DU max DTI 50%)" : f.program === "fha" ? "HUD 4000.1 II.A.5 (TOTAL Scorecard)" : "VA Pamphlet 26-7 ch.4 (residual income)",
      cycleDays: 5,
    });
  } else if (dti > dtiMax - 5) {
    out.push({
      id: "dti_edge",
      severity: "watch",
      owner: "broker",
      title: { en: `DTI ${pct(dti)} is close to the limit`, es: `DTI ${pct(dti)} está cerca del límite` },
      why: {
        en: "Any income re-calculation by the underwriter (overtime, a new debt on credit) can tip the file over.",
        es: "Cualquier recálculo del ingreso (horas extra, una deuda nueva en el reporte) puede dejar el préstamo afuera.",
      },
      fix: {
        en: "Use only fully documented income and include every debt. Note compensating factors (reserves, residual income).",
        es: "Usar solo ingresos 100% documentados e incluir todas las deudas. Dejar anotados factores compensatorios (reservas).",
      },
      ref: "Fannie Mae B3-6-02 / HUD 4000.1",
      cycleDays: 2,
    });
  }

  const ltvMax = f.program === "conventional" ? 97 : f.program === "fha" ? 96.5 : 100;
  if (ltv > ltvMax) {
    out.push({
      id: "ltv_high",
      severity: "blocker",
      owner: "broker",
      title: { en: `LTV ${pct(ltv)} exceeds the ${ltvMax}% maximum`, es: `LTV ${pct(ltv)} supera el máximo de ${ltvMax}%` },
      why: { en: "Ineligible as structured.", es: "No es elegible tal como está armado." },
      fix: { en: "Increase down payment or reduce the loan amount before submission.", es: "Aumentar el anticipo o bajar el monto antes de enviar." },
      ref: f.program === "conventional" ? "Fannie Mae Eligibility Matrix" : f.program === "fha" ? "HUD 4000.1 II.A.2" : "VA Pamphlet 26-7",
      cycleDays: 5,
    });
  }

  if (f.program === "fha" && f.creditScore < 580 && ltv > 90) {
    out.push({
      id: "fha_score",
      severity: "blocker",
      owner: "broker",
      title: { en: "FHA score under 580 requires 10% down", es: "FHA con score menor a 580 exige 10% de anticipo" },
      why: { en: "Max LTV drops to 90% below a 580 score.", es: "Con score menor a 580 el LTV máximo baja a 90%." },
      fix: { en: "Restructure to 90% LTV or work on the score before submitting.", es: "Reestructurar a 90% LTV o mejorar el score antes de enviar." },
      ref: "HUD 4000.1 II.A.1.b",
      cycleDays: 5,
    });
  }

  // --- Income ----------------------------------------------------------------------------
  if (f.incomeType === "self_employed") {
    if (!f.taxReturns2y) {
      out.push({
        id: "se_returns",
        severity: "blocker",
        owner: "borrower",
        title: { en: "Two years of tax returns missing (self-employed)", es: "Faltan 2 años de declaraciones de impuestos (independiente)" },
        why: {
          en: "Self-employed income is the #1 source of income conditions; automated verification rarely covers it.",
          es: "El ingreso de independientes es la principal fuente de condiciones de ingreso; la verificación automática casi nunca lo cubre.",
        },
        fix: { en: "Collect 2 years personal + business returns (all schedules, signed) before submitting.", es: "Juntar 2 años de declaraciones personales y del negocio (con todos los anexos, firmadas) antes de enviar." },
        ask: {
          en: "Your last 2 years of personal and business tax returns — every page and schedule.",
          es: "Tus declaraciones de impuestos personales y del negocio de los últimos 2 años, con todas las páginas y anexos.",
        },
        ref: "Fannie Mae B3-3.2-01",
        cycleDays: 4,
      });
    }
    if (!f.ytdProfitLoss) {
      out.push({
        id: "se_pl",
        severity: "likely",
        owner: "borrower",
        title: { en: "Year-to-date P&L not on file", es: "Falta el estado de resultados del año en curso (P&L)" },
        why: {
          en: "Underwriters usually ask for it to confirm the business is still performing — and to check the trend.",
          es: "El analista suele pedirlo para confirmar que el negocio sigue funcionando y ver la tendencia.",
        },
        fix: { en: "Request a YTD P&L (and business bank statements) up front.", es: "Pedir el P&L del año y extractos bancarios del negocio desde el inicio." },
        ask: { en: "A year-to-date profit & loss statement for your business.", es: "Un estado de resultados (P&L) del negocio de este año." },
        ref: "Fannie Mae B3-3.2-01 / common lender requirement",
        cycleDays: 2,
      });
    }
    if (f.yearsInLine < 2) {
      out.push({
        id: "se_history",
        severity: "likely",
        owner: "broker",
        title: { en: "Less than 2 years self-employed", es: "Menos de 2 años como independiente" },
        why: { en: "Requires proof of prior experience in the same line of work, or the income may not count.", es: "Hay que probar experiencia previa en el mismo rubro, o el ingreso puede no contarse." },
        fix: { en: "Document prior W-2 history in the same field plus a letter of explanation.", es: "Documentar empleo previo en el mismo rubro y una carta explicativa." },
        ask: { en: "A short letter describing your work history in this field before starting the business.", es: "Una breve carta contando tu experiencia en este rubro antes de abrir el negocio." },
        ref: "Fannie Mae B3-3.2-01",
        cycleDays: 2,
      });
    }
  }

  if (f.incomeType === "w2") {
    if (f.paystubAgeDays > 30) {
      out.push({
        id: "paystub_stale",
        severity: "likely",
        owner: "borrower",
        title: { en: `Paystub is ${f.paystubAgeDays} days old`, es: `El recibo de sueldo tiene ${f.paystubAgeDays} días` },
        why: {
          en: "It must be dated within 30 days of application — a guaranteed 'updated paystub' condition.",
          es: "Debe tener menos de 30 días a la fecha de solicitud: es una condición de 'recibo actualizado' asegurada.",
        },
        fix: { en: "Get the most recent paystub (covering 30 days, with YTD) before submitting.", es: "Pedir el último recibo (que cubra 30 días, con acumulado anual) antes de enviar." },
        ask: { en: "Your most recent paystub(s) covering the last 30 days.", es: "Tu(s) último(s) recibo(s) de sueldo de los últimos 30 días." },
        ref: "Fannie Mae B3-3.1-02",
        cycleDays: 1.5,
      });
    }
    if (f.yearsInLine < 2) {
      out.push({
        id: "w2_history",
        severity: "likely",
        owner: "borrower",
        title: { en: "Less than 2 years at current employer", es: "Menos de 2 años en el empleo actual" },
        why: { en: "Underwriting needs a full 2-year employment history — prior employer W-2s or VOE.", es: "El análisis necesita 2 años completos de historial laboral: W-2 o verificación del empleo anterior." },
        fix: { en: "Collect prior employer W-2 and dates of employment now.", es: "Juntar ahora el W-2 del empleo anterior y las fechas." },
        ask: { en: "Your W-2 from your previous employer and your start/end dates there.", es: "El W-2 de tu empleo anterior y las fechas de ingreso y salida." },
        ref: "Fannie Mae B3-3.1-01",
        cycleDays: 1.5,
      });
    }
    if (f.variableIncome) {
      out.push({
        id: "variable_income",
        severity: "likely",
        owner: "broker",
        title: { en: "Overtime/bonus used to qualify", es: "Se usan horas extra o bonos para calificar" },
        why: { en: "Needs a 2-year history and a stable or rising trend, usually via written VOE.", es: "Necesita 2 años de historial y tendencia estable o creciente, normalmente con una verificación escrita del empleador." },
        fix: { en: "Order a written VOE with the YTD and 2-year breakdown before submitting.", es: "Pedir la verificación escrita (WVOE) con el detalle de 2 años antes de enviar." },
        ref: "Fannie Mae B3-3.1-01 (variable income)",
        cycleDays: 2,
      });
    }
  }

  if (f.employmentGapMonths >= 1) {
    out.push({
      id: "gap",
      severity: f.employmentGapMonths >= 6 ? "likely" : "watch",
      owner: "borrower",
      title: { en: `${f.employmentGapMonths}-month employment gap`, es: `Interrupción laboral de ${f.employmentGapMonths} meses` },
      why: { en: "Gaps in the last 2 years almost always trigger a letter of explanation request.", es: "Las interrupciones en los últimos 2 años casi siempre generan pedido de carta explicativa." },
      fix: { en: "Get the letter of explanation signed before submitting.", es: "Conseguir la carta explicativa firmada antes de enviar." },
      ask: { en: "A short signed note explaining the gap in your employment and when you returned to work.", es: "Una nota firmada explicando la interrupción laboral y cuándo volviste a trabajar." },
      ref: "Common underwriting practice / HUD 4000.1 II.A.4.c (FHA: gaps ≥ 6 months)",
      cycleDays: 1.5,
    });
  }

  // --- Assets ----------------------------------------------------------------------------
  if (f.bankStatementAgeDays > 30) {
    out.push({
      id: "stmt_stale",
      severity: f.bankStatementAgeDays > 60 ? "likely" : "watch",
      owner: "borrower",
      title: { en: `Bank statement ended ${f.bankStatementAgeDays} days ago`, es: `El extracto bancario cerró hace ${f.bankStatementAgeDays} días` },
      why: {
        en: "With ~26 days from lock to close, an older statement will expire before closing and come back as a condition.",
        es: "Con ~26 días entre el bloqueo de tasa y el cierre, un extracto viejo vence antes de cerrar y vuelve como condición.",
      },
      fix: { en: "Upload the latest full statement (all pages) now.", es: "Subir ahora el último extracto completo (todas las páginas)." },
      ask: { en: "Your latest bank statement — every page, even the blank ones.", es: "Tu último extracto bancario, con todas las páginas (incluso las en blanco)." },
      ref: "Fannie Mae B1-1-03 / B3-4.2-01",
      cycleDays: 1.5,
    });
  }

  const depositThreshold = f.monthlyIncome * 0.5;
  if (isPurchase && f.largestDepositAmount > depositThreshold && !f.depositSourced) {
    out.push({
      id: "large_deposit",
      severity: "likely",
      owner: "borrower",
      title: {
        en: `Unsourced deposit of ${money(f.largestDepositAmount)}`,
        es: `Depósito sin justificar de ${money(f.largestDepositAmount)}`,
      },
      why: {
        en: `On a purchase, any single deposit above 50% of monthly income (${money(depositThreshold)}) must be sourced.`,
        es: `En una compra, todo depósito mayor al 50% del ingreso mensual (${money(depositThreshold)}) debe justificarse.`,
      },
      fix: { en: "Get the paper trail and a signed letter of explanation before submitting.", es: "Conseguir el respaldo documental y una carta explicativa firmada antes de enviar." },
      ask: {
        en: `Proof of where the ${money(f.largestDepositAmount)} deposit came from (e.g. the other account's statement or a sale receipt) and a one-line signed explanation.`,
        es: `Prueba del origen del depósito de ${money(f.largestDepositAmount)} (por ejemplo el extracto de la otra cuenta o el comprobante de venta) y una explicación firmada de una línea.`,
      },
      ref: "Fannie Mae B3-4.2-02",
      cycleDays: 2,
    });
  }

  if (f.giftAmount > 0) {
    if (!f.giftLetter) {
      out.push({
        id: "gift_letter",
        severity: "blocker",
        owner: "borrower",
        title: { en: `Gift of ${money(f.giftAmount)} without a gift letter`, es: `Regalo de ${money(f.giftAmount)} sin carta de donación` },
        why: { en: "Gift funds cannot be used without a signed letter stating no repayment is expected.", es: "No se pueden usar fondos donados sin una carta firmada que diga que no deben devolverse." },
        fix: { en: "Send the donor the gift letter template today.", es: "Enviar hoy al donante el modelo de carta de donación." },
        ask: {
          en: "A signed gift letter from your donor (we'll send you the template) stating the amount and that it doesn't need to be repaid.",
          es: "Una carta de donación firmada por quien te regala el dinero (te mandamos el modelo), con el monto y aclarando que no hay que devolverlo.",
        },
        ref: "Fannie Mae B3-4.3-04",
        cycleDays: 2,
      });
    }
    if (!f.giftTransferProof) {
      out.push({
        id: "gift_transfer",
        severity: "likely",
        owner: "borrower",
        title: { en: "No evidence of gift transfer", es: "Falta el comprobante de la transferencia del regalo" },
        why: { en: "The underwriter must see the funds leave the donor and arrive (or go to escrow).", es: "El analista tiene que ver los fondos salir del donante y llegar (o ir al escrow)." },
        fix: { en: "Get the transfer receipt or the escrow deposit confirmation.", es: "Conseguir el comprobante de transferencia o la confirmación del depósito en escrow." },
        ask: { en: "The receipt showing the gift money moving from the donor's account to yours (or to escrow).", es: "El comprobante del dinero pasando de la cuenta del donante a la tuya (o al escrow)." },
        ref: "Fannie Mae B3-4.3-04",
        cycleDays: 1.5,
      });
    }
  }

  // --- Credit ----------------------------------------------------------------------------
  if (f.recentInquiries > 0 && !f.inquiryLoe) {
    out.push({
      id: "inquiries",
      severity: "watch",
      owner: "borrower",
      title: { en: `${f.recentInquiries} recent credit inquiries without explanation`, es: `${f.recentInquiries} consultas de crédito recientes sin explicar` },
      why: { en: "Underwriters ask whether new debt was opened — a classic late condition.", es: "El analista pregunta si se abrió deuda nueva: una condición tardía clásica." },
      fix: { en: "Collect a credit inquiry letter up front.", es: "Pedir desde el inicio una carta sobre las consultas de crédito." },
      ask: { en: "A short note confirming whether any new credit was opened after the recent inquiries.", es: "Una nota breve confirmando si abriste crédito nuevo después de las consultas recientes." },
      ref: "Common underwriting practice (credit inquiry LOE)",
      cycleDays: 1,
    });
  }
  if (f.program === "conventional" && f.creditScore < 620) {
    out.push({
      id: "score_conv",
      severity: "watch",
      owner: "broker",
      title: { en: `Credit score ${f.creditScore} on a conventional loan`, es: `Score ${f.creditScore} en un préstamo convencional` },
      why: {
        en: "Fannie Mae dropped the 620 minimum in DU (Nov 2025), but lender overlays may still apply.",
        es: "Fannie Mae eliminó el mínimo de 620 en DU (nov. 2025), pero el prestamista puede tener sus propias exigencias.",
      },
      fix: { en: "Confirm the Rocket Pro overlay with your AE (or Pathfinder) before locking.", es: "Confirmar la exigencia de Rocket Pro con tu AE (o en Pathfinder) antes de bloquear la tasa." },
      ref: "Fannie Mae DU release notes, Nov 16 2025",
      cycleDays: 2,
    });
  }

  // --- Property & third parties ----------------------------------------------------------
  if (f.propertyType === "condo" && !f.condoQuestionnaire) {
    out.push({
      id: "condo",
      severity: "likely",
      owner: "third_party",
      title: { en: "Condo questionnaire not ordered", es: "No se pidió el cuestionario del condominio" },
      why: { en: "Project review depends on the HOA — often the slowest third party in the file.", es: "La revisión del edificio depende de la administración: suele ser el tercero más lento." },
      fix: { en: "Order the HOA questionnaire on day one; it can take 1–2 weeks.", es: "Pedir el cuestionario a la administración el primer día: puede tardar 1–2 semanas." },
      ref: "Fannie Mae B4-2.1 (project standards)",
      cycleDays: 4,
    });
  }
  if (isPurchase && !f.insuranceBinder) {
    out.push({
      id: "hoi",
      severity: "likely",
      owner: "borrower",
      title: { en: "Homeowners insurance not bound", es: "Seguro de la vivienda sin contratar" },
      why: { en: "Required before closing documents can be drawn — commonly discovered late.", es: "Es requisito para emitir los documentos de cierre y suele descubrirse tarde." },
      fix: { en: "Have the borrower pick an insurer now and send the binder with the submission.", es: "Que el comprador elija aseguradora ya y enviar la póliza junto con el envío." },
      ask: {
        en: "Choose a homeowners insurance company and ask them to send us the policy binder for the new home.",
        es: "Elegí una aseguradora para la casa y pediles que nos envíen la póliza provisoria (binder).",
      },
      ref: "Fannie Mae B7-3 (property insurance)",
      cycleDays: 1.5,
    });
  }
  if (isPurchase && !f.contractFullyExecuted) {
    out.push({
      id: "contract",
      severity: "blocker",
      owner: "broker",
      title: { en: "Purchase contract not fully signed", es: "Contrato de compra sin todas las firmas" },
      why: { en: "Missing signatures or addenda stop the file at setup.", es: "Faltan firmas o anexos: el préstamo se frena en la carga inicial." },
      fix: { en: "Get every page and addendum initialed and signed by all parties from the agent.", es: "Pedirle al agente todas las páginas y anexos firmados por todas las partes." },
      ref: "Lender file setup requirement",
      cycleDays: 2,
    });
  }
  const needsAppraisal = !f.appraisalWaiver;
  if (needsAppraisal && !f.appraisalOrdered) {
    out.push({
      id: "appraisal",
      severity: "watch",
      owner: "third_party",
      title: { en: "Appraisal not yet ordered", es: "Tasación todavía no pedida" },
      why: {
        en: "Appraisals take 5–14 business days and are a top cause of contract delays (5% of contracts in Sep 2026).",
        es: "Las tasaciones tardan 5–14 días hábiles y son una de las principales causas de demoras (5% de los contratos en sep. 2026).",
      },
      fix: {
        en: "Order it within 24 hours of submission — a Purchase Priority requirement for the 12-day clear-to-close. Check waiver eligibility in DU/LPA.",
        es: "Pedirla dentro de las 24 horas del envío: es requisito de Purchase Priority para la aprobación final en 12 días. Revisar si califica para exención en DU/LPA.",
      },
      ref: "Rocket Pro Purchase Priority terms; NAR Realtors Confidence Index, Sep 2026",
      cycleDays: 0,
    });
  }

  // --- "11th hour" items: things that are fine today but will not be fine on closing week ---
  const expectedCloseDays = toCalendar(CTC_BUSINESS_DAYS + CD_WAITING_BUSINESS_DAYS + 2);
  const oldestDocAge = Math.max(f.incomeType === "w2" ? f.paystubAgeDays : 0, f.bankStatementAgeDays);
  if (oldestDocAge + expectedCloseDays > 120) {
    out.push({
      id: "doc_expiry",
      severity: "likely",
      owner: "borrower",
      title: { en: "Documents will expire before closing", es: "Los documentos vencen antes del cierre" },
      why: {
        en: `Credit documents can't be older than 120 days at closing. At ~${expectedCloseDays} days to close, these will be ~${oldestDocAge + expectedCloseDays}.`,
        es: `Los documentos no pueden tener más de 120 días al cierre. Con ~${expectedCloseDays} días hasta cerrar, van a tener ~${oldestDocAge + expectedCloseDays}.`,
      },
      fix: { en: "Collect fresh statements and paystubs now instead of on closing week.", es: "Pedir ya extractos y recibos nuevos, no en la semana del cierre." },
      ask: { en: "Your newest paystub and bank statement as soon as they're available.", es: "Tu recibo de sueldo y extracto más nuevos apenas estén disponibles." },
      ref: "Fannie Mae B1-1-03 (allowable age of credit documents)",
      cycleDays: 1.5,
    });
  }
  if (f.incomeType === "w2") {
    out.push({
      id: "vvoe",
      severity: "watch",
      owner: "broker",
      title: { en: "Final verbal VOE due within 10 business days of closing", es: "Verificación final de empleo dentro de los 10 días hábiles previos al cierre" },
      why: {
        en: "A classic 11th-hour condition: schedule it now so it isn't discovered on closing week.",
        es: "Clásica condición de último momento: agendarla ya para no descubrirla en la semana del cierre.",
      },
      fix: { en: "Confirm the employer's HR contact or Work Number availability today.", es: "Confirmar hoy el contacto de RR.HH. del empleador o la disponibilidad en The Work Number." },
      ref: "Fannie Mae B3-3.1-07",
      cycleDays: 0,
    });
  }

  // --- Score -----------------------------------------------------------------------------
  const weight: Record<Severity, number> = { blocker: 22, likely: 9, watch: 3 };
  const score = Math.max(0, Math.min(100, Math.round(100 - out.reduce((s, x) => s + weight[x.severity], 0))));
  const blockers = out.filter((x) => x.severity === "blocker").length;
  const likely = out.filter((x) => x.severity === "likely").length;
  const status: Result["status"] = blockers > 0 || score < 60 ? "not_ready" : score < 85 || likely > 0 ? "almost" : "ready";

  // --- Timeline signal -------------------------------------------------------------------
  // Typical path: each condition found after submission adds a round trip; conditions are
  // usually issued in 2–3 waves, so we sum the cycle days of the 3 slowest + 30% of the rest.
  const cycles = out.map((x) => x.cycleDays).sort((a, b) => b - a);
  const lateCycleBiz = cycles.slice(0, 3).reduce((a, b) => a + b, 0) + cycles.slice(3).reduce((a, b) => a + b, 0) * 0.3;
  const appraisalBiz = needsAppraisal && !f.appraisalOrdered ? 3 : 0; // late order beyond the 12-day window
  const typicalBiz = CTC_BUSINESS_DAYS + lateCycleBiz + appraisalBiz + CD_WAITING_BUSINESS_DAYS + 2; // +2 setup
  const cleanBiz = CTC_BUSINESS_DAYS + CD_WAITING_BUSINESS_DAYS + 2;
  const typicalCloseDays = toCalendar(typicalBiz);
  const cleanCloseDays = toCalendar(cleanBiz);
  const typicalSlipDays = Math.max(0, typicalCloseDays - f.daysToContractClosing);
  const cleanSlipDays = Math.max(0, cleanCloseDays - f.daysToContractClosing);
  const lockExtensionCost = typicalSlipDays * 0.0002 * f.loanAmount; // ~2 bps per day

  if (isPurchase && typicalSlipDays > 0) {
    out.unshift({
      id: "closing_risk",
      severity: cleanSlipDays > 0 ? "blocker" : "likely",
      owner: "broker",
      title: {
        en: `Closing date at risk: ~${typicalSlipDays} days late on the typical path`,
        es: `Fecha de cierre en riesgo: ~${typicalSlipDays} días de atraso en el camino típico`,
      },
      why: {
        en:
          cleanSlipDays > 0
            ? `Even a clean file needs ~${cleanCloseDays} days. Ask the agent for an extension now, not on closing week.`
            : `If these conditions surface after submission the loan closes ~${typicalCloseDays} days out vs. ${f.daysToContractClosing} in the contract. Fixed up front, it fits.`,
        es:
          cleanSlipDays > 0
            ? `Aun un préstamo limpio necesita ~${cleanCloseDays} días. Pedile al agente una extensión ahora, no en la semana de cierre.`
            : `Si estas condiciones aparecen después del envío, el préstamo cierra en ~${typicalCloseDays} días contra ${f.daysToContractClosing} del contrato. Resuelto antes, entra en fecha.`,
      },
      fix: {
        en: "Resolve the items below before submitting and share the timeline with the buyer's agent today.",
        es: "Resolver los puntos de abajo antes de enviar y compartir hoy el cronograma con el agente del comprador.",
      },
      ref: "Rocket Pro Power Play (CTC ≤12 business days) + TRID 3-day CD rule",
      cycleDays: 0,
    });
  }

  const order: Record<Severity, number> = { blocker: 0, likely: 1, watch: 2 };
  out.sort((a, b) => order[a.severity] - order[b.severity]);

  const avoidable = out.filter((x) => x.cycleDays > 0);
  return {
    score,
    status,
    findings: out,
    ltv,
    dti,
    timeline: {
      typicalCloseDays,
      cleanCloseDays,
      contractDays: f.daysToContractClosing,
      typicalSlipDays,
      cleanSlipDays,
      lockExtensionCost,
    },
    conditionsAvoidable: avoidable.length,
    cycleDaysAvoidable: Math.round(lateCycleBiz * 10) / 10,
  };
}

export function borrowerMessage(f: LoanFile, findings: Finding[], lang: Lang, brokerName = "your loan officer"): string {
  const asks = findings.filter((x) => x.ask).map((x) => x.ask![lang]);
  const first = f.label.split(" — ")[0];
  if (lang === "es") {
    if (!asks.length) return `Hola ${first}: ¡tu carpeta está completa! Ya la enviamos para aprobación. Te aviso apenas tengamos novedades.\n— ${brokerName === "your loan officer" ? "tu oficial de préstamos" : brokerName}`;
    return `Hola ${first}: para enviar tu préstamo de una sola vez y cerrar en fecha, necesito estas ${asks.length} cosas:\n\n${asks.map((a, i) => `${i + 1}. ${a}`).join("\n")}\n\nSi me las mandás juntas evitamos idas y vueltas con el analista. ¡Gracias!\n— ${brokerName === "your loan officer" ? "tu oficial de préstamos" : brokerName}`;
  }
  if (!asks.length) return `Hi ${first}, your file is complete! We've sent it for approval and I'll update you as soon as we hear back.\n— ${brokerName}`;
  return `Hi ${first}, to submit your loan once and close on time, I need these ${asks.length} items:\n\n${asks.map((a, i) => `${i + 1}. ${a}`).join("\n")}\n\nSending them together saves us back-and-forth with underwriting. Thank you!\n— ${brokerName}`;
}

export const SAMPLES: LoanFile[] = [
  {
    label: "Maria Gomez — first-time buyer, FHA purchase",
    purpose: "purchase",
    program: "fha",
    propertyType: "condo",
    price: 385000,
    loanAmount: 371525,
    creditScore: 662,
    monthlyIncome: 7400,
    monthlyDebts: 3480,
    incomeType: "w2",
    yearsInLine: 1.5,
    employmentGapMonths: 4,
    variableIncome: false,
    taxReturns2y: false,
    ytdProfitLoss: false,
    paystubAgeDays: 41,
    bankStatementAgeDays: 52,
    largestDepositAmount: 4800,
    depositSourced: false,
    giftAmount: 12000,
    giftLetter: false,
    giftTransferProof: false,
    recentInquiries: 2,
    inquiryLoe: false,
    condoQuestionnaire: false,
    insuranceBinder: false,
    contractFullyExecuted: true,
    appraisalOrdered: false,
    appraisalWaiver: false,
    daysToContractClosing: 30,
  },
  {
    label: "Derek Chen — self-employed, conventional purchase",
    purpose: "purchase",
    program: "conventional",
    propertyType: "sfr",
    price: 640000,
    loanAmount: 512000,
    creditScore: 741,
    monthlyIncome: 15500,
    monthlyDebts: 7130,
    incomeType: "self_employed",
    yearsInLine: 3,
    employmentGapMonths: 0,
    variableIncome: false,
    taxReturns2y: true,
    ytdProfitLoss: false,
    paystubAgeDays: 0,
    bankStatementAgeDays: 24,
    largestDepositAmount: 22000,
    depositSourced: false,
    giftAmount: 0,
    giftLetter: false,
    giftTransferProof: false,
    recentInquiries: 0,
    inquiryLoe: false,
    condoQuestionnaire: false,
    insuranceBinder: false,
    contractFullyExecuted: true,
    appraisalOrdered: true,
    appraisalWaiver: false,
    daysToContractClosing: 30,
  },
  {
    label: "Sarah Parker — W-2, rate/term refinance",
    purpose: "refinance",
    program: "conventional",
    propertyType: "sfr",
    price: 520000,
    loanAmount: 340000,
    creditScore: 768,
    monthlyIncome: 11200,
    monthlyDebts: 3900,
    incomeType: "w2",
    yearsInLine: 6,
    employmentGapMonths: 0,
    variableIncome: false,
    taxReturns2y: false,
    ytdProfitLoss: false,
    paystubAgeDays: 9,
    bankStatementAgeDays: 18,
    largestDepositAmount: 0,
    depositSourced: false,
    giftAmount: 0,
    giftLetter: false,
    giftTransferProof: false,
    recentInquiries: 1,
    inquiryLoe: false,
    condoQuestionnaire: false,
    insuranceBinder: true,
    contractFullyExecuted: true,
    appraisalOrdered: false,
    appraisalWaiver: true,
    daysToContractClosing: 45,
  },
];

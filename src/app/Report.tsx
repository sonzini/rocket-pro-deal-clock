"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { RoiCalculator } from "@/components/RoiCalculator";
import type { L } from "@/lib/engine";
import { SOURCES, VOICES } from "@/lib/content";

export function Report() {
  const { t } = useLang();

  return (
    <main>
      {/* ---------------- Hero ---------------- */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-12 sm:px-6 sm:pt-16">
          <p className="text-sm font-medium uppercase tracking-widest text-accent">
            {t({ en: "Rocket Pro · broker experience study · November 2026", es: "Rocket Pro · estudio de experiencia del broker · noviembre 2026" })}
          </p>
          <p className="mt-3 text-sm text-muted">
            {t({ en: "Research, analysis and MVP by", es: "Investigación, análisis y MVP de" })}{" "}
            <span className="font-semibold text-ink">Jorge Mariel</span>
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
            {t({
              en: "Rocket Pro already sped up the part it controls. The bottleneck now sits before the clock starts.",
              es: "Rocket Pro ya aceleró la parte que controla. El cuello de botella ahora está antes de que arranque el reloj.",
            })}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            {t({
              en: "Rocket promises clear-to-close in 12 business days — once the broker submits. What happens before that, and what goes wrong because of it, is still on the broker's desk with no tool. That gap costs Rocket rework, costs brokers commissions, and keeps new partners from ramping up.",
              es: "Rocket promete aprobación final en 12 días hábiles… una vez que el broker envía el préstamo. Lo que pasa antes, y lo que sale mal por eso, sigue en el escritorio del broker sin ninguna herramienta. Esa brecha le cuesta a Rocket retrabajo, a los brokers comisiones, y frena a los socios nuevos.",
            })}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/demo" className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95">
              {t({ en: "Try the working MVP →", es: "Probar el MVP funcionando →" })}
            </Link>
            <a href="#summary" className="rounded-full border border-ink px-5 py-3 text-sm font-semibold transition hover:bg-ink hover:text-white">
              {t({ en: "Read the 60-second version", es: "Leer la versión de 60 segundos" })}
            </a>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4">
            <Stat value="$9.0B" label={{ en: "Rocket Pro closed in Q3 2026 — down 19% from Q2", es: "Cerró Rocket Pro en el Q3 2026: 19% menos que en el Q2" }} />
            <Stat value="~200" label={{ en: "new broker partners added, “$12B potential volume” — not yet showing in closings", es: "brokers nuevos sumados, “US$12B de volumen potencial”: todavía no se ve en los cierres" }} />
            <Stat value="0.70%" label={{ en: "Rocket Pro gain-on-sale margin vs 4.31% in direct-to-consumer", es: "margen de Rocket Pro contra 4,31% del canal directo al consumidor" }} />
            <Stat value="2.5–4.5" label={{ en: "days faster when brokers submit complete files (Rocket Pro's own data)", es: "días más rápido cuando el broker envía la carpeta completa (dato del propio Rocket Pro)" }} />
          </div>
        </div>
      </section>

      {/* ---------------- 60 seconds ---------------- */}
      <Section id="summary" kicker={{ en: "The 60-second version", es: "La versión de 60 segundos" }} title={{ en: "Problem, fix, payoff", es: "Problema, solución, resultado" }}>
        <div className="grid gap-4 md:grid-cols-3">
          <Tile n="01" title={{ en: "The problem", es: "El problema" }}>
            {t({
              en: "Files reach Rocket Pro incomplete. Underwriting issues conditions in waves, the broker chases the borrower again, documents expire, and some surprises appear near closing. Brokers describe it as unpredictability, not slowness.",
              es: "Los préstamos llegan a Rocket Pro incompletos. El analista pide condiciones en tandas, el broker vuelve a perseguir al cliente, los documentos vencen y algunas sorpresas aparecen cerca del cierre. Los brokers no lo describen como lentitud sino como falta de previsibilidad.",
            })}
          </Tile>
          <Tile n="02" title={{ en: "The fix", es: "La solución" }}>
            {t({
              en: "Clean File: a pre-submission check the broker runs in 2 minutes. It predicts the likely conditions, writes one plain-language request to the borrower (English or Spanish), and flags whether the contract closing date is safe.",
              es: "Clean File: una revisión previa al envío que el broker hace en 2 minutos. Predice las condiciones probables, escribe un único pedido al cliente en lenguaje simple (inglés o español) y avisa si la fecha de cierre del contrato está en riesgo.",
            })}
          </Tile>
          <Tile n="03" title={{ en: "The payoff", es: "El resultado" }}>
            {t({
              en: "Fewer underwriting touches per loan (Rocket's biggest controllable cost), more locked loans that close, more brokers qualifying for Orbit, and new partners that produce sooner. Base case: ≈$20M a year for Rocket.",
              es: "Menos revisiones por préstamo (el mayor costo que Rocket controla), más préstamos bloqueados que llegan a cerrar, más brokers que califican para Orbit y socios nuevos que producen antes. Caso base: ≈US$20M por año para Rocket.",
            })}
          </Tile>
        </div>
      </Section>

      {/* ---------------- Workflow ---------------- */}
      <Section
        id="workflow"
        kicker={{ en: "How a Rocket Pro loan moves", es: "Cómo se mueve un préstamo en Rocket Pro" }}
        title={{ en: "Two clocks. Rocket has optimized only one of them.", es: "Dos relojes. Rocket optimizó solo uno." }}
        intro={{
          en: "Mapped from Rocket Pro announcements, earnings documents, agency guidelines and broker discussions. A purchase loan takes 36.8 days on average nationally (ICE) while most contracts give 30.",
          es: "Armado a partir de anuncios de Rocket Pro, reportes de resultados, guías de las agencias y conversaciones de brokers. Un préstamo de compra tarda 36,8 días en promedio en EE.UU. (ICE), mientras la mayoría de los contratos dan 30.",
        }}
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <Clock
            tone="bad"
            title={{ en: "The broker's clock — no SLA, no tool", es: "El reloj del broker: sin compromiso de plazo, sin herramienta" }}
            steps={[
              [{ en: "Lead, scenario & pre-approval", es: "Contacto, escenario y preaprobación" }, { en: "Broker · Pathfinder / Assist", es: "Broker · Pathfinder / Assist" }, 1],
              [{ en: "Application, credit, disclosures", es: "Solicitud, informe de crédito, divulgaciones" }, { en: "Broker LOS (Jupiter, ARIVE…)", es: "Sistema del broker (Jupiter, ARIVE…)" }, 1],
              [{ en: "Collect income, asset & property docs", es: "Juntar documentos de ingresos, activos y propiedad" }, { en: "Broker ↔ borrower, by text & email", es: "Broker ↔ cliente, por mensaje y mail" }, 3],
              [{ en: "Decide the file is “ready” and submit", es: "Decidir que está “listo” y enviar" }, { en: "Broker judgment — nothing checks it", es: "Criterio del broker: nada lo verifica" }, 3],
            ]}
          />
          <Clock
            tone="good"
            title={{ en: "Rocket's clock — already fast", es: "El reloj de Rocket: ya es rápido" }}
            steps={[
              [{ en: "Same-day conditional approval", es: "Aprobación condicional en el día" }, { en: "Purchase Priority (Orbit)", es: "Purchase Priority (Orbit)" }, 1],
              [{ en: "Conditions issued → broker chases borrower", es: "Se emiten condiciones → el broker persigue al cliente" }, { en: "Where rounds of rework happen", es: "Acá ocurren las rondas de retrabajo" }, 3],
              [{ en: "Clear to close ≤ 12 business days", es: "Aprobación final ≤ 12 días hábiles" }, { en: "$1,000 credit if missed", es: "US$1.000 de crédito si no se cumple" }, 1],
              [{ en: "Closing Disclosure (3 days) → close → fund", es: "Divulgación de cierre (3 días) → cierre → fondeo" }, { en: "Rocket title & closing", es: "Título y cierre de Rocket" }, 1],
            ]}
          />
        </div>
        <Callout>
          {t({
            en: "Rocket's own AI pre-check (an internal agent that cut a 4-hour file review to under 15 minutes) runs after the broker submits. Every condition it finds still sends the broker back to the borrower — and restarts the wait.",
            es: "La revisión con IA de Rocket (un agente interno que bajó una revisión de 4 horas a menos de 15 minutos) corre después de que el broker envía. Cada condición que encuentra igual manda al broker de vuelta al cliente y reinicia la espera.",
          })}
        </Callout>
        <div className="mt-4 rounded-2xl border border-line bg-card p-5 text-sm leading-relaxed">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">{t({ en: "From Rocket Pro's own fine print", es: "De la letra chica del propio Rocket Pro" })}</p>
          <p className="mt-2">
            {t({
              en: "The 12-day clear-to-close only applies if the broker includes “all documentation and conditions required for conditional approval at the time of Full Package Submission”, orders the appraisal within 24 hours, and clears title, tax and appraisal items by day 9. The terms add that the broker is “solely responsible” for timely documentation.",
              es: "La aprobación final en 12 días solo aplica si el broker incluye “toda la documentación y las condiciones requeridas para la aprobación condicional al momento del envío completo”, pide la tasación dentro de las 24 horas y resuelve título, impuestos y tasación para el día 9. Los términos agregan que el broker es el “único responsable” de entregar la documentación a tiempo.",
            })}
          </p>
          <p className="mt-2 text-muted">
            {t({
              en: "In other words: Rocket's fastest lane is gated by exactly the step that has no tool today. Clean File is a checklist for getting into that lane.",
              es: "Es decir: el carril más rápido de Rocket depende justo del paso que hoy no tiene herramienta. Clean File es la lista de control para entrar en ese carril.",
            })}{" "}
            <a href="https://www.rocketpro.com/orbit" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-ink">rocketpro.com/orbit</a>
          </p>
        </div>
      </Section>

      {/* ---------------- Bottlenecks ---------------- */}
      <Section
        id="bottlenecks"
        kicker={{ en: "Candidate bottlenecks", es: "Cuellos de botella candidatos" }}
        title={{ en: "Five frictions we found — and why we picked one", es: "Cinco fricciones que encontramos, y por qué elegimos una" }}
      >
        <div className="overflow-x-auto rounded-2xl border border-line bg-card">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-paper text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="p-4">{t({ en: "Friction", es: "Fricción" })}</th>
                <th className="p-4">{t({ en: "Evidence", es: "Evidencia" })}</th>
                <th className="p-4">{t({ en: "Already addressed by Rocket?", es: "¿Rocket ya lo resuelve?" })}</th>
                <th className="p-4">{t({ en: "Size of prize", es: "Tamaño del premio" })}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {BOTTLENECKS.map((b, i) => (
                <tr key={i} className={b.pick ? "bg-accent-soft/60" : ""}>
                  <td className="p-4 align-top font-medium">
                    {b.pick && <span className="mb-1 inline-block rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-white">{t({ en: "Chosen", es: "Elegido" })}</span>}
                    <span className="block">{t(b.name)}</span>
                  </td>
                  <td className="p-4 align-top text-muted">{t(b.evidence)}</td>
                  <td className="p-4 align-top text-muted">{t(b.covered)}</td>
                  <td className="p-4 align-top"><Dots n={b.prize} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 max-w-3xl text-muted">
          {t({
            en: "Why the first one: it is the root cause behind three of the others (late surprises, status chasing, slow ramp-up of new partners), it sits outside every program Rocket has launched, and it can be tested in weeks without touching Rocket's core systems.",
            es: "Por qué la primera: es la causa raíz de otras tres (sorpresas tardías, persecución de estados, arranque lento de socios nuevos), está fuera de todos los programas que Rocket lanzó y se puede probar en semanas sin tocar los sistemas centrales de Rocket.",
          })}
        </p>
      </Section>

      {/* ---------------- Voice of broker ---------------- */}
      <Section
        id="voices"
        kicker={{ en: "What brokers say", es: "Lo que dicen los brokers" }}
        title={{ en: "Brokers feel it at the 11th hour. It starts on day one.", es: "Los brokers lo sufren a último momento. Empieza el primer día." }}
        intro={{
          en: "~230 broker comments, ~95 YouTube videos (40 from Rocket Pro's own channel) and trade-press interviews. Brokers praise Rocket's pricing and ease of use; the top workflow complaint is conditions that resurface right before closing. Most of those trace back to what wasn't collected, sourced or refreshed before submission.",
          es: "~230 comentarios de brokers, ~95 videos de YouTube (40 del canal oficial de Rocket Pro) y entrevistas en prensa del sector. Los brokers elogian el precio y la facilidad de Rocket; la queja operativa principal son condiciones que reaparecen justo antes del cierre. La mayoría nace en lo que no se juntó, justificó o actualizó antes del envío.",
        }}
      >
        <div className="mb-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          <Stat value="714" label={{ en: "consumer complaints about applying for or closing a Rocket mortgage filed with the CFPB since Jan 2025", es: "quejas de clientes sobre la solicitud o el cierre de un préstamo de Rocket presentadas ante la CFPB desde enero de 2025" }} />
          <Stat value="39%" label={{ en: "are about delays or not being able to get an issue fixed — the same share as UWM (38%): an industry problem, not a Rocket one", es: "son por demoras o por no poder resolver un problema con la empresa; igual que UWM (38%): es un problema de la industria, no solo de Rocket" }} />
          <Stat value="4.4★" label={{ en: "Rocket Mortgage on Trustpilot (42,540 reviews): borrowers like Rocket — the friction lives in the process, not the brand", es: "Rocket Mortgage en Trustpilot (42.540 opiniones): a los clientes les gusta Rocket; la fricción está en el proceso, no en la marca" }} />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {VOICES.map((v, i) => (
            <figure key={i} className="flex flex-col rounded-2xl border border-line bg-card p-5">
              <blockquote className="font-display text-lg leading-snug">“{v.quote}”</blockquote>
              <figcaption className="mt-auto pt-4 text-xs text-muted">
                {t(v.who)} ·{" "}
                <a href={v.url} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-ink">
                  {v.source}
                </a>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* ---------------- Competition ---------------- */}
      <Section
        id="competition"
        kicker={{ en: "Competitive context", es: "Contexto competitivo" }}
        title={{ en: "Everyone competes after submission. Nobody owns the part before it.", es: "Todos compiten después del envío. Nadie es dueño de lo que pasa antes." }}
        intro={{
          en: "UWM is ~3.7× Rocket Pro's volume and brokers accept ~5 bps worse pricing there for certainty. The race is about speed after submission — which is why the space before submission is open.",
          es: "UWM tiene ~3,7 veces el volumen de Rocket Pro y los brokers aceptan ~5 pb de peor precio a cambio de certeza. La carrera es por velocidad después del envío; por eso el espacio previo al envío está libre.",
        }}
      >
        <div className="overflow-x-auto rounded-2xl border border-line bg-card">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-paper text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="p-4"></th>
                <th className="p-4">Rocket Pro</th>
                <th className="p-4">UWM</th>
                <th className="p-4">Newrez</th>
                <th className="p-4">Pennymac</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {COMPETITION.map((row, i) => (
                <tr key={i}>
                  <td className="p-4 font-medium">{t(row[0] as L)}</td>
                  {(row.slice(1) as L[]).map((c, j) => (
                    <td key={j} className={`p-4 align-top ${j === 0 ? "" : "text-muted"}`}>{t(c)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ---------------- Solution ---------------- */}
      <Section
        id="solution"
        kicker={{ en: "The solution", es: "La solución" }}
        title={{ en: "Clean File: submit once, close on time", es: "Clean File: enviar una vez, cerrar en fecha" }}
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Tile n="1" title={{ en: "Check", es: "Revisar" }}>
            {t({
              en: "Before submitting, the broker sees a readiness score and the conditions underwriting is most likely to issue — stale paystubs, unsourced deposits, missing gift letters, condo questionnaires, insurance — each with the guideline behind it.",
              es: "Antes de enviar, el broker ve un puntaje de preparación y las condiciones que el analista probablemente pida —recibos vencidos, depósitos sin justificar, cartas de donación, cuestionario del condominio, seguro— cada una con la norma que la respalda.",
            })}
          </Tile>
          <Tile n="2" title={{ en: "Ask once", es: "Pedir una sola vez" }}>
            {t({
              en: "One plain-language message to the borrower, in English or Spanish, listing everything missing. One round trip instead of five.",
              es: "Un único mensaje al cliente, en lenguaje simple, en inglés o español, con todo lo que falta. Una sola ida y vuelta en lugar de cinco.",
            })}
          </Tile>
          <Tile n="3" title={{ en: "Protect the date", es: "Cuidar la fecha" }}>
            {t({
              en: "It compares the realistic closing path to the contract date, so the broker warns the real estate agent early — instead of on closing week.",
              es: "Compara el camino realista de cierre con la fecha del contrato, para que el broker avise al agente inmobiliario con tiempo y no en la semana del cierre.",
            })}
          </Tile>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-line bg-card p-6">
            <h3 className="font-semibold">{t({ en: "Why Rocket wins", es: "Por qué gana Rocket" })}</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {WINS.map((w, i) => (
                <li key={i} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />{t(w)}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-line bg-card p-6">
            <h3 className="font-semibold">{t({ en: "Where it lives", es: "Dónde vive" })}</h3>
            <p className="mt-3 text-sm text-muted">
              {t({
                en: "Not a new portal. Rocket already learned that brokers want tools “where they are”: it ships as a step inside Rocket Pro Navigate, Jupiter and the ARIVE submission flow — the moment before “Submit”. It is a working first step of what brokers themselves asked for at RPX: the runner-up idea, Right Track, proposes analyzing files up front to catch documentation gaps, and Signal surfaces risks in condition lists. Clean File can be piloted now and grow into both.",
                es: "No es un portal nuevo. Rocket ya aprendió que los brokers quieren herramientas “donde ya trabajan”: se integra como un paso dentro de Rocket Pro Navigate, Jupiter y el flujo de envío de ARIVE, justo antes de “Enviar”. Es un primer paso funcionando de lo que los propios brokers pidieron en RPX: la idea que salió segunda, Right Track, propone analizar las carpetas desde el inicio para detectar faltantes de documentación, y Signal detecta riesgos en las listas de condiciones. Clean File se puede probar ya y crecer hacia ambas.",
              })}
            </p>
            <Link href="/demo" className="mt-4 inline-block text-sm font-semibold text-accent underline-offset-4 hover:underline">
              {t({ en: "Open the MVP with a sample file →", es: "Abrir el MVP con un caso de ejemplo →" })}
            </Link>
          </div>
        </div>
      </Section>

      {/* ---------------- Business case ---------------- */}
      <Section
        id="business-case"
        kicker={{ en: "Business case", es: "Caso de negocio" }}
        title={{ en: "Small changes per loan, large numbers at Rocket Pro's scale", es: "Cambios chicos por préstamo, números grandes a la escala de Rocket Pro" }}
        intro={{
          en: "Industry lenders average 3–3.5 underwriting touches per loan; UWM reports 2.1 in its new pilot. Freddie Mac found that 5 fewer days of cycle time lifted pull-through 1.8% and saved up to $1,700 per loan. Move the sliders.",
          es: "Los prestamistas promedian 3–3,5 revisiones del analista por préstamo; UWM reporta 2,1 en su nuevo piloto. Freddie Mac encontró que 5 días menos de ciclo subieron 1,8% los cierres y ahorraron hasta US$1.700 por préstamo. Mové los controles.",
        }}
      >
        <RoiCalculator />
      </Section>

      {/* ---------------- Pilot & roadmap ---------------- */}
      <Section id="pilot" kicker={{ en: "Pilot & roadmap", es: "Piloto y hoja de ruta" }} title={{ en: "Prove it in 60 days, with a control group", es: "Probarlo en 60 días, con grupo de control" }}>
        <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-2xl border border-line bg-card p-6">
            <h3 className="font-semibold">{t({ en: "Pilot design", es: "Diseño del piloto" })}</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {PILOT.map((w, i) => (
                <li key={i} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />{t(w)}</li>
              ))}
            </ul>
            <h3 className="mt-6 font-semibold">{t({ en: "Success metrics", es: "Métricas de éxito" })}</h3>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              {METRICS.map((m, i) => (
                <div key={i} className="rounded-lg bg-paper p-3">
                  <p className="num font-semibold">{m.target}</p>
                  <p className="text-xs text-muted">{t(m.label)}</p>
                </div>
              ))}
            </div>
          </div>
          <ol className="relative space-y-4 border-l-2 border-line pl-6">
            {ROADMAP.map((r, i) => (
              <li key={i} className="relative">
                <span className={`absolute -left-[33px] top-1 h-4 w-4 rounded-full border-2 border-paper ${i === 0 ? "bg-good" : "bg-ink"}`} />
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">{t(r.when)}</p>
                <p className="font-semibold">{t(r.title)}</p>
                <p className="text-sm text-muted">{t(r.body)}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-6 rounded-2xl border border-line bg-card p-6">
          <h3 className="font-semibold">{t({ en: "Risks we planned for", es: "Riesgos que contemplamos" })}</h3>
          <div className="mt-3 grid gap-4 text-sm md:grid-cols-3">
            {RISKS.map((r, i) => (
              <div key={i}>
                <p className="font-medium">{t(r.risk)}</p>
                <p className="mt-1 text-muted">{t(r.answer)}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ---------------- Method & sources ---------------- */}
      <Section id="method" kicker={{ en: "How this was researched", es: "Cómo se investigó" }} title={{ en: "Seven research tracks, one question", es: "Siete líneas de investigación, una pregunta" }}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TRACKS.map((tr, i) => (
            <div key={i} className="rounded-xl border border-line bg-card p-4">
              <p className="font-medium">{t(tr.name)}</p>
              <p className="mt-1 text-sm text-muted">{t(tr.body)}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 max-w-3xl text-sm text-muted">
          {t({
            en: "Rocket Pro program details (Orbit, Purchase Priority terms, Moving Squad, Big Pitch, Power Play) were read directly on rocketpro.com. Caveats: Rocket and competitor metrics are company-reported; forum and review evidence is self-selected; CFPB complaints come from borrowers and cover all Rocket channels. Financial estimates are labeled and meant to be replaced with Rocket's internal data in the pilot.",
            es: "Los detalles de los programas de Rocket Pro (Orbit, términos de Purchase Priority, Moving Squad, Big Pitch, Power Play) se leyeron directamente en rocketpro.com. Salvedades: las métricas de Rocket y de la competencia son informadas por las propias empresas; la evidencia de foros y opiniones es autoseleccionada; las quejas de la CFPB son de clientes y abarcan todos los canales de Rocket. Las estimaciones financieras están marcadas y se reemplazan con datos internos de Rocket en el piloto.",
          })}
        </p>
        <details className="mt-6 rounded-2xl border border-line bg-card p-5">
          <summary className="cursor-pointer font-semibold">{t({ en: `Sources (${SOURCES.length})`, es: `Fuentes (${SOURCES.length})` })}</summary>
          <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            {SOURCES.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noreferrer" className="text-muted underline-offset-2 hover:text-ink hover:underline">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </details>
      </Section>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            {t({ en: "Research, analysis and MVP by Jorge Mariel, prepared for the Rocket Pro interview process.", es: "Investigación, análisis y MVP de Jorge Mariel, preparado para el proceso de entrevista de Rocket Pro." })}{" "}
            {t({ en: "Independent work; not affiliated with or endorsed by Rocket Companies.", es: "Trabajo independiente; sin afiliación ni aval de Rocket Companies." })}
          </p>
          <a href="https://github.com/sonzini/rocket-pro-clean-file" target="_blank" rel="noreferrer" className="font-medium text-ink underline-offset-4 hover:underline">
            {t({ en: "Source code on GitHub", es: "Código en GitHub" })}
          </a>
        </div>
      </footer>
    </main>
  );
}

/* ---------------- Content ---------------- */

const BOTTLENECKS: { name: L; evidence: L; covered: L; prize: number; pick?: boolean }[] = [
  {
    pick: true,
    name: { en: "Incomplete first submissions → rounds of conditions", es: "Primeros envíos incompletos → rondas de condiciones" },
    evidence: {
      en: "Purchase Priority's 12-day promise requires a complete package at submission; Rocket says complete files close 2.5–4.5 days faster; the industry averages 3–3.5 underwriting touches per loan.",
      es: "La promesa de 12 días de Purchase Priority exige la carpeta completa al enviar; Rocket dice que las carpetas completas cierran 2,5–4,5 días antes; la industria promedia 3–3,5 revisiones por préstamo.",
    },
    covered: { en: "Not yet — Rocket's tools act after submission; “Right Track” (RPX runner-up) points here but isn't built.", es: "Todavía no: las herramientas de Rocket actúan después del envío; “Right Track” (finalista de RPX) apunta acá pero no está construida." },
    prize: 5,
  },
  {
    name: { en: "Late surprises near closing", es: "Sorpresas tardías cerca del cierre" },
    evidence: {
      en: "Top broker complaint: cleared conditions reappearing “at the 11th hour”. 16% of US contracts were delayed in Sep 2026 (NAR).",
      es: "Queja principal de los brokers: condiciones ya resueltas que reaparecen “a último momento”. 16% de los contratos en EE.UU. se demoraron en sep. 2026 (NAR).",
    },
    covered: { en: "Partly — “Signal” (RPX finalist) is in development.", es: "En parte: “Signal” (finalista de RPX) está en desarrollo." },
    prize: 4,
  },
  {
    name: { en: "Status & conditions spread across systems", es: "Estado y condiciones repartidos en varios sistemas" },
    evidence: {
      en: "Rocket executive: brokers “log into a second system to get updates on loan status every morning”.",
      es: "Ejecutivo de Rocket: los brokers “entran a un segundo sistema todas las mañanas para ver el estado del préstamo”.",
    },
    covered: { en: "Mostly — Assist, Jupiter, ARIVE status sync.", es: "Mayormente: Assist, Jupiter y la sincronización con ARIVE." },
    prize: 3,
  },
  {
    name: { en: "New partners slow to produce", es: "Socios nuevos que tardan en producir" },
    evidence: {
      en: "Record recruiting (~200 partners) while closed volume fell 19%; onboarding needs a 4-person Moving Squad per broker.",
      es: "Récord de incorporaciones (~200 socios) mientras el volumen cerrado cayó 19%; la incorporación necesita un equipo Moving Squad de 4 personas por broker.",
    },
    covered: { en: "With people, not tools — hard to scale.", es: "Con personas, no con herramientas: difícil de escalar." },
    prize: 4,
  },
  {
    name: { en: "Pricing complexity", es: "Complejidad de precios" },
    evidence: {
      en: "Rocket's CRO: brokers needed “calculators, cheat sheets or calls with AEs”; credits change monthly.",
      es: "El CRO de Rocket: los brokers necesitaban “calculadoras, machetes o llamadas con el ejecutivo”; los créditos cambian cada mes.",
    },
    covered: { en: "Yes — flat base pricing since Sep 2026.", es: "Sí: precio base parejo desde sep. 2026." },
    prize: 2,
  },
];

const COMPETITION: L[][] = [
  [
    { en: "Speed after submission", es: "Velocidad después del envío" },
    { en: "Same-day conditional approval; CTC ≤12 business days (Orbit, purchase)", es: "Aprobación condicional en el día; final ≤12 días hábiles (Orbit, compras)" },
    { en: "15 business days avg; 8.3-day pilot (Underwriting+)", es: "15 días hábiles promedio; piloto de 8,3 días (Underwriting+)" },
    { en: "Live turn-time dashboard by stage", es: "Tablero de plazos en vivo por etapa" },
    { en: "Per-document upload, mobile CD approval", es: "Carga por documento, aprobación móvil" },
  ],
  [
    { en: "Help before submission", es: "Ayuda antes del envío" },
    { en: "Guideline Q&A (Pathfinder, Assist)", es: "Consultas de normas (Pathfinder, Assist)" },
    { en: "AI income calc, LE audit", es: "Cálculo de ingresos con IA, auditoría de LE" },
    { en: "Action-item list", es: "Lista de tareas" },
    { en: "—", es: "—" },
  ],
  [
    { en: "Predicts conditions for the broker", es: "Predice condiciones para el broker" },
    { en: "No (internal AI agent, after submission)", es: "No (agente interno, después del envío)" },
    { en: "No", es: "No" },
    { en: "No", es: "No" },
    { en: "No", es: "No" },
  ],
  [
    { en: "Borrower-ready requests", es: "Pedidos listos para el cliente" },
    { en: "No", es: "No" },
    { en: "AI voice assistant (Mia) calls clients", es: "Asistente de voz con IA (Mia) llama a clientes" },
    { en: "No", es: "No" },
    { en: "No", es: "No" },
  ],
];

const WINS: L[] = [
  { en: "Fewer underwriting touches — the largest cost Rocket controls on a 0.70%-margin channel.", es: "Menos revisiones del analista: el mayor costo que Rocket controla en un canal de 0,70% de margen." },
  { en: "Gets more loans into Purchase Priority, whose 12-day promise requires a complete package at submission — and protects the $1,000 credit Rocket pays when it's missed.", es: "Hace que más préstamos entren en Purchase Priority, cuya promesa de 12 días exige la carpeta completa al enviar, y protege el crédito de US$1.000 que Rocket paga si no se cumple." },
  { en: "Helps brokers earn Orbit stars for “initial underwriting quality” — loyalty that UWM can't buy with incentives.", es: "Ayuda a los brokers a ganar estrellas de Orbit por “calidad del primer análisis”: lealtad que UWM no puede comprar con incentivos." },
  { en: "Turns Moving Squad recruits into producers faster: the tool teaches Rocket's way of preparing a file on every loan.", es: "Convierte más rápido a los brokers de Moving Squad en productores: la herramienta enseña cómo prepara Rocket cada préstamo." },
  { en: "Spanish-language borrower requests reach a fast-growing buyer segment without extra staff.", es: "Los pedidos en español llegan a un segmento de compradores en crecimiento sin sumar personal." },
];

const PILOT: L[] = [
  { en: "10 broker shops for 60 days: 5 established partners + 5 recent Moving Squad recruits.", es: "10 brokers durante 60 días: 5 socios establecidos + 5 incorporados recientemente por Moving Squad." },
  { en: "Matched control group of similar brokers who don't use the tool.", es: "Grupo de control de brokers similares que no usan la herramienta." },
  { en: "Rules tuned with Rocket underwriting using real Rocket Pro overlays and the 20 most common conditions.", es: "Reglas ajustadas con el equipo de análisis de Rocket usando sus criterios reales y las 20 condiciones más frecuentes." },
  { en: "Advisory only: the broker decides, underwriting decides. Every check is explainable and logged.", es: "Solo recomienda: decide el broker, decide el analista. Cada revisión es explicable y queda registrada." },
];

const METRICS: { target: string; label: L }[] = [
  { target: "−30%", label: { en: "conditions at first underwriting", es: "condiciones en el primer análisis" } },
  { target: "−0.5", label: { en: "underwriting touches per loan", es: "revisiones por préstamo" } },
  { target: "−3 days", label: { en: "submission to clear-to-close", es: "del envío a la aprobación final" } },
  { target: "+1 pt", label: { en: "locked loans that close", es: "préstamos bloqueados que cierran" } },
];

const ROADMAP: { when: L; title: L; body: L }[] = [
  {
    when: { en: "Done", es: "Hecho" },
    title: { en: "Working MVP (this site)", es: "MVP funcionando (este sitio)" },
    body: { en: "Rules engine on public agency guidelines, 3 sample files, bilingual borrower requests, closing-date check.", es: "Motor de reglas con guías públicas, 3 casos de ejemplo, pedidos bilingües al cliente y control de fecha de cierre." },
  },
  {
    when: { en: "Weeks 1–4", es: "Semanas 1–4" },
    title: { en: "Rocket rules + real data", es: "Reglas de Rocket + datos reales" },
    body: { en: "Load Rocket Pro overlays, read DU/LPA findings and the loan file from Jupiter/ARIVE, so nothing is typed twice.", es: "Cargar los criterios de Rocket Pro y leer los resultados de DU/LPA y el préstamo desde Jupiter/ARIVE, sin cargar nada dos veces." },
  },
  {
    when: { en: "Weeks 5–12", es: "Semanas 5–12" },
    title: { en: "60-day pilot", es: "Piloto de 60 días" },
    body: { en: "10 brokers vs control. Weekly readout to Rocket Pro leadership on the four metrics.", es: "10 brokers contra grupo de control. Reporte semanal a la dirección de Rocket Pro con las cuatro métricas." },
  },
  {
    when: { en: "Next quarter", es: "Próximo trimestre" },
    title: { en: "Inside Navigate, for every broker", es: "Dentro de Navigate, para todos los brokers" },
    body: { en: "Document checks on upload (dates, pages, names), and an agent-facing timeline under the broker's brand — feeding Signal and Right Track.", es: "Control de documentos al subirlos (fechas, páginas, nombres) y un cronograma para el agente inmobiliario con la marca del broker, conectado a Signal y Right Track." },
  },
];

const RISKS: { risk: L; answer: L }[] = [
  {
    risk: { en: "“It's another tool to learn.”", es: "“Es otra herramienta más para aprender.”" },
    answer: { en: "It's one step inside the submit flow brokers already use — not a new login.", es: "Es un paso dentro del flujo de envío que el broker ya usa, no un usuario nuevo." },
  },
  {
    risk: { en: "Compliance & AI governance", es: "Cumplimiento y gobierno de IA" },
    answer: {
      en: "Rules-based and explainable, advisory only, every output logged — aligned with Fannie Mae and Freddie Mac 2026 AI governance requirements.",
      es: "Basado en reglas y explicable, solo recomienda, cada resultado queda registrado: alineado con los requisitos de gobierno de IA 2026 de Fannie Mae y Freddie Mac.",
    },
  },
  {
    risk: { en: "Predictions miss Rocket's own rules", es: "Las predicciones no reflejan las reglas propias de Rocket" },
    answer: { en: "The pilot starts by tuning against Rocket's top conditions; precision is a tracked metric.", es: "El piloto empieza ajustando con las condiciones más comunes de Rocket; la precisión se mide." },
  },
];

const TRACKS: { name: L; body: L }[] = [
  { name: { en: "Rocket & Rocket Pro", es: "Rocket y Rocket Pro" }, body: { en: "SEC filings, earnings calls, RPX 2026, Power Play, Orbit, Moving Squad.", es: "Documentos SEC, llamadas de resultados, RPX 2026, Power Play, Orbit, Moving Squad." } },
  { name: { en: "Competition", es: "Competencia" }, body: { en: "UWM, Pennymac, Newrez, Kind, Plaza, A&D: tools, turn times, share.", es: "UWM, Pennymac, Newrez, Kind, Plaza, A&D: herramientas, plazos, participación." } },
  { name: { en: "Finance", es: "Finanzas" }, body: { en: "Cost to originate (MBA), margins by channel, pull-through, ROI model.", es: "Costo de originación (MBA), márgenes por canal, tasa de cierre, modelo de retorno." } },
  { name: { en: "Mortgage operations", es: "Operaciones hipotecarias" }, body: { en: "18-step wholesale workflow, condition types, TRID timing, 2026 GSE changes.", es: "Flujo mayorista de 18 pasos, tipos de condiciones, plazos TRID, cambios 2026 de las agencias." } },
  { name: { en: "Real estate", es: "Real estate" }, body: { en: "Contract delays (NAR), agent–broker dynamics, Redfin & Compass.", es: "Demoras de contratos (NAR), relación agente–broker, Redfin y Compass." } },
  { name: { en: "Startups & mortgage tech", es: "Startups y mortgage tech" }, body: { en: "Vesta, Tidalwave, Candor, Friday Harbor, Better: what's funded and what's not.", es: "Vesta, Tidalwave, Candor, Friday Harbor, Better: qué se financia y qué no." } },
  { name: { en: "Voice of the broker & borrower", es: "Voz del broker y del cliente" }, body: { en: "~230 Reddit comments, ~95 YouTube videos, 714 CFPB complaints, Trustpilot, trade press.", es: "~230 comentarios en Reddit, ~95 videos de YouTube, 714 quejas ante la CFPB, Trustpilot, prensa del sector." } },
  { name: { en: "Cross-check", es: "Verificación cruzada" }, body: { en: "Perplexity searches to confirm 2026 facts and find what the tracks missed.", es: "Búsquedas con Perplexity para confirmar datos de 2026 y encontrar lo que faltaba." } },
];

/* ---------------- Small components ---------------- */

function Section({ id, kicker, title, intro, children }: { id: string; kicker: L; title: L; intro?: L; children: React.ReactNode }) {
  const { t } = useLang();
  return (
    <section id={id} className="scroll-mt-16 border-b border-line">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-sm font-medium uppercase tracking-widest text-accent">{t(kicker)}</p>
        <h2 className="mt-3 max-w-3xl font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{t(title)}</h2>
        {intro && <p className="mt-4 max-w-3xl text-muted">{t(intro)}</p>}
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: L }) {
  const { t } = useLang();
  return (
    <div className="bg-card p-5">
      <p className="num font-display text-3xl font-semibold sm:text-4xl">{value}</p>
      <p className="mt-2 text-sm leading-snug text-muted">{t(label)}</p>
    </div>
  );
}

function Tile({ n, title, children }: { n: string; title: L; children: React.ReactNode }) {
  const { t } = useLang();
  return (
    <div className="rounded-2xl border border-line bg-card p-6">
      <p className="num font-display text-sm font-semibold text-accent">{n}</p>
      <h3 className="mt-1 text-lg font-semibold">{t(title)}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{children}</p>
    </div>
  );
}

function Clock({ tone, title, steps }: { tone: "good" | "bad"; title: L; steps: [L, L, number][] }) {
  const { t } = useLang();
  const heat = ["", "bg-good", "bg-warn", "bg-bad"];
  return (
    <div className={`rounded-2xl border bg-card p-6 ${tone === "bad" ? "border-bad/30" : "border-line"}`}>
      <h3 className="font-semibold">{t(title)}</h3>
      <ol className="mt-4 space-y-3">
        {steps.map(([name, who, h], i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="num mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-paper text-xs font-semibold">{i + 1}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium">{t(name)}</span>
              <span className="block text-xs text-muted">{t(who)}</span>
            </span>
            <span className={`mt-1.5 h-2.5 w-10 shrink-0 rounded-full ${heat[h]}`} title="friction" />
          </li>
        ))}
      </ol>
      <p className="mt-4 flex items-center gap-3 text-[11px] text-muted">
        <span className="flex items-center gap-1"><span className="h-2 w-4 rounded-full bg-good" />{t({ en: "low friction", es: "fricción baja" })}</span>
        <span className="flex items-center gap-1"><span className="h-2 w-4 rounded-full bg-bad" />{t({ en: "high friction", es: "fricción alta" })}</span>
      </p>
    </div>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return <div className="mt-6 rounded-2xl border-l-4 border-accent bg-accent-soft/60 p-5 text-sm leading-relaxed">{children}</div>;
}

function Dots({ n }: { n: number }) {
  return (
    <span className="flex gap-1" aria-label={`${n} of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`h-2.5 w-2.5 rounded-full ${i <= n ? "bg-accent" : "bg-line"}`} />
      ))}
    </span>
  );
}

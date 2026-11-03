"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { RoiCalculator } from "@/components/RoiCalculator";
import type { L } from "@/lib/types";
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
            {t({ en: "Research, analysis and MVP by", es: "Investigación, análisis y MVP de" })} <span className="font-semibold text-ink">Jorge Mariel</span>
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
            {t({
              en: "Rocket Pro sells certainty. But every purchase runs on two clocks that nobody lines up.",
              es: "Rocket Pro vende certeza. Pero cada compra corre con dos relojes que nadie alinea.",
            })}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            {t({
              en: "The contract clock — contingencies and a closing date the agents negotiated — and the loan clock — Rocket's day 1, day 9 and day 12 milestones — never sit side by side. So deadlines collide quietly, the agent chases the broker, the broker chases Rocket, and deals that should close on time don't.",
              es: "El reloj del contrato —las condiciones y la fecha de cierre que negociaron los agentes— y el reloj del préstamo —los hitos de los días 1, 9 y 12 de Rocket— nunca se ponen uno al lado del otro. Entonces los plazos chocan en silencio, el agente persigue al broker, el broker persigue a Rocket y operaciones que deberían cerrar en fecha no cierran.",
            })}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/demo" className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95">
              {t({ en: "Open Deal Clock (live MVP) →", es: "Abrir Deal Clock (MVP en vivo) →" })}
            </Link>
            <a href="#story" className="rounded-full border border-ink px-5 py-3 text-sm font-semibold transition hover:bg-ink hover:text-white">
              {t({ en: "Follow one deal, day by day", es: "Seguir una operación, día por día" })}
            </a>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4">
            <Stat value="12" label={{ en: "business days to clear to close under Purchase Priority — only if the broker clears the day-1 and day-9 gates", es: "días hábiles hasta la aprobación final con Purchase Priority, solo si el broker cumple los controles de los días 1 y 9" }} />
            <Stat value="16%" label={{ en: "of US home contracts had a delayed settlement in Sep 2026 (NAR)", es: "de los contratos en EE.UU. se demoraron en sep. 2026 (NAR)" }} />
            <Stat value="39%" label={{ en: "of Rocket's application & closing complaints to the CFPB are delays or communication", es: "de las quejas a Rocket ante la CFPB sobre solicitud y cierre son por demoras o comunicación" }} />
            <Stat value="43%" label={{ en: "of buyers go to their agent for mortgage information — vs 29% to a lender", es: "de los compradores consulta la hipoteca con su agente, contra 29% con un prestamista" }} />
          </div>
        </div>
      </section>

      {/* ---------------- Story ---------------- */}
      <Section
        id="story"
        kicker={{ en: "One deal, day by day", es: "Una operación, día por día" }}
        title={{ en: "Maria's offer beat a cash buyer. Here is where it starts to break.", es: "La oferta de Maria le ganó a un comprador en efectivo. Acá es donde empieza a romperse." }}
        intro={{
          en: "A composite purchase built from the research: a conventional loan through a Rocket Pro Orbit broker, inside the Purchase Priority window, in Thanksgiving season. Every date follows Rocket's published terms and federal holiday calendars.",
          es: "Una compra armada a partir de la investigación: préstamo convencional con un broker Orbit de Rocket Pro, dentro de la ventana de Purchase Priority, en temporada de Acción de Gracias. Cada fecha sigue los términos publicados de Rocket y el calendario de feriados federales.",
        }}
      >
        <ol className="relative space-y-3 border-l-2 border-line pl-6">
          {STORY.map((s, i) => (
            <li key={i} className="relative">
              <span className={`absolute -left-[33px] top-4 h-4 w-4 rounded-full border-2 border-paper ${s.tone === "bad" ? "bg-bad" : s.tone === "warn" ? "bg-warn" : "bg-ink"}`} />
              <div className={`rounded-2xl border p-4 sm:p-5 ${s.tone === "bad" ? "border-bad/30 bg-card" : "border-line bg-card"}`}>
                <p className="num text-xs font-semibold uppercase tracking-wider text-accent">{t(s.when)}</p>
                <p className="mt-1 font-semibold">{t(s.what)}</p>
                <p className="mt-1 text-sm text-muted">{t(s.why)}</p>
              </div>
            </li>
          ))}
        </ol>
        <Callout>
          {t({
            en: "No one did anything unusual. Each party watched its own clock. The collisions were visible on day 0 — if someone had put the contract and the loan on the same page.",
            es: "Nadie hizo nada fuera de lo común. Cada parte miró su propio reloj. Los choques se veían desde el día 0, si alguien hubiera puesto el contrato y el préstamo en la misma página.",
          })}
        </Callout>
      </Section>

      {/* ---------------- Bottleneck ---------------- */}
      <Section
        id="bottleneck"
        kicker={{ en: "The bottleneck", es: "El cuello de botella" }}
        title={{ en: "Rocket's fastest lane is gated by dates the broker has no tool to manage", es: "El carril más rápido de Rocket depende de fechas que el broker no tiene cómo gestionar" }}
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-line bg-card p-6 text-sm leading-relaxed">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">{t({ en: "From Rocket Pro's own fine print", es: "De la letra chica del propio Rocket Pro" })}</p>
            <p className="mt-2">
              {t({
                en: "Purchase Priority promises same-day conditional approval and clear to close in 12 business days — if the appraisal is ordered within 24 hours, and the lock, final structure, title, tax certifications and appraisal are cleared by 8:00 p.m. ET on business day 9. Folders received after 4:00 p.m. ET start the next day. The terms add that the broker is “solely responsible” for timely documentation, and that a missed timeline gives the broker no recourse. The promotion runs Oct 6 – Dec 14, 2026.",
                es: "Purchase Priority promete aprobación condicional en el día y final en 12 días hábiles, siempre que la tasación se pida dentro de las 24 horas, y que tasa, estructura final, título, certificados de impuestos y tasación estén resueltos antes de las 20 h (hora del Este) del día hábil 9. Las carpetas que llegan después de las 16 h arrancan al día siguiente. Los términos agregan que el broker es el “único responsable” de la documentación a tiempo, y que si Rocket no cumple los plazos el broker no tiene derecho a compensación. La promoción corre del 6 de octubre al 14 de diciembre de 2026.",
              })}
            </p>
            <a href="https://www.rocketpro.com/orbit" target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs text-muted underline underline-offset-2 hover:text-ink">rocketpro.com/orbit</a>
          </div>
          <div className="rounded-2xl border border-line bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">{t({ en: "Who pays when the clocks collide", es: "Quién paga cuando los relojes chocan" })}</p>
            <ul className="mt-3 space-y-3 text-sm">
              {PAYS.map((x, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-24 shrink-0 font-semibold">{t(x.who)}</span>
                  <span className="text-muted">{t(x.cost)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <h3 className="mt-10 font-semibold">{t({ en: "Six frictions we weighed — and why this one", es: "Seis fricciones que evaluamos, y por qué esta" })}</h3>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-line bg-card">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-paper text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="p-4">{t({ en: "Friction", es: "Fricción" })}</th>
                <th className="p-4">{t({ en: "Evidence", es: "Evidencia" })}</th>
                <th className="p-4">{t({ en: "Who already works on it", es: "Quién ya trabaja en eso" })}</th>
                <th className="p-4">{t({ en: "Room to win", es: "Espacio para ganar" })}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {BOTTLENECKS.map((b, i) => (
                <tr key={i} className={b.pick ? "bg-accent-soft/60" : ""}>
                  <td className="p-4 align-top font-medium">
                    {b.pick && <span className="mb-1 inline-block rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-white">{t({ en: "Chosen", es: "Elegida" })}</span>}
                    <span className="block">{t(b.name)}</span>
                  </td>
                  <td className="p-4 align-top text-muted">{t(b.evidence)}</td>
                  <td className="p-4 align-top text-muted">{t(b.covered)}</td>
                  <td className="p-4 align-top"><Dots n={b.room} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ---------------- White space ---------------- */}
      <Section
        id="white-space"
        kicker={{ en: "Where the money and the tools go", es: "Hacia dónde van la plata y las herramientas" }}
        title={{ en: "Everyone builds for the loan file. Almost nobody builds for the deal calendar.", es: "Todos construyen para la carpeta del préstamo. Casi nadie para el calendario de la operación." }}
        intro={{
          en: "Mortgage-tech funding, competitor tools and Rocket's own Big Pitch ideas, placed by who uses them and what they work on.",
          es: "La inversión en mortgage tech, las herramientas de la competencia y las ideas del Big Pitch de Rocket, ubicadas según quién las usa y sobre qué trabajan.",
        }}
      >
        <div className="grid grid-cols-[auto_1fr_1fr] gap-2 text-sm">
          <span />
          <span className="pb-1 text-center text-xs font-semibold uppercase tracking-wider text-muted">{t({ en: "Lender / underwriting side", es: "Lado del prestamista / análisis" })}</span>
          <span className="pb-1 text-center text-xs font-semibold uppercase tracking-wider text-muted">{t({ en: "Broker · agent · borrower side", es: "Lado broker · agente · cliente" })}</span>
          <span className="flex rotate-180 items-center text-xs font-semibold uppercase tracking-wider text-muted [writing-mode:vertical-rl]">{t({ en: "Documents & conditions", es: "Documentos y condiciones" })}</span>
          <Quad items={["Vesta", "Tidalwave", "Candor", "Friday Harbor", "Ocrolus", "Truv", "UWM Underwriting+", "Signal (idea)*"]} note={t({ en: "Crowded — most VC money", es: "Saturado: la mayor parte de la inversión" })} />
          <Quad items={["Right Track (idea)*", "UWM BOLT", "Rocket Pro Navigate", "ARIVE / Jupiter LOS"]} note={t({ en: "Busy — incl. Rocket's own roadmap", es: "Ocupado: incluye la hoja de ruta de Rocket" })} />
          <span className="flex rotate-180 items-center text-xs font-semibold uppercase tracking-wider text-muted [writing-mode:vertical-rl]">{t({ en: "Deal timing & communication", es: "Tiempos y comunicación" })}</span>
          <Quad items={["Newrez turn-time board", "Pennymac portal", "Rocket Pro Assist", "UWM Mia (rates, payments)"]} note={t({ en: "Status for the broker only", es: "Estado solo para el broker" })} />
          <div className="rounded-2xl border-2 border-dashed border-accent bg-accent-soft/50 p-4">
            <p className="font-display text-lg font-semibold">Deal Clock</p>
            <p className="mt-1 text-sm text-muted">
              {t({ en: "Contract dates × loan milestones, shared with the real estate agent under the broker's brand. No funded player found.", es: "Fechas del contrato × hitos del préstamo, compartidos con el agente inmobiliario con la marca del broker. No encontramos ningún jugador con inversión." })}
            </p>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted">{t({ en: "* Big Pitch finalist ideas (2nd and 3rd place) on rocketpro.com/the-big-pitch — pitched by brokers, not shipped products.", es: "* Ideas finalistas del Big Pitch (2.º y 3.er puesto) en rocketpro.com/the-big-pitch: propuestas de brokers, no productos lanzados." })}</p>
      </Section>

      {/* ---------------- Voices ---------------- */}
      <Section
        id="voices"
        kicker={{ en: "What brokers and borrowers say", es: "Lo que dicen brokers y clientes" }}
        title={{ en: "Rocket wins on price and ease. It loses minutes — and trust — in the last week.", es: "Rocket gana en precio y facilidad. Pierde minutos, y confianza, en la última semana." }}
        intro={{
          en: "~230 broker comments, ~95 YouTube videos (40 from Rocket Pro's own channel), 714 CFPB complaints and trade-press interviews.",
          es: "~230 comentarios de brokers, ~95 videos de YouTube (40 del canal oficial de Rocket Pro), 714 quejas ante la CFPB y entrevistas en prensa del sector.",
        }}
      >
        <div className="mb-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          <Stat value="714" label={{ en: "consumer complaints about applying for or closing a Rocket mortgage filed with the CFPB since Jan 2025", es: "quejas de clientes sobre la solicitud o el cierre de un préstamo de Rocket ante la CFPB desde enero de 2025" }} />
          <Stat value="39%" label={{ en: "are delays or trying to get an issue fixed — UWM: 38%. An industry problem, not just Rocket's", es: "son por demoras o por no poder resolver un problema; UWM: 38%. Es un problema de la industria, no solo de Rocket" }} />
          <Stat value="4.4★" label={{ en: "Rocket Mortgage on Trustpilot (42,540 reviews): the friction lives in the process, not the brand", es: "Rocket Mortgage en Trustpilot (42.540 opiniones): la fricción está en el proceso, no en la marca" }} />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {VOICES.map((v, i) => (
            <figure key={i} className="flex flex-col rounded-2xl border border-line bg-card p-5">
              <blockquote className="font-display text-lg leading-snug">“{v.quote}”</blockquote>
              <figcaption className="mt-auto pt-4 text-xs text-muted">
                {t(v.who)} ·{" "}
                <a href={v.url} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-ink">{v.source}</a>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* ---------------- Solution ---------------- */}
      <Section id="solution" kicker={{ en: "The solution", es: "La solución" }} title={{ en: "Deal Clock: one page, two clocks, three outputs", es: "Deal Clock: una página, dos relojes, tres resultados" }}>
        <div className="grid gap-4 md:grid-cols-3">
          <Tile n="1" title={{ en: "A plan for the broker", es: "Un plan para el broker" }}>
            {t({
              en: "Type the contract dates. It maps them to day 0 (4 p.m. cutoff), the 24-hour appraisal order, the day-9 gate, day-12 clear to close and the 3-day Closing Disclosure wait — skipping weekends and holidays — and flags every collision with the fix to request.",
              es: "Se cargan las fechas del contrato. Las cruza con el día 0 (corte de las 16 h), la tasación en 24 horas, el control del día 9, la aprobación final del día 12 y la espera de 3 días de la divulgación de cierre —sin fines de semana ni feriados— y marca cada choque con el cambio a pedir.",
            })}
          </Tile>
          <Tile n="2" title={{ en: "A link for the agent", es: "Un link para el agente" }}>
            {t({
              en: "A broker-branded page the buyer's agent can open any time: days to closing, whether each contingency is safe to release, and the next milestone. Milestones only, with the borrower's consent. Fewer “any update?” calls; the broker becomes the lender agents never have to chase.",
              es: "Una página con la marca del broker que el agente del comprador puede abrir cuando quiera: días al cierre, si cada condición se puede liberar y el próximo paso. Solo hitos, con consentimiento del cliente. Menos llamadas de “¿hay novedades?”; el broker queda como el prestamista al que nunca hay que perseguir.",
            })}
          </Tile>
          <Tile n="3" title={{ en: "A letter for the offer", es: "Una carta para la oferta" }}>
            {t({
              en: "A dated closing plan the broker attaches when the offer is written — so a financed buyer can compete with the 27% who pay cash, on certainty instead of price.",
              es: "Un plan de cierre con fechas que el broker adjunta al hacer la oferta, para que un comprador con préstamo compita con el 27% que paga en efectivo en certeza, no en precio.",
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
                en: "Inside Rocket Pro Navigate and Jupiter, fed by the 18+ status events Rocket already sends to ARIVE and Jupiter. It complements the Right Track and Signal ideas from Rocket's Big Pitch: they look inside the loan file; Deal Clock looks at the calendar around it and translates it for the people outside the file.",
                es: "Dentro de Rocket Pro Navigate y Jupiter, alimentado por los más de 18 eventos de estado que Rocket ya envía a ARIVE y Jupiter. Complementa las ideas Right Track y Signal del Big Pitch de Rocket: ellas miran dentro de la carpeta; Deal Clock mira el calendario alrededor y lo traduce para quienes están fuera de la carpeta.",
              })}
            </p>
            <Link href="/demo" className="mt-4 inline-block text-sm font-semibold text-accent underline-offset-4 hover:underline">
              {t({ en: "Try it with a live contract →", es: "Probarlo con un contrato en vivo →" })}
            </Link>
          </div>
        </div>
      </Section>

      {/* ---------------- Future press release ---------------- */}
      <Section id="press" kicker={{ en: "Working backwards", es: "Trabajando hacia atrás" }} title={{ en: "The press release we'd want to write in a year", es: "El comunicado de prensa que querríamos escribir en un año" }}>
        <article className="rounded-2xl border border-line bg-card p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">{t({ en: "Hypothetical · Detroit · November 2027", es: "Hipotético · Detroit · noviembre 2027" })}</p>
          <h3 className="mt-2 font-display text-2xl font-semibold leading-snug sm:text-3xl">
            {t({ en: "Rocket Pro brokers now close 9 in 10 purchases on the date in the contract", es: "Los brokers de Rocket Pro ya cierran 9 de cada 10 compras en la fecha del contrato" })}
          </h3>
          <p className="mt-3 max-w-3xl text-muted">
            {t({
              en: "With Deal Clock built into Navigate, brokers line up contract deadlines with Rocket's milestones before the offer is signed, and real estate agents follow every deal through a link under the broker's brand. Brokers using it report fewer contingency extensions, fewer status calls, and more repeat referrals from agents.",
              es: "Con Deal Clock integrado en Navigate, los brokers alinean los plazos del contrato con los hitos de Rocket antes de firmar la oferta, y los agentes inmobiliarios siguen cada operación con un link con la marca del broker. Los brokers que lo usan reportan menos extensiones de condiciones, menos llamadas de seguimiento y más referidos repetidos de agentes.",
            })}
          </p>
          <div className="mt-6 grid gap-4 text-sm md:grid-cols-3">
            {FAQ.map((f, i) => (
              <div key={i}>
                <p className="font-semibold">{t(f.q)}</p>
                <p className="mt-1 text-muted">{t(f.a)}</p>
              </div>
            ))}
          </div>
        </article>
      </Section>

      {/* ---------------- Business case ---------------- */}
      <Section
        id="business-case"
        kicker={{ en: "Business case", es: "Caso de negocio" }}
        title={{ en: "Purchase is the market that's holding up. On-time closings are how brokers win it.", es: "La compra es el mercado que se sostiene. Cerrar en fecha es cómo los brokers la ganan." }}
        intro={{
          en: "Rocket Pro closed $9.0B in Q3 2026, down 19% from Q2, at a ~0.70% gain-on-sale margin — so the levers are volume and avoided waste: deals saved, new purchase referrals, status calls not taken. Freddie Mac estimates faster, cleaner files lift pull-through ~1.8%. Move the sliders; every input is an assumption.",
          es: "Rocket Pro cerró US$9.000M en el Q3 2026, 19% menos que en el Q2, con ~0,70% de margen; así que las palancas son volumen y desperdicio evitado: operaciones salvadas, referidos nuevos, llamadas que no se atienden. Freddie Mac estima que carpetas más rápidas y limpias suben ~1,8% los cierres. Mové los controles; cada dato es un supuesto.",
        }}
      >
        <RoiCalculator />
      </Section>

      {/* ---------------- Pilot ---------------- */}
      <Section id="pilot" kicker={{ en: "Pilot & roadmap", es: "Piloto y hoja de ruta" }} title={{ en: "Prove it in one purchase season, with a control group", es: "Probarlo en una temporada de compras, con grupo de control" }}>
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
          <div className="mt-3 grid gap-4 text-sm md:grid-cols-2 lg:grid-cols-4">
            {RISKS.map((r, i) => (
              <div key={i}>
                <p className="font-medium">{t(r.risk)}</p>
                <p className="mt-1 text-muted">{t(r.answer)}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ---------------- Questions ---------------- */}
      <Section id="questions" kicker={{ en: "What I'd ask Rocket", es: "Lo que le preguntaría a Rocket" }} title={{ en: "Five questions the public data can't answer", es: "Cinco preguntas que los datos públicos no responden" }}>
        <ol className="grid gap-3 md:grid-cols-2">
          {QUESTIONS.map((q, i) => (
            <li key={i} className="flex gap-4 rounded-2xl border border-line bg-card p-5">
              <span className="num font-display text-2xl font-semibold text-accent">{i + 1}</span>
              <span className="text-sm leading-relaxed">{t(q)}</span>
            </li>
          ))}
        </ol>
      </Section>

      {/* ---------------- Method ---------------- */}
      <Section id="method" kicker={{ en: "How this was researched", es: "Cómo se investigó" }} title={{ en: "Eight research tracks, one question", es: "Ocho líneas de investigación, una pregunta" }}>
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
            en: "Rocket Pro program details (Orbit and Purchase Priority terms, Moving Squad, Big Pitch, Power Play) were read directly on rocketpro.com. Caveats: Rocket and competitor metrics are company-reported; forum and review evidence is self-selected; CFPB complaints come from borrowers and cover all Rocket channels. Financial figures are labeled estimates, to be replaced with Rocket's data in the pilot.",
            es: "Los detalles de los programas de Rocket Pro (términos de Orbit y Purchase Priority, Moving Squad, Big Pitch, Power Play) se leyeron directamente en rocketpro.com. Salvedades: las métricas de Rocket y de la competencia son informadas por las propias empresas; la evidencia de foros y opiniones es autoseleccionada; las quejas de la CFPB son de clientes y abarcan todos los canales de Rocket. Las cifras financieras son estimaciones marcadas, a reemplazar con datos de Rocket en el piloto.",
          })}
        </p>
        <details className="mt-6 rounded-2xl border border-line bg-card p-5">
          <summary className="cursor-pointer font-semibold">{t({ en: `Sources (${SOURCES.length})`, es: `Fuentes (${SOURCES.length})` })}</summary>
          <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            {SOURCES.map((s) => (
              <li key={s.url + s.title}>
                <a href={s.url} target="_blank" rel="noreferrer" className="text-muted underline-offset-2 hover:text-ink hover:underline">{s.title}</a>
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
          <a href="https://github.com/sonzini/rocket-pro-deal-clock" target="_blank" rel="noreferrer" className="font-medium text-ink underline-offset-4 hover:underline">
            {t({ en: "Source code on GitHub", es: "Código en GitHub" })}
          </a>
        </div>
      </footer>
    </main>
  );
}

/* ---------------- Content ---------------- */

const STORY: { when: L; what: L; why: L; tone?: "warn" | "bad" }[] = [
  {
    when: { en: "Mon, Nov 2 · contract day 0", es: "lun 2 nov · día 0 del contrato" },
    what: { en: "Offer accepted over a cash buyer. 14-day appraisal contingency, 21-day financing contingency, closing Wed Dec 2.", es: "Oferta aceptada por sobre un comprador en efectivo. Condición de tasación a 14 días, de financiamiento a 21, cierre el miércoles 2 de diciembre." },
    why: { en: "Standard dates the agents negotiated. Nobody checks them against the lender's calendar — the lender isn't in the room.", es: "Fechas estándar que negociaron los agentes. Nadie las compara con el calendario del prestamista: el prestamista no está en la mesa." },
  },
  {
    when: { en: "Wed, Nov 4 · 4:40 p.m. ET", es: "mié 4 nov · 16:40 (Este)" },
    what: { en: "Broker submits a complete package to Rocket Pro.", es: "El broker envía la carpeta completa a Rocket Pro." },
    why: { en: "40 minutes past the cutoff: Rocket's day 0 becomes Thursday. One day gone before anyone notices.", es: "40 minutos después del corte: el día 0 de Rocket pasa a ser el jueves. Un día perdido antes de que nadie lo note." },
    tone: "warn",
  },
  {
    when: { en: "Wed, Nov 11 · Veterans Day", es: "mié 11 nov · Día de los Veteranos" },
    what: { en: "Assuming a 7-business-day appraisal that skips the federal holiday, the report slips a day.", es: "Si la tasación tarda 7 días hábiles y no cuenta el feriado federal, el informe se corre un día." },
    why: { en: "The report will land Wed Nov 18 and be reviewed Thu Nov 19 — exactly Rocket's day-9 gate.", es: "El informe va a llegar el miércoles 18 y revisarse el jueves 19: justo el control del día 9 de Rocket." },
    tone: "warn",
  },
  {
    when: { en: "Mon, Nov 16 · appraisal contingency ends", es: "lun 16 nov · vence la condición de tasación" },
    what: { en: "Maria must decide whether to keep her appraisal protection — three days before the appraisal is reviewed.", es: "Maria tiene que decidir si mantiene su protección de tasación, tres días antes de que se revise la tasación." },
    why: { en: "The agent asks the broker; the broker logs into the portal; nobody can answer. She waives blind or asks for an extension at the last minute.", es: "El agente le pregunta al broker; el broker entra al portal; nadie puede responder. Renuncia a ciegas o pide una extensión a último momento." },
    tone: "bad",
  },
  {
    when: { en: "Mon, Nov 23 · financing contingency ends", es: "lun 23 nov · vence la condición de financiamiento" },
    what: { en: "Maria releases her financing protection. Clear to close is expected Tuesday.", es: "Maria libera su protección de financiamiento. La aprobación final se espera el martes." },
    why: { en: "If a condition resurfaces at “the 11th hour”, her earnest money is now at risk.", es: "Si una condición reaparece “a último momento”, ahora arriesga su seña." },
    tone: "bad",
  },
  {
    when: { en: "Tue, Nov 24 → Mon, Nov 30", es: "mar 24 nov → lun 30 nov" },
    what: { en: "Clear to close, Closing Disclosure sent. Thanksgiving pauses the 3-day TRID wait; earliest closing is Monday Nov 30.", es: "Aprobación final y divulgación de cierre enviada. Acción de Gracias frena la espera de 3 días de TRID; el cierre más temprano es el lunes 30." },
    why: { en: "Two days of cushion before Dec 2. One late condition and the lock, the seller's patience and the agent's next referral all go with it.", es: "Dos días de margen antes del 2 de diciembre. Una condición tardía y se van el bloqueo de tasa, la paciencia del vendedor y el próximo referido del agente." },
  },
];

const PAYS: { who: L; cost: L }[] = [
  { who: { en: "Buyer", es: "Comprador" }, cost: { en: "Lock extensions (~2 bps a day), earnest money at risk, a slipped move-in date.", es: "Extensiones de tasa (~2 pb por día), seña en riesgo, mudanza demorada." } },
  { who: { en: "Agent", es: "Agente" }, cost: { en: "Unpaid hours chasing status; a seller threatening to cancel (14.5% of contracts canceled in Sep 2026).", es: "Horas sin cobrar persiguiendo novedades; un vendedor que amenaza con cancelar (14,5% de contratos cancelados en sep. 2026)." } },
  { who: { en: "Broker", es: "Broker" }, cost: { en: "Lost commission (~$7,700 per loan) and the agent's next referral.", es: "Comisión perdida (~US$7.700 por préstamo) y el próximo referido del agente." } },
  { who: { en: "Rocket", es: "Rocket" }, cost: { en: "A broken speed promise, status calls to AEs, complaints, and purchase share it is fighting UWM for.", es: "Una promesa de velocidad incumplida, llamadas a los ejecutivos, quejas y la participación en compras que disputa con UWM." } },
];

const BOTTLENECKS: { name: L; evidence: L; covered: L; room: number; pick?: boolean }[] = [
  {
    pick: true,
    name: { en: "Contract deadlines vs. loan milestones — nobody lines them up", es: "Plazos del contrato vs. hitos del préstamo: nadie los alinea" },
    evidence: { en: "16% of contracts delayed (NAR); Purchase Priority gates on day 1 and day 9; 43% of buyers ask their agent about the mortgage first.", es: "16% de contratos demorados (NAR); Purchase Priority con controles en los días 1 y 9; 43% de los compradores consulta la hipoteca primero con su agente." },
    covered: { en: "No shipped product. A Big Pitch entry (“Relay”) pitched a broker closing command center; competitors show status to brokers only.", es: "Ningún producto lanzado. Una propuesta del Big Pitch (“Relay”) planteó un centro de control de cierres para el broker; la competencia muestra el estado solo al broker." },
    room: 5,
  },
  {
    name: { en: "Document validation before submission", es: "Validación de documentos antes del envío" },
    evidence: { en: "Rocket Pro: complete files close purchases 2.5 days sooner (refis 4.5); industry benchmark of 3–3.5 underwriting touches per loan (2015).", es: "Rocket Pro: las carpetas completas cierran compras 2,5 días antes (refinanciaciones 4,5); referencia de la industria de 3–3,5 revisiones por préstamo (2015)." },
    covered: { en: "Crowded: Rocket's Navigate document analyzer, the “Right Track” Big Pitch idea, Vesta, Candor, Ocrolus…", es: "Saturado: el analizador de documentos de Navigate de Rocket, la idea “Right Track” del Big Pitch, Vesta, Candor, Ocrolus…" },
    room: 2,
  },
  {
    name: { en: "Conditions that resurface late", es: "Condiciones que reaparecen tarde" },
    evidence: { en: "Top broker workflow complaint: “always at the 11th hour”.", es: "Queja operativa principal de los brokers: “siempre a último momento”." },
    covered: { en: "The “Signal” Big Pitch idea; UWM Underwriting+.", es: "La idea “Signal” del Big Pitch; UWM Underwriting+." },
    room: 3,
  },
  {
    name: { en: "Status spread across systems", es: "Estado repartido en varios sistemas" },
    evidence: { en: "Brokers “log into a second system to get updates on loan status every morning”.", es: "Los brokers “entran a un segundo sistema todas las mañanas” para ver el estado." },
    covered: { en: "Rocket Pro Assist, ARIVE/Jupiter status sync.", es: "Rocket Pro Assist, sincronización con ARIVE/Jupiter." },
    room: 2,
  },
  {
    name: { en: "New partners slow to produce", es: "Socios nuevos que tardan en producir" },
    evidence: { en: "Rocket Pro closed volume fell 19% QoQ to $9.0B (Q3 2026) while Rocket pushed recruiting from UWM.", es: "El volumen cerrado de Rocket Pro cayó 19% trimestral a US$9.000M (Q3 2026) mientras Rocket impulsaba la captación de brokers de UWM." },
    covered: { en: "Moving Squad (4 people per broker), Salesforce AE tools.", es: "Moving Squad (4 personas por broker), herramientas de Salesforce para los ejecutivos." },
    room: 3,
  },
  {
    name: { en: "Pricing complexity", es: "Complejidad de precios" },
    evidence: { en: "CRO Austin Niemiec: “pricing shouldn't be gamified” — brokers shouldn't need a calculator, cheat sheet or AE call to get a good price.", es: "El CRO Austin Niemiec: “pricing shouldn't be gamified”; los brokers no deberían necesitar calculadora, machete ni llamada al ejecutivo para un buen precio." },
    covered: { en: "Flat base pricing since Sep 2026.", es: "Precio base parejo desde sep. 2026." },
    room: 1,
  },
];

const WINS: L[] = [
  { en: "Grows purchase volume — Rocket's stated priority as refinances fall — through the people who send buyers: real estate agents.", es: "Hace crecer las compras, la prioridad declarada de Rocket mientras caen las refinanciaciones, a través de quienes mandan compradores: los agentes inmobiliarios." },
  { en: "Gets more loans through Purchase Priority's day-1 and day-9 gates, so Rocket keeps the speed promise it advertises.", es: "Hace que más préstamos pasen los controles de los días 1 y 9 de Purchase Priority, para que Rocket cumpla la promesa de velocidad que anuncia." },
  { en: "A visible no-poaching proof: the agent sees the broker's brand, never Rocket retail.", es: "Una prueba visible de no quitar clientes: el agente ve la marca del broker, nunca la de Rocket retail." },
  { en: "Something no wholesale competitor offers: UWM, Newrez and Pennymac show status to the broker only.", es: "Algo que ningún competidor mayorista ofrece: UWM, Newrez y Pennymac muestran el estado solo al broker." },
  { en: "Rules-based and explainable: no AI decisions, no borrower financial data shared.", es: "Basado en reglas y explicable: sin decisiones de IA y sin compartir datos financieros del cliente." },
];

const FAQ: { q: L; a: L }[] = [
  { q: { en: "What changed for brokers?", es: "¿Qué cambió para los brokers?" }, a: { en: "Contract dates are checked against Rocket's milestones before the offer goes out, not discovered on closing week.", es: "Las fechas del contrato se controlan contra los hitos de Rocket antes de mandar la oferta, no se descubren en la semana del cierre." } },
  { q: { en: "What do agents see?", es: "¿Qué ven los agentes?" }, a: { en: "A link with days to closing, contingency status and the next step — under the broker's name, with the buyer's consent.", es: "Un link con días al cierre, estado de las condiciones y el próximo paso, con el nombre del broker y consentimiento del comprador." } },
  { q: { en: "How was it measured?", es: "¿Cómo se midió?" }, a: { en: "A 60-day pilot against a control group: on-time closings, contingency extensions, status calls and agent referrals.", es: "Un piloto de 60 días contra un grupo de control: cierres en fecha, extensiones de condiciones, llamadas de seguimiento y referidos de agentes." } },
];

const PILOT: L[] = [
  { en: "20 Orbit broker shops for 60 days of the spring purchase season, using whatever turn-time commitment Rocket runs then (the milestones are a configurable template); matched control group.", es: "20 brokers Orbit durante 60 días de la temporada de compras de primavera, con el compromiso de plazos que Rocket tenga vigente (los hitos son una plantilla configurable); grupo de control equivalente." },
  { en: "Milestone rules configured with Rocket Pro operations (cutoffs, holidays, program window).", es: "Reglas de plazos configuradas con operaciones de Rocket Pro (cortes, feriados, ventana del programa)." },
  { en: "Agent link opt-in per deal, with borrower consent; milestones only.", es: "Link para el agente opcional por operación, con consentimiento del cliente; solo hitos." },
  { en: "Weekly readout to Rocket Pro leadership on the four metrics.", es: "Reporte semanal a la dirección de Rocket Pro con las cuatro métricas." },
];

const METRICS: { target: string; label: L }[] = [
  { target: "90%", label: { en: "purchases closed on the contract date", es: "compras cerradas en la fecha del contrato" } },
  { target: "−50%", label: { en: "last-minute contingency extensions", es: "extensiones de condiciones de último momento" } },
  { target: "−2", label: { en: "status calls per loan", es: "llamadas de seguimiento por préstamo" } },
  { target: "+1", label: { en: "agent referral per broker per quarter", es: "referido de agente por broker por trimestre" } },
];

const ROADMAP: { when: L; title: L; body: L }[] = [
  { when: { en: "Done", es: "Hecho" }, title: { en: "Working MVP (this site)", es: "MVP funcionando (este sitio)" }, body: { en: "Calendar engine with Purchase Priority + TRID rules and federal holidays; broker plan, agent link, offer letter; bilingual.", es: "Motor de calendario con reglas de Purchase Priority + TRID y feriados federales; plan del broker, link del agente, carta para la oferta; bilingüe." } },
  { when: { en: "Weeks 1–4", es: "Semanas 1–4" }, title: { en: "Real status, real dates", es: "Estado real, fechas reales" }, body: { en: "Read contract dates from Jupiter/ARIVE and Rocket's status events, so the plan updates itself.", es: "Leer las fechas del contrato desde Jupiter/ARIVE y los eventos de estado de Rocket, para que el plan se actualice solo." } },
  { when: { en: "Weeks 5–12", es: "Semanas 5–12" }, title: { en: "Pilot with 20 brokers", es: "Piloto con 20 brokers" }, body: { en: "Text-message updates to agents, consent flow, measurement against the control group.", es: "Avisos por mensaje a los agentes, flujo de consentimiento y medición contra el grupo de control." } },
  { when: { en: "Next quarter", es: "Próximo trimestre" }, title: { en: "Inside Navigate for every broker", es: "Dentro de Navigate para todos los brokers" }, body: { en: "If Rocket builds the Signal or Right Track ideas, connect them: when they flag a risk in the file, Deal Clock shows what it does to the contract dates.", es: "Si Rocket construye las ideas Signal o Right Track, conectarlas: cuando detecten un riesgo en la carpeta, Deal Clock muestra qué le hace a las fechas del contrato." } },
];

const RISKS: { risk: L; answer: L }[] = [
  { risk: { en: "Privacy", es: "Privacidad" }, answer: { en: "Milestones only, opt-in with the borrower's consent; no income, credit or loan terms.", es: "Solo hitos, opcional con consentimiento del cliente; sin ingresos, crédito ni condiciones del préstamo." } },
  { risk: { en: "Over-promising", es: "Prometer de más" }, answer: { en: "Every date is labeled an estimate; never a commitment to close or to any credit.", es: "Cada fecha se marca como estimada; nunca es un compromiso de cierre ni de ningún crédito." } },
  { risk: { en: "Program changes", es: "Cambios del programa" }, answer: { en: "Purchase Priority ends Dec 14, 2026; milestones are a configurable template.", es: "Purchase Priority termina el 14 de dic. de 2026; los hitos son una plantilla configurable." } },
  { risk: { en: "State differences", es: "Diferencias por estado" }, answer: { en: "Contingency defaults and closing practice vary; all are editable inputs.", es: "Las condiciones por defecto y las prácticas de cierre varían; todo es editable." } },
];

const QUESTIONS: L[] = [
  { en: "What share of Purchase Priority loans miss a gate today — and which one fails most: the day-1 appraisal order, title by day 9, or the lock?", es: "¿Qué porcentaje de los préstamos de Purchase Priority no cumple algún control hoy, y cuál falla más: la tasación del día 1, el título del día 9 o el bloqueo de tasa?" },
  { en: "How often does a contract closing date move after submission, and who usually asks first — the agent or the broker?", es: "¿Con qué frecuencia se mueve la fecha de cierre del contrato después del envío, y quién lo pide primero: el agente o el broker?" },
  { en: "Do brokers already forward Rocket's status to agents today — screenshots, texts, emails? How many minutes a day does that take?", es: "¿Los brokers ya les reenvían el estado de Rocket a los agentes (capturas, mensajes, mails)? ¿Cuántos minutos por día les lleva?" },
  { en: "Which of the 18+ status events sent to ARIVE and Jupiter could be shown to an agent with the borrower's consent?", es: "¿Cuáles de los más de 18 eventos de estado que se envían a ARIVE y Jupiter podrían mostrarse a un agente con consentimiento del cliente?" },
  { en: "Will Purchase Priority continue after December 14 — and would you design it differently if brokers could plan around it from the offer?", es: "¿Purchase Priority sigue después del 14 de diciembre? ¿Lo diseñarían distinto si los brokers pudieran planificar con él desde la oferta?" },
];

const TRACKS: { name: L; body: L }[] = [
  { name: { en: "Rocket & Rocket Pro", es: "Rocket y Rocket Pro" }, body: { en: "SEC filings, earnings calls, rocketpro.com program terms, RPX 2026.", es: "Documentos SEC, llamadas de resultados, términos en rocketpro.com, RPX 2026." } },
  { name: { en: "Competition", es: "Competencia" }, body: { en: "UWM, Pennymac, Newrez, Kind, Plaza, A&D: tools, turn times, share.", es: "UWM, Pennymac, Newrez, Kind, Plaza, A&D: herramientas, plazos, participación." } },
  { name: { en: "Finance", es: "Finanzas" }, body: { en: "Cost to originate (MBA), margins by channel, pull-through, value model.", es: "Costo de originación (MBA), márgenes por canal, tasa de cierre, modelo de valor." } },
  { name: { en: "Mortgage operations", es: "Operaciones hipotecarias" }, body: { en: "18-step wholesale workflow, TRID timing, appraisal and lock mechanics.", es: "Flujo mayorista de 18 pasos, plazos TRID, mecánica de tasación y bloqueo." } },
  { name: { en: "Real estate", es: "Real estate" }, body: { en: "Contract delays and cancellations (NAR, Redfin), agent–broker dynamics, Compass.", es: "Demoras y cancelaciones de contratos (NAR, Redfin), relación agente–broker, Compass." } },
  { name: { en: "Startups & mortgage tech", es: "Startups y mortgage tech" }, body: { en: "Where funding goes — and the quadrant nobody serves.", es: "Hacia dónde va la inversión, y el cuadrante que nadie atiende." } },
  { name: { en: "Voice of broker & borrower", es: "Voz del broker y del cliente" }, body: { en: "~230 Reddit comments, ~95 YouTube videos, 714 CFPB complaints, Trustpilot.", es: "~230 comentarios en Reddit, ~95 videos de YouTube, 714 quejas ante la CFPB, Trustpilot." } },
  { name: { en: "Cross-check & red team", es: "Verificación y contrapunto" }, body: { en: "Perplexity searches, and all seven tracks re-ranking the options to avoid the obvious answer.", es: "Búsquedas en Perplexity, y las siete líneas reordenando las opciones para evitar la respuesta obvia." } },
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

function Quad({ items, note }: { items: string[]; note: string }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-4">
      <div className="flex flex-wrap gap-1.5">
        {items.map((x) => (
          <span key={x} className="rounded-full bg-paper px-2.5 py-1 text-xs">{x}</span>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted">{note}</p>
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

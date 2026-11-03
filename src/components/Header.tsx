"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";

export function Header({ active }: { active: "report" | "demo" }) {
  const { lang, setLang, t } = useLang();
  const link = (on: boolean) =>
    `whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition ${on ? "bg-ink text-white" : "text-muted hover:text-ink"}`;
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
            <rect width="32" height="32" rx="8" fill="#12151c" />
            <circle cx="16" cy="16" r="8.5" stroke="#fff" strokeWidth="2.4" fill="none" /><path d="M16 11v5.5l3.5 2" stroke="#e0472b" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="hidden sm:inline">Deal Clock</span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link href="/" className={link(active === "report")}>
            {t({ en: "Report", es: "Reporte" })}
          </Link>
          <Link href="/demo" className={link(active === "demo")}>
            {t({ en: "Live MVP", es: "MVP en vivo" })}
          </Link>
          <div className="ml-2 flex rounded-full border border-line bg-card p-0.5 text-xs font-medium" role="group" aria-label="Language">
            {(["en", "es"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`rounded-full px-2.5 py-1 uppercase ${lang === l ? "bg-accent text-white" : "text-muted"}`}
              >
                {l}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}

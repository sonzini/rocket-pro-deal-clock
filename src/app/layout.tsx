import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import { LangProvider } from "@/lib/i18n";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], weight: ["500", "600", "700"] });

export const metadata: Metadata = {
  authors: [{ name: "Jorge Mariel" }],
  title: "Clean File — a Rocket Pro broker friction study",
  description:
    "By Jorge Mariel. Research on the Rocket Pro broker workflow, the bottleneck that slows it down, and a working MVP that helps brokers submit once and close on time.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${fraunces.variable} antialiased`}>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}

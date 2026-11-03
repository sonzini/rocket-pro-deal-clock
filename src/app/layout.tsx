import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import { LangProvider } from "@/lib/i18n";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], weight: ["500", "600", "700"] });

export const metadata: Metadata = {
  authors: [{ name: "Jorge Mariel" }],
  title: "Deal Clock — a Rocket Pro broker study by Jorge Mariel",
  description:
    "By Jorge Mariel. Research on the Rocket Pro broker workflow, the bottleneck between the purchase contract and the loan timeline, and a working MVP that lines them up.",
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

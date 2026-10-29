import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import "./globals.css";

const serif = localFont({
  src: [
    { path: "./fonts/cormorant-garamond-latin-400-normal.woff2", weight: "400" },
    { path: "./fonts/cormorant-garamond-latin-500-normal.woff2", weight: "500" },
    { path: "./fonts/cormorant-garamond-latin-600-normal.woff2", weight: "600" },
    { path: "./fonts/cormorant-garamond-latin-700-normal.woff2", weight: "700" },
  ],
  variable: "--font-serif",
  display: "swap",
});
const sans = localFont({
  src: [
    { path: "./fonts/dm-sans-latin-400-normal.woff2", weight: "400" },
    { path: "./fonts/dm-sans-latin-500-normal.woff2", weight: "500" },
    { path: "./fonts/dm-sans-latin-600-normal.woff2", weight: "600" },
    { path: "./fonts/dm-sans-latin-700-normal.woff2", weight: "700" },
  ],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Memórias de Tefé — Histórias que o tempo não levou", template: "%s | Memórias de Tefé" },
  description: "Um museu digital independente para percorrer as histórias, paisagens e memórias de Tefé, no Médio Solimões.",
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f1e7d3",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
        <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}

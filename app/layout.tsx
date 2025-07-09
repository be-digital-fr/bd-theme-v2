import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { LocaleProvider } from "@/components/providers/locale-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BD Theme - Système Multilingue",
  description: "Application Next.js avec Sanity CMS et gestion multilingue",
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale?: string };
}

export default function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  // Déterminer la langue depuis les paramètres de l'URL
  const locale = params?.locale || 'fr';
  
  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <LocaleProvider initialLocale={locale}>
            {children}
          </LocaleProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

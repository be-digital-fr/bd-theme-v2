import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider, LocaleProvider } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: {
    default: "Be Digital - Restaurant Numérique",
    template: "%s | Be Digital"
  },
  description: "Transformez votre restaurant avec notre solution numérique complète. Commande en ligne, gestion des livraisons, système de réservation et bien plus.",
  keywords: [
    "restaurant numérique",
    "commande en ligne", 
    "livraison",
    "réservation",
    "menu digital",
    "be digital",
    "restaurant technology"
  ],
  authors: [{ name: "Be Digital Team" }],
  creator: "Be Digital",
  publisher: "Be Digital",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    siteName: "Be Digital",
    title: "Be Digital - Restaurant Numérique",
    description: "Transformez votre restaurant avec notre solution numérique complète.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Be Digital - Restaurant Numérique"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Be Digital - Restaurant Numérique",
    description: "Transformez votre restaurant avec notre solution numérique complète.",
    images: ["/images/og-image.jpg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    languages: {
      'fr': '/',
      'en': '/en',
      'es': '/es',
      'de': '/de'
    }
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" }
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <QueryProvider>
      <LocaleProvider>
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
    </LocaleProvider>
    </QueryProvider>
  );
}

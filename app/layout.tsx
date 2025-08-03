import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider, LocaleProvider } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  preload: true,
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: true,
  display: 'swap',
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
    "restaurant technology",
    "point de vente",
    "caisse enregistreuse",
    "gestion restaurant"
  ],
  authors: [{ name: "Be Digital Team" }],
  creator: "Be Digital",
  publisher: "Be Digital",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    siteName: "Be Digital",
    title: "Be Digital - Restaurant Numérique",
    description: "Transformez votre restaurant avec notre solution numérique complète. Commande en ligne, gestion des livraisons, système de réservation et bien plus.",
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
    images: ["/images/og-image.jpg"],
    creator: "@bedigital",
    site: "@bedigital"
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL || "https://bd-theme-nu.vercel.app",
  },
  other: {
    'google-site-verification': process.env.GOOGLE_SITE_VERIFICATION || '',
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
      <head>
        {/* Resource hints for critical third-party domains */}
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        
        {/* Performance optimizations */}
        <link rel="modulepreload" href="/_next/static/chunks/framework.js" />
        <meta name="color-scheme" content="light dark" />
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        
      </head>
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

import type { Metadata } from "next";

import { NavigationWrapper } from "@/components/navigation";


export const metadata: Metadata = {
  title: "BD Theme - Système Multilingue",
  description: "Application Next.js avec Sanity CMS et gestion multilingue",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <>
      <NavigationWrapper />
      <main className="pt-16 lg:pt-20">
        {children}
      </main>
    </>


  );
}

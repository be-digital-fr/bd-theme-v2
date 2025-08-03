import React from 'react';
import { HeroBanner } from '@/components/hero-banner';
import { FeaturesSection } from '@/components/features-section';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroBanner />
      <FeaturesSection />
    </main>
  );
}

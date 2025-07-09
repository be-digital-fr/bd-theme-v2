import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  i18n: {
    locales: ['fr', 'en', 'es'],
    defaultLocale: 'fr',
    localeDetection: true,
  },
};

export default nextConfig;

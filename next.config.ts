import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {
  /* config options here */
  // i18n is not supported in App Router
  // Using localStorage-based localization instead
  
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ];
  },
  
  // Compression
  compress: true,
  
  // Experimental features for performance
  experimental: {
    optimizePackageImports: [
      '@radix-ui/react-icons',
      '@iconify/react',
      'lucide-react'
    ],
  },
  
  // External packages for server components
  serverExternalPackages: ['@prisma/client'],
  
  // Bundle analyzer (development only)
  ...(process.env.ANALYZE === 'true' && {
    bundleAnalyzer: {
      enabled: true,
    },
  }),
};

const sentryWebpackPluginOptions = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  silent: process.env.NODE_ENV === 'production',

  widenClientFileUpload: true,

  reactComponentAnnotation: {
    enabled: true,
  },

  tunnelRoute: '/monitoring',

  hideSourceMaps: true,

  disableLogger: process.env.NODE_ENV === 'production',

  automaticVercelMonitors: true,

  sourcemaps: {
    disable: process.env.NODE_ENV !== 'production',
    deleteFilesAfterUpload: ['.next/**/*.map', '!.next/cache/**/*'],
  },

  release: {
    name: process.env.SENTRY_RELEASE,
    create: process.env.NODE_ENV === 'production',
    deploy: {
      env: process.env.NODE_ENV,
    },
  },

  bundleSizeOptimizations: {
    excludeReplayIframe: true,
    excludeReplayWorker: true,
    excludeReplayShadowDom: process.env.NODE_ENV === 'production',
  },
};

export default process.env.NODE_ENV === 'production' && process.env.ENABLE_SENTRY !== 'false'
  ? withSentryConfig(nextConfig, sentryWebpackPluginOptions)
  : nextConfig;

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
  
  // Image optimization - AVIF first for better compression
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year caching
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Security headers
  async headers() {
    return [
      {
        // Apply headers to all routes except API, static files
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
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()'
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp'
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin'
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
      'lucide-react',
      'clsx',
      'class-variance-authority'
    ],
    webpackBuildWorker: true,
  },
  
  // Bundle optimization
  webpack: (config) => {
    // Reduce bundle size by excluding unused modules
    config.resolve.alias = {
      ...config.resolve.alias,
      '@sentry/replay': false,
      '@sentry/profiling-node': false,
    };
    
    return config;
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

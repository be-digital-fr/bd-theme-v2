import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {
  /* config options here */
  // i18n is not supported in App Router
  // Using localStorage-based localization instead
  
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

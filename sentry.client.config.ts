import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const ENABLE_SENTRY = process.env.NEXT_PUBLIC_ENABLE_SENTRY !== "false";

if (SENTRY_DSN && ENABLE_SENTRY) {
  Sentry.init({
    dsn: SENTRY_DSN,
    
    // Performance monitoring
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
    
    // Session replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    // Debug mode in development
    debug: process.env.NODE_ENV === "development",
    
    environment: process.env.NODE_ENV,
    
    // Integration configuration
    integrations: [
      Sentry.replayIntegration({
        maskAllText: process.env.NODE_ENV === "production",
        blockAllMedia: process.env.NODE_ENV === "production",
      }),
    ],
    
    // Release tracking
    release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
    
    // Filter out unwanted errors
    beforeSend(event, hint) {
      // Filter development errors
      if (process.env.NODE_ENV === "development") {
        return event;
      }
      
      // Filter common non-critical errors
      const error = hint.originalException;
      if (error instanceof Error) {
        // Ignore network errors
        if (error.message.includes("NetworkError") || 
            error.message.includes("fetch")) {
          return null;
        }
        
        // Ignore ResizeObserver errors
        if (error.message.includes("ResizeObserver")) {
          return null;
        }
      }
      
      return event;
    },
    
    // Configure allowed URLs for better security
    allowUrls: [
      // Production domain
      process.env.NEXT_PUBLIC_BASE_URL,
      // Development
      "http://localhost:3000",
    ].filter(Boolean),
  });
}
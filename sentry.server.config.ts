import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN;
const ENABLE_SENTRY = process.env.ENABLE_SENTRY !== "false";

if (SENTRY_DSN && ENABLE_SENTRY) {
  Sentry.init({
    dsn: SENTRY_DSN,
    
    // Performance monitoring
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
    
    // Debug mode in development
    debug: process.env.NODE_ENV === "development",
    
    environment: process.env.NODE_ENV,
    
    // Release tracking
    release: process.env.SENTRY_RELEASE,
    
    // Server-specific configuration
    integrations: [
      // Default integrations are automatically included
    ],
    
    // Profile sample rate for performance profiling
    profilesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
    
    // Filter out unwanted errors
    beforeSend(event, hint) {
      // Filter development errors
      if (process.env.NODE_ENV === "development") {
        return event;
      }
      
      // Filter common non-critical server errors
      const error = hint.originalException;
      if (error instanceof Error) {
        // Ignore database connection timeouts in development
        if (error.message.includes("ECONNREFUSED") && 
            process.env.NODE_ENV !== "production") {
          return null;
        }
        
        // Ignore Prisma client initialization errors in development
        if (error.message.includes("Prisma Client") && 
            process.env.NODE_ENV !== "production") {
          return null;
        }
      }
      
      return event;
    },
    
    // Configure server-side sampling
    beforeSendTransaction(event) {
      // Sample fewer routine transactions in production
      if (process.env.NODE_ENV === "production") {
        if (event.transaction?.includes("/_next/") || 
            event.transaction?.includes("/api/health")) {
          return Math.random() < 0.01 ? event : null;
        }
      }
      return event;
    },
  });
}
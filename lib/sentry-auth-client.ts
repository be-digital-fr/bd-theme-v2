'use client';

// Client-safe auth tracking functions
// These are no-ops in development or when Sentry is disabled

export enum AuthErrorType {
  SIGNIN_FAILED = "auth_signin_failed",
  SIGNUP_FAILED = "auth_signup_failed",
  OAUTH_FAILED = "auth_oauth_failed",
  TOKEN_EXPIRED = "auth_token_expired",
  SESSION_ERROR = "auth_session_error",
  PASSWORD_RESET_FAILED = "auth_password_reset_failed",
  UNAUTHORIZED_ACCESS = "auth_unauthorized_access",
}

// Client-side error tracking (no-op for now)
export const captureAuthError = (
  error: Error | string,
  errorType: AuthErrorType,
  context?: Record<string, unknown>
) => {
  // In production with Sentry enabled, this would capture client errors
  if (process.env.NODE_ENV === 'development') {
    console.error(`[Auth Error] ${errorType}:`, error, context);
  }
};

// OAuth tracking (client-safe)
export const trackOAuthAttempt = (provider: string, success: boolean, error?: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[OAuth] ${provider} ${success ? 'success' : 'failed'}`, error);
  }
};

// Session tracking (client-safe)
export const trackSessionEvent = (event: 'created' | 'refreshed' | 'expired' | 'destroyed', userId?: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Session] ${event}`, userId);
  }
};

// User context (client-safe)
export const setAuthUserContext = (user: {
  id: string;
  email?: string;
  name?: string;
  role?: string;
}) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Auth] User context set:', user.email);
  }
};

export const clearAuthUserContext = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Auth] User context cleared');
  }
};

// Performance monitoring (client-safe)
export const startAuthTransaction = (operation: string) => {
  return {
    setStatus: (status: string) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Auth Transaction] ${operation} - ${status}`);
      }
    },
    finish: () => {
      // No-op
    }
  };
};
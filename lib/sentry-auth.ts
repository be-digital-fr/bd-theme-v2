import * as Sentry from "@sentry/nextjs";

// Auth-specific error types
export enum AuthErrorType {
  SIGNIN_FAILED = "auth_signin_failed",
  SIGNUP_FAILED = "auth_signup_failed",
  OAUTH_FAILED = "auth_oauth_failed",
  TOKEN_EXPIRED = "auth_token_expired",
  SESSION_ERROR = "auth_session_error",
  PASSWORD_RESET_FAILED = "auth_password_reset_failed",
  UNAUTHORIZED_ACCESS = "auth_unauthorized_access",
}

// Enhanced auth error tracking
export const captureAuthError = (
  error: Error | string,
  errorType: AuthErrorType,
  context?: Record<string, unknown>
) => {
  // const errorMessage = typeof error === 'string' ? error : error.message;
  const errorObj = typeof error === 'string' ? new Error(error) : error;

  Sentry.withScope((scope) => {
    // Set error type and context
    scope.setTag("error_type", errorType);
    scope.setTag("component", "auth");
    
    // Add context if provided
    if (context) {
      scope.setContext("auth_context", context);
    }

    // Set user context if available - using getCurrentScope instead
    const user = Sentry.getCurrentScope().getUser();
    if (user) {
      scope.setUser({
        ...user,
        last_auth_error: new Date().toISOString(),
      });
    }

    // Capture the error
    Sentry.captureException(errorObj, {
      level: getErrorLevel(errorType),
      tags: {
        auth_error: true,
        critical: isCriticalError(errorType),
      },
    });
  });
};

// Set user context for authenticated users
export const setAuthUserContext = (user: {
  id: string;
  email?: string;
  name?: string;
  role?: string;
}) => {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.name,
    role: user.role,
    authenticated: true,
  });
};

// Clear user context on logout
export const clearAuthUserContext = () => {
  Sentry.setUser(null);
};

// OAuth provider tracking
export const trackOAuthAttempt = (provider: string, success: boolean, error?: string) => {
  Sentry.addBreadcrumb({
    message: `OAuth ${provider} ${success ? 'success' : 'failed'}`,
    category: "auth.oauth",
    level: success ? "info" : "error",
    data: {
      provider,
      success,
      error: error || undefined,
      timestamp: new Date().toISOString(),
    },
  });

  if (!success && error) {
    captureAuthError(
      error,
      AuthErrorType.OAUTH_FAILED,
      { provider, timestamp: new Date().toISOString() }
    );
  }
};

// Session tracking
export const trackSessionEvent = (event: 'created' | 'refreshed' | 'expired' | 'destroyed', userId?: string) => {
  Sentry.addBreadcrumb({
    message: `Session ${event}`,
    category: "auth.session",
    level: event === 'expired' ? "warning" : "info",
    data: {
      event,
      userId: userId || undefined,
      timestamp: new Date().toISOString(),
    },
  });
};

// Helper functions
const getErrorLevel = (errorType: AuthErrorType): Sentry.SeverityLevel => {
  switch (errorType) {
    case AuthErrorType.UNAUTHORIZED_ACCESS:
    case AuthErrorType.SESSION_ERROR:
      return "error";
    case AuthErrorType.TOKEN_EXPIRED:
      return "warning";
    case AuthErrorType.SIGNIN_FAILED:
    case AuthErrorType.SIGNUP_FAILED:
    case AuthErrorType.OAUTH_FAILED:
    case AuthErrorType.PASSWORD_RESET_FAILED:
      return "error";
    default:
      return "error";
  }
};

const isCriticalError = (errorType: AuthErrorType): boolean => {
  return [
    AuthErrorType.UNAUTHORIZED_ACCESS,
    AuthErrorType.SESSION_ERROR,
  ].includes(errorType);
};

// Performance monitoring for auth operations
export const startAuthTransaction = (operation: string) => {
  return Sentry.startSpan({
    name: `auth_${operation}`,
    op: "auth",
    attributes: {
      component: "auth",
    },
  }, () => {
    // Transaction body - return a span object with setStatus and finish methods
    return {
      setStatus: (status: string) => {
        Sentry.getCurrentScope().setTag('transaction_status', status);
      },
      finish: () => {
        // Span will finish automatically
      }
    };
  });
};
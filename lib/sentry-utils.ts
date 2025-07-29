import * as Sentry from "@sentry/nextjs";

export function captureError(error: Error, context?: Record<string, unknown>) {
  if (process.env.NEXT_PUBLIC_ENABLE_SENTRY === "false") {
    console.error("Sentry disabled - Error:", error);
    return;
  }

  Sentry.withScope((scope) => {
    if (context) {
      scope.setContext("errorContext", context);
    }
    Sentry.captureException(error);
  });
}

export function captureMessage(message: string, level: Sentry.SeverityLevel = "info") {
  if (process.env.NEXT_PUBLIC_ENABLE_SENTRY === "false") {
    console.log(`Sentry disabled - Message [${level}]:`, message);
    return;
  }

  Sentry.captureMessage(message, level);
}

export function addBreadcrumb(message: string, category?: string, data?: Record<string, unknown>) {
  if (process.env.NEXT_PUBLIC_ENABLE_SENTRY === "false") {
    return;
  }

  Sentry.addBreadcrumb({
    message,
    category: category || "custom",
    data,
    level: "info",
  });
}

export function setUserContext(user: { id: string; email?: string; username?: string }) {
  if (process.env.NEXT_PUBLIC_ENABLE_SENTRY === "false") {
    return;
  }

  Sentry.setUser(user);
}

export function setTag(key: string, value: string) {
  if (process.env.NEXT_PUBLIC_ENABLE_SENTRY === "false") {
    return;
  }

  Sentry.setTag(key, value);
}

export function measurePerformance<T>(
  name: string,
  operation: () => T | Promise<T>
): T | Promise<T> {
  if (process.env.NEXT_PUBLIC_ENABLE_SENTRY === "false") {
    return operation();
  }

  return Sentry.withActiveSpan(null, () => {
    return Sentry.startSpan({ name, op: "function" }, () => {
      return operation();
    });
  });
}
"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENABLE_SENTRY !== "false") {
      Sentry.captureException(error);
    }
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
          <div className="max-w-md text-center">
            <h1 className="mb-4 text-2xl font-bold text-destructive">
              Une erreur inattendue s&apos;est produite
            </h1>
            
            <p className="mb-6 text-muted-foreground">
              Nous sommes désolés pour ce désagrément. L&apos;erreur a été signalée automatiquement.
            </p>
            
            {process.env.NODE_ENV === "development" && (
              <details className="mb-6 rounded border p-4 text-left">
                <summary className="cursor-pointer font-medium">
                  Détails de l&apos;erreur (développement)
                </summary>
                <pre className="mt-2 overflow-auto text-sm">
                  {error.message}
                  {error.stack && (
                    <>
                      {"\n\n"}
                      {error.stack}
                    </>
                  )}
                </pre>
              </details>
            )}
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={reset}
                className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Réessayer
              </button>
              
              <button
                onClick={() => window.location.href = "/"}
                className="rounded border border-border bg-background px-4 py-2 text-foreground hover:bg-accent transition-colors"
              >
                Retour à l&apos;accueil
              </button>
            </div>
            
            {error.digest && (
              <p className="mt-4 text-xs text-muted-foreground">
                ID d&apos;erreur: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
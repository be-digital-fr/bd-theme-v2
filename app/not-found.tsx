"use client";

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="max-w-md text-center">
        <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>
        <h2 className="mb-4 text-2xl font-bold">Page introuvable</h2>
        
        <p className="mb-6 text-muted-foreground">
          Désolé, nous n&apos;avons pas pu trouver la page que vous recherchez.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="rounded border border-border bg-background px-4 py-2 text-foreground hover:bg-accent transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    </div>
  );
}
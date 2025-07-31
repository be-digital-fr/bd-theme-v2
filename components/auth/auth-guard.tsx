"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function AuthGuard({ 
  children, 
  fallback = <div>Redirection...</div>,
  redirectTo = "/auth/signin" 
}: AuthGuardProps) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.push(redirectTo);
      return;
    }

    setShouldRender(true);
  }, [session, isPending, router, redirectTo]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!shouldRender) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface GuestGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function GuestGuard({ 
  children, 
  redirectTo = "/dashboard" 
}: GuestGuardProps) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isPending) return;

    if (session) {
      router.push(redirectTo);
      return;
    }

    setShouldRender(true);
  }, [session, isPending, router, redirectTo]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!shouldRender) {
    return null;
  }

  return <>{children}</>;
}
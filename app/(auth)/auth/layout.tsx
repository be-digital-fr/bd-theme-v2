import type { ReactNode } from "react";
import { Logo } from "@/components/ui/logo";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="mb-8">
        <Logo size="lg" href={"/"} showSkeleton={true} />
      </div>
      <main className="w-full max-w-md p-4">
        {children}
      </main>
    </div>
  );
}
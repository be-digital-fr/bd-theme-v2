"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User, LogOut, Settings, ChevronDown } from "lucide-react";

import { useSession, authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuthSettingsWithDefaults } from "@/hooks/useAuthSettings";
import { AuthModal, useAuthModal } from "@/components/auth/auth-modal";
import { useLocale } from "@/components/providers/locale-provider";

export function UserMenu() {
  const { data: session, isPending } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { resolveMultilingualValue } = useLocale();
  
  // Auth settings and modal
  const { authSettings, isLoading: isLoadingSettings } = useAuthSettingsWithDefaults();
  const { isOpen: isModalOpen, openModal, closeModal, defaultMode } = useAuthModal(authSettings);

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = "/";
          },
        },
      });
    } catch (error) {
      console.error("Error signing out:", error);
      // Fallback: redirect manually
      window.location.href = "/";
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="hidden md:block h-4 w-20" />
        <Skeleton className="h-4 w-4" />
      </div>
    );
  }

  const handleAuthClick = () => {
    if (authSettings.redirectType === 'modal') {
      openModal();
    } else {
      const authPage = authSettings.defaultAuthPage === 'signup' ? '/auth/signup' : '/auth/signin';
      router.push(authPage);
    }
  };

  if (!session) {
    const authButtonText = resolveMultilingualValue(authSettings.authButtonText);
    
    return (
      <>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleAuthClick}
          disabled={isLoadingSettings}
        >
          {authButtonText}
        </Button>
        
        <AuthModal
          isOpen={isModalOpen}
          onClose={closeModal}
          authSettings={authSettings}
          defaultMode={defaultMode}
        />
      </>
    );
  }

  const displayName = session.user.name || session.user.email;
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 h-auto p-2">
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt={displayName}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              {initials}
            </div>
          )}
          <span className="hidden md:inline-block text-sm font-medium">
            {displayName}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="end">
        <div className="space-y-1">
          <div className="px-2 py-1.5 text-sm text-muted-foreground">
            {session.user.email}
          </div>
          
          <div className="h-px bg-border my-1" />
          
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            asChild
          >
            <Link href="/profile">
              <User className="mr-2 h-4 w-4" />
              Profil
            </Link>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            asChild
          >
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              Paramètres
            </Link>
          </Button>
          
          <div className="h-px bg-border my-1" />
          
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
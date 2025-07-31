"use client";

import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useSession } from '@/lib/auth-client';
import { useAuthSettingsWithDefaults } from '@/hooks/useAuthSettings';
import { AuthModal, useAuthModal } from '@/components/auth/auth-modal';

interface AuthButtonProps {
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  ariaLabel?: string;
  iconSize?: "sm" | "md";
}

export function AuthButton({ 
  className = "h-9 w-9 text-foreground hover:text-primary",
  size = "icon",
  variant = "ghost",
  ariaLabel = "User account",
  iconSize = "md"
}: AuthButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  
  // Auth settings and modal
  const { authSettings } = useAuthSettingsWithDefaults();
  const { isOpen: isModalOpen, openModal, closeModal, defaultMode } = useAuthModal(authSettings);

  // Si l'utilisateur est connecté, on ne montre pas ce bouton
  if (session) {
    return null;
  }

  const handleAuthClick = () => {
    if (authSettings.redirectType === 'modal') {
      openModal();
    } else {
      const authPage = authSettings.defaultAuthPage === 'signup' ? '/auth/signup' : '/auth/signin';
      router.push(authPage);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleAuthClick}
        aria-label={ariaLabel}
      >
        <User className={iconSize === "sm" ? "h-6 w-6" : "h-5 w-5"} />
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
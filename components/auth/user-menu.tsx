"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, LogOut, Settings } from "lucide-react";

import { useCurrentUser, useSignOut } from "@/features/auth/presentation/hooks";
import { Button } from "@/components/ui/button";
import { clearAuthUserContext, trackSessionEvent } from "@/lib/sentry-auth";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AuthButton } from "./auth-button";
import { useHeaderData } from "@/hooks/useHeaderData";

export function UserMenu() {
  const { user, isLoading: userLoading } = useCurrentUser();
  const { signOut } = useSignOut({
    redirectTo: "/",
    onSuccess: () => {
      // Track session destruction
      if (user?.id) {
        trackSessionEvent('destroyed', user.id);
      }
      
      // Clear user context from Sentry
      clearAuthUserContext();
    },
  });
  const { data, isLoading } = useHeaderData();
  const [isOpen, setIsOpen] = useState(false);

  const authSettings = data?.authSettings || null;

  const handleSignOut = async () => {
    await signOut();
  };

  if (userLoading || isLoading) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full hover:bg-accent"
        disabled
      >
        <User className="h-5 w-5" />
      </Button>
    );
  }

  // Si l'utilisateur n'est pas connecté, ne rien afficher
  if (!user && authSettings) {
    return <AuthButton authSettings={authSettings} isHeaderLoading={userLoading} />;
  }

  const displayName = user?.name || user?.email || '';
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full hover:bg-accent"
        >
          {user?.image ? (
            <Image
              src={user.image}
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
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="end">
        <div className="space-y-1">
          <div className="px-2 py-1.5 text-sm text-muted-foreground">
            {user?.email}
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
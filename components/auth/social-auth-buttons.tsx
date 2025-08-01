"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { signInWithGoogle, signInWithFacebook } from "@/lib/auth-client";
import { AuthSettings } from "@/hooks/useAuthSettings";
import { trackOAuthAttempt } from "@/lib/sentry-auth";

interface SocialAuthButtonsProps {
  authSettings: AuthSettings;
  disabled?: boolean;
  onError?: (error: string) => void;
}

export function SocialAuthButtons({ 
  authSettings, 
  disabled = false,
  onError 
}: SocialAuthButtonsProps) {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleSocialSignIn = async (provider: 'google' | 'facebook') => {
    setLoadingProvider(provider);
    
    try {
      if (provider === 'google') {
        await signInWithGoogle();
        trackOAuthAttempt('google', true);
      } else if (provider === 'facebook') {
        await signInWithFacebook();
        trackOAuthAttempt('facebook', true);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : `Erreur lors de la connexion avec ${provider}`;
      console.error(`${provider} sign-in error:`, error);
      
      // Track failed OAuth attempt
      trackOAuthAttempt(provider, false, errorMessage);
      
      onError?.(errorMessage);
    } finally {
      setLoadingProvider(null);
    }
  };

  // Check if any social providers are enabled
  const hasEnabledProviders = authSettings?.googleAuth?.enabled || authSettings?.facebookAuth?.enabled;
  
  if (!hasEnabledProviders) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Ou continuer avec</span>
        </div>
      </div>

      {/* Social Providers */}
      <div className="grid gap-2">
        {authSettings?.googleAuth?.enabled && (
          <Button
            variant="outline"
            onClick={() => handleSocialSignIn('google')}
            disabled={disabled || loadingProvider === 'google'}
            className="w-full"
          >
            {loadingProvider === 'google' ? (
              <Spinner size="sm" className="mr-2" />
            ) : (
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            Continuer avec Google
          </Button>
        )}

        {authSettings?.facebookAuth?.enabled && (
          <Button
            variant="outline"
            onClick={() => handleSocialSignIn('facebook')}
            disabled={disabled || loadingProvider === 'facebook'}
            className="w-full"
          >
            {loadingProvider === 'facebook' ? (
              <Spinner size="sm" className="mr-2" />
            ) : (
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            )}
            Continuer avec Facebook
          </Button>
        )}
      </div>
    </div>
  );
}
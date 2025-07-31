"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { SignInForm } from './sign-in-form';
import { SignUpForm } from './sign-up-form';
import { ForgotPasswordForm } from './forgot-password-form';
import { useLocale } from '@/components/providers/locale-provider';
import { AuthSettings } from '@/hooks/useAuthSettings';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  authSettings: AuthSettings;
  defaultMode?: 'signin' | 'signup';
}

type AuthMode = 'signin' | 'signup' | 'forgot-password';

export function AuthModal({ 
  isOpen, 
  onClose, 
  authSettings,
  defaultMode = 'signin' 
}: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const { resolveMultilingualValue } = useLocale();

  const modalTitle = resolveMultilingualValue(authSettings.modalTitle);
  const modalDescription = resolveMultilingualValue(authSettings.modalDescription);

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
  };

  const handleClose = () => {
    setMode(defaultMode); // Reset to default mode
    onClose();
  };

  const renderForm = () => {
    switch (mode) {
      case 'signin':
        return (
          <SignInForm 
            onSuccess={handleClose}
            onModeChange={handleModeChange}
            showSocialButtons={authSettings.showSocialProviders}
            socialProviders={{
              google: authSettings.enableGoogleAuth,
              facebook: authSettings.enableFacebookAuth,
              twitter: authSettings.enableTwitterAuth,
              github: authSettings.enableGitHubAuth,
            }}
            hideCard={true}
          />
        );
      case 'signup':
        return (
          <SignUpForm 
            onSuccess={handleClose}
            onModeChange={handleModeChange}
            showSocialButtons={authSettings.showSocialProviders}
            socialProviders={{
              google: authSettings.enableGoogleAuth,
              facebook: authSettings.enableFacebookAuth,
              twitter: authSettings.enableTwitterAuth,
              github: authSettings.enableGitHubAuth,
            }}
            hideCard={true}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordForm 
            onSuccess={() => setMode('signin')}
            onModeChange={handleModeChange}
            hideCard={true}
          />
        );
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'signin':
        return modalTitle;
      case 'signup':
        return resolveMultilingualValue({
          fr: 'Créer un compte',
          en: 'Create an account',
        });
      case 'forgot-password':
        return resolveMultilingualValue({
          fr: 'Mot de passe oublié',
          en: 'Forgot password',
        });
      default:
        return modalTitle;
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'signin':
        return modalDescription;
      case 'signup':
        return resolveMultilingualValue({
          fr: 'Rejoignez-nous dès maintenant',
          en: 'Join us today',
        });
      case 'forgot-password':
        return resolveMultilingualValue({
          fr: 'Nous vous enverrons un lien de réinitialisation',
          en: 'We\'ll send you a reset link',
        });
      default:
        return modalDescription;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold text-left">
            {getTitle()}
          </DialogTitle>
          <DialogDescription className="text-left text-muted-foreground">
            {getDescription()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6">
          {renderForm()}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook pour gérer l'état du modal d'authentification
export function useAuthModal(authSettings: AuthSettings) {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultMode, setDefaultMode] = useState<'signin' | 'signup'>('signin');

  const openModal = (mode: 'signin' | 'signup' = authSettings.defaultAuthPage) => {
    setDefaultMode(mode);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    openModal,
    closeModal,
    defaultMode,
  };
}
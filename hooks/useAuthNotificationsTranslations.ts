import { useQuery } from '@tanstack/react-query';
import { client } from '@/sanity/lib/client';
import { useLocale } from '@/features/locale/presentation/hooks/useLocale';
import { resolveMultilingualValue } from '@/lib/resolveMultilingualValue';

interface AuthNotificationsTranslations {
  // Success messages
  signInSuccess: string;
  signUpSuccess: string;
  passwordResetEmailSent: string;
  passwordResetSuccess: string;
  logoutSuccess: string;
  
  // Loading messages
  signingIn: string;
  signingUp: string;
  sendingEmail: string;
  resettingPassword: string;
  signingOut: string;
  pleaseWait: string;
  processing: string;
  
  // Error messages
  invalidEmail: string;
  emailRequired: string;
  passwordRequired: string;
  passwordTooShort: string;
  passwordMismatch: string;
  nameRequired: string;
  nameTooShort: string;
  emailAlreadyExists: string;
  invalidCredentials: string;
  accountNotFound: string;
  invalidToken: string;
  tokenExpired: string;
  generalError: string;
  networkError: string;
  serverError: string;
  sessionExpired: string;
  unauthorized: string;
  tooManyAttempts: string;
  
  // Info messages
  checkYourEmail: string;
  redirecting: string;
  emailVerificationRequired: string;
  accountCreated: string;
  welcomeBack: string;
}

const AUTH_NOTIFICATIONS_TRANSLATIONS_QUERY = `
  *[_type == "authNotificationsTranslations"][0] {
    // Success messages
    successTitle {
      signInSuccess,
      signUpSuccess,
      passwordResetEmailSent,
      passwordResetSuccess,
      logoutSuccess
    },
    // Loading messages
    loadingTitle {
      signingIn,
      signingUp,
      sendingEmail,
      resettingPassword,
      signingOut,
      pleaseWait,
      processing
    },
    // Error messages
    errorTitle {
      invalidEmail,
      emailRequired,
      passwordRequired,
      passwordTooShort,
      passwordMismatch,
      nameRequired,
      nameTooShort,
      emailAlreadyExists,
      invalidCredentials,
      accountNotFound,
      invalidToken,
      tokenExpired,
      generalError,
      networkError,
      serverError,
      sessionExpired,
      unauthorized,
      tooManyAttempts
    },
    // Info messages
    infoTitle {
      checkYourEmail,
      redirecting,
      emailVerificationRequired,
      accountCreated,
      welcomeBack
    }
  }
`;

export function useAuthNotificationsTranslations() {
  const [currentLanguage] = useLocale();

  const { data: rawTranslations, isLoading, error } = useQuery({
    queryKey: ['authNotificationsTranslations'],
    queryFn: () => client.fetch(AUTH_NOTIFICATIONS_TRANSLATIONS_QUERY),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Traductions avec fallbacks
  const translations: AuthNotificationsTranslations = {
    // Success messages
    signInSuccess: resolveMultilingualValue({ value: rawTranslations?.successTitle?.signInSuccess, currentLanguage }) || 'Connexion réussie !',
    signUpSuccess: resolveMultilingualValue({ value: rawTranslations?.successTitle?.signUpSuccess, currentLanguage }) || 'Inscription réussie !',
    passwordResetEmailSent: resolveMultilingualValue({ value: rawTranslations?.successTitle?.passwordResetEmailSent, currentLanguage }) || 'Email de réinitialisation envoyé !',
    passwordResetSuccess: resolveMultilingualValue({ value: rawTranslations?.successTitle?.passwordResetSuccess, currentLanguage }) || 'Mot de passe réinitialisé !',
    logoutSuccess: resolveMultilingualValue({ value: rawTranslations?.successTitle?.logoutSuccess, currentLanguage }) || 'Déconnexion réussie',
    
    // Loading messages
    signingIn: resolveMultilingualValue({ value: rawTranslations?.loadingTitle?.signingIn, currentLanguage }) || 'Connexion en cours...',
    signingUp: resolveMultilingualValue({ value: rawTranslations?.loadingTitle?.signingUp, currentLanguage }) || 'Inscription en cours...',
    sendingEmail: resolveMultilingualValue({ value: rawTranslations?.loadingTitle?.sendingEmail, currentLanguage }) || 'Envoi de l\'email...',
    resettingPassword: resolveMultilingualValue({ value: rawTranslations?.loadingTitle?.resettingPassword, currentLanguage }) || 'Réinitialisation...',
    signingOut: resolveMultilingualValue({ value: rawTranslations?.loadingTitle?.signingOut, currentLanguage }) || 'Déconnexion en cours...',
    pleaseWait: resolveMultilingualValue({ value: rawTranslations?.loadingTitle?.pleaseWait, currentLanguage }) || 'Veuillez patienter...',
    processing: resolveMultilingualValue({ value: rawTranslations?.loadingTitle?.processing, currentLanguage }) || 'Traitement en cours...',
    
    // Error messages
    invalidEmail: resolveMultilingualValue({ value: rawTranslations?.errorTitle?.invalidEmail, currentLanguage }) || 'Format d\'email invalide',
    emailRequired: resolveMultilingualValue({ value: rawTranslations?.errorTitle?.emailRequired, currentLanguage }) || 'L\'email est requis',
    passwordRequired: resolveMultilingualValue({ value: rawTranslations?.errorTitle?.passwordRequired, currentLanguage }) || 'Le mot de passe est requis',
    passwordTooShort: resolveMultilingualValue({ value: rawTranslations?.errorTitle?.passwordTooShort, currentLanguage }) || 'Le mot de passe doit contenir au moins 8 caractères',
    passwordMismatch: resolveMultilingualValue({ value: rawTranslations?.errorTitle?.passwordMismatch, currentLanguage }) || 'Les mots de passe ne correspondent pas',
    nameRequired: resolveMultilingualValue({ value: rawTranslations?.errorTitle?.nameRequired, currentLanguage }) || 'Le nom est requis',
    nameTooShort: resolveMultilingualValue({ value: rawTranslations?.errorTitle?.nameTooShort, currentLanguage }) || 'Le nom doit contenir au moins 2 caractères',
    emailAlreadyExists: resolveMultilingualValue({ value: rawTranslations?.errorTitle?.emailAlreadyExists, currentLanguage }) || 'Cette adresse email est déjà utilisée',
    invalidCredentials: resolveMultilingualValue({ value: rawTranslations?.errorTitle?.invalidCredentials, currentLanguage }) || 'Email ou mot de passe incorrect',
    accountNotFound: resolveMultilingualValue({ value: rawTranslations?.errorTitle?.accountNotFound, currentLanguage }) || 'Compte non trouvé',
    invalidToken: resolveMultilingualValue({ value: rawTranslations?.errorTitle?.invalidToken, currentLanguage }) || 'Token invalide ou expiré',
    tokenExpired: resolveMultilingualValue({ value: rawTranslations?.errorTitle?.tokenExpired, currentLanguage }) || 'Le lien a expiré',
    generalError: resolveMultilingualValue({ value: rawTranslations?.errorTitle?.generalError, currentLanguage }) || 'Une erreur s\'est produite',
    networkError: resolveMultilingualValue({ value: rawTranslations?.errorTitle?.networkError, currentLanguage }) || 'Erreur de connexion',
    serverError: resolveMultilingualValue({ value: rawTranslations?.errorTitle?.serverError, currentLanguage }) || 'Erreur serveur',
    sessionExpired: resolveMultilingualValue({ value: rawTranslations?.errorTitle?.sessionExpired, currentLanguage }) || 'Session expirée',
    unauthorized: resolveMultilingualValue({ value: rawTranslations?.errorTitle?.unauthorized, currentLanguage }) || 'Non autorisé',
    tooManyAttempts: resolveMultilingualValue({ value: rawTranslations?.errorTitle?.tooManyAttempts, currentLanguage }) || 'Trop de tentatives',
    
    // Info messages
    checkYourEmail: resolveMultilingualValue({ value: rawTranslations?.infoTitle?.checkYourEmail, currentLanguage }) || 'Vérifiez votre boîte email',
    redirecting: resolveMultilingualValue({ value: rawTranslations?.infoTitle?.redirecting, currentLanguage }) || 'Redirection en cours...',
    emailVerificationRequired: resolveMultilingualValue({ value: rawTranslations?.infoTitle?.emailVerificationRequired, currentLanguage }) || 'Vérification email requise',
    accountCreated: resolveMultilingualValue({ value: rawTranslations?.infoTitle?.accountCreated, currentLanguage }) || 'Compte créé avec succès',
    welcomeBack: resolveMultilingualValue({ value: rawTranslations?.infoTitle?.welcomeBack, currentLanguage }) || 'Bon retour !',
  };

  return {
    translations,
    isLoading,
    error,
    currentLanguage,
  };
}
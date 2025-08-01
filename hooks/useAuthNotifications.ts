import { useQuery } from '@tanstack/react-query';
import { client } from '@/sanity/lib/client';
import { useLocale } from '@/features/locale/presentation/hooks/useLocale';

interface AuthNotifications {
  success: {
    signInSuccess: string;
    signUpSuccess: string;
    passwordResetEmailSent: string;
    passwordResetSuccess: string;
    logoutSuccess: string;
  };
  loading: {
    signingIn: string;
    signingUp: string;
    sendingEmail: string;
    resettingPassword: string;
    signingOut: string;
    pleaseWait: string;
    processing: string;
  };
  error: {
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
  };
  info: {
    checkYourEmail: string;
    redirecting: string;
    emailVerificationRequired: string;
    accountCreated: string;
    welcomeBack: string;
  };
}

const AUTH_NOTIFICATIONS_QUERY = `
  *[_type == "authNotificationsTranslations"][0] {
    successTitle,
    loadingTitle,
    errorTitle,
    infoTitle
  }
`;

export function useAuthNotifications() {
  const [currentLanguage] = useLocale();

  const { data: rawNotifications, isLoading, error } = useQuery({
    queryKey: ['authNotifications'],
    queryFn: () => client.fetch(AUTH_NOTIFICATIONS_QUERY),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fonction pour résoudre une valeur multilingue
  const resolveMultilingualValue = (value: any): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      return value[currentLanguage] || value['fr'] || value['en'] || Object.values(value)[0] || '';
    }
    return '';
  };

  // Fonction helper pour traiter les objets de notifications
  const processNotificationCategory = (category: any, fallbacks: Record<string, string>) => {
    const result: Record<string, string> = {};
    Object.keys(fallbacks).forEach(key => {
      result[key] = resolveMultilingualValue(category?.[key]) || fallbacks[key];
    });
    return result;
  };

  // Traductions avec fallbacks
  const notifications: AuthNotifications = {
    success: processNotificationCategory(rawNotifications?.successTitle, {
      signInSuccess: 'Connexion réussie !',
      signUpSuccess: 'Inscription réussie !',
      passwordResetEmailSent: 'Email de réinitialisation envoyé !',
      passwordResetSuccess: 'Mot de passe réinitialisé !',
      logoutSuccess: 'Déconnexion réussie',
    }) as AuthNotifications['success'],

    loading: processNotificationCategory(rawNotifications?.loadingTitle, {
      signingIn: 'Connexion en cours...',
      signingUp: 'Inscription en cours...',
      sendingEmail: 'Envoi de l\'email...',
      resettingPassword: 'Réinitialisation...',
      signingOut: 'Déconnexion en cours...',
      pleaseWait: 'Veuillez patienter...',
      processing: 'Traitement en cours...',
    }) as AuthNotifications['loading'],

    error: processNotificationCategory(rawNotifications?.errorTitle, {
      invalidEmail: 'Format d\'email invalide',
      emailRequired: 'L\'email est requis',
      passwordRequired: 'Le mot de passe est requis',
      passwordTooShort: 'Le mot de passe doit contenir au moins 8 caractères',
      passwordMismatch: 'Les mots de passe ne correspondent pas',
      nameRequired: 'Le nom est requis',
      nameTooShort: 'Le nom doit contenir au moins 2 caractères',
      emailAlreadyExists: 'Cette adresse email est déjà utilisée',
      invalidCredentials: 'Email ou mot de passe incorrect',
      accountNotFound: 'Compte non trouvé',
      invalidToken: 'Token invalide ou expiré',
      tokenExpired: 'Le lien a expiré',
      generalError: 'Une erreur s\'est produite',
      networkError: 'Erreur de connexion',
      serverError: 'Erreur serveur',
      sessionExpired: 'Session expirée',
      unauthorized: 'Non autorisé',
      tooManyAttempts: 'Trop de tentatives',
    }) as AuthNotifications['error'],

    info: processNotificationCategory(rawNotifications?.infoTitle, {
      checkYourEmail: 'Vérifiez votre boîte email',
      redirecting: 'Redirection en cours...',
      emailVerificationRequired: 'Vérification email requise',
      accountCreated: 'Compte créé avec succès',
      welcomeBack: 'Bon retour !',
    }) as AuthNotifications['info'],
  };

  return {
    notifications,
    isLoading,
    error,
    currentLanguage,
  };
}
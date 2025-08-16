"use client";

import { useQuery } from '@tanstack/react-query';
import { useCurrentLocale } from '@/lib/locale';

// Interface pour les traductions d'authentification
export interface AuthTranslations {
  // Sign In
  'auth.signin.title': string;
  'auth.signin.subtitle': string;
  'auth.signin.email': string;
  'auth.signin.password': string;
  'auth.signin.submit': string;
  'auth.signin.forgot_password': string;
  'auth.signin.no_account': string;
  'auth.signin.create_account': string;
  
  // Sign Up  
  'auth.signup.title': string;
  'auth.signup.subtitle': string;
  'auth.signup.name': string;
  'auth.signup.email': string;
  'auth.signup.password': string;
  'auth.signup.confirm_password': string;
  'auth.signup.submit': string;
  'auth.signup.have_account': string;
  'auth.signup.sign_in': string;
  
  // Forgot Password
  'auth.forgot.title': string;
  'auth.forgot.subtitle': string;
  'auth.forgot.email': string;
  'auth.forgot.submit': string;
  'auth.forgot.back_to_signin': string;
  
  // Notifications
  'auth.notifications.signin_success': string;
  'auth.notifications.signup_success': string;
  'auth.notifications.signout_success': string;
  'auth.notifications.forgot_sent': string;
  'auth.notifications.password_reset': string;
}

// Traductions par défaut (fallback)
const DEFAULT_TRANSLATIONS: Record<keyof AuthTranslations, Record<string, string>> = {
  'auth.signin.title': {
    fr: 'Connexion à votre compte',
    en: 'Sign in to your account',
    es: 'Iniciar sesión en tu cuenta',
    de: 'Melden Sie sich bei Ihrem Konto an'
  },
  'auth.signin.subtitle': {
    fr: 'Accédez à votre espace personnel',
    en: 'Access your personal space', 
    es: 'Accede a tu espacio personal',
    de: 'Greifen Sie auf Ihren persönlichen Bereich zu'
  },
  'auth.signin.email': {
    fr: 'Adresse e-mail',
    en: 'Email address',
    es: 'Dirección de correo electrónico',
    de: 'E-Mail-Adresse'
  },
  'auth.signin.password': {
    fr: 'Mot de passe',
    en: 'Password',
    es: 'Contraseña',
    de: 'Passwort'
  },
  'auth.signin.submit': {
    fr: 'Se connecter',
    en: 'Sign in',
    es: 'Iniciar sesión',
    de: 'Anmelden'
  },
  'auth.signin.forgot_password': {
    fr: 'Mot de passe oublié ?',
    en: 'Forgot password?',
    es: '¿Olvidaste tu contraseña?',
    de: 'Passwort vergessen?'
  },
  'auth.signin.no_account': {
    fr: 'Pas encore de compte ?',
    en: "Don't have an account?",
    es: '¿No tienes una cuenta?',
    de: 'Noch kein Konto?'
  },
  'auth.signin.create_account': {
    fr: 'Créer un compte',
    en: 'Create account',
    es: 'Crear cuenta',
    de: 'Konto erstellen'
  },
  'auth.signup.title': {
    fr: 'Créer un compte',
    en: 'Create an account',
    es: 'Crear una cuenta',
    de: 'Konto erstellen'
  },
  'auth.signup.subtitle': {
    fr: 'Rejoignez-nous dès maintenant',
    en: 'Join us today',
    es: 'Únete a nosotros hoy',
    de: 'Treten Sie uns heute bei'
  },
  'auth.signup.name': {
    fr: 'Nom complet',
    en: 'Full name',
    es: 'Nombre completo',
    de: 'Vollständiger Name'
  },
  'auth.signup.email': {
    fr: 'Adresse e-mail',
    en: 'Email address',
    es: 'Dirección de correo electrónico',
    de: 'E-Mail-Adresse'
  },
  'auth.signup.password': {
    fr: 'Mot de passe',
    en: 'Password',
    es: 'Contraseña',
    de: 'Passwort'
  },
  'auth.signup.confirm_password': {
    fr: 'Confirmer le mot de passe',
    en: 'Confirm password',
    es: 'Confirmar contraseña',
    de: 'Passwort bestätigen'
  },
  'auth.signup.submit': {
    fr: 'Créer le compte',
    en: 'Create account',
    es: 'Crear cuenta',
    de: 'Konto erstellen'
  },
  'auth.signup.have_account': {
    fr: 'Déjà un compte ?',
    en: 'Already have an account?',
    es: '¿Ya tienes una cuenta?',
    de: 'Bereits ein Konto?'
  },
  'auth.signup.sign_in': {
    fr: 'Se connecter',
    en: 'Sign in',
    es: 'Iniciar sesión',
    de: 'Anmelden'
  },
  'auth.forgot.title': {
    fr: 'Mot de passe oublié',
    en: 'Forgot password',
    es: 'Contraseña olvidada',
    de: 'Passwort vergessen'
  },
  'auth.forgot.subtitle': {
    fr: 'Nous vous enverrons un lien de réinitialisation',
    en: "We'll send you a reset link",
    es: 'Te enviaremos un enlace de restablecimiento',
    de: 'Wir senden Ihnen einen Reset-Link'
  },
  'auth.forgot.email': {
    fr: 'Adresse e-mail',
    en: 'Email address',
    es: 'Dirección de correo electrónico',
    de: 'E-Mail-Adresse'
  },
  'auth.forgot.submit': {
    fr: 'Envoyer le lien',
    en: 'Send reset link',
    es: 'Enviar enlace',
    de: 'Link senden'
  },
  'auth.forgot.back_to_signin': {
    fr: 'Retour à la connexion',
    en: 'Back to sign in',
    es: 'Volver al inicio de sesión',
    de: 'Zurück zur Anmeldung'
  },
  'auth.notifications.signin_success': {
    fr: 'Connexion réussie ! Bienvenue.',
    en: 'Successfully signed in! Welcome.',
    es: '¡Inicio de sesión exitoso! Bienvenido.',
    de: 'Erfolgreich angemeldet! Willkommen.'
  },
  'auth.notifications.signup_success': {
    fr: 'Compte créé avec succès ! Bienvenue.',
    en: 'Account created successfully! Welcome.',
    es: '¡Cuenta creada exitosamente! Bienvenido.',
    de: 'Konto erfolgreich erstellt! Willkommen.'
  },
  'auth.notifications.signout_success': {
    fr: 'Déconnexion réussie. À bientôt !',
    en: 'Successfully signed out. See you soon!',
    es: 'Sesión cerrada exitosamente. ¡Hasta pronto!',
    de: 'Erfolgreich abgemeldet. Bis bald!'
  },
  'auth.notifications.forgot_sent': {
    fr: 'Lien de réinitialisation envoyé par e-mail.',
    en: 'Reset link sent to your email.',
    es: 'Enlace de restablecimiento enviado a tu correo.',
    de: 'Reset-Link an Ihre E-Mail gesendet.'
  },
  'auth.notifications.password_reset': {
    fr: 'Mot de passe réinitialisé avec succès.',
    en: 'Password reset successfully.',
    es: 'Contraseña restablecida exitosamente.',
    de: 'Passwort erfolgreich zurückgesetzt.'
  }
};

// Hook pour récupérer les traductions depuis Prisma
async function fetchTranslations(category: string): Promise<Record<string, Record<string, string>>> {
  try {
    const response = await fetch(`/api/admin/translations?category=${category}`);
    if (!response.ok) {
      throw new Error('Failed to fetch translations');
    }
    const data = await response.json();
    return data.translations || {};
  } catch (error) {
    console.error('Error fetching translations:', error);
    return {};
  }
}

// Hook principal pour les traductions
export function useTranslations(category: string = 'auth') {
  const currentLocale = useCurrentLocale();
  
  const { data: translations, isLoading } = useQuery({
    queryKey: ['translations', category],
    queryFn: () => fetchTranslations(category),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const getTranslation = (key: keyof AuthTranslations): string => {
    // 1. Essayer la traduction depuis Prisma
    if (translations?.[key]?.[currentLocale]) {
      return translations[key][currentLocale];
    }
    
    // 2. Fallback vers les traductions par défaut
    if (DEFAULT_TRANSLATIONS[key]?.[currentLocale]) {
      return DEFAULT_TRANSLATIONS[key][currentLocale];
    }
    
    // 3. Fallback vers le français
    if (DEFAULT_TRANSLATIONS[key]?.fr) {
      return DEFAULT_TRANSLATIONS[key].fr;
    }
    
    // 4. Dernier fallback: retourner la clé
    return key;
  };

  return {
    t: getTranslation,
    isLoading,
    translations
  };
}

// Hook spécialisé pour l'authentification
export function useAuthTranslations() {
  const { t, isLoading } = useTranslations('auth');
  
  return {
    translations: {
      // Sign In
      title: t('auth.signin.title'),
      subtitle: t('auth.signin.subtitle'),
      email: t('auth.signin.email'),
      password: t('auth.signin.password'),
      submit: t('auth.signin.submit'),
      forgotPassword: t('auth.signin.forgot_password'),
      noAccount: t('auth.signin.no_account'),
      createAccount: t('auth.signin.create_account'),
      
      // Sign Up
      signupTitle: t('auth.signup.title'),
      signupSubtitle: t('auth.signup.subtitle'),
      name: t('auth.signup.name'),
      confirmPassword: t('auth.signup.confirm_password'),
      signupSubmit: t('auth.signup.submit'),
      haveAccount: t('auth.signup.have_account'),
      signIn: t('auth.signup.sign_in'),
      
      // Forgot Password
      forgotTitle: t('auth.forgot.title'),
      forgotSubtitle: t('auth.forgot.subtitle'),
      forgotSubmit: t('auth.forgot.submit'),
      backToSignin: t('auth.forgot.back_to_signin'),
    },
    isLoading,
    t
  };
}

// Hook pour les notifications d'authentification
export function useAuthNotifications() {
  const { t, isLoading } = useTranslations('auth');
  
  return {
    notifications: {
      signinSuccess: t('auth.notifications.signin_success'),
      signupSuccess: t('auth.notifications.signup_success'),
      signoutSuccess: t('auth.notifications.signout_success'),
      forgotSent: t('auth.notifications.forgot_sent'),
      passwordReset: t('auth.notifications.password_reset'),
    },
    isLoading
  };
}
import { useQuery } from '@tanstack/react-query';
import { client } from '@/sanity/lib/client';
import { useLocale } from '@/features/locale/presentation/hooks/useLocale';

interface SignInTranslations {
  pageTitle: string;
  pageDescription?: string;
  formTitle: string;
  emailLabel: string;
  emailPlaceholder?: string;
  passwordLabel: string;
  passwordPlaceholder?: string;
  submitButton: string;
  forgotPasswordLink?: string;
  signUpLink?: string;
  signUpLinkText?: string;
  socialAuthTitle?: string;
  orDividerText?: string;
}

const SIGN_IN_TRANSLATIONS_QUERY = `
  *[_type == "signInTranslations"][0] {
    pageTitle,
    pageDescription,
    formTitle,
    emailLabel,
    emailPlaceholder,
    passwordLabel,
    passwordPlaceholder,
    submitButton,
    forgotPasswordLink,
    signUpLink,
    signUpLinkText,
    socialAuthTitle,
    orDividerText
  }
`;

export function useSignInTranslations() {
  const [currentLanguage] = useLocale();

  const { data: rawTranslations, isLoading, error } = useQuery({
    queryKey: ['signInTranslations'],
    queryFn: () => client.fetch(SIGN_IN_TRANSLATIONS_QUERY),
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

  // Traductions avec fallbacks
  const translations: SignInTranslations = {
    pageTitle: resolveMultilingualValue(rawTranslations?.pageTitle) || 'Connexion',
    pageDescription: resolveMultilingualValue(rawTranslations?.pageDescription) || 'Connectez-vous à votre compte',
    formTitle: resolveMultilingualValue(rawTranslations?.formTitle) || 'Se connecter',
    emailLabel: resolveMultilingualValue(rawTranslations?.emailLabel) || 'Adresse email',
    emailPlaceholder: resolveMultilingualValue(rawTranslations?.emailPlaceholder) || 'votre@email.com',
    passwordLabel: resolveMultilingualValue(rawTranslations?.passwordLabel) || 'Mot de passe',
    passwordPlaceholder: resolveMultilingualValue(rawTranslations?.passwordPlaceholder) || '••••••••',
    submitButton: resolveMultilingualValue(rawTranslations?.submitButton) || 'Se connecter',
    forgotPasswordLink: resolveMultilingualValue(rawTranslations?.forgotPasswordLink) || 'Mot de passe oublié ?',
    signUpLink: resolveMultilingualValue(rawTranslations?.signUpLink) || 'Pas encore de compte ?',
    signUpLinkText: resolveMultilingualValue(rawTranslations?.signUpLinkText) || 'S\'inscrire',
    socialAuthTitle: resolveMultilingualValue(rawTranslations?.socialAuthTitle) || 'Ou continuer avec',
    orDividerText: resolveMultilingualValue(rawTranslations?.orDividerText) || 'ou',
  };

  return {
    translations,
    isLoading,
    error,
    currentLanguage,
  };
}
import { useQuery } from '@tanstack/react-query';
import { client } from '@/sanity/lib/client';
import { useLocale } from '@/features/locale/presentation/hooks/useLocale';
import { resolveMultilingualValue } from '@/lib/resolveMultilingualValue';

interface SignInTranslations {
  pageTitle: string;
  pageDescription?: string;
  title: string;
  subtitle?: string;
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
    title,
    subtitle,
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


  // Traductions avec fallbacks
  const translations: SignInTranslations = {
    pageTitle: resolveMultilingualValue({ value: rawTranslations?.pageTitle, currentLanguage }) || 'Connexion',
    pageDescription: resolveMultilingualValue({ value: rawTranslations?.pageDescription, currentLanguage }) || 'Connectez-vous à votre compte',
    title: resolveMultilingualValue({ value: rawTranslations?.title, currentLanguage }) || 'Bienvenue !',
    subtitle: resolveMultilingualValue({ value: rawTranslations?.subtitle, currentLanguage }) || 'Connectez-vous pour continuer',
    formTitle: resolveMultilingualValue({ value: rawTranslations?.formTitle, currentLanguage }) || 'Se connecter',
    emailLabel: resolveMultilingualValue({ value: rawTranslations?.emailLabel, currentLanguage }) || 'Adresse email',
    emailPlaceholder: resolveMultilingualValue({ value: rawTranslations?.emailPlaceholder, currentLanguage }) || 'votre@email.com',
    passwordLabel: resolveMultilingualValue({ value: rawTranslations?.passwordLabel, currentLanguage }) || 'Mot de passe',
    passwordPlaceholder: resolveMultilingualValue({ value: rawTranslations?.passwordPlaceholder, currentLanguage }) || '••••••••',
    submitButton: resolveMultilingualValue({ value: rawTranslations?.submitButton, currentLanguage }) || 'Se connecter',
    forgotPasswordLink: resolveMultilingualValue({ value: rawTranslations?.forgotPasswordLink, currentLanguage }) || 'Mot de passe oublié ?',
    signUpLink: resolveMultilingualValue({ value: rawTranslations?.signUpLink, currentLanguage }) || 'Pas encore de compte ?',
    signUpLinkText: resolveMultilingualValue({ value: rawTranslations?.signUpLinkText, currentLanguage }) || 'S\'inscrire',
    socialAuthTitle: resolveMultilingualValue({ value: rawTranslations?.socialAuthTitle, currentLanguage }) || 'Ou continuer avec',
    orDividerText: resolveMultilingualValue({ value: rawTranslations?.orDividerText, currentLanguage }) || 'ou',
  };

  return {
    translations,
    isLoading,
    error,
    currentLanguage,
  };
}
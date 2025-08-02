import { useQuery } from '@tanstack/react-query';
import { client } from '@/sanity/lib/client';
import { useLocale } from '@/features/locale/presentation/hooks/useLocale';
import { resolveMultilingualValue } from '@/lib/resolveMultilingualValue';

interface ForgotPasswordTranslations {
  pageTitle: string;
  pageDescription?: string;
  title: string;
  subtitle?: string;
  formTitle: string;
  emailLabel: string;
  emailPlaceholder?: string;
  submitButton: string;
  backToSignInLink?: string;
  successMessage?: string;
  successDescription?: string;
}

const FORGOT_PASSWORD_TRANSLATIONS_QUERY = `
  *[_type == "forgotPasswordTranslations"][0] {
    pageTitle,
    pageDescription,
    title,
    subtitle,
    formTitle,
    emailLabel,
    emailPlaceholder,
    submitButton,
    backToSignInLink,
    successMessage,
    successDescription
  }
`;

export function useForgotPasswordTranslations() {
  const [currentLanguage] = useLocale();

  const { data: rawTranslations, isLoading, error } = useQuery({
    queryKey: ['forgotPasswordTranslations'],
    queryFn: () => client.fetch(FORGOT_PASSWORD_TRANSLATIONS_QUERY),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Traductions avec fallbacks
  const translations: ForgotPasswordTranslations = {
    pageTitle: resolveMultilingualValue({ value: rawTranslations?.pageTitle, currentLanguage }) || 'Mot de passe oublié',
    pageDescription: resolveMultilingualValue({ value: rawTranslations?.pageDescription, currentLanguage }) || 'Entrez votre adresse email',
    title: resolveMultilingualValue({ value: rawTranslations?.title, currentLanguage }) || 'Mot de passe oublié',
    subtitle: resolveMultilingualValue({ value: rawTranslations?.subtitle, currentLanguage }) || 'Nous vous enverrons un lien de réinitialisation',
    formTitle: resolveMultilingualValue({ value: rawTranslations?.formTitle, currentLanguage }) || 'Réinitialiser le mot de passe',
    emailLabel: resolveMultilingualValue({ value: rawTranslations?.emailLabel, currentLanguage }) || 'Adresse email',
    emailPlaceholder: resolveMultilingualValue({ value: rawTranslations?.emailPlaceholder, currentLanguage }) || 'votre@email.com',
    submitButton: resolveMultilingualValue({ value: rawTranslations?.submitButton, currentLanguage }) || 'Envoyer le lien',
    backToSignInLink: resolveMultilingualValue({ value: rawTranslations?.backToSignInLink, currentLanguage }) || 'Retour à la connexion',
    successMessage: resolveMultilingualValue({ value: rawTranslations?.successMessage, currentLanguage }) || 'Email envoyé !',
    successDescription: resolveMultilingualValue({ value: rawTranslations?.successDescription, currentLanguage }) || 'Vérifiez votre boîte email.',
  };

  return {
    translations,
    isLoading,
    error,
    currentLanguage,
  };
}
import { useQuery } from '@tanstack/react-query';
import { client } from '@/sanity/lib/client';
import { useLocale } from '@/features/locale/presentation/hooks/useLocale';
import { resolveMultilingualValue } from '@/lib/resolveMultilingualValue';

interface SignUpTranslations {
  pageTitle: string;
  pageDescription?: string;
  title: string;
  subtitle?: string;
  formTitle: string;
  nameLabel: string;
  namePlaceholder?: string;
  emailLabel: string;
  emailPlaceholder?: string;
  passwordLabel: string;
  passwordPlaceholder?: string;
  confirmPasswordLabel: string;
  confirmPasswordPlaceholder?: string;
  submitButton: string;
  signInLink?: string;
  signInLinkText?: string;
  successMessage?: string;
  successDescription?: string;
  socialAuthTitle?: string;
  orDividerText?: string;
}

const SIGN_UP_TRANSLATIONS_QUERY = `
  *[_type == "signUpTranslations"][0] {
    pageTitle,
    pageDescription,
    title,
    subtitle,
    formTitle,
    nameLabel,
    namePlaceholder,
    emailLabel,
    emailPlaceholder,
    passwordLabel,
    passwordPlaceholder,
    confirmPasswordLabel,
    confirmPasswordPlaceholder,
    submitButton,
    signInLink,
    signInLinkText,
    successMessage,
    successDescription,
    socialAuthTitle,
    orDividerText
  }
`;

export function useSignUpTranslations() {
  const [currentLanguage] = useLocale();

  const { data: rawTranslations, isLoading, error } = useQuery({
    queryKey: ['signUpTranslations'],
    queryFn: () => client.fetch(SIGN_UP_TRANSLATIONS_QUERY),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Traductions avec fallbacks
  const translations: SignUpTranslations = {
    pageTitle: resolveMultilingualValue({ value: rawTranslations?.pageTitle, currentLanguage }) || 'Inscription',
    pageDescription: resolveMultilingualValue({ value: rawTranslations?.pageDescription, currentLanguage }) || 'Créez votre compte',
    title: resolveMultilingualValue({ value: rawTranslations?.title, currentLanguage }) || 'Créer un compte',
    subtitle: resolveMultilingualValue({ value: rawTranslations?.subtitle, currentLanguage }) || 'Rejoignez-nous dès maintenant',
    formTitle: resolveMultilingualValue({ value: rawTranslations?.formTitle, currentLanguage }) || 'Inscription',
    nameLabel: resolveMultilingualValue({ value: rawTranslations?.nameLabel, currentLanguage }) || 'Nom complet',
    namePlaceholder: resolveMultilingualValue({ value: rawTranslations?.namePlaceholder, currentLanguage }) || 'Jean Dupont',
    emailLabel: resolveMultilingualValue({ value: rawTranslations?.emailLabel, currentLanguage }) || 'Adresse email',
    emailPlaceholder: resolveMultilingualValue({ value: rawTranslations?.emailPlaceholder, currentLanguage }) || 'votre@email.com',
    passwordLabel: resolveMultilingualValue({ value: rawTranslations?.passwordLabel, currentLanguage }) || 'Mot de passe',
    passwordPlaceholder: resolveMultilingualValue({ value: rawTranslations?.passwordPlaceholder, currentLanguage }) || '••••••••',
    confirmPasswordLabel: resolveMultilingualValue({ value: rawTranslations?.confirmPasswordLabel, currentLanguage }) || 'Confirmer le mot de passe',
    confirmPasswordPlaceholder: resolveMultilingualValue({ value: rawTranslations?.confirmPasswordPlaceholder, currentLanguage }) || '••••••••',
    submitButton: resolveMultilingualValue({ value: rawTranslations?.submitButton, currentLanguage }) || 'Créer le compte',
    signInLink: resolveMultilingualValue({ value: rawTranslations?.signInLink, currentLanguage }) || 'Déjà inscrit ?',
    signInLinkText: resolveMultilingualValue({ value: rawTranslations?.signInLinkText, currentLanguage }) || 'Se connecter',
    successMessage: resolveMultilingualValue({ value: rawTranslations?.successMessage, currentLanguage }) || 'Compte créé avec succès !',
    successDescription: resolveMultilingualValue({ value: rawTranslations?.successDescription, currentLanguage }) || 'Votre compte a été créé.',
    socialAuthTitle: resolveMultilingualValue({ value: rawTranslations?.socialAuthTitle, currentLanguage }) || 'Ou inscrivez-vous avec',
    orDividerText: resolveMultilingualValue({ value: rawTranslations?.orDividerText, currentLanguage }) || 'ou',
  };

  return {
    translations,
    isLoading,
    error,
    currentLanguage,
  };
}
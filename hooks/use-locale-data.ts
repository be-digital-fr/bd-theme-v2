// Legacy exports for backward compatibility
export { 
  useHomeContent, 
  useAllHomeContent,
  useRawHomeContent,
  useHomeContentById
} from '../features/home/presentation/hooks/useHomeContent';

export {
  useCurrentLocale,
  useLocaleChange,
  useSupportedLocales,
  useLocaleInfo,
  useLocale
} from '../features/locale/presentation/hooks/useLocale';

export {
  useAdminPreferences,
  useUpdateAdminPreferences,
  useSetDefaultLanguage,
  useToggleMultilingual
} from '../features/admin/presentation/hooks/useAdminPreferences'; 
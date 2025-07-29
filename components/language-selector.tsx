'use client';

import { useCurrentLocale, useLocaleChange } from '@/lib/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Languages, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSettings } from '@/hooks/useNavigation';
import { useLocale } from '@/components/providers/locale-provider';

interface LanguageSelectorProps {
  variant?: 'select' | 'dropdown';
  className?: string;
  showFlag?: boolean;
  showNativeName?: boolean;
}

// Mapping global des informations de locale
const LOCALE_INFO_MAP: Record<string, { code: string; name: string; nativeName: string; flag: string }> = {
  fr: { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  en: { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  es: { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  de: { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  it: { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  pt: { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  nl: { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  ru: { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  zh: { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  ja: { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  ko: { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  ar: { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
};

export function LanguageSelector({
  variant = 'dropdown',
  className,
  showFlag = true,
  showNativeName = true,
}: LanguageSelectorProps) {
  const currentLocale = useCurrentLocale();
  const { changeLocale } = useLocaleChange();
  const { data: settings, isLoading } = useSettings();
  const { resolveMultilingualValue } = useLocale();

  // Si les settings ne sont pas chargés ou le mode multilingue est désactivé, ne rien afficher
  if (isLoading || !settings?.isMultilingual) {
    return null;
  }

  // Utiliser les langues supportées depuis Sanity
  const supportedLanguages = settings.supportedLanguages || ['fr'];
  
  // Créer les options de langue uniquement pour les langues supportées
  const languageOptions = supportedLanguages
    .map(code => LOCALE_INFO_MAP[code] || { code, name: code.toUpperCase(), nativeName: code.toUpperCase(), flag: '🌐' });
  
  // Obtenir les infos de la locale actuelle depuis notre mapping
  const currentLocaleInfo = LOCALE_INFO_MAP[currentLocale] || null;

  if (variant === 'select') {
    return (
      <Select value={currentLocale} onValueChange={changeLocale}>
        <SelectTrigger className={cn('w-40', className)}>
          <SelectValue>
            {currentLocaleInfo && (
              <div className="flex items-center gap-2">
                {showFlag && <span>{currentLocaleInfo.flag}</span>}
                <span>
                  {showNativeName ? currentLocaleInfo.nativeName : currentLocaleInfo.name}
                </span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {languageOptions.map((locale) => (
            <SelectItem key={locale.code} value={locale.code}>
              <div className="flex items-center gap-2">
                {showFlag && <span>{locale.flag}</span>}
                <span>
                  {showNativeName ? locale.nativeName : locale.name}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn('flex items-center gap-2', className)}
        >
          <Languages className="h-4 w-4" />
          {currentLocaleInfo && showFlag && (
            <span className="text-lg">{currentLocaleInfo.flag}</span>
          )}
          {!showFlag && currentLocaleInfo && (
            <span>
              {showNativeName ? currentLocaleInfo.nativeName : currentLocaleInfo.name}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0" align="end">
        <div className="p-2">
          <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
            {settings?.languageSelectorTexts?.chooseLangText 
              ? resolveMultilingualValue(settings.languageSelectorTexts.chooseLangText)
              : (currentLocale === 'en' ? 'Choose a language' : 
                 currentLocale === 'es' ? 'Elegir un idioma' : 
                 'Choisir une langue')}
          </div>
          {languageOptions.map((locale) => (
            <Button
              key={locale.code}
              variant="ghost"
              size="sm"
              className={cn(
                'w-full justify-start gap-2 text-sm',
                currentLocale === locale.code && 'bg-accent'
              )}
              onClick={() => changeLocale(locale.code)}
            >
              {showFlag && <span>{locale.flag}</span>}
              <span className="flex-1 text-left">
                {showNativeName ? locale.nativeName : locale.name}
              </span>
              {currentLocale === locale.code && (
                <Check className="h-4 w-4" />
              )}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/**
 * Composant simplifié pour afficher la langue actuelle
 */
export function CurrentLanguageDisplay({ className }: { className?: string }) {
  const currentLocale = useCurrentLocale();
  const currentLocaleInfo = LOCALE_INFO_MAP[currentLocale];

  if (!currentLocaleInfo) {
    return null;
  }

  return (
    <div className={cn('flex items-center gap-2 text-sm text-muted-foreground', className)}>
      <span>{currentLocaleInfo.flag}</span>
      <span>{currentLocaleInfo.nativeName}</span>
    </div>
  );
}

/**
 * Composant pour afficher toutes les langues disponibles
 */
export function AvailableLanguages({ className }: { className?: string }) {
  const currentLocale = useCurrentLocale();
  const { changeLocale } = useLocaleChange();
  const { data: settings, isLoading } = useSettings();

  if (isLoading || !settings?.isMultilingual) {
    return null;
  }

  const supportedLanguages = settings.supportedLanguages || ['fr'];
  const languageOptions = supportedLanguages
    .map(code => LOCALE_INFO_MAP[code] || { code, name: code.toUpperCase(), nativeName: code.toUpperCase(), flag: '🌐' });

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {languageOptions.map((locale) => (
        <Button
          key={locale.code}
          variant={currentLocale === locale.code ? 'default' : 'outline'}
          size="sm"
          className="flex items-center gap-1"
          onClick={() => changeLocale(locale.code)}
        >
          <span>{locale.flag}</span>
          <span className="text-xs">{locale.code.toUpperCase()}</span>
        </Button>
      ))}
    </div>
  );
} 
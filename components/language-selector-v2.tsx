'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Languages, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHeaderData } from '@/hooks/useHeaderData';

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

interface AdminSettings {
  isMultilingual: boolean;
  supportedLanguages: string[];
  defaultLanguage: string;
  languageSelectorTexts?: {
    chooseLangText?: Record<string, string> | string;
  };
}

// Mapping complet des langues avec leurs informations
const LANGUAGE_INFO: Record<string, LanguageOption> = {
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

interface LanguageSelectorProps {
  className?: string;
  showFlag?: boolean;
  showNativeName?: boolean;
}

export function LanguageSelector({
  className,
  showFlag = true,
  showNativeName = true,
}: LanguageSelectorProps) {
  const { data: headerData, isLoading } = useHeaderData();
  const [currentLocale, setCurrentLocale] = useState<string>('fr');

  // Extraire les settings du header data
  const settings: AdminSettings | null = headerData?.settings ? {
    isMultilingual: headerData.settings.isMultilingual,
    supportedLanguages: headerData.settings.supportedLanguages,
    defaultLanguage: headerData.settings.defaultLanguage,
    languageSelectorTexts: headerData.settings.languageSelectorTexts
  } : null;

  // Fallback settings si pas de données
  const fallbackSettings: AdminSettings = {
    isMultilingual: true,
    supportedLanguages: ['fr', 'en'],
    defaultLanguage: 'fr'
  };

  // Initialiser la langue actuelle
  useEffect(() => {
    const activeSettings = settings || fallbackSettings;
    // Récupérer la langue actuelle depuis localStorage ou utiliser la langue par défaut
    const savedLocale = localStorage.getItem('preferred-locale');
    if (savedLocale && activeSettings.supportedLanguages?.includes(savedLocale)) {
      setCurrentLocale(savedLocale);
    } else {
      setCurrentLocale(activeSettings.defaultLanguage || 'fr');
    }
  }, [settings]);

  // Changer la langue
  const changeLocale = (newLocale: string) => {
    const activeSettings = settings || fallbackSettings;
    if (!activeSettings?.supportedLanguages?.includes(newLocale)) return;
    
    setCurrentLocale(newLocale);
    localStorage.setItem('preferred-locale', newLocale);
    
    // Recharger la page pour appliquer la nouvelle langue
    window.location.reload();
  };

  // Ne pas afficher si pas multilingue ou pas assez de langues
  const activeSettings = settings || fallbackSettings;
  if (isLoading || !activeSettings.isMultilingual || activeSettings.supportedLanguages.length <= 1) {
    return null;
  }

  const supportedLanguages = activeSettings.supportedLanguages
    .map(code => LANGUAGE_INFO[code])
    .filter(Boolean);

  const currentLanguage = LANGUAGE_INFO[currentLocale];

  // Obtenir le texte "Choisir une langue"
  const getChooseLanguageText = () => {
    const chooseLangText = activeSettings?.languageSelectorTexts?.chooseLangText;
    
    if (typeof chooseLangText === 'object' && chooseLangText !== null) {
      return chooseLangText[currentLocale] || chooseLangText['fr'] || chooseLangText['en'] || 'Choisir une langue';
    }
    
    if (typeof chooseLangText === 'string') {
      return chooseLangText;
    }
    
    // Fallback par défaut
    return currentLocale === 'en' ? 'Choose language' : 'Choisir une langue';
  };

  if (isLoading) {
    return (
      <div className={cn('flex items-center', className)}>
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>
    );
  }

  if (supportedLanguages.length === 0) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'h-9 w-9 rounded-md hover:bg-accent',
            className
          )}
          aria-label={getChooseLanguageText()}
        >
          {currentLanguage ? (
            showFlag ? (
              <span className="text-lg" role="img" aria-label={currentLanguage.nativeName}>
                {currentLanguage.flag}
              </span>
            ) : (
              <Languages className="h-4 w-4" />
            )
          ) : (
            <Languages className="h-4 w-4" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-56 p-2" align="end">
        <div className="space-y-1">
          <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground border-b">
            {getChooseLanguageText()}
          </div>
          
          {supportedLanguages.map((language) => (
            <Button
              key={language.code}
              variant="ghost"
              className={cn(
                'w-full justify-start text-left h-auto p-2',
                currentLocale === language.code && 'bg-accent'
              )}
              onClick={() => changeLocale(language.code)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  {showFlag && (
                    <span className="text-base" role="img" aria-label={language.name}>
                      {language.flag}
                    </span>
                  )}
                  <div className="flex flex-col items-start">
                    {showNativeName && (
                      <span className="text-sm font-medium">
                        {language.nativeName}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {language.name}
                    </span>
                  </div>
                </div>
                
                {currentLocale === language.code && (
                  <Check className="h-4 w-4" />
                )}
              </div>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
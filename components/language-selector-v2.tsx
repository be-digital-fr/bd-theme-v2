'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Languages, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { client } from '@/sanity/lib/client';

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

interface SanitySettings {
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
  const [settings, setSettings] = useState<SanitySettings | null>(null);
  const [currentLocale, setCurrentLocale] = useState<string>('fr');
  const [isLoading, setIsLoading] = useState(true);

  // Récupérer les settings depuis Sanity
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsData = await client.fetch(`
          *[_type == "settings"][0] {
            isMultilingual,
            supportedLanguages,
            defaultLanguage,
            languageSelectorTexts
          }
        `);
        console.log('settingsData', settingsData);
        
        if (settingsData) {
          setSettings(settingsData);
          // Récupérer la langue actuelle depuis localStorage ou utiliser la langue par défaut
          const savedLocale = localStorage.getItem('preferred-locale');
          if (savedLocale && settingsData.supportedLanguages?.includes(savedLocale)) {
            setCurrentLocale(savedLocale);
          } else {
            setCurrentLocale(settingsData.defaultLanguage || 'fr');
          }
        } else {
          // Utiliser des valeurs par défaut si aucun document settings n'existe
          const defaultSettings: SanitySettings = {
            isMultilingual: true,
            supportedLanguages: ['fr', 'en'],
            defaultLanguage: 'fr'
          };
          setSettings(defaultSettings);
          const savedLocale = localStorage.getItem('preferred-locale');
          if (savedLocale && defaultSettings.supportedLanguages.includes(savedLocale)) {
            setCurrentLocale(savedLocale);
          } else {
            setCurrentLocale(defaultSettings.defaultLanguage);
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        // En cas d'erreur, utiliser les valeurs par défaut
        const defaultSettings: SanitySettings = {
          isMultilingual: true,
          supportedLanguages: ['fr', 'en'],
          defaultLanguage: 'fr'
        };
        setSettings(defaultSettings);
        const savedLocale = localStorage.getItem('preferred-locale');
        if (savedLocale && defaultSettings.supportedLanguages.includes(savedLocale)) {
          setCurrentLocale(savedLocale);
        } else {
          setCurrentLocale(defaultSettings.defaultLanguage);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Changer la langue
  const changeLocale = (newLocale: string) => {
    if (!settings?.supportedLanguages?.includes(newLocale)) return;
    
    setCurrentLocale(newLocale);
    localStorage.setItem('preferred-locale', newLocale);
    
    // Recharger la page pour appliquer la nouvelle langue
    window.location.reload();
  };

  // Ne pas afficher si pas multilingue ou en chargement
  if (isLoading || !settings?.isMultilingual) {
    return null;
  }

  // Récupérer uniquement les langues autorisées dans Sanity
  const availableLanguages = settings.supportedLanguages
    .map(code => LANGUAGE_INFO[code])
    .filter(Boolean); // Filtrer les langues non définies

  // Infos de la langue actuelle
  const currentLanguageInfo = LANGUAGE_INFO[currentLocale];

  // Résoudre le texte multilingue
  const getChooseLanguageText = () => {
    const text = settings.languageSelectorTexts?.chooseLangText;
    if (!text) {
      return currentLocale === 'en' ? 'Choose a language' : 
             currentLocale === 'es' ? 'Elegir un idioma' : 
             'Choisir une langue';
    }
    
    if (typeof text === 'string') return text;
    
    return text[currentLocale] || text['fr'] || 'Choisir une langue';
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn('flex items-center gap-2', className)}
        >
          <Languages className="h-4 w-4" />
          {currentLanguageInfo && showFlag && (
            <span className="text-lg">{currentLanguageInfo.flag}</span>
          )}
          {currentLanguageInfo && (showNativeName || !showFlag) && (
            <span>
              {showNativeName ? currentLanguageInfo.nativeName : currentLanguageInfo.name}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0" align="end">
        <div className="p-2">
          <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
            {getChooseLanguageText()}
          </div>
          {availableLanguages.map((language) => (
            <Button
              key={language.code}
              variant="ghost"
              size="sm"
              className={cn(
                'w-full justify-start gap-2 text-sm',
                currentLocale === language.code && 'bg-accent'
              )}
              onClick={() => changeLocale(language.code)}
            >
              {showFlag && <span>{language.flag}</span>}
              <span className="flex-1 text-left">
                {showNativeName ? language.nativeName : language.name}
              </span>
              {currentLocale === language.code && (
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
 * Affichage simple de la langue actuelle
 */
export function CurrentLanguageDisplay({ className }: { className?: string }) {
  const [currentLocale, setCurrentLocale] = useState<string>('fr');

  useEffect(() => {
    const savedLocale = localStorage.getItem('preferred-locale') || 'fr';
    setCurrentLocale(savedLocale);
  }, []);

  const currentLanguageInfo = LANGUAGE_INFO[currentLocale];

  if (!currentLanguageInfo) {
    return null;
  }

  return (
    <div className={cn('flex items-center gap-2 text-sm text-muted-foreground', className)}>
      <span>{currentLanguageInfo.flag}</span>
      <span>{currentLanguageInfo.nativeName}</span>
    </div>
  );
}
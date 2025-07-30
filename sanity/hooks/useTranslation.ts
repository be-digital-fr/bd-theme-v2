import { useState, useEffect, useRef, useCallback } from 'react';
import { useClient } from 'sanity';
import { translationService, TranslationSettings } from '../lib/translation-service';

export interface UseTranslationOptions {
  fieldName?: string;
  context?: string;
  delay?: number;
}

export interface TranslationState {
  isTranslating: boolean;
  error: string | null;
  lastTranslation: Date | null;
}

export function useTranslation(options: UseTranslationOptions = {}) {
  const client = useClient();
  const [state, setState] = useState<TranslationState>({
    isTranslating: false,
    error: null,
    lastTranslation: null,
  });

  const [settings, setSettings] = useState<TranslationSettings | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Charger les paramètres depuis les variables d'environnement
  useEffect(() => {
    const translationSettings: TranslationSettings = {
      autoTranslate: true, // Toujours activé si la clé API est configurée
      translationModel: 'gpt-3.5-turbo', // Configuré dans .env côté serveur
      translationDelay: 2000, // 2 secondes par défaut
    };

    setSettings(translationSettings);
    translationService.updateSettings(translationSettings);
  }, []);

  const translateField = useCallback(async (
    text: string,
    sourceLanguage: string,
    targetLanguages: string[]
  ): Promise<Record<string, string>> => {
    if (!translationService.isConfigured() || !text.trim()) {
      return {};
    }

    setState(prev => ({ ...prev, isTranslating: true, error: null }));

    try {
      const results = await translationService.translateToMultiple(
        text,
        sourceLanguage,
        targetLanguages,
        options.fieldName,
        options.context
      );

      const translations: Record<string, string> = {};
      Object.entries(results).forEach(([lang, result]) => {
        if (result.success) {
          translations[lang] = result.translatedText;
        } else if (result.error) {
          console.error(`Translation to ${lang} failed:`, result.error);
        }
      });

      setState(prev => ({ 
        ...prev, 
        isTranslating: false, 
        lastTranslation: new Date(),
        error: null
      }));

      return translations;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Translation failed';
      setState(prev => ({ 
        ...prev, 
        isTranslating: false, 
        error: errorMessage 
      }));
      return {};
    }
  }, [settings, options.fieldName, options.context]);

  const translateWithDelay = useCallback((
    text: string,
    sourceLanguage: string,
    targetLanguages: string[],
    onTranslation: (translations: Record<string, string>) => void
  ) => {
    // Annuler le délai précédent
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Nouveau délai
    debounceRef.current = setTimeout(async () => {
      const translations = await translateField(text, sourceLanguage, targetLanguages);
      onTranslation(translations);
    }, options.delay || settings?.translationDelay || 2000);
  }, [translateField, options.delay, settings?.translationDelay]);

  // Nettoyer le timeout au démontage
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    translateField,
    translateWithDelay,
    state,
    settings,
    isConfigured: translationService.isConfigured(),
  };
}

// Hook pour obtenir les langues supportées
export function useSupportedLanguages() {
  const client = useClient();
  const [languages, setLanguages] = useState<{
    supported: string[];
    default: string;
    isMultilingual: boolean;
  }>({
    supported: ['fr'],
    default: 'fr',
    isMultilingual: false,
  });

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const settingsDoc = await client.fetch(`
          *[_type == "settings"][0] {
            isMultilingual,
            supportedLanguages,
            defaultLanguage
          }
        `);

        if (settingsDoc) {
          setLanguages({
            supported: settingsDoc.supportedLanguages || ['fr'],
            default: settingsDoc.defaultLanguage || 'fr',
            isMultilingual: settingsDoc.isMultilingual || false,
          });
        }
      } catch (error) {
        console.error('Failed to load supported languages:', error);
      }
    };

    loadLanguages();
  }, [client]);

  return languages;
}
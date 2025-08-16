'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Loader2 } from 'lucide-react';
import { translationService } from '@/lib/translation-service';
import { AVAILABLE_LANGUAGES } from '@/lib/constants/languages';
import { useAdminSettings } from '@/hooks/useAdminSettings';

interface MultilingualInputProps {
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  placeholder?: string;
  type?: 'input' | 'textarea';
  disabled?: boolean;
  rows?: number;
  required?: boolean;
}

export function MultilingualInput({ 
  value = {}, 
  onChange, 
  placeholder = '',
  type = 'input',
  disabled = false,
  rows = 3,
  required = false
}: MultilingualInputProps) {
  const { data: adminSettings } = useAdminSettings();
  const [translatingTo, setTranslatingTo] = useState<Set<string>>(new Set());
  const [hasBeenTranslated, setHasBeenTranslated] = useState(false);
  
  // Utiliser les paramètres admin ou les valeurs par défaut
  const isMultilingual = adminSettings?.isMultilingual ?? false;
  const supportedLanguageCodes = adminSettings?.supportedLanguages || ['fr'];
  const defaultLanguage = adminSettings?.defaultLanguage || 'fr';
  
  // Si multilingue n'est pas activé, utiliser uniquement la langue par défaut
  const languageCodes = isMultilingual ? supportedLanguageCodes : [defaultLanguage];
  
  const supportedLanguages = AVAILABLE_LANGUAGES.filter(lang => 
    languageCodes.includes(lang.code)
  );
  
  const sourceLanguage = defaultLanguage;
  const targetLanguages = languageCodes.filter(code => code !== sourceLanguage);
  
  const [activeTab, setActiveTab] = useState(sourceLanguage);

  // Si le mode multilingue n'est pas activé, utiliser un champ simple
  if (!isMultilingual || supportedLanguages.length <= 1) {
    const InputComponent = type === 'textarea' ? Textarea : Input;
    const props = type === 'textarea' ? { rows } : {};
    
    return (
      <InputComponent
        value={value[sourceLanguage] || ''}
        onChange={(e) => onChange({ [sourceLanguage]: e.target.value })}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full"
        {...props}
      />
    );
  }

  const updateLanguage = (langCode: string, text: string) => {
    const newValue = { ...value, [langCode]: text };
    onChange(newValue);

    // Traduction automatique seulement depuis la langue source
    if (langCode === sourceLanguage && text.trim() && targetLanguages.length > 0) {
      setHasBeenTranslated(false);
      triggerAutoTranslation(text, sourceLanguage);
    }
  };

  const triggerAutoTranslation = (sourceText: string, sourceLang: string) => {
    // Seulement traduire vers les langues cibles vides
    const emptyTargetLanguages = targetLanguages.filter(code => !value[code]?.trim());
    
    if (emptyTargetLanguages.length === 0) return;

    // Utiliser le debounce service pour éviter les appels excessifs
    const key = `multilingual-input-${Date.now()}`;
    
    translationService.translateWithDebounce(
      key,
      sourceText,
      sourceLang,
      emptyTargetLanguages.join(','),
      async () => {
        // Marquer les langues en traduction
        setTranslatingTo(new Set(emptyTargetLanguages));

        try {
          // Traduire en parallèle vers toutes les langues cibles
          const translatePromises = emptyTargetLanguages.map(async (targetLang) => {
            const translationResult = await translationService.translate({
              text: sourceText,
              sourceLanguage: sourceLang,
              targetLanguage: targetLang,
              fieldName: 'service',
              context: 'Service title or description'
            });

            return { targetLang, result: translationResult };
          });

          const translations = await Promise.all(translatePromises);
          const newValue = { ...value };

          translations.forEach(({ targetLang, result }) => {
            if (result.success && result.translatedText) {
              newValue[targetLang] = result.translatedText;
            }
          });

          onChange(newValue);
          setHasBeenTranslated(true);
        } catch (error) {
          console.error('Translation error:', error);
        } finally {
          setTranslatingTo(new Set());
        }
      },
      1500,
      'service',
      'Service translation'
    );
  };

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-card">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Globe className="h-4 w-4" />
        <span>Texte multilingue</span>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${supportedLanguages.length}, 1fr)` }}>
          {supportedLanguages
            .sort((a, b) => {
              if (a.code === sourceLanguage) return -1;
              if (b.code === sourceLanguage) return 1;
              return 0;
            })
            .map((lang) => (
              <TabsTrigger 
                key={lang.code} 
                value={lang.code}
                className="flex items-center gap-1 text-xs relative"
              >
                <span>{lang.flag}</span>
                <span>{lang.code.toUpperCase()}</span>
                {lang.code === sourceLanguage && (
                  <Badge variant="default" className="h-3 w-3 p-0 text-[8px] rounded-full bg-green-600 ml-1">
                    S
                  </Badge>
                )}
                {translatingTo.has(lang.code) && (
                  <Loader2 className="h-3 w-3 animate-spin text-blue-500 ml-1" />
                )}
                {value[lang.code] && !translatingTo.has(lang.code) && lang.code !== sourceLanguage && (
                  <Badge variant="secondary" className="h-3 w-3 p-0 text-[8px] rounded-full ml-1">
                    ✓
                  </Badge>
                )}
              </TabsTrigger>
            ))}
        </TabsList>
        
        {supportedLanguages.map((lang) => {
          const InputComponent = type === 'textarea' ? Textarea : Input;
          const props = type === 'textarea' ? { rows } : {};
          
          return (
            <TabsContent key={lang.code} value={lang.code} className="mt-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{lang.name}</span>
                    {lang.code === sourceLanguage ? (
                      <Badge variant="default" className="text-xs bg-green-600">
                        Langue source
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        Traduit automatiquement
                      </Badge>
                    )}
                  </div>
                  {translatingTo.has(lang.code) && (
                    <div className="flex items-center gap-1 text-xs text-blue-600">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Traduction en cours...</span>
                    </div>
                  )}
                </div>
                
                <InputComponent
                  value={value[lang.code] || ''}
                  onChange={(e) => updateLanguage(lang.code, e.target.value)}
                  disabled={disabled || translatingTo.has(lang.code)}
                  placeholder={lang.code === sourceLanguage 
                    ? placeholder
                    : `Traduction automatique en ${lang.nativeName}...`
                  }
                  className="w-full"
                  {...props}
                />
                
                {lang.code === sourceLanguage && targetLanguages.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    💡 Tapez ici pour déclencher la traduction automatique vers les autres langues
                  </p>
                )}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {Object.keys(value).filter(k => value[k]).length}/{supportedLanguages.length} langues renseignées
        </span>
        {hasBeenTranslated && (
          <span className="text-green-600 flex items-center gap-1">
            ✅ Traduction automatique terminée
          </span>
        )}
      </div>
    </div>
  );
}
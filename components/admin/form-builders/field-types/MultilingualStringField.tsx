'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FieldWrapper } from '../FieldWrapper';

import { UseFormReturn } from 'react-hook-form';
import { Languages, Globe, Loader2 } from 'lucide-react';
import { translationService } from '@/lib/translation-service';
import { AVAILABLE_LANGUAGES } from '@/lib/constants/languages';

interface MultilingualStringFieldProps {
  field: SanityFieldConfig;
  form: UseFormReturn<any>;
  disabled?: boolean;
}

export function MultilingualStringField({ field, form, disabled }: MultilingualStringFieldProps) {
  const { setValue, watch, formState: { errors } } = form;
  const value = watch(field.name) || {};
  const error = errors[field.name]?.message as string;
  const [translatingTo, setTranslatingTo] = useState<Set<string>>(new Set());
  const [hasBeenTranslated, setHasBeenTranslated] = useState(false);
  
  // Récupérer les paramètres multilingues depuis le formulaire global (isMultilingual, supportedLanguages, defaultLanguage)
  const allFormData = watch();
  const isMultilingual = allFormData?.isMultilingual || false;
  const supportedLanguageCodes = allFormData?.supportedLanguages || ['fr'];
  const defaultLanguage = allFormData?.defaultLanguage || 'fr';
  
  // Utiliser UNIQUEMENT les langues sélectionnées par l'administrateur
  // Si multilingue n'est pas activé, n'utiliser que la langue par défaut
  const languageCodes = isMultilingual ? supportedLanguageCodes : [defaultLanguage];
  
  const supportedLanguages = AVAILABLE_LANGUAGES.filter(lang => 
    languageCodes.includes(lang.code)
  );
  
  const sourceLanguage = defaultLanguage;
  const targetLanguages = languageCodes.filter(code => code !== sourceLanguage);
  
  const [activeTab, setActiveTab] = useState(sourceLanguage);

  // Si le mode multilingue n'est pas activé ou qu'il n'y a qu'une langue, 
  // utiliser un champ simple
  if (!isMultilingual || supportedLanguages.length <= 1) {
    return (
      <FieldWrapper
        name={field.name}
        title={field.title}
        description={field.description}
        error={error}
        required={field.validation?.required}
      >
        {field.type === 'text' || field.type === 'multilingualText' || field.type === 'autoMultilingualText' ? (
          <Textarea
            value={value[sourceLanguage] || ''}
            onChange={(e) => setValue(field.name, { [sourceLanguage]: e.target.value })}
            disabled={disabled || field.readOnly}
            placeholder={`${field.title} en ${AVAILABLE_LANGUAGES.find(l => l.code === sourceLanguage)?.nativeName || sourceLanguage}`}
            className="w-full min-h-[100px] resize-y"
            rows={3}
          />
        ) : (
          <Input
            value={value[sourceLanguage] || ''}
            onChange={(e) => setValue(field.name, { [sourceLanguage]: e.target.value })}
            disabled={disabled || field.readOnly}
            placeholder={`${field.title} en ${AVAILABLE_LANGUAGES.find(l => l.code === sourceLanguage)?.nativeName || sourceLanguage}`}
            className="w-full"
          />
        )}
      </FieldWrapper>
    );
  }

  const updateLanguage = (langCode: string, text: string) => {
    const newValue = { ...value, [langCode]: text };
    setValue(field.name, newValue);

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
    const key = `${field.name}-auto-translate`;
    
    translationService.translateWithDebounce(
      key,
      sourceText,
      sourceLang,
      emptyTargetLanguages.join(','), // Utiliser comme identifier
      async (result) => {
        // Marquer les langues en traduction
        setTranslatingTo(new Set(emptyTargetLanguages));

        try {
          // Traduire en parallèle vers toutes les langues cibles
          const translatePromises = emptyTargetLanguages.map(async (targetLang) => {
            const translationResult = await translationService.translate({
              text: sourceText,
              sourceLanguage: sourceLang,
              targetLanguage: targetLang,
              fieldName: field.name,
              context: field.description
            });

            return { targetLang, result: translationResult };
          });

          const translations = await Promise.all(translatePromises);
          const currentValue = watch(field.name) || {};
          const newValue = { ...currentValue };

          translations.forEach(({ targetLang, result }) => {
            if (result.success && result.translatedText) {
              newValue[targetLang] = result.translatedText;
            }
          });

          setValue(field.name, newValue);
          setHasBeenTranslated(true);
        } catch (error) {
          console.error('Translation error:', error);
        } finally {
          setTranslatingTo(new Set());
        }
      },
      1500, // 1.5 secondes de délai
      field.name,
      field.description
    );
  };

  return (
    <FieldWrapper
      name={field.name}
      title={field.title}
      description={field.description}
      error={error}
      required={field.validation?.required}
    >
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Globe className="h-4 w-4" />
          <span>Texte multilingue</span>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid grid-cols-${Math.min(supportedLanguages.length, 6)} w-fit`}>
            {/* Langue source en premier */}
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
                    <Badge variant="default" className="h-3 w-3 p-0 text-[8px] rounded-full bg-green-600">
                      S
                    </Badge>
                  )}
                  {translatingTo.has(lang.code) && (
                    <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
                  )}
                  {value[lang.code] && !translatingTo.has(lang.code) && lang.code !== sourceLanguage && (
                    <Badge variant="secondary" className="h-3 w-3 p-0 text-[8px] rounded-full">
                      ✓
                    </Badge>
                  )}
                </TabsTrigger>
              ))}
          </TabsList>
          
          {supportedLanguages.map((lang) => (
            <TabsContent key={lang.code} value={lang.code} className="mt-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{lang.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {lang.code}
                    </Badge>
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
                
                {field.type === 'text' || field.type === 'multilingualText' || field.type === 'autoMultilingualText' ? (
                  <Textarea
                    value={value[lang.code] || ''}
                    onChange={(e) => updateLanguage(lang.code, e.target.value)}
                    disabled={disabled || field.readOnly || translatingTo.has(lang.code)}
                    placeholder={lang.code === sourceLanguage 
                      ? `Saisissez ${field.title?.toLowerCase() || 'le texte'} en ${lang.nativeName.toLowerCase()}...`
                      : `Traduction automatique en ${lang.nativeName.toLowerCase()}...`
                    }
                    className="w-full min-h-[100px] resize-y"
                    rows={3}
                  />
                ) : (
                  <Input
                    value={value[lang.code] || ''}
                    onChange={(e) => updateLanguage(lang.code, e.target.value)}
                    disabled={disabled || field.readOnly || translatingTo.has(lang.code)}
                    placeholder={lang.code === sourceLanguage 
                      ? `Saisissez ${field.title?.toLowerCase() || 'le texte'} en ${lang.nativeName.toLowerCase()}...`
                      : `Traduction automatique en ${lang.nativeName.toLowerCase()}...`
                    }
                    className="w-full"
                  />
                )}
                
                {/* Indication spéciale pour la langue source */}
                {lang.code === sourceLanguage && (
                  <p className="text-xs text-muted-foreground">
                    💡 Tapez ici pour déclencher la traduction automatique vers les autres langues
                  </p>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>
              {Object.keys(value).filter(k => value[k]).length}/{supportedLanguages.length} langues renseignées
            </span>
            <span className="text-blue-600">
              Langues configurées : {supportedLanguages.map(l => l.flag).join(' ')}
            </span>
            {hasBeenTranslated && (
              <span className="text-green-600 flex items-center gap-1">
                ✅ Traduction automatique terminée
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {translatingTo.size > 0 && (
              <span className="text-blue-600 flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Traduction vers {translatingTo.size} langue{translatingTo.size > 1 ? 's' : ''}...
              </span>
            )}
            {field.validation?.required && (
              <span className="text-yellow-600">
                Langue source requise ({AVAILABLE_LANGUAGES.find(l => l.code === sourceLanguage)?.name})
              </span>
            )}
          </div>
        </div>
      </div>
    </FieldWrapper>
  );
}
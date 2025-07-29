import React, { useState, useEffect, useCallback } from 'react';
import { ObjectInputProps, set, unset, PatchEvent } from 'sanity';
import { Card, TextInput, Flex, Text, Spinner, Button, Stack } from '@sanity/ui';
import { TranslateIcon, CheckmarkIcon, WarningOutlineIcon } from '@sanity/icons';
import { useTranslation, useSupportedLanguages } from '../hooks/useTranslation';

interface MultilingualFieldInputProps extends ObjectInputProps {
  fieldName?: string;
  inputType?: 'string' | 'text';
  rows?: number;
}

export function MultilingualFieldInput(props: MultilingualFieldInputProps) {
  const { value, onChange, fieldName, inputType = 'string', rows = 4 } = props;
  const languages = useSupportedLanguages();
  const fieldNameFromPath = props.path?.[props.path.length - 1]?.toString();
  const { translateWithDelay, translateField, state, isConfigured } = useTranslation({ 
    fieldName: fieldName || fieldNameFromPath || 'multilingual-field'
  });

  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [hasBeenTranslated, setHasBeenTranslated] = useState(false);

  const sourceLanguage = languages.default || 'fr'; // Langue source basée sur la langue par défaut
  
  // Récupérer les langues définies dans le schéma à partir des membres du type
  const schemaType = props.schemaType as any;
  const schemaFields = schemaType?.fields || [];
  const schemaLanguages = schemaFields.map((field: any) => field.name).filter((name: string) => name.length === 2);
  
  // Filtrer uniquement les langues qui sont à la fois supportées dans les settings ET définies dans le schéma
  const targetLanguages = languages.supported
    .filter(lang => lang !== sourceLanguage && schemaLanguages.includes(lang));

  // Écouter les événements de traduction personnalisés
  useEffect(() => {
    const handleAutoTranslate = (event: CustomEvent) => {
      const { translations: newTranslations, fieldName: eventFieldName } = event.detail;
      
      // Vérifier si c'est pour ce champ
      if (eventFieldName === fieldName) {
        // Mettre à jour les champs traduits
        const currentValue = value || {};
        const patches: any[] = [];

        Object.entries(newTranslations).forEach(([lang, translatedText]) => {
          if (lang !== sourceLanguage && translatedText) {
            patches.push(set(translatedText as string, [lang]));
          }
        });

        if (patches.length > 0) {
          onChange(PatchEvent.from(patches));
          setTranslations(newTranslations);
          setHasBeenTranslated(true);
        }
      }
    };

    window.addEventListener('sanity-auto-translate', handleAutoTranslate as EventListener);
    return () => {
      window.removeEventListener('sanity-auto-translate', handleAutoTranslate as EventListener);
    };
  }, [fieldName, onChange, sourceLanguage, value]);

  const handleSourceChange = useCallback((inputValue: string) => {
    // Mettre à jour la valeur source immédiatement
    onChange(PatchEvent.from([inputValue ? set(inputValue, [sourceLanguage]) : unset([sourceLanguage])]));

    // Si le multilingue est activé et la traduction auto configurée
    if (languages.isMultilingual && isConfigured && inputValue?.trim() && targetLanguages.length > 0) {
      setHasBeenTranslated(false);
      
      translateWithDelay(
        inputValue,
        sourceLanguage,
        targetLanguages,
        (newTranslations) => {
          const patches: any[] = [];
          Object.entries(newTranslations).forEach(([lang, translatedText]) => {
            if (lang !== sourceLanguage && translatedText) {
              patches.push(set(translatedText as string, [lang]));
            }
          });

          if (patches.length > 0) {
            onChange(PatchEvent.from(patches));
            setTranslations(newTranslations);
            setHasBeenTranslated(true);
          }
        }
      );
    }
  }, [onChange, translateWithDelay, languages.isMultilingual, isConfigured, targetLanguages, sourceLanguage]);

  const handleTargetChange = useCallback((lang: string, inputValue: string) => {
    onChange(PatchEvent.from([inputValue ? set(inputValue, [lang]) : unset([lang])]));
  }, [onChange]);

  const manualTranslate = useCallback(async () => {
    const sourceText = value?.[sourceLanguage];
    if (!sourceText?.trim() || !isConfigured) return;
    
    setHasBeenTranslated(false);
    const newTranslations = await translateField(sourceText, sourceLanguage, targetLanguages);
    
    const patches: any[] = [];
    Object.entries(newTranslations).forEach(([lang, translatedText]) => {
      if (lang !== sourceLanguage && translatedText) {
        patches.push(set(translatedText as string, [lang]));
      }
    });

    if (patches.length > 0) {
      onChange(PatchEvent.from(patches));
      setTranslations(newTranslations);
      setHasBeenTranslated(true);
    }
  }, [value, translateField, isConfigured, sourceLanguage, targetLanguages, onChange]);

  // Indicateur de statut de traduction
  const renderTranslationStatus = () => {
    if (!languages.isMultilingual || targetLanguages.length === 0) {
      return null;
    }

    if (!isConfigured) {
      return (
        <Flex align="center" gap={2} paddingTop={2}>
          <WarningOutlineIcon style={{ color: 'orange' }} />
          <Text size={1} style={{ color: 'orange' }}>
            Traduction automatique non configurée
          </Text>
        </Flex>
      );
    }

    if (state.isTranslating) {
      return (
        <Flex align="center" gap={2} paddingTop={2}>
          <Spinner size={1} />
          <Text size={1} muted>
            Traduction en cours vers {targetLanguages.join(', ')}...
          </Text>
        </Flex>
      );
    }

    if (state.error) {
      return (
        <Flex align="center" gap={2} paddingTop={2}>
          <WarningOutlineIcon style={{ color: 'red' }} />
          <Text size={1} style={{ color: 'red' }}>
            Erreur: {state.error}
          </Text>
        </Flex>
      );
    }

    if (hasBeenTranslated && Object.keys(translations).length > 0) {
      return (
        <Flex align="center" gap={2} paddingTop={2}>
          <CheckmarkIcon style={{ color: 'green' }} />
          <Text size={1} style={{ color: 'green' }}>
            Traduit vers {targetLanguages.join(', ')}
          </Text>
        </Flex>
      );
    }

    return null;
  };

  const InputComponent = inputType === 'text' ? 'textarea' : 'input';

  // Mapping des noms de langues
  const languageNames: Record<string, string> = {
    fr: 'Français',
    en: 'English',
    es: 'Español',
    de: 'Deutsch',
    it: 'Italiano',
    pt: 'Português',
    nl: 'Nederlands',
    ru: 'Русский',
    zh: '中文',
    ja: '日本語',
    ko: '한국어',
    ar: 'العربية',
  };

  return (
    <Card>
      <Stack space={4}>
        {/* Champ source */}
        <Stack space={2}>
          <Text weight="semibold" size={1}>
            {languageNames[sourceLanguage] || sourceLanguage.toUpperCase()} (source) *
          </Text>
          <TextInput
            value={value?.[sourceLanguage] || ''}
            onChange={(event) => handleSourceChange(event.currentTarget.value)}
            placeholder={`Tapez votre texte en ${languageNames[sourceLanguage]?.toLowerCase() || sourceLanguage}...`}
          />
          {renderTranslationStatus()}
        </Stack>

        {/* Champs traduits */}
        {languages.isMultilingual && targetLanguages.map((lang) => {
          const langName = languageNames[lang] || lang.toUpperCase();

          return (
            <Stack space={2} key={lang}>
              <Flex justify="space-between" align="baseline">
                <Text weight="semibold" size={1}>
                  {langName}
                </Text>
                <Text size={1} muted>
                  Traduit automatiquement
                </Text>
              </Flex>
              <TextInput
                value={value?.[lang] || ''}
                onChange={(event) => handleTargetChange(lang, event.currentTarget.value)}
                placeholder={`Traduction en ${langName.toLowerCase()}...`}
                readOnly={!value?.[sourceLanguage]}
                style={{ 
                  backgroundColor: !value?.[sourceLanguage] ? '#f5f5f5' : undefined,
                  color: !value?.[sourceLanguage] ? '#999' : undefined,
                }}
              />
            </Stack>
          );
        })}

        {/* Bouton de traduction manuelle */}
        {languages.isMultilingual && isConfigured && !state.isTranslating && value?.[sourceLanguage]?.trim() && (
          <Flex justify="flex-end">
            <Button
              mode="ghost"
              icon={TranslateIcon}
              text="Traduire maintenant"
              onClick={manualTranslate}
              size={1}
            />
          </Flex>
        )}
      </Stack>
    </Card>
  );
}
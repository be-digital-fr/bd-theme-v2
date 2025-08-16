'use client';

import { useSiteSettingsStore } from '@/stores/useSiteSettingsStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertCircle, HelpCircle, Languages, Wand2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export function LanguageSettingsSection() {
  const { formData, updateField, hasFieldError, getFieldError, clearError } = useSiteSettingsStore();

  const languageSettings = formData.languageSelector || {};
  const supportedLanguages = formData.general?.supportedLanguages || ['fr'];
  const isMultilingual = formData.general?.isMultilingual || false;

  const updateLanguageField = (field: string, value: any) => {
    const newLanguageSettings = {
      ...languageSettings,
      [field]: value
    };
    updateField('languageSelector', newLanguageSettings);
    clearError(`language.${field}`);
  };

  const updateChooseLangText = (languageCode: string, text: string) => {
    const currentTexts = languageSettings.chooseLangText || {};
    const newTexts = {
      ...currentTexts,
      [languageCode]: text
    };
    updateLanguageField('chooseLangText', newTexts);
  };

  const generateAutoTranslations = async () => {
    // TODO: Implement OpenAI translation
    const baseText = languageSettings.chooseLangText?.fr || 'Choisir une langue';
    const autoTexts = {
      fr: 'Choisir une langue',
      en: 'Choose language',
      es: 'Elegir idioma',
      de: 'Sprache wählen',
      it: 'Scegli lingua',
      pt: 'Escolher idioma',
      ar: 'اختر اللغة'
    };

    updateLanguageField('chooseLangText', autoTexts);
  };

  if (!isMultilingual) {
    return (
      <div className="space-y-6">
        <Alert>
          <Languages className="h-4 w-4" />
          <AlertDescription>
            Le mode multilingue n'est pas activé. Activez-le dans l'onglet "Général" 
            pour configurer les textes du sélecteur de langue.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Language Selector Texts */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Textes du sélecteur de langue</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ces textes apparaissent dans le sélecteur de langue du site</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardDescription>
            Personnalisez les textes affichés dans le sélecteur de langue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Auto-generate button */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">Traduction automatique</h4>
              <p className="text-xs text-muted-foreground">
                Générer automatiquement les traductions via IA
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={generateAutoTranslations}
            >
              <Wand2 className="h-4 w-4 mr-2" />
              Traduire automatiquement
            </Button>
          </div>

          {/* Choose Language Text */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Texte "Choisir une langue"</Label>
              <Badge variant="secondary" className="text-xs">
                {supportedLanguages.length} langue{supportedLanguages.length > 1 ? 's' : ''}
              </Badge>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {supportedLanguages.map((langCode) => {
                const languageNames: Record<string, string> = {
                  fr: 'Français',
                  en: 'English',
                  es: 'Español',
                  de: 'Deutsch',
                  it: 'Italiano',
                  pt: 'Português',
                  ar: 'العربية'
                };

                const languageFlags: Record<string, string> = {
                  fr: '🇫🇷',
                  en: '🇬🇧',
                  es: '🇪🇸',
                  de: '🇩🇪',
                  it: '🇮🇹',
                  pt: '🇵🇹',
                  ar: '🇸🇦'
                };

                return (
                  <div key={langCode} className="space-y-2">
                    <Label htmlFor={`choose-lang-${langCode}`} className="text-sm">
                      <div className="flex items-center gap-2">
                        <span>{languageFlags[langCode]}</span>
                        <span>{languageNames[langCode] || langCode.toUpperCase()}</span>
                        {state.formData.general?.defaultLanguage === langCode && (
                          <Badge variant="outline" className="text-xs">Défaut</Badge>
                        )}
                      </div>
                    </Label>
                    <Input
                      id={`choose-lang-${langCode}`}
                      value={languageSettings.chooseLangText?.[langCode] || ''}
                      onChange={(e) => updateChooseLangText(langCode, e.target.value)}
                      placeholder={
                        langCode === 'fr' ? 'Choisir une langue' :
                        langCode === 'en' ? 'Choose language' :
                        langCode === 'es' ? 'Elegir idioma' :
                        langCode === 'de' ? 'Sprache wählen' :
                        langCode === 'it' ? 'Scegli lingua' :
                        langCode === 'pt' ? 'Escolher idioma' :
                        langCode === 'ar' ? 'اختر اللغة' :
                        'Choose language'
                      }
                      className={hasFieldError(`language.chooseLangText.${langCode}`) ? 'border-red-500' : ''}
                      dir={langCode === 'ar' ? 'rtl' : 'ltr'}
                    />
                  </div>
                );
              })}
            </div>

            {hasFieldError('language.chooseLangText') && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>{getFieldError('language.chooseLangText')}</span>
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              Ces textes apparaissent dans le menu déroulant de sélection de langue
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Aperçu du sélecteur</CardTitle>
          <CardDescription>
            Voici comment apparaîtra le sélecteur de langue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 bg-muted/30">
            <div className="flex items-center gap-2 text-sm">
              <Languages className="h-4 w-4" />
              <span>{languageSettings.chooseLangText?.fr || 'Choisir une langue'}</span>
            </div>
            <div className="mt-2 ml-6 space-y-1">
              {supportedLanguages.map((langCode) => {
                const languageNames: Record<string, string> = {
                  fr: 'Français',
                  en: 'English',
                  es: 'Español',
                  de: 'Deutsch',
                  it: 'Italiano',
                  pt: 'Português',
                  ar: 'العربية'
                };

                const languageFlags: Record<string, string> = {
                  fr: '🇫🇷',
                  en: '🇬🇧',
                  es: '🇪🇸',
                  de: '🇩🇪',
                  it: '🇮🇹',
                  pt: '🇵🇹',
                  ar: '🇸🇦'
                };

                return (
                  <div key={langCode} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{languageFlags[langCode]}</span>
                    <span>{languageNames[langCode]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
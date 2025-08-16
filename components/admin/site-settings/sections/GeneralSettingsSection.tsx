'use client';

import { useSiteSettingsStore } from '@/stores/useSiteSettingsStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, HelpCircle, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useForm } from 'react-hook-form';
import { MultilingualStringField } from '@/components/admin/form-builders/field-types/MultilingualStringField';
import { useEffect } from 'react';

const AVAILABLE_LANGUAGES = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

export function GeneralSettingsSection() {
  const { formData, updateField, hasFieldError, getFieldError, clearError } = useSiteSettingsStore();
  
  // Get general settings data
  const generalData = formData.general || {};

  // Form pour la traduction automatique du titre
  const titleForm = useForm({
    defaultValues: {
      title: generalData.titleTranslations || {},
      // Configuration multilingue basée sur les paramètres généraux
      isMultilingual: generalData.isMultilingual || false,
      supportedLanguages: generalData.supportedLanguages || ['fr'],
      defaultLanguage: generalData.defaultLanguage || 'fr',
    }
  });

  // Synchroniser le form avec les changements du store
  useEffect(() => {
    titleForm.setValue('isMultilingual', generalData.isMultilingual || false);
    titleForm.setValue('supportedLanguages', generalData.supportedLanguages || ['fr']);
    titleForm.setValue('defaultLanguage', generalData.defaultLanguage || 'fr');
  }, [generalData.isMultilingual, generalData.supportedLanguages, generalData.defaultLanguage, titleForm]);

  // Gérer les changements de titre multilingue
  const handleTitleTranslationsChange = () => {
    const titleTranslations = titleForm.watch('title') || {};
    const frenchTitle = titleTranslations.fr || '';
    
    // Mettre à jour le store avec le titre français et les traductions
    updateField('general', { 
      ...generalData, 
      title: frenchTitle,
      titleTranslations: titleTranslations 
    });
    
    if (frenchTitle.trim().length >= 3) {
      clearError('title');
    }
  };

  // Synchroniser les changements du form titre avec le store
  useEffect(() => {
    const subscription = titleForm.watch(() => {
      handleTitleTranslationsChange();
    });
    return () => subscription.unsubscribe();
  }, [titleForm, generalData, updateField, clearError]);

  const handleMultilingualChange = (checked: boolean) => {
    updateField('general', { ...generalData, isMultilingual: checked });
    
    // If disabling multilingual, reset to French only
    if (!checked) {
      updateField('general', {
        ...generalData,
        isMultilingual: checked,
        supportedLanguages: ['fr'],
        defaultLanguage: 'fr'
      });
      clearError('supportedLanguages');
      clearError('defaultLanguage');
    }
  };

  const toggleLanguage = (languageCode: string) => {
    const currentLanguages = generalData.supportedLanguages || ['fr'];
    const isSelected = currentLanguages.includes(languageCode);
    
    if (isSelected && currentLanguages.length > 1) {
      const newLanguages = currentLanguages.filter(lang => lang !== languageCode);
      updateField('general', { ...generalData, supportedLanguages: newLanguages });
      
      // If removing default language, set new default
      if (generalData.defaultLanguage === languageCode) {
        updateField('general', { ...generalData, supportedLanguages: newLanguages, defaultLanguage: newLanguages[0] });
      }
    } else if (!isSelected) {
      updateField('general', { ...generalData, supportedLanguages: [...currentLanguages, languageCode] });
    }
    
    clearError('supportedLanguages');
  };

  const handleDefaultLanguageChange = (languageCode: string) => {
    const currentLanguages = generalData.supportedLanguages || [];
    
    // Ensure default language is in supported languages
    if (!currentLanguages.includes(languageCode)) {
      updateField('general', {
        ...generalData,
        defaultLanguage: languageCode,
        supportedLanguages: [...currentLanguages, languageCode]
      });
    } else {
      updateField('general', { ...generalData, defaultLanguage: languageCode });
    }
    
    clearError('defaultLanguage');
  };

  return (
    <div className="space-y-6">
      {/* Site Title */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Informations générales</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ces informations apparaissent dans l'onglet du navigateur et les moteurs de recherche</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardDescription>
            Configurez le titre et les paramètres de base de votre site
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <MultilingualStringField
              field={{
                name: 'title',
                type: 'string',
                title: 'Titre du site',
                description: 'Le titre principal de votre restaurant qui apparaîtra dans l\'onglet du navigateur et les résultats de recherche',
                validation: { required: true }
              }}
              form={titleForm}
            />
            {hasFieldError('title') && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>{getFieldError('title')}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Language Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Configuration des langues</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Activez le mode multilingue pour proposer votre site en plusieurs langues</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardDescription>
            Gérez les langues disponibles sur votre site restaurant
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Multilingual Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="multilingual" className="text-sm font-medium">
                Site multilingue
              </Label>
              <p className="text-xs text-muted-foreground">
                Permettre aux visiteurs de choisir leur langue
              </p>
            </div>
            <Switch
              id="multilingual"
              checked={generalData.isMultilingual || false}
              onCheckedChange={handleMultilingualChange}
            />
          </div>

          {/* Language Selection */}
          {generalData.isMultilingual && (
            <>
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Langues supportées *
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {AVAILABLE_LANGUAGES.map((language) => {
                    const isSelected = (generalData.supportedLanguages || []).includes(language.code);
                    const isDefault = generalData.defaultLanguage === language.code;
                    
                    return (
                      <button
                        key={language.code}
                        type="button"
                        onClick={() => toggleLanguage(language.code)}
                        className={`
                          flex items-center gap-2 p-3 rounded-md border text-sm transition-all
                          ${isSelected 
                            ? 'bg-primary text-primary-foreground border-primary' 
                            : 'hover:bg-muted border-input'
                          }
                        `}
                      >
                        <span className="text-base">{language.flag}</span>
                        <span className="flex-1 text-left">{language.name}</span>
                        {isDefault && (
                          <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                            Défaut
                          </Badge>
                        )}
                      </button>
                    );
                  })}
                </div>
                {hasFieldError('supportedLanguages') && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>{getFieldError('supportedLanguages')}</span>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Sélectionnez toutes les langues que vous souhaitez proposer à vos clients
                </p>
              </div>

              {/* Default Language */}
              <div className="space-y-2">
                <Label htmlFor="default-language" className="text-sm font-medium">
                  Langue par défaut *
                </Label>
                <Select 
                  value={generalData.defaultLanguage || 'fr'} 
                  onValueChange={handleDefaultLanguageChange}
                >
                  <SelectTrigger className={hasFieldError('defaultLanguage') ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Choisir la langue par défaut" />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_LANGUAGES
                      .filter(lang => (generalData.supportedLanguages || []).includes(lang.code))
                      .map((language) => (
                        <SelectItem key={language.code} value={language.code}>
                          <div className="flex items-center gap-2">
                            <span>{language.flag}</span>
                            <span>{language.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {hasFieldError('defaultLanguage') && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>{getFieldError('defaultLanguage')}</span>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Langue affichée lors de la première visite d'un utilisateur
                </p>
              </div>

              {/* Info Alert */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Traduction automatique :</strong> Les contenus peuvent être traduits automatiquement 
                  via l'API OpenAI. Vous pourrez ensuite affiner les traductions manuellement.
                </AlertDescription>
              </Alert>
            </>
          )}

          {!generalData.isMultilingual && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Votre site sera uniquement disponible en français. 
                Activez le mode multilingue pour proposer d'autres langues.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
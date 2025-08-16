'use client';

import { useHomeContentStore } from '@/stores/useHomeContentStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { MultilingualInput } from '@/components/admin/shared/MultilingualInput';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, HelpCircle } from 'lucide-react';
import { ImageUpload } from '@/components/admin/shared/ImageUpload';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


export function HeroSection() {
  const { formData, updateField, hasFieldError, getFieldError, clearError } = useHomeContentStore();

  const heroData = formData.hero || {};

  const updateHeroField = (field: string, value: any) => {
    const newHeroData = {
      ...heroData,
      [field]: value
    };
    updateField('hero', newHeroData);
    clearError(`hero.${field}`);
  };


  return (
    <div className="space-y-6">
      {/* Activation */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Bannière Hero</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>La bannière principale qui apparaît en haut de votre page d'accueil</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardDescription>
            Configuration de la bannière principale de la page d'accueil
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="hero-active" className="text-sm font-medium">
                Bannière active
              </Label>
              <p className="text-xs text-muted-foreground">
                Afficher la bannière sur la page d'accueil
              </p>
            </div>
            <Switch
              id="hero-active"
              checked={heroData.isActive ?? true}
              onCheckedChange={(checked) => updateHeroField('isActive', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contenu textuel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contenu textuel</CardTitle>
          <CardDescription>
            Titre et description de la bannière
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Titre */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Titre accrocheur *</Label>
              {hasFieldError('hero.heroTitle') && (
                <div className="flex items-center gap-1 text-red-600">
                  <AlertCircle className="h-3 w-3" />
                  <span className="text-xs">{getFieldError('hero.heroTitle')}</span>
                </div>
              )}
            </div>
            <MultilingualInput
              value={heroData.heroTitle || {}}
              onChange={(newTitle) => {
                updateHeroField('heroTitle', newTitle);
              }}
              placeholder="Titre accrocheur de la bannière (ex: Savourez nos burgers uniques)"
              type="input"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Description *</Label>
              {hasFieldError('hero.heroDescription') && (
                <div className="flex items-center gap-1 text-red-600">
                  <AlertCircle className="h-3 w-3" />
                  <span className="text-xs">{getFieldError('hero.heroDescription')}</span>
                </div>
              )}
            </div>
            <MultilingualInput
              value={heroData.heroDescription || {}}
              onChange={(newDescription) => {
                updateHeroField('heroDescription', newDescription);
              }}
              placeholder="Description engageante (ex: Des recettes fraîches et gourmandes)"
              type="textarea"
              rows={3}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Boutons */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Boutons d'action</CardTitle>
          <CardDescription>
            Boutons principal et secondaire de la bannière
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Bouton principal */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Bouton principal</Label>
            
            {/* Texte du bouton */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Texte du bouton</Label>
              <MultilingualInput
                value={heroData.primaryButtonText || {}}
                onChange={(newText) => {
                  updateHeroField('primaryButtonText', newText);
                }}
                placeholder="Texte du bouton (ex: Commander maintenant)"
                type="input"
              />
            </div>
            
            {/* URL du bouton */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">URL de destination</Label>
              <Input
                value={heroData.primaryButtonUrl || ''}
                onChange={(e) => updateHeroField('primaryButtonUrl', e.target.value)}
                placeholder="/order"
              />
            </div>
          </div>

          {/* Bouton secondaire */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Bouton secondaire</Label>
            
            {/* Texte du bouton */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Texte du bouton</Label>
              <MultilingualInput
                value={heroData.secondaryButtonText || {}}
                onChange={(newText) => {
                  updateHeroField('secondaryButtonText', newText);
                }}
                placeholder="Texte du bouton (ex: Voir le menu)"
                type="input"
              />
            </div>
            
            {/* URL du bouton */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">URL de destination</Label>
              <Input
                value={heroData.secondaryButtonUrl || ''}
                onChange={(e) => updateHeroField('secondaryButtonUrl', e.target.value)}
                placeholder="/menu"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Hero Image Desktop */}
        <ImageUpload
          title="Image principale (Desktop)"
          description="Image principale affichée sur les écrans d'ordinateur"
          currentImageUrl={heroData.heroImageDesktop}
          altText={heroData.heroImageAlt || {}}
          onImageChange={(imageUrl) => updateHeroField('heroImageDesktop', imageUrl)}
          onAltTextChange={(altText) => updateHeroField('heroImageAlt', altText)}
          onRemove={() => updateHeroField('heroImageDesktop', '')}
          recommendedSize="800x600px"
          aspectRatio="4/3"
          placeholder="Image principale non définie"
        />

        {/* Hero Image Mobile */}
        <ImageUpload
          title="Image principale (Mobile)"
          description="Version optimisée pour les appareils mobiles"
          currentImageUrl={heroData.heroImageMobile}
          altText={heroData.heroImageAlt || {}}
          onImageChange={(imageUrl) => updateHeroField('heroImageMobile', imageUrl)}
          onAltTextChange={(altText) => updateHeroField('heroImageAlt', altText)}
          onRemove={() => updateHeroField('heroImageMobile', '')}
          recommendedSize="600x800px"
          aspectRatio="3/4"
          placeholder="Image mobile non définie"
          showAltText={false} // Alt text is shared with desktop
        />

        {/* Background Image Desktop */}
        <ImageUpload
          title="Image de fond (Desktop)"
          description="Image d'arrière-plan pour les grands écrans"
          currentImageUrl={heroData.backgroundImageDesktop}
          onImageChange={(imageUrl) => updateHeroField('backgroundImageDesktop', imageUrl)}
          onRemove={() => updateHeroField('backgroundImageDesktop', '')}
          recommendedSize="1920x1080px"
          aspectRatio="16/9"
          placeholder="Arrière-plan desktop non défini"
          showAltText={false} // Background images don't need alt text
        />

        {/* Background Image Mobile */}
        <ImageUpload
          title="Image de fond (Mobile)"
          description="Image d'arrière-plan pour les appareils mobiles"
          currentImageUrl={heroData.backgroundImageMobile}
          onImageChange={(imageUrl) => updateHeroField('backgroundImageMobile', imageUrl)}
          onRemove={() => updateHeroField('backgroundImageMobile', '')}
          recommendedSize="800x1200px"
          aspectRatio="2/3"
          placeholder="Arrière-plan mobile non défini"
          showAltText={false} // Background images don't need alt text
        />
      </div>
    </div>
  );
}
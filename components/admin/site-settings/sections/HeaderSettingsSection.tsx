'use client';

import { useState } from 'react';
import { useSiteSettingsStore } from '@/stores/useSiteSettingsStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, HelpCircle, Upload, Eye, Type, Image, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';

const HEADER_STYLES = [
  {
    value: 'transparent',
    label: 'Transparent',
    description: 'Arrière-plan transparent qui se superpose au contenu'
  },
  {
    value: 'opaque',
    label: 'Opaque',
    description: 'Arrière-plan solide avec couleur de fond'
  },
  {
    value: 'gradient',
    label: 'Dégradé',
    description: 'Dégradé de couleurs personnalisé'
  }
];

export function HeaderSettingsSection() {
  const { formData, updateField, hasFieldError, getFieldError, clearError } = useSiteSettingsStore();
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const headerSettings = formData.header || {};

  const updateHeaderField = (field: string, value: any) => {
    const newHeaderSettings = {
      ...headerSettings,
      [field]: value
    };
    updateField('header', newHeaderSettings);
    clearError(`header.${field}`);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Le fichier doit être une image (JPG, PNG, WebP, etc.)');
        return;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert('La taille du fichier ne doit pas dépasser 10MB');
        return;
      }

      // Upload to Cloudinary via API
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'be-digital/logos');

      const response = await fetch('/api/admin/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'upload');
      }

      const result = await response.json();
      
      if (result.success && result.data?.url) {
        updateHeaderField('logoImageUrl', result.data.url);
      } else {
        throw new Error('Réponse invalide du serveur');
      }
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors de l\'upload de l\'image');
    } finally {
      setIsUploadingLogo(false);
    }

    // Reset input
    event.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Logo Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Configuration du logo</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Le logo apparaît dans le header et représente votre restaurant</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardDescription>
            Choisissez comment afficher le logo de votre restaurant
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo Type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Type de logo</Label>
            <RadioGroup
              value={headerSettings.logoType || 'text'}
              onValueChange={(value) => updateHeaderField('logoType', value)}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              <div className="flex items-center space-x-2 border rounded-lg p-3">
                <RadioGroupItem value="text" id="logo-text" />
                <div className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  <Label htmlFor="logo-text" className="text-sm">Texte</Label>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 border rounded-lg p-3">
                <RadioGroupItem value="image" id="logo-image" />
                <div className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  <Label htmlFor="logo-image" className="text-sm">Image</Label>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 border rounded-lg p-3">
                <RadioGroupItem value="both" id="logo-both" />
                <div className="flex items-center gap-2">
                  <div className="flex">
                    <Type className="h-4 w-4" />
                    <Image className="h-4 w-4 -ml-1" />
                  </div>
                  <Label htmlFor="logo-both" className="text-sm">Les deux</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Text Logo */}
          {(headerSettings.logoType === 'text' || headerSettings.logoType === 'both' || !headerSettings.logoType) && (
            <div className="space-y-2">
              <Label htmlFor="logo-text" className="text-sm font-medium">
                Texte du logo
              </Label>
              <Input
                id="logo-text"
                value={headerSettings.logoText || ''}
                onChange={(e) => updateHeaderField('logoText', e.target.value)}
                placeholder={headerSettings.logoText ? headerSettings.logoText : "Le nom de votre restaurant"}
                className={hasFieldError('header.logoText') ? 'border-red-500' : ''}
              />
              {hasFieldError('header.logoText') && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>{getFieldError('header.logoText')}</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Le nom de votre restaurant tel qu'il apparaîtra dans le header
              </p>
            </div>
          )}

          {/* Image Logo */}
          {(headerSettings.logoType === 'image' || headerSettings.logoType === 'both') && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Image du logo</Label>
                
                {/* Current Image Preview */}
                {headerSettings.logoImageUrl && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg bg-muted/50">
                    <img 
                      src={headerSettings.logoImageUrl} 
                      alt="Logo preview"
                      className="h-12 w-auto object-contain"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Logo actuel</p>
                      <p className="text-xs text-muted-foreground">
                        Cliquez sur "Changer" pour uploader une nouvelle image
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateHeaderField('logoImageUrl', '')}
                    >
                      Supprimer
                    </Button>
                  </div>
                )}

                {/* Upload Button */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('logo-upload')?.click()}
                    disabled={isUploadingLogo}
                  >
                    {isUploadingLogo ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    {isUploadingLogo ? 'Upload en cours...' : headerSettings.logoImageUrl ? 'Changer' : 'Uploader'} le logo
                  </Button>
                  
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />

                  {headerSettings.logoImageUrl && (
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Aperçu
                    </Button>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Formats acceptés: JPG, PNG, SVG. Taille recommandée: 200x60px
                </p>
              </div>

              {/* Alt Text for Image */}
              <div className="space-y-2">
                <Label htmlFor="logo-alt" className="text-sm font-medium">
                  Texte alternatif (accessibilité)
                </Label>
                <Textarea
                  id="logo-alt"
                  value={JSON.stringify(headerSettings.logoImageAlt || {})}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      updateHeaderField('logoImageAlt', parsed);
                    } catch (error) {
                      // Invalid JSON, ignore
                    }
                  }}
                  placeholder='{"fr": "Logo du restaurant", "en": "Restaurant logo"}'
                  rows={2}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Description du logo pour les lecteurs d'écran (format JSON multilingue)
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Header Style */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Style du header</CardTitle>
          <CardDescription>
            Personnalisez l'apparence et le comportement du header
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Header Style Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Style d'arrière-plan</Label>
            <RadioGroup
              value={headerSettings.headerStyle || 'transparent'}
              onValueChange={(value) => updateHeaderField('headerStyle', value)}
              className="space-y-3"
            >
              {HEADER_STYLES.map((style) => (
                <div key={style.value} className="flex items-center space-x-3 border rounded-lg p-3">
                  <RadioGroupItem value={style.value} id={`style-${style.value}`} />
                  <div className="flex-1">
                    <Label htmlFor={`style-${style.value}`} className="text-sm font-medium">
                      {style.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">{style.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Header Behavior */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Comportement</Label>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sticky-header" className="text-sm">Header fixe</Label>
                <p className="text-xs text-muted-foreground">
                  Le header reste visible lors du défilement
                </p>
              </div>
              <Switch
                id="sticky-header"
                checked={headerSettings.stickyHeader !== false}
                onCheckedChange={(checked) => updateHeaderField('stickyHeader', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Header Icons */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Icônes du header</CardTitle>
          <CardDescription>
            Choisissez quelles icônes afficher dans le header
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="show-search" className="text-sm">Icône recherche</Label>
                <p className="text-xs text-muted-foreground">
                  Afficher l'icône de recherche
                </p>
              </div>
              <Switch
                id="show-search"
                checked={headerSettings.showSearchIcon !== false}
                onCheckedChange={(checked) => updateHeaderField('showSearchIcon', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="show-user" className="text-sm">Icône utilisateur</Label>
                <p className="text-xs text-muted-foreground">
                  Afficher l'icône de connexion
                </p>
              </div>
              <Switch
                id="show-user"
                checked={headerSettings.showUserIcon !== false}
                onCheckedChange={(checked) => updateHeaderField('showUserIcon', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="show-cart" className="text-sm">Icône panier</Label>
                <p className="text-xs text-muted-foreground">
                  Afficher l'icône du panier
                </p>
              </div>
              <Switch
                id="show-cart"
                checked={headerSettings.showCartIcon !== false}
                onCheckedChange={(checked) => updateHeaderField('showCartIcon', checked)}
              />
            </div>

            {headerSettings.showCartIcon !== false && (
              <div className="space-y-2">
                <Label htmlFor="cart-badge" className="text-sm">Nombre d'articles</Label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <Input
                    id="cart-badge"
                    type="number"
                    min="0"
                    max="99"
                    value={headerSettings.cartBadgeCount || 0}
                    onChange={(e) => updateHeaderField('cartBadgeCount', parseInt(e.target.value))}
                    className="w-20"
                  />
                  <Badge variant="secondary" className="text-xs">
                    Pour les tests
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Nombre d'articles à afficher sur l'icône panier (développement)
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
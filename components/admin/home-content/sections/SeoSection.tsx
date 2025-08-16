'use client';

import { useHomeContentStore } from '@/stores/useHomeContentStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { MultilingualInput } from '@/components/admin/shared/MultilingualInput';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  AlertCircle, 
  HelpCircle, 
  Search,
  Globe,
  FileText,
  Tag,
  Info
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ImageUpload } from '@/components/admin/shared/ImageUpload';


export function SeoSection() {
  const { formData, updateField, hasFieldError, getFieldError, clearError } = useHomeContentStore();

  const seoData = formData.seo || {};

  const updateSeoField = (field: string, value: any) => {
    const newSeoData = {
      ...seoData,
      [field]: value
    };
    updateField('seo', newSeoData);
    clearError(`seo.${field}`);
  };


  // Character count helpers
  const getCharacterCount = (text: string) => text?.length || 0;
  const getTitleStatus = (length: number) => {
    if (length === 0) return { color: 'text-muted-foreground', message: 'Vide' };
    if (length < 30) return { color: 'text-orange-600', message: 'Trop court' };
    if (length <= 60) return { color: 'text-green-600', message: 'Optimal' };
    return { color: 'text-red-600', message: 'Trop long' };
  };

  const getDescriptionStatus = (length: number) => {
    if (length === 0) return { color: 'text-muted-foreground', message: 'Vide' };
    if (length < 120) return { color: 'text-orange-600', message: 'Trop court' };
    if (length <= 160) return { color: 'text-green-600', message: 'Optimal' };
    return { color: 'text-red-600', message: 'Trop long' };
  };

  return (
    <div className="space-y-6">
      {/* Activation */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Optimisation SEO</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Métadonnées pour améliorer le référencement de votre page d'accueil</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardDescription>
            Configuration des métadonnées pour le référencement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="seo-active" className="text-sm font-medium">
                Métadonnées personnalisées
              </Label>
              <p className="text-xs text-muted-foreground">
                Utiliser des métadonnées spécifiques pour la page d'accueil
              </p>
            </div>
            <Switch
              id="seo-active"
              checked={seoData.customMetadata ?? true}
              onCheckedChange={(checked) => updateSeoField('customMetadata', checked)}
            />
          </div>

          {!seoData.customMetadata && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Métadonnées automatiques</p>
                  <p>
                    Les métadonnées seront générées automatiquement à partir du contenu de la bannière hero et des réglages du site.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Métadonnées personnalisées */}
      {seoData.customMetadata !== false && (
        <>
          {/* Titre SEO */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <CardTitle className="text-lg">Titre SEO</CardTitle>
              </div>
              <CardDescription>
                Titre affiché dans les résultats de recherche (30-60 caractères recommandés)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <MultilingualInput
                value={seoData.metaTitle || {}}
                onChange={(newTitle) => {
                  updateSeoField('metaTitle', newTitle);
                }}
                placeholder="Titre SEO (ex: Restaurant Be Digital - Burgers frais)"
                type="input"
              />
              {hasFieldError('seo.metaTitle') && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>{getFieldError('seo.metaTitle')}</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                💡 Recommandation : 30-60 caractères pour un affichage optimal dans les résultats de recherche
              </p>
            </CardContent>
          </Card>

          {/* Description SEO */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <CardTitle className="text-lg">Description SEO</CardTitle>
              </div>
              <CardDescription>
                Description affichée dans les résultats de recherche (120-160 caractères recommandés)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <MultilingualInput
                value={seoData.metaDescription || {}}
                onChange={(newDescription) => {
                  updateSeoField('metaDescription', newDescription);
                }}
                placeholder="Description SEO (ex: Découvrez nos burgers artisanaux...)"
                type="textarea"
                rows={3}
              />
              {hasFieldError('seo.metaDescription') && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>{getFieldError('seo.metaDescription')}</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                💡 Recommandation : 120-160 caractères pour une description complète sans être tronquée
              </p>
            </CardContent>
          </Card>

          {/* Mots-clés */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <CardTitle className="text-lg">Mots-clés</CardTitle>
              </div>
              <CardDescription>
                Mots-clés principaux séparés par des virgules (optionnel)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <MultilingualInput
                value={seoData.keywords || {}}
                onChange={(newKeywords) => {
                  updateSeoField('keywords', newKeywords);
                }}
                placeholder="Mots-clés séparés par des virgules (ex: restaurant, burger, livraison)"
                type="input"
              />
              <p className="text-xs text-muted-foreground">
                💡 Utilisez des mots-clés pertinents séparés par des virgules
              </p>
            </CardContent>
          </Card>

          {/* URL canonique */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <CardTitle className="text-lg">URL Canonique</CardTitle>
              </div>
              <CardDescription>
                URL principale de votre page d'accueil (optionnel, par défaut utilisera l'URL du site)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">URL canonique</Label>
                <Input
                  value={seoData.canonicalUrl || ''}
                  onChange={(e) => updateSeoField('canonicalUrl', e.target.value)}
                  placeholder="https://www.votresite.com"
                  type="url"
                />
                <p className="text-xs text-muted-foreground">
                  Laissez vide pour utiliser l'URL automatique du site
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Open Graph */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Réseaux sociaux (Open Graph)</CardTitle>
              <CardDescription>
                Métadonnées pour l'affichage sur les réseaux sociaux
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">
                    Utiliser les métadonnées pour les réseaux sociaux
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Active l'optimisation pour Facebook, Twitter, LinkedIn, etc.
                  </p>
                </div>
                <Switch
                  checked={seoData.enableOpenGraph ?? true}
                  onCheckedChange={(checked) => updateSeoField('enableOpenGraph', checked)}
                />
              </div>

              {seoData.enableOpenGraph !== false && (
                <div className="space-y-4 pt-4 border-t">
                  {/* Image Open Graph */}
                  <ImageUpload
                    title="Image pour réseaux sociaux"
                    description="Image affichée lorsque votre page est partagée sur les réseaux sociaux"
                    currentImageUrl={seoData.ogImage}
                    onImageChange={(imageUrl) => updateSeoField('ogImage', imageUrl)}
                    onRemove={() => updateSeoField('ogImage', '')}
                    recommendedSize="1200x630px"
                    aspectRatio="1200/630"
                    placeholder="Image Open Graph non définie"
                    showAltText={false}
                    acceptedFormats="JPG, PNG, WebP"
                  />

                  {/* Type de contenu */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Type de contenu</Label>
                    <Input
                      value={seoData.ogType || 'website'}
                      onChange={(e) => updateSeoField('ogType', e.target.value)}
                      placeholder="website"
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      Valeur par défaut pour une page d'accueil
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Conseils SEO */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-lg text-blue-800">Conseils SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-blue-700">
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2"></div>
            <p>
              <strong>Titre :</strong> Incluez votre nom de marque et vos mots-clés principaux
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2"></div>
            <p>
              <strong>Description :</strong> Soyez descriptif et incluez un appel à l'action
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2"></div>
            <p>
              <strong>Mots-clés :</strong> Choisissez 3-5 mots-clés pertinents pour votre activité
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2"></div>
            <p>
              <strong>Unicité :</strong> Chaque page doit avoir des métadonnées uniques
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
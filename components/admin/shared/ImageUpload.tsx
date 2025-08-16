'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Eye, Trash2, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  title: string;
  description?: string;
  currentImageUrl?: string;
  altText?: Record<string, string>;
  onImageChange: (imageUrl: string) => void;
  onAltTextChange?: (altText: Record<string, string>) => void;
  onRemove: () => void;
  recommendedSize?: string;
  acceptedFormats?: string;
  aspectRatio?: string;
  className?: string;
  supportedLanguages?: string[];
  showAltText?: boolean;
  placeholder?: string;
}

const SUPPORTED_LANGUAGES = ['fr', 'en', 'es']; // TODO: Get from settings

export function ImageUpload({
  title,
  description,
  currentImageUrl,
  altText = {},
  onImageChange,
  onAltTextChange,
  onRemove,
  recommendedSize = "1200x630px",
  acceptedFormats = "JPG, PNG, WebP",
  aspectRatio = "auto",
  className = "",
  supportedLanguages = SUPPORTED_LANGUAGES,
  showAltText = true,
  placeholder = "Image non définie"
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const uploadId = `upload-${Math.random().toString(36).substr(2, 9)}`;

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Le fichier doit être une image (JPG, PNG, WebP, etc.)');
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('La taille du fichier ne doit pas dépasser 10MB');
      }

      // Upload to Cloudinary via API
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'be-digital/home-content');

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
        onImageChange(result.data.url);
      } else {
        throw new Error('Réponse invalide du serveur');
      }
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors de l\'upload de l\'image');
    } finally {
      setIsUploading(false);
    }

    // Reset input
    event.target.value = '';
  };

  const handleAltTextChange = (lang: string, value: string) => {
    if (onAltTextChange) {
      const newAltText = {
        ...altText,
        [lang]: value
      };
      onAltTextChange(newAltText);
    }
  };

  const handlePreview = () => {
    if (currentImageUrl) {
      window.open(currentImageUrl, '_blank');
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Image Preview */}
        {currentImageUrl ? (
          <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
            <div 
              className="flex-shrink-0 border rounded-md overflow-hidden bg-white"
              style={{ aspectRatio }}
            >
              <img 
                src={currentImageUrl} 
                alt={altText.fr || altText.en || "Image preview"}
                className="w-20 h-12 object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Image actuelle</p>
              <p className="text-xs text-muted-foreground truncate">
                {currentImageUrl}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePreview}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onRemove}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-1">
              {placeholder}
            </p>
            <p className="text-xs text-muted-foreground">
              Cliquez sur "Uploader" pour ajouter une image
            </p>
          </div>
        )}

        {/* Upload Button */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => document.getElementById(uploadId)?.click()}
            disabled={isUploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Upload en cours...' : currentImageUrl ? 'Changer' : 'Uploader'}
          </Button>
          
          <input
            id={uploadId}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />

          {currentImageUrl && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handlePreview}
            >
              <Eye className="h-4 w-4 mr-2" />
              Aperçu
            </Button>
          )}
        </div>
        
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Formats acceptés: {acceptedFormats}</p>
          <p>• Taille recommandée: {recommendedSize}</p>
          <p>• Upload avec Cloudinary - Optimisation automatique</p>
        </div>

        {/* Alt Text (optional) */}
        {showAltText && currentImageUrl && (
          <div className="space-y-3 pt-4 border-t">
            <Label className="text-sm font-medium">
              Texte alternatif (accessibilité)
            </Label>
            {supportedLanguages.map((lang) => {
              const languageNames: Record<string, string> = {
                fr: 'Français',
                en: 'English',
                es: 'Español',
              };
              
              return (
                <div key={lang} className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    {languageNames[lang]}
                  </Label>
                  <Input
                    value={altText[lang] || ''}
                    onChange={(e) => handleAltTextChange(lang, e.target.value)}
                    placeholder={
                      lang === 'fr' ? 'Description de l\'image pour les lecteurs d\'écran' :
                      lang === 'en' ? 'Image description for screen readers' :
                      'Descripción de la imagen para lectores de pantalla'
                    }
                    className="text-sm"
                  />
                </div>
              );
            })}
            <p className="text-xs text-muted-foreground">
              Le texte alternatif améliore l'accessibilité et le référencement
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
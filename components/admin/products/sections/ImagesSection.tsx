'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ImageIcon, Plus, X, Star, Upload, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

import { useProductForm } from '../ProductFormContext';
import { ImageUpload } from '@/components/admin/shared/ImageUpload';

interface ProductImage {
  id?: string;
  url: string;
  altText: Record<string, string>;
  isMain: boolean;
  displayOrder: number;
}

export function ImagesSection() {
  const { updateField, state, hasFieldError, getFieldError } = useProductForm();
  const [isUploading, setIsUploading] = useState(false);

  // Get current images from form data
  const images: ProductImage[] = state.formData.images || [];
  const mainImageUrl = state.formData.imageUrl || '';
  const imageError = hasFieldError('imageUrl') ? getFieldError('imageUrl') : null;

  // Handle main image upload
  const handleMainImageUpload = (url: string) => {
    updateField('imageUrl', url);
    
    // If this is the first image, also add it to the images array
    if (images.length === 0) {
      const newImage: ProductImage = {
        url,
        altText: {},
        isMain: true,
        displayOrder: 0,
      };
      updateField('images', [newImage]);
    } else {
      // Update existing main image or add if not exists
      const updatedImages = images.map(img => ({ ...img, isMain: false }));
      const mainImageIndex = updatedImages.findIndex(img => img.url === url);
      
      if (mainImageIndex >= 0) {
        updatedImages[mainImageIndex].isMain = true;
      } else {
        updatedImages.unshift({
          url,
          altText: {},
          isMain: true,
          displayOrder: 0,
        });
      }
      
      updateField('images', updatedImages);
    }
  };

  // Handle main image alt text change
  const handleMainImageAltChange = (altText: Record<string, string>) => {
    updateField('imageAlt', altText);
    
    // Also update in images array if exists
    const updatedImages = images.map(img => 
      img.url === mainImageUrl ? { ...img, altText } : img
    );
    updateField('images', updatedImages);
  };

  // Handle additional image upload
  const handleAdditionalImageUpload = async (file: File) => {
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'be-digital/products');

      const response = await fetch('/api/admin/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement de l\'image');
      }

      const result = await response.json();
      
      const newImage: ProductImage = {
        url: result.data.secure_url,
        altText: {},
        isMain: false,
        displayOrder: images.length,
      };

      updateField('images', [...images, newImage]);
      toast.success('Image ajoutée avec succès');
      
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Erreur lors du téléchargement de l\'image');
    } finally {
      setIsUploading(false);
    }
  };

  // Remove image from gallery
  const removeImage = (index: number) => {
    const imageToRemove = images[index];
    const updatedImages = images.filter((_, i) => i !== index);
    
    // If removing main image, clear main image URL
    if (imageToRemove?.isMain) {
      updateField('imageUrl', '');
      updateField('imageAlt', {});
    }
    
    updateField('images', updatedImages);
    toast.success('Image supprimée');
  };

  // Set image as main
  const setAsMainImage = (index: number) => {
    const selectedImage = images[index];
    
    // Update main image URL
    updateField('imageUrl', selectedImage.url);
    updateField('imageAlt', selectedImage.altText);
    
    // Update images array
    const updatedImages = images.map((img, i) => ({
      ...img,
      isMain: i === index,
    }));
    
    updateField('images', updatedImages);
    toast.success('Image principale mise à jour');
  };

  // Update image alt text
  const updateImageAlt = (index: number, altText: Record<string, string>) => {
    const updatedImages = images.map((img, i) => 
      i === index ? { ...img, altText } : img
    );
    
    updateField('images', updatedImages);
    
    // If this is the main image, also update main image alt
    if (images[index]?.isMain) {
      updateField('imageAlt', altText);
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Product Image */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Image principale *
          </CardTitle>
          <CardDescription>
            Image principale qui apparaîtra en premier dans le catalogue (obligatoire)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {imageError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {imageError}
              </AlertDescription>
            </Alert>
          )}
          
          <ImageUpload
            title="Image principale du produit"
            description="Cette image représentera votre produit dans les listes et sur la page de détail"
            currentImageUrl={mainImageUrl}
            altText={state.formData.imageAlt || {}}
            onImageChange={handleMainImageUpload}
            onAltTextChange={handleMainImageAltChange}
            onRemove={() => {
              updateField('imageUrl', '');
              updateField('imageAlt', {});
            }}
            recommendedSize="800x600px"
            aspectRatio="4/3"
            error={!!imageError}
          />
        </CardContent>
      </Card>

      {/* Additional Images Gallery */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Galerie d'images
          </CardTitle>
          <CardDescription>
            Images supplémentaires pour présenter votre produit sous différents angles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Zone */}
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                files.forEach(file => handleAdditionalImageUpload(file));
              }}
              className="hidden"
              id="additional-images"
              disabled={isUploading}
            />
            <label
              htmlFor="additional-images"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div className="text-sm">
                <span className="font-medium">Cliquez pour ajouter des images</span>
                <span className="text-muted-foreground"> ou glissez-déposez ici</span>
              </div>
              <div className="text-xs text-muted-foreground">
                PNG, JPG, GIF jusqu'à 10MB
              </div>
            </label>
          </div>

          {/* Images Grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative group border rounded-lg overflow-hidden"
                >
                  <img
                    src={image.url}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-32 object-cover"
                  />
                  
                  {/* Image overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {!image.isMain && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setAsMainImage(index)}
                      >
                        <Star className="h-3 w-3" />
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Main image badge */}
                  {image.isMain && (
                    <Badge className="absolute top-2 left-2 bg-yellow-500 text-black">
                      <Star className="h-3 w-3 mr-1" />
                      Principal
                    </Badge>
                  )}

                  {/* Display order */}
                  <Badge variant="outline" className="absolute top-2 right-2 bg-white">
                    {index + 1}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {/* Images Summary */}
          {images.length > 0 && (
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between text-sm">
                <span>Total des images</span>
                <Badge variant="secondary">{images.length} image{images.length > 1 ? 's' : ''}</Badge>
              </div>
              
              <div className="mt-2 text-xs text-muted-foreground">
                L'image principale sera utilisée dans les aperçus et les listes de produits.
                Les images supplémentaires seront affichées dans la galerie du produit.
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Recommandations pour les images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
            <span>Utilisez des images haute résolution (minimum 800x600px)</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
            <span>Privilégiez un format 4:3 pour un affichage optimal</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
            <span>Ajoutez du texte alternatif pour l'accessibilité</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
            <span>L'image principale sera redimensionnée automatiquement</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
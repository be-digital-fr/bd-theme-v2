'use client';

import { useState, useRef } from 'react';
import { FieldWrapper } from '../FieldWrapper';

import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ImageFieldProps {
  field: SanityFieldConfig;
  form: UseFormReturn<any>;
  disabled?: boolean;
}

export function ImageField({ field, form, disabled }: ImageFieldProps) {
  const { setValue, watch, formState: { errors } } = form;
  const value = watch(field.name);
  const error = errors[field.name]?.message as string;
  
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value?.url || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation du type
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image');
      return;
    }

    // Validation de la taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 5MB');
      return;
    }

    // Créer un aperçu local
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload vers Cloudinary
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'be-digital/admin');

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de l\'upload');
      }

      const data = await response.json();
      
      // Mettre à jour la valeur du formulaire
      setValue(field.name, {
        url: data.url,
        publicId: data.publicId,
        width: data.width,
        height: data.height,
        format: data.format,
        // Conserver les autres champs comme alt
        ...(value || {}),
        asset: {
          _ref: data.publicId,
          _type: 'reference',
        }
      });
    } catch (error) {
      console.error('Erreur upload:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors de l\'upload');
      setPreview(value?.url || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setValue(field.name, null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <FieldWrapper
      name={field.name}
      title={field.title}
      description={field.description}
      error={error}
      required={field.validation?.required}
    >
      <div className="space-y-4">
        {/* Zone d'upload / aperçu */}
        <div 
          className={cn(
            "relative border-2 border-dashed rounded-lg p-6 transition-colors",
            preview ? "border-gray-300" : "border-gray-300 hover:border-gray-400",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {preview ? (
            <div className="relative">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={preview}
                  alt={value?.alt || "Aperçu de l'image"}
                  fill
                  className="object-contain"
                />
              </div>
              
              {!disabled && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleRemove}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label
                  htmlFor={field.name}
                  className={cn(
                    "cursor-pointer",
                    disabled && "cursor-not-allowed"
                  )}
                >
                  <span className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    <Upload className="h-4 w-4" />
                    Choisir une image
                  </span>
                  <input
                    ref={fileInputRef}
                    id={field.name}
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={disabled || isUploading}
                  />
                </label>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                PNG, JPG, GIF jusqu'à 5MB
              </p>
            </div>
          )}

          {/* Indicateur de chargement */}
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Upload en cours...</span>
              </div>
            </div>
          )}
        </div>

        {/* Champ alt text si l'image a un champ alt */}
        {value?.url && field.fields?.find(f => f.name === 'alt') && (
          <div className="space-y-2">
            <label htmlFor={`${field.name}.alt`} className="text-sm font-medium">
              Texte alternatif
            </label>
            <input
              id={`${field.name}.alt`}
              type="text"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={value?.alt || ''}
              onChange={(e) => setValue(`${field.name}.alt`, e.target.value)}
              placeholder="Description de l'image pour l'accessibilité"
              disabled={disabled}
            />
          </div>
        )}
      </div>
    </FieldWrapper>
  );
}
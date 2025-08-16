'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FieldWrapper } from '../FieldWrapper';

import { UseFormReturn } from 'react-hook-form';
import { RefreshCw } from 'lucide-react';

interface SlugFieldProps {
  field: SanityFieldConfig;
  form: UseFormReturn<any>;
  disabled?: boolean;
}

// Fonction pour générer un slug à partir d'un texte
function generateSlug(text: any): string {
  // S'assurer que text est une chaîne
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  return text
    .toLowerCase()
    .trim()
    // Remplacer les caractères accentués
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Remplacer les espaces et caractères spéciaux par des tirets
    .replace(/[^a-z0-9]+/g, '-')
    // Supprimer les tirets en début et fin
    .replace(/^-+|-+$/g, '')
    // Limiter à un seul tiret consécutif
    .replace(/-+/g, '-');
}

export function SlugField({ field, form, disabled }: SlugFieldProps) {
  const { register, setValue, watch, formState: { errors } } = form;
  const value = watch(field.name);
  const error = errors[field.name]?.message as string;
  
  // État local pour le slug
  const [slug, setSlug] = useState(value?.current || '');
  const [isEditing, setIsEditing] = useState(false);
  
  // Champ source pour la génération automatique (généralement 'title' ou 'name')
  const sourceField = field.options?.source || 'title';
  const sourceValue = watch(sourceField);

  // Mettre à jour le slug quand la valeur du formulaire change
  useEffect(() => {
    setSlug(value?.current || '');
  }, [value?.current]);

  // Générer automatiquement le slug à partir du champ source
  useEffect(() => {
    if (!isEditing && sourceValue && !slug) {
      // Si sourceValue est un objet multilingue, prendre la valeur française
      let textValue = sourceValue;
      if (typeof sourceValue === 'object' && sourceValue.fr) {
        textValue = sourceValue.fr;
      }
      
      const generatedSlug = generateSlug(textValue);
      if (generatedSlug) {
        setSlug(generatedSlug);
        setValue(field.name, { current: generatedSlug, _type: 'slug' });
      }
    }
  }, [sourceValue, isEditing, slug, setValue, field.name]);

  const handleSlugChange = (newSlug: string) => {
    const cleanSlug = generateSlug(newSlug);
    setSlug(cleanSlug);
    setValue(field.name, { current: cleanSlug, _type: 'slug' });
    setIsEditing(true);
  };

  const handleRegenerate = () => {
    if (sourceValue) {
      // Si sourceValue est un objet multilingue, prendre la valeur française
      let textValue = sourceValue;
      if (typeof sourceValue === 'object' && sourceValue.fr) {
        textValue = sourceValue.fr;
      }
      
      const generatedSlug = generateSlug(textValue);
      if (generatedSlug) {
        setSlug(generatedSlug);
        setValue(field.name, { current: generatedSlug, _type: 'slug' });
        setIsEditing(false);
      }
    }
  };

  return (
    <FieldWrapper
      name={field.name}
      title={field.title}
      description={field.description || 'URL conviviale générée automatiquement'}
      error={error}
      required={field.validation?.required}
    >
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            id={field.name}
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            onFocus={() => setIsEditing(true)}
            disabled={disabled || field.readOnly}
            placeholder="url-de-la-page"
            className="w-full pr-8"
          />
          {field.options?.urlPrefix && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-muted-foreground text-sm">
                {field.options.urlPrefix}/
              </span>
            </div>
          )}
        </div>
        
        {sourceValue && !field.readOnly && !disabled && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleRegenerate}
            title="Régénérer à partir du titre"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {slug && (
        <p className="text-xs text-muted-foreground mt-1">
          URL finale : {field.options?.urlPrefix || ''}/{slug}
        </p>
      )}
    </FieldWrapper>
  );
}
'use client';


import { UseFormReturn } from 'react-hook-form';

// Import field components
import { StringField } from './field-types/StringField';
import { TextField } from './field-types/TextField';
import { BooleanField } from './field-types/BooleanField';
import { SelectField } from './field-types/SelectField';
import { NumberField } from './field-types/NumberField';
import { MultilingualStringField } from './field-types/MultilingualStringField';
import { ArrayField } from './field-types/ArrayField';
import { ObjectField } from './field-types/ObjectField';
import { ImageField } from './field-types/ImageField';
import { MultiSelectField } from './field-types/MultiSelectField';
import { SlugField } from './field-types/SlugField';
import { ArrayDialogField } from './field-types/ArrayDialogField';

interface DynamicFieldProps {
  field: SanityFieldConfig;
  form: UseFormReturn<any>;
  disabled?: boolean;
}

export function DynamicField({ field, form, disabled }: DynamicFieldProps) {
  const { watch } = form;
  
  // Vérifier si le champ doit être caché
  const formData = watch();
  const shouldHide = SanitySchemaService.isFieldHidden(field, formData);
  
  if (shouldHide) {
    return null;
  }

  // Rendu du champ selon son type
  switch (field.type) {
    case 'string':
      if (field.options?.list) {
        return <SelectField field={field} form={form} disabled={disabled} />;
      }
      return <StringField field={field} form={form} disabled={disabled} />;
      
    case 'text':
      return <TextField field={field} form={form} disabled={disabled} />;
      
    case 'number':
      return <NumberField field={field} form={form} disabled={disabled} />;
      
    case 'boolean':
      return <BooleanField field={field} form={form} disabled={disabled} />;
      
    case 'autoMultilingualString':
    case 'multilingualString':
      return <MultilingualStringField field={field} form={form} disabled={disabled} />;
      
    case 'autoMultilingualText':
    case 'multilingualText':
      return <MultilingualStringField field={field} form={form} disabled={disabled} />;
      
    case 'array':
      // Si c'est un array de strings simples (comme pour les langues), utiliser MultiSelectField
      if (field.of?.[0]?.type === 'string' && !field.of[0].fields) {
        return <MultiSelectField field={field} form={form} disabled={disabled} />;
      }
      // Si c'est un array d'objets, utiliser ArrayDialogField
      if (field.of?.[0]?.type === 'object' && field.of[0].fields) {
        return <ArrayDialogField field={field} form={form} disabled={disabled} />;
      }
      // Sinon, utiliser ArrayField par défaut
      return <ArrayField field={field} form={form} disabled={disabled} />;
      
    case 'object':
      return <ObjectField field={field} form={form} disabled={disabled} />;
      
    case 'image':
      return <ImageField field={field} form={form} disabled={disabled} />;
      
    case 'slug':
      return <SlugField field={field} form={form} disabled={disabled} />;
      
    default:
      return <div className="p-4 border border-dashed rounded-md text-center text-muted-foreground">
        Type de champ non supporté: {field.type}
      </div>;
  }
}
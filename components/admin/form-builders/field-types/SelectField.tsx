'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FieldWrapper } from '../FieldWrapper';

import { UseFormReturn } from 'react-hook-form';
import { AVAILABLE_LANGUAGES } from '@/lib/constants/languages';

interface SelectFieldProps {
  field: SanityFieldConfig;
  form: UseFormReturn<any>;
  disabled?: boolean;
}

export function SelectField({ field, form, disabled }: SelectFieldProps) {
  const { setValue, watch, formState: { errors } } = form;
  const value = watch(field.name);
  const error = errors[field.name]?.message as string;

  // Pour les champs de langue, utiliser notre liste complète
  const isLanguageField = field.name.includes('Language');
  const options = isLanguageField && !field.options?.list
    ? AVAILABLE_LANGUAGES.map(lang => ({
        title: `${lang.flag} ${lang.name}`,
        value: lang.code
      }))
    : field.options?.list || [];

  if (options.length === 0) {
    return null;
  }

  return (
    <FieldWrapper
      name={field.name}
      title={field.title}
      description={field.description}
      error={error}
      required={field.validation?.required}
    >
      <Select
        value={value || ''}
        onValueChange={(newValue) => setValue(field.name, newValue)}
        disabled={disabled || field.readOnly}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={`Sélectionner ${field.title.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldWrapper>
  );
}
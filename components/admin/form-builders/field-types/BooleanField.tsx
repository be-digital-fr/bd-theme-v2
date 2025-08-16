'use client';

import { Switch } from '@/components/ui/switch';
import { FieldWrapper } from '../FieldWrapper';

import { UseFormReturn } from 'react-hook-form';

interface BooleanFieldProps {
  field: SanityFieldConfig;
  form: UseFormReturn<any>;
  disabled?: boolean;
}

export function BooleanField({ field, form, disabled }: BooleanFieldProps) {
  const { setValue, watch, formState: { errors } } = form;
  const value = watch(field.name);
  const error = errors[field.name]?.message as string;

  return (
    <div className="space-y-2">
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 flex items-center gap-3">
        <Switch
          id={field.name}
          checked={value || false}
          onCheckedChange={(checked) => setValue(field.name, checked)}
          disabled={disabled || field.readOnly}
        />
        <label 
          htmlFor={field.name}
          className="text-sm font-medium text-gray-900 cursor-pointer select-none"
        >
          {field.title}
          {field.validation?.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
      {field.description && (
        <p className="text-xs text-muted-foreground px-1">{field.description}</p>
      )}
    </div>
  );
}
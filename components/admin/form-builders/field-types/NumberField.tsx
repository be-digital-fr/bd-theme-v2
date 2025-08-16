'use client';

import { Input } from '@/components/ui/input';
import { FieldWrapper } from '../FieldWrapper';

import { UseFormReturn } from 'react-hook-form';

interface NumberFieldProps {
  field: SanityFieldConfig;
  form: UseFormReturn<any>;
  disabled?: boolean;
}

export function NumberField({ field, form, disabled }: NumberFieldProps) {
  const { register, formState: { errors } } = form;
  const error = errors[field.name]?.message as string;

  return (
    <FieldWrapper
      name={field.name}
      title={field.title}
      description={field.description}
      error={error}
      required={field.validation?.required}
    >
      <Input
        id={field.name}
        type="number"
        {...register(field.name, { 
          valueAsNumber: true,
          min: field.validation?.min,
          max: field.validation?.max,
        })}
        disabled={disabled || field.readOnly}
        placeholder={field.title}
        className="w-full"
        min={field.validation?.min}
        max={field.validation?.max}
      />
    </FieldWrapper>
  );
}
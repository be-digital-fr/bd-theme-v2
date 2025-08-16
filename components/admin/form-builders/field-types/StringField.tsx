'use client';

import { Input } from '@/components/ui/input';
import { FieldWrapper } from '../FieldWrapper';

import { UseFormReturn } from 'react-hook-form';

interface StringFieldProps {
  field: SanityFieldConfig;
  form: UseFormReturn<any>;
  disabled?: boolean;
}

export function StringField({ field, form, disabled }: StringFieldProps) {
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
        {...register(field.name)}
        disabled={disabled || field.readOnly}
        placeholder={field.title}
        className="w-full"
      />
    </FieldWrapper>
  );
}
'use client';

import { Textarea } from '@/components/ui/textarea';
import { FieldWrapper } from '../FieldWrapper';

import { UseFormReturn } from 'react-hook-form';

interface TextFieldProps {
  field: SanityFieldConfig;
  form: UseFormReturn<any>;
  disabled?: boolean;
}

export function TextField({ field, form, disabled }: TextFieldProps) {
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
      <Textarea
        id={field.name}
        {...register(field.name)}
        disabled={disabled || field.readOnly}
        placeholder={field.title}
        className="w-full min-h-[100px] resize-vertical"
      />
    </FieldWrapper>
  );
}
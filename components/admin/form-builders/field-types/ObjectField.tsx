'use client';

import { FieldWrapper } from '../FieldWrapper';
import { DynamicField } from '../DynamicField';

import { UseFormReturn } from 'react-hook-form';

interface ObjectFieldProps {
  field: SanityFieldConfig;
  form: UseFormReturn<any>;
  disabled?: boolean;
}

export function ObjectField({ field, form, disabled }: ObjectFieldProps) {
  const { formState: { errors } } = form;
  const error = errors[field.name]?.message as string;

  if (!field.fields) {
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
      <div className="space-y-4">
        {field.fields.map((subField) => (
          <DynamicField
            key={subField.name}
            field={{
              ...subField,
              name: `${field.name}.${subField.name}`,
            }}
            form={form}
            disabled={disabled}
          />
        ))}
      </div>
    </FieldWrapper>
  );
}
// Types pour les champs Sanity/form builders

interface SanityFieldConfig {
  name: string;
  type: string;
  title?: string;
  description?: string;
  readOnly?: boolean;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    regex?: string;
  };
  options?: {
    list?: Array<{ title: string; value: any }>;
    layout?: 'radio' | 'dropdown';
  };
  fields?: SanityFieldConfig[];
}

interface SanitySchemaService {
  isFieldHidden(field: SanityFieldConfig, formData: any): boolean;
}

declare global {
  const SanitySchemaService: SanitySchemaService;
}

export type { SanityFieldConfig };
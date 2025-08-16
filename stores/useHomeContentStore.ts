import { create } from 'zustand';
import { UpdateHomeContentDto } from '@/features/home-content/domain/entities/HomeContent';

interface HomeContentState {
  formData: Record<string, any>;
  originalData: Record<string, any>;
  hasChanges: boolean;
  isValid: boolean;
  errors: Record<string, string>;
  isSaving: boolean;
  lastSaved: Date | null;
}

interface HomeContentActions {
  updateField: (field: string, value: any) => void;
  setFormData: (data: Record<string, any>) => void;
  setOriginalData: (data: Record<string, any>) => void;
  setErrors: (errors: Record<string, string>) => void;
  clearError: (field: string) => void;
  setSaving: (saving: boolean) => void;
  setValid: (valid: boolean) => void;
  resetToOriginal: () => void;
  markSaved: () => void;
  getFormattedData: () => UpdateHomeContentDto;
  hasFieldError: (field: string) => boolean;
  getFieldError: (field: string) => string | undefined;
}

interface HomeContentStore extends HomeContentState, HomeContentActions {}

const initialState: HomeContentState = {
  formData: {},
  originalData: {},
  hasChanges: false,
  isValid: true,
  errors: {},
  isSaving: false,
  lastSaved: null,
};

export const useHomeContentStore = create<HomeContentStore>((set, get) => ({
  ...initialState,

  updateField: (field: string, value: any) => {
    const { originalData } = get();
    const newFormData = {
      ...get().formData,
      [field]: value,
    };
    set({
      formData: newFormData,
      hasChanges: JSON.stringify(newFormData) !== JSON.stringify(originalData),
    });
  },

  setFormData: (data: Record<string, any>) => {
    const { originalData } = get();
    set({
      formData: data,
      hasChanges: JSON.stringify(data) !== JSON.stringify(originalData),
    });
  },

  setOriginalData: (data: Record<string, any>) => {
    set({
      originalData: data,
      formData: data,
      hasChanges: false,
    });
  },

  setErrors: (errors: Record<string, string>) => {
    set({
      errors,
      isValid: Object.keys(errors).length === 0,
    });
  },

  clearError: (field: string) => {
    const { errors } = get();
    const newErrors = { ...errors };
    delete newErrors[field];
    set({
      errors: newErrors,
      isValid: Object.keys(newErrors).length === 0,
    });
  },

  setSaving: (saving: boolean) => {
    set({ isSaving: saving });
  },

  setValid: (valid: boolean) => {
    set({ isValid: valid });
  },

  resetToOriginal: () => {
    const { originalData } = get();
    set({
      formData: { ...originalData },
      hasChanges: false,
      errors: {},
      isValid: true,
    });
  },

  markSaved: () => {
    const { formData } = get();
    set({
      originalData: { ...formData },
      hasChanges: false,
      isSaving: false,
      lastSaved: new Date(),
    });
  },

  getFormattedData: (): UpdateHomeContentDto => {
    const { formData } = get();
    
    return {
      heroBanner: formData.hero ? {
        isActive: formData.hero.isActive ?? true,
        heroTitle: formData.hero.heroTitle || {},
        heroDescription: formData.hero.heroDescription || {},
        primaryButtonText: formData.hero.primaryButtonText || {},
        primaryButtonUrl: formData.hero.primaryButtonUrl || '/order',
        secondaryButtonText: formData.hero.secondaryButtonText || {},
        secondaryButtonUrl: formData.hero.secondaryButtonUrl || '/menu',
        heroImageDesktop: formData.hero.heroImageDesktop || undefined,
        heroImageMobile: formData.hero.heroImageMobile || undefined,
        heroImageAlt: formData.hero.heroImageAlt || undefined,
        backgroundImageDesktop: formData.hero.backgroundImageDesktop || undefined,
        backgroundImageMobile: formData.hero.backgroundImageMobile || undefined,
      } : undefined,
      featuresSection: formData.features ? {
        isActive: formData.features.isActive ?? true,
        featureItems: (formData.features.services || []).map((item: any, index: number) => ({
          title: item.title || {},
          iconUrl: item.iconUrl || '',
          order: item.order ?? index + 1,
        })),
      } : undefined,
      seoMetadata: formData.seo ? {
        seoTitle: formData.seo.seoTitle || undefined,
        seoDescription: formData.seo.seoDescription || undefined,
      } : undefined,
    };
  },

  hasFieldError: (field: string) => {
    const { errors } = get();
    return field in errors;
  },

  getFieldError: (field: string) => {
    const { errors } = get();
    return errors[field];
  },
}));
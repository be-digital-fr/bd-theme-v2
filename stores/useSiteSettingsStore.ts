import { create } from 'zustand';
import { UpdateSiteSettingsDto } from '@/features/settings/domain/entities/SiteSettings';

// Types
interface SiteSettingsState {
  formData: Record<string, any>;
  originalData: Record<string, any>;
  hasChanges: boolean;
  isValid: boolean;
  errors: Record<string, string>;
  isSaving: boolean;
  lastSaved: Date | null;
}

interface SiteSettingsActions {
  // Field operations
  updateField: (field: string, value: any) => void;
  setFormData: (data: Record<string, any>) => void;
  setOriginalData: (data: Record<string, any>) => void;
  
  // Error management
  setErrors: (errors: Record<string, string>) => void;
  clearError: (field: string) => void;
  hasFieldError: (field: string) => boolean;
  getFieldError: (field: string) => string | undefined;
  
  // State management
  setSaving: (saving: boolean) => void;
  setValid: (valid: boolean) => void;
  resetToOriginal: () => void;
  markSaved: () => void;
  
  // Data formatting
  getFormattedData: () => UpdateSiteSettingsDto;
  
  // Reset store
  reset: () => void;
}

interface SiteSettingsStore extends SiteSettingsState, SiteSettingsActions {}

// Initial state
const initialState: SiteSettingsState = {
  formData: {},
  originalData: {},
  hasChanges: false,
  isValid: true,
  errors: {},
  isSaving: false,
  lastSaved: null,
};

export const useSiteSettingsStore = create<SiteSettingsStore>((set, get) => ({
  ...initialState,

  // Field operations
  updateField: (field: string, value: any) => {
    set((state) => {
      const newFormData = {
        ...state.formData,
        [field]: value,
      };
      const hasChanges = JSON.stringify(newFormData) !== JSON.stringify(state.originalData);
      
      return {
        ...state,
        formData: newFormData,
        hasChanges,
      };
    });
  },

  setFormData: (data: Record<string, any>) => {
    set((state) => ({
      ...state,
      formData: data,
      hasChanges: JSON.stringify(data) !== JSON.stringify(state.originalData),
    }));
  },

  setOriginalData: (data: Record<string, any>) => {
    set({
      originalData: data,
      formData: data,
      hasChanges: false,
    });
  },

  // Error management
  setErrors: (errors: Record<string, string>) => {
    set({
      errors,
      isValid: Object.keys(errors).length === 0,
    });
  },

  clearError: (field: string) => {
    set((state) => {
      const newErrors = { ...state.errors };
      delete newErrors[field];
      return {
        ...state,
        errors: newErrors,
        isValid: Object.keys(newErrors).length === 0,
      };
    });
  },

  hasFieldError: (field: string) => {
    const state = get();
    return field in state.errors;
  },

  getFieldError: (field: string) => {
    const state = get();
    return state.errors[field];
  },

  // State management
  setSaving: (saving: boolean) => {
    set({ isSaving: saving });
  },

  setValid: (valid: boolean) => {
    set({ isValid: valid });
  },

  resetToOriginal: () => {
    set((state) => ({
      ...state,
      formData: state.originalData,
      hasChanges: false,
      errors: {},
      isValid: true,
    }));
  },

  markSaved: () => {
    set((state) => ({
      ...state,
      originalData: state.formData,
      hasChanges: false,
      lastSaved: new Date(),
      isSaving: false,
    }));
  },

  // Data formatting
  getFormattedData: (): UpdateSiteSettingsDto => {
    const { formData } = get();
    return {
      title: formData.general?.title || formData.title,
      isMultilingual: formData.general?.isMultilingual ?? formData.isMultilingual,
      supportedLanguages: formData.general?.supportedLanguages || formData.supportedLanguages,
      defaultLanguage: formData.general?.defaultLanguage || formData.defaultLanguage,
      headerSettings: formData.header ? {
        logoType: formData.header.logoType,
        logoText: formData.header.logoText,
        logoImageUrl: formData.header.logoImageUrl,
        logoImageAlt: formData.header.logoImageAlt,
        headerStyle: formData.header.headerStyle,
        stickyHeader: formData.header.stickyHeader,
        showSearchIcon: formData.header.showSearchIcon,
        showUserIcon: formData.header.showUserIcon,
        showCartIcon: formData.header.showCartIcon,
        cartBadgeCount: formData.header.cartBadgeCount,
      } : formData.headerSettings,
      languageSelectorTexts: formData.languageSelector ? {
        chooseLangText: formData.languageSelector.chooseLangText,
      } : formData.languageSelectorTexts,
      navigation: formData.navigation ? {
        mobileMenuTitle: formData.navigation.mobileMenuTitle,
        menuItems: formData.navigation.menuItems,
        footerMenuItems: formData.navigation.footerMenuItems,
      } : undefined,
    };
  },

  // Reset store
  reset: () => {
    set(initialState);
  },
}));
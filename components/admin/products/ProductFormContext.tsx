'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { CreateProduct, UpdateProduct } from '@/features/products/domain/schemas/ProductSchemas';

// Types
interface ProductFormState {
  formData: Record<string, any>;
  originalData: Record<string, any>;
  hasChanges: boolean;
  isValid: boolean;
  errors: Record<string, string>;
  isSaving: boolean;
  lastSaved: Date | null;
  isCreateMode: boolean;
}

type ProductFormAction =
  | { type: 'SET_FORM_DATA'; payload: Record<string, any> }
  | { type: 'SET_ORIGINAL_DATA'; payload: Record<string, any> }
  | { type: 'UPDATE_FIELD'; payload: { field: string; value: any } }
  | { type: 'SET_ERRORS'; payload: Record<string, string> }
  | { type: 'CLEAR_ERROR'; payload: string }
  | { type: 'SET_SAVING'; payload: boolean }
  | { type: 'SET_VALID'; payload: boolean }
  | { type: 'RESET_TO_ORIGINAL' }
  | { type: 'MARK_SAVED' }
  | { type: 'SET_CREATE_MODE'; payload: boolean };

interface ProductFormContextType {
  state: ProductFormState;
  updateField: (field: string, value: any) => void;
  setFormData: (data: Record<string, any>) => void;
  setOriginalData: (data: Record<string, any>) => void;
  setErrors: (errors: Record<string, string>) => void;
  clearError: (field: string) => void;
  setSaving: (saving: boolean) => void;
  setValid: (valid: boolean) => void;
  resetToOriginal: () => void;
  markSaved: () => void;
  getFormattedData: () => CreateProduct | UpdateProduct;
  hasFieldError: (field: string) => boolean;
  getFieldError: (field: string) => string | undefined;
}

// Initial state
const initialState: ProductFormState = {
  formData: {},
  originalData: {},
  hasChanges: false,
  isValid: true,
  errors: {},
  isSaving: false,
  lastSaved: null,
  isCreateMode: true,
};

// Reducer
function productFormReducer(state: ProductFormState, action: ProductFormAction): ProductFormState {
  switch (action.type) {
    case 'SET_FORM_DATA':
      return {
        ...state,
        formData: action.payload,
      };

    case 'SET_ORIGINAL_DATA':
      return {
        ...state,
        originalData: action.payload,
        formData: action.payload,
        hasChanges: false,
      };

    case 'UPDATE_FIELD':
      const newFormData = {
        ...state.formData,
        [action.payload.field]: action.payload.value,
      };
      
      return {
        ...state,
        formData: newFormData,
        hasChanges: JSON.stringify(newFormData) !== JSON.stringify(state.originalData),
      };

    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.payload,
        isValid: Object.keys(action.payload).length === 0,
      };

    case 'CLEAR_ERROR':
      const newErrors = { ...state.errors };
      delete newErrors[action.payload];
      
      return {
        ...state,
        errors: newErrors,
        isValid: Object.keys(newErrors).length === 0,
      };

    case 'SET_SAVING':
      return {
        ...state,
        isSaving: action.payload,
      };

    case 'SET_VALID':
      return {
        ...state,
        isValid: action.payload,
      };

    case 'RESET_TO_ORIGINAL':
      return {
        ...state,
        formData: state.originalData,
        hasChanges: false,
        errors: {},
        isValid: true,
      };

    case 'MARK_SAVED':
      return {
        ...state,
        originalData: state.formData,
        hasChanges: false,
        isSaving: false,
        lastSaved: new Date(),
      };

    case 'SET_CREATE_MODE':
      return {
        ...state,
        isCreateMode: action.payload,
      };

    default:
      return state;
  }
}

// Context
const ProductFormContext = createContext<ProductFormContextType | null>(null);

// Provider
interface ProductFormProviderProps {
  children: React.ReactNode;
  isCreateMode?: boolean;
  initialData?: Record<string, any>;
}

export function ProductFormProvider({ 
  children, 
  isCreateMode = true, 
  initialData = {} 
}: ProductFormProviderProps) {
  const [state, dispatch] = useReducer(productFormReducer, {
    ...initialState,
    isCreateMode,
    formData: initialData,
    originalData: initialData,
  });

  const updateField = useCallback((field: string, value: any) => {
    dispatch({ type: 'UPDATE_FIELD', payload: { field, value } });
  }, []);

  const setFormData = useCallback((data: Record<string, any>) => {
    dispatch({ type: 'SET_FORM_DATA', payload: data });
  }, []);

  const setOriginalData = useCallback((data: Record<string, any>) => {
    dispatch({ type: 'SET_ORIGINAL_DATA', payload: data });
  }, []);

  const setErrors = useCallback((errors: Record<string, string>) => {
    dispatch({ type: 'SET_ERRORS', payload: errors });
  }, []);

  const clearError = useCallback((field: string) => {
    dispatch({ type: 'CLEAR_ERROR', payload: field });
  }, []);

  const setSaving = useCallback((saving: boolean) => {
    dispatch({ type: 'SET_SAVING', payload: saving });
  }, []);

  const setValid = useCallback((valid: boolean) => {
    dispatch({ type: 'SET_VALID', payload: valid });
  }, []);

  const resetToOriginal = useCallback(() => {
    dispatch({ type: 'RESET_TO_ORIGINAL' });
  }, []);

  const markSaved = useCallback(() => {
    dispatch({ type: 'MARK_SAVED' });
  }, []);

  const getFormattedData = useCallback((): CreateProduct | UpdateProduct => {
    const { formData } = state;
    
    return {
      title: formData.title || '',
      shortDescription: formData.shortDescription || '',
      longDescription: formData.longDescription || '',
      price: parseFloat(formData.price) || 0,
      categoryId: formData.categoryId || '',
      imageUrl: formData.imageUrl || '',
      stockQuantity: parseInt(formData.stockQuantity) || 0,
      isAvailable: formData.isAvailable ?? true,
      preparationTime: formData.preparationTime ? parseInt(formData.preparationTime) : undefined,
      ingredients: formData.ingredients || [],
      extras: formData.extras || [],
      isFeatured: formData.isFeatured || false,
      isPopular: formData.isPopular || false,
      isTrending: formData.isTrending || false,
      promotionBadge: formData.promotionBadge || undefined,
      uberEatsId: formData.uberEatsId || undefined,
      deliverooId: formData.deliverooId || undefined,
    };
  }, [state]);

  const hasFieldError = useCallback((field: string) => {
    return field in state.errors;
  }, [state.errors]);

  const getFieldError = useCallback((field: string) => {
    return state.errors[field];
  }, [state.errors]);

  const contextValue: ProductFormContextType = {
    state,
    updateField,
    setFormData,
    setOriginalData,
    setErrors,
    clearError,
    setSaving,
    setValid,
    resetToOriginal,
    markSaved,
    getFormattedData,
    hasFieldError,
    getFieldError,
  };

  return (
    <ProductFormContext.Provider value={contextValue}>
      {children}
    </ProductFormContext.Provider>
  );
}

// Hook
export function useProductForm() {
  const context = useContext(ProductFormContext);
  if (!context) {
    throw new Error('useProductForm must be used within a ProductFormProvider');
  }
  return context;
}
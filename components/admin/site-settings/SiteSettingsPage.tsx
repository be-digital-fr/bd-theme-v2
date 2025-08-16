'use client';

import { useEffect } from 'react';
import { useSiteSettingsStore } from '@/stores/useSiteSettingsStore';
import { SettingsForm } from './SettingsForm';
import { SettingsSkeleton } from './SettingsSkeleton';
import { useSettings, useUpdateSettings } from '@/features/settings/presentation/hooks/useSettingsClient';
import { SettingsFormAdapter } from '@/features/settings/infrastructure/adapters/SettingsFormAdapter';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Info, Save, RotateCcw, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { usePageHeader } from '@/components/admin/layout/DashboardHeader';

// Main component using Zustand store
function SiteSettingsContent() {
  const {
    formData,
    originalData,
    hasChanges,
    isValid,
    errors,
    isSaving,
    setOriginalData,
    setSaving,
    markSaved,
    resetToOriginal,
    getFormattedData,
    setErrors,
    reset: resetStore,
  } = useSiteSettingsStore();

  const { data: settingsData, isLoading, error, refetch } = useSettings();
  const updateSettingsMutation = useUpdateSettings();
  const { setHeader, reset } = usePageHeader();

  // Initialize form data when settings load
  useEffect(() => {
    if (settingsData !== undefined) {
      const formData = SettingsFormAdapter.toFormData(settingsData);
      setOriginalData(formData);
    }
  }, [settingsData, setOriginalData]);

  // Configure header
  useEffect(() => {
    setHeader({
      title: 'Réglages du site',
      description: 'Configuration générale et paramètres du site',
      breadcrumbs: [
        { label: 'Administration', href: '/admin' },
        { label: 'Configuration' },
        { label: 'Réglages du site' },
      ],
      actions: [
        // {
        //   id: 'preview',
        //   label: 'Aperçu',
        //   variant: 'outline',
        //   icon: <Eye className="h-4 w-4" />,
        //   onClick: handlePreview,
        //   disabled: isSaving,
        // },
        {
          id: 'reset',
          label: 'Annuler',
          variant: 'outline',
          icon: <RotateCcw className="h-4 w-4" />,
          onClick: handleReset,
          disabled: !hasChanges || isSaving,
        },
        {
          id: 'save',
          label: isSaving ? 'Sauvegarde...' : 'Sauvegarder',
          variant: 'default',
          icon: <Save className="h-4 w-4" />,
          onClick: handleSave,
          disabled: !hasChanges || !isValid || isSaving,
          loading: isSaving,
        },
      ],
    });

    // Cleanup on unmount
    return () => {
      reset();
      // Note: We don't reset the store here to preserve state during navigation
      // Only reset if explicitly needed
    };
  }, [setHeader, reset, hasChanges, isValid, isSaving]);

  // Optional: Reset store when component unmounts (uncomment if needed)
  // useEffect(() => {
  //   return () => resetStore();
  // }, [resetStore]);

  // Handle save
  const handleSave = async () => {
    try {
      setSaving(true);
      setErrors({});

      const formattedData = getFormattedData();
      await updateSettingsMutation.mutateAsync(formattedData);
      
      markSaved();
      toast.success('Réglages du site sauvegardés avec succès');
      
      // Refresh data to get latest state
      await refetch();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      
      // Handle validation errors
      if (error instanceof Error && error.message.includes('validation')) {
        const validationErrors = extractValidationErrors(error.message);
        setErrors(validationErrors);
        toast.error('Veuillez corriger les erreurs de validation');
      } else {
        toast.error('Erreur lors de la sauvegarde des réglages');
      }
    } finally {
      setSaving(false);
    }
  };

  // Handle reset
  const handleReset = () => {
    resetToOriginal();
    toast.info('Modifications annulées');
  };

  // Handle preview (commented out for now)
  // const handlePreview = () => {
  //   // TODO: Implement preview functionality
  //   toast.info('Fonctionnalité d\'aperçu en développement');
  // };

  // Loading state
  if (isLoading) {
    return <SettingsSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Réglages du site</h1>
          <p className="text-muted-foreground mt-2">
            Une erreur s'est produite lors du chargement des réglages.
          </p>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">Impossible de charger les réglages du site</p>
              <p className="text-sm">
                {error instanceof Error ? error.message : 'Erreur inconnue'}
              </p>
              <button 
                onClick={() => refetch()}
                className="text-sm underline hover:no-underline"
              >
                Réessayer
              </button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* First time setup notice */}
      {(!settingsData || (settingsData && !settingsData.title)) && (
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Première configuration :</strong> Remplissez les champs ci-dessous pour configurer votre site restaurant. 
            Les champs marqués d'un astérisque (*) sont obligatoires.
          </AlertDescription>
        </Alert>
      )}

      {/* Settings Form */}
      <SettingsForm />
    </div>
  );
}

// Extract validation errors from error message
function extractValidationErrors(errorMessage: string): Record<string, string> {
  // Simple implementation - can be enhanced based on your error format
  const errors: Record<string, string> = {};
  
  if (errorMessage.includes('title')) {
    errors.title = 'Le titre est requis et doit contenir au moins 3 caractères';
  }
  
  if (errorMessage.includes('supportedLanguages')) {
    errors.supportedLanguages = 'Au moins une langue doit être supportée';
  }
  
  if (errorMessage.includes('defaultLanguage')) {
    errors.defaultLanguage = 'La langue par défaut doit être incluse dans les langues supportées';
  }

  return errors;
}

// Main component using Zustand (no provider needed)
export function SiteSettingsPage() {
  return <SiteSettingsContent />;
}
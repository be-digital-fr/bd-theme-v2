'use client';

import { useEffect } from 'react';
import { useHomeContentStore } from '@/stores/useHomeContentStore';
import { HomeContentForm } from './HomeContentForm';
import { HomeContentSkeleton } from './HomeContentSkeleton';
import { useHomeContent, useUpdateHomeContent } from '@/features/home-content/presentation/hooks/useHomeContentClient';
import { HomeContentFormAdapter } from '@/features/home-content/infrastructure/adapters/HomeContentFormAdapter';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Info, Save, RotateCcw, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { usePageHeader } from '@/components/admin/layout/DashboardHeader';
import { SentryFormErrorCapture } from '@/lib/sentry-form-errors';

// Main component
export function HomeContentPage() {
  const {
    formData,
    originalData,
    hasChanges,
    isValid,
    errors,
    isSaving,
    lastSaved,
    setOriginalData,
    setSaving,
    markSaved,
    resetToOriginal,
    getFormattedData,
    setErrors,
  } = useHomeContentStore();

  const { data: homeContentData, isLoading, error, refetch } = useHomeContent();
  const updateHomeContentMutation = useUpdateHomeContent();
  const { setHeader, reset } = usePageHeader();

  // Initialize form data when content loads
  useEffect(() => {
    if (homeContentData !== undefined) {
      const formData = HomeContentFormAdapter.toFormData(homeContentData);
      setOriginalData(formData);
    }
  }, [homeContentData, setOriginalData]);

  // Configure header
  useEffect(() => {
    setHeader({
      title: 'Contenu de la page d\'accueil',
      description: 'Gérez le contenu et l\'apparence de votre page d\'accueil',
      breadcrumbs: [
        { label: 'Administration', href: '/admin' },
        { label: 'Gestion de contenu' },
        { label: 'Page d\'accueil' },
      ],
      actions: [
        // {
        //   id: 'preview',
        //   label: 'Aperçu',
        //   variant: 'outline',
        //   icon: <Eye className="h-4 w-4" />,
        //   onClick: handlePreview,
        //   disabled: state.isSaving,
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
    return () => reset();
  }, [setHeader, reset, hasChanges, isValid, isSaving]);

  // Handle save
  const handleSave = async () => {
    try {
      setSaving(true);
      setErrors({});

      const formattedData = getFormattedData();
      await updateHomeContentMutation.mutateAsync(formattedData);
      
      // Capturer le succès pour monitoring
      SentryFormErrorCapture.captureFormSuccess({
        formType: 'update',
        entityType: 'home-content'
      });
      
      markSaved();
      toast.success('Contenu de la page d\'accueil sauvegardé avec succès');
      
      // Refresh data to get latest state
      await refetch();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      
      // Handle validation errors
      if (error instanceof Error && error.message.includes('validation')) {
        const validationErrors = extractValidationErrors(error.message);
        setErrors(validationErrors);
        
        // Capturer les erreurs de validation
        const validationErrorDetails = Object.entries(validationErrors).map(([field, message]) => ({
          field,
          message: message as string,
          value: (formattedData as any)?.[field]
        }));
        
        SentryFormErrorCapture.captureValidationError(validationErrorDetails, {
          formType: 'update',
          entityType: 'home-content',
          formData: formattedData
        });
        
        toast.error('Veuillez corriger les erreurs de validation');
      } else {
        // Capturer les autres erreurs
        SentryFormErrorCapture.captureFormError(error as Error, {
          formType: 'update',
          entityType: 'home-content',
          formData: formattedData
        });
        
        toast.error('Erreur lors de la sauvegarde du contenu');
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

  // Handle preview
  // const handlePreview = () => {
  //   // TODO: Implement preview functionality
  //   toast.info('Fonctionnalité d\'aperçu en développement');
  // };

  // Loading state
  if (isLoading) {
    return <HomeContentSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contenu de la page d'accueil</h1>
          <p className="text-muted-foreground mt-2">
            Une erreur s'est produite lors du chargement du contenu.
          </p>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">Impossible de charger le contenu de la page d'accueil</p>
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
      {(!homeContentData || (homeContentData && !homeContentData.heroBanner?.heroTitle)) && (
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Configuration du contenu :</strong> Configurez le contenu de votre page d'accueil ci-dessous. 
            Les champs marqués d'un astérisque (*) sont obligatoires.
          </AlertDescription>
        </Alert>
      )}

      {/* Content Form */}
      <HomeContentForm />
    </div>
  );
}

// Extract validation errors from error message
function extractValidationErrors(errorMessage: string): Record<string, string> {
  // Simple implementation - can be enhanced based on your error format
  const errors: Record<string, string> = {};
  
  if (errorMessage.includes('title')) {
    errors.heroTitle = 'Le titre est requis';
  }
  
  if (errorMessage.includes('description')) {
    errors.heroDescription = 'La description est requise';
  }
  
  if (errorMessage.includes('button')) {
    errors.primaryButton = 'Le texte du bouton est requis';
  }

  return errors;
}
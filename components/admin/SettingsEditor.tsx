'use client';

import { useEffect, useState } from 'react';
import { DynamicForm } from '@/components/admin/form-builders/DynamicForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
// import { SanitySchemaService } from '@/features/admin/infrastructure/services/SanitySchemaService';
import { useSettings, useUpdateSettings } from '@/features/settings/presentation/hooks/useSettings';
import { SettingsFormAdapter } from '@/features/settings/infrastructure/adapters/SettingsFormAdapter';
import { AlertCircle, Loader2 } from 'lucide-react';

export function SettingsEditor() {
  // const [schema] = useState(() => SanitySchemaService.parseSettingsSchema());
  // const [zodSchema] = useState(() => SanitySchemaService.createSettingsZodSchema());
  const [defaultValues, setDefaultValues] = useState<Record<string, any>>({});

  const { data: settingsData, isLoading, error, refetch } = useSettings();
  const updateSettingsMutation = useUpdateSettings();

  // Préparer les valeurs par défaut
  useEffect(() => {
    // const initialValues = SanitySchemaService.applyInitialValues(schema);
    
    // Transform Prisma data to form format
    const formData = SettingsFormAdapter.toFormData(settingsData);
    
    // Fusionner les données existantes avec les valeurs par défaut
    const mergedValues = { ...formData };
    setDefaultValues(mergedValues);
  }, [settingsData]);

  const handleSubmit = async (data: any) => {
    try {
      // Transform form data back to Prisma format
      const settingsData = SettingsFormAdapter.fromFormData(data);
      await updateSettingsMutation.mutateAsync(settingsData);
      // Recharger les données après la mise à jour
      await refetch();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };


  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Paramètres du site</h1>
          <p className="text-muted-foreground">
            Une erreur s'est produite lors du chargement des paramètres
          </p>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Impossible de charger les paramètres du site. Veuillez réessayer.
            <br />
            <span className="text-xs text-muted-foreground mt-2 block">
              Erreur: {error instanceof Error ? error.message : 'Erreur inconnue'}
            </span>
          </AlertDescription>
        </Alert>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <div>
                <h3 className="font-medium">Impossible de charger les données</h3>
                <p className="text-sm text-muted-foreground">
                  Vérifiez votre connexion et les permissions Sanity
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status de sauvegarde */}
      {updateSettingsMutation.isPending && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>
            Sauvegarde en cours... Veuillez patienter.
          </AlertDescription>
        </Alert>
      )}

      {updateSettingsMutation.isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erreur lors de la sauvegarde. Veuillez réessayer.
          </AlertDescription>
        </Alert>
      )}

      {/* Formulaire dynamique */}
      {Object.keys(defaultValues).length > 0 && (
        <div className="p-4 border border-dashed border-muted-foreground/25 rounded-lg text-center">
          <p className="text-muted-foreground">
            Formulaire de configuration en cours de développement
          </p>
        </div>
      )}
    </div>
  );
}
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { DynamicField } from './DynamicField';
// SanitySchemaService supprimé avec Sanity
interface SanitySchemaConfig {
  title: string;
  groups: Array<{ name: string; title: string; }>;
  fields: Array<{ name: string; group: string; }>;
}
import { Save, RotateCcw, Loader2, AlertTriangle } from 'lucide-react';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { z } from 'zod';
import { useDashboardHeaderStore } from '@/stores/useDashboardHeaderStore';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface DynamicFormProps {
  schema: SanitySchemaConfig;
  zodSchema: z.ZodSchema;
  defaultValues?: Record<string, any>;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
}

export function DynamicForm({ 
  schema, 
  zodSchema, 
  defaultValues = {}, 
  onSubmit,
  isLoading = false,
  disabled = false 
}: DynamicFormProps) {
  const [activeTab, setActiveTab] = useState(schema.groups[0]?.name || 'general');
  const [hasChanges, setHasChanges] = useState(false);
  const { setHeader, reset: resetHeader } = useDashboardHeaderStore();
  
  const form = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { handleSubmit, reset, watch, formState: { errors, isDirty } } = form;

  const handleReset = useCallback(() => {
    reset(defaultValues);
    setHasChanges(false);
  }, [reset, defaultValues]);

  const handleSave = useCallback(() => {
    handleSubmit(onSubmit)();
  }, [handleSubmit, onSubmit]);

  // Surveiller les changements
  useEffect(() => {
    const subscription = watch(() => {
      setHasChanges(isDirty);
    });
    return () => subscription.unsubscribe();
  }, [watch, isDirty]);

  const getFieldsByGroup = (groupName: string) => {
    return schema.fields.filter(field => field.group === groupName);
  };

  const getErrorsCount = (groupName: string) => {
    const groupFields = getFieldsByGroup(groupName);
    return groupFields.reduce((count, field) => {
      // Gérer les erreurs imbriquées (pour les objets et arrays)
      const fieldError = errors[field.name];
      if (fieldError) {
        if (typeof fieldError === 'object' && fieldError.message) {
          count++;
        } else if (typeof fieldError === 'string') {
          count++;
        } else if (typeof fieldError === 'object') {
          // Compter les erreurs dans les champs imbriqués
          const countNestedErrors = (errorObj: any): number => {
            let nestedCount = 0;
            Object.values(errorObj).forEach(error => {
              if (error && typeof error === 'object') {
                if (error.message) {
                  nestedCount++;
                } else {
                  nestedCount += countNestedErrors(error);
                }
              }
            });
            return nestedCount;
          };
          count += countNestedErrors(fieldError);
        }
      }
      return count;
    }, 0);
  };

  const getTotalErrorsCount = () => {
    return schema.groups.reduce((total, group) => total + getErrorsCount(group.name), 0);
  };

  const getFieldsWithErrors = (groupName: string) => {
    const groupFields = getFieldsByGroup(groupName);
    return groupFields.filter(field => errors[field.name]);
  };

  const totalErrors = getTotalErrorsCount();

  // Mémoriser les actions pour éviter les re-rendus
  const actions = useMemo(() => (
    <div className="flex items-center gap-2">
      {totalErrors > 0 && (
        <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-300">
          <AlertTriangle className="h-3 w-3 mr-1" />
          {totalErrors} erreur{totalErrors > 1 ? 's' : ''}
        </Badge>
      )}
      {hasChanges && totalErrors === 0 && (
        <Badge variant="outline" className="text-orange-600 border-orange-600">
          Modifications non sauvegardées
        </Badge>
      )}
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleReset}
        disabled={disabled || !hasChanges}
        className="flex items-center gap-2"
      >
        <RotateCcw className="h-4 w-4" />
        Réinitialiser
      </Button>
      
      <Button
        type="submit"
        size="sm"
        disabled={disabled || isLoading || !hasChanges || totalErrors > 0}
        onClick={handleSave}
        className="flex items-center gap-2"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
      </Button>
    </div>
  ), [hasChanges, disabled, isLoading, handleReset, handleSave, totalErrors]);

  // Injecter le contenu du header dans le layout
  useEffect(() => {
    setHeader({
      title: schema.title,
      description: "Gérez les paramètres de configuration du site",
      actions,
    });

    // Nettoyer lors du démontage du composant
    return () => resetHeader();
  }, [schema.title, actions, setHeader, resetHeader]);

  return (
    <div className="space-y-6">
      {/* Afficher un résumé des erreurs si il y en a */}
      {totalErrors > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            <div className="flex items-center justify-between">
              <span>
                {totalErrors} erreur{totalErrors > 1 ? 's' : ''} de validation détectée{totalErrors > 1 ? 's' : ''}
              </span>
              <div className="flex gap-2">
                {schema.groups.map((group) => {
                  const errorsInGroup = getErrorsCount(group.name);
                  if (errorsInGroup === 0) return null;
                  return (
                    <Button
                      key={group.name}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab(group.name)}
                      className="h-6 px-2 text-xs bg-red-100 border-red-300 text-red-700 hover:bg-red-200"
                    >
                      {group.title} ({errorsInGroup})
                    </Button>
                  );
                })}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Form avec Tabs directement */}
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Tabs Navigation */}
            <TabsList className="grid w-full grid-cols-4 bg-muted p-1 mb-6">
              {schema.groups.map((group) => {
                const errorsCount = getErrorsCount(group.name);
                return (
                  <TabsTrigger 
                    key={group.name} 
                    value={group.name}
                    className={`relative flex items-center gap-2 text-sm ${
                      errorsCount > 0 ? 'border-red-300 bg-red-50 text-red-700 data-[state=active]:bg-red-100' : ''
                    }`}
                  >
                    {group.title}
                    {errorsCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-2 -right-2 h-5 w-5 p-0 text-[10px] flex items-center justify-center bg-red-500 hover:bg-red-600"
                      >
                        {errorsCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* Tabs Content - directement les champs sans cartes */}
            {schema.groups.map((group) => (
              <TabsContent key={group.name} value={group.name} className="space-y-6 mt-6">
                {getFieldsByGroup(group.name).map((field) => (
                  <DynamicField 
                    key={field.name} 
                    field={field} 
                    form={form} 
                    disabled={disabled}
                  />
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </form>
      </Form>

      {/* Sticky Footer avec actions */}
      {(hasChanges || totalErrors > 0) && (
        <div className={cn(
          "fixed bottom-0 left-0 right-0 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t p-4 z-50",
          totalErrors > 0 
            ? "bg-red-50/95 border-red-200" 
            : "bg-background/95 border-border"
        )}>
          <div className="container max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              {totalErrors > 0 && (
                <div className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {totalErrors} erreur{totalErrors > 1 ? 's' : ''} de validation
                  </span>
                </div>
              )}
              {hasChanges && totalErrors === 0 && (
                <div className="text-sm text-muted-foreground">
                  Vous avez des modifications non sauvegardées
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={disabled}
              >
                Annuler
              </Button>
              
              <Button
                type="button"
                size="sm"
                disabled={disabled || isLoading || totalErrors > 0}
                onClick={handleSubmit(onSubmit)}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
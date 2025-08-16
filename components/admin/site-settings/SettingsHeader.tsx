'use client';

import { Button } from '@/components/ui/button';
import { Save, RotateCcw, Eye } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface SettingsHeaderProps {
  onSave?: () => void;
  onReset?: () => void;
  onPreview?: () => void;
  isSaving?: boolean;
  hasChanges?: boolean;
  isValid?: boolean;
}

export function SettingsHeader({
  onSave,
  onReset,
  onPreview,
  isSaving = false,
  hasChanges = false,
  isValid = true,
}: SettingsHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Title and Description */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Réglages du site</h1>
        <p className="text-muted-foreground mt-2">
          Configurez les paramètres généraux, le design du header, les langues supportées 
          et la navigation de votre site restaurant.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <TooltipProvider>
          {/* Save Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button
                  onClick={onSave}
                  disabled={!hasChanges || !isValid || isSaving}
                  className="bg-primary hover:bg-primary/90"
                  size="sm"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {!hasChanges 
                  ? 'Aucune modification à sauvegarder'
                  : !isValid
                  ? 'Corrigez les erreurs avant de sauvegarder'
                  : 'Enregistrer les modifications'
                }
              </p>
            </TooltipContent>
          </Tooltip>

          {/* Reset Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button
                  onClick={onReset}
                  disabled={!hasChanges || isSaving}
                  variant="outline"
                  size="sm"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Annuler toutes les modifications non sauvegardées</p>
            </TooltipContent>
          </Tooltip>

          {/* Preview Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button
                  onClick={onPreview}
                  variant="outline"
                  size="sm"
                  className="ml-2"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Aperçu
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Voir l'aperçu des modifications en temps réel</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Status Indicator */}
      {hasChanges && (
        <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-md border border-amber-200">
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          <span>Des modifications non sauvegardées sont en attente</span>
        </div>
      )}
    </div>
  );
}
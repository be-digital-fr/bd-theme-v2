'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Save, RotateCcw, Eye, Loader2 } from 'lucide-react';

interface HomeContentHeaderProps {
  onSave: () => void;
  onReset: () => void;
  onPreview: () => void;
  isSaving: boolean;
  hasChanges: boolean;
  isValid: boolean;
}

export function HomeContentHeader({
  onSave,
  onReset,
  onPreview,
  isSaving,
  hasChanges,
  isValid
}: HomeContentHeaderProps) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold">Actions</h2>
              <div className="flex gap-2">
                {hasChanges && (
                  <Badge variant="secondary" className="text-xs">
                    Modifications non sauvegardées
                  </Badge>
                )}
                {!isValid && (
                  <Badge variant="destructive" className="text-xs">
                    Erreurs de validation
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Sauvegardez vos modifications ou prévisualisez le résultat
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onPreview}
              disabled={isSaving}
            >
              <Eye className="h-4 w-4 mr-2" />
              Aperçu
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              disabled={!hasChanges || isSaving}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            
            <Button
              onClick={onSave}
              disabled={!hasChanges || !isValid || isSaving}
              size="sm"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
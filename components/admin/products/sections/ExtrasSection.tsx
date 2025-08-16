'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coffee, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { useProductForm } from '../ProductFormContext';

export function ExtrasSection() {
  const { state } = useProductForm();

  return (
    <div className="space-y-6">
      {/* Coming Soon Notice */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coffee className="h-5 w-5" />
            Extras et compléments
          </CardTitle>
          <CardDescription>
            Associez des extras et compléments à votre produit
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8 space-y-4">
            <div className="text-muted-foreground">
              <Coffee className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-lg font-medium">Fonctionnalité en développement</p>
              <p className="text-sm">
                La gestion des extras sera bientôt disponible. Elle permettra de :
              </p>
            </div>
            
            <div className="space-y-2 text-sm text-left max-w-md mx-auto">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>Associer des extras disponibles (sauces, accompagnements)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>Définir des prix spécifiques par produit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>Organiser par type (taille, garniture, accompagnement)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>Gérer la disponibilité par extra</span>
              </div>
            </div>

            <Badge variant="secondary" className="mt-4">
              Prochainement disponible
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Extra Types Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Types d'extras prévus</CardTitle>
          <CardDescription>
            Aperçu des catégories d'extras qui seront disponibles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="font-medium text-sm">Tailles</div>
              <div className="text-xs text-muted-foreground mt-1">Petit, Moyen, Grand</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="font-medium text-sm">Garnitures</div>
              <div className="text-xs text-muted-foreground mt-1">Sauces, épices</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="font-medium text-sm">Accompagnements</div>
              <div className="text-xs text-muted-foreground mt-1">Frites, salade</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="font-medium text-sm">Boissons</div>
              <div className="text-xs text-muted-foreground mt-1">Sodas, jus</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="font-medium text-sm">Desserts</div>
              <div className="text-xs text-muted-foreground mt-1">Glaces, gâteaux</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="font-medium text-sm">Autres</div>
              <div className="text-xs text-muted-foreground mt-1">Options diverses</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChefHat, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { useProductForm } from '../ProductFormContext';

export function IngredientsSection() {
  const { state } = useProductForm();

  return (
    <div className="space-y-6">
      {/* Coming Soon Notice */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            Gestion des ingrédients
          </CardTitle>
          <CardDescription>
            Définissez les ingrédients de votre produit et leurs propriétés
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8 space-y-4">
            <div className="text-muted-foreground">
              <ChefHat className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-lg font-medium">Fonctionnalité en développement</p>
              <p className="text-sm">
                La gestion des ingrédients sera bientôt disponible. Elle permettra de :
              </p>
            </div>
            
            <div className="space-y-2 text-sm text-left max-w-md mx-auto">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>Sélectionner les ingrédients du produit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>Définir les quantités et options (optionnel, supprimable)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>Gérer les allergènes automatiquement</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>Calculer les informations nutritionnelles</span>
              </div>
            </div>

            <Badge variant="secondary" className="mt-4">
              Prochainement disponible
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Temporary Manual Input */}
      <Card>
        <CardHeader>
          <CardTitle>En attendant...</CardTitle>
          <CardDescription>
            Vous pouvez mentionner les ingrédients principaux dans la description du produit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4 text-sm">
            <p className="font-medium mb-2">Conseil :</p>
            <p>
              Listez les ingrédients principaux et les allergènes dans la description détaillée 
              de votre produit en attendant la mise en place du système de gestion des ingrédients.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
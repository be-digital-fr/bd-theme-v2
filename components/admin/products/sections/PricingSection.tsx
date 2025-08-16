'use client';

import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Euro, Package, AlertTriangle } from 'lucide-react';

import { useProductForm } from '../ProductFormContext';

export function PricingSection() {
  const form = useFormContext();
  const { updateField, state } = useProductForm();

  const price = parseFloat(state.formData.price || 0);
  const stockQuantity = parseInt(state.formData.stockQuantity || 0);

  return (
    <div className="space-y-6">
      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Euro className="h-5 w-5" />
            Tarification
          </CardTitle>
          <CardDescription>
            Définissez le prix de vente de votre produit
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Price */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Prix de vente <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="12.50"
                      className="pl-10"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value ? parseFloat(e.target.value) : 0;
                        field.onChange(value);
                        updateField('price', value);
                      }}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Prix de vente TTC en euros
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Price Preview */}
          {price > 0 && (
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Aperçu du prix</span>
                <Badge variant="secondary" className="text-lg font-bold">
                  {price.toFixed(2)} €
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stock Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Gestion des stocks
          </CardTitle>
          <CardDescription>
            Suivez la disponibilité de votre produit
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Stock Quantity */}
          <FormField
            control={form.control}
            name="stockQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantité en stock</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      min="0"
                      placeholder="50"
                      className="pl-10"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value ? parseInt(e.target.value) : 0;
                        field.onChange(value);
                        updateField('stockQuantity', value);
                      }}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Nombre d'unités disponibles (0 = stock illimité)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Stock Status */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Statut du stock</span>
              <div className="flex items-center gap-2">
                {stockQuantity === 0 ? (
                  <Badge variant="secondary">Stock illimité</Badge>
                ) : stockQuantity < 10 ? (
                  <>
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <Badge variant="destructive">Stock faible</Badge>
                  </>
                ) : (
                  <Badge variant="default">En stock</Badge>
                )}
              </div>
            </div>

            {stockQuantity > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Quantité disponible</span>
                  <span className="font-medium">{stockQuantity} unités</span>
                </div>
                
                {stockQuantity < 10 && (
                  <div className="flex items-start gap-2 text-sm text-orange-600">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>
                      Stock faible. Pensez à réapprovisionner bientôt.
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pricing Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Résumé tarifaire</CardTitle>
          <CardDescription>
            Récapitulatif des informations de prix et stock
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Prix de vente</div>
              <div className="text-2xl font-bold">
                {price > 0 ? `${price.toFixed(2)} €` : 'Non défini'}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Stock disponible</div>
              <div className="text-2xl font-bold">
                {stockQuantity === 0 ? 'Illimité' : `${stockQuantity} unités`}
              </div>
            </div>
          </div>

          {price > 0 && stockQuantity > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span>Valeur totale du stock</span>
                <span className="font-medium">
                  {(price * stockQuantity).toFixed(2)} €
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
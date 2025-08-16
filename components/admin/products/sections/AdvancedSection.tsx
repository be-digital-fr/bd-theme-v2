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
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, ExternalLink, Tag, Truck, Star, Users, TrendingUp } from 'lucide-react';

import { useProductForm } from '../ProductFormContext';

export function AdvancedSection() {
  const form = useFormContext();
  const { updateField, state } = useProductForm();

  return (
    <div className="space-y-6">
      {/* Special Collections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Collections spéciales
          </CardTitle>
          <CardDescription>
            Ajoutez ce produit aux collections spéciales pour le mettre en avant
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Featured Product */}
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-3 border rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <FormLabel className="text-sm font-medium">Mise en avant</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value || false}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        updateField('isFeatured', checked);
                      }}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Produit recommandé sur la page d'accueil
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* Popular Product */}
            <FormField
              control={form.control}
              name="isPopular"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-3 border rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <FormLabel className="text-sm font-medium">Populaire</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value || false}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        updateField('isPopular', checked);
                      }}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Produit apprécié par les clients
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* Trending Product */}
            <FormField
              control={form.control}
              name="isTrending"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-3 border rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <FormLabel className="text-sm font-medium">Tendance</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value || false}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        updateField('isTrending', checked);
                      }}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Nouveau produit ou saisonnier
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>

          {/* Collection Preview */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium">Collections actives :</span>
              {state.formData.isFeatured && (
                <Badge variant="default" className="bg-yellow-500">
                  <Star className="h-3 w-3 mr-1" />
                  Mise en avant
                </Badge>
              )}
              {state.formData.isPopular && (
                <Badge variant="secondary" className="bg-blue-500 text-white">
                  <Users className="h-3 w-3 mr-1" />
                  Populaire
                </Badge>
              )}
              {state.formData.isTrending && (
                <Badge variant="outline" className="border-green-500 text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Tendance
                </Badge>
              )}
              {!state.formData.isFeatured && !state.formData.isPopular && !state.formData.isTrending && (
                <span className="text-sm text-muted-foreground">Aucune collection sélectionnée</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Promotion Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Promotion et badges
          </CardTitle>
          <CardDescription>
            Configurez les badges promotionnels pour mettre en avant votre produit
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Promotion Badge */}
          <FormField
            control={form.control}
            name="promotionBadge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Badge promotionnel</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ex: NOUVEAU, PROMO, -20%"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      updateField('promotionBadge', e.target.value);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Texte du badge qui s'affichera sur le produit (optionnel)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Badge Preview */}
          {state.formData.promotionBadge && (
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">Aperçu du badge :</span>
                <Badge variant="destructive" className="bg-red-500">
                  {state.formData.promotionBadge}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* External Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Intégrations de livraison
          </CardTitle>
          <CardDescription>
            Configurez les intégrations avec les plateformes de livraison
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Uber Eats Integration */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Uber Eats</h4>
                <p className="text-sm text-muted-foreground">
                  Synchroniser ce produit avec Uber Eats
                </p>
              </div>
              <FormField
                control={form.control}
                name="uberEatsActive"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Switch
                        checked={field.value || false}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          updateField('uberEatsActive', checked);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="uberEatsId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Uber Eats</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ID du produit sur Uber Eats"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        updateField('uberEatsId', e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Identifiant du produit dans le système Uber Eats (optionnel)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <hr />

          {/* Deliveroo Integration */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Deliveroo</h4>
                <p className="text-sm text-muted-foreground">
                  Synchroniser ce produit avec Deliveroo
                </p>
              </div>
              <FormField
                control={form.control}
                name="deliverooActive"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Switch
                        checked={field.value || false}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          updateField('deliverooActive', checked);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="deliverooId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Deliveroo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ID du produit sur Deliveroo"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        updateField('deliverooId', e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Identifiant du produit dans le système Deliveroo (optionnel)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* SEO and URL */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            SEO et URL
          </CardTitle>
          <CardDescription>
            Options d'optimisation pour les moteurs de recherche
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Slug Preview */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="text-sm">
              <div className="font-medium mb-1">URL du produit :</div>
              <div className="font-mono text-muted-foreground">
                {window.location.origin}/products/
                {state.formData.title 
                  ? state.formData.title
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/(^-|-$)/g, '')
                  : 'nom-du-produit'
                }
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            L'URL du produit est générée automatiquement à partir du nom du produit.
            Elle sera optimisée pour le référencement.
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Informations système
          </CardTitle>
          <CardDescription>
            Informations techniques et métadonnées
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium">Mode de création</div>
              <div className="text-muted-foreground">
                {state.isCreateMode ? 'Nouveau produit' : 'Modification'}
              </div>
            </div>
            
            <div>
              <div className="font-medium">État</div>
              <div className="text-muted-foreground">
                {state.hasChanges ? 'Modifications en cours' : 'Synchronisé'}
              </div>
            </div>
            
            {state.lastSaved && (
              <div className="col-span-2">
                <div className="font-medium">Dernière sauvegarde</div>
                <div className="text-muted-foreground">
                  {state.lastSaved.toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
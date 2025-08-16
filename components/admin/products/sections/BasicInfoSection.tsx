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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Package, Eye } from 'lucide-react';

import { useProductForm } from '../ProductFormContext';
import { MultilingualInput } from '@/components/admin/shared/MultilingualInput';

export function BasicInfoSection() {
  const form = useFormContext();
  const { updateField, state } = useProductForm();

  return (
    <div className="space-y-6">
      {/* Product Identity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Identité du produit
          </CardTitle>
          <CardDescription>
            Informations principales qui identifient votre produit
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Product Title (Multilingual) */}
          <div className="space-y-2">
            <FormLabel className="text-sm font-medium">
              Nom du produit <span className="text-red-500">*</span>
            </FormLabel>
            <MultilingualInput
              value={state.formData.title || {}}
              onChange={(value) => updateField('title', value)}
              placeholder="Nom du produit"
              type="input"
              required
            />
            <FormDescription>
              Le nom de votre produit tel qu'il apparaîtra dans le menu
            </FormDescription>
          </div>

          {/* Short Description (Multilingual) */}
          <div className="space-y-2">
            <FormLabel className="text-sm font-medium">
              Description courte
            </FormLabel>
            <MultilingualInput
              value={state.formData.shortDescription || {}}
              onChange={(value) => updateField('shortDescription', value)}
              placeholder="Description courte du produit"
              type="textarea"
              rows={2}
            />
            <FormDescription>
              Description courte qui apparaît dans les listes de produits
            </FormDescription>
          </div>

          {/* Long Description (Multilingual) */}
          <div className="space-y-2">
            <FormLabel className="text-sm font-medium">
              Description détaillée
            </FormLabel>
            <MultilingualInput
              value={state.formData.longDescription || {}}
              onChange={(value) => updateField('longDescription', value)}
              placeholder="Description détaillée du produit"
              type="textarea"
              rows={4}
            />
            <FormDescription>
              Description complète avec tous les détails du produit
            </FormDescription>
          </div>
        </CardContent>
      </Card>

      {/* Product Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Paramètres du produit
          </CardTitle>
          <CardDescription>
            Configuration de la disponibilité et du temps de préparation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Preparation Time */}
          <FormField
            control={form.control}
            name="preparationTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Temps de préparation (minutes)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="15"
                    min="1"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value ? parseInt(e.target.value) : undefined;
                      field.onChange(value);
                      updateField('preparationTime', value);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Temps estimé de préparation en minutes
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Availability */}
          <FormField
            control={form.control}
            name="isAvailable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Produit disponible
                  </FormLabel>
                  <FormDescription>
                    Le produit est-il disponible à la commande ?
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value ?? true}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      updateField('isAvailable', checked);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Product Visibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Visibilité et mise en avant
          </CardTitle>
          <CardDescription>
            Options pour mettre en avant votre produit
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Featured Product */}
          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Produit mis en avant
                  </FormLabel>
                  <FormDescription>
                    Afficher ce produit dans la section des produits phares
                  </FormDescription>
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
              </FormItem>
            )}
          />

          {/* Popular Product */}
          <FormField
            control={form.control}
            name="isPopular"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Produit populaire
                  </FormLabel>
                  <FormDescription>
                    Marquer ce produit comme populaire
                  </FormDescription>
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
              </FormItem>
            )}
          />

          {/* Trending Product */}
          <FormField
            control={form.control}
            name="isTrending"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Produit tendance
                  </FormLabel>
                  <FormDescription>
                    Afficher ce produit dans les tendances
                  </FormDescription>
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
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
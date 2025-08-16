'use client';

import { useState } from 'react';
import { useHomeContentStore } from '@/stores/useHomeContentStore';
import { AddServiceDialog } from '../AddServiceDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { MultilingualInput } from '@/components/admin/shared/MultilingualInput';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  HelpCircle, 
  Plus, 
  Trash2, 
  Star,
  Utensils
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


interface ServiceItem {
  id: string;
  iconUrl: string;
  title: Record<string, string>;
}

export function FeaturesSection() {
  const { formData, updateField, hasFieldError, getFieldError, clearError } = useHomeContentStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const featuresData = formData.features || {};
  const services: ServiceItem[] = featuresData.services || [];

  const updateFeaturesField = (field: string, value: any) => {
    const newFeaturesData = {
      ...featuresData,
      [field]: value
    };
    updateField('features', newFeaturesData);
    clearError(`features.${field}`);
  };


  const addService = (newService: ServiceItem) => {
    const updatedServices = [...services, newService];
    updateFeaturesField('services', updatedServices);
  };

  const openAddDialog = () => {
    setIsDialogOpen(true);
  };

  const removeService = (serviceId: string) => {
    const updatedServices = services.filter(service => service.id !== serviceId);
    updateFeaturesField('services', updatedServices);
  };

  const updateService = (serviceId: string, field: string, value: any) => {
    const updatedServices = services.map(service => {
      if (service.id === serviceId) {
        return {
          ...service,
          [field]: value
        };
      }
      return service;
    });
    updateFeaturesField('services', updatedServices);
  };


  const renderServiceIcon = (iconUrl: string) => {
    if (iconUrl) {
      return <img src={iconUrl} alt="Icône du service" className="h-4 w-4 object-contain" />;
    }
    return <Star className="h-4 w-4 text-primary" />;
  };

  return (
    <div className="space-y-6">
      {/* Activation */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Section Services</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Section présentant vos services principaux avec icônes</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardDescription>
            Configuration de la section services de votre page d'accueil
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="features-active" className="text-sm font-medium">
                Section active
              </Label>
              <p className="text-xs text-muted-foreground">
                Afficher la section services sur la page d'accueil
              </p>
            </div>
            <Switch
              id="features-active"
              checked={featuresData.isActive ?? true}
              onCheckedChange={(checked) => updateFeaturesField('isActive', checked)}
            />
          </div>
        </CardContent>
      </Card>



      {/* Services */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Services</CardTitle>
              <CardDescription>
                Liste des services avec icônes (max 6 recommandé)
              </CardDescription>
            </div>
            <Button onClick={openAddDialog} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un service
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {services.length === 0 ? (
            <div className="text-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
              <Utensils className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-4">
                Aucun service configuré
              </p>
              <Button onClick={openAddDialog} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter votre premier service
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {services.map((service, index) => {
                
                return (
                  <Card key={service.id} className="border border-muted">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-md bg-primary/10">
                            {renderServiceIcon(service.iconUrl)}
                          </div>
                          <div>
                            <CardTitle className="text-base">
                              Service {index + 1}
                            </CardTitle>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeService(service.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Icône - Lecture seule */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Icône</Label>
                        <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                          <div className="p-2 rounded-md bg-primary/10">
                            {renderServiceIcon(service.iconUrl)}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Icône uploadée</p>
                            <p className="text-xs text-muted-foreground">
                              Pour modifier l'icône, supprimez ce service et créez-en un nouveau
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Titre */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Titre du service *</Label>
                        <MultilingualInput
                          value={service.title}
                          onChange={(newTitle) => updateService(service.id, 'title', newTitle)}
                          placeholder="Nom du service"
                          type="input"
                          required
                        />
                      </div>

                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {services.length > 6 && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <p className="text-sm text-amber-800">
                <strong>Recommandation :</strong> Limitez-vous à 6 services maximum pour une meilleure lisibilité.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog pour ajouter un service */}
      <AddServiceDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onServiceAdd={addService}
      />
    </div>
  );
}
'use client';

import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { IconUpload } from '@/components/admin/shared/IconUpload';
import { MultilingualInput } from '@/components/admin/shared/MultilingualInput';
import { 
  AlertCircle,
  Check,
  Image as ImageIcon
} from 'lucide-react';


interface ServiceItem {
  id: string;
  iconUrl: string;
  title: Record<string, string>;
}

interface AddServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onServiceAdd: (service: ServiceItem) => void;
}

export function AddServiceDialog({ open, onOpenChange, onServiceAdd }: AddServiceDialogProps) {
  const [iconUrl, setIconUrl] = useState<string>('');
  const [titles, setTitles] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Vérifier qu'une icône est uploadée
    if (!iconUrl.trim()) {
      newErrors.icon = 'Une icône est requise';
    }
    
    // Vérifier qu'au moins un titre est rempli
    const hasTitle = Object.values(titles).some(t => t?.trim());
    if (!hasTitle) {
      newErrors.title = 'Au moins un titre est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddService = () => {
    if (!validateForm()) return;

    const newService: ServiceItem = {
      id: `service_${Date.now()}`,
      iconUrl: iconUrl,
      title: titles
    };

    onServiceAdd(newService);
    handleClose();
  };

  const handleClose = () => {
    setIconUrl('');
    setTitles({});
    setErrors({});
    onOpenChange(false);
  };


  const handleIconChange = (newIconUrl: string) => {
    setIconUrl(newIconUrl);
    if (errors.icon) {
      setErrors(prev => ({ ...prev, icon: '' }));
    }
  };

  const handleIconRemove = () => {
    setIconUrl('');
  };

  const getCompletionBadges = () => {
    const hasTitle = Object.values(titles).some(t => t?.trim());
    
    return (
      <div className="flex flex-wrap gap-2">
        <Badge variant={iconUrl ? "default" : "secondary"} className="text-xs">
          <Check className="h-3 w-3 mr-1" />
          Icône: {iconUrl ? 'Uploadée' : 'Manquante'}
        </Badge>
        <Badge variant={hasTitle ? "default" : "secondary"} className="text-xs">
          <Check className="h-3 w-3 mr-1" />
          Titre: {hasTitle ? 'Défini' : 'Manquant'}
        </Badge>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-primary/10">
              {iconUrl ? (
                <img src={iconUrl} alt="Icône" className="h-5 w-5 object-contain" />
              ) : (
                <ImageIcon className="h-5 w-5 text-primary" />
              )}
            </div>
            Ajouter un nouveau service
          </DialogTitle>
          <DialogDescription>
            Créez un service avec icône et titre multilingue.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Progression */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Progression</Label>
            {getCompletionBadges()}
          </div>

          {/* Upload d'icône */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Icône du service *</Label>
              {errors.icon && (
                <div className="flex items-center gap-1 text-red-600">
                  <AlertCircle className="h-3 w-3" />
                  <span className="text-xs">{errors.icon}</span>
                </div>
              )}
            </div>
            <IconUpload
              currentIconUrl={iconUrl}
              onIconChange={handleIconChange}
              onRemove={handleIconRemove}
            />
          </div>


          {/* Titre multilingue */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Titre du service *</Label>
              {errors.title && (
                <div className="flex items-center gap-1 text-red-600">
                  <AlertCircle className="h-3 w-3" />
                  <span className="text-xs">{errors.title}</span>
                </div>
              )}
            </div>
            <MultilingualInput
              value={titles}
              onChange={(newTitles) => {
                setTitles(newTitles);
                if (errors.title && Object.values(newTitles).some(t => t?.trim())) {
                  setErrors(prev => ({ ...prev, title: '' }));
                }
              }}
              placeholder="Nom du service (ex: Livraison express)"
              type="input"
              required
            />
          </div>

        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Annuler
          </Button>
          <Button onClick={handleAddService}>
            Ajouter le service
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
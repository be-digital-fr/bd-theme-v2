'use client';

import { useState } from 'react';
import { useSiteSettingsStore } from '@/stores/useSiteSettingsStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, HelpCircle, Plus, Trash2, GripVertical, ExternalLink, Menu, Edit2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface MenuItemDialogProps {
  item?: any;
  type: 'main' | 'footer';
  onSave: (item: any) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supportedLanguages: string[];
  isMultilingual: boolean;
}

function MenuItemDialog({ item, type, onSave, open, onOpenChange, supportedLanguages, isMultilingual }: MenuItemDialogProps) {
  const [formData, setFormData] = useState(() => ({
    label: item?.label || supportedLanguages.reduce((acc, lang) => ({ ...acc, [lang]: '' }), {}),
    slug: item?.slug || '',
    href: item?.href || '',
    isExternal: item?.isExternal || false,
    openInNewTab: item?.openInNewTab || false,
    isActive: item?.isActive !== false,
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate labels
    const hasAtLeastOneLabel = Object.values(formData.label).some((label: any) => label.trim() !== '');
    if (!hasAtLeastOneLabel) {
      newErrors.label = 'Au moins un libellé est requis';
    }

    // Validate slug (main menu only)
    if (type === 'main' && !formData.slug.trim()) {
      newErrors.slug = 'Le slug est requis pour le menu principal';
    }

    // Validate URL
    if (!formData.href.trim()) {
      newErrors.href = 'L\'URL est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      onOpenChange(false);
    }
  };

  const updateLabel = (lang: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      label: { ...prev.label, [lang]: value }
    }));
    if (errors.label) {
      setErrors(prev => ({ ...prev, label: '' }));
    }
  };

  const languageNames: Record<string, string> = {
    fr: 'Français', en: 'English', es: 'Español',
    de: 'Deutsch', it: 'Italiano', pt: 'Português', ar: 'العربية'
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{item ? 'Modifier' : 'Ajouter'} un élément de menu</DialogTitle>
          <DialogDescription>
            Configurez les propriétés de l'élément de menu {type === 'main' ? 'principal' : 'du footer'}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Labels multilingues */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Libellé du menu *
            </Label>
            {isMultilingual ? (
              <div className="space-y-2">
                {supportedLanguages.map((lang) => (
                  <div key={lang} className="flex items-center gap-2">
                    <Label className="text-xs w-20">{languageNames[lang]}</Label>
                    <Input
                      value={formData.label[lang] || ''}
                      onChange={(e) => updateLabel(lang, e.target.value)}
                      placeholder={`Libellé en ${languageNames[lang].toLowerCase()}`}
                      className={errors.label ? 'border-red-500' : ''}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <Input
                value={formData.label.fr || ''}
                onChange={(e) => updateLabel('fr', e.target.value)}
                placeholder="Libellé du menu"
                className={errors.label ? 'border-red-500' : ''}
              />
            )}
            {errors.label && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.label}
              </p>
            )}
          </div>

          {/* Slug (main menu only) */}
          {type === 'main' && (
            <div className="space-y-2">
              <Label htmlFor="slug" className="text-sm font-medium">
                Slug (identifiant URL) *
              </Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, slug: e.target.value }));
                  if (errors.slug) setErrors(prev => ({ ...prev, slug: '' }));
                }}
                placeholder="exemple-page"
                className={errors.slug ? 'border-red-500' : ''}
              />
              {errors.slug && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.slug}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Utilisé pour identifier uniquement cet élément dans l'URL
              </p>
            </div>
          )}

          {/* URL */}
          <div className="space-y-2">
            <Label htmlFor="href" className="text-sm font-medium">
              URL de destination *
            </Label>
            <div className="flex gap-2">
              <Input
                id="href"
                value={formData.href}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, href: e.target.value }));
                  if (errors.href) setErrors(prev => ({ ...prev, href: '' }));
                }}
                placeholder="/page ou https://exemple.com"
                className={cn('flex-1', errors.href ? 'border-red-500' : '')}
              />
              {formData.isExternal && (
                <Badge variant="secondary" className="self-center">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Externe
                </Badge>
              )}
            </div>
            {errors.href && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.href}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Commencez par / pour les liens internes, ou https:// pour les liens externes
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Options</Label>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="external" className="text-sm font-normal">
                  Lien externe
                </Label>
                <Switch
                  id="external"
                  checked={formData.isExternal}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isExternal: checked }))}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Active si le lien pointe vers un site externe
              </p>
            </div>

            {type === 'main' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="newtab" className="text-sm font-normal">
                    Ouvrir dans un nouvel onglet
                  </Label>
                  <Switch
                    id="newtab"
                    checked={formData.openInNewTab}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, openInNewTab: checked }))}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Le lien s'ouvrira dans une nouvelle fenêtre
                </p>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="active" className="text-sm font-normal">
                  Élément actif
                </Label>
                <Switch
                  id="active"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Désactiver pour masquer temporairement sans supprimer
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSave}>
            {item ? 'Enregistrer' : 'Ajouter'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function NavigationSettingsSection() {
  const { formData, updateField, hasFieldError, getFieldError, clearError } = useSiteSettingsStore();
  
  const [mainMenuDialog, setMainMenuDialog] = useState({ open: false, item: null, index: -1 });
  const [footerMenuDialog, setFooterMenuDialog] = useState({ open: false, item: null, index: -1 });

  const navigationSettings = formData.navigation || {};
  const supportedLanguages = formData.general?.supportedLanguages || ['fr'];
  const isMultilingual = formData.general?.isMultilingual || false;

  const updateNavigationField = (field: string, value: any) => {
    const newNavigationSettings = {
      ...navigationSettings,
      [field]: value
    };
    updateField('navigation', newNavigationSettings);
    clearError(`navigation.${field}`);
  };

  const updateMobileMenuTitle = (languageCode: string, text: string) => {
    const currentTitles = navigationSettings.mobileMenuTitle || {};
    const newTitles = {
      ...currentTitles,
      [languageCode]: text
    };
    updateNavigationField('mobileMenuTitle', newTitles);
  };

  const handleMainMenuSave = (itemData: any) => {
    const currentItems = navigationSettings.menuItems || [];
    
    if (mainMenuDialog.index >= 0) {
      // Edit existing
      const newItems = [...currentItems];
      newItems[mainMenuDialog.index] = {
        ...newItems[mainMenuDialog.index],
        ...itemData,
        id: newItems[mainMenuDialog.index].id || Date.now().toString(),
        order: mainMenuDialog.index
      };
      updateNavigationField('menuItems', newItems);
    } else {
      // Add new
      const newItem = {
        ...itemData,
        id: Date.now().toString(),
        order: currentItems.length
      };
      updateNavigationField('menuItems', [...currentItems, newItem]);
    }
    
    setMainMenuDialog({ open: false, item: null, index: -1 });
  };

  const handleFooterMenuSave = (itemData: any) => {
    const currentItems = navigationSettings.footerMenuItems || [];
    
    if (footerMenuDialog.index >= 0) {
      // Edit existing
      const newItems = [...currentItems];
      newItems[footerMenuDialog.index] = {
        ...newItems[footerMenuDialog.index],
        ...itemData,
        id: newItems[footerMenuDialog.index].id || Date.now().toString(),
        order: footerMenuDialog.index
      };
      updateNavigationField('footerMenuItems', newItems);
    } else {
      // Add new
      const newItem = {
        ...itemData,
        id: Date.now().toString(),
        order: currentItems.length
      };
      updateNavigationField('footerMenuItems', [...currentItems, newItem]);
    }
    
    setFooterMenuDialog({ open: false, item: null, index: -1 });
  };

  const removeMenuItem = (type: 'main' | 'footer', index: number) => {
    const field = type === 'main' ? 'menuItems' : 'footerMenuItems';
    const currentItems = navigationSettings[field] || [];
    const newItems = currentItems.filter((_: any, i: number) => i !== index);
    updateNavigationField(field, newItems);
  };

  const addMenuItem = (type: 'main' | 'footer') => {
    if (type === 'main') {
      setMainMenuDialog({ open: true, item: null, index: -1 });
    } else {
      setFooterMenuDialog({ open: true, item: null, index: -1 });
    }
  };

  const openEditDialog = (type: 'main' | 'footer', item: any, index: number) => {
    if (type === 'main') {
      setMainMenuDialog({ open: true, item, index });
    } else {
      setFooterMenuDialog({ open: true, item, index });
    }
  };

  const MenuItemCard = ({ 
    item, 
    index, 
    type 
  }: { 
    item: any; 
    index: number; 
    type: 'main' | 'footer' 
  }) => {
    const primaryLabel = isMultilingual 
      ? item.label?.[supportedLanguages[0]] || item.label?.fr || ''
      : item.label?.fr || '';

    return (
      <div className="flex items-center gap-3 p-3 border rounded-lg bg-background">
        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm truncate">{primaryLabel || 'Sans titre'}</span>
            {!item.isActive && (
              <Badge variant="secondary" className="text-xs">Désactivé</Badge>
            )}
            {item.isExternal && (
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground truncate">{item.href || 'Pas d\'URL'}</span>
            {type === 'main' && item.slug && (
              <>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">slug: {item.slug}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openEditDialog(type, item, index)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeMenuItem(type, index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Mobile Menu Title */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Menu mobile</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Titre affiché dans le menu mobile hamburger</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardDescription>
            Configurez le titre du menu mobile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isMultilingual ? (
            <div className="grid gap-3 md:grid-cols-2">
              {supportedLanguages.map((langCode) => {
                const languageNames: Record<string, string> = {
                  fr: 'Français', en: 'English', es: 'Español',
                  de: 'Deutsch', it: 'Italiano', pt: 'Português', ar: 'العربية'
                };
                
                return (
                  <div key={langCode} className="space-y-2">
                    <Label className="text-sm">
                      {languageNames[langCode] || langCode.toUpperCase()}
                    </Label>
                    <Input
                      value={navigationSettings.mobileMenuTitle?.[langCode] || ''}
                      onChange={(e) => updateMobileMenuTitle(langCode, e.target.value)}
                      placeholder={langCode === 'fr' ? 'Menu' : 'Menu'}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              <Label className="text-sm">Titre du menu</Label>
              <Input
                value={navigationSettings.mobileMenuTitle?.fr || ''}
                onChange={(e) => updateMobileMenuTitle('fr', e.target.value)}
                placeholder="Menu"
              />
            </div>
          )}
          
          <p className="text-xs text-muted-foreground">
            Ce titre apparaît en haut du menu mobile sur les petits écrans
          </p>
        </CardContent>
      </Card>

      {/* Main Menu Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Menu principal</CardTitle>
              <CardDescription>
                Liens de navigation dans le header
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addMenuItem('main')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un lien
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {navigationSettings.menuItems?.length > 0 ? (
            <div className="space-y-2">
              {navigationSettings.menuItems.map((item: any, index: number) => (
                <MenuItemCard
                  key={item.id || index}
                  item={item}
                  index={index}
                  type="main"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <Alert>
                <Menu className="h-4 w-4" />
                <AlertDescription>
                  Aucun élément de menu principal configuré. 
                  Cliquez sur "Ajouter un lien" pour commencer.
                </AlertDescription>
              </Alert>
              <div className="p-4 border border-dashed rounded-lg bg-muted/30">
                <p className="text-sm text-muted-foreground mb-2">Exemples de liens pour un restaurant :</p>
                <ul className="text-xs space-y-1 text-muted-foreground ml-4 list-disc">
                  <li>Accueil (/) - Page d'accueil</li>
                  <li>Notre carte (/menu) - Menu du restaurant</li>
                  <li>Réservation (/reservation) - Réserver une table</li>
                  <li>À propos (/a-propos) - Notre histoire</li>
                  <li>Contact (/contact) - Nous joindre</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer Menu Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Menu footer</CardTitle>
              <CardDescription>
                Liens dans le pied de page
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addMenuItem('footer')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un lien
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {navigationSettings.footerMenuItems?.length > 0 ? (
            <div className="space-y-2">
              {navigationSettings.footerMenuItems.map((item: any, index: number) => (
                <MenuItemCard
                  key={item.id || index}
                  item={item}
                  index={index}
                  type="footer"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <Alert>
                <Menu className="h-4 w-4" />
                <AlertDescription>
                  Aucun élément de menu footer configuré. 
                  Les liens du footer sont optionnels.
                </AlertDescription>
              </Alert>
              <div className="p-4 border border-dashed rounded-lg bg-muted/30">
                <p className="text-sm text-muted-foreground mb-2">Suggestions pour le pied de page :</p>
                <ul className="text-xs space-y-1 text-muted-foreground ml-4 list-disc">
                  <li>Mentions légales (/mentions-legales)</li>
                  <li>Politique de confidentialité (/confidentialite)</li>
                  <li>Conditions générales (/cgv)</li>
                  <li>Plan du site (/sitemap)</li>
                  <li>Recrutement (/carriere)</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Dialogs */}
      <MenuItemDialog
        item={mainMenuDialog.item}
        type="main"
        onSave={handleMainMenuSave}
        open={mainMenuDialog.open}
        onOpenChange={(open) => !open && setMainMenuDialog({ open: false, item: null, index: -1 })}
        supportedLanguages={supportedLanguages}
        isMultilingual={isMultilingual}
      />
      
      <MenuItemDialog
        item={footerMenuDialog.item}
        type="footer"
        onSave={handleFooterMenuSave}
        open={footerMenuDialog.open}
        onOpenChange={(open) => !open && setFooterMenuDialog({ open: false, item: null, index: -1 })}
        supportedLanguages={supportedLanguages}
        isMultilingual={isMultilingual}
      />
    </div>
  );
}
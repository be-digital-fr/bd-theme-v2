'use client';

import { useState } from 'react';
import { useSiteSettingsStore } from '@/stores/useSiteSettingsStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import form sections
import { GeneralSettingsSection } from './sections/GeneralSettingsSection';
import { HeaderSettingsSection } from './sections/HeaderSettingsSection';
import { LanguageSettingsSection } from './sections/LanguageSettingsSection';
import { NavigationSettingsSection } from './sections/NavigationSettingsSection';

export function SettingsForm() {
  const { 
    errors, 
    hasFieldError, 
    hasChanges, 
    isValid, 
    lastSaved 
  } = useSiteSettingsStore();
  const [activeTab, setActiveTab] = useState('general');

  // Count errors per section
  const getErrorCount = (section: string) => {
    const errorKeys = Object.keys(errors);
    let count = 0;

    switch (section) {
      case 'general':
        count = errorKeys.filter(key => 
          key.includes('title') || 
          key.includes('isMultilingual') || 
          key.includes('supportedLanguages') || 
          key.includes('defaultLanguage')
        ).length;
        break;
      
      case 'header':
        count = errorKeys.filter(key => key.includes('header')).length;
        break;
        
      case 'languages':
        count = errorKeys.filter(key => 
          key.includes('language') || key.includes('chooseLangText')
        ).length;
        break;
        
      case 'navigation':
        count = errorKeys.filter(key => 
          key.includes('navigation') || key.includes('menu')
        ).length;
        break;
    }

    return count;
  };

  const tabs = [
    {
      id: 'general',
      label: 'Général',
      description: 'Paramètres de base du site',
      errorCount: getErrorCount('general'),
    },
    {
      id: 'header',
      label: 'Header',
      description: 'Logo et navigation principale',
      errorCount: getErrorCount('header'),
    },
    {
      id: 'languages',
      label: 'Langues',
      description: 'Configuration multilingue',
      errorCount: getErrorCount('languages'),
    },
    {
      id: 'navigation',
      label: 'Navigation',
      description: 'Menus et liens',
      errorCount: getErrorCount('navigation'),
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Main Form Content */}
      <div className="lg:col-span-8">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Configuration du site</CardTitle>
            <CardDescription>
              Personnalisez l'apparence et le comportement de votre site restaurant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* Tabs Navigation */}
              <TabsList className="grid w-full grid-cols-4 mb-8">
                {tabs.map((tab) => (
                  <TabsTrigger 
                    key={tab.id}
                    value={tab.id}
                    className={cn(
                      'flex items-center gap-2 text-sm font-medium',
                      tab.errorCount > 0 && 'text-red-600 data-[state=active]:text-red-700'
                    )}
                  >
                    <span>{tab.label}</span>
                    {tab.errorCount > 0 && (
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        <Badge 
                          variant="destructive" 
                          className="h-5 w-5 p-0 text-xs flex items-center justify-center"
                        >
                          {tab.errorCount}
                        </Badge>
                      </div>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Tab Contents */}
              <TabsContent value="general" className="space-y-6">
                <GeneralSettingsSection />
              </TabsContent>

              <TabsContent value="header" className="space-y-6">
                <HeaderSettingsSection />
              </TabsContent>

              <TabsContent value="languages" className="space-y-6">
                <LanguageSettingsSection />
              </TabsContent>

              <TabsContent value="navigation" className="space-y-6">
                <NavigationSettingsSection />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-4 space-y-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button
              onClick={() => setActiveTab('general')}
              className="w-full text-left p-3 rounded-md hover:bg-muted transition-colors text-sm"
            >
              <div className="font-medium">Informations de base</div>
              <div className="text-muted-foreground">Titre et langues</div>
            </button>
            
            <button
              onClick={() => setActiveTab('header')}
              className="w-full text-left p-3 rounded-md hover:bg-muted transition-colors text-sm"
            >
              <div className="font-medium">Personnaliser le header</div>
              <div className="text-muted-foreground">Logo et style</div>
            </button>
            
            <button
              onClick={() => setActiveTab('navigation')}
              className="w-full text-left p-3 rounded-md hover:bg-muted transition-colors text-sm"
            >
              <div className="font-medium">Gérer les menus</div>
              <div className="text-muted-foreground">Navigation et liens</div>
            </button>
          </CardContent>
        </Card>

        {/* Status Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">État des modifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Modifications en attente</span>
              <Badge variant={hasChanges ? 'default' : 'secondary'}>
                {hasChanges ? 'Oui' : 'Non'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span>Formulaire valide</span>
              <Badge variant={isValid ? 'default' : 'destructive'}>
                {isValid ? 'Oui' : 'Non'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span>Erreurs de validation</span>
              <Badge variant={Object.keys(errors).length > 0 ? 'destructive' : 'secondary'}>
                {Object.keys(errors).length}
              </Badge>
            </div>

            {lastSaved && (
              <div className="text-xs text-muted-foreground pt-2 border-t">
                Dernière sauvegarde : {lastSaved.toLocaleTimeString()}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Aide</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              Configurez ici tous les paramètres essentiels de votre site restaurant.
            </p>
            <p>
              Les modifications sont sauvegardées automatiquement lorsque vous cliquez sur "Enregistrer".
            </p>
            <p>
              En cas d'erreur, consultez les messages d'aide qui apparaissent sous chaque champ.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
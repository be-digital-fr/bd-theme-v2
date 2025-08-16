'use client';

import { useState } from 'react';
import { useHomeContentStore } from '@/stores/useHomeContentStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import sections
import { HeroSection } from './sections/HeroSection';
import { FeaturesSection } from './sections/FeaturesSection';
import { SeoSection } from './sections/SeoSection';

export function HomeContentForm() {
  const { 
    errors, 
    hasChanges, 
    isValid, 
    lastSaved, 
    hasFieldError 
  } = useHomeContentStore();
  const [activeTab, setActiveTab] = useState('hero');

  // Count errors per section
  const getErrorCount = (section: string) => {
    const errorKeys = Object.keys(errors);
    let count = 0;

    switch (section) {
      case 'hero':
        count = errorKeys.filter(key => 
          key.includes('hero') || 
          key.includes('primary') || 
          key.includes('secondary')
        ).length;
        break;
      
      case 'features':
        count = errorKeys.filter(key => 
          key.includes('feature') || key.includes('icon')
        ).length;
        break;
        
      case 'seo':
        count = errorKeys.filter(key => 
          key.includes('seo') || key.includes('title') || key.includes('description')
        ).length;
        break;
    }

    return count;
  };

  const tabs = [
    {
      id: 'hero',
      label: 'Bannière Hero',
      description: 'Titre, description et boutons',
      errorCount: getErrorCount('hero'),
    },
    {
      id: 'features',
      label: 'Services',
      description: 'Liste des services avec icônes',
      errorCount: getErrorCount('features'),
    },
    {
      id: 'seo',
      label: 'SEO',
      description: 'Métadonnées et référencement',
      errorCount: getErrorCount('seo'),
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Main Form Content */}
      <div className="lg:col-span-8">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Contenu de la page d'accueil</CardTitle>
            <CardDescription>
              Personnalisez le contenu et l'apparence de votre page d'accueil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* Tabs Navigation */}
              <TabsList className="grid w-full grid-cols-3 mb-8">
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
              <TabsContent value="hero" className="space-y-6">
                <HeroSection />
              </TabsContent>

              <TabsContent value="features" className="space-y-6">
                <FeaturesSection />
              </TabsContent>

              <TabsContent value="seo" className="space-y-6">
                <SeoSection />
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
              onClick={() => setActiveTab('hero')}
              className="w-full text-left p-3 rounded-md hover:bg-muted transition-colors text-sm"
            >
              <div className="font-medium">Bannière principale</div>
              <div className="text-muted-foreground">Titre et boutons</div>
            </button>
            
            <button
              onClick={() => setActiveTab('features')}
              className="w-full text-left p-3 rounded-md hover:bg-muted transition-colors text-sm"
            >
              <div className="font-medium">Services</div>
              <div className="text-muted-foreground">Icônes et descriptions</div>
            </button>
            
            <button
              onClick={() => setActiveTab('seo')}
              className="w-full text-left p-3 rounded-md hover:bg-muted transition-colors text-sm"
            >
              <div className="font-medium">SEO</div>
              <div className="text-muted-foreground">Référencement</div>
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
              Configurez ici le contenu de votre page d'accueil.
            </p>
            <p>
              Les modifications sont sauvegardées automatiquement lorsque vous cliquez sur "Sauvegarder".
            </p>
            <p>
              Les champs multilingues s'adaptent aux langues configurées dans les réglages du site.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
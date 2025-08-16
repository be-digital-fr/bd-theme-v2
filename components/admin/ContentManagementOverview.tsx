'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Shield, 
  Languages, 
  ArrowRight,
  FileText,
  Globe,
  Navigation,
  Palette
} from 'lucide-react';
import Link from 'next/link';

interface SchemaOverviewCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  status: 'active' | 'draft' | 'inactive';
  fields: number;
  lastModified?: string;
}

const schemaCards: SchemaOverviewCard[] = [
  {
    id: 'settings',
    title: 'Paramètres du site',
    description: 'Configuration générale, header, langues et navigation du site',
    icon: Settings,
    href: '/admin/content-management/settings',
    status: 'active',
    fields: 12,
    lastModified: 'Hier',
  },
  {
    id: 'authSettings',
    title: 'Paramètres d\'authentification',
    description: 'Configuration des fournisseurs OAuth et options d\'authentification',
    icon: Shield,
    href: '/admin/content-management/auth-settings',
    status: 'active',
    fields: 8,
    lastModified: 'Il y a 3 jours',
  },
];

const comingSoonCards = [
  {
    title: 'Traductions',
    description: 'Gérer les traductions des textes d\'interface',
    icon: Languages,
    fields: 45,
  },
  {
    title: 'Contenu éditorial',
    description: 'Articles, pages et contenu rédactionnel',
    icon: FileText,
    fields: 25,
  },
];

function StatusBadge({ status }: { status: string }) {
  const variants = {
    active: 'bg-green-100 text-green-800 border-green-200',
    draft: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    inactive: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const labels = {
    active: 'Actif',
    draft: 'Brouillon',
    inactive: 'Inactif',
  };

  return (
    <Badge 
      variant="outline" 
      className={variants[status as keyof typeof variants]}
    >
      {labels[status as keyof typeof labels]}
    </Badge>
  );
}

export function ContentManagementOverview() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion de contenu</h1>
          <p className="text-muted-foreground text-lg">
            Gérez le contenu et la configuration de votre site
          </p>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{schemaCards.length} schémas actifs</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>Interface moderne inspirée de Sanity</span>
          </div>
        </div>
      </div>

      {/* Schémas disponibles */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Schémas disponibles</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {schemaCards.map((schema) => {
              const Icon = schema.icon;
              return (
                <Card key={schema.id} className="group hover:shadow-lg transition-all duration-200 border-border">
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {schema.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <StatusBadge status={schema.status} />
                            <Badge variant="secondary" className="text-xs">
                              {schema.fields} champs
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <CardDescription className="text-sm leading-relaxed">
                      {schema.description}
                    </CardDescription>
                    
                    <div className="flex items-center justify-between pt-2">
                      {schema.lastModified && (
                        <span className="text-xs text-muted-foreground">
                          Modifié {schema.lastModified}
                        </span>
                      )}
                      
                      <Button asChild size="sm" className="ml-auto">
                        <Link href={schema.href}>
                          Modifier
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* À venir */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Palette className="h-5 w-5" />
            À venir
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {comingSoonCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Card key={index} className="opacity-60">
                  <CardHeader className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{card.title}</CardTitle>
                        <Badge variant="outline" className="text-xs mt-1">
                          {card.fields} champs prévus
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <CardDescription className="text-sm">
                      {card.description}
                    </CardDescription>
                    <div className="mt-4">
                      <Button size="sm" variant="outline" disabled>
                        Bientôt disponible
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Info complémentaire */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Navigation className="h-5 w-5 text-blue-600" />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Interface moderne et intuitive</h3>
              <p className="text-sm text-muted-foreground">
                Cette interface génère automatiquement des formulaires à partir des schémas Sanity, 
                offrant une expérience d'édition moderne et professionnelle similaire à Sanity Studio.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
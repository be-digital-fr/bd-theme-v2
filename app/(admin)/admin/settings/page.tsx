import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminPreferencesModal } from "@/components/admin-preferences-modal";
import { Settings, Globe, Users, Bell, Shield, Database } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configuration</h2>
        <p className="text-muted-foreground">
          Gérez les paramètres et préférences de votre site
        </p>
      </div>

      {/* Settings Sections */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Multilingual Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Préférences multilingues</CardTitle>
                  <CardDescription>
                    Configuration des langues et localisation
                  </CardDescription>
                </div>
              </div>
              <AdminPreferencesModal>
                <Button variant="outline" size="sm">
                  Configurer
                </Button>
              </AdminPreferencesModal>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Mode multilingue</span>
                <Badge variant="default">Activé</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Langue par défaut</span>
                <Badge variant="outline">Français</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Langues supportées</span>
                <div className="flex gap-1">
                  <Badge variant="outline" className="text-xs">FR</Badge>
                  <Badge variant="outline" className="text-xs">EN</Badge>
                  <Badge variant="outline" className="text-xs">ES</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Gestion des utilisateurs</CardTitle>
                <CardDescription>
                  Paramètres et permissions des utilisateurs
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Inscription ouverte</span>
                <Badge variant="default">Activée</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Vérification email</span>
                <Badge variant="secondary">Désactivée</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Authentification sociale</span>
                <Badge variant="outline">Google, Facebook</Badge>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4">
              Gérer les utilisateurs
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Bell className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Notifications</CardTitle>
                <CardDescription>
                  Configuration des alertes et notifications
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Notifications email</span>
                <Badge variant="default">Activées</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Alertes système</span>
                <Badge variant="default">Activées</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Rapports hebdomadaires</span>
                <Badge variant="secondary">Désactivés</Badge>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4">
              Configurer
            </Button>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Shield className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Sécurité</CardTitle>
                <CardDescription>
                  Paramètres de sécurité et accès
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Authentification à 2 facteurs</span>
                <Badge variant="secondary">Désactivée</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Sessions expirées</span>
                <Badge variant="outline">7 jours</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Tentatives de connexion</span>
                <Badge variant="default">Limitées</Badge>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4">
              Configurer
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Database className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Informations système</CardTitle>
              <CardDescription>
                État du système et diagnostics
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Version de l'application</span>
                <Badge variant="outline">v1.0.0</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Base de données</span>
                <Badge variant="default">Connectée</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Sanity CMS</span>
                <Badge variant="default">Opérationnel</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Dernière sauvegarde</span>
                <Badge variant="outline">Il y a 2h</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Espace disque utilisé</span>
                <Badge variant="outline">23.4 GB</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Uptime</span>
                <Badge variant="default">99.9%</Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm">
              Voir les logs
            </Button>
            <Button variant="outline" size="sm">
              Créer une sauvegarde
            </Button>
            <Button variant="outline" size="sm">
              Diagnostics
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>
            Accès rapide aux outils d'administration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Settings className="h-6 w-6" />
              Configuration générale
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Globe className="h-6 w-6" />
              Langues
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Users className="h-6 w-6" />
              Utilisateurs
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Shield className="h-6 w-6" />
              Sécurité
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
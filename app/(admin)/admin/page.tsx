'use client';

import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  ShoppingBag, 
  FileText, 
  TrendingUp,
  UserCheck,
  Package,
  AlertCircle,
  Clock,
  Settings,
  BarChart3
} from "lucide-react";
import { usePageHeader } from "@/components/admin/layout/DashboardHeader";

export default function AdminDashboard() {
  const { setHeader, reset } = usePageHeader();

  // Mock data - will be replaced with real data later
  const stats = {
    totalUsers: 156,
    newUsersThisWeek: 12,
    totalOrders: 89,
    pendingOrders: 5,
    totalProducts: 45,
    lowStockProducts: 3,
    totalRevenue: 4567.89,
    revenueGrowth: 12.5,
  };

  // Configure header
  useEffect(() => {
    setHeader({
      title: 'Dashboard',
      description: 'Vue d\'ensemble de votre restaurant',
      breadcrumbs: [
        { label: 'Administration' },
        { label: 'Dashboard' },
      ],
      actions: [
        {
          id: 'settings',
          label: 'Réglages',
          variant: 'outline',
          icon: <Settings className="h-4 w-4" />,
          onClick: () => window.location.href = '/admin/site-settings',
        },
        {
          id: 'analytics',
          label: 'Analytics',
          variant: 'default',
          icon: <BarChart3 className="h-4 w-4" />,
          onClick: () => console.log('Navigate to analytics'),
        },
      ],
    });

    // Cleanup on unmount
    return () => reset();
  }, [setHeader, reset]);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Users Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Utilisateurs totaux
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{stats.newUsersThisWeek}</span> cette semaine
            </p>
          </CardContent>
        </Card>

        {/* Orders Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Commandes
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-orange-600">{stats.pendingOrders}</span> en attente
            </p>
          </CardContent>
        </Card>

        {/* Products Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Produits
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">{stats.lowStockProducts}</span> stock faible
            </p>
          </CardContent>
        </Card>

        {/* Revenue Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Chiffre d'affaires
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalRevenue.toLocaleString('fr-FR', { 
                style: 'currency', 
                currency: 'EUR' 
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{stats.revenueGrowth}%</span> vs mois dernier
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Commandes récentes
            </CardTitle>
            <CardDescription>
              Les 5 dernières commandes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted" />
                    <div>
                      <p className="text-sm font-medium">Commande #{1000 + i}</p>
                      <p className="text-xs text-muted-foreground">Il y a {i * 5} minutes</p>
                    </div>
                  </div>
                  <Badge variant={i === 1 ? "default" : "secondary"}>
                    {i === 1 ? "En cours" : "Livrée"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Alertes système
            </CardTitle>
            <CardDescription>
              Notifications importantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-orange-100 p-1">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Stock faible</p>
                  <p className="text-xs text-muted-foreground">
                    3 produits ont un stock inférieur à 10 unités
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-blue-100 p-1">
                  <UserCheck className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nouveaux utilisateurs</p>
                  <p className="text-xs text-muted-foreground">
                    12 nouveaux comptes créés cette semaine
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 p-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Performance positive</p>
                  <p className="text-xs text-muted-foreground">
                    Les ventes ont augmenté de 12.5% ce mois-ci
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>
            Accès rapide aux fonctionnalités principales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <button className="flex flex-col items-center gap-2 rounded-lg border p-4 hover:bg-muted transition-colors">
              <FileText className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm font-medium">Ajouter un produit</span>
            </button>
            <button className="flex flex-col items-center gap-2 rounded-lg border p-4 hover:bg-muted transition-colors">
              <Users className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm font-medium">Gérer les utilisateurs</span>
            </button>
            <button className="flex flex-col items-center gap-2 rounded-lg border p-4 hover:bg-muted transition-colors">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm font-medium">Voir les commandes</span>
            </button>
            <button className="flex flex-col items-center gap-2 rounded-lg border p-4 hover:bg-muted transition-colors">
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm font-medium">Rapports</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
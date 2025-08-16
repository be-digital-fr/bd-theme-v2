import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  FileEdit,
  Video,
  Type,
  Images,
  Plus,
  TrendingUp,
  Eye,
  Calendar,
} from "lucide-react";

export default function ContentOverviewPage() {
  // Mock statistics - will be replaced with real data
  const contentStats = {
    editorial: { total: 24, published: 18, draft: 6 },
    videos: { total: 15, published: 12, draft: 3 },
    texts: { total: 45, published: 38, draft: 7 },
    images: { total: 156, used: 89, unused: 67 },
  };

  const recentContent = [
    { id: 1, title: "Nouvelle recette de pizza", type: "editorial", status: "published", date: "2024-01-15" },
    { id: 2, title: "Vidéo présentation du chef", type: "video", status: "draft", date: "2024-01-14" },
    { id: 3, title: "Menu du jour", type: "text", status: "published", date: "2024-01-14" },
    { id: 4, title: "Photos plats du jour", type: "image", status: "published", date: "2024-01-13" },
  ];

  const contentTypes = [
    {
      title: "Éditorial",
      description: "Articles de blog, actualités et contenus longs",
      icon: FileEdit,
      url: "/admin/content/editorial",
      stats: contentStats.editorial,
      color: "bg-blue-500",
    },
    {
      title: "Vidéos",
      description: "Vidéos promotionnelles et tutoriels",
      icon: Video,
      url: "/admin/content/videos",
      stats: contentStats.videos,
      color: "bg-red-500",
    },
    {
      title: "Textes",
      description: "Descriptions courtes et contenus textuels",
      icon: Type,
      url: "/admin/content/texts",
      stats: contentStats.texts,
      color: "bg-green-500",
    },
    {
      title: "Images",
      description: "Photos et illustrations",
      icon: Images,
      url: "/admin/content/images",
      stats: contentStats.images,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestion du contenu</h2>
          <p className="text-muted-foreground">
            Vue d&apos;ensemble de tous vos contenus
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau contenu
        </Button>
      </div>

      {/* Content Type Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {contentTypes.map((type) => (
          <Link key={type.title} href={type.url}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${type.color} bg-opacity-10`}>
                    <type.icon className={`h-6 w-6 ${type.color.replace('bg-', 'text-')}`} />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {type.stats.total} total
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-1">{type.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {type.description}
                </p>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">
                    {'published' in type.stats ? type.stats.published : type.stats.used} actifs
                  </span>
                  <span className="text-orange-600">
                    {'draft' in type.stats ? type.stats.draft : type.stats.unused} en attente
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Statistics Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Vues totales
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,543</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+18%</span> vs mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Engagement
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <p className="text-xs text-muted-foreground">
              Taux d&apos;interaction moyen
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Dernière mise à jour
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Aujourd&apos;hui</div>
            <p className="text-xs text-muted-foreground">
              Il y a 2 heures
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Content */}
      <Card>
        <CardHeader>
          <CardTitle>Contenus récents</CardTitle>
          <CardDescription>
            Les derniers contenus ajoutés ou modifiés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentContent.map((content) => (
              <div key={content.id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded bg-muted" />
                  <div>
                    <p className="font-medium">{content.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {content.type} • {new Date(content.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={content.status === 'published' ? 'default' : 'secondary'}>
                    {content.status === 'published' ? 'Publié' : 'Brouillon'}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    Voir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
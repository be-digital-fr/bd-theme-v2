import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Upload, Play, Edit, Trash } from "lucide-react";

export default function VideosContentPage() {
  // Mock data - will be replaced with real data from Prisma
  const videos = [
    {
      id: 1,
      title: "Présentation du restaurant",
      duration: "2:30",
      status: "published",
      thumbnail: "/api/placeholder/320/180",
      views: 1234,
      uploadedAt: "2024-01-15",
    },
    {
      id: 2,
      title: "Recette signature du chef",
      duration: "5:45",
      status: "draft",
      thumbnail: "/api/placeholder/320/180",
      views: 0,
      uploadedAt: "2024-01-14",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Vidéos</h2>
          <p className="text-muted-foreground">
            Gérez vos contenus vidéo
          </p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Uploader une vidéo
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une vidéo..."
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      {/* Videos Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden">
            <div className="relative aspect-video bg-muted">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/50 rounded-full p-3">
                  <Play className="h-6 w-6 text-white" />
                </div>
              </div>
              <Badge className="absolute top-2 right-2">
                {video.duration}
              </Badge>
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base">{video.title}</CardTitle>
                  <CardDescription>
                    {video.views} vues • {new Date(video.uploadedAt).toLocaleDateString("fr-FR")}
                  </CardDescription>
                </div>
                <Badge variant={video.status === "published" ? "default" : "secondary"}>
                  {video.status === "published" ? "Publié" : "Brouillon"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Play className="mr-2 h-4 w-4" />
                  Aperçu
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {videos.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Aucune vidéo</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Commencez par uploader votre première vidéo
            </p>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Uploader une vidéo
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
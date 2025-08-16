import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Upload, Edit, Trash, Download, Eye } from "lucide-react";

export default function ImagesContentPage() {
  // Mock data - will be replaced with real data from Prisma
  const images = [
    {
      id: 1,
      title: "Pizza Margherita",
      filename: "pizza-margherita.jpg",
      size: "2.4 MB",
      dimensions: "1920x1080",
      status: "published",
      category: "Menu",
      uploadedAt: "2024-01-15",
      usedIn: ["Menu", "Homepage"],
    },
    {
      id: 2,
      title: "Intérieur restaurant",
      filename: "restaurant-interior.jpg",
      size: "3.1 MB",
      dimensions: "2048x1365",
      status: "published",
      category: "Ambiance",
      uploadedAt: "2024-01-14",
      usedIn: ["À propos"],
    },
    {
      id: 3,
      title: "Chef en cuisine",
      filename: "chef-cuisine.jpg",
      size: "1.8 MB",
      dimensions: "1600x1200",
      status: "draft",
      category: "Équipe",
      uploadedAt: "2024-01-13",
      usedIn: [],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Images</h2>
          <p className="text-muted-foreground">
            Gérez votre médiathèque
          </p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Uploader des images
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une image..."
                  className="pl-8"
                />
              </div>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                <SelectItem value="menu">Menu</SelectItem>
                <SelectItem value="ambiance">Ambiance</SelectItem>
                <SelectItem value="equipe">Équipe</SelectItem>
                <SelectItem value="evenements">Évènements</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="published">Publié</SelectItem>
                <SelectItem value="draft">Brouillon</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Images Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden">
            <div className="relative aspect-square bg-muted">
              <img
                src="/api/placeholder/300/300"
                alt={image.title}
                className="object-cover w-full h-full"
              />
              <Badge
                className="absolute top-2 right-2"
                variant={image.status === "published" ? "default" : "secondary"}
              >
                {image.status === "published" ? "Publié" : "Brouillon"}
              </Badge>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm truncate">{image.title}</CardTitle>
              <CardDescription className="text-xs">
                {image.dimensions} • {image.size}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex gap-1">
                  {image.usedIn.length > 0 ? (
                    image.usedIn.slice(0, 2).map((usage, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {usage}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      Non utilisé
                    </Badge>
                  )}
                  {image.usedIn.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{image.usedIn.length - 2}
                    </Badge>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload Zone */}
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Upload className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Glissez-déposez vos images ici</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            ou cliquez pour sélectionner des fichiers
          </p>
          <Button>
            Choisir des fichiers
          </Button>
        </CardContent>
      </Card>

      {/* Empty State */}
      {images.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Aucune image</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Commencez par uploader votre première image
            </p>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Uploader des images
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
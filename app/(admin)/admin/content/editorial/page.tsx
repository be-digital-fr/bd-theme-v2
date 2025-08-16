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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Filter, Edit, Trash, Eye } from "lucide-react";

export default function EditorialContentPage() {
  // Mock data - will be replaced with real data from Prisma
  const editorialContent = [
    {
      id: 1,
      title: "L'histoire de notre restaurant",
      author: "Marie Dupont",
      status: "published",
      category: "Histoire",
      publishedAt: "2024-01-15",
      views: 234,
    },
    {
      id: 2,
      title: "Nouvelle carte d'été",
      author: "Jean Martin",
      status: "draft",
      category: "Menu",
      publishedAt: null,
      views: 0,
    },
    {
      id: 3,
      title: "Interview du chef",
      author: "Sophie Bernard",
      status: "published",
      category: "Interview",
      publishedAt: "2024-01-10",
      views: 456,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Contenu éditorial</h2>
          <p className="text-muted-foreground">
            Gérez vos articles de blog et contenus longs
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouvel article
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un article..."
                  className="pl-8"
                />
              </div>
            </div>
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
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                <SelectItem value="histoire">Histoire</SelectItem>
                <SelectItem value="menu">Menu</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="actualite">Actualité</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content Table */}
      <Card>
        <CardHeader>
          <CardTitle>Articles</CardTitle>
          <CardDescription>
            {editorialContent.length} articles au total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Auteur</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Vues</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {editorialContent.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">
                    {article.title}
                  </TableCell>
                  <TableCell>{article.author}</TableCell>
                  <TableCell>{article.category}</TableCell>
                  <TableCell>
                    <Badge
                      variant={article.status === "published" ? "default" : "secondary"}
                    >
                      {article.status === "published" ? "Publié" : "Brouillon"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {article.publishedAt
                      ? new Date(article.publishedAt).toLocaleDateString("fr-FR")
                      : "-"}
                  </TableCell>
                  <TableCell>{article.views}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Empty State (shown when no content) */}
      {editorialContent.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Filter className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Aucun article trouvé</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Commencez par créer votre premier article éditorial
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Créer un article
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
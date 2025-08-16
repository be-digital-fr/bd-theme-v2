import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Edit, Trash, Copy } from "lucide-react";

export default function TextsContentPage() {
  // Mock data - will be replaced with real data from Prisma
  const texts = [
    {
      id: 1,
      title: "Slogan principal",
      content: "Savourez l'authenticité, goûtez la tradition",
      category: "Marketing",
      status: "published",
      usedIn: ["Homepage", "Menu"],
      updatedAt: "2024-01-15",
    },
    {
      id: 2,
      title: "Description menu pizza",
      content: "Nos pizzas sont préparées avec des ingrédients frais et une pâte artisanale...",
      category: "Menu",
      status: "published",
      usedIn: ["Menu"],
      updatedAt: "2024-01-14",
    },
    {
      id: 3,
      title: "Message d'accueil",
      content: "Bienvenue chez Be Digital, votre restaurant de confiance depuis 1995.",
      category: "Accueil",
      status: "draft",
      usedIn: [],
      updatedAt: "2024-01-13",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Textes</h2>
          <p className="text-muted-foreground">
            Gérez vos contenus textuels courts
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau texte
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un texte..."
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      {/* Texts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Contenus textuels</CardTitle>
          <CardDescription>
            {texts.length} textes au total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Contenu</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Utilisé dans</TableHead>
                <TableHead>Modifié</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {texts.map((text) => (
                <TableRow key={text.id}>
                  <TableCell className="font-medium">
                    {text.title}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate">{text.content}</div>
                  </TableCell>
                  <TableCell>{text.category}</TableCell>
                  <TableCell>
                    <Badge
                      variant={text.status === "published" ? "default" : "secondary"}
                    >
                      {text.status === "published" ? "Publié" : "Brouillon"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {text.usedIn.length > 0 ? (
                        text.usedIn.map((usage, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {usage}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">Non utilisé</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(text.updatedAt).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" title="Copier">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Modifier">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Supprimer">
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Plus className="h-6 w-6" />
              Nouveau slogan
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Plus className="h-6 w-6" />
              Description menu
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Plus className="h-6 w-6" />
              Message d'accueil
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {texts.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Aucun texte trouvé</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Commencez par créer votre premier contenu textuel
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Créer un texte
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
import { requireAuth } from "@/lib/auth-actions";

export default async function DashboardPage() {
  const session = await requireAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Bienvenue sur votre tableau de bord, {session.user.name || session.user.email}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* User Info Card */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Informations du compte</h2>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">Nom:</span>
                <p className="font-medium">{session.user.name || "Non défini"}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Email:</span>
                <p className="font-medium">{session.user.email}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Email vérifié:</span>
                <p className="font-medium">
                  {session.user.emailVerified ? "✅ Oui" : "❌ Non"}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Compte créé:</span>
                <p className="font-medium">
                  {new Date(session.user.createdAt).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Actions rapides</h2>
            <div className="space-y-3">
              <a
                href="/profile"
                className="block p-3 rounded-md border border-border hover:bg-accent transition-colors"
              >
                <div className="font-medium">Modifier le profil</div>
                <div className="text-sm text-muted-foreground">
                  Mettre à jour vos informations
                </div>
              </a>
              <a
                href="/settings"
                className="block p-3 rounded-md border border-border hover:bg-accent transition-colors"
              >
                <div className="font-medium">Paramètres</div>
                <div className="text-sm text-muted-foreground">
                  Gérer vos préférences
                </div>
              </a>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Statistiques</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sessions actives</span>
                <span className="font-medium">1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dernière connexion</span>
                <span className="font-medium">Maintenant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-lg">
          <h2 className="text-xl font-semibold text-primary mb-2">
            🎉 Authentification configurée avec succès !
          </h2>
          <p className="text-muted-foreground">
            Votre système d&apos;authentification Better Auth est maintenant opérationnel. 
            Vous pouvez personnaliser cette page selon vos besoins.
          </p>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Dashboard - BD Theme",
  description: "Votre tableau de bord personnel",
};
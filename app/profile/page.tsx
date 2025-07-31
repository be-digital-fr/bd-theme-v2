import { requireAuth } from "@/lib/auth-actions";

export default async function ProfilePage() {
  const session = await requireAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Profil utilisateur</h1>
          <p className="text-muted-foreground mt-2">
            Gérez vos informations personnelles
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Informations du compte</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Nom complet
              </label>
              <p className="text-lg">{session.user.name || "Non défini"}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Adresse email
              </label>
              <p className="text-lg">{session.user.email}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Status de vérification
              </label>
              <p className="text-lg">
                {session.user.emailVerified ? (
                  <span className="text-green-600">✅ Email vérifié</span>
                ) : (
                  <span className="text-orange-600">⏳ Email non vérifié</span>
                )}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Membre depuis
              </label>
              <p className="text-lg">
                {new Date(session.user.createdAt).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Placeholder for future profile editing form */}
        <div className="mt-6 p-4 bg-muted/50 border border-border rounded-lg">
          <p className="text-sm text-muted-foreground">
            💡 <strong>À venir:</strong> Formulaire d&apos;édition du profil avec mise à jour 
            des informations personnelles.
          </p>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Profil - BD Theme",
  description: "Gérez votre profil utilisateur",
};
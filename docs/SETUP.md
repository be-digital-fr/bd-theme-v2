# Configuration du Système Multilingue

## Variables d'environnement requises

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID="your_sanity_project_id"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2025-07-05"

# Application Base URL (pour Sanity Studio)
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

## Installation et Setup

1. **Installer les dépendances :**
   ```bash
   pnpm install
   ```

2. **Configurer la base de données :**
   ```bash
   # Générer le client Prisma
   npx prisma generate
   
   # Appliquer les migrations
   npx prisma db push
   ```

3. **Démarrer l'application :**
   ```bash
   pnpm dev
   ```

## Utilisation

### 1. Configuration des préférences linguistiques

- Allez sur `http://localhost:3000`
- Cliquez sur "Configurer les préférences linguistiques"
- Activez/désactivez le mode multilingue
- Sélectionnez les langues supportées
- Définissez la langue par défaut

### 2. Gestion du contenu dans Sanity Studio

- Accédez à `http://localhost:3000/studio`
- Créez un nouveau document de type "Page d'accueil"
- Le champ "Message de bienvenue" s'adaptera automatiquement à vos préférences :
  - **Mode monolingue :** Un seul champ texte dans la langue par défaut
  - **Mode multilingue :** Un champ pour chaque langue sélectionnée

### 3. Structure des données

Les préférences sont sauvegardées dans la table `admin_preferences` :

```sql
CREATE TABLE admin_preferences (
  id TEXT PRIMARY KEY,
  isMultilingual BOOLEAN DEFAULT false,
  supportedLanguages TEXT[] DEFAULT ARRAY['fr'],
  defaultLanguage TEXT DEFAULT 'fr',
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

Le contenu Sanity s'adapte selon le mode :
- **Monolingue :** `welcoming: "Message de bienvenue"`
- **Multilingue :** `welcoming: { fr: "Bienvenue", en: "Welcome", ... }`

## Architecture

### Frontend (Next.js)
- **React Hook Form + Zod :** Validation des formulaires
- **TanStack React Query :** Gestion des données côté client
- **shadcn/ui :** Composants UI
- **Tailwind CSS :** Stylisation

### Backend
- **Prisma :** ORM pour la base de données
- **Neon :** Base de données PostgreSQL
- **API Routes :** Endpoints REST pour les préférences

### CMS (Sanity)
- **Schémas dynamiques :** S'adaptent aux préférences linguistiques
- **Composants personnalisés :** Interface de saisie multilingue
- **Studio personnalisé :** Configuration avancée

## Langues supportées

Le système supporte actuellement 7 langues :
- 🇫🇷 Français (fr)
- 🇬🇧 Anglais (en)
- 🇪🇸 Espagnol (es)
- 🇩🇪 Allemand (de)
- 🇮🇹 Italien (it)
- 🇵🇹 Portugais (pt)
- 🇸🇦 Arabe (ar)

Pour ajouter une nouvelle langue, modifiez le tableau `AVAILABLE_LANGUAGES` dans :
- `lib/schemas.ts`
- `sanity/lib/admin-preferences.ts`

## Dépannage

### Erreur de connexion à la base de données
Vérifiez que votre `DATABASE_URL` est correcte et que la base de données est accessible.

### Composant Sanity qui ne s'affiche pas
Assurez-vous que l'application Next.js est bien démarrée sur le port 3000 pour que Sanity Studio puisse appeler les APIs.

### Préférences qui ne se sauvegardent pas
Vérifiez les logs de la console pour voir les erreurs éventuelles lors des appels API.

## Développement

### Structure des fichiers

```
├── app/
│   ├── api/admin/preferences/route.ts    # API des préférences
│   ├── layout.tsx                        # Layout avec QueryProvider
│   └── page.tsx                          # Page d'accueil
├── components/
│   ├── admin-preferences-modal.tsx       # Modal de configuration
│   ├── ui/                               # Composants shadcn/ui
│   │   └── multi-select.tsx             # Sélecteur multiple
│   └── providers/
│       └── query-provider.tsx           # Provider React Query
├── hooks/
│   └── use-admin-preferences.ts         # Hooks React Query
├── lib/
│   ├── prisma.ts                        # Client Prisma
│   └── schemas.ts                       # Schémas Zod
├── sanity/
│   ├── components/
│   │   └── DynamicWelcomingInput.tsx    # Composant Sanity personnalisé
│   ├── lib/
│   │   └── admin-preferences.ts         # Utilitaires Sanity
│   └── schemaTypes/
│       ├── home.ts                      # Schéma home
│       └── index.ts                     # Export des schémas
└── prisma/
    └── schema.prisma                    # Schéma de base de données
```

### Tests

Pour tester le système :

1. **Mode monolingue :**
   - Désactivez le multilingue
   - Sélectionnez une langue par défaut
   - Vérifiez dans Sanity Studio qu'un seul champ apparaît

2. **Mode multilingue :**
   - Activez le multilingue
   - Sélectionnez plusieurs langues
   - Vérifiez dans Sanity Studio que tous les champs apparaissent

3. **Changement de configuration :**
   - Modifiez les préférences
   - Rechargez Sanity Studio
   - Vérifiez que l'interface s'adapte 
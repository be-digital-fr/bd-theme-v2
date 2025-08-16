# Organisation des Modèles Prisma

Cette documentation présente l'organisation logique des modèles Prisma pour une meilleure compréhension et maintenance.

## Structure des Domaines

Le schéma Prisma est organisé en 3 domaines fonctionnels :

### 🔐 **AUTH MODELS** - Authentification Better Auth
- `users` - Utilisateurs du système
- `accounts` - Comptes de connexion (OAuth, email/password)  
- `sessions` - Sessions utilisateur actives
- `verifications` - Tokens de vérification (email, reset password)
- `UserRole` - Rôles utilisateur (USER, EMPLOYEE, ADMIN)

### ⚙️ **ADMIN MODELS** - Préférences Admin
- `admin_preferences` - Configuration globale de l'admin
  - Langues supportées
  - Mode multilingue
  - Langue par défaut

### 🎨 **SITE SETTINGS MODELS** - Paramètres du Site (CMS)
- `site_settings` - Paramètres principaux du site
- `header_settings` - Configuration du header (logo, style, icônes)
- `language_selector_texts` - Textes du sélecteur de langue
- `navigation` - Navigation du site (menu mobile)
- `menu_items` - Éléments du menu principal
- `footer_menu_items` - Éléments du menu footer

## Fichiers de Référence

Les fichiers suivants sont fournis pour référence et organisation :

- `auth-models.md` - Détail des modèles d'authentification
- `admin-models.md` - Détail des modèles d'administration  
- `settings-models.md` - Détail des modèles de paramètres du site

## Workflow de Développement

1. **Consultation** - Référencer ces fichiers pour comprendre la structure
2. **Modification** - Éditer le schéma principal `prisma/schema.prisma`
3. **Synchronisation** - Utiliser `prisma db push` ou `prisma migrate`
4. **Génération** - Lancer `prisma generate` pour mettre à jour le client

## Note Importante

⚠️ **Prisma ne lit que le fichier principal `prisma/schema.prisma`**

Ces fichiers de documentation servent uniquement à organiser et comprendre la structure. Toute modification doit être faite dans le schéma principal.
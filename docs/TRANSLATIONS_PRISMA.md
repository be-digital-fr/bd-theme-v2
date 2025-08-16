# Système de Traductions avec Prisma

## Vue d'ensemble

Le projet utilise maintenant **Prisma + PostgreSQL** pour gérer les traductions au lieu de Sanity CMS. Ce système offre de meilleures performances et une intégration plus simple avec l'administration.

## Architecture

### Modèle de données

```prisma
model Translation {
  id        String   @id @default(cuid())
  key       String   // Clé unique (ex: "auth.signin.title")
  category  String   // Catégorie (ex: "auth", "common")
  fr        String?  // Traduction française
  en        String?  // Traduction anglaise  
  es        String?  // Traduction espagnole
  de        String?  // Traduction allemande
  it        String?  // Traduction italienne
  pt        String?  // Traduction portugaise
  ar        String?  // Traduction arabe
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### API Routes

- **GET** `/api/admin/translations?category=auth` - Récupérer les traductions
- **POST** `/api/admin/translations` - Créer/Mettre à jour une traduction

## Utilisation

### Hook principal

```typescript
import { useTranslations } from '@/hooks/useTranslations';

function MyComponent() {
  const { t, isLoading } = useTranslations('auth');
  
  return (
    <h1>{t('auth.signin.title')}</h1>
  );
}
```

### Hook spécialisé pour l'authentification

```typescript
import { useAuthTranslations } from '@/hooks/useTranslations';

function SignInForm() {
  const { translations: t, isLoading } = useAuthTranslations();
  
  return (
    <div>
      <h1>{t.title}</h1>
      <p>{t.subtitle}</p>
      <input placeholder={t.email} />
      <input placeholder={t.password} />
      <button>{t.submit}</button>
    </div>
  );
}
```

## Traductions disponibles

### Authentification (auth)

| Clé | Description |
|-----|-------------|
| `auth.signin.title` | Titre de la page de connexion |
| `auth.signin.subtitle` | Sous-titre de connexion |
| `auth.signin.email` | Placeholder email |
| `auth.signin.password` | Placeholder mot de passe |
| `auth.signin.submit` | Texte du bouton de connexion |
| `auth.signin.forgot_password` | Lien mot de passe oublié |
| `auth.signup.title` | Titre de création de compte |
| `auth.signup.submit` | Texte du bouton d'inscription |
| `auth.forgot.title` | Titre mot de passe oublié |
| `auth.notifications.*` | Messages de notification |

## Langues supportées

- 🇫🇷 **Français** (`fr`) - Langue par défaut
- 🇬🇧 **Anglais** (`en`)
- 🇪🇸 **Espagnol** (`es`) 
- 🇩🇪 **Allemand** (`de`)
- 🇮🇹 **Italien** (`it`)
- 🇵🇹 **Portugais** (`pt`)
- 🇸🇦 **Arabe** (`ar`)

## Fallback et valeurs par défaut

Le système utilise une stratégie de fallback en 4 étapes :

1. **Traduction Prisma** - Depuis la base de données
2. **Traduction par défaut** - Valeurs hardcodées dans le hook
3. **Français** - Langue de fallback
4. **Clé** - Si aucune traduction trouvée

## Scripts utiles

```bash
# Initialiser les traductions par défaut
pnpm seed:translations

# Régénérer le client Prisma
pnpm dlx prisma generate

# Appliquer les changements de schéma
pnpm dlx prisma db push
```

## Migration depuis Sanity

✅ **Composants migrés :**
- `auth-modal.tsx`
- `sign-in-form.tsx` 
- `sign-up-form.tsx`
- `forgot-password-form.tsx`
- `useAuthNotifications.ts`

✅ **Hooks supprimés :**
- `useSignInTranslations`
- `useSignUpTranslations`  
- `useForgotPasswordTranslations`
- `useAuthNotificationsTranslations`

✅ **Nouveau système :**
- `useTranslations()` - Hook principal
- `useAuthTranslations()` - Hook spécialisé auth
- `useAuthNotifications()` - Hook notifications simplifié

## Avantages

- **Performance** ⚡ Plus de requêtes externes vers Sanity
- **Simplicité** 🎯 Interface admin intégrée 
- **Flexibilité** 🔧 Facilement extensible
- **Cache** 💾 Optimisé avec React Query
- **Offline** 📱 Fonctionne sans connexion Sanity

## Développement

Pour ajouter de nouvelles traductions :

1. **Ajouter la clé** dans `DEFAULT_TRANSLATIONS`
2. **Mettre à jour l'interface** `AuthTranslations` 
3. **Seed la base** avec `pnpm seed:translations`
4. **Utiliser dans les composants** avec `t('nouvelle.cle')`
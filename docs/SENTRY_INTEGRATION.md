# Intégration Sentry pour les formulaires CRUD

Ce document explique comment Sentry a été intégré dans les formulaires CRUD pour capturer et monitorer les erreurs en temps réel.

## 🎯 Objectif

Capturer automatiquement toutes les erreurs qui se produisent dans les formulaires de l'administration (création, modification, suppression) et les envoyer à Sentry avec un contexte détaillé pour faciliter le debugging.

## 📁 Fichiers créés/modifiés

### Nouveau fichier utilitaire
- **`lib/sentry-form-errors.ts`** - Utilitaire principal pour capturer les erreurs de formulaires

### Formulaires avec Sentry intégré
- **`components/admin/categories/CreateCategoryPage.tsx`** - Création de catégories
- **`components/admin/categories/CategoryList.tsx`** - Suppression de catégories
- **`components/admin/ingredients/CreateIngredientDialog.tsx`** - Création d'ingrédients
- **`components/admin/collections/CollectionManagePage.tsx`** - Gestion des collections
- **`components/admin/home-content/HomeContentPage.tsx`** - Contenu de la page d'accueil

### Fichier de test
- **`components/admin/sentry/SentryTestPage.tsx`** - Page pour tester l'intégration

## 🛠️ Fonctionnalités

### Types d'erreurs capturées

1. **Erreurs de validation** - Champs requis, formats invalides
2. **Erreurs réseau** - Problèmes de connexion, timeouts
3. **Erreurs de base de données** - Contraintes uniques, clés étrangères
4. **Erreurs générales** - Toute autre erreur inattendue

### Contexte capturé

Pour chaque erreur, Sentry reçoit :

```typescript
{
  // Tags pour le filtrage
  tags: {
    'error.type': 'form_submission',
    'form.type': 'create' | 'update' | 'delete',
    'entity.type': 'product' | 'category' | 'ingredient' | 'collection',
    'error.category': 'validation' | 'network' | 'database' | 'unknown'
  },
  
  // Contexte détaillé
  contexts: {
    form: {
      type: 'create',
      entity: 'category',
      entityId: 'optional-id',
      timestamp: '2024-01-15T10:30:00.000Z'
    },
    formData: {
      // Données du formulaire (sensibilisées)
      name: 'Nom de la catégorie',
      description: 'Description...',
      // Les données sensibles sont masquées
    }
  },
  
  // Utilisateur (si connecté)
  user: {
    id: 'user-id'
  }
}
```

### Données sensibilisées

Les champs suivants sont automatiquement masqués :
- `password`
- `token`
- `secret`
- `key`
- `email`
- `phone`
- `ssn`
- `creditCard`

## 🚀 Utilisation

### Import de base

```typescript
import { SentryFormErrorCapture } from '@/lib/sentry-form-errors';
```

### Capture d'erreur simple

```typescript
try {
  // Opération de formulaire
  await submitForm(data);
} catch (error) {
  SentryFormErrorCapture.captureFormError(error, {
    formType: 'create',
    entityType: 'category',
    formData: data
  });
  
  toast.error('Erreur lors de la création');
}
```

### Capture d'erreurs de validation

```typescript
if (!data.name?.trim()) {
  SentryFormErrorCapture.captureValidationError([
    { field: 'name', message: 'Nom requis', value: data.name }
  ], {
    formType: 'create',
    entityType: 'category',
    formData: data
  });
  
  return;
}
```

### Capture de succès (monitoring)

```typescript
SentryFormErrorCapture.captureFormSuccess({
  formType: 'create',
  entityType: 'category',
  entityId: createdId
});
```

### Fonctions de convenance

```typescript
import { 
  captureProductFormError,
  captureCategoryFormError,
  captureIngredientFormError 
} from '@/lib/sentry-form-errors';

// Utilisation simplifiée
captureProductFormError(error, 'create', productId, formData);
```

## 📊 Monitoring dans Sentry

### Filtres utiles

- **Par type de formulaire** : `form.type:create`
- **Par entité** : `entity.type:product`
- **Par catégorie d'erreur** : `error.category:validation`
- **Erreurs critiques** : `level:error`

### Alertes recommandées

1. **Pic d'erreurs de validation** - Indique un problème UX
2. **Erreurs de base de données** - Problème de données ou de migration
3. **Erreurs réseau** - Problème d'infrastructure
4. **Erreurs sur des entités spécifiques** - Problème de code métier

## 🧪 Test de l'intégration

Utilisez la page de test pour vérifier que Sentry fonctionne :

```typescript
// Créer une route de test (développement uniquement)
// app/admin/test-sentry/page.tsx
import { SentryTestPage } from '@/components/admin/sentry/SentryTestPage';

export default function TestSentryPage() {
  if (process.env.NODE_ENV !== 'development') {
    notFound();
  }
  
  return <SentryTestPage />;
}
```

## ⚙️ Configuration

### Variables d'environnement

```env
# Client-side (obligatoire)
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
NEXT_PUBLIC_ENABLE_SENTRY=true
NEXT_PUBLIC_SENTRY_RELEASE=v1.0.0

# Server-side (obligatoire)
SENTRY_DSN=https://your-dsn@sentry.io/project-id
ENABLE_SENTRY=true
SENTRY_RELEASE=v1.0.0
```

### Configuration Sentry

Les fichiers de configuration Sentry sont déjà présents :
- `sentry.client.config.ts` - Configuration client
- `sentry.server.config.ts` - Configuration serveur

## 🔧 Personnalisation

### Ajouter un nouveau type d'entité

```typescript
// Dans lib/sentry-form-errors.ts
export const captureCustomEntityError = (
  error: Error,
  formType: FormErrorContext['formType'],
  entityId?: string,
  formData?: Record<string, any>
) => {
  SentryFormErrorCapture.captureFormError(error, {
    formType,
    entityType: 'custom-entity', // Nouveau type
    entityId,
    formData,
  });
};
```

### Modifier les champs sensibles

```typescript
// Dans SentryFormErrorCapture.sanitizeFormData()
const sensitiveFields = [
  'password',
  'token',
  // Ajouter vos champs sensibles
  'customSecretField',
];
```

## 📈 Métriques et insights

Sentry permet de suivre :

1. **Taux d'erreur par formulaire** - Identifier les formulaires problématiques
2. **Types d'erreurs les plus fréquents** - Prioriser les corrections
3. **Performance des formulaires** - Temps de réponse et success rate
4. **Tendances temporelles** - Pic d'erreurs après déploiements

## 🚨 Bonnes pratiques

1. **Ne pas capturer d'informations sensibles** - Toujours sanitizer les données
2. **Utiliser des tags cohérents** - Facilite le filtrage et les alertes
3. **Contextualiser les erreurs** - Plus d'info = debugging plus facile
4. **Monitorer les succès** - Permet de calculer des taux d'erreur
5. **Configurer des alertes** - Être notifié rapidement des problèmes

## 🔍 Debugging

### Vérifier que Sentry fonctionne

```typescript
// Test rapide dans la console du navigateur
import * as Sentry from '@sentry/nextjs';
Sentry.captureMessage('Test Sentry from console');
```

### Variables d'environnement manquantes

Si Sentry ne fonctionne pas, vérifiez :
1. `NEXT_PUBLIC_SENTRY_DSN` est défini
2. `NEXT_PUBLIC_ENABLE_SENTRY` n'est pas `false`
3. La configuration correspond à votre projet Sentry

### Erreurs silencieuses

En développement, certaines erreurs peuvent être filtrées. Vérifiez la fonction `beforeSend` dans `sentry.client.config.ts`.
# Tests Organization

Cette structure de tests est organisée par features pour une meilleure maintenabilité et clarté.

## Structure

```
tests/
├── features/                 # Tests organisés par fonctionnalité métier
│   ├── auth/                # Tests d'authentification
│   │   ├── signin.spec.ts   # Tests de connexion
│   │   ├── signup.spec.ts   # Tests d'inscription
│   │   ├── forgot-password.spec.ts
│   │   ├── social-auth.spec.ts
│   │   └── user-session.spec.ts
│   ├── admin/               # Tests d'administration
│   │   └── (à venir)
│   └── ui/                  # Tests d'interface utilisateur
│       └── (à venir)
├── shared/                  # Code partagé entre tests
│   ├── helpers/            # Fonctions utilitaires
│   │   └── auth.ts         # Helpers d'authentification
│   ├── fixtures/           # Données de test
│   │   └── (à venir)
│   └── setup/              # Configuration globale
│       ├── global-setup.ts
│       ├── global-teardown.ts
│       └── check-server.ts
└── README.md               # Ce fichier
```

## Principes d'organisation

### 1. Features
- Chaque feature a son propre dossier
- Les tests sont regroupés par fonctionnalité métier
- Facilite la navigation et la maintenance

### 2. Shared
- Code réutilisable entre différentes features
- Helpers pour éviter la duplication
- Fixtures pour les données de test communes

### 3. Naming Convention
- `*.spec.ts` pour les tests
- Noms descriptifs reflétant la fonctionnalité testée
- Préfixes pour identifier la catégorie (auth-, admin-, ui-)

## Utilisation des Helpers

### Auth Helpers
```typescript
import { 
  signUp, 
  signIn, 
  generateTestEmail, 
  generateTestCredentials 
} from '../../shared/helpers/auth';

// Utilisation d'emails dynamiques pour éviter les conflits
const user = generateTestCredentials('signup-test');
await signUp(page, user);
```

### Emails Dynamiques
Les helpers d'auth utilisent des emails dynamiques pour éviter les conflits :
- Format: `prefix-timestamp-random@test.local`
- Exemple: `signup-1704123456789-a3f2k1@test.local`

## Ajout de nouvelles features

1. Créer un nouveau dossier dans `features/`
2. Ajouter les tests spécifiques à la feature
3. Créer des helpers dans `shared/helpers/` si nécessaire
4. Documenter les nouveaux patterns ici

## Bonnes pratiques

1. **Isolation** : Chaque test doit être indépendant
2. **Cleanup** : Utiliser `beforeEach` et `afterEach` pour nettoyer
3. **Données uniques** : Utiliser les générateurs d'emails dynamiques
4. **Helpers réutilisables** : Extraire la logique commune
5. **Documentation** : Maintenir cette documentation à jour
# Organisation des Features

## Vue d'ensemble

Be Digital organise son code en **features** autonomes, chacune suivant les principes de Clean Architecture. Cette approche permet une séparation claire des responsabilités et facilite la maintenance.

## 📁 Structure Standard d'une Feature

```
features/
└── [feature-name]/
    ├── domain/                 # 🏛️ Couche Domaine
    │   ├── entities/          # Entités métier
    │   ├── value-objects/     # Objets de valeur (optionnel)
    │   ├── schemas/           # Schémas Zod
    │   ├── repositories/      # Interfaces repositories
    │   └── services/          # Interfaces services
    ├── application/           # 🔄 Couche Application
    │   └── use-cases/         # Cas d'usage
    ├── infrastructure/        # 🔧 Couche Infrastructure
    │   ├── repositories/      # Implémentations repositories
    │   ├── services/          # Implémentations services
    │   └── di/                # Dependency Injection
    └── presentation/          # 🎨 Couche Présentation
        ├── hooks/             # Hooks React
        ├── providers/         # Context providers (optionnel)
        └── components/        # Composants spécialisés (optionnel)
```

## 🔍 Features Implémentées

### 1. 🔐 Feature Auth (Authentification)

**Localisation** : `features/auth/`

#### Responsabilités
- Gestion de l'authentification utilisateur
- Inscription, connexion, déconnexion
- Gestion des sessions
- Réinitialisation de mots de passe

#### Structure Détaillée
```
auth/
├── domain/
│   ├── entities/
│   │   ├── User.ts              # Entité utilisateur
│   │   ├── Session.ts           # Entité session
│   │   └── AuthToken.ts         # Token d'authentification
│   ├── schemas/
│   │   ├── AuthSchemas.ts       # Schémas d'authentification
│   │   └── UserSchemas.ts       # Schémas utilisateur
│   ├── repositories/
│   │   ├── IAuthRepository.ts   # Interface auth
│   │   └── ISessionRepository.ts # Interface session
│   └── services/
│       ├── IEmailService.ts     # Interface email
│       └── IPasswordService.ts  # Interface password
├── application/
│   └── use-cases/
│       ├── SignInUseCase.ts     # Connexion
│       ├── SignUpUseCase.ts     # Inscription
│       ├── SignOutUseCase.ts    # Déconnexion
│       ├── GetCurrentUserUseCase.ts # Utilisateur actuel
│       └── ResetPasswordUseCase.ts  # Reset password
├── infrastructure/
│   ├── repositories/
│   │   ├── BetterAuthRepository.ts      # Better Auth impl
│   │   ├── ApiAuthRepository.ts         # API REST impl
│   │   └── BetterAuthSessionRepository.ts # Sessions Better Auth
│   ├── services/
│   │   ├── BetterAuthPasswordService.ts # Passwords Better Auth
│   │   └── ConsoleEmailService.ts      # Email console (dev)
│   └── di/
│       └── AuthContainer.ts     # Container DI
└── presentation/
    └── hooks/
        ├── useSignIn.ts         # Hook connexion
        ├── useSignUp.ts         # Hook inscription
        ├── useSignOut.ts        # Hook déconnexion
        └── useCurrentUser.ts    # Hook utilisateur actuel
```

#### Exemple d'Usage
```typescript
// Dans un composant
const { signIn, isLoading, error } = useSignIn();

// Utilisation
await signIn({ email: 'user@example.com', password: 'password' });
```

---

### 2. ⚙️ Feature Admin (Préférences Admin)

**Localisation** : `features/admin/`

#### Responsabilités
- Gestion des préférences administrateur
- Configuration multilingue
- Paramètres globaux de l'application

#### Structure Détaillée
```
admin/
├── domain/
│   ├── entities/
│   │   └── AdminPreferences.ts  # Entité préférences
│   ├── schemas/
│   │   └── AdminPreferencesSchema.ts # Schémas préférences
│   └── repositories/
│       └── IAdminPreferencesRepository.ts # Interface repository
├── application/
│   └── use-cases/
│       ├── GetAdminPreferencesUseCase.ts # Récupération préférences
│       └── UpdateAdminPreferencesUseCase.ts # Mise à jour préférences
├── infrastructure/
│   ├── repositories/
│   │   ├── PrismaAdminPreferencesRepository.ts # Prisma impl
│   │   └── ApiAdminPreferencesRepository.ts    # API impl
│   └── di/
│       └── AdminContainer.ts    # Container DI
└── presentation/
    └── hooks/
        └── useAdminPreferences.ts # Hook préférences
```

#### Exemple d'Usage
```typescript
// Récupération des préférences
const { data: preferences, isLoading } = useAdminPreferences();

// Mise à jour
const { updatePreferences } = useAdminPreferences();
await updatePreferences({
  isMultilingual: true,
  supportedLanguages: ['fr', 'en', 'es']
});
```

---

### 3. 🏠 Feature Home (Contenu Accueil)

**Localisation** : `features/home/`

#### Responsabilités
- Gestion du contenu de la page d'accueil
- Intégration avec Sanity CMS
- Localisation du contenu

#### Structure Détaillée
```
home/
├── domain/
│   ├── schemas/
│   │   └── HomeContentSchema.ts # Schémas contenu accueil
│   ├── repositories/
│   │   └── IHomeRepository.ts   # Interface repository
│   └── value-objects/
│       └── MultilingualValue.ts # Valeur multilingue
├── application/
│   └── use-cases/
│       ├── GetHomeContentUseCase.ts         # Contenu accueil
│       └── GetLocalizedHomeContentUseCase.ts # Contenu localisé
├── infrastructure/
│   ├── repositories/
│   │   └── SanityHomeRepository.ts # Sanity CMS impl
│   └── di/
│       └── HomeContainer.ts     # Container DI
└── presentation/
    └── hooks/
        └── useHomeContent.ts    # Hook contenu accueil
```

#### Exemple d'Usage
```typescript
// Récupération du contenu localisé
const { data: homeContent, isLoading } = useHomeContent('fr');

// Utilisation dans un composant
if (homeContent?.heroBanner?.isActive) {
  // Afficher la hero banner
}
```

---

### 4. 🌐 Feature Locale (Internationalisation)

**Localisation** : `features/locale/`

#### Responsabilités
- Gestion de la langue courante
- Changement de langue
- Persistance des préférences linguistiques

#### Structure Détaillée
```
locale/
├── domain/
│   ├── entities/
│   │   └── Locale.ts            # Entité langue
│   ├── schemas/
│   │   └── LocaleSchema.ts      # Schémas langue
│   └── repositories/
│       └── ILocaleRepository.ts # Interface repository
├── application/
│   └── use-cases/
│       ├── GetCurrentLocaleUseCase.ts   # Langue courante
│       ├── ChangeLocaleUseCase.ts       # Changement langue
│       └── GetSupportedLocalesUseCase.ts # Langues supportées
├── infrastructure/
│   ├── repositories/
│   │   └── LocalStorageLocaleRepository.ts # LocalStorage impl
│   └── di/
│       └── LocaleContainer.ts   # Container DI
└── presentation/
    ├── hooks/
    │   └── useLocale.ts         # Hook langue
    └── providers/
        └── LocaleProvider.tsx   # Provider langue
```

#### Exemple d'Usage
```typescript
// Récupération de la langue courante
const { currentLocale, changeLocale, supportedLocales } = useLocale();

// Changement de langue
await changeLocale('en');

// Dans un composant avec provider
<LocaleProvider>
  <App />
</LocaleProvider>
```

---

## 🔧 Conventions de Nommage

### Entités
```typescript
// PascalCase + suffixe descriptif
User.ts
AdminPreferences.ts
HomeContent.ts
```

### Use Cases
```typescript
// PascalCase + "UseCase"
SignInUseCase.ts
GetAdminPreferencesUseCase.ts
UpdateHomeContentUseCase.ts
```

### Repositories
```typescript
// Interface: "I" + PascalCase + "Repository"
IAuthRepository.ts
IAdminPreferencesRepository.ts

// Implémentation: Technology + PascalCase + "Repository"
PrismaAuthRepository.ts
SanityHomeRepository.ts
ApiAdminPreferencesRepository.ts
```

### Services
```typescript
// Interface: "I" + PascalCase + "Service"
IEmailService.ts
IPasswordService.ts

// Implémentation: Technology + PascalCase + "Service"
BcryptPasswordService.ts
ResendEmailService.ts
ConsoleEmailService.ts
```

### Hooks
```typescript
// camelCase + "use" prefix
useSignIn.ts
useAdminPreferences.ts
useHomeContent.ts
```

### Containers
```typescript
// PascalCase + "Container"
AuthContainer.ts
AdminContainer.ts
HomeContainer.ts
```

---

## 📋 Checklist pour Nouvelle Feature

### 1. ✅ Structure de Dossiers
```bash
mkdir -p features/[feature-name]/{domain/{entities,schemas,repositories,services},application/use-cases,infrastructure/{repositories,services,di},presentation/hooks}
```

### 2. ✅ Domain Layer
- [ ] Créer les entités métier
- [ ] Définir les schémas Zod
- [ ] Créer les interfaces de repositories
- [ ] Créer les interfaces de services (si nécessaire)

### 3. ✅ Application Layer
- [ ] Implémenter les use cases principaux
- [ ] Gérer les erreurs avec le pattern Either
- [ ] Ajouter la validation des entrées

### 4. ✅ Infrastructure Layer
- [ ] Implémenter les repositories
- [ ] Implémenter les services
- [ ] Créer le container DI
- [ ] Configurer les dépendances

### 5. ✅ Presentation Layer
- [ ] Créer les hooks React
- [ ] Intégrer React Query
- [ ] Gérer les états de chargement et erreurs
- [ ] Créer les providers si nécessaire

### 6. ✅ Tests
- [ ] Tests unitaires des entités
- [ ] Tests unitaires des use cases
- [ ] Tests d'intégration des repositories
- [ ] Tests des hooks avec React Testing Library

### 7. ✅ Documentation
- [ ] Mettre à jour cette documentation
- [ ] Ajouter des exemples d'usage
- [ ] Documenter les APIs publiques

---

## 🚀 Exemple de Création de Feature

### Créer une Feature "Product"

1. **Créer la structure**
```bash
mkdir -p features/product/{domain/{entities,schemas,repositories},application/use-cases,infrastructure/{repositories,di},presentation/hooks}
```

2. **Domain Layer**
```typescript
// domain/entities/Product.ts
export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: number,
    public readonly description: string
  ) {}

  static create(data: CreateProductData): Product {
    if (data.price < 0) {
      throw new Error('Price cannot be negative');
    }
    
    return new Product(
      generateId(),
      data.name.trim(),
      data.price,
      data.description.trim()
    );
  }

  isOnSale(): boolean {
    return this.price > 0;
  }
}

// domain/repositories/IProductRepository.ts
export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  save(product: Product): Promise<Product>;
  delete(id: string): Promise<void>;
}
```

3. **Application Layer**
```typescript
// application/use-cases/GetProductUseCase.ts
export class GetProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string): Promise<GetProductResult> {
    const product = await this.productRepository.findById(id);
    
    if (!product) {
      return { success: false, error: 'Product not found' };
    }
    
    return { success: true, product };
  }
}
```

4. **Infrastructure Layer**
```typescript
// infrastructure/repositories/SanityProductRepository.ts
export class SanityProductRepository implements IProductRepository {
  constructor(private sanityClient: SanityClient) {}

  async findById(id: string): Promise<Product | null> {
    const data = await this.sanityClient.fetch(
      `*[_type == "product" && _id == $id][0]`,
      { id }
    );
    
    return data ? Product.fromSanity(data) : null;
  }
}

// infrastructure/di/ProductContainer.ts
export class ProductContainer {
  private static instance: ProductContainer;
  
  static getInstance(): ProductContainer {
    if (!ProductContainer.instance) {
      ProductContainer.instance = new ProductContainer();
    }
    return ProductContainer.instance;
  }

  get productRepository(): IProductRepository {
    return new SanityProductRepository(sanityClient);
  }

  get getProductUseCase(): GetProductUseCase {
    return new GetProductUseCase(this.productRepository);
  }
}
```

5. **Presentation Layer**
```typescript
// presentation/hooks/useProduct.ts
export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const result = await productContainer.getProductUseCase.execute(id);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.product;
    }
  });
}
```

---

**Previous:** [← Structure des Couches](./02-layers.md) | **Next:** [Patterns et Conventions](./04-patterns.md) →
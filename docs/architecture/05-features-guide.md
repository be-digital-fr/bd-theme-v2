# Guide des Features Implémentées

## Vue d'ensemble

Be Digital comprend actuellement 4 features principales implémentées selon les principes de Clean Architecture. Ce guide détaille chaque feature avec des exemples concrets d'utilisation.

## 🔐 Feature Auth (Authentification)

### Vue d'ensemble
La feature Auth gère toute la logique d'authentification et de gestion des utilisateurs, intégrée avec Better Auth.

### Capabilities
- ✅ Inscription utilisateur
- ✅ Connexion/Déconnexion  
- ✅ Gestion des sessions
- ✅ Récupération utilisateur actuel
- ✅ Réinitialisation mot de passe
- ✅ Validation des données
- ✅ Gestion d'erreurs

### Architecture

#### Domain Layer
```typescript
// Entités principales
User.ts           // Entité utilisateur avec règles métier
Session.ts        // Entité session
AuthToken.ts      // Token d'authentification

// Schémas de validation
AuthSchemas.ts    // Schémas pour sign-in/sign-up
UserSchemas.ts    // Schémas pour les données utilisateur

// Interfaces
IAuthRepository.ts      // Interface pour l'authentification
ISessionRepository.ts   // Interface pour les sessions
IEmailService.ts        // Interface pour les emails
IPasswordService.ts     // Interface pour les mots de passe
```

#### Application Layer
```typescript
SignInUseCase.ts         // Connexion utilisateur
SignUpUseCase.ts         // Inscription utilisateur  
SignOutUseCase.ts        // Déconnexion
GetCurrentUserUseCase.ts // Récupération utilisateur actuel
ResetPasswordUseCase.ts  // Réinitialisation mot de passe
```

#### Infrastructure Layer
```typescript
// Repositories
BetterAuthRepository.ts         // Implémentation Better Auth
ApiAuthRepository.ts            // Implémentation API REST
BetterAuthSessionRepository.ts  // Sessions Better Auth

// Services
BetterAuthPasswordService.ts    // Mots de passe Better Auth
ConsoleEmailService.ts          // Emails console (dev)

// Dependency Injection
AuthContainer.ts                // Container DI
```

#### Presentation Layer
```typescript
// Hooks React
useSignIn.ts         // Hook connexion
useSignUp.ts         // Hook inscription
useSignOut.ts        // Hook déconnexion
useCurrentUser.ts    // Hook utilisateur actuel
```

### Exemples d'Utilisation

#### 1. Connexion utilisateur
```typescript
// Dans un composant React
function SignInForm() {
  const { signIn, isLoading, error } = useSignIn();
  
  const handleSubmit = async (data: SignInFormData) => {
    await signIn(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button disabled={isLoading}>
        {isLoading ? 'Connexion...' : 'Se connecter'}
      </button>
      {error && <div className="error">{error.message}</div>}
    </form>
  );
}
```

#### 2. Récupération de l'utilisateur actuel
```typescript
// Dans un composant React
function Profile() {
  const { data: user, isLoading, error } = useCurrentUser();

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error.message}</div>;
  if (!user) return <div>Non connecté</div>;

  return (
    <div>
      <h1>Bonjour {user.name}!</h1>
      <p>Email: {user.email}</p>
      <p>Vérifié: {user.isEmailVerified() ? 'Oui' : 'Non'}</p>
    </div>
  );
}
```

#### 3. Utilisation directe du Use Case (pour les tests ou API routes)
```typescript
// Dans une API route ou un test
import { authContainer } from '@/features/auth/infrastructure/di/AuthContainer';

export async function POST(request: Request) {
  const data = await request.json();
  
  const result = await authContainer.signInUseCase.execute({
    email: data.email,
    password: data.password
  });

  if (!result.success) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  return Response.json({ user: result.user });
}
```

---

## ⚙️ Feature Admin (Préférences Admin)

### Vue d'ensemble
La feature Admin gère les préférences globales de l'application, notamment la configuration multilingue.

### Capabilities
- ✅ Gestion des préférences multilingues
- ✅ Configuration des langues supportées
- ✅ Définition de la langue par défaut
- ✅ Basculement mono/multilingue
- ✅ Persistance en base de données

### Architecture

#### Domain Layer
```typescript
AdminPreferences.ts         // Entité préférences admin
AdminPreferencesSchema.ts   // Schémas validation
IAdminPreferencesRepository.ts // Interface repository
```

#### Application Layer
```typescript
GetAdminPreferencesUseCase.ts    // Récupération préférences
UpdateAdminPreferencesUseCase.ts // Mise à jour préférences
```

#### Infrastructure Layer
```typescript
PrismaAdminPreferencesRepository.ts // Implémentation Prisma
ApiAdminPreferencesRepository.ts    // Implémentation API
AdminContainer.ts                   // Container DI
```

#### Presentation Layer
```typescript
useAdminPreferences.ts // Hook préférences admin
```

### Exemples d'Utilisation

#### 1. Récupération des préférences
```typescript
function AdminSettings() {
  const { data: preferences, isLoading, error } = useAdminPreferences();

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error.message}</div>;

  return (
    <div>
      <h2>Paramètres Admin</h2>
      <p>Mode multilingue: {preferences?.isMultilingual ? 'Activé' : 'Désactivé'}</p>
      <p>Langue par défaut: {preferences?.defaultLanguage}</p>
      <p>Langues supportées: {preferences?.supportedLanguages.join(', ')}</p>
    </div>
  );
}
```

#### 2. Mise à jour des préférences
```typescript
function LanguageSettings() {
  const { preferences, updatePreferences, isUpdating } = useAdminPreferences();

  const handleToggleMultilingual = async () => {
    await updatePreferences({
      ...preferences,
      isMultilingual: !preferences.isMultilingual
    });
  };

  const handleAddLanguage = async (language: string) => {
    await updatePreferences({
      ...preferences,
      supportedLanguages: [...preferences.supportedLanguages, language]
    });
  };

  return (
    <div>
      <button onClick={handleToggleMultilingual} disabled={isUpdating}>
        {preferences?.isMultilingual ? 'Désactiver' : 'Activer'} le multilingue
      </button>
      
      <select onChange={(e) => handleAddLanguage(e.target.value)}>
        <option value="">Ajouter une langue</option>
        <option value="en">Anglais</option>
        <option value="es">Espagnol</option>
        <option value="it">Italien</option>
      </select>
    </div>
  );
}
```

---

## 🏠 Feature Home (Contenu Accueil)

### Vue d'ensemble
La feature Home gère le contenu de la page d'accueil, intégrée avec Sanity CMS et supportant la localisation.

### Capabilities
- ✅ Récupération du contenu depuis Sanity CMS
- ✅ Support multilingue automatique
- ✅ Gestion de la hero banner
- ✅ Cache et optimisation des performances
- ✅ Fallbacks pour contenu manquant

### Architecture

#### Domain Layer
```typescript
HomeContentSchema.ts    // Schémas contenu accueil
IHomeRepository.ts      // Interface repository
MultilingualValue.ts    // Objet valeur multilingue
```

#### Application Layer
```typescript
GetHomeContentUseCase.ts         // Contenu accueil
GetLocalizedHomeContentUseCase.ts // Contenu localisé
```

#### Infrastructure Layer
```typescript
SanityHomeRepository.ts // Implémentation Sanity CMS
HomeContainer.ts        // Container DI
```

#### Presentation Layer
```typescript
useHomeContent.ts // Hook contenu accueil
```

### Exemples d'Utilisation

#### 1. Affichage du contenu d'accueil
```typescript
function HomePage() {
  const currentLocale = useCurrentLocale();
  const { data: homeContent, isLoading, error } = useHomeContent(currentLocale);

  if (isLoading) return <HomePageSkeleton />;
  if (error) return <div>Erreur de chargement du contenu</div>;

  return (
    <div>
      {homeContent?.heroBanner?.isActive && (
        <HeroBanner content={homeContent.heroBanner} />
      )}
      
      {homeContent?.features && (
        <FeaturesSection features={homeContent.features} />
      )}
      
      {homeContent?.testimonials && (
        <TestimonialsSection testimonials={homeContent.testimonials} />
      )}
    </div>
  );
}
```

#### 2. Composant Hero Banner avec contenu multilingue
```typescript
function HeroBanner({ content }: { content: HeroBannerContent }) {
  const currentLocale = useCurrentLocale();
  
  // Résolution automatique des valeurs multilingues
  const title = resolveMultilingualValue({
    value: content.heroTitle,
    currentLanguage: currentLocale
  });
  
  const description = resolveMultilingualValue({
    value: content.heroDescription,
    currentLanguage: currentLocale
  });

  return (
    <section className="hero-banner">
      <h1>{title}</h1>
      <p>{description}</p>
      
      {content.primaryButton && (
        <Button href={content.primaryButton.url}>
          {resolveMultilingualValue({
            value: content.primaryButton.text,
            currentLanguage: currentLocale
          })}
        </Button>
      )}
    </section>
  );
}
```

#### 3. Préchargement du contenu
```typescript
// Dans un layout ou page parent
function RootLayout({ children }: { children: React.ReactNode }) {
  const currentLocale = useCurrentLocale();
  
  // Préchargement du contenu d'accueil
  useHomeContent(currentLocale);

  return (
    <html lang={currentLocale}>
      <body>
        {children}
      </body>
    </html>
  );
}
```

---

## 🌐 Feature Locale (Internationalisation)

### Vue d'ensemble
La feature Locale gère la langue courante de l'application, la persistance des préférences linguistiques et la synchronisation avec les préférences admin.

### Capabilities
- ✅ Gestion de la langue courante
- ✅ Changement de langue dynamique
- ✅ Persistance dans localStorage
- ✅ Liste des langues supportées
- ✅ Fallback vers langue par défaut
- ✅ Context Provider pour toute l'app

### Architecture

#### Domain Layer
```typescript
Locale.ts              // Entité langue
LocaleSchema.ts        // Schémas validation
ILocaleRepository.ts   // Interface repository
```

#### Application Layer
```typescript
GetCurrentLocaleUseCase.ts    // Langue courante
ChangeLocaleUseCase.ts        // Changement langue
GetSupportedLocalesUseCase.ts // Langues supportées
```

#### Infrastructure Layer
```typescript
LocalStorageLocaleRepository.ts // Implémentation localStorage
LocaleContainer.ts              // Container DI
```

#### Presentation Layer
```typescript
useLocale.ts        // Hook langue
LocaleProvider.tsx  // Provider React Context
```

### Exemples d'Utilisation

#### 1. Configuration du Provider
```typescript
// Dans _app.tsx ou layout.tsx
function App({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      {children}
    </LocaleProvider>
  );
}
```

#### 2. Sélecteur de langue
```typescript
function LanguageSelector() {
  const { currentLocale, supportedLocales, changeLocale, isChangingLocale } = useLocale();

  return (
    <select 
      value={currentLocale}
      onChange={(e) => changeLocale(e.target.value)}
      disabled={isChangingLocale}
    >
      {supportedLocales.map(locale => (
        <option key={locale.code} value={locale.code}>
          {locale.nativeName}
        </option>
      ))}
    </select>
  );
}
```

#### 3. Hook personnalisé pour la langue courante
```typescript
// Hook simplifié pour récupérer juste la langue
function useCurrentLocale(): string {
  const { currentLocale } = useLocale();
  return currentLocale;
}

// Utilisation dans un composant
function MyComponent() {
  const currentLocale = useCurrentLocale();
  
  return (
    <div>
      <p>Langue actuelle: {currentLocale}</p>
    </div>
  );
}
```

#### 4. Résolution de valeurs multilingues
```typescript
// Fonction utilitaire pour résoudre les valeurs multilingues
export function resolveMultilingualValue({
  value,
  currentLanguage,
  fallbackLanguage = 'fr'
}: {
  value: MultilingualValue | string | undefined;
  currentLanguage: string;
  fallbackLanguage?: string;
}): string | undefined {
  if (!value) return undefined;
  
  // Si c'est une string simple, la retourner
  if (typeof value === 'string') return value;
  
  // Si c'est un objet multilingue
  if (typeof value === 'object') {
    // Essayer la langue courante
    if (value[currentLanguage]) return value[currentLanguage];
    
    // Essayer la langue de fallback
    if (value[fallbackLanguage]) return value[fallbackLanguage];
    
    // Prendre la première valeur disponible
    const firstValue = Object.values(value).find(v => v);
    return firstValue;
  }
  
  return undefined;
}

// Utilisation
function MultilingualText({ content }: { content: MultilingualValue }) {
  const currentLocale = useCurrentLocale();
  
  const text = resolveMultilingualValue({
    value: content,
    currentLanguage: currentLocale
  });
  
  return <p>{text}</p>;
}
```

---

## 🔄 Intégration entre Features

### Communication inter-features
Les features communiquent entre elles via leurs interfaces publiques (hooks de présentation) :

```typescript
// Feature Home utilise Feature Locale
function HomePage() {
  const currentLocale = useCurrentLocale(); // Feature Locale
  const { data: homeContent } = useHomeContent(currentLocale); // Feature Home
  
  return <div>...</div>;
}

// Feature Admin influence Feature Locale
function AdminPanel() {
  const { preferences, updatePreferences } = useAdminPreferences(); // Feature Admin
  const { supportedLocales } = useLocale(); // Feature Locale
  
  // Synchronisation des langues supportées
  const handleUpdateLanguages = (languages: string[]) => {
    updatePreferences({
      ...preferences,
      supportedLanguages: languages
    });
  };
  
  return <div>...</div>;
}
```

### Flux de données typique

```
1. User selects language in UI
   ↓
2. useLocale hook → ChangeLocaleUseCase
   ↓
3. LocalStorageLocaleRepository saves preference
   ↓
4. Context updates, triggers re-renders
   ↓
5. useHomeContent hook detects language change
   ↓
6. GetLocalizedHomeContentUseCase fetches new content
   ↓
7. SanityHomeRepository queries CMS with new locale
   ↓
8. UI updates with localized content
```

---

## 🧪 Tests par Feature

### Structure des tests
```
tests/
├── features/
│   ├── auth/
│   │   ├── domain/
│   │   │   ├── User.test.ts
│   │   │   └── AuthSchemas.test.ts
│   │   ├── application/
│   │   │   ├── SignInUseCase.test.ts
│   │   │   └── SignUpUseCase.test.ts
│   │   ├── infrastructure/
│   │   │   └── BetterAuthRepository.test.ts
│   │   └── presentation/
│   │       └── useSignIn.test.ts
│   ├── admin/
│   ├── home/
│   └── locale/
└── integration/
    ├── auth-flow.test.ts
    └── multilingual-flow.test.ts
```

### Exemple de test d'entité
```typescript
// tests/features/auth/domain/User.test.ts
describe('User Entity', () => {
  describe('create', () => {
    it('should create a valid user', () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User'
      };
      
      const user = User.create(userData);
      
      expect(user.email).toBe('test@example.com');
      expect(user.name).toBe('Test User');
      expect(user.id).toBeDefined();
    });
    
    it('should throw error for invalid email', () => {
      const userData = {
        email: 'invalid-email',
        name: 'Test User'
      };
      
      expect(() => User.create(userData)).toThrow('Invalid email format');
    });
  });
});
```

### Exemple de test de use case
```typescript
// tests/features/auth/application/SignInUseCase.test.ts
describe('SignInUseCase', () => {
  let useCase: SignInUseCase;
  let mockAuthRepository: jest.Mocked<IAuthRepository>;
  let mockPasswordService: jest.Mocked<IPasswordService>;

  beforeEach(() => {
    mockAuthRepository = {
      findByEmail: jest.fn(),
      signIn: jest.fn()
    } as any;
    
    mockPasswordService = {
      verify: jest.fn()
    } as any;
    
    useCase = new SignInUseCase(mockAuthRepository, mockPasswordService);
  });

  it('should sign in user with valid credentials', async () => {
    const user = User.create({ email: 'test@example.com', name: 'Test' });
    mockAuthRepository.findByEmail.mockResolvedValue(user);
    mockPasswordService.verify.mockResolvedValue(true);

    const result = await useCase.execute({
      email: 'test@example.com',
      password: 'password123'
    });

    expect(result.success).toBe(true);
    expect(result.user).toEqual(user);
  });
});
```

---

**Previous:** [← Patterns et Conventions](./04-patterns.md) | **Next:** [Guide Développement](./06-development-guide.md) →
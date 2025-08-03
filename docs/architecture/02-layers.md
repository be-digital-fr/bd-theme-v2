# Structure des Couches

## Vue d'ensemble des Couches

Clean Architecture organise le code en 4 couches principales, chacune ayant des responsabilités spécifiques et des règles de dépendance strictes.

## 🏛️ 1. Domain Layer (Couche Domaine)

**Localisation** : `features/[feature]/domain/`

### Responsabilités
- Contient la logique métier pure
- Définit les entités et leurs règles
- Expose les interfaces (contrats)
- Aucune dépendance externe

### Structure
```
domain/
├── entities/           # Entités métier
├── value-objects/     # Objets de valeur
├── schemas/           # Schémas Zod de validation
├── repositories/      # Interfaces de repositories
└── services/          # Interfaces de services
```

### Exemple : Auth Domain
```typescript
// entities/User.ts
export class User {
  private constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string
  ) {}

  static create(data: CreateUserData): User {
    // Validation métier
    if (!data.email.includes('@')) {
      throw new Error('Email invalide');
    }
    
    return new User(
      generateId(),
      data.email.toLowerCase(),
      data.name.trim()
    );
  }

  isEmailVerified(): boolean {
    // Logique métier pour vérifier l'email
    return this.emailVerifiedAt !== null;
  }
}

// repositories/IAuthRepository.ts
export interface IAuthRepository {
  signIn(email: string, password: string): Promise<AuthResult>;
  signUp(userData: CreateUserData): Promise<User>;
  getCurrentUser(): Promise<User | null>;
}
```

### Règles
- ✅ Aucune dépendance vers les autres couches
- ✅ Utilise uniquement TypeScript/JavaScript standard
- ✅ Contient la logique métier critique
- ❌ Pas d'import de frameworks externes
- ❌ Pas d'appels réseau ou base de données

---

## 🔄 2. Application Layer (Couche Application)

**Localisation** : `features/[feature]/application/`

### Responsabilités
- Orchestre les entités du domaine
- Implémente les cas d'usage métier
- Coordonne les opérations complexes
- Gère les transactions et la logique applicative

### Structure
```
application/
└── use-cases/         # Cas d'usage métier
    ├── SignInUseCase.ts
    ├── SignUpUseCase.ts
    └── GetUserProfileUseCase.ts
```

### Exemple : Use Case d'Authentification
```typescript
// use-cases/SignInUseCase.ts
export class SignInUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private passwordService: IPasswordService,
    private emailService: IEmailService
  ) {}

  async execute(data: SignInRequest): Promise<SignInResult> {
    // 1. Validation des données
    const validatedData = SignInSchema.parse(data);

    // 2. Vérification utilisateur
    const user = await this.authRepository.findByEmail(validatedData.email);
    if (!user) {
      return { success: false, error: 'Utilisateur non trouvé' };
    }

    // 3. Vérification mot de passe
    const isPasswordValid = await this.passwordService.verify(
      validatedData.password,
      user.hashedPassword
    );
    
    if (!isPasswordValid) {
      return { success: false, error: 'Mot de passe incorrect' };
    }

    // 4. Création de session
    const session = await this.authRepository.createSession(user);

    // 5. Email de notification (optionnel)
    if (user.preferences.emailNotifications) {
      await this.emailService.sendLoginNotification(user);
    }

    return { success: true, user, session };
  }
}
```

### Patterns Utilisés
- **Either Pattern** : Retour `{ success: boolean, data?, error? }`
- **Command Pattern** : Use cases comme commandes
- **Orchestration** : Coordination de plusieurs services

### Règles
- ✅ Peut dépendre du Domain Layer
- ✅ Utilise les interfaces du domaine
- ✅ Orchestre la logique métier
- ❌ Pas de dépendance vers Infrastructure ou Presentation
- ❌ Pas d'accès direct aux détails techniques

---

## 🔧 3. Infrastructure Layer (Couche Infrastructure)

**Localisation** : `features/[feature]/infrastructure/`

### Responsabilités
- Implémente les interfaces du domaine
- Gère les accès aux données externes
- Configure l'injection de dépendances
- Contient les détails techniques

### Structure
```
infrastructure/
├── repositories/      # Implémentations des repositories
│   ├── ApiAuthRepository.ts
│   └── PrismaUserRepository.ts
├── services/         # Implémentations des services
│   ├── BcryptPasswordService.ts
│   └── ResendEmailService.ts
└── di/              # Dependency Injection
    └── AuthContainer.ts
```

### Exemple : Repository Implementation
```typescript
// repositories/PrismaAuthRepository.ts
export class PrismaAuthRepository implements IAuthRepository {
  constructor(private prisma: PrismaClient) {}

  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      // Utilisation de Prisma pour l'accès base de données
      const user = await this.prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return { success: false, error: 'User not found' };
      }

      // Conversion vers l'entité domaine
      const domainUser = User.fromPersistence(user);
      
      return { success: true, user: domainUser };
    } catch (error) {
      return { success: false, error: 'Database error' };
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email }
    });

    return user ? User.fromPersistence(user) : null;
  }
}
```

### Exemple : Service Implementation
```typescript
// services/BcryptPasswordService.ts
export class BcryptPasswordService implements IPasswordService {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
```

### Exemple : Dependency Injection Container
```typescript
// di/AuthContainer.ts
export class AuthContainer {
  private static instance: AuthContainer;
  
  private constructor() {}

  static getInstance(): AuthContainer {
    if (!AuthContainer.instance) {
      AuthContainer.instance = new AuthContainer();
    }
    return AuthContainer.instance;
  }

  // Repositories
  get authRepository(): IAuthRepository {
    return new BetterAuthRepository(authClient);
  }

  get sessionRepository(): ISessionRepository {
    return new BetterAuthSessionRepository(authClient);
  }

  // Services
  get passwordService(): IPasswordService {
    return new BetterAuthPasswordService();
  }

  get emailService(): IEmailService {
    return new ConsoleEmailService(); // Dev mode
  }

  // Use Cases
  get signInUseCase(): SignInUseCase {
    return new SignInUseCase(
      this.authRepository,
      this.passwordService,
      this.emailService
    );
  }

  get signUpUseCase(): SignUpUseCase {
    return new SignUpUseCase(
      this.authRepository,
      this.passwordService,
      this.emailService
    );
  }
}
```

### Règles
- ✅ Implémente les interfaces du domaine
- ✅ Peut dépendre de frameworks externes
- ✅ Gère les détails techniques
- ❌ Pas de logique métier
- ❌ Pas de dépendance vers Presentation

---

## 🎨 4. Presentation Layer (Couche Présentation)

**Localisation** : `features/[feature]/presentation/`

### Responsabilités
- Gère l'interface utilisateur
- Adapte les données pour l'affichage
- Gère les états de l'UI
- Communique avec l'Application Layer

### Structure
```
presentation/
├── hooks/            # Hooks React personnalisés
│   ├── useSignIn.ts
│   ├── useSignUp.ts
│   └── useCurrentUser.ts
├── providers/        # Context Providers
│   └── AuthProvider.tsx
└── components/       # Composants spécialisés (si nécessaire)
```

### Exemple : Hook de Présentation
```typescript
// hooks/useSignIn.ts
export function useSignIn() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: SignInFormData) => {
      // Appel du use case via le container
      const result = await authContainer.signInUseCase.execute(data);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result.user;
    },
    onSuccess: (user) => {
      // Mise à jour du cache React Query
      queryClient.setQueryData(['currentUser'], user);
      
      // Navigation (via router)
      router.push('/dashboard');
    },
    onError: (error) => {
      // Gestion d'erreur UI
      toast.error(error.message);
    }
  });
}
```

### Exemple : Hook avec État
```typescript
// hooks/useCurrentUser.ts
export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const result = await authContainer.getCurrentUserUseCase.execute();
      return result.success ? result.user : null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false
  });
}
```

### Exemple : Utilisation dans un Composant
```typescript
// components/auth/SignInForm.tsx
export function SignInForm() {
  const { signIn, isLoading, error } = useSignIn();
  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>({
    resolver: zodResolver(SignInFormSchema)
  });

  const onSubmit = async (data: SignInFormData) => {
    await signIn(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('email')}
        type="email"
        placeholder="Email"
        disabled={isLoading}
      />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input
        {...register('password')}
        type="password"
        placeholder="Mot de passe"
        disabled={isLoading}
      />
      {errors.password && <span>{errors.password.message}</span>}
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Connexion...' : 'Se connecter'}
      </button>
      
      {error && <div className="error">{error.message}</div>}
    </form>
  );
}
```

### Règles
- ✅ Peut utiliser les hooks et containers
- ✅ Gère uniquement l'UI et ses états
- ✅ Utilise React Query pour le cache
- ❌ Pas de logique métier
- ❌ Pas d'accès direct aux repositories

---

## 🔄 Flux de Communication

### Diagramme de Flux
```
┌─────────────┐
│ User Action │
└──────┬──────┘
       │
┌──────▼──────┐    ┌─────────────────┐
│ Component   │───▶│ Presentation    │
│             │    │ Hook            │
└─────────────┘    └────────┬────────┘
                            │
                   ┌────────▼────────┐
                   │ Use Case        │
                   │ (Application)   │
                   └────────┬────────┘
                            │
                   ┌────────▼────────┐    ┌─────────────────┐
                   │ Domain Entity   │◄───│ Repository      │
                   │                 │    │ (Infrastructure)│
                   └─────────────────┘    └─────────────────┘
```

### Exemple de Flux Complet
```typescript
// 1. User clicks "Sign In" button
<button onClick={() => signIn({ email, password })}>

// 2. Presentation Hook
const signIn = (data) => authContainer.signInUseCase.execute(data);

// 3. Application Use Case
async execute(data) {
  const user = await this.authRepository.signIn(data);
  return user;
}

// 4. Infrastructure Repository
async signIn(data) {
  const user = await this.prisma.user.findUnique({ where: { email: data.email }});
  return User.fromPersistence(user);
}

// 5. Domain Entity
static fromPersistence(data) {
  return new User(data.id, data.email, data.name);
}
```

---

**Previous:** [← Vue d'ensemble](./01-overview.md) | **Next:** [Organisation des Features](./03-features.md) →
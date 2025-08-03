# Patterns et Conventions

## Vue d'ensemble

Be Digital utilise plusieurs patterns de conception pour maintenir une architecture cohérente et maintenable. Ce document détaille les patterns principaux et leurs implémentations.

## 🗃️ Repository Pattern

### Principe
Le Repository Pattern encapsule la logique d'accès aux données et fournit une interface uniforme pour accéder aux données, indépendamment de leur source (base de données, API, fichier, etc.).

### Structure
```typescript
// Domain - Interface
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}

// Infrastructure - Implémentations
export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}
  
  async findById(id: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({ where: { id } });
    return userData ? User.fromPersistence(userData) : null;
  }
}

export class ApiUserRepository implements IUserRepository {
  constructor(private httpClient: HttpClient) {}
  
  async findById(id: string): Promise<User | null> {
    const response = await this.httpClient.get(`/users/${id}`);
    return response.data ? User.fromApi(response.data) : null;
  }
}
```

### Avantages
- ✅ **Testabilité** : Facilite le mocking des données
- ✅ **Flexibilité** : Changement d'implémentation sans impact
- ✅ **Séparation** : Isole la logique métier de l'accès aux données

### Implémentations dans Be Digital

#### Auth Repository
```typescript
// features/auth/domain/repositories/IAuthRepository.ts
export interface IAuthRepository {
  signIn(email: string, password: string): Promise<AuthResult>;
  signUp(userData: CreateUserData): Promise<User>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  refreshToken(token: string): Promise<AuthToken>;
}

// features/auth/infrastructure/repositories/BetterAuthRepository.ts
export class BetterAuthRepository implements IAuthRepository {
  constructor(private authClient: any) {}

  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const { data, error } = await this.authClient.signIn.email({
        email,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        user: User.fromBetterAuth(data.user),
        session: Session.fromBetterAuth(data.session)
      };
    } catch (error) {
      return { success: false, error: 'Authentication failed' };
    }
  }
}
```

#### Home Repository
```typescript
// features/home/infrastructure/repositories/SanityHomeRepository.ts
export class SanityHomeRepository implements IHomeRepository {
  constructor(private sanityClient: SanityClient) {}

  async getHomeContent(locale?: string): Promise<HomeContent | null> {
    const query = `*[_type == "home"][0]{
      heroBanner,
      features,
      testimonials,
      "locale": $locale
    }`;

    const data = await this.sanityClient.fetch(query, { locale });
    return data ? HomeContent.fromSanity(data) : null;
  }
}
```

---

## 🎯 Use Case Pattern

### Principe
Le Use Case Pattern encapsule une action métier spécifique. Chaque use case représente une intention utilisateur et orchestre les entités du domaine pour accomplir cette action.

### Structure
```typescript
export class [Action]UseCase {
  constructor(
    private repository: IRepository,
    private service?: IService
  ) {}

  async execute(input: InputType): Promise<ResultType> {
    // 1. Validation des entrées
    const validatedInput = InputSchema.parse(input);

    // 2. Logique métier
    const entity = await this.repository.findById(validatedInput.id);
    
    if (!entity) {
      return { success: false, error: 'Entity not found' };
    }

    // 3. Opérations métier
    entity.performBusinessOperation();

    // 4. Persistance
    const savedEntity = await this.repository.save(entity);

    // 5. Retour du résultat
    return { success: true, data: savedEntity };
  }
}
```

### Pattern Either
Be Digital utilise le pattern Either pour la gestion d'erreurs :

```typescript
export type Result<T, E = string> = {
  success: true;
  data: T;
} | {
  success: false;
  error: E;
};

// Usage
async execute(input: SignInInput): Promise<Result<User, AuthError>> {
  try {
    const user = await this.authRepository.signIn(input.email, input.password);
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: 'Invalid credentials' };
  }
}
```

### Exemples d'Implémentation

#### Use Case Simple
```typescript
// features/auth/application/use-cases/GetCurrentUserUseCase.ts
export class GetCurrentUserUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(): Promise<Result<User | null>> {
    try {
      const user = await this.authRepository.getCurrentUser();
      return { success: true, data: user };
    } catch (error) {
      return { success: false, error: 'Failed to get current user' };
    }
  }
}
```

#### Use Case Complexe
```typescript
// features/auth/application/use-cases/SignUpUseCase.ts
export class SignUpUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private passwordService: IPasswordService,
    private emailService: IEmailService
  ) {}

  async execute(input: SignUpInput): Promise<Result<User, SignUpError>> {
    // 1. Validation
    const validatedInput = SignUpSchema.parse(input);

    // 2. Vérification utilisateur existant
    const existingUser = await this.authRepository.findByEmail(validatedInput.email);
    if (existingUser) {
      return { success: false, error: 'User already exists' };
    }

    // 3. Création de l'entité utilisateur
    const user = User.create({
      email: validatedInput.email,
      name: validatedInput.name,
      password: validatedInput.password
    });

    // 4. Hashage du mot de passe
    const hashedPassword = await this.passwordService.hash(user.password);
    user.setHashedPassword(hashedPassword);

    // 5. Sauvegarde
    const savedUser = await this.authRepository.save(user);

    // 6. Email de bienvenue
    await this.emailService.sendWelcomeEmail(savedUser);

    return { success: true, data: savedUser };
  }
}
```

---

## 💉 Dependency Injection Pattern

### Principe
L'injection de dépendances permet de découpler les classes de leurs dépendances, facilitant les tests et la maintenance.

### Container Pattern
Be Digital utilise le pattern Singleton Container pour gérer les dépendances :

```typescript
export class [Feature]Container {
  private static instance: [Feature]Container;
  
  private constructor() {}

  static getInstance(): [Feature]Container {
    if (![Feature]Container.instance) {
      [Feature]Container.instance = new [Feature]Container();
    }
    return [Feature]Container.instance;
  }

  // Repositories (lazy loading)
  get [feature]Repository(): I[Feature]Repository {
    return new Concrete[Feature]Repository();
  }

  // Services
  get [service]Service(): I[Service]Service {
    return new Concrete[Service]Service();
  }

  // Use Cases (with dependency injection)
  get [action]UseCase(): [Action]UseCase {
    return new [Action]UseCase(
      this.[feature]Repository,
      this.[service]Service
    );
  }
}
```

### Exemple d'Implémentation
```typescript
// features/auth/infrastructure/di/AuthContainer.ts
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
    if (process.env.NODE_ENV === 'test') {
      return new MockAuthRepository();
    }
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
    if (process.env.NODE_ENV === 'development') {
      return new ConsoleEmailService();
    }
    return new ResendEmailService(process.env.RESEND_API_KEY!);
  }

  // Use Cases
  get signInUseCase(): SignInUseCase {
    return new SignInUseCase(
      this.authRepository,
      this.passwordService
    );
  }

  get signUpUseCase(): SignUpUseCase {
    return new SignUpUseCase(
      this.authRepository,
      this.passwordService,
      this.emailService
    );
  }

  get getCurrentUserUseCase(): GetCurrentUserUseCase {
    return new GetCurrentUserUseCase(this.authRepository);
  }
}

// Export du container global
export const authContainer = AuthContainer.getInstance();
```

### Configuration par Environnement
```typescript
// Container avec configuration environnementale
get authRepository(): IAuthRepository {
  switch (process.env.AUTH_PROVIDER) {
    case 'better-auth':
      return new BetterAuthRepository(authClient);
    case 'auth0':
      return new Auth0Repository(auth0Client);
    case 'supabase':
      return new SupabaseAuthRepository(supabaseClient);
    default:
      return new BetterAuthRepository(authClient);
  }
}
```

---

## 🏗️ Entity Pattern

### Principe
Les entités représentent les objets métier avec leur identité, leurs attributs et leurs comportements.

### Structure
```typescript
export class EntityName {
  private constructor(
    public readonly id: string,
    private _attribute: AttributeType,
    // ... autres attributs
  ) {}

  // Factory method pour la création
  static create(data: CreateEntityData): EntityName {
    // Validation et règles métier
    this.validateData(data);
    
    return new EntityName(
      generateId(),
      data.attribute,
      // ...
    );
  }

  // Factory method pour la reconstitution depuis la persistance
  static fromPersistence(data: PersistenceData): EntityName {
    return new EntityName(
      data.id,
      data.attribute,
      // ...
    );
  }

  // Getters
  get attribute(): AttributeType {
    return this._attribute;
  }

  // Business methods
  performBusinessOperation(): void {
    // Logique métier
  }

  // Validation
  private static validateData(data: CreateEntityData): void {
    if (!data.attribute) {
      throw new Error('Attribute is required');
    }
  }
}
```

### Exemples d'Implémentation

#### Entité User
```typescript
// features/auth/domain/entities/User.ts
export class User {
  private constructor(
    public readonly id: string,
    private _email: string,
    private _name: string,
    private _emailVerifiedAt: Date | null = null,
    private _createdAt: Date = new Date()
  ) {}

  static create(data: CreateUserData): User {
    // Validation métier
    if (!data.email.includes('@')) {
      throw new Error('Invalid email format');
    }

    if (data.name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters');
    }

    return new User(
      generateId(),
      data.email.toLowerCase().trim(),
      data.name.trim()
    );
  }

  static fromPersistence(data: UserPersistenceData): User {
    return new User(
      data.id,
      data.email,
      data.name,
      data.emailVerifiedAt ? new Date(data.emailVerifiedAt) : null,
      new Date(data.createdAt)
    );
  }

  static fromBetterAuth(data: BetterAuthUser): User {
    return new User(
      data.id,
      data.email,
      data.name,
      data.emailVerified ? new Date(data.emailVerified) : null,
      new Date(data.createdAt)
    );
  }

  // Getters
  get email(): string {
    return this._email;
  }

  get name(): string {
    return this._name;
  }

  get emailVerifiedAt(): Date | null {
    return this._emailVerifiedAt;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  // Business methods
  isEmailVerified(): boolean {
    return this._emailVerifiedAt !== null;
  }

  verifyEmail(): void {
    if (this.isEmailVerified()) {
      throw new Error('Email already verified');
    }
    
    this._emailVerifiedAt = new Date();
  }

  updateProfile(data: UpdateProfileData): void {
    if (data.name && data.name.trim().length >= 2) {
      this._name = data.name.trim();
    }
    
    if (data.email && data.email.includes('@')) {
      this._email = data.email.toLowerCase().trim();
      // Reset email verification if email changed
      this._emailVerifiedAt = null;
    }
  }

  // Conversion methods
  toJson(): UserJson {
    return {
      id: this.id,
      email: this._email,
      name: this._name,
      emailVerifiedAt: this._emailVerifiedAt?.toISOString() || null,
      createdAt: this._createdAt.toISOString()
    };
  }
}
```

#### Entité AdminPreferences
```typescript
// features/admin/domain/entities/AdminPreferences.ts
export class AdminPreferences {
  private constructor(
    public readonly id: string,
    private _isMultilingual: boolean,
    private _supportedLanguages: string[],
    private _defaultLanguage: string,
    private _updatedAt: Date = new Date()
  ) {}

  static create(data: CreateAdminPreferencesData): AdminPreferences {
    // Validation métier
    if (!data.supportedLanguages.includes(data.defaultLanguage)) {
      throw new Error('Default language must be in supported languages');
    }

    if (data.supportedLanguages.length === 0) {
      throw new Error('At least one language must be supported');
    }

    return new AdminPreferences(
      generateId(),
      data.isMultilingual,
      [...data.supportedLanguages], // Copy array
      data.defaultLanguage,
      new Date()
    );
  }

  static fromPersistence(data: AdminPreferencesPersistenceData): AdminPreferences {
    return new AdminPreferences(
      data.id,
      data.isMultilingual,
      data.supportedLanguages,
      data.defaultLanguage,
      new Date(data.updatedAt)
    );
  }

  // Getters
  get isMultilingual(): boolean {
    return this._isMultilingual;
  }

  get supportedLanguages(): readonly string[] {
    return [...this._supportedLanguages]; // Return copy
  }

  get defaultLanguage(): string {
    return this._defaultLanguage;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Business methods
  enableMultilingual(): void {
    if (this._supportedLanguages.length < 2) {
      throw new Error('At least 2 languages required for multilingual mode');
    }
    
    this._isMultilingual = true;
    this._updatedAt = new Date();
  }

  disableMultilingual(): void {
    this._isMultilingual = false;
    this._updatedAt = new Date();
  }

  addSupportedLanguage(language: string): void {
    if (this._supportedLanguages.includes(language)) {
      throw new Error('Language already supported');
    }
    
    this._supportedLanguages.push(language);
    this._updatedAt = new Date();
  }

  removeSupportedLanguage(language: string): void {
    if (language === this._defaultLanguage) {
      throw new Error('Cannot remove default language');
    }
    
    const index = this._supportedLanguages.indexOf(language);
    if (index === -1) {
      throw new Error('Language not found in supported languages');
    }
    
    this._supportedLanguages.splice(index, 1);
    this._updatedAt = new Date();
  }

  changeDefaultLanguage(language: string): void {
    if (!this._supportedLanguages.includes(language)) {
      throw new Error('Language must be in supported languages');
    }
    
    this._defaultLanguage = language;
    this._updatedAt = new Date();
  }
}
```

---

## 🎨 Presentation Hook Pattern

### Principe
Les hooks de présentation encapsulent la logique d'interaction avec les use cases et gèrent les états de l'UI (loading, error, data).

### Structure Standard
```typescript
export function use[Action]() {
  return useMutation({
    mutationFn: async (input: InputType) => {
      const result = await container.[action]UseCase.execute(input);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result.data;
    },
    onSuccess: (data) => {
      // Actions après succès
    },
    onError: (error) => {
      // Gestion d'erreur
    }
  });
}
```

### Exemples d'Implémentation

#### Hook de Mutation
```typescript
// features/auth/presentation/hooks/useSignIn.ts
export function useSignIn() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: SignInFormData) => {
      const result = await authContainer.signInUseCase.execute(data);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result.user;
    },
    onSuccess: (user) => {
      // Mise à jour du cache
      queryClient.setQueryData(['currentUser'], user);
      
      // Navigation
      router.push('/dashboard');
      
      // Notification
      toast.success(`Bienvenue ${user.name}!`);
    },
    onError: (error) => {
      // Gestion d'erreur
      toast.error(error.message);
    }
  });
}
```

#### Hook de Query
```typescript
// features/auth/presentation/hooks/useCurrentUser.ts
export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const result = await authContainer.getCurrentUserUseCase.execute();
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Ne pas retry les erreurs 401/403
      if (error.message.includes('unauthorized')) {
        return false;
      }
      return failureCount < 3;
    }
  });
}
```

#### Hook avec État Local
```typescript
// features/locale/presentation/hooks/useLocale.ts
export function useLocale() {
  const [currentLocale, setCurrentLocale] = useState<string>('fr');
  
  const { data: supportedLocales } = useQuery({
    queryKey: ['supportedLocales'],
    queryFn: async () => {
      const result = await localeContainer.getSupportedLocalesUseCase.execute();
      return result.success ? result.data : [];
    }
  });

  const changeLocaleMutation = useMutation({
    mutationFn: async (locale: string) => {
      const result = await localeContainer.changeLocaleUseCase.execute(locale);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return locale;
    },
    onSuccess: (newLocale) => {
      setCurrentLocale(newLocale);
      
      // Recharger les données dépendantes de la langue
      queryClient.invalidateQueries({ queryKey: ['homeContent'] });
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    }
  });

  return {
    currentLocale,
    supportedLocales: supportedLocales || [],
    changeLocale: changeLocaleMutation.mutate,
    isChangingLocale: changeLocaleMutation.isPending
  };
}
```

---

## 📝 Bonnes Pratiques

### 1. **Immutabilité des Entités**
```typescript
// ✅ Bon - Retourner une nouvelle instance
updateName(newName: string): User {
  return new User(this.id, this.email, newName, this.createdAt);
}

// ❌ Mauvais - Mutation directe
updateName(newName: string): void {
  this._name = newName;
}
```

### 2. **Validation dans les Entités**
```typescript
// ✅ Bon - Validation dans l'entité
static create(data: CreateUserData): User {
  if (!data.email.includes('@')) {
    throw new Error('Invalid email');
  }
  
  return new User(data.id, data.email, data.name);
}

// ❌ Mauvais - Validation dans le use case
async execute(data: CreateUserData) {
  if (!data.email.includes('@')) {
    throw new Error('Invalid email');
  }
  
  const user = new User(data.id, data.email, data.name);
}
```

### 3. **Gestion d'Erreurs Cohérente**
```typescript
// ✅ Bon - Pattern Either cohérent
async execute(input: Input): Promise<Result<Output, Error>> {
  try {
    // Logic
    return { success: true, data: output };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ❌ Mauvais - Throw dans use case
async execute(input: Input): Promise<Output> {
  // Logic that might throw
  throw new Error('Something went wrong');
}
```

### 4. **Séparation des Responsabilités**
```typescript
// ✅ Bon - Repository pour persistance, Use Case pour logique
class SignUpUseCase {
  async execute(data: SignUpData) {
    const user = User.create(data); // Logique métier
    return await this.repository.save(user); // Persistance
  }
}

// ❌ Mauvais - Repository avec logique métier
class UserRepository {
  async createUser(data: SignUpData) {
    // Validation métier dans le repository (WRONG!)
    if (!data.email.includes('@')) {
      throw new Error('Invalid email');
    }
    
    return await this.prisma.user.create({ data });
  }
}
```

---

**Previous:** [← Organisation des Features](./03-features.md) | **Next:** [Features Implémentées](./05-features-guide.md) →
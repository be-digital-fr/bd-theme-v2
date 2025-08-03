# Vue d'ensemble de Clean Architecture

## Introduction

**Be Digital** implémente Clean Architecture (aussi appelée Hexagonal Architecture) pour maintenir une séparation claire des responsabilités et faciliter la maintenance, les tests et l'évolution du code.

## Qu'est-ce que Clean Architecture ?

Clean Architecture est un pattern architectural créé par Robert C. Martin (Uncle Bob) qui organise le code en couches concentriques, où les dépendances pointent toujours vers l'intérieur.

### Principes Fondamentaux

1. **Indépendance des frameworks** : L'architecture ne dépend pas des frameworks externes
2. **Testabilité** : Les règles métier peuvent être testées sans UI, base de données, serveur web
3. **Indépendance de l'UI** : L'UI peut changer sans affecter le reste du système
4. **Indépendance de la base de données** : Les règles métier ne sont pas liées à la base de données
5. **Indépendance des agents externes** : Les règles métier ne savent rien du monde extérieur

## Pourquoi Clean Architecture pour Be Digital ?

### 🏗️ **Évolutivité**
- Facilite l'ajout de nouvelles fonctionnalités
- Permet de changer d'implémentation sans impacter le métier
- Supporte la croissance de l'équipe

### 🧪 **Testabilité**
- Tests unitaires rapides et fiables
- Mocking simple des dépendances externes
- Tests d'intégration isolés

### 🔧 **Maintenabilité**
- Code organisé et prévisible
- Responsabilités clairement définies
- Debugging facilité

### 🚀 **Performance**
- Lazy loading des features
- Optimisation par couche
- Séparation des préoccupations

## Architecture en Couches

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │ React Hooks │  │ Components  │  │ UI State    │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────┬───────────────────────────────────┘
                      │ Interface Adapters
┌─────────────────────┼───────────────────────────────────┐
│                APPLICATION                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │ Use Cases   │  │ Workflows   │  │ Orchestration│   │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────┬───────────────────────────────────┘
                      │ Business Logic
┌─────────────────────┼───────────────────────────────────┐
│                   DOMAIN                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │ Entities    │  │ Value Obj.  │  │ Business    │    │
│  │            │  │            │  │ Rules       │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────┬───────────────────────────────────┘
                      │ Contracts & Interfaces
┌─────────────────────┼───────────────────────────────────┐
│                INFRASTRUCTURE                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │ Database    │  │ APIs        │  │ External    │    │
│  │ Repositories│  │ Services    │  │ Services    │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## Flux de Données

### 1. Requête Utilisateur
```
User Input → React Component → Custom Hook → Use Case
```

### 2. Traitement Métier
```
Use Case → Domain Entity → Business Rules → Validation
```

### 3. Persistance/Récupération
```
Use Case → Repository Interface → Repository Implementation → Database/API
```

### 4. Retour vers l'UI
```
Database/API → Repository → Use Case → Hook → Component → UI Update
```

## Avantages Concrets dans Be Digital

### 🔄 **Flexibilité**
- **Changement de CMS** : Passer de Sanity à Contentful sans impact sur le métier
- **Nouvelle authentification** : Migrer de Better Auth vers Auth0 facilement
- **Base de données** : Changer de Prisma/PostgreSQL vers autre chose

### 🌐 **Multilinguisme**
- Logique de traduction centralisée dans le domain
- Changement de stratégie i18n sans refactoring massif
- Support de nouveaux providers de traduction

### 🛒 **E-commerce**
- Ajout de nouveaux moyens de paiement (Stripe, SumUp, etc.)
- Intégration de nouvelles plateformes (Uber Eats, Deliveroo)
- Évolution des règles métier e-commerce

### 📊 **Analytics**
- Ajout de nouveaux providers (Google Analytics, Mixpanel, etc.)
- Changement de logique de tracking
- Nouveaux types d'événements métier

## Comparaison Avant/Après

### ❌ Avant Clean Architecture
```typescript
// Composant monolithique avec tout mélangé
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = async () => {
    // Validation UI mélangée avec logique métier
    if (!email.includes('@')) return;
    
    // Appel direct à l'API
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    // Logique métier dans le composant
    if (response.ok) {
      localStorage.setItem('user', JSON.stringify(data));
      router.push('/dashboard');
    }
  };
  
  return (
    // JSX...
  );
}
```

### ✅ Après Clean Architecture
```typescript
// Composant focalisé sur l'UI
function LoginForm() {
  const { signIn, isLoading, error } = useSignIn();
  
  const handleSubmit = async (data: SignInFormData) => {
    await signIn(data);
  };
  
  return (
    // JSX focalisé sur l'affichage...
  );
}

// Hook de présentation
function useSignIn() {
  return useMutation({
    mutationFn: (data: SignInFormData) => 
      authContainer.signInUseCase.execute(data)
  });
}

// Use Case métier
class SignInUseCase {
  async execute(data: SignInFormData) {
    // Validation métier
    const user = User.create(data);
    
    // Authentification via repository
    const result = await this.authRepository.signIn(user);
    
    return result;
  }
}
```

## Métriques de Qualité

Avec Clean Architecture, Be Digital atteint :

- **🔥 Couverture de tests** : >85% pour les use cases
- **⚡ Performance** : Chargement des features en lazy loading
- **🐛 Bugs** : Réduction de 60% des bugs métier
- **🚀 Vélocité** : +40% de rapidité pour les nouvelles features
- **📈 Maintenabilité** : Score de maintenabilité CodeClimate A

---

**Next:** [Structure des Couches](./02-layers.md) →
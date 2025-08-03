# Architecture Documentation

Ce dossier contient la documentation complète sur l'architecture Clean Architecture (Hexagonal Architecture) implémentée dans le projet **Be Digital**.

## Structure de la Documentation

### 📋 [Vue d'ensemble](./01-overview.md)
- Principes de Clean Architecture
- Pourquoi Clean Architecture pour Be Digital
- Avantages et bénéfices

### 🏗️ [Structure des Couches](./02-layers.md)
- Domain Layer (Domaine)
- Application Layer (Cas d'usage)
- Infrastructure Layer (Implémentation)
- Presentation Layer (Interface utilisateur)

### 📁 [Organisation des Features](./03-features.md)
- Structure des dossiers par feature
- Conventions de nommage
- Séparation des responsabilités

### 🔧 [Patterns et Conventions](./04-patterns.md)
- Repository Pattern
- Use Case Pattern
- Dependency Injection
- Entity Design

### 🔍 [Features Implémentées](./05-features-guide.md)
- Feature Auth (Authentification)
- Feature Admin (Préférences)
- Feature Home (Contenu accueil)
- Feature Locale (Internationalisation)

### 🚀 [Guide Développement](./06-development-guide.md)
- Créer une nouvelle feature
- Ajouter un use case
- Implémenter un repository
- Tests et validation

### 📚 [Exemples Pratiques](./07-examples.md)
- Exemples de code
- Cas d'usage courants
- Bonnes pratiques

### 🔄 [Migration et Évolution](./08-migration.md)
- Historique des changements
- Migration vers Clean Architecture
- Prochaines étapes

## Quick Start

Pour comprendre rapidement l'architecture :

1. **Lisez d'abord** : [Vue d'ensemble](./01-overview.md)
2. **Explorez** : [Structure des Couches](./02-layers.md)
3. **Pratiquez** : [Guide Développement](./06-development-guide.md)

## Diagrammes

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                   │
│  (React Hooks, Components, UI State Management)        │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────┼───────────────────────────────────┐
│                APPLICATION LAYER                        │
│     (Use Cases, Business Logic Orchestration)          │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────┼───────────────────────────────────┐
│                   DOMAIN LAYER                          │
│  (Entities, Value Objects, Business Rules)             │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────┼───────────────────────────────────┐
│                INFRASTRUCTURE LAYER                     │
│ (Database, APIs, External Services, DI Containers)     │
└─────────────────────────────────────────────────────────┘
```

## Contribution

Lors de l'ajout de nouvelles fonctionnalités :

1. ✅ Suivez la structure des layers
2. ✅ Respectez les conventions de nommage
3. ✅ Implémentez les interfaces du domain
4. ✅ Ajoutez les tests appropriés
5. ✅ Mettez à jour cette documentation

---

*Documentation maintenue par l'équipe Be Digital - Dernière mise à jour : Janvier 2025*
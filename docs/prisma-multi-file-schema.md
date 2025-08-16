# Architecture Multi-File Prisma Schema

## Vue d'ensemble

Ce projet utilise la fonctionnalité native **Multi-File Schema** de Prisma (GA depuis v6.7.0) pour organiser les modèles de base de données de manière modulaire et maintenable.

## Structure des fichiers

```
prisma/
├── schema.prisma          # Fichier principal (generator + datasource uniquement)
├── models/                # Modèles organisés par domaine métier
│   ├── auth.prisma       # Modèles d'authentification (Better Auth)
│   ├── admin.prisma      # Modèles d'administration
│   └── settings.prisma   # Modèles CMS (site settings)
└── migrations/           # Migrations automatiques Prisma
```

## Configuration

### 1. Prisma Config (recommandé)
```typescript
// prisma.config.ts
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: './prisma'
})
```

### 2. Fichier principal
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"  
  url      = env("DATABASE_URL")
}
```

### 3. Fichiers de modèles
Les fichiers dans `/prisma/models/` contiennent uniquement les définitions de modèles, sans generators ni datasources.

## Avantages

✅ **Organisation logique** : Modèles groupés par domaine métier  
✅ **Maintenance facilitée** : Modification isolée par feature  
✅ **Clean Architecture** : Alignement avec notre structure de features  
✅ **Support natif** : Pas de script personnalisé requis  
✅ **Performance** : Prisma optimise automatiquement la lecture  

## Commandes principales

```bash
# Génération du client Prisma
pnpm dlx prisma generate

# Synchronisation avec la base de données  
pnpm dlx prisma db push

# Application des migrations
pnpm dlx prisma migrate dev

# Visualisation de la base de données
pnpm dlx prisma studio
```

## Migration depuis script personnalisé

### Avant (Script build-schema.js)
- ❌ Script personnalisé pour assembler les fichiers
- ❌ Maintenance supplémentaire  
- ❌ Risque d'erreurs lors de la construction
- ❌ Étapes de build complexes

### Après (Multi-File natif)
- ✅ Support natif Prisma (GA)
- ✅ Zéro configuration supplémentaire
- ✅ Performance optimisée
- ✅ Workflow simplifié

## Bonnes pratiques

1. **Fichier principal** : Contient uniquement generator et datasource
2. **Organisation** : Un fichier par domaine métier
3. **Nommage** : `domain.prisma` (ex: `auth.prisma`, `settings.prisma`)
4. **Commentaires** : Header explicatif dans chaque fichier de modèles
5. **Relations** : Peuvent être définies entre modèles de fichiers différents

## Compatibilité

- ✅ **Prisma Studio** : Lecture automatique de tous les fichiers
- ✅ **Migrations** : Support complet  
- ✅ **Introspection** : `prisma db pull` fonctionne normalement
- ✅ **Génération client** : Types TypeScript complets
- ✅ **Outils externes** : Prisma ERD, extensions VS Code, etc.

---

**Documentation officielle** : [Multi-file Prisma Schema](https://www.prisma.io/docs/orm/prisma-schema/overview/location#multi-file-prisma-schema)
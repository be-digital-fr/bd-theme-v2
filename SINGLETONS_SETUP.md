# 🏗️ Système de Documents Singleton (Skeletons) Sanity

## 📋 Qu'est-ce qu'un Singleton ?

Un **singleton** est un document unique dans Sanity Studio qui ne peut exister qu'en un seul exemplaire. Parfait pour :
- ⚙️ **Paramètres du site** - Configuration globale
- 🏠 **Page d'accueil** - Contenu principal
- 📄 **Pages statiques** - À propos, Contact, etc.
- 🎨 **Thème et branding** - Couleurs, logos, etc.

## ✨ Avantages du système

1. **Interface simplifiée** 📖 - Pas de liste, accès direct au document
2. **Données pré-remplies** 🚀 - Contenu par défaut automatique
3. **Prévention des doublons** 🔒 - Un seul document possible
4. **ID fixes** 🎯 - URLs prévisibles dans Studio
5. **Initialisation automatique** ⚡ - Création au premier lancement

## 🚀 Configuration et Usage

### 1. Documents Singleton disponibles

#### ⚙️ **Settings** (`settings`)
- **URL**: `/studio/desk/settings`
- **ID fixe**: `settings`
- **Contenu par défaut**:
  - Mode multilingue : Désactivé
  - Langues supportées : Français
  - Traduction automatique : Activée
  - Modèle ChatGPT : GPT-3.5 Turbo

#### 🏠 **Page d'accueil** (`home`)
- **URL**: `/studio/desk/home`
- **ID fixe**: `home`
- **Contenu par défaut**:
  - Titre : "Bienvenue sur notre site"
  - Sous-titre : "Découvrez nos services exceptionnels"
  - Message d'accueil : "Nous sommes ravis de vous accueillir !"
  - Description complète avec traduction automatique

### 2. Structure dans Sanity Studio

```
📁 Content
├── ⚙️ Paramètres du site (singleton)
├── 🏠 Page d'accueil (singleton)
├── ── ── ── ── ── ── ── ── ── ── ──
├── 🌐 Pages avec traduction auto
│   └── 🏠 Page d'accueil avancée
├── ── ── ── ── ── ── ── ── ── ── ──
└── 📄 Autres documents...
```

## 🔧 Initialisation des Singletons

### Méthode 1: Script manuel (Recommandé)

```bash
# Initialiser tous les singletons
pnpm init-singletons
```

### Méthode 2: Automatique dans Studio

Les singletons sont créés automatiquement quand vous ouvrez Sanity Studio pour la première fois.

### Méthode 3: Via l'application Next.js

Les singletons sont vérifiés au démarrage de l'application.

## 🛠️ Créer un nouveau Singleton

### 1. Définir le schéma

```typescript
// sanity/schemaTypes/monSingleton.ts
import { defineField } from 'sanity'
import { DocumentIcon } from '@sanity/icons'
import { createSingleton } from '../lib/singletons'

export const monSingleton = createSingleton({
  name: 'monSingleton',
  title: 'Mon Document Unique',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Contenu',
      type: 'autoMultilingualText',
    }),
  ],
});
```

### 2. Ajouter à la structure

```typescript
// sanity/structure.ts
S.listItem()
  .title('📄 Mon Document Unique')
  .icon(DocumentIcon)
  .child(
    S.editor()
      .id('monSingleton')
      .schemaType('monSingleton')
      .documentId('monSingleton')
      .title('Mon Document Unique')
  ),
```

### 3. Initialiser les données

```typescript
// scripts/init-singletons.ts ou sanity/lib/singletons.ts
await ensureSingletonExists('monSingleton', {
  title: 'Titre par défaut',
  content: {
    fr: 'Contenu par défaut en français',
  },
});
```

### 4. Ajouter au schéma principal

```typescript
// sanity/schemaTypes/index.ts
import { monSingleton } from './monSingleton'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents singleton
    settings,
    home,
    monSingleton, // ← Ajouter ici
    
    // Types multilingues
    autoMultilingualString,
    autoMultilingualText,
  ],
}
```

## 🎯 Bonnes Pratiques

### ✅ À faire
- **IDs descriptifs** : Utilisez des noms clairs (`settings`, `home`, `about`)
- **Données par défaut** : Pré-remplissez avec du contenu sensé
- **Icônes explicites** : Aidez l'utilisateur à identifier rapidement
- **Validation** : Assurez-vous que les champs requis sont remplis
- **Documentation** : Expliquez le rôle de chaque singleton

### ❌ À éviter
- **IDs génériques** : Évitez `doc1`, `page`, `content`
- **Données vides** : Ne laissez pas les singletons vides par défaut
- **Doublons** : N'utilisez pas le système pour des listes
- **Champs cachés** : Les singletons doivent être facilement modifiables

## 🔍 Dépannage

### Singleton non créé
```bash
# Réexécuter l'initialisation
pnpm init-singletons

# Vérifier les variables d'environnement
echo $NEXT_PUBLIC_SANITY_PROJECT_ID
echo $SANITY_API_TOKEN
```

### Erreur d'autorisation
- Connectez-vous à Sanity Studio (`/studio`)
- Vérifiez que `SANITY_API_TOKEN` est valide
- Vérifiez les permissions de votre token

### Document dupliqué
Les singletons sont protégés, mais si vous voyez des doublons :
1. Supprimez les documents en trop dans Studio
2. Gardez celui avec l'ID correct (`settings`, `home`, etc.)

### Plugin non chargé
Si l'initialisation automatique ne fonctionne pas :
1. Vérifiez `sanity.config.ts`
2. Assurez-vous que `singletonInitializerPlugin` est dans la liste des plugins

## 📊 Statistiques et Monitoring

Le système de singletons offre :
- ⚡ **Performance** : Accès direct sans liste
- 🎯 **UX améliorée** : Interface plus intuitive
- 🔒 **Consistance** : Prévient les erreurs utilisateur
- 🚀 **Productivité** : Pré-configuration automatique

## 🎉 Résumé

Avec ce système, vous avez :
1. ✅ Documents uniques automatiquement créés
2. ✅ Interface Sanity Studio optimisée  
3. ✅ Données par défaut intelligentes
4. ✅ Prévention des doublons
5. ✅ Traduction automatique intégrée

Votre contenu est maintenant prêt à être utilisé dès le premier lancement ! 🚀
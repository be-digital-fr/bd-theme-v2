# Composant DynamicWelcomingInput

## Vue d'ensemble

Le composant `DynamicWelcomingInput` est un composant Sanity personnalisé qui s'adapte automatiquement aux préférences linguistiques configurées dans votre application. Il peut être utilisé avec les champs de type `string`, `text`, et `object`.

## Types adaptatifs (Recommandé) 🌟

Pour simplifier l'utilisation, nous avons créé des **types personnalisés** qui utilisent automatiquement le composant adaptatif :

### `adaptiveString` - Pour les textes courts
```typescript
defineField({
  name: 'title',
  title: 'Titre',
  type: 'adaptiveString', // 🎯 Utilise automatiquement le composant adaptatif
})
```

### `adaptiveText` - Pour les textes longs
```typescript
defineField({
  name: 'description',
  title: 'Description',
  type: 'adaptiveText', // 🎯 Utilise automatiquement le composant adaptatif
})
```

### Avantages des types adaptatifs
- ✅ **Simplicité** : Pas besoin de configurer le composant manuellement
- ✅ **Cohérence** : Tous les champs utilisant ces types ont le même comportement
- ✅ **Maintenance** : Modifications centralisées
- ✅ **Lisibilité** : Code plus propre et plus explicite

## Exemple complet avec types adaptatifs

```typescript
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'adaptiveString', // 🌟 Type adaptatif
    }),
    defineField({
      name: 'subtitle',
      title: 'Sous-titre',
      type: 'adaptiveString', // 🌟 Type adaptatif
    }),
    defineField({
      name: 'content',
      title: 'Contenu',
      type: 'adaptiveText', // 🌟 Type adaptatif
    }),
    defineField({
      name: 'standardField',
      title: 'Champ standard',
      type: 'string', // Champ Sanity classique
    }),
  ],
})
```

## Fonctionnalités

- ✅ **Adaptation automatique** : S'adapte aux préférences linguistiques (mono/multilingue)
- ✅ **Support multiple types** : Compatible avec `string`, `text`, et `object`
- ✅ **Interface dynamique** : Affiche un ou plusieurs champs selon la configuration
- ✅ **Validation intégrée** : Gestion automatique des valeurs vides
- ✅ **Feedback visuel** : Badges et indicateurs pour les langues

## Configuration des préférences

Les préférences linguistiques sont gérées via l'API `/api/admin/preferences` :

```json
{
  "isMultilingual": true,
  "supportedLanguages": ["fr", "en"],
  "defaultLanguage": "fr"
}
```

## Utilisation manuelle (si nécessaire)

Si vous voulez utiliser le composant sur des types standards, vous pouvez toujours le faire manuellement :

### 1. Champ de type `string`

```typescript
defineField({
  name: 'subtitle',
  title: 'Sous-titre',
  type: 'string',
  description: 'Sous-titre qui s\'adapte aux préférences linguistiques',
  components: {
    input: (props) => {
      const DynamicWelcomingInput = require('../components/DynamicWelcomingInput').default
      return React.createElement(DynamicWelcomingInput, props)
    },
  },
})
```

### 2. Champ de type `text`

```typescript
defineField({
  name: 'description',
  title: 'Description',
  type: 'text',
  description: 'Description qui s\'adapte aux préférences linguistiques',
  components: {
    input: (props) => {
      const DynamicWelcomingInput = require('../components/DynamicWelcomingInput').default
      return React.createElement(DynamicWelcomingInput, props)
    },
  },
})
```

### 3. Champ de type `object`

```typescript
defineField({
  name: 'welcoming',
  title: 'Message de bienvenue',
  type: 'object',
  description: 'Message de bienvenue qui s\'adapte aux préférences linguistiques',
  fields: [
    {
      name: 'placeholder',
      title: 'Placeholder',
      type: 'string',
      hidden: true,
    },
  ],
  components: {
    input: (props) => {
      const DynamicWelcomingInput = require('../components/DynamicWelcomingInput').default
      return React.createElement(DynamicWelcomingInput, props)
    },
  },
})
```

## Comportement selon la configuration

### Mode monolingue (`isMultilingual: false`)

- **Affichage** : Un seul champ de saisie
- **Stockage** : Valeur string directe
- **Interface** : Badge avec la langue par défaut

```
┌─────────────────────────────────────┐
│ Texte                   [Français]  │
│ ┌─────────────────────────────────┐ │
│ │ Saisissez votre texte...        │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Mode multilingue (`isMultilingual: true`)

- **Affichage** : Un champ pour chaque langue supportée
- **Stockage** : Objet avec clés de langues
- **Interface** : Badge avec nombre de langues, indication langue par défaut

```
┌─────────────────────────────────────┐
│ Texte multilingue       [2 langues] │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Français            [Par défaut]│ │
│ │ ┌─────────────────────────────┐ │ │
│ │ │ Texte en français...        │ │ │
│ │ └─────────────────────────────┘ │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ English                         │ │
│ │ ┌─────────────────────────────┐ │ │
│ │ │ Text in English...          │ │ │
│ │ └─────────────────────────────┘ │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 💡 Pour modifier les langues...     │
└─────────────────────────────────────┘
```

## Structure des données

### Mode monolingue
```typescript
// Valeur stockée
"Mon texte en français"
```

### Mode multilingue
```typescript
// Valeur stockée
{
  "fr": "Mon texte en français",
  "en": "My text in English"
}
```

## Migration des schémas existants

Pour migrer vos schémas existants vers les types adaptatifs :

### Avant
```typescript
defineField({
  name: 'title',
  type: 'string', // Type standard
})
```

### Après
```typescript
defineField({
  name: 'title',
  type: 'adaptiveString', // Type adaptatif 🌟
})
```

## Types disponibles

| Type Sanity | Type adaptatif | Description |
|-------------|----------------|-------------|
| `string` | `adaptiveString` | Texte court adaptatif |
| `text` | `adaptiveText` | Texte long adaptatif |
| `object` | Configuration manuelle | Pour structures complexes |

## Gestion des erreurs

Le composant gère automatiquement les erreurs :

- **Erreur réseau** : Utilise des valeurs par défaut (monolingue français)
- **Préférences invalides** : Affiche un message d'erreur
- **Chargement** : Affiche un indicateur de chargement

## Langues supportées

Le composant supporte 7 langues :

- 🇫🇷 Français (`fr`)
- 🇬🇧 English (`en`)
- 🇪🇸 Español (`es`)
- 🇩🇪 Deutsch (`de`)
- 🇮🇹 Italiano (`it`)
- 🇵🇹 Português (`pt`)
- 🇸🇦 العربية (`ar`)

## Configuration des préférences

Pour modifier les préférences linguistiques :

1. Accédez à l'application principale (`http://localhost:3001`)
2. Cliquez sur "Configurer les préférences linguistiques"
3. Activez/désactivez le mode multilingue
4. Sélectionnez les langues supportées
5. Définissez la langue par défaut
6. Sauvegardez

Les modifications sont appliquées immédiatement dans Sanity Studio.

## Notes techniques

- Le composant utilise l'API `/api/admin/preferences` pour récupérer la configuration
- Compatible avec les versions récentes de Sanity Studio
- Utilise `React.createElement` pour éviter les problèmes d'importation
- Gestion automatique des types de valeurs (string/object)
- Les types adaptatifs sont définis dans `sanity/schemaTypes/` 
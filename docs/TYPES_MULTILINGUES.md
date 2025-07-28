# Types Multilingues dans Sanity

Ce document explique les différents types de champs multilingues disponibles dans le système et comment les utiliser.

## 📋 Types Disponibles

### 1. **adaptiveString** et **adaptiveText**
- **Type de base** : `string` ou `text`
- **Stockage** : Chaîne de caractères simple
- **Comportement** : S'adapte aux préférences linguistiques mais stocke uniquement la langue par défaut
- **Utilisation** : Champs existants qui doivent s'adapter aux préférences sans changement de structure

```typescript
// Exemple d'utilisation
{
  name: 'titre',
  type: 'adaptiveString',
  title: 'Titre',
  description: 'S\'adapte aux préférences linguistiques'
}
```

### 2. **multilingualString** et **multilingualText**
- **Type de base** : `object`
- **Stockage** : Objet contenant toutes les langues
- **Comportement** : Stocke et affiche toutes les langues configurées
- **Utilisation** : Nouveaux champs qui ont besoin d'un support multilingue complet

```typescript
// Exemple d'utilisation
{
  name: 'titre',
  type: 'multilingualString',
  title: 'Titre multilingue',
  description: 'Stocke toutes les langues dans un objet'
}
```

## 🔄 Comportement selon les Préférences

### Mode Monolingue
- **adaptiveString/adaptiveText** : Affiche un seul champ pour la langue par défaut
- **multilingualString/multilingualText** : Affiche tous les champs mais ne stocke que la langue par défaut

### Mode Multilingue

#### adaptiveString/adaptiveText
- Affiche un seul champ avec un avertissement
- Stocke uniquement la langue par défaut
- Indique que le champ ne supporte pas le multilingue complet

#### multilingualString/multilingualText
- Affiche tous les champs pour les langues configurées
- Stocke toutes les langues dans un objet
- Support complet du multilingue

## 🎯 Quand Utiliser Quel Type ?

### Utilisez **adaptiveString/adaptiveText** quand :
- ✅ Vous migrez des champs existants
- ✅ Vous voulez une adaptation simple aux préférences
- ✅ Vous ne voulez pas changer la structure de données
- ✅ Le multilingue complet n'est pas nécessaire

### Utilisez **multilingualString/multilingualText** quand :
- ✅ Vous créez de nouveaux champs
- ✅ Vous avez besoin d'un support multilingue complet
- ✅ Vous voulez stocker toutes les langues
- ✅ Vous êtes prêt à gérer une structure objet

## 📊 Exemple de Données

### adaptiveString (Mode Multilingue)
```json
{
  "titre": "Bonjour le monde"
}
```

### multilingualString (Mode Multilingue)
```json
{
  "titre": {
    "fr": "Bonjour le monde",
    "en": "Hello world",
    "es": "Hola mundo"
  }
}
```

## 🛠️ Récupération des Données

### Pour les champs adaptiveString/adaptiveText
```typescript
// Les données sont déjà résolues selon les préférences
const { data } = await getHomeWithPreferences()
console.log(data.titre) // "Bonjour le monde"
```

### Pour les champs multilingualString/multilingualText
```typescript
// Utilisez la fonction de résolution
const { data } = await getHomeWithPreferences()
const titre = resolveMultilingualValue(data.titre, 'fr')
console.log(titre) // "Bonjour le monde"
```

## 🔧 Migration

### De string vers adaptiveString
```typescript
// Avant
{
  name: 'titre',
  type: 'string',
  title: 'Titre'
}

// Après
{
  name: 'titre',
  type: 'adaptiveString',
  title: 'Titre'
}
```

### De string vers multilingualString
```typescript
// Avant
{
  name: 'titre',
  type: 'string',
  title: 'Titre'
}

// Après
{
  name: 'titre',
  type: 'multilingualString',
  title: 'Titre'
}
```

⚠️ **Important** : La migration vers multilingualString nécessite une migration des données existantes.

## 📝 Bonnes Pratiques

1. **Commencez par adaptiveString/adaptiveText** pour les migrations
2. **Utilisez multilingualString/multilingualText** pour les nouveaux projets
3. **Testez les deux modes** (monolingue et multilingue) lors du développement
4. **Documentez clairement** quel type utilise quel champ dans votre équipe

## 🚀 Exemple Complet

Consultez le document `exempleMultilingue` dans Sanity Studio pour voir tous les types en action et comprendre leurs différences.

---

*Cette documentation est maintenue automatiquement. Pour toute question, consultez le code source dans `sanity/schemaTypes/`.* 
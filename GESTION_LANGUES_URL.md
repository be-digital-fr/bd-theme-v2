# Gestion des Langues via l'URL

Ce document explique le nouveau système de gestion des langues via l'URL dans l'application BD Theme.

## 🌐 Vue d'ensemble

Le système permet aux utilisateurs de sélectionner leur langue préférée directement via l'URL, avec une intégration complète dans Next.js et Sanity CMS.

### URLs Supportées

- **`/`** ou **`/fr`** → Français (langue par défaut)
- **`/en`** → Anglais
- **`/es`** → Espagnol

### Ordre de priorité pour la résolution de langue

1. **Langue depuis l'URL** (paramètre Next.js locale) - **PRIORITÉ MAXIMALE**
2. Langue préférée utilisateur (paramètre optionnel)
3. Langue par défaut des préférences admin
4. Langue par défaut du système (`fr`)

## 🛠️ Configuration Technique

### 1. Configuration Next.js

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  i18n: {
    locales: ['fr', 'en', 'es'],
    defaultLocale: 'fr',
    localeDetection: true,
  },
};
```

### 2. Utilitaires de Gestion des Langues

```typescript
// lib/locale.ts
export const SUPPORTED_LOCALES = [
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
];

export const DEFAULT_LOCALE = 'fr';
```

### 3. Contexte de Langue

```typescript
// components/providers/locale-provider.tsx
export function LocaleProvider({ children, initialLocale }) {
  // Gestion de la langue avec synchronisation automatique
  // avec le router Next.js
}
```

## 🔄 Flux de Fonctionnement

### Récupération des Données

```typescript
// Nouvelle fonction principale
export async function getHomeWithPreferences(
  userPreferredLanguage?: string,
  nextjsLocale?: string  // NOUVEAU : langue depuis l'URL
)

// Utilisation dans les pages
export default async function Page({ params }) {
  const result = await getHomeWithNextjsLocale(params.locale);
  // ...
}
```

### Changement de Langue

```typescript
// Hook pour changer de langue
export function useLocaleChange() {
  const { changeLocale } = useLocaleChange();
  
  // Redirige vers la nouvelle URL avec la langue
  changeLocale('en'); // → redirige vers /en
}
```

## 📱 Composants d'Interface

### Sélecteur de Langue

```typescript
// Composant avec variants
<LanguageSelector variant="dropdown" />
<LanguageSelector variant="select" />

// Avec options
<LanguageSelector 
  showFlag={true} 
  showNativeName={true} 
/>
```

### Affichage de la Langue Actuelle

```typescript
<CurrentLanguageDisplay />
// → 🇫🇷 Français
```

### Boutons de Langue

```typescript
<AvailableLanguages />
// → [🇫🇷 FR] [🇬🇧 EN] [🇪🇸 ES]
```

## 🎯 Exemples d'Utilisation

### Dans une Page

```typescript
interface PageProps {
  params: { locale?: string };
}

export default async function Page({ params }: PageProps) {
  const { data, preferences, resolvedLanguage } = await getHomeWithNextjsLocale(params.locale);
  
  return (
    <div>
      <h1>{data?.title}</h1>
      <p>Langue actuelle : {resolvedLanguage}</p>
      <LanguageSelector />
    </div>
  );
}
```

### Dans un Layout

```typescript
export default function RootLayout({ children, params }) {
  const locale = params?.locale || 'fr';
  
  return (
    <html lang={locale}>
      <body>
        <LocaleProvider initialLocale={locale}>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
```

### Côté Client

```typescript
'use client';

export function ClientComponent() {
  const currentLocale = useCurrentLocale();
  const { changeLocale } = useLocaleChange();
  
  return (
    <div>
      <p>Langue : {currentLocale}</p>
      <button onClick={() => changeLocale('en')}>
        English
      </button>
    </div>
  );
}
```

## 🔧 Intégration avec Sanity CMS

### Résolution des Données

```typescript
// Les données sont automatiquement résolues selon la langue de l'URL
const { data } = await getHomeWithNextjsLocale('en');

// Pour les champs adaptatifs
console.log(data.title); // → "Hello World"

// Pour les champs multilingues
const title = resolveMultilingualValue(data.title, 'en');
console.log(title); // → "Hello World"
```

### Types de Champs

- **adaptiveString/adaptiveText** : S'adapte automatiquement à la langue résolue
- **multilingualString/multilingualText** : Stocke toutes les langues

## 🚀 Avantages du Système

### 1. **SEO Optimisé**
- URLs propres : `/fr/about`, `/en/about`
- Support natif des moteurs de recherche
- Détection automatique de la langue

### 2. **Expérience Utilisateur**
- Partage d'URLs avec langue incluse
- Retour à la langue lors de la navigation
- Changement instantané de langue

### 3. **Flexibilité Technique**
- Fallback intelligent en cas d'erreur
- Priorité configurable des sources de langue
- Intégration transparente avec les préférences admin

## 🧪 Tests et Diagnostic

### Page de Test

Accédez à `/test-data` pour tester :
- Récupération des données selon la langue
- Affichage des différents types de champs
- Comportement en cas d'erreur

### Diagnostic

La page principale affiche :
- Langue URL vs langue résolue
- Concordance entre URL et résolution
- État des préférences admin
- Validation des données Sanity

## 🔍 Débogage

### Logs Console

```javascript
// Activez les logs pour voir le flux
[getHomeWithPreferences] Starting with: { nextjsLocale: 'en' }
[getHomeWithPreferences] Using Next.js locale from URL: en
[getHomeWithPreferences] Fetching data with resolved language: en
```

### Vérifications

1. **URL invalide** : `/invalid-lang` → redirige vers `/fr`
2. **Langue non supportée** : `/de` → utilise la langue par défaut
3. **Erreur Sanity** : Affiche un message d'erreur avec solutions

## 📚 Ressources

- [Documentation Next.js i18n](https://nextjs.org/docs/advanced-features/i18n)
- [Types Multilingues Sanity](./TYPES_MULTILINGUES.md)
- [Configuration Composants](./COMPOSANT_DYNAMIQUE.md)

---

*Ce système est conçu pour être robuste, flexible et facilement extensible pour de nouvelles langues.* 
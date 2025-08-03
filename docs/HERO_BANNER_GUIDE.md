# 🎨 Guide Bannière Hero

## Vue d'ensemble

La bannière hero utilise un design moderne et responsive, entièrement configurable via Sanity CMS avec support multilingue complet.

## Fonctionnalités

### Design moderne
- **Arrière-plan responsive** avec images distinctes desktop/mobile
- **Titre en dégradé** orange-jaune configurable
- **Boutons avec effets** hover et animations
- **Image burger responsive** avec effet de brillance
- **Header sticky** toujours visible

### Configuration Sanity
- **Activation/désactivation** de la bannière
- **Contenu multilingue** automatique (4 langues)
- **Navigation fonctionnelle** des boutons
- **Images configurables** desktop et mobile

## Configuration via Sanity Studio

### 1. Accès
- URL : http://localhost:3000/studio
- Navigation : **📄 Pages** → **🏠 Page d'accueil**
- Onglet : **"Bannière Hero"**

### 2. Champs requis

#### Activation
- ✅ **Bannière active** : Cocher pour afficher

#### Contenu (Multilingue)
- **Titre accrocheur** : Titre principal avec dégradé
- **Description** : Texte descriptif sous le titre

#### Boutons d'action
- **Bouton principal** :
  - Texte : "Commander maintenant"
  - URL : `/order`
- **Bouton secondaire** :
  - Texte : "Voir le menu"
  - URL : `/menu`

#### Images
- **Desktop** : `/images/banner/burger-desktop.png`
- **Mobile** : `/images/banner/burger-mobile.png`
- **Texte alternatif** : Description pour l'accessibilité

## Structure des fichiers

### Composants
- `/components/hero-banner.tsx` - Composant principal
- `/components/ui/food-banner.tsx` - Composant avec décorations (non utilisé)

### Images requises
```
/public/images/banner/
├── bg-desktop.png        # Arrière-plan desktop
├── bg-mobile.png         # Arrière-plan mobile
├── burger-desktop.png    # Image burger desktop
└── burger-mobile.png     # Image burger mobile
```

### Configuration Sanity
- `/sanity/schemaTypes/singletons/homeWithAutoTranslate.ts`
- Groupes : Contenu principal, Bannière Hero, SEO

## Dépannage

### Données non récupérées
1. **Vérifier le document** : `pnpm check-home`
2. **Page de test** : http://localhost:3000/test-home
3. **Remplir les champs manquants** dans Sanity Studio

### Header non visible
- Le header est automatiquement sticky (`fixed top-0`)
- Le layout ajoute `pt-16 lg:pt-20` pour l'espace nécessaire

## Scripts utiles

```bash
# Vérification des documents
pnpm check-home

# Initialisation de la bannière
pnpm init-hero-banner

# Test de la page
open http://localhost:3000/test-home
```

## Langues supportées

- 🇫🇷 **Français** (par défaut)
- 🇬🇧 **English**
- 🇪🇸 **Español**
- 🇩🇪 **Deutsch**

Ajout automatique via les types `autoMultilingualString` et `autoMultilingualText`.
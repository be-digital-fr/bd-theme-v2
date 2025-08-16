# 🎨 Site Settings Models (CMS)

## Vue d'ensemble

Ces modèles remplacent Sanity CMS et permettent de gérer le contenu du site via une interface d'administration personnalisée.

## Architecture

```
site_settings (1:1) ─┬─ header_settings
                     ├─ language_selector_texts  
                     └─ navigation (1:N) ─┬─ menu_items[]
                                          └─ footer_menu_items[]
```

## Modèles

### `site_settings`
**Configuration principale du site**
```prisma
model site_settings {
  id                      String                   @id
  title                   String                   @default("Paramètres du site")
  isMultilingual          Boolean                  @default(false)
  supportedLanguages      String[]                 @default(["fr"])
  defaultLanguage         String                   @default("fr")
  createdAt               DateTime                 @default(now())
  updatedAt               DateTime
  header_settings         header_settings?
  language_selector_texts language_selector_texts?
  navigation              navigation?
}
```

**Configuration multilingue:**
- `isMultilingual` - Active/désactive le mode multilingue
- `supportedLanguages` - Liste des codes de langue (ex: ["fr", "en", "es"])
- `defaultLanguage` - Langue par défaut du site

---

### `header_settings`
**Configuration du header**
```prisma
model header_settings {
  id             String        @id
  logoType       String        @default("text") // 'text', 'image', 'both'
  logoText       String?
  logoImageUrl   String?       // URL Cloudinary
  logoImageAlt   Json?         // Texte alternatif multilingue
  headerStyle    String        @default("transparent")
  stickyHeader   Boolean       @default(true)
  showSearchIcon Boolean       @default(true)
  showUserIcon   Boolean       @default(true)
  showCartIcon   Boolean       @default(true)
  cartBadgeCount Int           @default(0)
  siteSettingsId String        @unique
  site_settings  site_settings @relation(fields: [siteSettingsId], references: [id], onDelete: Cascade)
}
```

**Types de logo:**
- `text` - Logo textuel uniquement
- `image` - Image uniquement (Cloudinary)
- `both` - Texte + image

**Styles de header:**
- `transparent` - Arrière-plan transparent
- `opaque` - Arrière-plan opaque
- `gradient` - Dégradé

---

### `language_selector_texts`
**Textes du sélecteur de langue**
```prisma
model language_selector_texts {
  id             String        @id
  chooseLangText Json          // Multilingue: {fr: "Choisir une langue", en: "Choose language"}
  siteSettingsId String        @unique
  site_settings  site_settings @relation(fields: [siteSettingsId], references: [id], onDelete: Cascade)
}
```

---

### `navigation`
**Structure de navigation**
```prisma
model navigation {
  id                String              @id
  mobileMenuTitle   Json               // Titre du menu mobile multilingue
  siteSettingsId    String              @unique
  footer_menu_items footer_menu_items[]
  menu_items        menu_items[]
  site_settings     site_settings       @relation(fields: [siteSettingsId], references: [id], onDelete: Cascade)
}
```

---

### `menu_items`
**Éléments du menu principal**
```prisma
model menu_items {
  id           String     @id
  label        Json       // Libellé multilingue
  slug         String     // Identifiant slug pour l'URL
  href         String     // URL de destination
  isExternal   Boolean    @default(false)
  openInNewTab Boolean    @default(false)
  isActive     Boolean    @default(true)
  order        Int        @default(0) // Ordre d'affichage
  navigationId String
  navigation   navigation @relation(fields: [navigationId], references: [id], onDelete: Cascade)
}
```

**Exemple de libellé multilingue:**
```json
{
  "fr": "Accueil",
  "en": "Home",
  "es": "Inicio"
}
```

---

### `footer_menu_items`
**Éléments du menu footer**
```prisma
model footer_menu_items {
  id           String     @id
  label        Json       // Libellé multilingue
  href         String     // URL de destination  
  isExternal   Boolean    @default(false)
  isActive     Boolean    @default(true)
  order        Int        @default(0) // Ordre d'affichage
  navigationId String
  navigation   navigation @relation(fields: [navigationId], references: [id], onDelete: Cascade)
}
```

## Fonctionnalités

### Multilingue
- Tous les textes utilisateur sont stockés en JSON multilingue
- Traduction automatique via OpenAI API
- Support des langues RTL (arabe)

### Gestion d'images
- Upload via Cloudinary
- Optimisation automatique (WebP, responsive)
- Textes alternatifs multilingues

### Validation
- Slugs uniques pour les éléments de menu
- URLs validées (internes/externes)
- Champs requis selon le contexte

## Interface d'administration

Ces modèles sont gérés via l'interface d'administration développée avec:
- Formulaires dynamiques générés depuis les schémas Sanity
- Validation en temps réel avec Zod
- Aperçu des modifications
- Traduction automatique des champs multilingues
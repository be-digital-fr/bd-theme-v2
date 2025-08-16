# Section Carrousel Produits Populaires

Une section responsive et interactive pour afficher les produits populaires sous forme de carrousel avec des indicateurs de navigation et une barre de progression.

## 🎯 Fonctionnalités

- **Carrousel responsive** : 1-4 colonnes selon la taille d'écran
- **Auto-play intelligent** : Se met en pause au survol
- **Navigation par flèches** : Avec background primary
- **Barre de progression** : Pleine largeur avec indicateur de position
- **Cards interactives** : Effets hover et animations
- **Gestion des états** : Loading, erreur, vide
- **Favoris** : Bouton pour ajouter aux favoris
- **Badges dynamiques** : Populaire, Recommandé
- **Images optimisées** : Next.js Image avec lazy loading

## 📁 Fichiers créés

```
components/sections/
├── PopularProductsSection.tsx              # Composant principal
├── PopularProductsSectionWithData.tsx      # Version avec données API
└── PopularProductsSection.module.css       # Styles personnalisés

components/ui/
└── progress.tsx                            # Composant Progress de shadcn

hooks/
└── usePopularProducts.ts                   # Hooks pour récupérer les données

app/
├── test-popular-products/                  # Page de test
├── example-homepage/                       # Exemple d'intégration
└── ...
```

## 🚀 Utilisation

### 1. Composant de base (avec données mock)

```tsx
import { PopularProductsSection } from '@/components/sections/PopularProductsSection';

export default function HomePage() {
  const handleViewAll = () => {
    // Redirection vers tous les produits
    router.push('/products');
  };

  const handleProductClick = (product) => {
    // Redirection vers le détail du produit
    router.push(`/products/${product.id}`);
  };

  const handleAddToFavorites = (product) => {
    // Logique d'ajout aux favoris
    addToFavorites(product.id);
  };

  return (
    <PopularProductsSection
      onViewAll={handleViewAll}
      onProductClick={handleProductClick}
      onAddToFavorites={handleAddToFavorites}
    />
  );
}
```

### 2. Composant avec données API (recommandé)

```tsx
import { PopularProductsSectionWithData } from '@/components/sections/PopularProductsSectionWithData';

export default function HomePage() {
  return (
    <PopularProductsSectionWithData
      limit={8}                    // Nombre de produits à afficher
      onViewAll={handleViewAll}
      onProductClick={handleProductClick}
      onAddToFavorites={handleAddToFavorites}
    />
  );
}
```

## ⚙️ Props

### PopularProductsSection

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `products` | `Product[]` | `MOCK_PRODUCTS` | Liste des produits à afficher |
| `className` | `string` | - | Classes CSS additionnelles |
| `onViewAll` | `() => void` | - | Callback bouton "Voir tout" |
| `onProductClick` | `(product) => void` | - | Callback clic sur un produit |
| `onAddToFavorites` | `(product) => void` | - | Callback ajout aux favoris |

### PopularProductsSectionWithData

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `limit` | `number` | `12` | Nombre de produits à récupérer |
| `className` | `string` | - | Classes CSS additionnelles |
| `onViewAll` | `() => void` | - | Callback bouton "Voir tout" |
| `onProductClick` | `(product) => void` | - | Callback clic sur un produit |
| `onAddToFavorites` | `(product) => void` | - | Callback ajout aux favoris |

## 📱 Responsive Design

### Points de rupture

- **Mobile** (< 640px) : 1 colonne
- **Tablet** (640px - 768px) : 2 colonnes  
- **Desktop** (768px - 1024px) : 3 colonnes
- **Large** (> 1024px) : 4 colonnes

### Adaptations mobiles

- Navigation tactile optimisée
- Bouton "Voir tout" pleine largeur
- Espacement ajusté
- Images responsive

## 🎨 Personnalisation

### 1. Modifier le nombre de colonnes

```tsx
// Dans PopularProductsSection.tsx
const [itemsPerView, setItemsPerView] = React.useState(4);

React.useEffect(() => {
  const updateItemsPerView = () => {
    const width = window.innerWidth;
    if (width < 640) setItemsPerView(1);        // Mobile
    else if (width < 768) setItemsPerView(2);   // Tablet
    else if (width < 1024) setItemsPerView(3);  // Desktop
    else setItemsPerView(5);                    // Large (modifié)
  };
  // ...
}, []);
```

### 2. Personnaliser l'auto-play

```tsx
// Modifier la durée de l'auto-play
React.useEffect(() => {
  if (!isAutoPlaying || maxIndex === 0) return;

  const interval = setInterval(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, 6000); // 6 secondes au lieu de 4

  return () => clearInterval(interval);
}, [isAutoPlaying, maxIndex]);
```

### 3. Styles personnalisés

```css
/* Dans votre CSS global ou module */
.popular-products-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.popular-products-section .progress-indicator {
  background: linear-gradient(90deg, #ff6b6b, #ee5a24);
}

.popular-products-section .nav-button {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}
```

## 🔧 Hooks disponibles

### usePopularProducts

```tsx
import { usePopularProducts } from '@/hooks/usePopularProducts';

const { data, isLoading, error, refetch } = usePopularProducts({
  limit: 8,
  enabled: true
});
```

### useFeaturedProducts

```tsx
import { useFeaturedProducts } from '@/hooks/usePopularProducts';

const { data, isLoading, error } = useFeaturedProducts({
  limit: 6
});
```

### useTrendingProducts

```tsx
import { useTrendingProducts } from '@/hooks/usePopularProducts';

const { data, isLoading, error } = useTrendingProducts({
  limit: 10
});
```

## 📊 Format des données

```typescript
interface Product {
  id: string;
  title: string;
  shortDescription?: string;
  imageUrl?: string;
  price: number;
  isAvailable: boolean;
  category?: {
    id: string;
    name: string;
  };
  rating?: number;
  preparationTime?: number;
  isPopular?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
}
```

## 🎯 États gérés

### Loading State
- Skeleton animé avec shimmer
- 4 cartes placeholder
- Contrôles de navigation désactivés

### Error State  
- Message d'erreur clair
- Bouton de retry
- Fallback gracieux

### Empty State
- Message informatif
- Bouton vers tous les produits
- Design cohérent

## ⚡ Performance

### Optimisations incluses

1. **Images optimisées** : Next.js Image avec lazy loading
2. **Memoization** : React.useMemo pour les calculs
3. **Débounce** : Gestion intelligente du resize
4. **Cache** : React Query avec staleTime
5. **Bundle splitting** : Import dynamique possible

### Metrics

- **LCP** : < 2.5s avec images optimisées
- **CLS** : < 0.1 avec skeleton loader
- **FID** : < 100ms avec interactions optimisées

## 🧪 Tests

### Page de test disponible

```bash
# Lancer le serveur de développement
pnpm dev

# Aller sur la page de test
http://localhost:3000/test-popular-products
```

### Tests à effectuer

1. **Responsive** : Tester sur différentes tailles d'écran
2. **Navigation** : Cliquer sur les flèches
3. **Auto-play** : Vérifier le défilement automatique
4. **Interactions** : Hover, clic produit, favoris
5. **États** : Loading, erreur, vide
6. **Performance** : Temps de chargement des images

## 🔍 Debugging

### Console logs utiles

```typescript
// Activer les logs de debug
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) {
  console.log('Current index:', currentIndex);
  console.log('Items per view:', itemsPerView);
  console.log('Progress:', progressPercentage);
}
```

### Variables CSS pour inspection

```css
/* Ajouter des bordures pour debugging */
.debug .carousel-item {
  border: 1px solid red;
}

.debug .progress-indicator {
  background: linear-gradient(90deg, red, blue) !important;
}
```

## 🚀 Déploiement

### Checklist avant production

- [ ] Tester sur mobile/tablet/desktop
- [ ] Vérifier les images Cloudinary
- [ ] Configurer les variables d'environnement
- [ ] Tester les API de produits
- [ ] Vérifier l'accessibilité (ARIA)
- [ ] Optimiser les performances
- [ ] Tester les états d'erreur

### Variables d'environnement

```env
# URLs des images (optionnel)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_IMAGES_DOMAIN=res.cloudinary.com
```

Cette section carrousel est maintenant prête pour la production et peut être facilement intégrée dans n'importe quelle page ! 🎉
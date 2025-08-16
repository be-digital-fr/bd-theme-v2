# Store API Documentation

Cette section contient toutes les APIs liées au système e-commerce du restaurant.

## Structure des APIs

### Produits (`/api/store/products`)
- `GET /api/store/products` - Liste des produits avec filtres, tri et pagination
- `POST /api/store/products` - Créer un nouveau produit (admin/employee)
- `GET /api/store/products/[id]` - Détails d'un produit + tracking des vues
- `PUT /api/store/products/[id]` - Modifier un produit (admin/employee)
- `DELETE /api/store/products/[id]` - Supprimer un produit (admin)

#### Sous-ressources produits
- `GET /api/store/products/[id]/reviews` - Avis du produit
- `POST /api/store/products/[id]/reviews` - Ajouter un avis (utilisateur connecté)
- `GET /api/store/products/[id]/favorite` - Statut favori (utilisateur connecté)
- `POST /api/store/products/[id]/favorite` - Ajouter aux favoris (utilisateur connecté)
- `DELETE /api/store/products/[id]/favorite` - Retirer des favoris (utilisateur connecté)

### Catégories (`/api/store/categories`)
- `GET /api/store/categories` - Liste des catégories (hiérarchie disponible)
- `POST /api/store/categories` - Créer une catégorie (admin/employee)
- `GET /api/store/categories/[id]` - Détails d'une catégorie
- `PUT /api/store/categories/[id]` - Modifier une catégorie (admin/employee)
- `DELETE /api/store/categories/[id]` - Supprimer une catégorie (admin)

### Ingrédients (`/api/store/ingredients`)
- `GET /api/store/ingredients` - Liste des ingrédients
- `POST /api/store/ingredients` - Créer un ingrédient (admin/employee)
- `GET /api/store/ingredients/[id]` - Détails d'un ingrédient
- `PUT /api/store/ingredients/[id]` - Modifier un ingrédient (admin/employee)
- `DELETE /api/store/ingredients/[id]` - Supprimer un ingrédient (admin)

### Extras/Compléments (`/api/store/extras`)
- `GET /api/store/extras` - Liste des extras (filtrable par type)
- `POST /api/store/extras` - Créer un extra (admin/employee)
- `GET /api/store/extras/[id]` - Détails d'un extra
- `PUT /api/store/extras/[id]` - Modifier un extra (admin/employee)
- `DELETE /api/store/extras/[id]` - Supprimer un extra (admin)

## Authentification et Permissions

### Niveaux d'accès
- **Public** : Lecture des produits, catégories, ingrédients, extras
- **Utilisateur connecté** : Avis, favoris, tracking personnalisé
- **Employee** : Création et modification (sauf suppression)
- **Admin** : Toutes les opérations CRUD

### Headers requis
```
Authorization: Bearer <token> // Pour les actions utilisateur connecté
Content-Type: application/json // Pour POST/PUT
```

## Format des réponses

### Succès
```json
{
  "success": true,
  "data": { ... }, // ou [...] pour les listes
  "message": "Optional success message"
}
```

### Erreur
```json
{
  "success": false,
  "error": "Error message",
  "details": [...] // Optionnel pour erreurs de validation
}
```

## Paramètres de requête courants

### Pagination
- `page`: Numéro de page (défaut: 1)
- `limit`: Nombre d'éléments par page (défaut: 20)

### Filtres produits
- `categoryId`: Filtrer par catégorie
- `search`: Recherche textuelle
- `isAvailable`: Produits disponibles uniquement
- `priceMin/priceMax`: Fourchette de prix
- `ratingMin`: Note minimale

### Tri produits
- `sortBy`: `title|price|rating|popularity|createdAt`
- `sortOrder`: `asc|desc`

### Options d'inclusion
- `includeIngredients`: Inclure les ingrédients du produit
- `includeExtras`: Inclure les extras du produit
- `includeAll`: Inclure toutes les relations

## Futures extensions prévues

La structure actuelle est préparée pour accueillir :
- `/api/store/orders` - Gestion des commandes
- `/api/store/cart` - Panier d'achat
- `/api/store/payments` - Processus de paiement
- `/api/store/coupons` - Codes promo et réductions
- `/api/store/inventory` - Gestion des stocks
- `/api/store/analytics` - Statistiques de vente
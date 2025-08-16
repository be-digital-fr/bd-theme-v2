import { PopularProductsSection } from '@/components/sections/PopularProductsSection';

export default function TestPopularProductsPage() {
  const handleViewAll = () => {
    console.log('Voir tout cliqué');
  };

  const handleProductClick = (product: any) => {
    console.log('Produit cliqué:', product.title);
  };

  const handleAddToFavorites = (product: any) => {
    console.log('Ajouté aux favoris:', product.title);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Titre de la page */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Test - Section Produits Populaires
        </h1>
        <p className="text-center text-muted-foreground mb-12">
          Démonstration du carrousel de produits avec indicateurs et barre de progression
        </p>
      </div>

      {/* Section des produits populaires */}
      <PopularProductsSection
        onViewAll={handleViewAll}
        onProductClick={handleProductClick}
        onAddToFavorites={handleAddToFavorites}
      />

      {/* Section d'informations */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h3 className="text-2xl font-semibold">Fonctionnalités du carrousel</h3>
          <ul className="text-left space-y-2 text-muted-foreground">
            <li>✅ Carrousel responsive (1-4 colonnes selon l'écran)</li>
            <li>✅ Auto-play avec pause au survol</li>
            <li>✅ Navigation par flèches avec background primary</li>
            <li>✅ Barre de progression pleine largeur</li>
            <li>✅ Cards avec hover effects</li>
            <li>✅ Badges pour produits populaires/recommandés</li>
            <li>✅ Bouton favoris sur chaque produit</li>
            <li>✅ Rating avec étoiles et temps de préparation</li>
            <li>✅ Images avec effet de zoom au hover</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
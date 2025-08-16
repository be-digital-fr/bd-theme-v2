import { PopularProductsSection } from '@/components/sections/PopularProductsSectionShadcn';

export default function ExampleHomePage() {
  const handleViewAll = () => {
    // Rediriger vers la page de tous les produits
    window.location.href = '/products';
  };

  const handleProductClick = (product: any) => {
    // Rediriger vers la page de détail du produit
    console.log('Redirection vers le produit:', product.id);
    // window.location.href = `/products/${product.id}`;
  };

  const handleAddToFavorites = (product: any) => {
    // Ajouter aux favoris
    console.log('Ajouté aux favoris:', product.title);
    // Logique d'ajout aux favoris
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section (exemple) */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Bienvenue chez Be Digital
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Découvrez une cuisine exceptionnelle avec nos plats préparés avec amour
            par nos chefs passionnés.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Commander maintenant
            </button>
            <button className="border border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary/10 transition-colors">
              Voir le menu
            </button>
          </div>
        </div>
      </section>

      {/* Section des produits populaires */}
      <PopularProductsSection
        onViewAll={handleViewAll}
        onProductClick={handleProductClick}
        onAddToFavorites={handleAddToFavorites}
      />

      {/* Section About (exemple) */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Notre histoire</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Depuis plus de 10 ans, nous nous engageons à vous offrir une expérience 
              culinaire unique. Nos chefs sélectionnent les meilleurs ingrédients 
              locaux pour créer des plats savoureux qui raviront vos papilles.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">100+</div>
                <div className="text-muted-foreground">Plats au menu</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">50k+</div>
                <div className="text-muted-foreground">Clients satisfaits</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">4.9</div>
                <div className="text-muted-foreground">Note moyenne</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer simple */}
      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Be Digital</h3>
              <p className="text-sm text-muted-foreground">
                Restaurant de qualité avec une cuisine française moderne
                et des ingrédients frais.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Navigation</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/menu" className="hover:text-foreground">Menu</a></li>
                <li><a href="/about" className="hover:text-foreground">À propos</a></li>
                <li><a href="/contact" className="hover:text-foreground">Contact</a></li>
                <li><a href="/reservations" className="hover:text-foreground">Réservations</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>123 Rue de la Paix</li>
                <li>75001 Paris</li>
                <li>01 23 45 67 89</li>
                <li>contact@bedigital.fr</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Horaires</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Lun - Jeu: 11h30 - 22h00</li>
                <li>Ven - Sam: 11h30 - 23h00</li>
                <li>Dimanche: 12h00 - 21h00</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Be Digital. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
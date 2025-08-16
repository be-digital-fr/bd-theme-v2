import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Nettoyage des données du store...');

  try {
    // Supprimer dans l'ordre pour respecter les contraintes
    console.log('Suppression des données de popularité...');
    await prisma.product_popularity.deleteMany({});
    
    console.log('Suppression des badges...');
    await prisma.product_badges.deleteMany({});
    
    console.log('Suppression des informations nutritionnelles...');
    await prisma.nutritional_info.deleteMany({});
    
    console.log('Suppression des avis...');
    await prisma.product_ratings.deleteMany({});
    
    console.log('Suppression des favoris...');
    await prisma.user_favorites.deleteMany({});
    
    console.log('Suppression des vues...');
    await prisma.product_views.deleteMany({});
    
    console.log('Suppression des relations produits-extras...');
    await prisma.product_extras.deleteMany({});
    
    console.log('Suppression des relations produits-ingrédients...');
    await prisma.product_ingredients.deleteMany({});
    
    console.log('Suppression des images...');
    await prisma.product_images.deleteMany({});
    
    console.log('Suppression des produits...');
    await prisma.products.deleteMany({});
    
    console.log('Suppression des extras...');
    await prisma.extras.deleteMany({});
    
    console.log('Suppression des ingrédients...');
    await prisma.ingredients.deleteMany({});
    
    console.log('Suppression des catégories...');
    await prisma.categories.deleteMany({});
    
    console.log('✅ Nettoyage terminé !');
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
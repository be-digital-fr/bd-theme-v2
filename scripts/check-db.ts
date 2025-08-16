import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Vérification du contenu de la base de données...\n');

    // Vérifier les catégories
    const categoriesCount = await prisma.categories.count();
    console.log(`📂 Catégories: ${categoriesCount}`);
    
    if (categoriesCount > 0) {
      const categories = await prisma.categories.findMany({
        select: { name: true, slug: true, isActive: true }
      });
      categories.forEach(cat => {
        console.log(`   • ${cat.name} (${cat.slug}) - ${cat.isActive ? 'Actif' : 'Inactif'}`);
      });
    }

    // Vérifier les ingrédients
    const ingredientsCount = await prisma.ingredients.count();
    console.log(`\n🥕 Ingrédients: ${ingredientsCount}`);
    
    if (ingredientsCount > 0) {
      const ingredients = await prisma.ingredients.findMany({
        select: { name: true, isVegetarian: true, isVegan: true }
      });
      ingredients.slice(0, 5).forEach(ing => {
        console.log(`   • ${ing.name} ${ing.isVegan ? '🌱' : ing.isVegetarian ? '🥛' : '🍖'}`);
      });
      if (ingredients.length > 5) {
        console.log(`   ... et ${ingredients.length - 5} autres`);
      }
    }

    // Vérifier les extras
    const extrasCount = await prisma.extras.count();
    console.log(`\n🍟 Extras: ${extrasCount}`);
    
    if (extrasCount > 0) {
      const extras = await prisma.extras.findMany({
        select: { name: true, price: true, type: true }
      });
      extras.slice(0, 5).forEach(extra => {
        console.log(`   • ${extra.name} - ${extra.price}€ (${extra.type})`);
      });
      if (extras.length > 5) {
        console.log(`   ... et ${extras.length - 5} autres`);
      }
    }

    // Vérifier les produits
    const productsCount = await prisma.products.count();
    console.log(`\n🍽️ Produits: ${productsCount}`);

    if (productsCount > 0) {
      const products = await prisma.products.findMany({
        select: { title: true, price: true, categoryId: true },
        include: { category: { select: { name: true } } }
      });
      products.slice(0, 5).forEach(prod => {
        console.log(`   • ${prod.title} - ${prod.price}€ (${prod.category?.name || 'Sans catégorie'})`);
      });
      if (products.length > 5) {
        console.log(`   ... et ${products.length - 5} autres`);
      }
    }

    console.log('\n📊 Résumé:');
    console.log(`Total: ${categoriesCount} catégories, ${ingredientsCount} ingrédients, ${extrasCount} extras, ${productsCount} produits`);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
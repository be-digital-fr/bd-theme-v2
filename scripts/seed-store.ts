import { PrismaClient } from '@prisma/client';
import seedData from './seed-store-data.json';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding de la partie store...');

  try {
    // 1. Créer les catégories
    console.log('📂 Création des catégories...');
    const categories = [];
    for (const categoryData of seedData.categories) {
      const category = await prisma.categories.create({
        data: {
          name: categoryData.name,
          slug: categoryData.slug,
          description: categoryData.description,
          isActive: true,
        },
      });
      categories.push(category);
      console.log(`   ✅ Catégorie créée: ${category.name}`);
    }

    // 2. Créer les ingrédients
    console.log('🥕 Création des ingrédients...');
    const ingredients = [];
    for (const ingredientData of seedData.ingredients) {
      const ingredient = await prisma.ingredients.create({
        data: {
          name: ingredientData.name,
          description: ingredientData.description,
          allergens: ingredientData.allergens,
          isVegetarian: ingredientData.isVegetarian,
          isVegan: ingredientData.isVegan,
          isGlutenFree: ingredientData.isGlutenFree,
        },
      });
      ingredients.push(ingredient);
      console.log(`   ✅ Ingrédient créé: ${ingredient.name}`);
    }

    // 3. Créer les extras
    console.log('🍟 Création des extras...');
    const commonExtras = [
      { name: 'Avocat frais', description: 'Avocat mûr à point', price: '2.50', type: 'ADDON' },
      { name: 'Feta grecque AOP', description: 'Fromage feta authentique', price: '2.00', type: 'ADDON' },
      { name: 'Poulet fermier grillé', description: 'Blanc de poulet grillé', price: '4.00', type: 'ADDON' },
      { name: 'Saumon fumé', description: 'Saumon fumé d\'Écosse', price: '4.50', type: 'ADDON' },
      { name: 'Tofu fumé', description: 'Tofu bio fumé', price: '2.00', type: 'SUBSTITUTE' },
      { name: 'Double portion quinoa', description: 'Portion supplémentaire de quinoa', price: '2.50', type: 'ADDON' },
      { name: 'Cheddar affiné', description: 'Fromage cheddar vieilli', price: '2.00', type: 'ADDON' },
      { name: 'Crevettes grillées', description: 'Crevettes fraîches grillées', price: '4.50', type: 'ADDON' },
      { name: 'Houmous maison', description: 'Crème de pois chiches', price: '2.50', type: 'ADDON' },
      { name: 'Guacamole maison', description: 'Purée d\'avocat aux épices', price: '2.50', type: 'ADDON' },
      { name: 'Noix de cajou', description: 'Noix de cajou grillées', price: '2.00', type: 'ADDON' },
      { name: 'Double falafels', description: 'Portion supplémentaire de falafels', price: '3.00', type: 'ADDON' },
      { name: 'Protéine végétale', description: 'Supplément protéiné végétal', price: '2.00', type: 'ADDON' },
      { name: 'Granola maison', description: 'Granola artisanal croustillant', price: '1.50', type: 'ADDON' },
      { name: 'Sans sauce', description: 'Produit sans sauce', price: '0.00', type: 'OPTION' },
    ];

    const extras = [];
    for (const extraData of commonExtras) {
      const extra = await prisma.extras.create({
        data: {
          name: extraData.name,
          description: extraData.description,
          price: extraData.price,
          type: extraData.type as any,
          isAvailable: true,
        },
      });
      extras.push(extra);
      console.log(`   ✅ Extra créé: ${extra.name}`);
    }

    // 4. Créer les produits avec toutes leurs relations
    console.log('🍽️ Création des produits...');
    let productCount = 0;

    for (const productData of seedData.products) {
      // Trouver la catégorie
      const category = categories.find(c => c.slug === productData.categorySlug);
      if (!category) {
        console.error(`❌ Catégorie non trouvée pour le slug: ${productData.categorySlug}`);
        continue;
      }


      // Créer le produit principal
      const product = await prisma.products.create({
        data: {
          title: productData.title,
          slug: productData.title.toLowerCase()
            .replace(/[àáâãäå]/g, 'a')
            .replace(/[èéêë]/g, 'e')
            .replace(/[ìíîï]/g, 'i')
            .replace(/[òóôõö]/g, 'o')
            .replace(/[ùúûü]/g, 'u')
            .replace(/[ç]/g, 'c')
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
            + `-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          shortDescription: productData.shortDescription,
          longDescription: productData.longDescription,
          price: productData.price,
          preparationTime: productData.preparationTime,
          stockQuantity: 0, // Stock illimité
          isAvailable: true,
          categoryId: category.id,
          // URL de l'image fournie
          imageUrl: 'https://res.cloudinary.com/djosd1a3x/image/upload/v1755270169/Image_ChatGPT_15_aou%CC%82t_2025_lmo3yt.png',
          // Marquer comme spécial selon les badges
          isFeatured: productData.badges.some(b => b.type === 'BESTSELLER') ? Math.random() > 0.7 : Math.random() > 0.8,
          isPopular: productData.badges.some(b => b.type === 'BESTSELLER') ? true : Math.random() > 0.8,
          isTrending: productData.badges.some(b => b.type === 'NEW') ? true : Math.random() > 0.85,
        },
      });

      // Créer l'image principale
      await prisma.product_images.create({
        data: {
          productId: product.id,
          imageUrl: 'https://res.cloudinary.com/djosd1a3x/image/upload/v1755270169/Image_ChatGPT_15_aou%CC%82t_2025_lmo3yt.png',
          altText: `Image de ${productData.title} - ${productData.shortDescription}`,
          isMain: true,
        },
      });

      // Créer les relations avec les ingrédients
      for (const ingredientData of productData.ingredients) {
        const ingredient = ingredients.find(i => i.name === ingredientData.name);
        if (ingredient) {
          await prisma.product_ingredients.create({
            data: {
              productId: product.id,
              ingredientId: ingredient.id,
              quantity: ingredientData.quantity,
              isOptional: ingredientData.isOptional,
              isRemovable: ingredientData.isRemovable,
            },
          });
        }
      }

      // Créer les relations avec les extras
      for (const extraData of productData.extras) {
        const extra = extras.find(e => e.name === extraData.name);
        if (extra) {
          await prisma.product_extras.create({
            data: {
              productId: product.id,
              extraId: extra.id,
            },
          });
        }
      }

      // Créer les informations nutritionnelles
      await prisma.nutritional_info.create({
        data: {
          productId: product.id,
          calories: productData.nutritionalInfo.calories,
          proteins: productData.nutritionalInfo.proteins,
          carbs: productData.nutritionalInfo.carbs,
          fats: productData.nutritionalInfo.fats,
          fiber: productData.nutritionalInfo.fiber,
          sodium: productData.nutritionalInfo.sodium,
          sugar: productData.nutritionalInfo.sugar,
        },
      });

      // Créer les badges
      for (const badgeData of productData.badges) {
        await prisma.product_badges.create({
          data: {
            productId: product.id,
            type: badgeData.type as any,
            text: badgeData.text,
            color: badgeData.color,
            isActive: true,
          },
        });
      }

      // Créer les données de popularité
      await prisma.product_popularity.create({
        data: {
          productId: product.id,
          viewCount: Math.floor(Math.random() * 500) + 50,
          favoriteCount: Math.floor(Math.random() * 100) + 5,
          orderCount: Math.floor(Math.random() * 200) + 10,
          popularityScore: (Math.random() * 4 + 1).toFixed(2), // Score entre 1.00 et 5.00
        },
      });

      productCount++;
      console.log(`   ✅ Produit créé: ${product.title} (${productCount}/${seedData.products.length})`);
    }

    console.log('\n🎉 Seeding terminé avec succès !');
    console.log(`📊 Résumé:`);
    console.log(`   • ${categories.length} catégories créées`);
    console.log(`   • ${ingredients.length} ingrédients créés`);
    console.log(`   • ${extras.length} extras créés`);
    console.log(`   • ${productCount} produits créés`);

  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
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
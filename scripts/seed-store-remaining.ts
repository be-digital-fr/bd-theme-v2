import { PrismaClient } from '@prisma/client';
import seedData from './seed-store-data.json';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Complément du seeding de la partie store...');

  try {
    // Récupérer les catégories existantes
    const categories = await prisma.categories.findMany();
    console.log(`📂 ${categories.length} catégories trouvées`);

    // Récupérer les ingrédients existants
    const ingredients = await prisma.ingredients.findMany();
    console.log(`🥕 ${ingredients.length} ingrédients trouvés`);

    // Récupérer les extras existants
    const extras = await prisma.extras.findMany();
    console.log(`🍟 ${extras.length} extras trouvés`);

    // Récupérer les produits existants
    const existingProducts = await prisma.products.findMany({
      select: { title: true }
    });
    const existingTitles = new Set(existingProducts.map(p => p.title));
    console.log(`🍽️ ${existingProducts.length} produits existants trouvés`);

    // Créer uniquement les produits manquants
    const remainingProducts = seedData.products.filter(p => !existingTitles.has(p.title));
    console.log(`📦 ${remainingProducts.length} produits à créer\n`);

    let createdCount = 0;
    for (const productData of remainingProducts) {
      try {
        // Trouver la catégorie
        const category = categories.find(c => c.slug === productData.categorySlug);
        if (!category) {
          console.error(`❌ Catégorie non trouvée pour le slug: ${productData.categorySlug}`);
          continue;
        }

        // Créer le produit
        const product = await prisma.products.create({
          data: {
            title: productData.title,
            slug: productData.title.toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/[^a-z0-9\s]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
              .trim()
              + `-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            shortDescription: productData.shortDescription,
            longDescription: productData.longDescription,
            price: productData.price,
            preparationTime: productData.preparationTime,
            stockQuantity: 0,
            isAvailable: true,
            categoryId: category.id,
            imageUrl: 'https://res.cloudinary.com/djosd1a3x/image/upload/v1755270169/Image_ChatGPT_15_aou%CC%82t_2025_lmo3yt.png',
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
            altText: `Image de ${productData.title}`,
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
            popularityScore: (Math.random() * 4 + 1).toFixed(2),
          },
        });

        createdCount++;
        console.log(`✅ Produit créé: ${product.title} (${createdCount}/${remainingProducts.length})`);

      } catch (error) {
        console.error(`❌ Erreur lors de la création du produit ${productData.title}:`, error);
      }
    }

    console.log(`\n🎉 Seeding terminé! ${createdCount} nouveaux produits créés.`);
    console.log(`📊 Total: ${existingProducts.length + createdCount} produits dans la base de données.`);

  } catch (error) {
    console.error('❌ Erreur générale:', error);
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
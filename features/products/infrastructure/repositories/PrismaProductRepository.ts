import { PrismaClient } from '@prisma/client';
import type { 
  Product, 
  Category, 
  Ingredient, 
  Extra,
  CreateProduct,
  UpdateProduct,
  CreateCategory,
  UpdateCategory,
  CreateIngredient,
  UpdateIngredient,
  CreateExtra,
  UpdateExtra,
  ProductFilter,
  ProductSort,
  Pagination,
  ProductIngredient,
  ProductExtra,
  CreateProductIngredient,
  CreateProductExtra,
  ProductView,
  CreateProductView,
  ProductPopularity,
  UserFavorite,
  CreateUserFavorite,
  ProductRating,
  CreateProductRating,
  UpdateProductRating
} from '../../domain/schemas/ProductSchemas';
import { IProductRepository, ProductSearchResult } from '../../domain/repositories/IProductRepository';

export class PrismaProductRepository implements IProductRepository {
  constructor(private prisma: PrismaClient) {}

  // =========================================
  // PRODUCT OPERATIONS
  // =========================================

  async createProduct(data: CreateProduct): Promise<Product> {
    const { ingredients, extras, ...productData } = data;
    
    const product = await this.prisma.products.create({
      data: {
        ...productData,
        slug: this.generateSlug(productData.title),
        // Create ingredients relations if provided
        ...(ingredients && ingredients.length > 0 && {
          ingredients: {
            create: ingredients.map(ing => ({
              ingredientId: ing.ingredientId,
              quantity: ing.quantity,
              isOptional: ing.isOptional || false,
              isRemovable: ing.isRemovable !== false
            }))
          }
        }),
        // Create extras relations if provided
        ...(extras && extras.length > 0 && {
          extras: {
            create: extras.map(ext => ({
              extraId: ext.extraId
            }))
          }
        })
      },
      include: this.getFullProductInclude()
    });

    return this.mapPrismaToProduct(product);
  }

  async getProductById(id: string): Promise<Product | null> {
    const product = await this.prisma.products.findUnique({
      where: { id },
      include: this.getFullProductInclude()
    });

    return product ? this.mapPrismaToProduct(product) : null;
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    const product = await this.prisma.products.findUnique({
      where: { slug },
      include: this.getFullProductInclude()
    });

    return product ? this.mapPrismaToProduct(product) : null;
  }

  async getProducts(
    filters?: ProductFilter, 
    sort?: ProductSort, 
    pagination?: Pagination
  ): Promise<ProductSearchResult> {
    const where = this.buildProductWhereClause(filters);
    const orderBy = this.buildProductOrderBy(sort);
    const skip = pagination?.page && pagination?.limit 
      ? (pagination.page - 1) * pagination.limit 
      : undefined;
    const take = pagination?.limit;

    const [products, total] = await Promise.all([
      this.prisma.products.findMany({
        where,
        orderBy,
        skip,
        take,
        include: this.getFullProductInclude()
      }),
      this.prisma.products.count({ where })
    ]);

    return {
      products: products.map(this.mapPrismaToProduct),
      total,
      page: pagination?.page || 1,
      totalPages: pagination?.limit ? Math.ceil(total / pagination.limit) : 1
    };
  }

  async updateProduct(id: string, data: UpdateProduct): Promise<Product> {
    const { ingredients, extras, ...productData } = data;
    
    const product = await this.prisma.products.update({
      where: { id },
      data: {
        ...productData,
        ...(productData.title && { slug: this.generateSlug(productData.title) })
      },
      include: this.getFullProductInclude()
    });

    return this.mapPrismaToProduct(product);
  }

  async deleteProduct(id: string): Promise<void> {
    await this.prisma.products.delete({
      where: { id }
    });
  }

  // Product with relations
  async getProductWithIngredients(id: string): Promise<Product | null> {
    const product = await this.prisma.products.findUnique({
      where: { id },
      include: {
        category: true,
        ingredients: {
          include: {
            ingredient: true
          }
        },
        images: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    return product ? this.mapPrismaToProduct(product) : null;
  }

  async getProductWithExtras(id: string): Promise<Product | null> {
    const product = await this.prisma.products.findUnique({
      where: { id },
      include: {
        category: true,
        extras: {
          include: {
            extra: true
          }
        },
        images: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    return product ? this.mapPrismaToProduct(product) : null;
  }

  async getProductWithAll(id: string): Promise<Product | null> {
    return this.getProductById(id); // Already includes everything
  }

  // =========================================
  // CATEGORY OPERATIONS
  // =========================================

  async createCategory(data: CreateCategory): Promise<Category> {
    const category = await this.prisma.categories.create({
      data: {
        ...data,
        slug: this.generateSlug(data.name)
      },
      include: {
        parent: true,
        children: true,
        products: true
      }
    });

    return this.mapPrismaToCategory(category);
  }

  async getCategoryById(id: string): Promise<Category | null> {
    const category = await this.prisma.categories.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        products: true
      }
    });

    return category ? this.mapPrismaToCategory(category) : null;
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const category = await this.prisma.categories.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: true,
        products: true
      }
    });

    return category ? this.mapPrismaToCategory(category) : null;
  }

  async getCategories(activeOnly = false): Promise<Category[]> {
    const categories = await this.prisma.categories.findMany({
      where: activeOnly ? { isActive: true } : {},
      include: {
        parent: true,
        children: true,
        products: true
      },
      orderBy: { createdAt: 'asc' }
    });

    return categories.map(this.mapPrismaToCategory);
  }

  async getCategoriesHierarchy(): Promise<Category[]> {
    const categories = await this.prisma.categories.findMany({
      where: { parentId: null }, // Only root categories
      include: {
        children: {
          include: {
            children: true,
            products: true
          }
        },
        products: true
      },
      orderBy: { createdAt: 'asc' }
    });

    return categories.map(this.mapPrismaToCategory);
  }

  async updateCategory(id: string, data: UpdateCategory): Promise<Category> {
    const category = await this.prisma.categories.update({
      where: { id },
      data: {
        ...data,
        ...(data.name && { slug: this.generateSlug(data.name) })
      },
      include: {
        parent: true,
        children: true,
        products: true
      }
    });

    return this.mapPrismaToCategory(category);
  }

  async deleteCategory(id: string): Promise<void> {
    await this.prisma.categories.delete({
      where: { id }
    });
  }

  // =========================================
  // INGREDIENT OPERATIONS
  // =========================================

  async createIngredient(data: CreateIngredient): Promise<Ingredient> {
    const ingredient = await this.prisma.ingredients.create({
      data,
      include: {
        products: {
          include: {
            product: true
          }
        }
      }
    });

    return this.mapPrismaToIngredient(ingredient);
  }

  async getIngredientById(id: string): Promise<Ingredient | null> {
    const ingredient = await this.prisma.ingredients.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            product: true
          }
        }
      }
    });

    return ingredient ? this.mapPrismaToIngredient(ingredient) : null;
  }

  async getIngredientBySlug(slug: string): Promise<Ingredient | null> {
    const ingredient = await this.prisma.ingredients.findFirst({
      where: { name: { contains: slug, mode: 'insensitive' } },
      include: {
        products: {
          include: {
            product: true
          }
        }
      }
    });

    return ingredient ? this.mapPrismaToIngredient(ingredient) : null;
  }

  async getIngredients(): Promise<Ingredient[]> {
    const ingredients = await this.prisma.ingredients.findMany({
      include: {
        products: {
          include: {
            product: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    return ingredients.map(this.mapPrismaToIngredient);
  }

  async updateIngredient(id: string, data: UpdateIngredient): Promise<Ingredient> {
    const ingredient = await this.prisma.ingredients.update({
      where: { id },
      data,
      include: {
        products: {
          include: {
            product: true
          }
        }
      }
    });

    return this.mapPrismaToIngredient(ingredient);
  }

  async deleteIngredient(id: string): Promise<void> {
    await this.prisma.ingredients.delete({
      where: { id }
    });
  }

  // =========================================
  // EXTRA OPERATIONS
  // =========================================

  async createExtra(data: CreateExtra): Promise<Extra> {
    const extra = await this.prisma.extras.create({
      data,
      include: {
        products: {
          include: {
            product: true
          }
        }
      }
    });

    return this.mapPrismaToExtra(extra);
  }

  async getExtraById(id: string): Promise<Extra | null> {
    const extra = await this.prisma.extras.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            product: true
          }
        }
      }
    });

    return extra ? this.mapPrismaToExtra(extra) : null;
  }

  async getExtraBySlug(slug: string): Promise<Extra | null> {
    const extra = await this.prisma.extras.findFirst({
      where: { name: { contains: slug, mode: 'insensitive' } },
      include: {
        products: {
          include: {
            product: true
          }
        }
      }
    });

    return extra ? this.mapPrismaToExtra(extra) : null;
  }

  async getExtras(availableOnly = false): Promise<Extra[]> {
    const extras = await this.prisma.extras.findMany({
      where: availableOnly ? { isAvailable: true } : {},
      include: {
        products: {
          include: {
            product: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    return extras.map(this.mapPrismaToExtra);
  }

  async getExtrasByType(type: string, availableOnly = false): Promise<Extra[]> {
    const extras = await this.prisma.extras.findMany({
      where: {
        type: type as any,
        ...(availableOnly && { isAvailable: true })
      },
      include: {
        products: {
          include: {
            product: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    return extras.map(this.mapPrismaToExtra);
  }

  async updateExtra(id: string, data: UpdateExtra): Promise<Extra> {
    const extra = await this.prisma.extras.update({
      where: { id },
      data,
      include: {
        products: {
          include: {
            product: true
          }
        }
      }
    });

    return this.mapPrismaToExtra(extra);
  }

  async deleteExtra(id: string): Promise<void> {
    await this.prisma.extras.delete({
      where: { id }
    });
  }

  // =========================================
  // PRODUCT-INGREDIENT RELATIONSHIPS
  // =========================================

  async addIngredientToProduct(data: CreateProductIngredient): Promise<ProductIngredient> {
    const productIngredient = await this.prisma.product_ingredients.create({
      data,
      include: {
        product: true,
        ingredient: true
      }
    });

    return this.mapPrismaToProductIngredient(productIngredient);
  }

  async removeIngredientFromProduct(productId: string, ingredientId: string): Promise<void> {
    await this.prisma.product_ingredients.delete({
      where: {
        productId_ingredientId: {
          productId,
          ingredientId
        }
      }
    });
  }

  async updateProductIngredient(
    productId: string, 
    ingredientId: string, 
    updates: Partial<ProductIngredient>
  ): Promise<ProductIngredient> {
    const productIngredient = await this.prisma.product_ingredients.update({
      where: {
        productId_ingredientId: {
          productId,
          ingredientId
        }
      },
      data: updates,
      include: {
        product: true,
        ingredient: true
      }
    });

    return this.mapPrismaToProductIngredient(productIngredient);
  }

  async getProductIngredients(productId: string): Promise<ProductIngredient[]> {
    const productIngredients = await this.prisma.product_ingredients.findMany({
      where: { productId },
      include: {
        product: true,
        ingredient: true
      }
    });

    return productIngredients.map(this.mapPrismaToProductIngredient);
  }

  // =========================================
  // PRODUCT-EXTRA RELATIONSHIPS
  // =========================================

  async addExtraToProduct(data: CreateProductExtra): Promise<ProductExtra> {
    const productExtra = await this.prisma.product_extras.create({
      data,
      include: {
        product: true,
        extra: true
      }
    });

    return this.mapPrismaToProductExtra(productExtra);
  }

  async removeExtraFromProduct(productId: string, extraId: string): Promise<void> {
    await this.prisma.product_extras.delete({
      where: {
        productId_extraId: {
          productId,
          extraId
        }
      }
    });
  }

  async updateProductExtra(
    productId: string, 
    extraId: string, 
    updates: Partial<ProductExtra>
  ): Promise<ProductExtra> {
    const productExtra = await this.prisma.product_extras.update({
      where: {
        productId_extraId: {
          productId,
          extraId
        }
      },
      data: updates,
      include: {
        product: true,
        extra: true
      }
    });

    return this.mapPrismaToProductExtra(productExtra);
  }

  async getProductExtras(productId: string): Promise<ProductExtra[]> {
    const productExtras = await this.prisma.product_extras.findMany({
      where: { productId },
      include: {
        product: true,
        extra: true
      }
    });

    return productExtras.map(this.mapPrismaToProductExtra);
  }

  // =========================================
  // ANALYTICS AND SOCIAL OPERATIONS
  // =========================================

  // Product Views
  async trackProductView(data: CreateProductView): Promise<ProductView> {
    const productView = await this.prisma.product_views.create({
      data,
      include: {
        product: true,
        user: true
      }
    });

    return this.mapPrismaToProductView(productView);
  }

  async getProductViews(productId: string): Promise<ProductView[]> {
    const productViews = await this.prisma.product_views.findMany({
      where: { productId },
      include: {
        product: true,
        user: true
      },
      orderBy: { viewedAt: 'desc' }
    });

    return productViews.map(this.mapPrismaToProductView);
  }

  async getProductViewCount(productId: string): Promise<number> {
    return this.prisma.product_views.count({
      where: { productId }
    });
  }

  // Product Popularity
  async getProductPopularity(productId: string): Promise<ProductPopularity | null> {
    const popularity = await this.prisma.product_popularity.findUnique({
      where: { productId },
      include: {
        product: true
      }
    });

    return popularity ? this.mapPrismaToProductPopularity(popularity) : null;
  }

  async updateProductPopularity(
    productId: string, 
    updates: Partial<ProductPopularity>
  ): Promise<ProductPopularity> {
    const popularity = await this.prisma.product_popularity.upsert({
      where: { productId },
      update: updates,
      create: {
        productId,
        ...updates
      },
      include: {
        product: true
      }
    });

    return this.mapPrismaToProductPopularity(popularity);
  }

  async getPopularProducts(limit = 10): Promise<Product[]> {
    const products = await this.prisma.products.findMany({
      include: this.getFullProductInclude(),
      orderBy: {
        popularity: {
          popularityScore: 'desc'
        }
      },
      take: limit
    });

    return products.map(this.mapPrismaToProduct);
  }

  async getTrendingProducts(limit = 10): Promise<Product[]> {
    const products = await this.prisma.products.findMany({
      include: this.getFullProductInclude(),
      orderBy: [
        {
          popularity: {
            popularityScore: 'desc'
          }
        },
        {
          averageRating: 'desc'
        }
      ],
      take: limit
    });

    return products.map(this.mapPrismaToProduct);
  }

  // User Favorites
  async addUserFavorite(data: CreateUserFavorite): Promise<UserFavorite> {
    const favorite = await this.prisma.user_favorites.create({
      data,
      include: {
        user: true,
        product: true
      }
    });

    return this.mapPrismaToUserFavorite(favorite);
  }

  async removeUserFavorite(userId: string, productId: string): Promise<void> {
    await this.prisma.user_favorites.delete({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });
  }

  async getUserFavorites(userId: string): Promise<Product[]> {
    const favorites = await this.prisma.user_favorites.findMany({
      where: { userId },
      include: {
        product: {
          include: this.getFullProductInclude()
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return favorites.map(fav => this.mapPrismaToProduct(fav.product));
  }

  async getFavoriteProducts(limit = 10): Promise<Product[]> {
    const products = await this.prisma.products.findMany({
      include: this.getFullProductInclude(),
      orderBy: {
        favorites: {
          _count: 'desc'
        }
      },
      take: limit
    });

    return products.map(this.mapPrismaToProduct);
  }

  async isProductFavorited(userId: string, productId: string): Promise<boolean> {
    const favorite = await this.prisma.user_favorites.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });

    return !!favorite;
  }

  // Product Ratings
  async addProductRating(data: CreateProductRating): Promise<ProductRating> {
    const rating = await this.prisma.product_ratings.create({
      data,
      include: {
        product: true,
        user: true
      }
    });

    // Update product average rating
    await this.updateAverageRating(data.productId);

    return this.mapPrismaToProductRating(rating);
  }

  async updateProductRating(id: string, data: UpdateProductRating): Promise<ProductRating> {
    const rating = await this.prisma.product_ratings.update({
      where: { id },
      data,
      include: {
        product: true,
        user: true
      }
    });

    // Update product average rating
    await this.updateAverageRating(rating.productId);

    return this.mapPrismaToProductRating(rating);
  }

  async removeProductRating(id: string): Promise<void> {
    const rating = await this.prisma.product_ratings.delete({
      where: { id }
    });

    // Update product average rating
    await this.updateAverageRating(rating.productId);
  }

  async getProductRatings(productId: string): Promise<ProductRating[]> {
    const ratings = await this.prisma.product_ratings.findMany({
      where: { productId },
      include: {
        product: true,
        user: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return ratings.map(this.mapPrismaToProductRating);
  }

  async getAverageRating(productId: string): Promise<number> {
    const result = await this.prisma.product_ratings.aggregate({
      where: { productId },
      _avg: {
        rating: true
      }
    });

    return result._avg.rating || 0;
  }

  // =========================================
  // PRIVATE HELPER METHODS
  // =========================================

  private getFullProductInclude() {
    return {
      category: true,
      images: {
        orderBy: { createdAt: 'asc' }
      },
      ingredients: {
        include: {
          ingredient: true
        }
      },
      extras: {
        include: {
          extra: true
        }
      },
      ratings: {
        include: {
          user: true
        },
        orderBy: { createdAt: 'desc' }
      },
      favorites: true,
      views: true,
      popularity: true,
      badges: {
        where: { isActive: true }
      },
      nutritionalInfo: true
    };
  }

  private buildProductWhereClause(filters?: ProductFilter) {
    if (!filters) return {};

    const where: any = {};

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { shortDescription: { contains: filters.search, mode: 'insensitive' } },
        { longDescription: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    if (filters.isAvailable !== undefined) {
      where.isAvailable = filters.isAvailable;
    }

    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      where.price = {};
      if (filters.priceMin !== undefined) {
        where.price.gte = filters.priceMin;
      }
      if (filters.priceMax !== undefined) {
        where.price.lte = filters.priceMax;
      }
    }

    if (filters.ratingMin !== undefined) {
      where.averageRating = {
        gte: filters.ratingMin
      };
    }

    // Collections spéciales
    if (filters.isFeatured !== undefined) {
      where.isFeatured = filters.isFeatured;
    }

    if (filters.isPopular !== undefined) {
      where.isPopular = filters.isPopular;
    }

    if (filters.isTrending !== undefined) {
      where.isTrending = filters.isTrending;
    }

    return where;
  }

  private buildProductOrderBy(sort?: ProductSort) {
    if (!sort) return { createdAt: 'desc' };

    const orderBy: any = {};

    switch (sort.field) {
      case 'title':
        orderBy.title = sort.direction;
        break;
      case 'price':
        orderBy.price = sort.direction;
        break;
      case 'rating':
        orderBy.averageRating = sort.direction;
        break;
      case 'popularity':
        orderBy.popularity = { popularityScore: sort.direction };
        break;
      case 'createdAt':
      default:
        orderBy.createdAt = sort.direction;
        break;
    }

    return orderBy;
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private async updateAverageRating(productId: string): Promise<void> {
    const result = await this.prisma.product_ratings.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true }
    });

    await this.prisma.products.update({
      where: { id: productId },
      data: {
        averageRating: result._avg.rating || 0,
        ratingCount: result._count.rating || 0
      }
    });
  }

  // =========================================
  // MAPPING METHODS
  // =========================================

  private mapPrismaToProduct = (prismaProduct: any): Product => {
    return {
      id: prismaProduct.id,
      title: prismaProduct.title,
      slug: prismaProduct.slug,
      shortDescription: prismaProduct.shortDescription,
      longDescription: prismaProduct.longDescription,
      price: parseFloat(prismaProduct.price.toString()),
      stockQuantity: prismaProduct.stockQuantity,
      isAvailable: prismaProduct.isAvailable,
      preparationTime: prismaProduct.preparationTime,
      imageUrl: prismaProduct.imageUrl,
      categoryId: prismaProduct.categoryId,
      
      // Collections spéciales
      isFeatured: prismaProduct.isFeatured,
      isPopular: prismaProduct.isPopular,
      isTrending: prismaProduct.isTrending,
      
      category: prismaProduct.category ? this.mapPrismaToCategory(prismaProduct.category) : undefined,
      images: prismaProduct.images?.map((img: any) => ({
        id: img.id,
        productId: img.productId,
        imageUrl: img.imageUrl,
        altText: img.altText,
        isMain: img.isMain,
        createdAt: img.createdAt,
        updatedAt: img.updatedAt
      })) || [],
      ingredients: prismaProduct.ingredients?.map(this.mapPrismaToProductIngredient) || [],
      extras: prismaProduct.extras?.map(this.mapPrismaToProductExtra) || [],
      ratings: prismaProduct.ratings?.map(this.mapPrismaToProductRating) || [],
      averageRating: prismaProduct.averageRating ? parseFloat(prismaProduct.averageRating.toString()) : undefined,
      ratingCount: prismaProduct.ratingCount,
      uberEatsId: prismaProduct.uberEatsId,
      deliverooId: prismaProduct.deliverooId,
      createdAt: prismaProduct.createdAt,
      updatedAt: prismaProduct.updatedAt
    };
  };

  private mapPrismaToCategory = (prismaCategory: any): Category => {
    return {
      id: prismaCategory.id,
      name: prismaCategory.name,
      slug: prismaCategory.slug,
      description: prismaCategory.description,
      imageUrl: prismaCategory.imageUrl,
      parentId: prismaCategory.parentId,
      parent: prismaCategory.parent ? this.mapPrismaToCategory(prismaCategory.parent) : undefined,
      children: prismaCategory.children?.map(this.mapPrismaToCategory) || [],
      isActive: prismaCategory.isActive,
      products: prismaCategory.products?.map(this.mapPrismaToProduct) || [],
      createdAt: prismaCategory.createdAt,
      updatedAt: prismaCategory.updatedAt
    };
  };

  private mapPrismaToIngredient = (prismaIngredient: any): Ingredient => {
    return {
      id: prismaIngredient.id,
      name: prismaIngredient.name,
      description: prismaIngredient.description,
      allergens: prismaIngredient.allergens,
      isVegetarian: prismaIngredient.isVegetarian,
      isVegan: prismaIngredient.isVegan,
      isGlutenFree: prismaIngredient.isGlutenFree,
      products: prismaIngredient.products?.map(this.mapPrismaToProductIngredient) || [],
      createdAt: prismaIngredient.createdAt,
      updatedAt: prismaIngredient.updatedAt
    };
  };

  private mapPrismaToExtra = (prismaExtra: any): Extra => {
    return {
      id: prismaExtra.id,
      name: prismaExtra.name,
      description: prismaExtra.description,
      price: parseFloat(prismaExtra.price.toString()),
      type: prismaExtra.type,
      isAvailable: prismaExtra.isAvailable,
      products: prismaExtra.products?.map(this.mapPrismaToProductExtra) || [],
      createdAt: prismaExtra.createdAt,
      updatedAt: prismaExtra.updatedAt
    };
  };

  private mapPrismaToProductIngredient = (prismaPI: any): ProductIngredient => {
    return {
      id: prismaPI.id,
      productId: prismaPI.productId,
      ingredientId: prismaPI.ingredientId,
      quantity: prismaPI.quantity,
      isOptional: prismaPI.isOptional,
      isRemovable: prismaPI.isRemovable,
      product: prismaPI.product ? this.mapPrismaToProduct(prismaPI.product) : undefined,
      ingredient: prismaPI.ingredient ? this.mapPrismaToIngredient(prismaPI.ingredient) : undefined
    };
  };

  private mapPrismaToProductExtra = (prismaPE: any): ProductExtra => {
    return {
      id: prismaPE.id,
      productId: prismaPE.productId,
      extraId: prismaPE.extraId,
      product: prismaPE.product ? this.mapPrismaToProduct(prismaPE.product) : undefined,
      extra: prismaPE.extra ? this.mapPrismaToExtra(prismaPE.extra) : undefined
    };
  };

  private mapPrismaToProductView = (prismaPV: any): ProductView => {
    return {
      id: prismaPV.id,
      productId: prismaPV.productId,
      userId: prismaPV.userId,
      ipAddress: prismaPV.ipAddress,
      userAgent: prismaPV.userAgent,
      viewedAt: prismaPV.viewedAt,
      product: prismaPV.product ? this.mapPrismaToProduct(prismaPV.product) : undefined,
      user: prismaPV.user
    };
  };

  private mapPrismaToProductPopularity = (prismaPP: any): ProductPopularity => {
    return {
      id: prismaPP.id,
      productId: prismaPP.productId,
      viewCount: prismaPP.viewCount,
      favoriteCount: prismaPP.favoriteCount,
      orderCount: prismaPP.orderCount,
      popularityScore: parseFloat(prismaPP.popularityScore.toString()),
      lastCalculated: prismaPP.lastCalculated,
      updatedAt: prismaPP.updatedAt,
      product: prismaPP.product ? this.mapPrismaToProduct(prismaPP.product) : undefined
    };
  };

  private mapPrismaToUserFavorite = (prismaUF: any): UserFavorite => {
    return {
      id: prismaUF.id,
      userId: prismaUF.userId,
      productId: prismaUF.productId,
      createdAt: prismaUF.createdAt,
      user: prismaUF.user,
      product: prismaUF.product ? this.mapPrismaToProduct(prismaUF.product) : undefined
    };
  };

  private mapPrismaToProductRating = (prismaPR: any): ProductRating => {
    return {
      id: prismaPR.id,
      productId: prismaPR.productId,
      userId: prismaPR.userId,
      rating: prismaPR.rating,
      comment: prismaPR.comment,
      isVerified: prismaPR.isVerified,
      createdAt: prismaPR.createdAt,
      updatedAt: prismaPR.updatedAt,
      product: prismaPR.product ? this.mapPrismaToProduct(prismaPR.product) : undefined,
      user: prismaPR.user
    };
  };
}
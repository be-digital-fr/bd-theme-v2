import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth-actions';
import { productContainer } from '@/features/products/infrastructure/di/ProductContainer';
import { CreateProductSchema, ProductFilterSchema, ProductSortSchema, PaginationSchema } from '@/features/products/domain/schemas/ProductSchemas';
import { z } from 'zod';

// GET /api/products - Liste des produits avec filtres, tri et pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse les paramètres de requête
    const filterParams = {
      categoryId: searchParams.get('categoryId') || undefined,
      search: searchParams.get('search') || undefined,
      isAvailable: searchParams.get('isAvailable') ? searchParams.get('isAvailable') === 'true' : undefined,
      priceMin: searchParams.get('priceMin') ? parseFloat(searchParams.get('priceMin')!) : undefined,
      priceMax: searchParams.get('priceMax') ? parseFloat(searchParams.get('priceMax')!) : undefined,
      ratingMin: searchParams.get('ratingMin') ? parseFloat(searchParams.get('ratingMin')!) : undefined,
      // Collections spéciales
      isFeatured: searchParams.get('isFeatured') ? searchParams.get('isFeatured') === 'true' : undefined,
      isPopular: searchParams.get('isPopular') ? searchParams.get('isPopular') === 'true' : undefined,
      isTrending: searchParams.get('isTrending') ? searchParams.get('isTrending') === 'true' : undefined,
    };
    
    // Format sort parameters as expected by schema (field_direction)
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';
    const sortString = `${sortBy}_${sortOrder}`;
    
    const paginationParams = {
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20
    };

    // Validation des paramètres
    const filters = ProductFilterSchema.parse(filterParams);
    const sort = ProductSortSchema.parse(sortString);
    const pagination = PaginationSchema.parse(paginationParams);

    // Convert sort string back to object for repository
    // Extract direction (last part after last underscore)
    const parts = sort.split('_');
    const sortDirection = parts[parts.length - 1] as 'asc' | 'desc';
    const sortField = parts.slice(0, -1).join('_'); // Join all parts except the last one
    
    const sortObject = {
      field: sortField,
      direction: sortDirection
    };

    // Récupération des produits
    const getProductsUseCase = productContainer.getProducts();
    const result = await getProductsUseCase.execute({
      filters,
      sort,
      pagination
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to fetch products' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data?.products || [],
      total: result.data?.total || 0,
      page: result.data?.page || pagination.page,
      limit: pagination.limit,
      totalPages: result.data?.totalPages || 0
    });
    
  } catch (error) {
    console.error('Error fetching products:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/products - Créer un nouveau produit (admin uniquement)
export async function POST(request: NextRequest) {
  try {
    // Vérification de l'authentification et des permissions
    const session = await getCurrentSession();
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EMPLOYEE')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse et validation des données
    const body = await request.json();
    const validatedData = CreateProductSchema.parse(body);

    // Création du produit
    const repository = productContainer.productRepository;
    const product = await repository.createProduct(validatedData);

    return NextResponse.json({
      success: true,
      data: product
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating product:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid product data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
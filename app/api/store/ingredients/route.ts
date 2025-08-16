import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth-actions';
import { productContainer } from '@/features/products/infrastructure/di/ProductContainer';
import { CreateIngredientSchema } from '@/features/products/domain/schemas/ProductSchemas';
import { z } from 'zod';

// GET /api/ingredients - Liste des ingrédients
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    const repository = productContainer.productRepository;
    let ingredients = await repository.getIngredients();
    
    // Apply search filter
    if (search) {
      ingredients = ingredients.filter(ingredient => 
        ingredient.name.toLowerCase().includes(search.toLowerCase()) ||
        ingredient.description?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply sorting
    ingredients.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    // Calculate total before pagination
    const total = ingredients.length;
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedIngredients = ingredients.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedIngredients,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
    
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/ingredients - Créer un nouvel ingrédient (admin uniquement)
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
    console.log('Données reçues côté serveur:', JSON.stringify(body, null, 2));
    const validatedData = CreateIngredientSchema.parse(body);

    // Création de l'ingrédient
    const repository = productContainer.productRepository;
    const ingredient = await repository.createIngredient(validatedData);

    return NextResponse.json({
      success: true,
      data: ingredient
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating ingredient:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid ingredient data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
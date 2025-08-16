import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth-actions';
import { productContainer } from '@/features/products/infrastructure/di/ProductContainer';
import { CreateCategorySchema } from '@/features/products/domain/schemas/ProductSchemas';
import { z } from 'zod';

// GET /api/categories - Liste des catégories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';
    const hierarchy = searchParams.get('hierarchy') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const repository = productContainer.productRepository;
    
    let categories;
    let total = 0;
    
    if (hierarchy) {
      // For hierarchical view, get all categories (no pagination)
      categories = await repository.getCategoriesHierarchy();
      total = categories.length;
    } else {
      // For flat view, apply pagination
      const allCategories = await repository.getCategories(activeOnly);
      total = allCategories.length;
      
      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      categories = allCategories.slice(startIndex, endIndex);
    }

    return NextResponse.json({
      success: true,
      data: categories,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Créer une nouvelle catégorie (admin uniquement)
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
    const validatedData = CreateCategorySchema.parse(body);

    // Création de la catégorie
    const repository = productContainer.productRepository;
    const category = await repository.createCategory(validatedData);

    return NextResponse.json({
      success: true,
      data: category
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating category:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid category data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
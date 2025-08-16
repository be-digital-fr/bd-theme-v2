import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth-actions';
import { productContainer } from '@/features/products/infrastructure/di/ProductContainer';
import { UpdateCategorySchema } from '@/features/products/domain/schemas/ProductSchemas';
import { z } from 'zod';

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/categories/[id] - Récupérer une catégorie par ID
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    const repository = productContainer.productRepository;
    const category = await repository.getCategoryById(id);

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category
    });
    
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id] - Mettre à jour une catégorie (admin uniquement)
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Vérification de l'authentification et des permissions
    const session = await getCurrentSession();
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EMPLOYEE')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    // Parse et validation des données
    const body = await request.json();
    const validatedData = UpdateCategorySchema.parse(body);

    // Vérification que la catégorie existe
    const repository = productContainer.productRepository;
    const existingCategory = await repository.getCategoryById(id);
    
    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Mise à jour de la catégorie
    const updatedCategory = await repository.updateCategory(id, validatedData);

    return NextResponse.json({
      success: true,
      data: updatedCategory
    });
    
  } catch (error) {
    console.error('Error updating category:', error);
    
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

// DELETE /api/categories/[id] - Supprimer une catégorie (admin uniquement)
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Vérification de l'authentification et des permissions
    const session = await getCurrentSession();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin only' },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    // Vérification que la catégorie existe
    const repository = productContainer.productRepository;
    const existingCategory = await repository.getCategoryById(id);
    
    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Vérifier si la catégorie a des produits ou des sous-catégories
    if (existingCategory.products && existingCategory.products.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with products. Move products to another category first.' },
        { status: 409 }
      );
    }

    if (existingCategory.children && existingCategory.children.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with subcategories. Delete subcategories first.' },
        { status: 409 }
      );
    }

    // Suppression de la catégorie
    await repository.deleteCategory(id);

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
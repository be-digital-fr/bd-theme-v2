import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth-actions';
import { productContainer } from '@/features/products/infrastructure/di/ProductContainer';
import { UpdateIngredientSchema } from '@/features/products/domain/schemas/ProductSchemas';
import { z } from 'zod';

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/ingredients/[id] - Récupérer un ingrédient par ID
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Ingredient ID is required' },
        { status: 400 }
      );
    }

    const repository = productContainer.productRepository;
    const ingredient = await repository.getIngredientById(id);

    if (!ingredient) {
      return NextResponse.json(
        { error: 'Ingredient not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: ingredient
    });
    
  } catch (error) {
    console.error('Error fetching ingredient:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/ingredients/[id] - Mettre à jour un ingrédient (admin uniquement)
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
        { error: 'Ingredient ID is required' },
        { status: 400 }
      );
    }

    // Parse et validation des données
    const body = await request.json();
    const validatedData = UpdateIngredientSchema.parse(body);

    // Vérification que l'ingrédient existe
    const repository = productContainer.productRepository;
    const existingIngredient = await repository.getIngredientById(id);
    
    if (!existingIngredient) {
      return NextResponse.json(
        { error: 'Ingredient not found' },
        { status: 404 }
      );
    }

    // Mise à jour de l'ingrédient
    const updatedIngredient = await repository.updateIngredient(id, validatedData);

    return NextResponse.json({
      success: true,
      data: updatedIngredient
    });
    
  } catch (error) {
    console.error('Error updating ingredient:', error);
    
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

// DELETE /api/ingredients/[id] - Supprimer un ingrédient (admin uniquement)
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
        { error: 'Ingredient ID is required' },
        { status: 400 }
      );
    }

    // Vérification que l'ingrédient existe
    const repository = productContainer.productRepository;
    const existingIngredient = await repository.getIngredientById(id);
    
    if (!existingIngredient) {
      return NextResponse.json(
        { error: 'Ingredient not found' },
        { status: 404 }
      );
    }

    // Vérifier si l'ingrédient est utilisé dans des produits
    if (existingIngredient.products && existingIngredient.products.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete ingredient that is used in products. Remove from products first.' },
        { status: 409 }
      );
    }

    // Suppression de l'ingrédient
    await repository.deleteIngredient(id);

    return NextResponse.json({
      success: true,
      message: 'Ingredient deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting ingredient:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
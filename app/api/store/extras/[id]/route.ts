import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth-actions';
import { productContainer } from '@/features/products/infrastructure/di/ProductContainer';
import { UpdateExtraSchema } from '@/features/products/domain/schemas/ProductSchemas';
import { z } from 'zod';

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/extras/[id] - Récupérer un extra par ID
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Extra ID is required' },
        { status: 400 }
      );
    }

    const repository = productContainer.productRepository;
    const extra = await repository.getExtraById(id);

    if (!extra) {
      return NextResponse.json(
        { error: 'Extra not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: extra
    });
    
  } catch (error) {
    console.error('Error fetching extra:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/extras/[id] - Mettre à jour un extra (admin uniquement)
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
        { error: 'Extra ID is required' },
        { status: 400 }
      );
    }

    // Parse et validation des données
    const body = await request.json();
    const validatedData = UpdateExtraSchema.parse(body);

    // Vérification que l'extra existe
    const repository = productContainer.productRepository;
    const existingExtra = await repository.getExtraById(id);
    
    if (!existingExtra) {
      return NextResponse.json(
        { error: 'Extra not found' },
        { status: 404 }
      );
    }

    // Mise à jour de l'extra
    const updatedExtra = await repository.updateExtra(id, validatedData);

    return NextResponse.json({
      success: true,
      data: updatedExtra
    });
    
  } catch (error) {
    console.error('Error updating extra:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid extra data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/extras/[id] - Supprimer un extra (admin uniquement)
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
        { error: 'Extra ID is required' },
        { status: 400 }
      );
    }

    // Vérification que l'extra existe
    const repository = productContainer.productRepository;
    const existingExtra = await repository.getExtraById(id);
    
    if (!existingExtra) {
      return NextResponse.json(
        { error: 'Extra not found' },
        { status: 404 }
      );
    }

    // Vérifier si l'extra est utilisé dans des produits
    if (existingExtra.products && existingExtra.products.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete extra that is used in products. Remove from products first.' },
        { status: 409 }
      );
    }

    // Suppression de l'extra
    await repository.deleteExtra(id);

    return NextResponse.json({
      success: true,
      message: 'Extra deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting extra:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth-actions';
import { productContainer } from '@/features/products/infrastructure/di/ProductContainer';
import { CreateExtraSchema } from '@/features/products/domain/schemas/ProductSchemas';
import { z } from 'zod';

// GET /api/extras - Liste des extras/compléments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const availableOnly = searchParams.get('availableOnly') === 'true';
    const type = searchParams.get('type');

    const repository = productContainer.productRepository;
    
    let extras;
    if (type) {
      extras = await repository.getExtrasByType(type, availableOnly);
    } else {
      extras = await repository.getExtras(availableOnly);
    }

    return NextResponse.json({
      success: true,
      data: extras
    });
    
  } catch (error) {
    console.error('Error fetching extras:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/extras - Créer un nouvel extra (admin uniquement)
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
    const validatedData = CreateExtraSchema.parse(body);

    // Création de l'extra
    const repository = productContainer.productRepository;
    const extra = await repository.createExtra(validatedData);

    return NextResponse.json({
      success: true,
      data: extra
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating extra:', error);
    
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
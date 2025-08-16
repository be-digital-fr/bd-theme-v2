import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth-actions';
import { productContainer } from '@/features/products/infrastructure/di/ProductContainer';

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/products/[id]/favorite - Vérifier si un produit est en favori
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Vérification de l'authentification
    const session = await getCurrentSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const repository = productContainer.productRepository;
    
    // Vérifier que le produit existe
    const product = await repository.getProductById(id);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Vérifier si le produit est en favori
    const isFavorited = await repository.isProductFavorited(session.user.id, id);

    return NextResponse.json({
      success: true,
      data: {
        productId: id,
        userId: session.user.id,
        isFavorited
      }
    });
    
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/products/[id]/favorite - Ajouter aux favoris
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Vérification de l'authentification
    const session = await getCurrentSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const repository = productContainer.productRepository;
    
    // Vérifier que le produit existe
    const product = await repository.getProductById(id);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Vérifier si déjà en favori
    const isAlreadyFavorited = await repository.isProductFavorited(session.user.id, id);
    if (isAlreadyFavorited) {
      return NextResponse.json(
        { error: 'Product already in favorites' },
        { status: 409 }
      );
    }

    // Ajouter aux favoris
    const favorite = await repository.addUserFavorite({
      userId: session.user.id,
      productId: id
    });

    return NextResponse.json({
      success: true,
      data: favorite,
      message: 'Product added to favorites'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id]/favorite - Retirer des favoris
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Vérification de l'authentification
    const session = await getCurrentSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const repository = productContainer.productRepository;
    
    // Vérifier que le produit existe
    const product = await repository.getProductById(id);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Vérifier si en favori
    const isFavorited = await repository.isProductFavorited(session.user.id, id);
    if (!isFavorited) {
      return NextResponse.json(
        { error: 'Product not in favorites' },
        { status: 404 }
      );
    }

    // Retirer des favoris
    await repository.removeUserFavorite(session.user.id, id);

    return NextResponse.json({
      success: true,
      message: 'Product removed from favorites'
    });
    
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
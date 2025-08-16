import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth-actions';
import { productContainer } from '@/features/products/infrastructure/di/ProductContainer';
import { UpdateProductSchema } from '@/features/products/domain/schemas/ProductSchemas';
import { z } from 'zod';

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/products/[id] - Récupérer un produit par ID
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    
    // Validation de l'ID
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Paramètres optionnels
    const { searchParams } = new URL(request.url);
    const includeIngredients = searchParams.get('includeIngredients') === 'true';
    const includeExtras = searchParams.get('includeExtras') === 'true';
    const includeAll = searchParams.get('includeAll') === 'true';

    // Récupération du produit
    const repository = productContainer.productRepository;
    let product;

    if (includeAll) {
      product = await repository.getProductWithAll(id);
    } else if (includeIngredients) {
      product = await repository.getProductWithIngredients(id);
    } else if (includeExtras) {
      product = await repository.getProductWithExtras(id);
    } else {
      product = await repository.getProductById(id);
    }

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Tracking des vues (si utilisateur connecté ou IP disponible)
    try {
      const session = await getCurrentSession();
      const trackViewUseCase = productContainer.trackProductView();
      
      await trackViewUseCase.execute({
        productId: id,
        userId: session?.user?.id,
        ipAddress: request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') || 
                  'unknown',
        userAgent: request.headers.get('user-agent') || undefined
      });
    } catch (trackingError) {
      // Ne pas faire échouer la requête si le tracking échoue
      console.warn('Failed to track product view:', trackingError);
    }

    return NextResponse.json({
      success: true,
      data: product
    });
    
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Mettre à jour un produit (admin uniquement)
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
    
    // Validation de l'ID
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Parse et validation des données
    const body = await request.json();
    const validatedData = UpdateProductSchema.parse(body);

    // Vérification que le produit existe
    const repository = productContainer.productRepository;
    const existingProduct = await repository.getProductById(id);
    
    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Mise à jour du produit
    const updatedProduct = await repository.updateProduct(id, validatedData);

    return NextResponse.json({
      success: true,
      data: updatedProduct
    });
    
  } catch (error) {
    console.error('Error updating product:', error);
    
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

// DELETE /api/products/[id] - Supprimer un produit (admin uniquement)
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
    
    // Validation de l'ID
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Vérification que le produit existe
    const repository = productContainer.productRepository;
    const existingProduct = await repository.getProductById(id);
    
    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Suppression du produit
    await repository.deleteProduct(id);

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
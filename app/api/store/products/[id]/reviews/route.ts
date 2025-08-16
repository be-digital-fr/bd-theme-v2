import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth-actions';
import { productContainer } from '@/features/products/infrastructure/di/ProductContainer';
import { CreateProductRatingSchema, UpdateProductRatingSchema } from '@/features/products/domain/schemas/ProductSchemas';
import { z } from 'zod';

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/products/[id]/reviews - Récupérer les avis d'un produit
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Paramètres de pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const repository = productContainer.productRepository;
    
    // Vérifier que le produit existe
    const product = await repository.getProductById(id);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Récupérer les avis
    const reviews = await repository.getProductRatings(id);
    const averageRating = await repository.getAverageRating(id);

    // Pagination simple côté serveur
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReviews = reviews.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: {
        reviews: paginatedReviews,
        averageRating,
        totalReviews: reviews.length,
        page,
        totalPages: Math.ceil(reviews.length / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/products/[id]/reviews - Ajouter un avis (utilisateur connecté uniquement)
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

    // Parse et validation des données
    const body = await request.json();
    const reviewData = CreateProductRatingSchema.parse({
      ...body,
      productId: id,
      userId: session.user.id
    });

    const repository = productContainer.productRepository;
    
    // Vérifier que le produit existe
    const product = await repository.getProductById(id);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Vérifier si l'utilisateur a déjà laissé un avis
    const existingReviews = await repository.getProductRatings(id);
    const userHasReviewed = existingReviews.some(review => review.userId === session.user.id);
    
    if (userHasReviewed) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 409 }
      );
    }

    // Créer l'avis
    const review = await repository.addProductRating(reviewData);

    return NextResponse.json({
      success: true,
      data: review
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating product review:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid review data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
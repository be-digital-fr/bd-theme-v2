import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-actions';
import { productContainer } from '@/features/products/infrastructure/di/ProductContainer';
import { z } from 'zod';

const BulkUpdateSchema = z.object({
  updates: z.array(z.object({
    id: z.string(),
    isFeatured: z.boolean().optional(),
    isPopular: z.boolean().optional(),
    isTrending: z.boolean().optional(),
  })),
});

export async function PATCH(request: NextRequest) {
  try {
    // Check admin permissions
    await requireAdmin();
    
    const body = await request.json();
    const { updates } = BulkUpdateSchema.parse(body);

    const updateProductUseCase = productContainer.updateProduct();
    const results = [];

    // Process updates in batches to avoid overwhelming the database
    for (const update of updates) {
      try {
        const result = await updateProductUseCase.execute(update.id, {
          isFeatured: update.isFeatured,
          isPopular: update.isPopular,
          isTrending: update.isTrending,
        });

        if (result.success) {
          results.push({ id: update.id, success: true });
        } else {
          results.push({ id: update.id, success: false, error: result.error });
        }
      } catch (error) {
        console.error(`Error updating product ${update.id}:`, error);
        results.push({ 
          id: update.id, 
          success: false, 
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const errorCount = results.filter(r => !r.success).length;

    return NextResponse.json({
      message: `${successCount} produits mis à jour avec succès${errorCount > 0 ? `, ${errorCount} erreurs` : ''}`,
      results,
      success: true,
    });

  } catch (error) {
    console.error('Bulk update error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour en lot' },
      { status: 500 }
    );
  }
}
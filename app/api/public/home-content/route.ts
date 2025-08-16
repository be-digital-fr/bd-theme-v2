import { NextRequest, NextResponse } from 'next/server';
import { PrismaHomeRepository } from '@/features/home/infrastructure/repositories/PrismaHomeRepository';

// GET /api/public/home-content - Get public home page content (no auth required)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'fr';
    const all = searchParams.get('all') === 'true';
    const raw = searchParams.get('raw') === 'true';
    const id = searchParams.get('id');

    const repository = new PrismaHomeRepository();

    // Handle specific ID request
    if (id) {
      const homeContent = await repository.getHomeContentById(id);
      return NextResponse.json({
        success: true,
        data: homeContent,
      });
    }

    // Handle raw content request
    if (raw) {
      const rawContent = await repository.getAllHomeContent();
      return NextResponse.json({
        success: true,
        data: rawContent,
      });
    }

    // Handle all localized content request
    if (all) {
      const allContent = await repository.getAllLocalizedHomeContent(locale as 'fr' | 'en' | 'es');
      return NextResponse.json({
        success: true,
        data: allContent,
      });
    }

    // Default: get single localized content
    const homeContent = await repository.getLocalizedHomeContent(locale as 'fr' | 'en' | 'es');

    return NextResponse.json({
      success: true,
      data: homeContent,
    });
  } catch (error) {
    console.error('Error fetching public home content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
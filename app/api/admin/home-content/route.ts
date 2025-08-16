import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth-actions';
import { HomeContentContainer } from '@/features/home-content/infrastructure/di/HomeContentContainer';

// GET /api/home-content - Get home page content
export async function GET() {
  try {
    // Check authentication
    const session = await getCurrentSession();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const container = HomeContentContainer.getInstance();
    const getHomeContentUseCase = container.getGetHomeContentUseCase();
    
    const result = await getHomeContentUseCase.execute();
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error?.message || 'Failed to load home content' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: result.data });
  } catch (error) {
    console.error('Error loading home content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/home-content - Update home page content
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getCurrentSession();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    const container = HomeContentContainer.getInstance();
    const updateHomeContentUseCase = container.getUpdateHomeContentUseCase();
    
    const result = await updateHomeContentUseCase.execute(data);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error?.message || 'Failed to update home content' },
        { status: 400 }
      );
    }

    return NextResponse.json({ data: result.data });
  } catch (error) {
    console.error('Error updating home content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
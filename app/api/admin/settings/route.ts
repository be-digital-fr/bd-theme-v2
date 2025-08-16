import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth-actions';
import { SettingsContainer } from '@/features/settings/infrastructure/di/SettingsContainer';

// GET /api/settings - Get site settings
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

    const container = SettingsContainer.getInstance();
    const getSettingsUseCase = container.getGetSettingsUseCase();
    
    const result = await getSettingsUseCase.execute();
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error?.message || 'Failed to load settings' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: result.data });
  } catch (error) {
    console.error('Error loading settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/settings - Update site settings
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
    
    const container = SettingsContainer.getInstance();
    const updateSettingsUseCase = container.getUpdateSettingsUseCase();
    
    const result = await updateSettingsUseCase.execute(data);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error?.message || 'Failed to update settings' },
        { status: 400 }
      );
    }

    return NextResponse.json({ data: result.data });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
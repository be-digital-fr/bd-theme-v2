import { NextRequest, NextResponse } from 'next/server'
import { AdminContainer } from '@/features/admin/infrastructure/di/AdminContainer'
import { UpdatePreferencesSchema } from '@/features/admin/domain/schemas/AdminPreferencesSchema'
import { z } from 'zod'

export async function GET() {
  try {
    const container = AdminContainer.getInstance()
    const useCase = container.getGetAdminPreferencesUseCase()
    const preferences = await useCase.execute()
    
    return NextResponse.json(preferences.toData())
  } catch (error) {
    console.error('Error fetching admin preferences:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Error fetching admin preferences' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body with Zod
    const validatedData = UpdatePreferencesSchema.parse(body)
    
    const container = AdminContainer.getInstance()
    const useCase = container.getUpdateAdminPreferencesUseCase()
    
    const updatedPreferences = await useCase.execute(validatedData)

    return NextResponse.json(updatedPreferences.toData())
  } catch (error) {
    console.error('Error saving admin preferences:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Error saving admin preferences' },
      { status: 500 }
    )
  }
} 
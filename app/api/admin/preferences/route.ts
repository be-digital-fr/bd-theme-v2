import { NextRequest, NextResponse } from 'next/server'
import { AdminContainer } from '@/features/admin/infrastructure/di/AdminContainer'
import { AdminPreferencesFormSchema } from '@/lib/schemas'

export async function GET() {
  try {
    const container = AdminContainer.getInstance()
    const useCase = container.getGetAdminPreferencesUseCase()
    const preferences = await useCase.execute()
    
    return NextResponse.json({
      id: preferences.id,
      isMultilingual: preferences.isMultilingual,
      supportedLanguages: preferences.supportedLanguages,
      defaultLanguage: preferences.defaultLanguage,
    })
  } catch (error) {
    console.error('Error fetching admin preferences:', error)
    return NextResponse.json(
      { error: 'Error fetching admin preferences' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = AdminPreferencesFormSchema.parse(body)
    
    const container = AdminContainer.getInstance()
    const useCase = container.getUpdateAdminPreferencesUseCase()
    
    const updatedPreferences = await useCase.execute({
      isMultilingual: validatedData.isMultilingual,
      supportedLanguages: validatedData.supportedLanguages,
      defaultLanguage: validatedData.defaultLanguage,
    })

    return NextResponse.json({
      id: updatedPreferences.id,
      isMultilingual: updatedPreferences.isMultilingual,
      supportedLanguages: updatedPreferences.supportedLanguages,
      defaultLanguage: updatedPreferences.defaultLanguage,
    })
  } catch (error) {
    console.error('Error saving admin preferences:', error)
    return NextResponse.json(
      { error: 'Error saving admin preferences' },
      { status: 500 }
    )
  }
} 
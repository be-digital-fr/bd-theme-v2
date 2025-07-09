import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { AdminPreferencesFormSchema } from '@/lib/schemas'

export async function GET() {
  try {
    let preferences = await prisma.adminPreferences.findFirst({
      orderBy: { createdAt: 'desc' }
    })

    if (!preferences) {
      // Créer des préférences par défaut si aucune n'existe
      preferences = await prisma.adminPreferences.create({
        data: {
          isMultilingual: false,
          supportedLanguages: ['fr'],
          defaultLanguage: 'fr',
        }
      })
    }

    return NextResponse.json({
      id: preferences.id,
      isMultilingual: preferences.isMultilingual,
      supportedLanguages: preferences.supportedLanguages,
      defaultLanguage: preferences.defaultLanguage,
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des préférences:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des préférences' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation avec Zod
    const validatedData = AdminPreferencesFormSchema.parse(body)

    // Si pas multilingue, on force supportedLanguages à contenir seulement defaultLanguage
    if (!validatedData.isMultilingual) {
      validatedData.supportedLanguages = [validatedData.defaultLanguage]
    }

    // Récupérer l'ID de la préférence existante ou créer
    let existingPreference = await prisma.adminPreferences.findFirst({
      orderBy: { createdAt: 'desc' }
    })

    let preferences
    if (existingPreference) {
      preferences = await prisma.adminPreferences.update({
        where: { id: existingPreference.id },
        data: {
          isMultilingual: validatedData.isMultilingual,
          supportedLanguages: validatedData.supportedLanguages,
          defaultLanguage: validatedData.defaultLanguage,
        }
      })
    } else {
      preferences = await prisma.adminPreferences.create({
        data: {
          isMultilingual: validatedData.isMultilingual,
          supportedLanguages: validatedData.supportedLanguages,
          defaultLanguage: validatedData.defaultLanguage,
        }
      })
    }

    return NextResponse.json({
      id: preferences.id,
      isMultilingual: preferences.isMultilingual,
      supportedLanguages: preferences.supportedLanguages,
      defaultLanguage: preferences.defaultLanguage,
    })
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des préférences:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde des préférences' },
      { status: 500 }
    )
  }
} 
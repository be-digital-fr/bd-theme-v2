import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'auth';

    // Récupérer toutes les traductions pour la catégorie
    const translations = await prisma.translation.findMany({
      where: {
        category
      }
    });

    // Organiser les traductions par clé
    const organizedTranslations: Record<string, Record<string, string>> = {};
    
    translations.forEach(translation => {
      organizedTranslations[translation.key] = {
        fr: translation.fr || '',
        en: translation.en || '',
        es: translation.es || '',
        de: translation.de || '',
        it: translation.it || '',
        pt: translation.pt || '',
        ar: translation.ar || ''
      };
    });

    return NextResponse.json({
      success: true,
      translations: organizedTranslations
    });

  } catch (error) {
    console.error('Error fetching translations:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch translations' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, category, translations } = body;

    if (!key || !category || !translations) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: key, category, translations' 
        },
        { status: 400 }
      );
    }

    // Créer ou mettre à jour la traduction
    const translation = await prisma.translation.upsert({
      where: { key },
      create: {
        key,
        category,
        fr: translations.fr,
        en: translations.en,
        es: translations.es,
        de: translations.de,
        it: translations.it,
        pt: translations.pt,
        ar: translations.ar,
      },
      update: {
        category,
        fr: translations.fr,
        en: translations.en,
        es: translations.es,
        de: translations.de,
        it: translations.it,
        pt: translations.pt,
        ar: translations.ar,
      }
    });

    return NextResponse.json({
      success: true,
      translation
    });

  } catch (error) {
    console.error('Error saving translation:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to save translation' 
      },
      { status: 500 }
    );
  }
}
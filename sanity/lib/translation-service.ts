export interface TranslationSettings {
  autoTranslate: boolean;
  translationModel: string;
  translationDelay: number;
}

export interface TranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  fieldName?: string;
  context?: string;
}

export interface TranslationResponse {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  success: boolean;
  error?: string;
}

export class SanityTranslationService {
  private settings: TranslationSettings | null = null;

  constructor(settings?: TranslationSettings) {
    if (settings) {
      this.updateSettings(settings);
    }
  }

  updateSettings(settings: TranslationSettings) {
    this.settings = settings;
  }

  isConfigured(): boolean {
    // Vérifier si la traduction est disponible côté serveur
    return true; // La vérification de la clé API se fait côté serveur dans l'API route
  }


  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    if (!this.isConfigured()) {
      return {
        translatedText: request.text,
        sourceLanguage: request.sourceLanguage,
        targetLanguage: request.targetLanguage,
        success: false,
        error: 'Translation service not configured'
      };
    }

    if (request.sourceLanguage === request.targetLanguage) {
      return {
        translatedText: request.text,
        sourceLanguage: request.sourceLanguage,
        targetLanguage: request.targetLanguage,
        success: true
      };
    }

    if (!request.text.trim()) {
      return {
        translatedText: '',
        sourceLanguage: request.sourceLanguage,
        targetLanguage: request.targetLanguage,
        success: true
      };
    }

    try {
      // Utiliser l'API route pour la traduction (plus sécurisé)
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: request.text,
          sourceLanguage: request.sourceLanguage,
          targetLanguage: request.targetLanguage,
          fieldName: request.fieldName,
          context: request.context,
          model: 'gpt-3.5-turbo', // Configuré côté serveur
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      return result;

    } catch (error) {
      console.error('Translation error:', error);
      return {
        translatedText: request.text,
        sourceLanguage: request.sourceLanguage,
        targetLanguage: request.targetLanguage,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown translation error'
      };
    }
  }

  async translateToMultiple(
    text: string, 
    sourceLanguage: string, 
    targetLanguages: string[],
    fieldName?: string,
    context?: string
  ): Promise<Record<string, TranslationResponse>> {
    const results: Record<string, TranslationResponse> = {};
    
    // Traduire en parallèle pour de meilleures performances
    const promises = targetLanguages
      .filter(lang => lang !== sourceLanguage)
      .map(async (targetLanguage) => {
        const result = await this.translate({
          text,
          sourceLanguage,
          targetLanguage,
          fieldName,
          context
        });
        return { targetLanguage, result };
      });

    const translations = await Promise.all(promises);
    
    // Conserver le texte original pour la langue source
    results[sourceLanguage] = {
      translatedText: text,
      sourceLanguage,
      targetLanguage: sourceLanguage,
      success: true
    };

    // Ajouter les traductions
    translations.forEach(({ targetLanguage, result }) => {
      results[targetLanguage] = result;
    });

    return results;
  }
}

// Instance globale pour Sanity Studio
export const translationService = new SanityTranslationService();
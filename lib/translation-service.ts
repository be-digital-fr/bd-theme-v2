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

export class TranslationService {
  private static instance: TranslationService;
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {}

  static getInstance(): TranslationService {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService();
    }
    return TranslationService.instance;
  }

  async translate(request: TranslationRequest): Promise<TranslationResponse> {
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
      const response = await fetch('/api/services/translate', {
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
          model: 'gpt-3.5-turbo',
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

  // Méthode pour traduire avec debounce
  translateWithDebounce(
    key: string,
    text: string,
    sourceLanguage: string,
    targetLanguage: string,
    callback: (result: TranslationResponse) => void,
    delay: number = 1000,
    fieldName?: string,
    context?: string
  ) {
    // Annuler le timer précédent s'il existe
    if (this.debounceTimers.has(key)) {
      clearTimeout(this.debounceTimers.get(key)!);
    }

    // Créer un nouveau timer
    const timer = setTimeout(async () => {
      const result = await this.translate({
        text,
        sourceLanguage,
        targetLanguage,
        fieldName,
        context
      });
      callback(result);
      this.debounceTimers.delete(key);
    }, delay);

    this.debounceTimers.set(key, timer);
  }
}

export const translationService = TranslationService.getInstance();
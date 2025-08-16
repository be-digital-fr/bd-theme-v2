import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

interface TranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  fieldName?: string;
  context?: string;
  model?: string;
}

interface TranslationResponse {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  success: boolean;
  error?: string;
}

// Initialiser OpenAI avec la clé depuis les variables d'environnement
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function getLanguageName(code: string): string {
  const languages: Record<string, string> = {
    fr: 'French',
    en: 'English',
    es: 'Spanish',
  };
  return languages[code] || code;
}

function cleanTranslatedText(text: string): string {
  let cleaned = text.trim();
  
  // Supprimer les guillemets de tous types au début et à la fin (plusieurs passes)
  for (let i = 0; i < 3; i++) {
    // Guillemets simples et doubles
    cleaned = cleaned.replace(/^["'`„""''‚']|["'`„""''‚']$/g, '');
    // Guillemets français
    cleaned = cleaned.replace(/^«\s*|\s*»$/g, '');
    // Guillemets doubles consécutifs
    cleaned = cleaned.replace(/^""+|""+$/g, '');
    cleaned = cleaned.trim();
  }
  
  // Supprimer les préfixes courants de traduction
  cleaned = cleaned.replace(/^(Translation|Traduction|Translated|Traduit)\s*[:.-]\s*/i, '');
  cleaned = cleaned.replace(/^(The translation is|La traduction est)\s*[:.-]?\s*/i, '');
  cleaned = cleaned.replace(/^(Here is the translation|Voici la traduction)\s*[:.-]?\s*/i, '');
  
  // Supprimer les phrases explicatives entre parenthèses
  cleaned = cleaned.replace(/\s*\([^)]*means[^)]*\)\s*/gi, '');
  cleaned = cleaned.replace(/\s*\([^)]*signifie[^)]*\)\s*/gi, '');
  
  // Supprimer les retours à la ligne inutiles et espaces multiples
  cleaned = cleaned.replace(/\n\s*\n/g, '\n').replace(/\s+/g, ' ');
  
  return cleaned.trim();
}

function createSystemPrompt(fieldName?: string, context?: string): string {
  let prompt = 'You are a professional translator for web content management. ';
  
  if (fieldName) {
    const fieldContext = {
      title: 'This is a title/heading that should be engaging and SEO-friendly.',
      subtitle: 'This is a subtitle that complements the main title.',
      description: 'This is a description that should be clear and informative.',
      content: 'This is main content that should maintain its tone and style.',
      welcoming: 'This is a welcoming message that should be warm and friendly.',
      name: 'This is a name that may need cultural adaptation.',
      summary: 'This is a summary that should be concise yet comprehensive.',
    };
    
    const fieldHint = fieldContext[fieldName as keyof typeof fieldContext];
    if (fieldHint) {
      prompt += fieldHint + ' ';
    }
  }

  if (context) {
    prompt += `Additional context: ${context}. `;
  }

  prompt += `
CRITICAL RULES:
- Translate naturally while preserving the original meaning and tone
- Maintain any formatting (line breaks, punctuation)
- Keep proper nouns and brand names unchanged unless cultural adaptation is needed
- For technical terms, use the most appropriate equivalent in the target language
- Return ONLY the translated text without any quotes, explanations, or additional comments
- Do NOT wrap your response in quotes ("") or other punctuation
- Do NOT add prefixes like "Translation:" or "The translation is:"
- Your response should be the direct translation that can be used immediately

Example:
Input: "Bonjour"
Correct output: Hello
Incorrect output: "Hello" or Translation: Hello`;

  return prompt;
}

export async function POST(request: NextRequest) {
  try {
    // Vérifier que la clé API OpenAI est configurée
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'OpenAI API key not configured. Please set OPENAI_API_KEY in environment variables.'
      }, { status: 500 });
    }

    const body: TranslationRequest = await request.json();
    const { text, sourceLanguage, targetLanguage, fieldName, context, model = 'gpt-3.5-turbo' } = body;

    // Validation
    if (!text || !sourceLanguage || !targetLanguage) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: text, sourceLanguage, targetLanguage'
      }, { status: 400 });
    }

    // Si la langue source et cible sont identiques, retourner le texte original
    if (sourceLanguage === targetLanguage) {
      return NextResponse.json({
        translatedText: text,
        sourceLanguage,
        targetLanguage,
        success: true
      });
    }

    // Si le texte est vide, retourner vide
    if (!text.trim()) {
      return NextResponse.json({
        translatedText: '',
        sourceLanguage,
        targetLanguage,
        success: true
      });
    }

    const systemPrompt = createSystemPrompt(fieldName, context);
    const sourceLanguageName = getLanguageName(sourceLanguage);
    const targetLanguageName = getLanguageName(targetLanguage);
    
    const userPrompt = `Translate the following text from ${sourceLanguageName} to ${targetLanguageName}:\n\n"${text}"`;

    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const rawTranslatedText = response.choices[0]?.message?.content?.trim();
    
    if (!rawTranslatedText) {
      throw new Error('No translation received from OpenAI');
    }

    // Nettoyer le texte traduit
    const translatedText = cleanTranslatedText(rawTranslatedText);

    const result: TranslationResponse = {
      translatedText,
      sourceLanguage,
      targetLanguage,
      success: true
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Translation API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown translation error';
    
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 500 });
  }
}
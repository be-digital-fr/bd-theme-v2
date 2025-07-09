// Utilitaire pour récupérer les préférences admin depuis l'API
// Note: Ceci sera utilisé côté serveur dans Sanity Studio

export async function getAdminPreferences() {
  try {
    // Dans un environnement Sanity Studio, nous devons faire appel à l'API Next.js
    // Déterminer l'URL de base selon l'environnement
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'
    
    const response = await fetch(`${baseUrl}/api/admin/preferences`)
    
    if (!response.ok) {
      console.warn('Could not fetch admin preferences, using defaults')
      return {
        isMultilingual: false,
        supportedLanguages: ['fr'],
        defaultLanguage: 'fr',
      }
    }
    
    return await response.json()
  } catch (error) {
    console.warn('Error fetching admin preferences:', error)
    return {
      isMultilingual: false,
      supportedLanguages: ['fr'],
      defaultLanguage: 'fr',
    }
  }
}

// Type pour les préférences admin (compatible avec le schéma Zod)
export interface AdminPreferences {
  isMultilingual: boolean
  supportedLanguages: string[]
  defaultLanguage: string
}

// Langues disponibles (dupliqué ici pour éviter les dépendances circulaires)
export const AVAILABLE_LANGUAGES = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ar', name: 'العربية' },
] as const 
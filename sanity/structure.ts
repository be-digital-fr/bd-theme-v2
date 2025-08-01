import type { StructureResolver } from 'sanity/structure'
import { structureWithTranslation, structureWithoutTranslation } from './lib/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = async (S, context) => {
  const client = context.getClient({ apiVersion: '2023-01-01' })
  
  try {
    // Récupérer l'état actuel directement
    const settings = await client.fetch(`*[_type == "settings" && _id == "settings-site"][0]{isMultilingual}`)
    const isMultilingual = settings?.isMultilingual || false
    
    
    // Écouter les changements en arrière-plan pour notifier l'utilisateur
    client
      .listen(`*[_type == "settings" && _id == "settings-site"]`)
      .subscribe({
        next: (update) => {
          if (update.result) {
            const newMultilingualState = update.result.isMultilingual || false
            if (newMultilingualState !== isMultilingual) {
              
              // Afficher une notification à l'utilisateur
              if (typeof window !== 'undefined' && (window as any).sanity) {
                const sanity = (window as any).sanity
                if (sanity.toast) {
                  sanity.toast.push({
                    status: 'info',
                    title: 'Paramètres modifiés',
                    description: 'Rafraîchissez la page pour voir la nouvelle structure de navigation.',
                    duration: 10000
                  })
                }
              }
              
              // Forcer un reload après un court délai
              setTimeout(() => {
                if (typeof window !== 'undefined') {
                  window.location.reload()
                }
              }, 2000)
            }
          }
        },
        error: () => {
          // Erreur silencieuse lors de l'observation
        }
      })
    
    return isMultilingual 
      ? structureWithTranslation(S, context) 
      : structureWithoutTranslation(S, context)
      
  } catch (error) {
    // En cas d'erreur, utiliser la structure sans traductions par défaut
    return structureWithoutTranslation(S, context)
  }
}   
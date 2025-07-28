import type {StructureResolver} from 'sanity/structure'
import { CogIcon, HomeIcon } from '@sanity/icons'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // DOCUMENTS SINGLETON (Un seul document de chaque type)
      S.listItem()
        .title('⚙️ Paramètres du site')
        .icon(CogIcon)
        .child(
          S.editor()
            .id('settings')
            .schemaType('settings')
            .documentId('settings')
            .title('Paramètres du site')
        ),
      
      S.listItem()
        .title('🏠 Page d\'accueil')
        .icon(HomeIcon) 
        .child(
          S.editor()
            .id('home')
            .schemaType('home')
            .documentId('home')
            .title('Page d\'accueil')
        ),

      S.divider(),

      // DOCUMENTS AVEC TRADUCTION AUTOMATIQUE
      S.listItem()
        .title('🌐 Pages avec traduction auto')
        .child(
          S.list()
            .title('Documents multilingues')
            .items([
              S.documentTypeListItem('homeWithAutoTranslate')
                .title('🏠 Page d\'accueil avancée')
                .icon(HomeIcon),
            ])
        ),

      S.divider(),

      // AUTRES DOCUMENTS
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !['settings', 'home', 'homeWithAutoTranslate'].includes(item.getId()!),
      ),
    ])

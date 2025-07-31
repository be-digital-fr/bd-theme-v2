import type { StructureResolver } from 'sanity/structure'
import { CogIcon, HomeIcon, UserIcon } from '@sanity/icons'

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
            .id('settings-site')
            .schemaType('settings')
            .documentId('settings-site')
            .title('Paramètres du site')
        ),

      S.listItem()
        .title('🔐 Paramètres d\'authentification')
        .icon(UserIcon)
        .child(
          S.editor()
            .id('auth-settings')
            .schemaType('authSettings')
            .documentId('auth-settings')
            .title('Paramètres d\'authentification')
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
      // S.listItem()
      //   .title('🌐 Pages avec traduction auto')
      //   .child(
      //     S.list()
      //       .title('Documents multilingues')
      //       .items([
      //         S.documentTypeListItem('homeWithAutoTranslate')
      //           .title('🏠 Page d\'accueil avancée')
      //           .icon(HomeIcon),
      //       ])
      //   ),

      // S.divider(),

      // AUTRES DOCUMENTS
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !['settings', 'authSettings', 'home', 'homeWithAutoTranslate'].includes(item.getId()!),
      ),
    ])

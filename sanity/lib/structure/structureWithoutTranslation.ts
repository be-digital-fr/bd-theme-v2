import type { StructureBuilder, StructureResolverContext, ListItemBuilder } from 'sanity/structure'
import { CogIcon, HomeIcon, UserIcon, TranslateIcon } from '@sanity/icons'

export const structureWithoutTranslation = (
  S: StructureBuilder,
  context: StructureResolverContext
) =>
  S.list()
    .title('Content')
    .items([
      // SECTION PAGES
      S.listItem()
        .title('📄 Pages')
        .icon(HomeIcon)
        .child(
          S.list()
            .title('Pages du site')
            .items([
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
              // Futures pages peuvent être ajoutées ici
              // S.listItem().title('À propos')...
              // S.listItem().title('Contact')...
            ])
        ),

      S.divider(),

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

      S.divider(),



      // AUTRES DOCUMENTS
      ...S.documentTypeListItems().filter(
        (item: ListItemBuilder) =>
          item.getId() &&
          ![
            'settings',
            'authSettings',
            'home',
            'authNotificationsTranslations',
            'forgotPasswordTranslations',
            'resetPasswordTranslations',
            'signInTranslations',
            'signUpTranslations',
          ].includes(item.getId() as string)
      ),
    ])
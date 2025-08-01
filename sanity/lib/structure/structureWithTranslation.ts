import type { StructureBuilder, StructureResolverContext, ListItemBuilder } from 'sanity/structure'
import { CogIcon, HomeIcon, UserIcon, TranslateIcon } from '@sanity/icons'

export const structureWithTranslation = (
  S: StructureBuilder,
  context: StructureResolverContext
) =>
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

      // SECTION TRADUCTIONS
      S.listItem()
        .title('🌐 Traductions')
        .icon(TranslateIcon)
        .child(
          S.list()
            .title('Traductions')
            .items([
              S.listItem()
                .title('🔔 Messages de notification Auth')
                .child(
                  S.editor()
                    .id('authNotificationsTranslations')
                    .schemaType('authNotificationsTranslations')
                    .documentId('authNotificationsTranslations')
                    .title('Messages de notification Auth')
                ),
              S.listItem()
                .title('🔑 Mot de passe oublié')
                .child(
                  S.editor()
                    .id('forgotPasswordTranslations')
                    .schemaType('forgotPasswordTranslations')
                    .documentId('forgotPasswordTranslations')
                    .title('Mot de passe oublié')
                ),
              S.listItem()
                .title('🔄 Réinitialisation mot de passe')
                .child(
                  S.editor()
                    .id('resetPasswordTranslations')
                    .schemaType('resetPasswordTranslations')
                    .documentId('resetPasswordTranslations')
                    .title('Réinitialisation mot de passe')
                ),
              S.listItem()
                .title('🔐 Page de connexion')
                .child(
                  S.editor()
                    .id('signInTranslations')
                    .schemaType('signInTranslations')
                    .documentId('signInTranslations')
                    .title('Page de connexion')
                ),
              S.listItem()
                .title('📝 Page d\'inscription')
                .child(
                  S.editor()
                    .id('signUpTranslations')
                    .schemaType('signUpTranslations')
                    .documentId('signUpTranslations')
                    .title('Page d\'inscription')
                ),
            ])
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
            'homeWithAutoTranslate',
            'authNotificationsTranslations',
            'forgotPasswordTranslations',
            'resetPasswordTranslations',
            'signInTranslations',
            'signUpTranslations',
          ].includes(item.getId() as string)
      ),
    ])
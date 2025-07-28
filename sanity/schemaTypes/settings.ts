import { defineField } from 'sanity'
import { CogIcon } from '@sanity/icons'
import { createSingleton } from '../lib/singletons'

export const settings = createSingleton({
  name: 'settings',
  title: 'Paramètres du site',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      initialValue: 'Paramètres du site',
      validation: (rule) => rule.required(),
      description: 'Nom affiché pour ce document (ne modifiez pas)',
      readOnly: true,
    }),
    defineField({
      name: 'isMultilingual',
      title: 'Mode multilingue',
      description: 'Activer le support multilingue pour le site',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'supportedLanguages',
      title: 'Langues supportées',
      description: 'Sélectionnez les langues que vous souhaitez prendre en charge',
      type: 'array',
      of: [{
        type: 'string',
        options: {
          list: [
            { title: 'Français', value: 'fr' },
            { title: 'English', value: 'en' },
            { title: 'Español', value: 'es' },
          ]
        }
      }],
      initialValue: ['fr'],
      validation: (rule) => rule.min(1).error('Au moins une langue doit être sélectionnée'),
      hidden: ({ parent }) => !parent?.isMultilingual,
    }),
    defineField({
      name: 'defaultLanguage',
      title: 'Langue par défaut',
      description: 'Langue principale du site',
      type: 'string',
      options: {
        list: [
          { title: 'Français', value: 'fr' },
          { title: 'English', value: 'en' },
          { title: 'Español', value: 'es' },
        ]
      },
      initialValue: 'fr',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'translationSettings',
      title: 'Paramètres de traduction',
      type: 'object',
      fields: [
        defineField({
          name: 'autoTranslate',
          title: 'Traduction automatique',
          description: 'Activer la traduction automatique avec ChatGPT',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'apiKeyInfo',
          title: 'Configuration API OpenAI',
          type: 'object',
          fields: [
            defineField({
              name: 'info',
              title: 'Information',
              type: 'text',
              initialValue: 'La clé API OpenAI est configurée dans les variables d\'environnement (.env) pour des raisons de sécurité. Variable: OPENAI_API_KEY',
              readOnly: true,
            }),
          ],
          hidden: ({ parent }) => !parent?.autoTranslate,
        }),
        defineField({
          name: 'translationModel',
          title: 'Modèle de traduction',
          description: 'Modèle ChatGPT à utiliser pour les traductions',
          type: 'string',
          options: {
            list: [
              { title: 'GPT-3.5 Turbo (Rapide)', value: 'gpt-3.5-turbo' },
              { title: 'GPT-4 (Précis)', value: 'gpt-4' },
              { title: 'GPT-4 Turbo (Équilibré)', value: 'gpt-4-turbo' },
            ]
          },
          initialValue: 'gpt-3.5-turbo',
          hidden: ({ parent }) => !parent?.autoTranslate,
        }),
        defineField({
          name: 'translationDelay',
          title: 'Délai avant traduction (ms)',
          description: 'Temps d\'attente après la dernière frappe avant de déclencher la traduction',
          type: 'number',
          initialValue: 2000,
          validation: (rule) => rule.min(500).max(10000),
          hidden: ({ parent }) => !parent?.autoTranslate,
        }),
      ],
      hidden: ({ parent }) => !parent?.isMultilingual,
    }),
  ],
});
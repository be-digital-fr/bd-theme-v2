import { defineField } from 'sanity'
import { CogIcon } from '@sanity/icons'
import { createSingleton } from '../../lib/singletons'

export const settings = createSingleton({
  name: 'settings',
  title: 'Paramètres du site',
  icon: CogIcon,
  groups: [
    {
      name: 'general',
      title: 'Général',
      default: true,
    },
    {
      name: 'header',
      title: 'Header',
    },
    {
      name: 'languages',
      title: 'Langues',
    },
    {
      name: 'translation',
      title: 'Traduction',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      initialValue: 'Paramètres du site',
      validation: (rule) => rule.required(),
      description: 'Nom affiché pour ce document (ne modifiez pas)',
      readOnly: true,
      group: 'general',
    }),

    // HEADER & NAVIGATION SETTINGS
    defineField({
      name: 'headerSettings',
      title: 'Configuration du Header',
      type: 'object',
      group: 'header',
      fields: [
        defineField({
          name: 'logoType',
          title: 'Type de logo',
          type: 'string',
          options: {
            list: [
              { title: 'Texte', value: 'text' },
              { title: 'Image', value: 'image' },
              { title: 'Texte et Image', value: 'both' },
            ],
          },
          initialValue: 'text',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'logoText',
          title: 'Texte du logo',
          type: 'string',
          description: 'Texte affiché comme logo (nom de marque, ne sera pas traduit)',
          hidden: ({ parent }) => parent?.logoType === 'image',
        }),
        defineField({
          name: 'logoImage',
          title: 'Image du logo',
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: 'alt',
              title: 'Texte alternatif',
              type: 'autoMultilingualString',
              validation: (rule) => rule.required(),
            }),
          ],
          hidden: ({ parent }) => parent?.logoType === 'text',
        }),
        defineField({
          name: 'headerStyle',
          title: 'Style du header',
          type: 'string',
          options: {
            list: [
              { title: 'Transparent (défaut)', value: 'transparent' },
              { title: 'Opaque', value: 'opaque' },
              { title: 'Gradient', value: 'gradient' },
            ],
          },
          initialValue: 'transparent',
        }),
        defineField({
          name: 'stickyHeader',
          title: 'Header collant',
          description: 'Le header reste visible lors du scroll',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'showSearchIcon',
          title: 'Afficher l\'icône de recherche',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'showUserIcon',
          title: 'Afficher l\'icône utilisateur',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'showCartIcon',
          title: 'Afficher l\'icône panier',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'cartBadgeCount',
          title: 'Nombre d\'articles dans le panier (demo)',
          type: 'number',
          initialValue: 0,
          validation: (rule) => rule.min(0).max(99),
        }),
      ],
    }),

    defineField({
      name: 'isMultilingual',
      title: 'Mode multilingue',
      description: 'Activer le support multilingue pour le site',
      type: 'boolean',
      initialValue: false,
      group: 'languages',
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
      group: 'languages',
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
      group: 'languages',
    }),
    defineField({
      name: 'translationSettings',
      title: 'Paramètres de traduction',
      type: 'object',
      group: 'translation',
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
    
    // Language Selector Texts
    defineField({
      name: 'languageSelectorTexts',
      title: 'Textes du sélecteur de langue',
      description: 'Textes affichés dans le sélecteur de langue',
      type: 'object',
      group: 'languages',
      fields: [
        defineField({
          name: 'chooseLangText',
          title: 'Texte "Choisir une langue"',
          description: 'Texte affiché dans le dropdown du sélecteur de langue',
          type: 'autoMultilingualString',
          initialValue: {
            fr: 'Choisir une langue',
            en: 'Choose a language',
            es: 'Elegir un idioma'
          },
          validation: (rule) => rule.required(),
        }),
      ],
      hidden: ({ parent }) => !parent?.isMultilingual,
    }),
  ],
});
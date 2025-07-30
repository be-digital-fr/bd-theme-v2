import { defineField } from 'sanity'
import { CogIcon, MenuIcon, CheckmarkIcon, CloseIcon } from '@sanity/icons'
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
      name: 'navigation',
      title: 'Navigation',
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

    // NAVIGATION SETTINGS
    defineField({
      name: 'navigation',
      title: 'Navigation',
      type: 'object',
      group: 'navigation',
      fields: [
        defineField({
          name: 'menuItems',
          title: 'Éléments du menu',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'menuItem',
              title: 'Élément de menu',
              fields: [
                defineField({
                  name: 'label',
                  title: 'Libellé',
                  type: 'autoMultilingualString',
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: 'slug',
                  title: 'Identifiant',
                  type: 'slug',
                  options: {
                    source: (_, options) => {
                      const parent = options.parent as any;
                      const label = parent?.label;
                      if (typeof label === 'object' && label) {
                        return label.fr || label.en || Object.values(label)[0] || '';
                      }
                      return label || '';
                    },
                    maxLength: 96,
                  },
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: 'href',
                  title: 'Lien',
                  type: 'string',
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: 'isExternal',
                  title: 'Lien externe',
                  type: 'boolean',
                  initialValue: false,
                }),
                defineField({
                  name: 'openInNewTab',
                  title: 'Ouvrir dans un nouvel onglet',
                  type: 'boolean',
                  initialValue: false,
                  hidden: ({ parent }) => !parent?.isExternal,
                }),
                defineField({
                  name: 'isActive',
                  title: 'Élément actif',
                  type: 'boolean',
                  initialValue: true,
                }),
              ],
              preview: {
                select: {
                  title: 'label.fr',
                  subtitle: 'href',
                  isActive: 'isActive',
                },
                prepare: ({ title, subtitle, isActive }) => ({
                  title: title || 'Sans titre',
                  subtitle: `${subtitle}${!isActive ? ' - Inactif' : ''}`,
                  media: isActive ? CheckmarkIcon : CloseIcon,
                }),
              },
            },
          ],
          options: {
            sortable: true,
          },
        }),
        defineField({
          name: 'mobileMenuTitle',
          title: 'Titre du menu mobile',
          type: 'autoMultilingualString',
          initialValue: {
            fr: 'Menu',
            en: 'Menu',
            es: 'Menú',
          },
        }),
        defineField({
          name: 'footerMenuItems',
          title: 'Éléments du menu footer',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'footerMenuItem',
              title: 'Élément de menu footer',
              fields: [
                defineField({
                  name: 'label',
                  title: 'Libellé',
                  type: 'autoMultilingualString',
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: 'href',
                  title: 'Lien',
                  type: 'string',
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: 'isExternal',
                  title: 'Lien externe',
                  type: 'boolean',
                  initialValue: false,
                }),
                defineField({
                  name: 'isActive',
                  title: 'Élément actif',
                  type: 'boolean',
                  initialValue: true,
                }),
              ],
              preview: {
                select: {
                  title: 'label.fr',
                  subtitle: 'href',
                  isActive: 'isActive',
                },
                prepare: ({ title, subtitle, isActive }) => ({
                  title: title || 'Sans titre',
                  subtitle: `${subtitle}${!isActive ? ' - Inactif' : ''}`,
                  media: isActive ? CheckmarkIcon : CloseIcon,
                }),
              },
            },
          ],
          options: {
            sortable: true,
          },
        }),
      ],
    }),
  ],
});
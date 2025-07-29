import { defineField } from 'sanity'
import { MenuIcon, CheckmarkIcon, CloseIcon } from '@sanity/icons'
import { createSingleton } from '../../lib/singletons'

export const navigation = createSingleton({
  name: 'navigation',
  title: 'Navigation',
  icon: MenuIcon,
  groups: [
    {
      name: 'menu',
      title: 'Menu Principal',
      default: true,
    },
    {
      name: 'settings',
      title: 'Paramètres',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      initialValue: 'Navigation',
      validation: (rule) => rule.required(),
      description: 'Nom affiché pour ce document (ne modifiez pas)',
      readOnly: true,
      group: 'settings',
    }),

    // MENU ITEMS
    defineField({
      name: 'menuItems',
      title: 'Éléments du menu',
      type: 'array',
      group: 'menu',
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


    // MOBILE MENU SETTINGS
    defineField({
      name: 'mobileMenuTitle',
      title: 'Titre du menu mobile',
      type: 'autoMultilingualString',
      group: 'settings',
      initialValue: {
        fr: 'Menu',
        en: 'Menu',
        es: 'Menú',
      },
    }),


    // FOOTER MENU (optionnel pour plus tard)
    defineField({
      name: 'footerMenuItems',
      title: 'Éléments du menu footer',
      type: 'array',
      group: 'menu',
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
});
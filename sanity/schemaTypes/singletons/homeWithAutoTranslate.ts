import { defineType, defineField } from 'sanity'
import { HomeIcon } from '@sanity/icons'

export const homeWithAutoTranslate = defineType({
  name: 'homeWithAutoTranslate',
  title: 'Page d\'accueil (avec traduction auto)',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'autoMultilingualString',
      title: 'Titre de la page',
      description: 'Titre principal - la traduction se fera automatiquement',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subtitle',
      type: 'autoMultilingualString',
      title: 'Sous-titre',
      description: 'Sous-titre de la page - traduit automatiquement',
    }),
    defineField({
      name: 'welcoming',
      type: 'autoMultilingualString',
      title: 'Message de bienvenue',
      description: 'Message d\'accueil - traduit automatiquement',
    }),
    defineField({
      name: 'description',
      type: 'autoMultilingualText',
      title: 'Description',
      description: 'Description détaillée - traduite automatiquement',
    }),
    defineField({
      name: 'content',
      type: 'autoMultilingualText',
      title: 'Contenu principal',
      description: 'Contenu principal de la page - traduit automatiquement',
    }),
    defineField({
      name: 'callToAction',
      type: 'autoMultilingualString',
      title: 'Appel à l\'action',
      description: 'Texte du bouton principal - traduit automatiquement',
    }),
    defineField({
      name: 'metadata',
      title: 'Métadonnées SEO',
      type: 'object',
      fields: [
        defineField({
          name: 'seoTitle',
          type: 'autoMultilingualString',
          title: 'Titre SEO',
          description: 'Titre pour les moteurs de recherche - traduit automatiquement',
        }),
        defineField({
          name: 'seoDescription',
          type: 'autoMultilingualText',
          title: 'Description SEO',
          description: 'Description pour les moteurs de recherche - traduite automatiquement',
        }),
      ],
      options: { collapsible: true, collapsed: true },
    }),
  ],
  preview: {
    select: {
      title: 'title.fr',
      subtitle: 'subtitle.fr',
      welcoming: 'welcoming.fr',
    },
    prepare({ title, subtitle, welcoming }) {
      return {
        title: title || 'Page d\'accueil',
        subtitle: subtitle || welcoming || 'Avec traduction automatique',
      };
    },
  },
});

export default homeWithAutoTranslate;
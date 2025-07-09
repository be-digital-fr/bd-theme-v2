import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'exemple',
  title: 'Exemple de contenu adaptatif',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'adaptiveString', // 🎯 Utilise automatiquement le composant adaptatif
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Sous-titre',
      type: 'adaptiveString', // 🎯 Utilise automatiquement le composant adaptatif
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'adaptiveText', // 🎯 Utilise automatiquement le composant adaptatif
    }),
    defineField({
      name: 'content',
      title: 'Contenu détaillé',
      type: 'adaptiveText', // 🎯 Utilise automatiquement le composant adaptatif
    }),
    defineField({
      name: 'standardField',
      title: 'Champ standard (pour comparaison)',
      type: 'string', // Champ classique Sanity
      description: 'Ce champ utilise l\'interface standard de Sanity',
    }),
    defineField({
      name: 'standardText',
      title: 'Texte standard (pour comparaison)',
      type: 'text', // Champ classique Sanity
      description: 'Ce champ utilise l\'interface standard de Sanity',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
    },
    prepare({ title, subtitle }) {
      return {
        title: typeof title === 'string' ? title : 'Titre multilingue',
        subtitle: typeof subtitle === 'string' ? subtitle : 'Sous-titre multilingue',
      }
    },
  },
}) 
import { defineType, defineField } from 'sanity'
import React from 'react'

export default defineType({
  name: 'home',
  title: 'Page d\'accueil',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'adaptiveString',
      title: 'Titre de la page',
      description: 'Titre principal de la page d\'accueil',
    }),
    defineField({
      name: 'welcoming',
      type: 'multilingualString',
      title: 'Message de bienvenue',
      description: 'Message d\'accueil affiché sur la page',
    }),
    defineField({
      name: 'subtitle',
      type: 'adaptiveString',
      title: 'Sous-titre',
      description: 'Sous-titre de la page d\'accueil',
    }),
    defineField({
      name: 'description',
      type: 'multilingualText',
      title: 'Description',
      description: 'Description détaillée de la page',
    }),
    defineField({
      name: 'content',
      type: 'text',
      title: 'Contenu additionnel',
      description: 'Contenu supplémentaire (champ standard)',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      welcoming: 'welcoming',
      subtitle: 'subtitle',
    },
    prepare({ title, welcoming, subtitle }) {
      // Résoudre les valeurs multilingues pour l'aperçu
      const resolvedTitle = typeof title === 'string' ? title : title?.fr || title?.en || 'Page d\'accueil'
      const resolvedWelcoming = typeof welcoming === 'string' ? welcoming : welcoming?.fr || welcoming?.en || 'Message de bienvenue'
      const resolvedSubtitle = typeof subtitle === 'string' ? subtitle : subtitle?.fr || subtitle?.en || ''
      
      return {
        title: resolvedTitle,
        subtitle: resolvedSubtitle || resolvedWelcoming,
      }
    },
  },
}) 
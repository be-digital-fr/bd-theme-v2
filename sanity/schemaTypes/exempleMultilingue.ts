import { defineType } from 'sanity'

export default defineType({
  name: 'exempleMultilingue',
  type: 'document',
  title: 'Exemple Multilingue',
  description: 'Exemple montrant les différents types de champs multilingues',
  fields: [
    {
      name: 'titre',
      type: 'string',
      title: 'Titre (champ standard)',
      description: 'Champ string standard - une seule langue',
    },
    {
      name: 'titreAdaptatif',
      type: 'adaptiveString',
      title: 'Titre adaptatif',
      description: 'Champ qui s\'adapte aux préférences (langue par défaut si string)',
    },
    {
      name: 'titreMultilingue',
      type: 'multilingualString',
      title: 'Titre multilingue complet',
      description: 'Champ qui stocke toutes les langues dans un objet',
    },
    {
      name: 'description',
      type: 'text',
      title: 'Description (champ standard)',
      description: 'Champ text standard - une seule langue',
    },
    {
      name: 'descriptionAdaptative',
      type: 'adaptiveText',
      title: 'Description adaptative',
      description: 'Champ qui s\'adapte aux préférences (langue par défaut si text)',
    },
    {
      name: 'descriptionMultilingue',
      type: 'multilingualText',
      title: 'Description multilingue complète',
      description: 'Champ qui stocke toutes les langues dans un objet',
    },
    {
      name: 'contenu',
      type: 'string',
      title: 'Contenu standard',
      description: 'Champ qui ne change pas',
    },
  ],
  preview: {
    select: {
      title: 'titre',
      subtitle: 'titreAdaptatif',
    },
    prepare(selection) {
      const { title, subtitle } = selection
      return {
        title: title || 'Exemple Multilingue',
        subtitle: subtitle || 'Aucun sous-titre',
      }
    },
  },
}) 
import { defineField } from 'sanity'
import { HomeIcon } from '@sanity/icons'
import { createSingleton } from '../lib/singletons'

export default createSingleton({
  name: 'home',
  title: 'Page d\'accueil',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'autoMultilingualString',
      title: 'Titre de la page',
      description: 'Titre principal de la page d\'accueil avec traduction automatique',
    }),
    defineField({
      name: 'welcoming',
      type: 'autoMultilingualString',
      title: 'Message de bienvenue',
      description: 'Message d\'accueil affiché sur la page avec traduction automatique',
    }),
    defineField({
      name: 'subtitle',
      type: 'autoMultilingualString',
      title: 'Sous-titre',
      description: 'Sous-titre de la page d\'accueil avec traduction automatique',
    }),
    defineField({
      name: 'description',
      type: 'autoMultilingualText',
      title: 'Description',
      description: 'Description détaillée de la page avec traduction automatique',
    }),
    defineField({
      name: 'content',
      type: 'text',
      title: 'Contenu additionnel',
      description: 'Contenu supplémentaire (champ standard)',
    }),
  ],
});
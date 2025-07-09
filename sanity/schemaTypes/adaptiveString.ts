import { defineType } from 'sanity'
import React from 'react'

// Type personnalisé qui utilise automatiquement le composant DynamicWelcomingInput
export default defineType({
  name: 'adaptiveString',
  type: 'string',
  title: 'Texte court adaptatif',
  description: 'Champ de texte court qui s\'adapte automatiquement aux préférences linguistiques',
  components: {
    input: (props) => {
      const DynamicWelcomingInput = require('../components/DynamicWelcomingInput').default
      return React.createElement(DynamicWelcomingInput, props)
    },
  },
}) 
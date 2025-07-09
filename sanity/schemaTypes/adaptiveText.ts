import { defineType } from 'sanity'
import React from 'react'

// Type personnalisé qui utilise automatiquement le composant DynamicWelcomingInput
export default defineType({
  name: 'adaptiveText',
  type: 'text',
  title: 'Texte adaptatif',
  description: 'Champ de texte qui s\'adapte automatiquement aux préférences linguistiques',
  components: {
    input: (props) => {
      const DynamicWelcomingInput = require('../components/DynamicWelcomingInput').default
      return React.createElement(DynamicWelcomingInput, props)
    },
  },
}) 
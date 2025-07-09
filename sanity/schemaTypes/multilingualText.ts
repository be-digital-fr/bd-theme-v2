import { defineType } from 'sanity'
import React from 'react'

// Type personnalisé pour les champs text multilingues (type object)
export default defineType({
  name: 'multilingualText',
  type: 'object',
  title: 'Texte multilingue',
  description: 'Champ de texte qui stocke plusieurs langues dans un objet',
  fields: [
    {
      name: 'fr',
      type: 'text',
      title: 'Français',
    },
    {
      name: 'en',
      type: 'text',
      title: 'English',
    },
    {
      name: 'es',
      type: 'text',
      title: 'Español',
    },
    {
      name: 'de',
      type: 'text',
      title: 'Deutsch',
    },
    {
      name: 'it',
      type: 'text',
      title: 'Italiano',
    },
    {
      name: 'pt',
      type: 'text',
      title: 'Português',
    },
    {
      name: 'ar',
      type: 'text',
      title: 'العربية',
    },
  ],
  components: {
    input: (props) => {
      const DynamicWelcomingInput = require('../components/DynamicWelcomingInput').default
      return React.createElement(DynamicWelcomingInput, props)
    },
  },
  preview: {
    select: {
      fr: 'fr',
      en: 'en',
      es: 'es',
      de: 'de',
      it: 'it',
      pt: 'pt',
      ar: 'ar',
    },
    prepare(selection) {
      const { fr, en, es, de, it, pt, ar } = selection
      const firstValue = fr || en || es || de || it || pt || ar || ''
      const languageCount = Object.values(selection).filter(Boolean).length
      
      return {
        title: firstValue.length > 50 ? firstValue.substring(0, 50) + '...' : firstValue,
        subtitle: `${languageCount} langue${languageCount > 1 ? 's' : ''} renseignée${languageCount > 1 ? 's' : ''}`,
      }
    },
  },
}) 
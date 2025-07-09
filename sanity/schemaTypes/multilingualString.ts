import { defineType } from 'sanity'
import React from 'react'

// Type personnalisé pour les champs string multilingues (type object)
export default defineType({
  name: 'multilingualString',
  type: 'object',
  title: 'Texte court multilingue',
  description: 'Champ de texte court qui stocke plusieurs langues dans un objet',
  fields: [
    {
      name: 'fr',
      type: 'string',
      title: 'Français',
    },
    {
      name: 'en',
      type: 'string',
      title: 'English',
    },
    {
      name: 'es',
      type: 'string',
      title: 'Español',
    },
    {
      name: 'de',
      type: 'string',
      title: 'Deutsch',
    },
    {
      name: 'it',
      type: 'string',
      title: 'Italiano',
    },
    {
      name: 'pt',
      type: 'string',
      title: 'Português',
    },
    {
      name: 'ar',
      type: 'string',
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
        title: firstValue,
        subtitle: `${languageCount} langue${languageCount > 1 ? 's' : ''} renseignée${languageCount > 1 ? 's' : ''}`,
      }
    },
  },
}) 
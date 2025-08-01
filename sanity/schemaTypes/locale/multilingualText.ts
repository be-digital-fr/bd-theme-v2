import { defineType } from 'sanity';

export default defineType({
  name: 'multilingualText',
  title: 'Multilingual Text',
  type: 'object',
  fields: [
    {
      name: 'fr',
      title: 'Français',
      type: 'text',
    },
    {
      name: 'en',
      title: 'English',
      type: 'text',
    },
    {
      name: 'es',
      title: 'Español',
      type: 'text',
    },
    {
      name: 'de',
      title: 'Deutsch',
      type: 'text',
    },
  ],
});
import { defineType } from 'sanity';

export default defineType({
  name: 'multilingualString',
  title: 'Multilingual String',
  type: 'object',
  fields: [
    {
      name: 'fr',
      title: 'Français',
      type: 'string',
    },
    {
      name: 'en',
      title: 'English',
      type: 'string',
    },
    {
      name: 'es',
      title: 'Español',
      type: 'string',
    },
    {
      name: 'de',
      title: 'Deutsch',
      type: 'string',
    },
  ],
});
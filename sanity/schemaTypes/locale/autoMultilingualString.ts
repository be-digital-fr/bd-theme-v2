import { defineType } from 'sanity';
import { MultilingualFieldInput } from '../../components/MultilingualFieldInput';

export const autoMultilingualString = defineType({
  name: 'autoMultilingualString',
  title: 'Texte multilingue avec traduction automatique',
  type: 'object',
  components: {
    input: MultilingualFieldInput,
  },
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
  ],
  preview: {
    select: {
      fr: 'fr',
      en: 'en',
      es: 'es',
    },
    prepare({ fr, en, es }) {
      const languages = [
        fr && 'FR',
        en && 'EN', 
        es && 'ES'
      ].filter(Boolean);
      
      return {
        title: fr || 'Texte multilingue',
        subtitle: languages.length > 1 ? `Disponible en: ${languages.join(', ')}` : 'Français uniquement',
      };
    },
  },
});

export default autoMultilingualString;
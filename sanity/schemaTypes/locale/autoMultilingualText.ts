import { defineType } from 'sanity';
import { MultilingualTextInput } from '../../components/MultilingualTextInput';

export const autoMultilingualText = defineType({
  name: 'autoMultilingualText',
  title: 'Texte long multilingue avec traduction automatique',
  type: 'object',
  components: {
    input: MultilingualTextInput,
  },
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
      
      const preview = fr || 'Texte multilingue';
      const shortPreview = preview.length > 50 ? `${preview.slice(0, 50)}...` : preview;
      
      return {
        title: shortPreview,
        subtitle: languages.length > 1 ? `Disponible en: ${languages.join(', ')}` : 'Français uniquement',
      };
    },
  },
});

export default autoMultilingualText;
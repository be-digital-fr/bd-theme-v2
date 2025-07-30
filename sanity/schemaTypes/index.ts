import { type SchemaTypeDefinition } from 'sanity';
import { autoMultilingualString, autoMultilingualText } from './locale';
import { settings } from './singletons';
//import homeWithAutoTranslate from './singletons/homeWithAutoTranslate';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents principaux
    settings, 
   // homeWithAutoTranslate,
    // Types avec traduction automatique
    autoMultilingualString,
    autoMultilingualText,
  ],
};

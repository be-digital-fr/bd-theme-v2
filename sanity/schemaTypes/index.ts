import { type SchemaTypeDefinition } from 'sanity';
import { autoMultilingualString, autoMultilingualText } from './locale';
import { settings, authSettings } from './singletons';
//import homeWithAutoTranslate from './singletons/homeWithAutoTranslate';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents principaux
    settings,
    authSettings,
   // homeWithAutoTranslate,
    // Types avec traduction automatique
    autoMultilingualString,
    autoMultilingualText,
  ],
};

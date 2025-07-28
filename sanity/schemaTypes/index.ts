import { type SchemaTypeDefinition } from 'sanity';
import home from './home';
import { settings } from './settings';
import { autoMultilingualString, autoMultilingualText } from './locale';
import { homeWithAutoTranslate } from './singletons';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents principaux
    settings,
    homeWithAutoTranslate,
    home,

    // Types avec traduction automatique
    autoMultilingualString,
    autoMultilingualText,
  ],
};

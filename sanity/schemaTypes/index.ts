import { type SchemaTypeDefinition } from 'sanity';
import home from './home';
import { autoMultilingualString, autoMultilingualText } from './locale';
import { homeWithAutoTranslate, settings, navigation } from './singletons';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents principaux
    settings,
    navigation,
    homeWithAutoTranslate,
    home,

    // Types avec traduction automatique
    autoMultilingualString,
    autoMultilingualText,
  ],
};

import { type SchemaTypeDefinition } from 'sanity';
import { autoMultilingualString, autoMultilingualText, multilingualString, multilingualText } from './locale';
import { 
  settings, 
  authSettings,
  authNotificationsTranslations,
  forgotPasswordTranslations,
  resetPasswordTranslations,
  signInTranslations,
  signUpTranslations
} from './singletons';
//import homeWithAutoTranslate from './singletons/homeWithAutoTranslate';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents principaux
    settings,
    authSettings,
    
    // Documents de traduction
    authNotificationsTranslations,
    forgotPasswordTranslations,
    resetPasswordTranslations,
    signInTranslations,
    signUpTranslations,
    
   // homeWithAutoTranslate,
    // Types avec traduction automatique
    autoMultilingualString,
    autoMultilingualText,
    // Types multilingues complets
    multilingualString,
    multilingualText,
  ],
};

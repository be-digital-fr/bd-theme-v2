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
import homeWithAutoTranslate from './singletons/homeWithAutoTranslate';

// Product related schemas
import product from './documents/product';
import category from './documents/category';
import ingredient from './documents/ingredient';
import productExtra from './documents/productExtra';

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
    
    // Page d'accueil
    homeWithAutoTranslate,
    
    // E-commerce documents
    product,
    category,
    ingredient,
    productExtra,
    
    // Types avec traduction automatique
    autoMultilingualString,
    autoMultilingualText,
    // Types multilingues complets
    multilingualString,
    multilingualText,
  ],
};

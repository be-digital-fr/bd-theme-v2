import { type SchemaTypeDefinition } from 'sanity'
import home from './home'
import exemple from './exemple'
import exempleMultilingue from './exempleMultilingue'
import adaptiveString from './adaptiveString'
import adaptiveText from './adaptiveText'
import multilingualString from './multilingualString'
import multilingualText from './multilingualText'
import test from './test'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents
    test,
    home,
    exemple,
    exempleMultilingue,
    
    // Types personnalisés adaptatifs
    adaptiveString,
    adaptiveText,
    multilingualString,
    multilingualText,
  ],
}

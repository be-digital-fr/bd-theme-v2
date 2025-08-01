import { defineField } from 'sanity';
import { TranslateIcon } from '@sanity/icons';
import { createSingleton } from '../../../lib/singletons';

export const signInTranslations = createSingleton({
  name: 'signInTranslations',
  title: 'Traductions - Page de Connexion',
  icon: TranslateIcon,
  fields: [
    // Titre et description de la page
    defineField({
      name: 'pageTitle',
      title: 'Titre de la page',
      type: 'multilingualString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'pageDescription',
      title: 'Description de la page',
      type: 'multilingualText',
    }),
    
    // Titre du formulaire
    defineField({
      name: 'formTitle',
      title: 'Titre du formulaire',
      type: 'multilingualString',
      validation: (rule) => rule.required(),
    }),
    
    // Champs du formulaire
    defineField({
      name: 'emailLabel',
      title: 'Label du champ email',
      type: 'multilingualString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'emailPlaceholder',
      title: 'Placeholder du champ email',
      type: 'multilingualString',
    }),
    defineField({
      name: 'passwordLabel',
      title: 'Label du champ mot de passe',
      type: 'multilingualString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'passwordPlaceholder',
      title: 'Placeholder du champ mot de passe',
      type: 'multilingualString',
    }),
    
    // Boutons et liens
    defineField({
      name: 'submitButton',
      title: 'Texte du bouton de soumission',
      type: 'multilingualString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'forgotPasswordLink',
      title: 'Texte du lien mot de passe oublié',
      type: 'multilingualString',
    }),
    defineField({
      name: 'signUpLink',
      title: 'Texte du lien vers inscription',
      type: 'multilingualString',
    }),
    defineField({
      name: 'signUpLinkText',
      title: 'Texte cliquable pour inscription',
      type: 'multilingualString',
    }),
    
    // Authentification sociale
    defineField({
      name: 'socialAuthTitle',
      title: 'Titre pour auth sociale',
      type: 'multilingualString',
    }),
    defineField({
      name: 'orDividerText',
      title: 'Texte du séparateur "ou"',
      type: 'multilingualString',
    }),
  ],
});
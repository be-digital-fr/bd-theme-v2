import { defineField } from 'sanity';
import { TranslateIcon } from '@sanity/icons';
import { createSingleton } from '../../../lib/singletons';

export const signUpTranslations = createSingleton({
  name: 'signUpTranslations',
  title: 'Traductions - Page d\'Inscription',
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
      name: 'nameLabel',
      title: 'Label du champ nom',
      type: 'multilingualString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'namePlaceholder',
      title: 'Placeholder du champ nom',
      type: 'multilingualString',
    }),
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
    defineField({
      name: 'confirmPasswordLabel',
      title: 'Label du champ confirmation mot de passe',
      type: 'multilingualString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'confirmPasswordPlaceholder',
      title: 'Placeholder du champ confirmation mot de passe',
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
      name: 'signInLink',
      title: 'Texte du lien vers connexion',
      type: 'multilingualString',
    }),
    defineField({
      name: 'signInLinkText',
      title: 'Texte cliquable pour connexion',
      type: 'multilingualString',
    }),
    
    // Messages de succès
    defineField({
      name: 'successMessage',
      title: 'Message de succès',
      type: 'multilingualString',
    }),
    defineField({
      name: 'successDescription',
      title: 'Description du succès',
      type: 'multilingualText',
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
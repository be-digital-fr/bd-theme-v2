import { defineField } from 'sanity';
import { TranslateIcon } from '@sanity/icons';
import { createSingleton } from '../../../lib/singletons';

export const forgotPasswordTranslations = createSingleton({
  name: 'forgotPasswordTranslations',
  title: 'Traductions - Mot de passe oublié',
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
    
    // Boutons et liens
    defineField({
      name: 'submitButton',
      title: 'Texte du bouton de soumission',
      type: 'multilingualString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'backToSignInLink',
      title: 'Texte du lien retour à la connexion',
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
  ],
});
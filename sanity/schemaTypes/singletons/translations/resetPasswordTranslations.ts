import { defineField } from 'sanity';
import { TranslateIcon } from '@sanity/icons';
import { createSingleton } from '../../../lib/singletons';

export const resetPasswordTranslations = createSingleton({
  name: 'resetPasswordTranslations',
  title: 'Traductions - Réinitialisation mot de passe',
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
      name: 'newPasswordLabel',
      title: 'Label du champ nouveau mot de passe',
      type: 'multilingualString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'newPasswordPlaceholder',
      title: 'Placeholder du champ nouveau mot de passe',
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
    
    // Messages d'erreur spécifiques
    defineField({
      name: 'tokenMissingTitle',
      title: 'Titre - Token manquant',
      type: 'multilingualString',
    }),
    defineField({
      name: 'tokenMissingDescription',
      title: 'Description - Token manquant',
      type: 'multilingualText',
    }),
    defineField({
      name: 'requestNewLinkText',
      title: 'Texte - Demander nouveau lien',
      type: 'multilingualString',
    }),
  ],
});
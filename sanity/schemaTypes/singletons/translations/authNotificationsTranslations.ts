import { defineField } from 'sanity';
import { BellIcon } from '@sanity/icons';
import { createSingleton } from '../../../lib/singletons';

export const authNotificationsTranslations = createSingleton({
  name: 'authNotificationsTranslations',
  title: 'Traductions - Messages de notification Auth',
  icon: BellIcon,
  fields: [
    // Messages de succès
    defineField({
      name: 'successTitle',
      title: 'Messages de succès',
      type: 'object',
      fields: [
        {
          name: 'signInSuccess',
          title: 'Connexion réussie',
          type: 'multilingualString',
        },
        {
          name: 'signUpSuccess',
          title: 'Inscription réussie',
          type: 'multilingualString',
        },
        {
          name: 'passwordResetEmailSent',
          title: 'Email de réinitialisation envoyé',
          type: 'multilingualString',
        },
        {
          name: 'passwordResetSuccess',
          title: 'Mot de passe réinitialisé',
          type: 'multilingualString',
        },
        {
          name: 'logoutSuccess',
          title: 'Déconnexion réussie',
          type: 'multilingualString',
        },
      ],
    }),
    
    // Messages de chargement
    defineField({
      name: 'loadingTitle',
      title: 'Messages de chargement',
      type: 'object',
      fields: [
        {
          name: 'signingIn',
          title: 'Connexion en cours',
          type: 'multilingualString',
        },
        {
          name: 'signingUp',
          title: 'Inscription en cours',
          type: 'multilingualString',
        },
        {
          name: 'sendingEmail',
          title: 'Envoi email en cours',
          type: 'multilingualString',
        },
        {
          name: 'resettingPassword',
          title: 'Réinitialisation en cours',
          type: 'multilingualString',
        },
        {
          name: 'signingOut',
          title: 'Déconnexion en cours',
          type: 'multilingualString',
        },
        {
          name: 'pleaseWait',
          title: 'Veuillez patienter',
          type: 'multilingualString',
        },
        {
          name: 'processing',
          title: 'Traitement en cours',
          type: 'multilingualString',
        },
      ],
    }),
    
    // Messages d'erreur
    defineField({
      name: 'errorTitle',
      title: 'Messages d\'erreur',
      type: 'object',
      fields: [
        {
          name: 'invalidEmail',
          title: 'Email invalide',
          type: 'multilingualString',
        },
        {
          name: 'emailRequired',
          title: 'Email requis',
          type: 'multilingualString',
        },
        {
          name: 'passwordRequired',
          title: 'Mot de passe requis',
          type: 'multilingualString',
        },
        {
          name: 'passwordTooShort',
          title: 'Mot de passe trop court',
          type: 'multilingualString',
        },
        {
          name: 'passwordMismatch',
          title: 'Mots de passe différents',
          type: 'multilingualString',
        },
        {
          name: 'nameRequired',
          title: 'Nom requis',
          type: 'multilingualString',
        },
        {
          name: 'nameTooShort',
          title: 'Nom trop court',
          type: 'multilingualString',
        },
        {
          name: 'emailAlreadyExists',
          title: 'Email déjà utilisé',
          type: 'multilingualString',
        },
        {
          name: 'invalidCredentials',
          title: 'Identifiants invalides',
          type: 'multilingualString',
        },
        {
          name: 'accountNotFound',
          title: 'Compte non trouvé',
          type: 'multilingualString',
        },
        {
          name: 'invalidToken',
          title: 'Token invalide',
          type: 'multilingualString',
        },
        {
          name: 'tokenExpired',
          title: 'Token expiré',
          type: 'multilingualString',
        },
        {
          name: 'generalError',
          title: 'Erreur générale',
          type: 'multilingualString',
        },
        {
          name: 'networkError',
          title: 'Erreur réseau',
          type: 'multilingualString',
        },
        {
          name: 'serverError',
          title: 'Erreur serveur',
          type: 'multilingualString',
        },
        {
          name: 'sessionExpired',
          title: 'Session expirée',
          type: 'multilingualString',
        },
        {
          name: 'unauthorized',
          title: 'Non autorisé',
          type: 'multilingualString',
        },
        {
          name: 'tooManyAttempts',
          title: 'Trop de tentatives',
          type: 'multilingualString',
        },
      ],
    }),
    
    // Messages informatifs
    defineField({
      name: 'infoTitle',
      title: 'Messages informatifs',
      type: 'object',
      fields: [
        {
          name: 'checkYourEmail',
          title: 'Vérifiez votre email',
          type: 'multilingualString',
        },
        {
          name: 'redirecting',
          title: 'Redirection en cours',
          type: 'multilingualString',
        },
        {
          name: 'emailVerificationRequired',
          title: 'Vérification email requise',
          type: 'multilingualString',
        },
        {
          name: 'accountCreated',
          title: 'Compte créé',
          type: 'multilingualString',
        },
        {
          name: 'welcomeBack',
          title: 'Bon retour',
          type: 'multilingualString',
        },
      ],
    }),
  ],
});
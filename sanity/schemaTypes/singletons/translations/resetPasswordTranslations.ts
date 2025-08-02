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
      type: 'autoMultilingualString',
      validation: (rule) => rule.required(),
      initialValue: {
        fr: 'Nouveau mot de passe',
        en: 'New Password',
        es: 'Nueva contraseña',
        de: 'Neues Passwort'
      }
    }),
    defineField({
      name: 'pageDescription',
      title: 'Description de la page',
      type: 'autoMultilingualText',
      initialValue: {
        fr: 'Créez un nouveau mot de passe sécurisé pour votre compte.',
        en: 'Create a new secure password for your account.',
        es: 'Crea una nueva contraseña segura para tu cuenta.',
        de: 'Erstellen Sie ein neues sicheres Passwort für Ihr Konto.'
      }
    }),
    
    // Titre du formulaire
    defineField({
      name: 'formTitle',
      title: 'Titre du formulaire',
      type: 'autoMultilingualString',
      validation: (rule) => rule.required(),
      initialValue: {
        fr: 'Réinitialiser le mot de passe',
        en: 'Reset Password',
        es: 'Restablecer contraseña',
        de: 'Passwort zurücksetzen'
      }
    }),
    
    // Champs du formulaire
    defineField({
      name: 'newPasswordLabel',
      title: 'Label du champ nouveau mot de passe',
      type: 'autoMultilingualString',
      validation: (rule) => rule.required(),
      initialValue: {
        fr: 'Nouveau mot de passe',
        en: 'New password',
        es: 'Nueva contraseña',
        de: 'Neues Passwort'
      }
    }),
    defineField({
      name: 'newPasswordPlaceholder',
      title: 'Placeholder du champ nouveau mot de passe',
      type: 'autoMultilingualString',
      initialValue: {
        fr: 'Entrez votre nouveau mot de passe',
        en: 'Enter your new password',
        es: 'Ingresa tu nueva contraseña',
        de: 'Geben Sie Ihr neues Passwort ein'
      }
    }),
    defineField({
      name: 'confirmPasswordLabel',
      title: 'Label du champ confirmation mot de passe',
      type: 'autoMultilingualString',
      validation: (rule) => rule.required(),
      initialValue: {
        fr: 'Confirmer le mot de passe',
        en: 'Confirm password',
        es: 'Confirmar contraseña',
        de: 'Passwort bestätigen'
      }
    }),
    defineField({
      name: 'confirmPasswordPlaceholder',
      title: 'Placeholder du champ confirmation mot de passe',
      type: 'autoMultilingualString',
      initialValue: {
        fr: 'Confirmez votre nouveau mot de passe',
        en: 'Confirm your new password',
        es: 'Confirma tu nueva contraseña',
        de: 'Bestätigen Sie Ihr neues Passwort'
      }
    }),
    
    // Boutons et liens
    defineField({
      name: 'submitButton',
      title: 'Texte du bouton de soumission',
      type: 'autoMultilingualString',
      validation: (rule) => rule.required(),
      initialValue: {
        fr: 'Mettre à jour le mot de passe',
        en: 'Update Password',
        es: 'Actualizar contraseña',
        de: 'Passwort aktualisieren'
      }
    }),
    defineField({
      name: 'backToSignInLink',
      title: 'Texte du lien retour à la connexion',
      type: 'autoMultilingualString',
      initialValue: {
        fr: 'Retour à la connexion',
        en: 'Back to Sign In',
        es: 'Volver al inicio de sesión',
        de: 'Zurück zur Anmeldung'
      }
    }),
    
    // Messages de succès
    defineField({
      name: 'successMessage',
      title: 'Message de succès',
      type: 'autoMultilingualString',
      initialValue: {
        fr: 'Mot de passe mis à jour !',
        en: 'Password updated!',
        es: '¡Contraseña actualizada!',
        de: 'Passwort aktualisiert!'
      }
    }),
    defineField({
      name: 'successDescription',
      title: 'Description du succès',
      type: 'autoMultilingualText',
      initialValue: {
        fr: 'Votre mot de passe a été mis à jour avec succès. Vous pouvez maintenant vous connecter.',
        en: 'Your password has been updated successfully. You can now sign in.',
        es: 'Tu contraseña ha sido actualizada exitosamente. Ahora puedes iniciar sesión.',
        de: 'Ihr Passwort wurde erfolgreich aktualisiert. Sie können sich jetzt anmelden.'
      }
    }),
    
    // Messages d'erreur spécifiques
    defineField({
      name: 'tokenMissingTitle',
      title: 'Titre - Token manquant',
      type: 'autoMultilingualString',
      initialValue: {
        fr: 'Lien invalide',
        en: 'Invalid Link',
        es: 'Enlace inválido',
        de: 'Ungültiger Link'
      }
    }),
    defineField({
      name: 'tokenMissingDescription',
      title: 'Description - Token manquant',
      type: 'autoMultilingualText',
      initialValue: {
        fr: 'Le lien de réinitialisation est invalide ou a expiré. Veuillez demander un nouveau lien.',
        en: 'The reset link is invalid or has expired. Please request a new link.',
        es: 'El enlace de restablecimiento es inválido o ha expirado. Por favor, solicita un nuevo enlace.',
        de: 'Der Reset-Link ist ungültig oder abgelaufen. Bitte fordern Sie einen neuen Link an.'
      }
    }),
    defineField({
      name: 'requestNewLinkText',
      title: 'Texte - Demander nouveau lien',
      type: 'autoMultilingualString',
      initialValue: {
        fr: 'Demander un nouveau lien',
        en: 'Request new link',
        es: 'Solicitar nuevo enlace',
        de: 'Neuen Link anfordern'
      }
    }),
  ],
});
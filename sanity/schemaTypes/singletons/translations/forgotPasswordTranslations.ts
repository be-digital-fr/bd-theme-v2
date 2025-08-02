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
      type: 'autoMultilingualString',
      validation: (rule) => rule.required(),
      initialValue: {
        fr: 'Mot de passe oublié',
        en: 'Forgot Password',
        es: 'Contraseña olvidada',
        de: 'Passwort vergessen'
      }
    }),
    defineField({
      name: 'pageDescription',
      title: 'Description de la page',
      type: 'autoMultilingualText',
      initialValue: {
        fr: 'Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.',
        en: 'Enter your email address to receive a reset link.',
        es: 'Ingresa tu dirección de correo para recibir un enlace de restablecimiento.',
        de: 'Geben Sie Ihre E-Mail-Adresse ein, um einen Reset-Link zu erhalten.'
      }
    }),
    
    // Titre et sous-titre principaux
    defineField({
      name: 'title',
      title: 'Titre principal',
      type: 'autoMultilingualString',
      validation: (rule) => rule.required(),
      initialValue: {
        fr: 'Mot de passe oublié',
        en: 'Forgot password',
        es: 'Contraseña olvidada',
        de: 'Passwort vergessen'
      }
    }),
    defineField({
      name: 'subtitle',
      title: 'Sous-titre',
      type: 'autoMultilingualString',
      initialValue: {
        fr: 'Nous vous enverrons un lien de réinitialisation',
        en: 'We\'ll send you a reset link',
        es: 'Te enviaremos un enlace de restablecimiento',
        de: 'Wir senden Ihnen einen Reset-Link'
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
      name: 'emailLabel',
      title: 'Label du champ email',
      type: 'autoMultilingualString',
      validation: (rule) => rule.required(),
      initialValue: {
        fr: 'Adresse e-mail',
        en: 'Email address',
        es: 'Dirección de correo electrónico',
        de: 'E-Mail-Adresse'
      }
    }),
    defineField({
      name: 'emailPlaceholder',
      title: 'Placeholder du champ email',
      type: 'autoMultilingualString',
      initialValue: {
        fr: 'votre@email.com',
        en: 'your@email.com',
        es: 'tu@email.com',
        de: 'ihre@email.com'
      }
    }),
    
    // Boutons et liens
    defineField({
      name: 'submitButton',
      title: 'Texte du bouton de soumission',
      type: 'autoMultilingualString',
      validation: (rule) => rule.required(),
      initialValue: {
        fr: 'Envoyer le lien',
        en: 'Send Reset Link',
        es: 'Enviar enlace',
        de: 'Link senden'
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
        fr: 'E-mail envoyé !',
        en: 'Email sent!',
        es: '¡Correo enviado!',
        de: 'E-Mail gesendet!'
      }
    }),
    defineField({
      name: 'successDescription',
      title: 'Description du succès',
      type: 'autoMultilingualText',
      initialValue: {
        fr: 'Vérifiez votre boîte e-mail et cliquez sur le lien pour réinitialiser votre mot de passe.',
        en: 'Check your email and click the link to reset your password.',
        es: 'Revisa tu correo y haz clic en el enlace para restablecer tu contraseña.',
        de: 'Überprüfen Sie Ihre E-Mail und klicken Sie auf den Link, um Ihr Passwort zurückzusetzen.'
      }
    }),
  ],
});
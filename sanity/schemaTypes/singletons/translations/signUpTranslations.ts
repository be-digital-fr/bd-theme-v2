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
      type: 'autoMultilingualString',
      validation: (rule) => rule.required(),
      initialValue: {
        fr: 'Créer un compte',
        en: 'Create Account',
        es: 'Crear cuenta',
        de: 'Konto erstellen'
      }
    }),
    defineField({
      name: 'pageDescription',
      title: 'Description de la page',
      type: 'autoMultilingualText',
      initialValue: {
        fr: 'Créez votre compte pour profiter de toutes nos fonctionnalités.',
        en: 'Create your account to enjoy all our features.',
        es: 'Crea tu cuenta para disfrutar de todas nuestras funciones.',
        de: 'Erstellen Sie Ihr Konto, um alle unsere Funktionen zu nutzen.'
      }
    }),
    
    // Titre et sous-titre principaux
    defineField({
      name: 'title',
      title: 'Titre principal',
      type: 'autoMultilingualString',
      validation: (rule) => rule.required(),
      initialValue: {
        fr: 'Créer un compte',
        en: 'Create an account',
        es: 'Crear una cuenta',
        de: 'Konto erstellen'
      }
    }),
    defineField({
      name: 'subtitle',
      title: 'Sous-titre',
      type: 'autoMultilingualString',
      initialValue: {
        fr: 'Rejoignez-nous dès maintenant',
        en: 'Join us today',
        es: 'Únete a nosotros hoy',
        de: 'Treten Sie uns heute bei'
      }
    }),
    
    // Titre du formulaire
    defineField({
      name: 'formTitle',
      title: 'Titre du formulaire',
      type: 'autoMultilingualString',
      validation: (rule) => rule.required(),
      initialValue: {
        fr: 'Inscription',
        en: 'Sign Up',
        es: 'Registrarse',
        de: 'Registrierung'
      }
    }),
    
    // Champs du formulaire
    defineField({
      name: 'nameLabel',
      title: 'Label du champ nom',
      type: 'autoMultilingualString',
      validation: (rule) => rule.required(),
      initialValue: {
        fr: 'Nom complet',
        en: 'Full name',
        es: 'Nombre completo',
        de: 'Vollständiger Name'
      }
    }),
    defineField({
      name: 'namePlaceholder',
      title: 'Placeholder du champ nom',
      type: 'autoMultilingualString',
      initialValue: {
        fr: 'Entrez votre nom complet',
        en: 'Enter your full name',
        es: 'Ingresa tu nombre completo',
        de: 'Geben Sie Ihren vollständigen Namen ein'
      }
    }),
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
    defineField({
      name: 'passwordLabel',
      title: 'Label du champ mot de passe',
      type: 'autoMultilingualString',
      validation: (rule) => rule.required(),
      initialValue: {
        fr: 'Mot de passe',
        en: 'Password',
        es: 'Contraseña',
        de: 'Passwort'
      }
    }),
    defineField({
      name: 'passwordPlaceholder',
      title: 'Placeholder du champ mot de passe',
      type: 'autoMultilingualString',
      initialValue: {
        fr: 'Créez un mot de passe sécurisé',
        en: 'Create a secure password',
        es: 'Crea una contraseña segura',
        de: 'Erstellen Sie ein sicheres Passwort'
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
        fr: 'Confirmez votre mot de passe',
        en: 'Confirm your password',
        es: 'Confirma tu contraseña',
        de: 'Bestätigen Sie Ihr Passwort'
      }
    }),
    
    // Boutons et liens
    defineField({
      name: 'submitButton',
      title: 'Texte du bouton de soumission',
      type: 'autoMultilingualString',
      validation: (rule) => rule.required(),
      initialValue: {
        fr: 'Créer le compte',
        en: 'Create Account',
        es: 'Crear cuenta',
        de: 'Konto erstellen'
      }
    }),
    defineField({
      name: 'signInLink',
      title: 'Texte du lien vers connexion',
      type: 'autoMultilingualString',
      initialValue: {
        fr: 'Vous avez déjà un compte ?',
        en: 'Already have an account?',
        es: '¿Ya tienes una cuenta?',
        de: 'Haben Sie bereits ein Konto?'
      }
    }),
    defineField({
      name: 'signInLinkText',
      title: 'Texte cliquable pour connexion',
      type: 'autoMultilingualString',
      initialValue: {
        fr: 'Se connecter',
        en: 'Sign in',
        es: 'Iniciar sesión',
        de: 'Anmelden'
      }
    }),
    
    // Messages de succès
    defineField({
      name: 'successMessage',
      title: 'Message de succès',
      type: 'autoMultilingualString',
      initialValue: {
        fr: 'Compte créé avec succès !',
        en: 'Account created successfully!',
        es: '¡Cuenta creada exitosamente!',
        de: 'Konto erfolgreich erstellt!'
      }
    }),
    defineField({
      name: 'successDescription',
      title: 'Description du succès',
      type: 'autoMultilingualText',
      initialValue: {
        fr: 'Votre compte a été créé. Vous pouvez maintenant vous connecter.',
        en: 'Your account has been created. You can now sign in.',
        es: 'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.',
        de: 'Ihr Konto wurde erstellt. Sie können sich jetzt anmelden.'
      }
    }),
    
    // Authentification sociale
    defineField({
      name: 'socialAuthTitle',
      title: 'Titre pour auth sociale',
      type: 'autoMultilingualString',
      initialValue: {
        fr: 'Ou inscrivez-vous avec',
        en: 'Or sign up with',
        es: 'O regístrate con',
        de: 'Oder registrieren Sie sich mit'
      }
    }),
    defineField({
      name: 'orDividerText',
      title: 'Texte du séparateur "ou"',
      type: 'autoMultilingualString',
      initialValue: {
        fr: 'ou',
        en: 'or',
        es: 'o',
        de: 'oder'
      }
    }),
  ],
});
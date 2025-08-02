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
      type: 'autoMultilingualString',
      validation: (rule) => rule.required(),
      initialValue: {
        fr: 'Se connecter',
        en: 'Sign In',
        es: 'Iniciar sesión',
        de: 'Anmelden'
      }
    }),
    defineField({
      name: 'pageDescription',
      title: 'Description de la page',
      type: 'autoMultilingualText',
      initialValue: {
        fr: 'Connectez-vous à votre compte pour accéder à vos commandes et préférences.',
        en: 'Sign in to your account to access your orders and preferences.',
        es: 'Inicia sesión en tu cuenta para acceder a tus pedidos y preferencias.',
        de: 'Melden Sie sich in Ihrem Konto an, um auf Ihre Bestellungen und Einstellungen zuzugreifen.'
      }
    }),
    
    // Titre et sous-titre principaux
    defineField({
      name: 'title',
      title: 'Titre principal',
      type: 'autoMultilingualString',
      validation: (rule) => rule.required(),
      initialValue: {
        fr: 'Bienvenue !',
        en: 'Welcome back!',
        es: '¡Bienvenido!',
        de: 'Willkommen zurück!'
      }
    }),
    defineField({
      name: 'subtitle',
      title: 'Sous-titre',
      type: 'autoMultilingualString',
      initialValue: {
        fr: 'Connectez-vous pour continuer',
        en: 'Sign in to continue',
        es: 'Inicia sesión para continuar',
        de: 'Melden Sie sich an, um fortzufahren'
      }
    }),
    
    // Titre du formulaire
    defineField({
      name: 'formTitle',
      title: 'Titre du formulaire',
      type: 'autoMultilingualString',
      validation: (rule) => rule.required(),
      initialValue: {
        fr: 'Connexion',
        en: 'Sign In',
        es: 'Iniciar sesión',
        de: 'Anmeldung'
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
        fr: 'Entrez votre mot de passe',
        en: 'Enter your password',
        es: 'Ingresa tu contraseña',
        de: 'Geben Sie Ihr Passwort ein'
      }
    }),
    
    // Boutons et liens
    defineField({
      name: 'submitButton',
      title: 'Texte du bouton de soumission',
      type: 'autoMultilingualString',
      validation: (rule) => rule.required(),
      initialValue: {
        fr: 'Se connecter',
        en: 'Sign In',
        es: 'Iniciar sesión',
        de: 'Anmelden'
      }
    }),
    defineField({
      name: 'forgotPasswordLink',
      title: 'Texte du lien mot de passe oublié',
      type: 'autoMultilingualString',
      initialValue: {
        fr: 'Mot de passe oublié ?',
        en: 'Forgot password?',
        es: '¿Olvidaste tu contraseña?',
        de: 'Passwort vergessen?'
      }
    }),
    defineField({
      name: 'signUpLink',
      title: 'Texte du lien vers inscription',
      type: 'autoMultilingualString',
      initialValue: {
        fr: 'Pas encore de compte ?',
        en: 'Don\'t have an account?',
        es: '¿No tienes una cuenta?',
        de: 'Noch kein Konto?'
      }
    }),
    defineField({
      name: 'signUpLinkText',
      title: 'Texte cliquable pour inscription',
      type: 'autoMultilingualString',
      initialValue: {
        fr: 'Créer un compte',
        en: 'Create account',
        es: 'Crear cuenta',
        de: 'Konto erstellen'
      }
    }),
    
    // Authentification sociale
    defineField({
      name: 'socialAuthTitle',
      title: 'Titre pour auth sociale',
      type: 'autoMultilingualString',
      initialValue: {
        fr: 'Ou connectez-vous avec',
        en: 'Or sign in with',
        es: 'O inicia sesión con',
        de: 'Oder melden Sie sich an mit'
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
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
          type: 'autoMultilingualString',
          initialValue: {
            fr: 'Connexion réussie ! Bienvenue.',
            en: 'Successfully signed in! Welcome.',
            es: '¡Inicio de sesión exitoso! Bienvenido.',
            de: 'Erfolgreich angemeldet! Willkommen.'
          }
        },
        {
          name: 'signUpSuccess',
          title: 'Inscription réussie',
          type: 'autoMultilingualString',
          initialValue: {
            fr: 'Compte créé avec succès !',
            en: 'Account created successfully!',
            es: '¡Cuenta creada exitosamente!',
            de: 'Konto erfolgreich erstellt!'
          }
        },
        {
          name: 'passwordResetEmailSent',
          title: 'Email de réinitialisation envoyé',
          type: 'autoMultilingualString',
          initialValue: {
            fr: 'Email de réinitialisation envoyé. Vérifiez votre boîte de réception.',
            en: 'Password reset email sent. Check your inbox.',
            es: 'Correo de restablecimiento enviado. Revisa tu bandeja de entrada.',
            de: 'Passwort-Reset-E-Mail gesendet. Überprüfen Sie Ihren Posteingang.'
          }
        },
        {
          name: 'passwordResetSuccess',
          title: 'Mot de passe réinitialisé',
          type: 'autoMultilingualString',
          initialValue: {
            fr: 'Mot de passe réinitialisé avec succès !',
            en: 'Password reset successfully!',
            es: '¡Contraseña restablecida exitosamente!',
            de: 'Passwort erfolgreich zurückgesetzt!'
          }
        },
        {
          name: 'logoutSuccess',
          title: 'Déconnexion réussie',
          type: 'autoMultilingualString',
          initialValue: {
            fr: 'Déconnexion réussie. À bientôt !',
            en: 'Successfully signed out. See you soon!',
            es: 'Desconexión exitosa. ¡Hasta pronto!',
            de: 'Erfolgreich abgemeldet. Bis bald!'
          }
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
          type: 'autoMultilingualString',
          initialValue: {
            fr: 'Connexion en cours...',
            en: 'Signing in...',
            es: 'Iniciando sesión...',
            de: 'Anmeldung läuft...'
          }
        },
        {
          name: 'signingUp',
          title: 'Inscription en cours',
          type: 'autoMultilingualString',
          initialValue: {
            fr: 'Création du compte en cours...',
            en: 'Creating account...',
            es: 'Creando cuenta...',
            de: 'Konto wird erstellt...'
          }
        },
        {
          name: 'sendingEmail',
          title: 'Envoi email en cours',
          type: 'autoMultilingualString',
          initialValue: {
            fr: 'Envoi de l\'email en cours...',
            en: 'Sending email...',
            es: 'Enviando correo...',
            de: 'E-Mail wird gesendet...'
          }
        },
        {
          name: 'resettingPassword',
          title: 'Réinitialisation en cours',
          type: 'autoMultilingualString',
          initialValue: {
            fr: 'Réinitialisation du mot de passe...',
            en: 'Resetting password...',
            es: 'Restableciendo contraseña...',
            de: 'Passwort wird zurückgesetzt...'
          }
        },
        {
          name: 'signingOut',
          title: 'Déconnexion en cours',
          type: 'autoMultilingualString',
          initialValue: {
            fr: 'Déconnexion en cours...',
            en: 'Signing out...',
            es: 'Cerrando sesión...',
            de: 'Abmeldung läuft...'
          }
        },
        {
          name: 'pleaseWait',
          title: 'Veuillez patienter',
          type: 'autoMultilingualString',
          initialValue: {
            fr: 'Veuillez patienter...',
            en: 'Please wait...',
            es: 'Por favor espere...',
            de: 'Bitte warten...'
          }
        },
        {
          name: 'processing',
          title: 'Traitement en cours',
          type: 'autoMultilingualString',
          initialValue: {
            fr: 'Traitement en cours...',
            en: 'Processing...',
            es: 'Procesando...',
            de: 'Wird verarbeitet...'
          }
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
          type: 'autoMultilingualString',
          initialValue: {
            fr: 'Adresse e-mail invalide.',
            en: 'Invalid email address.',
            es: 'Dirección de correo electrónico inválida.',
            de: 'Ungültige E-Mail-Adresse.'
          }
        },
        {
          name: 'emailRequired',
          title: 'Email requis',
          type: 'autoMultilingualString',
          initialValue: {
            fr: 'L\'adresse e-mail est requise.',
            en: 'Email address is required.',
            es: 'La dirección de correo electrónico es obligatoria.',
            de: 'E-Mail-Adresse ist erforderlich.'
          }
        },
        {
          name: 'passwordRequired',
          title: 'Mot de passe requis',
          type: 'autoMultilingualString',
          initialValue: {
            fr: 'Le mot de passe est requis.',
            en: 'Password is required.',
            es: 'La contraseña es obligatoria.',
            de: 'Passwort ist erforderlich.'
          }
        },
        {
          name: 'passwordTooShort',
          title: 'Mot de passe trop court',
          type: 'autoMultilingualString',
          initialValue: {
            fr: 'Le mot de passe doit contenir au moins 8 caractères.',
            en: 'Password must be at least 8 characters long.',
            es: 'La contraseña debe tener al menos 8 caracteres.',
            de: 'Das Passwort muss mindestens 8 Zeichen lang sein.'
          }
        },
        {
          name: 'passwordMismatch',
          title: 'Mots de passe différents',
          type: 'autoMultilingualString',
          initialValue: {
            fr: 'Les mots de passe ne correspondent pas.',
            en: 'Passwords do not match.',
            es: 'Las contraseñas no coinciden.',
            de: 'Die Passwörter stimmen nicht überein.'
          }
        },
        {
          name: 'nameRequired',
          title: 'Nom requis',
          type: 'autoMultilingualString',
          initialValue: {
            fr: 'Le nom est requis.',
            en: 'Name is required.',
            es: 'El nombre es obligatorio.',
            de: 'Name ist erforderlich.'
          }
        },
        {
          name: 'nameTooShort',
          title: 'Nom trop court',
          type: 'autoMultilingualString',
          initialValue: {
            fr: 'Le nom doit contenir au moins 2 caractères.',
            en: 'Name must be at least 2 characters long.',
            es: 'El nombre debe tener al menos 2 caracteres.',
            de: 'Name muss mindestens 2 Zeichen lang sein.'
          }
        },
        {
          name: 'emailAlreadyExists',
          title: 'Email déjà utilisé',
          type: 'autoMultilingualString',
          initialValue: {
            fr: 'Cette adresse e-mail est déjà utilisée.',
            en: 'This email address is already in use.',
            es: 'Esta dirección de correo electrónico ya está en uso.',
            de: 'Diese E-Mail-Adresse wird bereits verwendet.'
          }
        },
        {
          name: 'invalidCredentials',
          title: 'Identifiants invalides',
          type: 'autoMultilingualString',
          initialValue: {
            fr: 'Identifiants invalides. Vérifiez votre email et mot de passe.',
            en: 'Invalid credentials. Please check your email and password.',
            es: 'Credenciales inválidas. Verifica tu correo y contraseña.',
            de: 'Ungültige Anmeldedaten. Überprüfen Sie E-Mail und Passwort.'
          }
        },
        {
          name: 'accountNotFound',
          title: 'Compte non trouvé',
          type: 'autoMultilingualString',
          initialValue: {
            fr: 'Aucun compte trouvé avec cette adresse e-mail.',
            en: 'No account found with this email address.',
            es: 'No se encontró ninguna cuenta con esta dirección de correo.',
            de: 'Kein Konto mit dieser E-Mail-Adresse gefunden.'
          }
        },
        {
          name: 'invalidToken',
          title: 'Token invalide',
          type: 'autoMultilingualString',
          initialValue: {
            fr: 'Le lien de vérification est invalide.',
            en: 'The verification link is invalid.',
            es: 'El enlace de verificación es inválido.',
            de: 'Der Verifizierungslink ist ungültig.'
          }
        },
        {
          name: 'tokenExpired',
          title: 'Token expiré',
          type: 'autoMultilingualString',
          initialValue: {
            fr: 'Le lien de vérification a expiré.',
            en: 'The verification link has expired.',
            es: 'El enlace de verificación ha expirado.',
            de: 'Der Verifizierungslink ist abgelaufen.'
          }
        },
        {
          name: 'generalError',
          title: 'Erreur générale',
          type: 'autoMultilingualString',
          initialValue: {
            fr: 'Une erreur est survenue. Veuillez réessayer.',
            en: 'An error occurred. Please try again.',
            es: 'Ocurrió un error. Por favor, inténtalo de nuevo.',
            de: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'
          }
        },
        {
          name: 'networkError',
          title: 'Erreur réseau',
          type: 'autoMultilingualString',
          initialValue: {
            fr: 'Erreur de connexion réseau. Vérifiez votre connexion internet.',
            en: 'Network connection error. Please check your internet connection.',
            es: 'Error de conexión de red. Verifica tu conexión a internet.',
            de: 'Netzwerkverbindungsfehler. Überprüfen Sie Ihre Internetverbindung.'
          }
        },
        {
          name: 'serverError',
          title: 'Erreur serveur',
          type: 'autoMultilingualString',
          initialValue: {
            fr: 'Erreur du serveur. Veuillez réessayer plus tard.',
            en: 'Server error. Please try again later.',
            es: 'Error del servidor. Por favor, inténtalo más tarde.',
            de: 'Serverfehler. Bitte versuchen Sie es später erneut.'
          }
        },
        {
          name: 'sessionExpired',
          title: 'Session expirée',
          type: 'autoMultilingualString',
          initialValue: {
            fr: 'Votre session a expiré. Veuillez vous reconnecter.',
            en: 'Your session has expired. Please sign in again.',
            es: 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.',
            de: 'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.'
          }
        },
        {
          name: 'unauthorized',
          title: 'Non autorisé',
          type: 'autoMultilingualString',
          initialValue: {
            fr: 'Accès non autorisé.',
            en: 'Unauthorized access.',
            es: 'Acceso no autorizado.',
            de: 'Unbefugter Zugriff.'
          }
        },
        {
          name: 'tooManyAttempts',
          title: 'Trop de tentatives',
          type: 'autoMultilingualString',
          initialValue: {
            fr: 'Trop de tentatives. Veuillez attendre avant de réessayer.',
            en: 'Too many attempts. Please wait before trying again.',
            es: 'Demasiados intentos. Por favor, espera antes de intentar de nuevo.',
            de: 'Zu viele Versuche. Bitte warten Sie, bevor Sie es erneut versuchen.'
          }
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
          type: 'autoMultilingualString',
          initialValue: {
            fr: 'Vérifiez votre boîte e-mail pour les instructions.',
            en: 'Check your email for instructions.',
            es: 'Revisa tu correo electrónico para las instrucciones.',
            de: 'Überprüfen Sie Ihre E-Mail für Anweisungen.'
          }
        },
        {
          name: 'redirecting',
          title: 'Redirection en cours',
          type: 'autoMultilingualString',
          initialValue: {
            fr: 'Redirection en cours...',
            en: 'Redirecting...',
            es: 'Redirigiendo...',
            de: 'Weiterleitung...'
          }
        },
        {
          name: 'emailVerificationRequired',
          title: 'Vérification email requise',
          type: 'autoMultilingualString',
          initialValue: {
            fr: 'Veuillez vérifier votre adresse e-mail avant de continuer.',
            en: 'Please verify your email address before continuing.',
            es: 'Por favor, verifica tu dirección de correo antes de continuar.',
            de: 'Bitte verifizieren Sie Ihre E-Mail-Adresse, bevor Sie fortfahren.'
          }
        },
        {
          name: 'accountCreated',
          title: 'Compte créé',
          type: 'autoMultilingualString',
          initialValue: {
            fr: 'Votre compte a été créé avec succès.',
            en: 'Your account has been created successfully.',
            es: 'Tu cuenta ha sido creada exitosamente.',
            de: 'Ihr Konto wurde erfolgreich erstellt.'
          }
        },
        {
          name: 'welcomeBack',
          title: 'Bon retour',
          type: 'autoMultilingualString',
          initialValue: {
            fr: 'Bon retour parmi nous !',
            en: 'Welcome back!',
            es: '¡Bienvenido de nuevo!',
            de: 'Willkommen zurück!'
          }
        },
      ],
    }),
  ],
});
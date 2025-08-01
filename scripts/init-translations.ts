#!/usr/bin/env tsx

/**
 * Script pour initialiser toutes les traductions d'authentification dans Sanity
 * 
 * Ce script crée les documents de traduction avec les valeurs par défaut
 * pour toutes les pages d'authentification et les messages de notification.
 */

import { client } from '../sanity/lib/client';

// Traductions par défaut pour la page de connexion
const defaultSignInTranslations = {
  _type: 'signInTranslations',
  _id: 'signInTranslations',
  title: 'Traductions de la page de connexion',
  
  pageTitle: {
    fr: 'Connexion',
    en: 'Sign In',
    es: 'Iniciar Sesión',
    de: 'Anmelden',
  },
  pageDescription: {
    fr: 'Connectez-vous à votre compte pour accéder à votre espace personnel',
    en: 'Sign in to your account to access your personal space',
    es: 'Inicia sesión en tu cuenta para acceder a tu espacio personal',
    de: 'Melden Sie sich in Ihrem Konto an, um auf Ihren persönlichen Bereich zuzugreifen',
  },
  formTitle: {
    fr: 'Se connecter',
    en: 'Sign In',
    es: 'Iniciar Sesión',
    de: 'Anmelden',
  },
  emailLabel: {
    fr: 'Adresse email',
    en: 'Email address',
    es: 'Dirección de correo',
    de: 'E-Mail-Adresse',
  },
  emailPlaceholder: {
    fr: 'votre@email.com',
    en: 'your@email.com',
    es: 'tu@email.com',
    de: 'ihre@email.com',
  },
  passwordLabel: {
    fr: 'Mot de passe',
    en: 'Password',
    es: 'Contraseña',
    de: 'Passwort',
  },
  passwordPlaceholder: {
    fr: '••••••••',
    en: '••••••••',
    es: '••••••••',
    de: '••••••••',
  },
  submitButton: {
    fr: 'Se connecter',
    en: 'Sign In',
    es: 'Iniciar Sesión',
    de: 'Anmelden',
  },
  forgotPasswordLink: {
    fr: 'Mot de passe oublié ?',
    en: 'Forgot password?',
    es: '¿Olvidaste tu contraseña?',
    de: 'Passwort vergessen?',
  },
  signUpLink: {
    fr: 'Pas encore de compte ?',
    en: 'Don\'t have an account?',
    es: '¿No tienes una cuenta?',
    de: 'Noch kein Konto?',
  },
  signUpLinkText: {
    fr: 'S\'inscrire',
    en: 'Sign up',
    es: 'Registrarse',
    de: 'Registrieren',
  },
  socialAuthTitle: {
    fr: 'Ou continuer avec',
    en: 'Or continue with',
    es: 'O continúa con',
    de: 'Oder fortfahren mit',
  },
  orDividerText: {
    fr: 'ou',
    en: 'or',
    es: 'o',
    de: 'oder',
  },
};

// Traductions par défaut pour la page d'inscription
const defaultSignUpTranslations = {
  _type: 'signUpTranslations',
  _id: 'signUpTranslations',
  title: 'Traductions de la page d\'inscription',
  
  pageTitle: {
    fr: 'Inscription',
    en: 'Sign Up',
    es: 'Registro',
    de: 'Registrierung',
  },
  pageDescription: {
    fr: 'Créez votre compte pour commencer votre expérience',
    en: 'Create your account to start your experience',
    es: 'Crea tu cuenta para comenzar tu experiencia',
    de: 'Erstellen Sie Ihr Konto, um Ihre Erfahrung zu beginnen',
  },
  formTitle: {
    fr: 'Créer un compte',
    en: 'Create an account',
    es: 'Crear una cuenta',
    de: 'Konto erstellen',
  },
  nameLabel: {
    fr: 'Nom complet',
    en: 'Full name',
    es: 'Nombre completo',
    de: 'Vollständiger Name',
  },
  namePlaceholder: {
    fr: 'Jean Dupont',
    en: 'John Doe',
    es: 'Juan Pérez',
    de: 'Max Mustermann',
  },
  emailLabel: {
    fr: 'Adresse email',
    en: 'Email address',
    es: 'Dirección de correo',
    de: 'E-Mail-Adresse',
  },
  emailPlaceholder: {
    fr: 'votre@email.com',
    en: 'your@email.com',
    es: 'tu@email.com',
    de: 'ihre@email.com',
  },
  passwordLabel: {
    fr: 'Mot de passe',
    en: 'Password',
    es: 'Contraseña',
    de: 'Passwort',
  },
  passwordPlaceholder: {
    fr: '••••••••',
    en: '••••••••',
    es: '••••••••',
    de: '••••••••',
  },
  confirmPasswordLabel: {
    fr: 'Confirmer le mot de passe',
    en: 'Confirm password',
    es: 'Confirmar contraseña',
    de: 'Passwort bestätigen',
  },
  confirmPasswordPlaceholder: {
    fr: '••••••••',
    en: '••••••••',
    es: '••••••••',
    de: '••••••••',
  },
  submitButton: {
    fr: 'S\'inscrire',
    en: 'Sign up',
    es: 'Registrarse',
    de: 'Registrieren',
  },
  signInLink: {
    fr: 'Déjà un compte ?',
    en: 'Already have an account?',
    es: '¿Ya tienes una cuenta?',
    de: 'Haben Sie bereits ein Konto?',
  },
  signInLinkText: {
    fr: 'Se connecter',
    en: 'Sign in',
    es: 'Iniciar sesión',
    de: 'Anmelden',
  },
  successMessage: {
    fr: 'Inscription réussie !',
    en: 'Registration successful!',
    es: '¡Registro exitoso!',
    de: 'Registrierung erfolgreich!',
  },
  successDescription: {
    fr: 'Votre compte a été créé avec succès. Redirection en cours...',
    en: 'Your account has been created successfully. Redirecting...',
    es: 'Tu cuenta ha sido creada exitosamente. Redirigiendo...',
    de: 'Ihr Konto wurde erfolgreich erstellt. Weiterleitung...',
  },
  socialAuthTitle: {
    fr: 'Ou continuer avec',
    en: 'Or continue with',
    es: 'O continúa con',
    de: 'Oder fortfahren mit',
  },
  orDividerText: {
    fr: 'ou',
    en: 'or',
    es: 'o',
    de: 'oder',
  },
};

// Traductions par défaut pour la page mot de passe oublié
const defaultForgotPasswordTranslations = {
  _type: 'forgotPasswordTranslations',
  _id: 'forgotPasswordTranslations',
  title: 'Traductions de la page mot de passe oublié',
  
  pageTitle: {
    fr: 'Mot de passe oublié',
    en: 'Forgot Password',
    es: 'Contraseña Olvidada',
    de: 'Passwort Vergessen',
  },
  pageDescription: {
    fr: 'Saisissez votre adresse email pour recevoir un lien de réinitialisation',
    en: 'Enter your email address to receive a reset link',
    es: 'Ingresa tu dirección de correo para recibir un enlace de restablecimiento',
    de: 'Geben Sie Ihre E-Mail-Adresse ein, um einen Reset-Link zu erhalten',
  },
  formTitle: {
    fr: 'Réinitialiser le mot de passe',
    en: 'Reset password',
    es: 'Restablecer contraseña',
    de: 'Passwort zurücksetzen',
  },
  emailLabel: {
    fr: 'Adresse email',
    en: 'Email address',
    es: 'Dirección de correo',
    de: 'E-Mail-Adresse',
  },
  emailPlaceholder: {
    fr: 'votre@email.com',
    en: 'your@email.com',
    es: 'tu@email.com',
    de: 'ihre@email.com',
  },
  submitButton: {
    fr: 'Envoyer le lien',
    en: 'Send link',
    es: 'Enviar enlace',
    de: 'Link senden',
  },
  backToSignInLink: {
    fr: 'Retour à la connexion',
    en: 'Back to sign in',
    es: 'Volver al inicio de sesión',
    de: 'Zurück zur Anmeldung',
  },
  successMessage: {
    fr: 'Email envoyé !',
    en: 'Email sent!',
    es: '¡Correo enviado!',
    de: 'E-Mail gesendet!',
  },
  successDescription: {
    fr: 'Vérifiez votre boîte mail pour le lien de réinitialisation',
    en: 'Check your email for the reset link',
    es: 'Revisa tu correo para el enlace de restablecimiento',
    de: 'Überprüfen Sie Ihre E-Mail für den Reset-Link',
  },
};

// Traductions par défaut pour la page de réinitialisation
const defaultResetPasswordTranslations = {
  _type: 'resetPasswordTranslations',
  _id: 'resetPasswordTranslations',
  title: 'Traductions de la page de réinitialisation',
  
  pageTitle: {
    fr: 'Nouveau mot de passe',
    en: 'New Password',
    es: 'Nueva Contraseña',
    de: 'Neues Passwort',
  },
  pageDescription: {
    fr: 'Créez un nouveau mot de passe sécurisé pour votre compte',
    en: 'Create a new secure password for your account',
    es: 'Crea una nueva contraseña segura para tu cuenta',
    de: 'Erstellen Sie ein neues sicheres Passwort für Ihr Konto',
  },
  formTitle: {
    fr: 'Définir un nouveau mot de passe',
    en: 'Set new password',
    es: 'Establecer nueva contraseña',
    de: 'Neues Passwort festlegen',
  },
  newPasswordLabel: {
    fr: 'Nouveau mot de passe',
    en: 'New password',
    es: 'Nueva contraseña',
    de: 'Neues Passwort',
  },
  newPasswordPlaceholder: {
    fr: '••••••••',
    en: '••••••••',
    es: '••••••••',
    de: '••••••••',
  },
  confirmPasswordLabel: {
    fr: 'Confirmer le mot de passe',
    en: 'Confirm password',
    es: 'Confirmar contraseña',
    de: 'Passwort bestätigen',
  },
  confirmPasswordPlaceholder: {
    fr: '••••••••',
    en: '••••••••',
    es: '••••••••',
    de: '••••••••',
  },
  submitButton: {
    fr: 'Mettre à jour',
    en: 'Update password',
    es: 'Actualizar contraseña',
    de: 'Passwort aktualisieren',
  },
  backToSignInLink: {
    fr: 'Retour à la connexion',
    en: 'Back to sign in',
    es: 'Volver al inicio de sesión',
    de: 'Zurück zur Anmeldung',
  },
  successMessage: {
    fr: 'Mot de passe mis à jour !',
    en: 'Password updated!',
    es: '¡Contraseña actualizada!',
    de: 'Passwort aktualisiert!',
  },
  successDescription: {
    fr: 'Votre mot de passe a été mis à jour avec succès',
    en: 'Your password has been updated successfully',
    es: 'Tu contraseña ha sido actualizada exitosamente',
    de: 'Ihr Passwort wurde erfolgreich aktualisiert',
  },
  tokenMissingTitle: {
    fr: 'Token manquant',
    en: 'Token missing',
    es: 'Token faltante',
    de: 'Token fehlt',
  },
  tokenMissingDescription: {
    fr: 'Le lien de réinitialisation est invalide ou a expiré.',
    en: 'The reset link is invalid or has expired.',
    es: 'El enlace de restablecimiento es inválido o ha expirado.',
    de: 'Der Reset-Link ist ungültig oder abgelaufen.',
  },
  requestNewLinkText: {
    fr: 'Demander un nouveau lien',
    en: 'Request new link',
    es: 'Solicitar nuevo enlace',
    de: 'Neuen Link anfordern',
  },
};

// Messages de notification par défaut
const defaultAuthNotifications = {
  _type: 'authNotificationsTranslations',
  _id: 'authNotificationsTranslations',
  title: 'Messages de notification d\'authentification',
  
  successTitle: {
    signInSuccess: {
      fr: 'Connexion réussie !',
      en: 'Successfully signed in!',
      es: '¡Inicio de sesión exitoso!',
      de: 'Erfolgreich angemeldet!',
    },
    signUpSuccess: {
      fr: 'Inscription réussie !',
      en: 'Registration successful!',
      es: '¡Registro exitoso!',
      de: 'Registrierung erfolgreich!',
    },
    passwordResetEmailSent: {
      fr: 'Email de réinitialisation envoyé !',
      en: 'Password reset email sent!',
      es: '¡Email de restablecimiento enviado!',
      de: 'Passwort-Reset-E-Mail gesendet!',
    },
    passwordResetSuccess: {
      fr: 'Mot de passe réinitialisé !',
      en: 'Password successfully reset!',
      es: '¡Contraseña restablecida!',
      de: 'Passwort erfolgreich zurückgesetzt!',
    },
    logoutSuccess: {
      fr: 'Déconnexion réussie',
      en: 'Successfully logged out',
      es: 'Cierre de sesión exitoso',
      de: 'Erfolgreich abgemeldet',
    },
  },
  
  loadingTitle: {
    signingIn: {
      fr: 'Connexion en cours...',
      en: 'Signing in...',
      es: 'Iniciando sesión...',
      de: 'Anmeldung läuft...',
    },
    signingUp: {
      fr: 'Inscription en cours...',
      en: 'Signing up...',
      es: 'Registrándose...',
      de: 'Registrierung läuft...',
    },
    sendingEmail: {
      fr: 'Envoi de l\'email...',
      en: 'Sending email...',
      es: 'Enviando correo...',
      de: 'E-Mail wird gesendet...',
    },
    resettingPassword: {
      fr: 'Réinitialisation...',
      en: 'Resetting password...',
      es: 'Restableciendo contraseña...',
      de: 'Passwort wird zurückgesetzt...',
    },
    signingOut: {
      fr: 'Déconnexion en cours...',
      en: 'Signing out...',
      es: 'Cerrando sesión...',
      de: 'Abmeldung läuft...',
    },
    pleaseWait: {
      fr: 'Veuillez patienter...',
      en: 'Please wait...',
      es: 'Por favor espera...',
      de: 'Bitte warten...',
    },
    processing: {
      fr: 'Traitement en cours...',
      en: 'Processing...',
      es: 'Procesando...',
      de: 'Verarbeitung läuft...',
    },
  },
  
  errorTitle: {
    invalidEmail: {
      fr: 'Format d\'email invalide',
      en: 'Invalid email format',
      es: 'Formato de correo inválido',
      de: 'Ungültiges E-Mail-Format',
    },
    emailRequired: {
      fr: 'L\'email est requis',
      en: 'Email is required',
      es: 'El correo es requerido',
      de: 'E-Mail ist erforderlich',
    },
    passwordRequired: {
      fr: 'Le mot de passe est requis',
      en: 'Password is required',
      es: 'La contraseña es requerida',
      de: 'Passwort ist erforderlich',
    },
    passwordTooShort: {
      fr: 'Le mot de passe doit contenir au moins 8 caractères',
      en: 'Password must be at least 8 characters',
      es: 'La contraseña debe tener al menos 8 caracteres',
      de: 'Passwort muss mindestens 8 Zeichen haben',
    },
    passwordMismatch: {
      fr: 'Les mots de passe ne correspondent pas',
      en: 'Passwords do not match',
      es: 'Las contraseñas no coinciden',
      de: 'Passwörter stimmen nicht überein',
    },
    nameRequired: {
      fr: 'Le nom est requis',
      en: 'Name is required',
      es: 'El nombre es requerido',
      de: 'Name ist erforderlich',
    },
    nameTooShort: {
      fr: 'Le nom doit contenir au moins 2 caractères',
      en: 'Name must be at least 2 characters',
      es: 'El nombre debe tener al menos 2 caracteres',
      de: 'Name muss mindestens 2 Zeichen haben',
    },
    emailAlreadyExists: {
      fr: 'Cette adresse email est déjà utilisée',
      en: 'This email address is already in use',
      es: 'Esta dirección de correo ya está en uso',
      de: 'Diese E-Mail-Adresse wird bereits verwendet',
    },
    invalidCredentials: {
      fr: 'Email ou mot de passe incorrect',
      en: 'Invalid email or password',
      es: 'Correo o contraseña incorrectos',
      de: 'Ungültige E-Mail oder Passwort',
    },
    accountNotFound: {
      fr: 'Compte non trouvé',
      en: 'Account not found',
      es: 'Cuenta no encontrada',
      de: 'Konto nicht gefunden',
    },
    invalidToken: {
      fr: 'Token invalide ou expiré',
      en: 'Invalid or expired token',
      es: 'Token inválido o expirado',
      de: 'Ungültiger oder abgelaufener Token',
    },
    tokenExpired: {
      fr: 'Le lien a expiré',
      en: 'The link has expired',
      es: 'El enlace ha expirado',
      de: 'Der Link ist abgelaufen',
    },
    generalError: {
      fr: 'Une erreur s\'est produite',
      en: 'An error occurred',
      es: 'Ocurrió un error',
      de: 'Ein Fehler ist aufgetreten',
    },
    networkError: {
      fr: 'Erreur de connexion',
      en: 'Connection error',
      es: 'Error de conexión',
      de: 'Verbindungsfehler',
    },
    serverError: {
      fr: 'Erreur serveur',
      en: 'Server error',
      es: 'Error del servidor',
      de: 'Serverfehler',
    },
    sessionExpired: {
      fr: 'Session expirée',
      en: 'Session expired',
      es: 'Sesión expirada',
      de: 'Sitzung abgelaufen',
    },
    unauthorized: {
      fr: 'Non autorisé',
      en: 'Unauthorized',
      es: 'No autorizado',
      de: 'Nicht autorisiert',
    },
    tooManyAttempts: {
      fr: 'Trop de tentatives',
      en: 'Too many attempts',
      es: 'Demasiados intentos',
      de: 'Zu viele Versuche',
    },
  },
  
  infoTitle: {
    checkYourEmail: {
      fr: 'Vérifiez votre boîte email',
      en: 'Check your email',
      es: 'Revisa tu correo',
      de: 'Überprüfen Sie Ihre E-Mail',
    },
    redirecting: {
      fr: 'Redirection en cours...',
      en: 'Redirecting...',
      es: 'Redirigiendo...',
      de: 'Weiterleitung...',
    },
    emailVerificationRequired: {
      fr: 'Vérification email requise',
      en: 'Email verification required',
      es: 'Verificación de correo requerida',
      de: 'E-Mail-Verifizierung erforderlich',
    },
    accountCreated: {
      fr: 'Compte créé avec succès',
      en: 'Account created successfully',
      es: 'Cuenta creada exitosamente',
      de: 'Konto erfolgreich erstellt',
    },
    welcomeBack: {
      fr: 'Bon retour !',
      en: 'Welcome back!',
      es: '¡Bienvenido de vuelta!',
      de: 'Willkommen zurück!',
    },
  },
};

async function initializeTranslations() {
  try {
    console.log('🚀 Initialisation des traductions d\'authentification...');

    const documents = [
      { name: 'signInTranslations', data: defaultSignInTranslations },
      { name: 'signUpTranslations', data: defaultSignUpTranslations },
      { name: 'forgotPasswordTranslations', data: defaultForgotPasswordTranslations },
      { name: 'resetPasswordTranslations', data: defaultResetPasswordTranslations },
      { name: 'authNotificationsTranslations', data: defaultAuthNotifications },
    ];

    for (const doc of documents) {
      console.log(`📝 Création de ${doc.name}...`);
      
      // Vérifier si le document existe déjà
      const existing = await client.fetch(`*[_type == "${doc.data._type}"][0]`);
      
      if (existing) {
        console.log(`ℹ️  ${doc.name} existe déjà, remplacement...`);
        await client.createOrReplace(doc.data as any);
      } else {
        await client.create(doc.data as any);
      }
      
      console.log(`✅ ${doc.name} créé avec succès !`);
    }

    console.log('🎉 Toutes les traductions ont été initialisées avec succès !');
    console.log('   Vous pouvez maintenant les modifier dans Sanity Studio.');

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des traductions:', error);
    process.exit(1);
  }
}

// Exécuter le script
if (require.main === module) {
  initializeTranslations()
    .then(() => {
      console.log('✨ Initialisation terminée !');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erreur fatale:', error);
      process.exit(1);
    });
}

export { initializeTranslations };
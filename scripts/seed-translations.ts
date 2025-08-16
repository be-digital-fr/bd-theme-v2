import { prisma } from '@/lib/prisma';

const defaultTranslations = [
  // Sign In
  {
    key: 'auth.signin.title',
    category: 'auth',
    fr: 'Connexion à votre compte',
    en: 'Sign in to your account',
    es: 'Iniciar sesión en tu cuenta',
    de: 'Melden Sie sich bei Ihrem Konto an'
  },
  {
    key: 'auth.signin.subtitle',
    category: 'auth',
    fr: 'Accédez à votre espace personnel',
    en: 'Access your personal space',
    es: 'Accede a tu espacio personal',
    de: 'Greifen Sie auf Ihren persönlichen Bereich zu'
  },
  {
    key: 'auth.signin.email',
    category: 'auth',
    fr: 'Adresse e-mail',
    en: 'Email address',
    es: 'Dirección de correo electrónico',
    de: 'E-Mail-Adresse'
  },
  {
    key: 'auth.signin.password',
    category: 'auth',
    fr: 'Mot de passe',
    en: 'Password',
    es: 'Contraseña',
    de: 'Passwort'
  },
  {
    key: 'auth.signin.submit',
    category: 'auth',
    fr: 'Se connecter',
    en: 'Sign in',
    es: 'Iniciar sesión',
    de: 'Anmelden'
  },
  {
    key: 'auth.signin.forgot_password',
    category: 'auth',
    fr: 'Mot de passe oublié ?',
    en: 'Forgot password?',
    es: '¿Olvidaste tu contraseña?',
    de: 'Passwort vergessen?'
  },
  {
    key: 'auth.signin.no_account',
    category: 'auth',
    fr: 'Pas encore de compte ?',
    en: "Don't have an account?",
    es: '¿No tienes una cuenta?',
    de: 'Noch kein Konto?'
  },
  {
    key: 'auth.signin.create_account',
    category: 'auth',
    fr: 'Créer un compte',
    en: 'Create account',
    es: 'Crear cuenta',
    de: 'Konto erstellen'
  },
  
  // Sign Up
  {
    key: 'auth.signup.title',
    category: 'auth',
    fr: 'Créer un compte',
    en: 'Create an account',
    es: 'Crear una cuenta',
    de: 'Konto erstellen'
  },
  {
    key: 'auth.signup.subtitle',
    category: 'auth',
    fr: 'Rejoignez-nous dès maintenant',
    en: 'Join us today',
    es: 'Únete a nosotros hoy',
    de: 'Treten Sie uns heute bei'
  },
  {
    key: 'auth.signup.name',
    category: 'auth',
    fr: 'Nom complet',
    en: 'Full name',
    es: 'Nombre completo',
    de: 'Vollständiger Name'
  },
  {
    key: 'auth.signup.submit',
    category: 'auth',
    fr: 'Créer le compte',
    en: 'Create account',
    es: 'Crear cuenta',
    de: 'Konto erstellen'
  },
  
  // Forgot Password
  {
    key: 'auth.forgot.title',
    category: 'auth',
    fr: 'Mot de passe oublié',
    en: 'Forgot password',
    es: 'Contraseña olvidada',
    de: 'Passwort vergessen'
  },
  {
    key: 'auth.forgot.subtitle',
    category: 'auth',
    fr: 'Nous vous enverrons un lien de réinitialisation',
    en: "We'll send you a reset link",
    es: 'Te enviaremos un enlace de restablecimiento',
    de: 'Wir senden Ihnen einen Reset-Link'
  },
  {
    key: 'auth.forgot.submit',
    category: 'auth',
    fr: 'Envoyer le lien',
    en: 'Send reset link',
    es: 'Enviar enlace',
    de: 'Link senden'
  },
  {
    key: 'auth.forgot.back_to_signin',
    category: 'auth',
    fr: 'Retour à la connexion',
    en: 'Back to sign in',
    es: 'Volver al inicio de sesión',
    de: 'Zurück zur Anmeldung'
  },
  
  // Notifications
  {
    key: 'auth.notifications.signin_success',
    category: 'auth',
    fr: 'Connexion réussie ! Bienvenue.',
    en: 'Successfully signed in! Welcome.',
    es: '¡Inicio de sesión exitoso! Bienvenido.',
    de: 'Erfolgreich angemeldet! Willkommen.'
  },
  {
    key: 'auth.notifications.signup_success',
    category: 'auth',
    fr: 'Compte créé avec succès ! Bienvenue.',
    en: 'Account created successfully! Welcome.',
    es: '¡Cuenta creada exitosamente! Bienvenido.',
    de: 'Konto erfolgreich erstellt! Willkommen.'
  }
];

async function seedTranslations() {
  console.log('🌱 Initialisation des traductions par défaut...');
  
  try {
    for (const translation of defaultTranslations) {
      await prisma.translation.upsert({
        where: { key: translation.key },
        create: translation,
        update: translation
      });
    }
    
    console.log(`✅ ${defaultTranslations.length} traductions initialisées avec succès !`);
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des traductions:', error);
    throw error;
  }
}

async function main() {
  await seedTranslations();
  await prisma.$disconnect();
}

if (require.main === module) {
  main()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seedTranslations };
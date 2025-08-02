import { useAuthNotificationsTranslations } from './useAuthNotificationsTranslations';

interface AuthNotifications {
  success: {
    signInSuccess: string;
    signUpSuccess: string;
    passwordResetEmailSent: string;
    passwordResetSuccess: string;
    logoutSuccess: string;
  };
  loading: {
    signingIn: string;
    signingUp: string;
    sendingEmail: string;
    resettingPassword: string;
    signingOut: string;
    pleaseWait: string;
    processing: string;
  };
  error: {
    invalidEmail: string;
    emailRequired: string;
    passwordRequired: string;
    passwordTooShort: string;
    passwordMismatch: string;
    nameRequired: string;
    nameTooShort: string;
    emailAlreadyExists: string;
    invalidCredentials: string;
    accountNotFound: string;
    invalidToken: string;
    tokenExpired: string;
    generalError: string;
    networkError: string;
    serverError: string;
    sessionExpired: string;
    unauthorized: string;
    tooManyAttempts: string;
  };
  info: {
    checkYourEmail: string;
    redirecting: string;
    emailVerificationRequired: string;
    accountCreated: string;
    welcomeBack: string;
  };
}

export function useAuthNotifications() {
  const { translations, isLoading, error, currentLanguage } = useAuthNotificationsTranslations();

  // Structure des notifications organisée par catégorie
  const notifications: AuthNotifications = {
    success: {
      signInSuccess: translations.signInSuccess,
      signUpSuccess: translations.signUpSuccess,
      passwordResetEmailSent: translations.passwordResetEmailSent,
      passwordResetSuccess: translations.passwordResetSuccess,
      logoutSuccess: translations.logoutSuccess,
    },
    loading: {
      signingIn: translations.signingIn,
      signingUp: translations.signingUp,
      sendingEmail: translations.sendingEmail,
      resettingPassword: translations.resettingPassword,
      signingOut: translations.signingOut,
      pleaseWait: translations.pleaseWait,
      processing: translations.processing,
    },
    error: {
      invalidEmail: translations.invalidEmail,
      emailRequired: translations.emailRequired,
      passwordRequired: translations.passwordRequired,
      passwordTooShort: translations.passwordTooShort,
      passwordMismatch: translations.passwordMismatch,
      nameRequired: translations.nameRequired,
      nameTooShort: translations.nameTooShort,
      emailAlreadyExists: translations.emailAlreadyExists,
      invalidCredentials: translations.invalidCredentials,
      accountNotFound: translations.accountNotFound,
      invalidToken: translations.invalidToken,
      tokenExpired: translations.tokenExpired,
      generalError: translations.generalError,
      networkError: translations.networkError,
      serverError: translations.serverError,
      sessionExpired: translations.sessionExpired,
      unauthorized: translations.unauthorized,
      tooManyAttempts: translations.tooManyAttempts,
    },
    info: {
      checkYourEmail: translations.checkYourEmail,
      redirecting: translations.redirecting,
      emailVerificationRequired: translations.emailVerificationRequired,
      accountCreated: translations.accountCreated,
      welcomeBack: translations.welcomeBack,
    },
  };

  return {
    notifications,
    isLoading,
    error,
    currentLanguage,
  };
}
/**
 * Maps error messages to localized translations
 */
export function mapAuthError(error: string | null, notifications: any): string | null {
  if (!error) return null;

  // Map common error patterns to localized messages
  const errorMappings: Record<string, string> = {
    // Email errors
    'invalid email': 'invalidEmail',
    'email is required': 'emailRequired',
    'email already exists': 'emailAlreadyExists',
    'cette adresse email est déjà utilisée': 'emailAlreadyExists',
    
    // Password errors
    'password is required': 'passwordRequired',
    'password must be at least': 'passwordTooShort',
    'passwords do not match': 'passwordMismatch',
    'les mots de passe ne correspondent pas': 'passwordMismatch',
    
    // Name errors
    'name is required': 'nameRequired',
    'name must be at least': 'nameTooShort',
    
    // Authentication errors
    'invalid credentials': 'invalidCredentials',
    'email ou mot de passe incorrect': 'invalidCredentials',
    'invalid email or password': 'invalidCredentials',
    'user not found': 'accountNotFound',
    'account not found': 'accountNotFound',
    'compte non trouvé': 'accountNotFound',
    
    // Token errors
    'invalid token': 'invalidToken',
    'token expired': 'tokenExpired',
    'token has expired': 'tokenExpired',
    
    // Session errors
    'session expired': 'sessionExpired',
    'unauthorized': 'unauthorized',
    'not authorized': 'unauthorized',
    
    // Rate limiting
    'too many attempts': 'tooManyAttempts',
    'too many requests': 'tooManyAttempts',
    
    // Network errors
    'network error': 'networkError',
    'failed to fetch': 'networkError',
    'erreur de connexion': 'networkError',
    
    // Server errors
    'server error': 'serverError',
    'internal server error': 'serverError',
    '500': 'serverError',
  };

  // Check if error matches any known pattern
  const lowerError = error.toLowerCase();
  for (const [pattern, key] of Object.entries(errorMappings)) {
    if (lowerError.includes(pattern)) {
      return notifications.error[key];
    }
  }

  // Default to general error if no specific match
  return notifications.error.generalError;
}

/**
 * Maps loading states to localized messages
 */
export function mapAuthLoadingState(state: string, notifications: AuthNotifications): string {
  const loadingMappings: Record<string, keyof AuthNotifications['loading']> = {
    'signin': 'signingIn',
    'signup': 'signingUp',
    'signout': 'signingOut',
    'reset': 'resettingPassword',
    'email': 'sendingEmail',
  };

  return notifications.loading[loadingMappings[state] || 'processing'];
}
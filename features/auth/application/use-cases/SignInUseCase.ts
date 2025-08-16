import { IAuthRepository, AuthResult } from '../../domain/repositories/IAuthRepository';
import { IPasswordService } from '../../domain/services/IPasswordService';
import { 
  SignInCredentialsSchema, 
  type SignInCredentialsType,
  type AuthResultType 
} from '../../domain/schemas/UserSchemas';

/**
 * Sign In Use Case
 * 
 * Handles user authentication logic.
 * Follows the pattern established in GetAdminPreferencesUseCase.
 */
export class SignInUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly passwordService: IPasswordService
  ) {}

  /**
   * Execute sign in operation
   */
  async execute(credentials: SignInCredentialsType): Promise<AuthResult<AuthResultType>> {
    try {
      // Validate input
      const validatedCredentials = SignInCredentialsSchema.parse(credentials);

      // Attempt sign in - Better Auth handles user existence and password verification
      const signInResult = await this.authRepository.signIn(validatedCredentials);
      
      if (!signInResult.success) {
        // Handle specific authentication errors
        switch (signInResult.error.code) {
          case 'INVALID_CREDENTIALS':
            return {
              success: false,
              error: {
                code: 'INVALID_CREDENTIALS',
                message: 'Email ou mot de passe incorrect',
              }
            };
          case 'EMAIL_NOT_VERIFIED':
            return {
              success: false,
              error: {
                code: 'EMAIL_NOT_VERIFIED',
                message: 'Veuillez vérifier votre email avant de vous connecter',
              }
            };
          case 'TOO_MANY_ATTEMPTS':
            return {
              success: false,
              error: {
                code: 'TOO_MANY_ATTEMPTS',
                message: 'Trop de tentatives de connexion. Veuillez réessayer plus tard',
              }
            };
          default:
            return signInResult;
        }
      }

      return signInResult;

    } catch (error) {
      console.error('SignInUseCase error:', error);
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Une erreur interne s\'est produite',
        }
      };
    }
  }

  /**
   * Validate credentials format without attempting sign in
   */
  validateCredentials(credentials: SignInCredentialsType): {
    isValid: boolean;
    errors: string[];
  } {
    try {
      SignInCredentialsSchema.parse(credentials);
      return {
        isValid: true,
        errors: []
      };
    } catch (error: any) {
      const errors = error.errors?.map((err: any) => err.message) || ['Invalid credentials format'];
      return {
        isValid: false,
        errors
      };
    }
  }

  /**
   * Check if email exists (for UI feedback)
   */
  async checkEmailExists(email: string): Promise<AuthResult<boolean>> {
    if (!email || !email.includes('@')) {
      return {
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Format d\'email invalide',
        }
      };
    }

    // For Better Auth integration, we'll use the emailExists method
    // This is mainly for UI feedback (showing if email is available during signup)
    return await this.authRepository.emailExists(email);
  }
}
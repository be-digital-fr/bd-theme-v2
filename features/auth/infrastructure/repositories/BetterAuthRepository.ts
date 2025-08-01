import { User } from '../../domain/entities/User';
import { IAuthRepository, AuthResult } from '../../domain/repositories/IAuthRepository';
import { 
  SignInCredentialsType, 
  SignUpDataType, 
  PasswordResetRequestType,
  PasswordResetType,
  EmailVerificationType,
  AuthResultType,
  BetterAuthResponseSchema,
  BetterAuthUserSchema
} from '../../domain/schemas/UserSchemas';
import { authClient } from '@/lib/auth-client';
import { auth } from '@/lib/auth';

/**
 * Better Auth Repository Implementation
 * 
 * Concrete implementation of IAuthRepository using Better Auth.
 * Follows the pattern established in PrismaAdminPreferencesRepository.
 */
export class BetterAuthRepository implements IAuthRepository {
  constructor() {}

  /**
   * Sign in a user with email and password
   */
  async signIn(credentials: SignInCredentialsType): Promise<AuthResult<AuthResultType>> {
    try {
      const { data: result, error: signInError } = await authClient.signIn.email({
        email: credentials.email,
        password: credentials.password,
      });

      if (signInError) {
        return {
          success: false,
          error: {
            code: this.mapBetterAuthErrorCode(signInError.message || 'Unknown error'),
            message: this.mapBetterAuthErrorMessage(signInError.message || 'Unknown error'),
          }
        };
      }

      if (!result || !result.user) {
        return {
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Email ou mot de passe incorrect',
          }
        };
      }

      // Validate response with schema
      const validatedResponse = BetterAuthResponseSchema.parse(result);
      const validatedUser = BetterAuthUserSchema.parse(validatedResponse.user);

      const user = User.fromData({
        id: validatedUser.id,
        email: validatedUser.email,
        name: validatedUser.name || null,
        emailVerified: validatedUser.emailVerified || false,
        image: validatedUser.image || null,
        createdAt: new Date(validatedUser.createdAt || Date.now()),
        updatedAt: new Date(validatedUser.updatedAt || Date.now()),
      });

      const authResult: AuthResultType = {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
          image: user.image,
        },
        session: {
          id: validatedResponse.session?.id || 'unknown',
          token: validatedResponse.token || validatedResponse.session?.token || 'unknown',
          expiresAt: validatedResponse.session?.expiresAt 
            ? new Date(validatedResponse.session.expiresAt) 
            : new Date(Date.now() + 24 * 60 * 60 * 1000), // Default 24h
        }
      };

      return {
        success: true,
        data: authResult
      };

    } catch (error) {
      console.error('BetterAuthRepository.signIn error:', error);
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
   * Sign up a new user
   */
  async signUp(userData: SignUpDataType): Promise<AuthResult<User>> {
    try {
      const { data: result, error: signUpError } = await authClient.signUp.email({
        name: userData.name,
        email: userData.email,
        password: userData.password,
      });

      if (signUpError) {
        return {
          success: false,
          error: {
            code: this.mapBetterAuthErrorCode(signUpError.message || 'Unknown error'),
            message: this.mapBetterAuthErrorMessage(signUpError.message || 'Unknown error'),
          }
        };
      }

      if (!result || !result.user) {
        return {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Erreur lors de la création du compte',
          }
        };
      }

      // Validate response with schema
      const validatedResponse = BetterAuthResponseSchema.parse(result);
      const validatedUser = BetterAuthUserSchema.parse(validatedResponse.user);

      const user = User.fromData({
        id: validatedUser.id,
        email: validatedUser.email,
        name: validatedUser.name || null,
        emailVerified: validatedUser.emailVerified || false,
        image: validatedUser.image || null,
        createdAt: new Date(validatedUser.createdAt || Date.now()),
        updatedAt: new Date(validatedUser.updatedAt || Date.now()),
      });

      return {
        success: true,
        data: user
      };

    } catch (error) {
      console.error('BetterAuthRepository.signUp error:', error);
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Une erreur interne s\'est produite lors de l\'inscription',
        }
      };
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<AuthResult<void>> {
    try {
      const { error: signOutError } = await authClient.signOut();

      if (signOutError) {
        return {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Erreur lors de la déconnexion',
          }
        };
      }

      return {
        success: true,
        data: undefined
      };

    } catch (error) {
      console.error('BetterAuthRepository.signOut error:', error);
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Une erreur interne s\'est produite lors de la déconnexion',
        }
      };
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<AuthResult<User | null>> {
    try {
      const { data: session } = await authClient.getSession();

      if (!session || !session.user) {
        return {
          success: true,
          data: null
        };
      }

      const validatedUser = BetterAuthUserSchema.parse(session.user);

      const user = User.fromData({
        id: validatedUser.id,
        email: validatedUser.email,
        name: validatedUser.name || null,
        emailVerified: validatedUser.emailVerified || false,
        image: validatedUser.image || null,
        createdAt: new Date(validatedUser.createdAt || Date.now()),
        updatedAt: new Date(validatedUser.updatedAt || Date.now()),
      });

      return {
        success: true,
        data: user
      };

    } catch (error) {
      console.error('BetterAuthRepository.getCurrentUser error:', error);
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Une erreur s\'est produite lors de la récupération de l\'utilisateur',
        }
      };
    }
  }

  /**
   * Refresh authentication session
   */
  async refreshSession(): Promise<AuthResult<AuthResultType>> {
    try {
      // Better Auth handles session refresh automatically in most cases
      // We can try to get the current session to check if it's still valid
      const currentUserResult = await this.getCurrentUser();
      
      if (!currentUserResult.success || !currentUserResult.data) {
        return {
          success: false,
          error: {
            code: 'SESSION_EXPIRED',
            message: 'Session expirée',
          }
        };
      }

      const user = currentUserResult.data;
      const authResult: AuthResultType = {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
          image: user.image,
        },
        session: {
          id: 'current-session', // Better Auth doesn't expose session ID easily
          token: 'current-token',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Default 24h
        }
      };

      return {
        success: true,
        data: authResult
      };

    } catch (error) {
      console.error('BetterAuthRepository.refreshSession error:', error);
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Une erreur s\'est produite lors de la mise à jour de la session',
        }
      };
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(request: PasswordResetRequestType): Promise<AuthResult<void>> {
    try {
      // Note: Better Auth might not have this method directly
      // This would need to be implemented based on Better Auth's password reset flow
      console.warn('Password reset not yet implemented in Better Auth integration');
      
      return {
        success: true,
        data: undefined
      };

    } catch (error) {
      console.error('BetterAuthRepository.requestPasswordReset error:', error);
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Une erreur s\'est produite lors de la demande de réinitialisation',
        }
      };
    }
  }

  /**
   * Reset password using token
   */
  async resetPassword(resetData: PasswordResetType): Promise<AuthResult<void>> {
    try {
      // Note: This would need to be implemented based on Better Auth's password reset flow
      console.warn('Password reset execution not yet implemented in Better Auth integration');
      
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Fonctionnalité non encore implémentée',
        }
      };

    } catch (error) {
      console.error('BetterAuthRepository.resetPassword error:', error);
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Une erreur s\'est produite lors de la réinitialisation',
        }
      };
    }
  }

  /**
   * Request email verification
   */
  async requestEmailVerification(userId: string): Promise<AuthResult<void>> {
    try {
      // This would need to be implemented based on Better Auth's email verification flow
      console.warn('Email verification request not yet implemented in Better Auth integration');
      
      return {
        success: true,
        data: undefined
      };

    } catch (error) {
      console.error('BetterAuthRepository.requestEmailVerification error:', error);
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Une erreur s\'est produite lors de la demande de vérification',
        }
      };
    }
  }

  /**
   * Verify email using token
   */
  async verifyEmail(verification: EmailVerificationType): Promise<AuthResult<User>> {
    try {
      // This would need to be implemented based on Better Auth's email verification flow
      console.warn('Email verification not yet implemented in Better Auth integration');
      
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Fonctionnalité non encore implémentée',
        }
      };

    } catch (error) {
      console.error('BetterAuthRepository.verifyEmail error:', error);
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Une erreur s\'est produite lors de la vérification',
        }
      };
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, profileData: { name?: string; image?: string }): Promise<AuthResult<User>> {
    try {
      // This would need to be implemented based on Better Auth's profile update methods
      console.warn('Profile update not yet implemented in Better Auth integration');
      
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Fonctionnalité non encore implémentée',
        }
      };

    } catch (error) {
      console.error('BetterAuthRepository.updateProfile error:', error);
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Une erreur s\'est produite lors de la mise à jour du profil',
        }
      };
    }
  }

  /**
   * Delete user account
   */
  async deleteAccount(userId: string): Promise<AuthResult<void>> {
    try {
      // This would need to be implemented based on Better Auth's account deletion methods
      console.warn('Account deletion not yet implemented in Better Auth integration');
      
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Fonctionnalité non encore implémentée',
        }
      };

    } catch (error) {
      console.error('BetterAuthRepository.deleteAccount error:', error);
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Une erreur s\'est produite lors de la suppression du compte',
        }
      };
    }
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<AuthResult<boolean>> {
    try {
      // This would typically be done via an API call to check email existence
      // For now, we'll return false (email available) as a default
      console.warn('Email existence check not yet implemented in Better Auth integration');
      
      return {
        success: true,
        data: false
      };

    } catch (error) {
      console.error('BetterAuthRepository.emailExists error:', error);
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Une erreur s\'est produite lors de la vérification de l\'email',
        }
      };
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<AuthResult<User | null>> {
    try {
      // This would need to be implemented based on Better Auth's user lookup methods
      console.warn('Get user by ID not yet implemented in Better Auth integration');
      
      return {
        success: true,
        data: null
      };

    } catch (error) {
      console.error('BetterAuthRepository.getUserById error:', error);
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Une erreur s\'est produite lors de la récupération de l\'utilisateur',
        }
      };
    }
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<AuthResult<User | null>> {
    try {
      // This would need to be implemented based on Better Auth's user lookup methods
      console.warn('Get user by email not yet implemented in Better Auth integration');
      
      return {
        success: true,
        data: null
      };

    } catch (error) {
      console.error('BetterAuthRepository.getUserByEmail error:', error);
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Une erreur s\'est produite lors de la récupération de l\'utilisateur',
        }
      };
    }
  }

  /**
   * Map Better Auth error codes to our domain error codes
   */
  private mapBetterAuthErrorCode(errorMessage: string): string {
    const message = errorMessage.toLowerCase();
    
    if (message.includes('invalid') || message.includes('incorrect') || message.includes('wrong')) {
      return 'INVALID_CREDENTIALS';
    }
    if (message.includes('not found') || message.includes('user not found')) {
      return 'USER_NOT_FOUND';
    }
    if (message.includes('already exists') || message.includes('duplicate')) {
      return 'EMAIL_ALREADY_EXISTS';
    }
    if (message.includes('expired') || message.includes('timeout')) {
      return 'TOKEN_EXPIRED';
    }
    if (message.includes('too many') || message.includes('rate limit')) {
      return 'TOO_MANY_ATTEMPTS';
    }
    
    return 'INTERNAL_ERROR';
  }

  /**
   * Map Better Auth error messages to user-friendly French messages
   */
  private mapBetterAuthErrorMessage(errorMessage: string): string {
    const code = this.mapBetterAuthErrorCode(errorMessage);
    
    switch (code) {
      case 'INVALID_CREDENTIALS':
        return 'Email ou mot de passe incorrect';
      case 'USER_NOT_FOUND':
        return 'Utilisateur non trouvé';
      case 'EMAIL_ALREADY_EXISTS':
        return 'Cette adresse email est déjà utilisée';
      case 'TOKEN_EXPIRED':
        return 'Token expiré';
      case 'TOO_MANY_ATTEMPTS':
        return 'Trop de tentatives. Veuillez réessayer plus tard';
      default:
        return 'Une erreur s\'est produite';
    }
  }
}
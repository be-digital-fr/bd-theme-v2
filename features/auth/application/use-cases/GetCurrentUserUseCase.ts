import { User } from '../../domain/entities/User';
import { IAuthRepository, AuthResult } from '../../domain/repositories/IAuthRepository';
import { ISessionRepository } from '../../domain/repositories/ISessionRepository';
import { AuthStatusType } from '../../domain/schemas/AuthSchemas';

/**
 * Get Current User Use Case
 * 
 * Handles getting current authenticated user and session information.
 * Follows the pattern established in GetAdminPreferencesUseCase.
 */
export class GetCurrentUserUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly sessionRepository: ISessionRepository
  ) {}

  /**
   * Get current authenticated user
   */
  async execute(): Promise<AuthResult<User | null>> {
    try {
      const currentUserResult = await this.authRepository.getCurrentUser();
      
      if (!currentUserResult.success) {
        return currentUserResult;
      }

      return {
        success: true,
        data: currentUserResult.data
      };

    } catch (error) {
      console.error('GetCurrentUserUseCase error:', error);
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
   * Get detailed authentication status with user and session info
   */
  async getAuthStatus(): Promise<AuthResult<AuthStatusType>> {
    try {
      // Get current user
      const currentUserResult = await this.authRepository.getCurrentUser();
      
      if (!currentUserResult.success) {
        return {
          success: true,
          data: {
            isAuthenticated: false,
            user: null,
            session: null
          }
        };
      }

      const user = currentUserResult.data;

      if (!user) {
        return {
          success: true,
          data: {
            isAuthenticated: false,
            user: null,
            session: null
          }
        };
      }

      // Try to get session information (optional - may not be available in all implementations)
      let sessionInfo = null;
      try {
        // This would need to be implemented based on how sessions are managed
        // For now, we'll create a basic session info structure
        sessionInfo = {
          id: 'current-session',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
          expiresSoon: false,
          ageInDays: 0
        };
      } catch (sessionError) {
        console.warn('Could not retrieve session information:', sessionError);
      }

      const authStatus: AuthStatusType = {
        isAuthenticated: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
          image: user.image,
          hasCompleteProfile: user.hasCompleteProfile(),
          needsEmailVerification: user.needsEmailVerification(),
          displayName: user.getDisplayName(),
        },
        session: sessionInfo
      };

      return {
        success: true,
        data: authStatus
      };

    } catch (error) {
      console.error('GetAuthStatus error:', error);
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Une erreur s\'est produite lors de la récupération du statut d\'authentification',
        }
      };
    }
  }

  /**
   * Check if user is authenticated (simple boolean check)
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const currentUserResult = await this.authRepository.getCurrentUser();
      return currentUserResult.success && !!currentUserResult.data;
    } catch (error) {
      console.error('IsAuthenticated check error:', error);
      return false;
    }
  }

  /**
   * Refresh current user data
   */
  async refresh(): Promise<AuthResult<User | null>> {
    try {
      // First try to refresh the session
      const refreshResult = await this.authRepository.refreshSession();
      
      if (!refreshResult.success) {
        // If refresh fails, the user might not be authenticated
        return {
          success: true,
          data: null
        };
      }

      // Get current user after refresh
      return await this.execute();

    } catch (error) {
      console.error('RefreshCurrentUser error:', error);
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Une erreur s\'est produite lors de la mise à jour des informations utilisateur',
        }
      };
    }
  }

  /**
   * Check if current user has admin privileges
   */
  async isAdmin(): Promise<AuthResult<boolean>> {
    try {
      const currentUserResult = await this.execute();
      
      if (!currentUserResult.success || !currentUserResult.data) {
        return {
          success: true,
          data: false
        };
      }

      return {
        success: true,
        data: currentUserResult.data.isAdmin()
      };

    } catch (error) {
      console.error('IsAdmin check error:', error);
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Une erreur s\'est produite lors de la vérification des privilèges',
        }
      };
    }
  }

  /**
   * Get user profile completion status
   */
  async getProfileCompletionStatus(): Promise<AuthResult<{
    isComplete: boolean;
    missingFields: string[];
    completionPercentage: number;
  }>> {
    try {
      const currentUserResult = await this.execute();
      
      if (!currentUserResult.success || !currentUserResult.data) {
        return {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Utilisateur non authentifié',
          }
        };
      }

      const user = currentUserResult.data;
      const missingFields: string[] = [];
      
      if (!user.name) missingFields.push('name');
      if (!user.emailVerified) missingFields.push('emailVerification');
      if (!user.image) missingFields.push('profileImage');

      const totalFields = 3;
      const completedFields = totalFields - missingFields.length;
      const completionPercentage = Math.round((completedFields / totalFields) * 100);

      return {
        success: true,
        data: {
          isComplete: user.hasCompleteProfile(),
          missingFields,
          completionPercentage
        }
      };

    } catch (error) {
      console.error('GetProfileCompletionStatus error:', error);
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Une erreur s\'est produite lors de la vérification du profil',
        }
      };
    }
  }
}
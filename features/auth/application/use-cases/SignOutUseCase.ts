import { IAuthRepository, AuthResult } from '../../domain/repositories/IAuthRepository';
import { ISessionRepository } from '../../domain/repositories/ISessionRepository';

/**
 * Sign Out Use Case
 * 
 * Handles user sign out and session cleanup.
 * Follows the pattern established in admin use cases.
 */
export class SignOutUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly sessionRepository: ISessionRepository
  ) {}

  /**
   * Execute sign out operation
   */
  async execute(): Promise<AuthResult<void>> {
    try {
      // Get current user to check if authenticated
      const currentUserResult = await this.authRepository.getCurrentUser();
      
      if (!currentUserResult.success || !currentUserResult.data) {
        // User is not authenticated, but we can still consider this a success
        return {
          success: true,
          data: undefined
        };
      }

      // Sign out from auth repository
      const signOutResult = await this.authRepository.signOut();
      
      if (!signOutResult.success) {
        return signOutResult;
      }

      return {
        success: true,
        data: undefined
      };

    } catch (error) {
      console.error('SignOutUseCase error:', error);
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Une erreur s\'est produite lors de la déconnexion',
        }
      };
    }
  }

  /**
   * Sign out from all devices/sessions
   */
  async signOutFromAllDevices(userId: string): Promise<AuthResult<void>> {
    try {
      // Delete all sessions for the user
      const deleteSessionsResult = await this.sessionRepository.deleteAllForUser(userId);
      
      if (!deleteSessionsResult.success) {
        return {
          success: false,
          error: deleteSessionsResult.error
        };
      }

      // Also sign out from current session
      await this.authRepository.signOut();

      return {
        success: true,
        data: undefined
      };

    } catch (error) {
      console.error('SignOutFromAllDevices error:', error);
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Une erreur s\'est produite lors de la déconnexion de tous les appareils',
        }
      };
    }
  }
}
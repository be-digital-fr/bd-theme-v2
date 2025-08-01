import { IAuthRepository, AuthResult } from '../../domain/repositories/IAuthRepository';
import { IPasswordService } from '../../domain/services/IPasswordService';
import { IEmailService } from '../../domain/services/IEmailService';
import { 
  PasswordResetRequestSchema,
  PasswordResetSchema,
  type PasswordResetRequestType,
  type PasswordResetType 
} from '../../domain/schemas/UserSchemas';

/**
 * Reset Password Use Case
 * 
 * Handles password reset request and execution.
 * Follows the pattern established in admin use cases.
 */
export class ResetPasswordUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly passwordService: IPasswordService,
    private readonly emailService: IEmailService
  ) {}

  /**
   * Request password reset (send email with reset link)
   */
  async requestReset(request: PasswordResetRequestType): Promise<AuthResult<void>> {
    try {
      // Validate input
      const validatedRequest = PasswordResetRequestSchema.parse(request);

      // Check if user exists
      const userResult = await this.authRepository.getUserByEmail(validatedRequest.email);
      
      if (!userResult.success) {
        // For security reasons, don't reveal if email exists or not
        // Always return success to prevent email enumeration
        return {
          success: true,
          data: undefined
        };
      }

      if (!userResult.data) {
        // Email doesn't exist, but return success for security
        return {
          success: true,
          data: undefined
        };
      }

      // Request password reset
      const resetResult = await this.authRepository.requestPasswordReset(validatedRequest);
      
      if (!resetResult.success) {
        console.error('Password reset request failed:', resetResult.error);
        // Still return success to user for security
        return {
          success: true,
          data: undefined
        };
      }

      // Send password reset email (non-blocking)
      this.sendPasswordResetEmailAsync(
        userResult.data.email, 
        userResult.data.getDisplayName()
      );

      return {
        success: true,
        data: undefined
      };

    } catch (error) {
      console.error('RequestPasswordReset error:', error);
      // Return success to prevent information leakage
      return {
        success: true,
        data: undefined
      };
    }
  }

  /**
   * Execute password reset with token
   */
  async executeReset(resetData: PasswordResetType): Promise<AuthResult<void>> {
    try {
      // Validate input
      const validatedData = PasswordResetSchema.parse(resetData);

      // Validate token format
      if (!this.passwordService.validateResetToken(validatedData.token)) {
        return {
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Token de réinitialisation invalide',
          }
        };
      }

      // Check password strength
      const passwordValidation = this.passwordService.validateStrength(validatedData.password);
      if (!passwordValidation.isValid) {
        return {
          success: false,
          error: {
            code: 'WEAK_PASSWORD',
            message: 'Le mot de passe ne respecte pas les critères de sécurité',
            details: { 
              feedback: passwordValidation.feedback,
              requirements: passwordValidation.requirements 
            }
          }
        };
      }

      // Optional: Check if password has been compromised
      if (this.passwordService.checkIfCompromised) {
        try {
          const isCompromised = await this.passwordService.checkIfCompromised(validatedData.password);
          if (isCompromised) {
            return {
              success: false,
              error: {
                code: 'WEAK_PASSWORD',
                message: 'Ce mot de passe a été compromis dans une fuite de données. Veuillez en choisir un autre',
              }
            };
          }
        } catch (error) {
          console.warn('Password compromise check failed:', error);
        }
      }

      // Execute password reset
      const resetResult = await this.authRepository.resetPassword(validatedData);
      
      if (!resetResult.success) {
        switch (resetResult.error.code) {
          case 'INVALID_TOKEN':
            return {
              success: false,
              error: {
                code: 'INVALID_TOKEN',
                message: 'Token de réinitialisation invalide ou expiré',
              }
            };
          case 'TOKEN_EXPIRED':
            return {
              success: false,
              error: {
                code: 'TOKEN_EXPIRED',
                message: 'Le token de réinitialisation a expiré. Veuillez demander un nouveau lien',
              }
            };
          case 'TOKEN_USED':
            return {
              success: false,
              error: {
                code: 'TOKEN_USED',
                message: 'Ce token a déjà été utilisé. Veuillez demander un nouveau lien',
              }
            };
          default:
            return resetResult;
        }
      }

      return {
        success: true,
        data: undefined
      };

    } catch (error) {
      console.error('ExecutePasswordReset error:', error);
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Une erreur interne s\'est produite lors de la réinitialisation',
        }
      };
    }
  }

  /**
   * Validate password reset data without executing
   */
  validateResetData(resetData: PasswordResetType): {
    isValid: boolean;
    errors: string[];
    passwordStrength?: {
      score: number;
      feedback: string[];
      requirements: any;
    };
  } {
    const errors: string[] = [];

    try {
      PasswordResetSchema.parse(resetData);
    } catch (error: any) {
      const schemaErrors = error.errors?.map((err: any) => err.message) || ['Invalid data format'];
      errors.push(...schemaErrors);
    }

    // Validate token format
    if (!this.passwordService.validateResetToken(resetData.token)) {
      errors.push('Format de token invalide');
    }

    // Check password strength
    const passwordValidation = this.passwordService.validateStrength(resetData.password);
    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.feedback);
    }

    return {
      isValid: errors.length === 0,
      errors,
      passwordStrength: passwordValidation
    };
  }

  /**
   * Send password reset email asynchronously
   */
  private async sendPasswordResetEmailAsync(email: string, userName: string): Promise<void> {
    try {
      // In a real implementation, we would get the reset URL from the token
      const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=placeholder`;
      await this.emailService.sendPasswordResetEmail(email, userName, resetUrl, { priority: 'high' });
    } catch (error) {
      console.error('Failed to send password reset email:', error);
    }
  }
}
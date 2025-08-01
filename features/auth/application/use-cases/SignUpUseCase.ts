import { User } from '../../domain/entities/User';
import { IAuthRepository, AuthResult } from '../../domain/repositories/IAuthRepository';
import { IPasswordService } from '../../domain/services/IPasswordService';
import { IEmailService } from '../../domain/services/IEmailService';
import { 
  SignUpDataSchema, 
  type SignUpDataType 
} from '../../domain/schemas/UserSchemas';

/**
 * Sign Up Use Case
 * 
 * Handles user registration logic.
 * Follows the pattern established in UpdateAdminPreferencesUseCase.
 */
export class SignUpUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly passwordService: IPasswordService,
    private readonly emailService: IEmailService
  ) {}

  /**
   * Execute sign up operation
   */
  async execute(userData: SignUpDataType): Promise<AuthResult<User>> {
    try {
      // Validate input
      const validatedData = SignUpDataSchema.parse(userData);

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

      // Check if email already exists
      const emailExistsResult = await this.authRepository.emailExists(validatedData.email);
      if (!emailExistsResult.success) {
        return {
          success: false,
          error: emailExistsResult.error
        };
      }

      if (emailExistsResult.data) {
        return {
          success: false,
          error: {
            code: 'EMAIL_ALREADY_EXISTS',
            message: 'Cette adresse email est déjà utilisée',
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
          // Continue if compromise check fails - it's optional
          console.warn('Password compromise check failed:', error);
        }
      }

      // Attempt to create user
      const signUpResult = await this.authRepository.signUp(validatedData);
      
      if (!signUpResult.success) {
        return signUpResult;
      }

      // Send welcome email (non-blocking)
      this.sendWelcomeEmailAsync(signUpResult.data.email, signUpResult.data.getDisplayName());

      // Send email verification if email is not verified
      if (signUpResult.data.needsEmailVerification()) {
        this.sendEmailVerificationAsync(signUpResult.data.id, signUpResult.data.email, signUpResult.data.getDisplayName());
      }

      return signUpResult;

    } catch (error) {
      console.error('SignUpUseCase error:', error);
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
   * Validate sign up data without attempting registration
   */
  validateSignUpData(userData: SignUpDataType): {
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
      SignUpDataSchema.parse(userData);
    } catch (error: any) {
      const schemaErrors = error.errors?.map((err: any) => err.message) || ['Invalid data format'];
      errors.push(...schemaErrors);
    }

    // Check password strength
    const passwordValidation = this.passwordService.validateStrength(userData.password);
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
   * Check if email is available for registration
   */
  async checkEmailAvailability(email: string): Promise<AuthResult<boolean>> {
    if (!email || !this.emailService.validateEmailFormat(email)) {
      return {
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Format d\'email invalide',
        }
      };
    }

    const emailExistsResult = await this.authRepository.emailExists(email);
    if (!emailExistsResult.success) {
      return emailExistsResult;
    }

    return {
      success: true,
      data: !emailExistsResult.data // Available if email doesn't exist
    };
  }

  /**
   * Generate a strong password suggestion
   */
  generatePasswordSuggestion(): string {
    return this.passwordService.generateSecurePassword(12);
  }

  /**
   * Send welcome email asynchronously (non-blocking)
   */
  private async sendWelcomeEmailAsync(email: string, userName: string): Promise<void> {
    try {
      await this.emailService.sendWelcomeEmail(email, userName, { priority: 'normal' });
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // Don't throw - this shouldn't block user registration
    }
  }

  /**
   * Send email verification asynchronously (non-blocking)
   */
  private async sendEmailVerificationAsync(userId: string, email: string, userName: string): Promise<void> {
    try {
      // Request email verification
      const verificationResult = await this.authRepository.requestEmailVerification(userId);
      if (verificationResult.success) {
        // In a real implementation, we would get the verification URL from the result
        const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email?token=placeholder`;
        await this.emailService.sendEmailVerificationEmail(email, userName, verificationUrl, { priority: 'high' });
      }
    } catch (error) {
      console.error('Failed to send email verification:', error);
      // Don't throw - this shouldn't block user registration
    }
  }
}
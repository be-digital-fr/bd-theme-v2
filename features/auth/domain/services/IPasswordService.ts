/**
 * Password Service Interface
 * 
 * Defines the contract for password-related operations.
 * Follows clean architecture principles by abstracting infrastructure concerns.
 */

export interface IPasswordService {
  /**
   * Hash a plain text password
   */
  hash(password: string): Promise<string>;

  /**
   * Verify a password against its hash
   */
  verify(password: string, hash: string): Promise<boolean>;

  /**
   * Generate a secure random password
   */
  generateSecurePassword(length?: number): string;

  /**
   * Validate password strength
   */
  validateStrength(password: string): {
    isValid: boolean;
    score: number; // 0-5 scale
    feedback: string[];
    requirements: {
      minLength: boolean;
      hasLowercase: boolean;
      hasUppercase: boolean;
      hasNumbers: boolean;
      hasSpecialChars: boolean;
    };
  };

  /**
   * Generate a password reset token
   */
  generateResetToken(): string;

  /**
   * Validate a password reset token format
   */
  validateResetToken(token: string): boolean;

  /**
   * Check if password has been compromised (optional - can integrate with HaveIBeenPwned)
   */
  checkIfCompromised?(password: string): Promise<boolean>;

  /**
   * Generate a secure random salt
   */
  generateSalt(): string;

  /**
   * Hash password with custom salt
   */
  hashWithSalt(password: string, salt: string): Promise<string>;
}
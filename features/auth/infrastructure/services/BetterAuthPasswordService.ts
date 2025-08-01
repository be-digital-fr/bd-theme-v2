import { IPasswordService } from '../../domain/services/IPasswordService';

/**
 * Better Auth Password Service Implementation
 * 
 * Handles password-related operations using Better Auth standards.
 * In production, this might use bcrypt, argon2, or Better Auth's built-in methods.
 */
export class BetterAuthPasswordService implements IPasswordService {
  constructor() {}

  /**
   * Hash a plain text password
   */
  async hash(password: string): Promise<string> {
    try {
      // In a real implementation, this would use Better Auth's password hashing
      // For now, we'll use a simple implementation (NOT for production)
      const encoder = new TextEncoder();
      const data = encoder.encode(password + 'better-auth-salt');
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      console.error('Password hashing error:', error);
      throw new Error('Failed to hash password');
    }
  }

  /**
   * Verify a password against its hash
   */
  async verify(password: string, hash: string): Promise<boolean> {
    try {
      const hashedPassword = await this.hash(password);
      return hashedPassword === hash;
    } catch (error) {
      console.error('Password verification error:', error);
      return false;
    }
  }

  /**
   * Generate a secure random password
   */
  generateSecurePassword(length: number = 12): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    // Ensure at least one character from each required category
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const special = '!@#$%^&*';
    
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];
    
    // Fill the rest with random characters
    for (let i = password.length; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  /**
   * Validate password strength
   */
  validateStrength(password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
    requirements: {
      minLength: boolean;
      hasLowercase: boolean;
      hasUppercase: boolean;
      hasNumbers: boolean;
      hasSpecialChars: boolean;
    };
  } {
    const feedback: string[] = [];
    let score = 0;

    // Check requirements
    const requirements = {
      minLength: password.length >= 8,
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };

    // Check minimum length
    if (!requirements.minLength) {
      feedback.push('Le mot de passe doit contenir au moins 8 caractères');
    } else {
      score += 1;
    }

    // Check lowercase
    if (!requirements.hasLowercase) {
      feedback.push('Le mot de passe doit contenir au moins une lettre minuscule');
    } else {
      score += 1;
    }

    // Check uppercase
    if (!requirements.hasUppercase) {
      feedback.push('Le mot de passe doit contenir au moins une lettre majuscule');
    } else {
      score += 1;
    }

    // Check numbers
    if (!requirements.hasNumbers) {
      feedback.push('Le mot de passe doit contenir au moins un chiffre');
    } else {
      score += 1;
    }

    // Check special characters
    if (!requirements.hasSpecialChars) {
      feedback.push('Le mot de passe doit contenir au moins un caractère spécial');
    } else {
      score += 1;
    }

    // Additional strength checks
    if (password.length >= 12) {
      score += 1;
    }

    // Check for common patterns
    if (this.hasCommonPatterns(password)) {
      feedback.push('Évitez les séquences communes (123, abc, etc.)');
      score = Math.max(0, score - 1);
    }

    // Check for repeated characters
    if (this.hasRepeatedCharacters(password)) {
      feedback.push('Évitez les caractères répétés');
      score = Math.max(0, score - 1);
    }

    const isValid = Object.values(requirements).every(req => req) && feedback.length === 0;

    return {
      isValid,
      score,
      feedback,
      requirements,
    };
  }

  /**
   * Generate a password reset token
   */
  generateResetToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Validate a password reset token format
   */
  validateResetToken(token: string): boolean {
    // Check if token is a valid hex string of expected length
    return /^[a-f0-9]{64}$/i.test(token);
  }

  /**
   * Check if password has been compromised (stub implementation)
   */
  async checkIfCompromised(password: string): Promise<boolean> {
    try {
      // In a real implementation, this would check against HaveIBeenPwned API
      // For now, we'll check against a simple list of common passwords
      const commonPasswords = [
        'password', '123456', '12345678', 'qwerty', 'abc123', 
        'password123', '123456789', 'letmein', 'welcome', 'admin'
      ];
      
      return commonPasswords.includes(password.toLowerCase());
    } catch (error) {
      console.error('Password compromise check error:', error);
      return false; // If check fails, assume not compromised
    }
  }

  /**
   * Generate a secure random salt
   */
  generateSalt(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Hash password with custom salt
   */
  async hashWithSalt(password: string, salt: string): Promise<string> {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(password + salt);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      console.error('Password hashing with salt error:', error);
      throw new Error('Failed to hash password with salt');
    }
  }

  /**
   * Check for common patterns in password
   */
  private hasCommonPatterns(password: string): boolean {
    const commonPatterns = [
      /123/,
      /abc/i,
      /qwe/i,
      /asd/i,
      /zxc/i,
      /(.)\1{2,}/, // Three or more consecutive same characters
    ];

    return commonPatterns.some(pattern => pattern.test(password));
  }

  /**
   * Check for repeated characters
   */
  private hasRepeatedCharacters(password: string): boolean {
    // Check for more than 2 consecutive identical characters
    return /(.)\1{2,}/.test(password);
  }
}
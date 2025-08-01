import { z } from 'zod';
import { AuthTokenSchema, type AuthTokenType, TokenPurpose } from '../schemas/AuthSchemas';

/**
 * AuthToken Domain Entity
 * 
 * Represents authentication tokens for password reset, email verification, etc.
 * Follows the pattern established in AdminPreferences entity.
 */
export class AuthToken {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly token: string,
    public readonly purpose: TokenPurpose,
    public readonly expiresAt: Date,
    public readonly used: boolean = false,
    public readonly createdAt: Date = new Date()
  ) {
    this.validate();
  }

  /**
   * Validates the auth token entity using Zod schema
   */
  private validate(): void {
    AuthTokenSchema.parse({
      id: this.id,
      userId: this.userId,
      token: this.token,
      purpose: this.purpose,
      expiresAt: this.expiresAt,
      used: this.used,
      createdAt: this.createdAt,
    });
  }

  /**
   * Factory method to create AuthToken from data object
   */
  static fromData(data: AuthTokenType): AuthToken {
    return new AuthToken(
      data.id,
      data.userId,
      data.token,
      data.purpose,
      new Date(data.expiresAt),
      data.used,
      data.createdAt ? new Date(data.createdAt) : new Date()
    );
  }

  /**
   * Converts AuthToken entity to data object
   */
  toData(): AuthTokenType {
    return {
      id: this.id,
      userId: this.userId,
      token: this.token,
      purpose: this.purpose,
      expiresAt: this.expiresAt,
      used: this.used,
      createdAt: this.createdAt,
    };
  }

  /**
   * Factory method to create a password reset token
   */
  static createPasswordResetToken(
    id: string,
    userId: string,
    token: string,
    expirationHours: number = 1
  ): AuthToken {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expirationHours);

    return new AuthToken(
      id,
      userId,
      token,
      'password-reset',
      expiresAt
    );
  }

  /**
   * Factory method to create an email verification token
   */
  static createEmailVerificationToken(
    id: string,
    userId: string,
    token: string,
    expirationHours: number = 24
  ): AuthToken {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expirationHours);

    return new AuthToken(
      id,
      userId,
      token,
      'email-verification',
      expiresAt
    );
  }

  /**
   * Business logic: Check if token is valid (not expired and not used)
   */
  isValid(): boolean {
    return !this.used && this.expiresAt > new Date();
  }

  /**
   * Business logic: Check if token is expired
   */
  isExpired(): boolean {
    return this.expiresAt <= new Date();
  }

  /**
   * Business logic: Check if token has been used
   */
  isUsed(): boolean {
    return this.used;
  }

  /**
   * Business logic: Mark token as used
   */
  markAsUsed(): AuthToken {
    if (this.used) {
      throw new Error('Token has already been used');
    }

    if (this.isExpired()) {
      throw new Error('Cannot use expired token');
    }

    return new AuthToken(
      this.id,
      this.userId,
      this.token,
      this.purpose,
      this.expiresAt,
      true,
      this.createdAt
    );
  }

  /**
   * Business logic: Check if token can be used for specific purpose
   */
  canBeUsedFor(purpose: TokenPurpose): boolean {
    return this.purpose === purpose && this.isValid();
  }

  /**
   * Business logic: Get time until expiration in minutes
   */
  getTimeUntilExpiration(): number {
    const now = new Date();
    const timeDiff = this.expiresAt.getTime() - now.getTime();
    return Math.floor(timeDiff / (1000 * 60));
  }

  /**
   * Business logic: Check if token expires soon (within 10 minutes)
   */
  expiresSoon(): boolean {
    const minutesUntilExpiration = this.getTimeUntilExpiration();
    return minutesUntilExpiration <= 10 && minutesUntilExpiration > 0;
  }

  /**
   * Business logic: Check if token belongs to specific user
   */
  belongsToUser(userId: string): boolean {
    return this.userId === userId;
  }

  /**
   * Business logic: Get human-readable purpose
   */
  getPurposeDescription(): string {
    switch (this.purpose) {
      case 'password-reset':
        return 'Réinitialisation de mot de passe';
      case 'email-verification':
        return 'Vérification d\'email';
      default:
        return 'Token d\'authentification';
    }
  }

  /**
   * Business logic: Check if this is a password reset token
   */
  isPasswordResetToken(): boolean {
    return this.purpose === 'password-reset';
  }

  /**
   * Business logic: Check if this is an email verification token
   */
  isEmailVerificationToken(): boolean {
    return this.purpose === 'email-verification';
  }
}
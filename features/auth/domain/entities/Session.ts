import { z } from 'zod';
import { SessionSchema, type SessionType } from '../schemas/AuthSchemas';

/**
 * Session Domain Entity
 * 
 * Represents a user session with business logic for expiration and validation.
 * Follows the pattern established in AdminPreferences entity.
 */
export class Session {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly token: string,
    public readonly expiresAt: Date,
    public readonly ipAddress: string | null = null,
    public readonly userAgent: string | null = null,
    public readonly createdAt: Date = new Date()
  ) {
    this.validate();
  }

  /**
   * Validates the session entity using Zod schema
   */
  private validate(): void {
    SessionSchema.parse({
      id: this.id,
      userId: this.userId,
      token: this.token,
      expiresAt: this.expiresAt,
      ipAddress: this.ipAddress,
      userAgent: this.userAgent,
      createdAt: this.createdAt,
    });
  }

  /**
   * Factory method to create Session from data object
   */
  static fromData(data: SessionType): Session {
    return new Session(
      data.id,
      data.userId,
      data.token,
      new Date(data.expiresAt),
      data.ipAddress,
      data.userAgent,
      data.createdAt ? new Date(data.createdAt) : new Date()
    );
  }

  /**
   * Converts Session entity to data object
   */
  toData(): SessionType {
    return {
      id: this.id,
      userId: this.userId,
      token: this.token,
      expiresAt: this.expiresAt,
      ipAddress: this.ipAddress,
      userAgent: this.userAgent,
      createdAt: this.createdAt,
    };
  }

  /**
   * Business logic: Check if session is valid (not expired)
   */
  isValid(): boolean {
    return this.expiresAt > new Date();
  }

  /**
   * Business logic: Check if session is expired
   */
  isExpired(): boolean {
    return !this.isValid();
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
   * Business logic: Check if session expires soon (within 30 minutes)
   */
  expiresSoon(): boolean {
    const minutesUntilExpiration = this.getTimeUntilExpiration();
    return minutesUntilExpiration <= 30 && minutesUntilExpiration > 0;
  }

  /**
   * Business logic: Extend session expiration
   */
  extend(extensionHours: number = 24): Session {
    if (extensionHours <= 0) {
      throw new Error('Extension hours must be positive');
    }

    const newExpirationTime = new Date();
    newExpirationTime.setHours(newExpirationTime.getHours() + extensionHours);

    return new Session(
      this.id,
      this.userId,
      this.token,
      newExpirationTime,
      this.ipAddress,
      this.userAgent,
      this.createdAt
    );
  }

  /**
   * Business logic: Create a new session for the same user with different token
   */
  refresh(newToken: string, extensionHours: number = 24): Session {
    if (!newToken || newToken.length < 10) {
      throw new Error('Invalid token for session refresh');
    }

    const newExpirationTime = new Date();
    newExpirationTime.setHours(newExpirationTime.getHours() + extensionHours);

    return new Session(
      this.id,
      this.userId,
      newToken,
      newExpirationTime,
      this.ipAddress,
      this.userAgent,
      new Date()
    );
  }

  /**
   * Business logic: Check if session belongs to specific user
   */
  belongsToUser(userId: string): boolean {
    return this.userId === userId;
  }

  /**
   * Business logic: Get session age in days
   */
  getAgeInDays(): number {
    const now = new Date();
    const ageDiff = now.getTime() - this.createdAt.getTime();
    return Math.floor(ageDiff / (1000 * 60 * 60 * 24));
  }
}
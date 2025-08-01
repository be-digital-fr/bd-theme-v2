import { z } from 'zod';
import { UserSchema, type UserType } from '../schemas/UserSchemas';

/**
 * User Domain Entity
 * 
 * Represents a user in the system with all business logic and validation.
 * Follows the pattern established in AdminPreferences entity.
 */
export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string | null,
    public readonly emailVerified: boolean = false,
    public readonly image: string | null = null,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {
    this.validate();
  }

  /**
   * Validates the user entity using Zod schema
   */
  private validate(): void {
    UserSchema.parse({
      id: this.id,
      email: this.email,
      name: this.name,
      emailVerified: this.emailVerified,
      image: this.image,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }

  /**
   * Factory method to create User from data object
   */
  static fromData(data: UserType): User {
    return new User(
      data.id,
      data.email,
      data.name,
      data.emailVerified,
      data.image,
      data.createdAt ? new Date(data.createdAt) : new Date(),
      data.updatedAt ? new Date(data.updatedAt) : new Date()
    );
  }

  /**
   * Converts User entity to data object
   */
  toData(): UserType {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      emailVerified: this.emailVerified,
      image: this.image,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Business logic: Check if user has a complete profile
   */
  hasCompleteProfile(): boolean {
    return !!(this.name && this.emailVerified);
  }

  /**
   * Business logic: Update user profile
   */
  updateProfile(name: string, image?: string): User {
    if (!name || name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }

    return new User(
      this.id,
      this.email,
      name.trim(),
      this.emailVerified,
      image || this.image,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Business logic: Verify email
   */
  verifyEmail(): User {
    if (this.emailVerified) {
      throw new Error('Email is already verified');
    }

    return new User(
      this.id,
      this.email,
      this.name,
      true,
      this.image,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Business logic: Check if user needs to verify email
   */
  needsEmailVerification(): boolean {
    return !this.emailVerified;
  }

  /**
   * Business logic: Get display name
   */
  getDisplayName(): string {
    return this.name || this.email.split('@')[0];
  }

  /**
   * Business logic: Check if user can perform admin actions
   * This would be extended with proper role management
   */
  isAdmin(): boolean {
    // This is a simplified version - in a real app, this would check roles
    return this.email.includes('admin');
  }
}
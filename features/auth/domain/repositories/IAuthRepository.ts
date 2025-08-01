import { User } from '../entities/User';
import { AuthToken } from '../entities/AuthToken';
import { 
  SignInCredentialsType, 
  SignUpDataType, 
  PasswordResetRequestType,
  PasswordResetType,
  EmailVerificationType,
  AuthResultType,
  AuthErrorType 
} from '../schemas/UserSchemas';

/**
 * Authentication Repository Interface
 * 
 * Defines the contract for authentication operations.
 * Follows the pattern established in IAdminPreferencesRepository.
 */

// Result type for authentication operations (Either pattern)
export type AuthResult<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: AuthErrorType;
};

export interface IAuthRepository {
  /**
   * Sign in a user with email and password
   */
  signIn(credentials: SignInCredentialsType): Promise<AuthResult<AuthResultType>>;

  /**
   * Sign up a new user
   */
  signUp(userData: SignUpDataType): Promise<AuthResult<User>>;

  /**
   * Sign out the current user
   */
  signOut(): Promise<AuthResult<void>>;

  /**
   * Get current authenticated user
   */
  getCurrentUser(): Promise<AuthResult<User | null>>;

  /**
   * Refresh authentication session
   */
  refreshSession(): Promise<AuthResult<AuthResultType>>;

  /**
   * Request password reset
   */
  requestPasswordReset(request: PasswordResetRequestType): Promise<AuthResult<void>>;

  /**
   * Reset password using token
   */
  resetPassword(resetData: PasswordResetType): Promise<AuthResult<void>>;

  /**
   * Request email verification
   */
  requestEmailVerification(userId: string): Promise<AuthResult<void>>;

  /**
   * Verify email using token
   */
  verifyEmail(verification: EmailVerificationType): Promise<AuthResult<User>>;

  /**
   * Update user profile
   */
  updateProfile(userId: string, profileData: { name?: string; image?: string }): Promise<AuthResult<User>>;

  /**
   * Delete user account
   */
  deleteAccount(userId: string): Promise<AuthResult<void>>;

  /**
   * Check if email exists
   */
  emailExists(email: string): Promise<AuthResult<boolean>>;

  /**
   * Get user by ID
   */
  getUserById(userId: string): Promise<AuthResult<User | null>>;

  /**
   * Get user by email
   */
  getUserByEmail(email: string): Promise<AuthResult<User | null>>;
}
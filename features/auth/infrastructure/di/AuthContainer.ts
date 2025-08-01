import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { ISessionRepository } from '../../domain/repositories/ISessionRepository';
import { IPasswordService } from '../../domain/services/IPasswordService';
import { IEmailService } from '../../domain/services/IEmailService';

// Use Cases
import { SignInUseCase } from '../../application/use-cases/SignInUseCase';
import { SignUpUseCase } from '../../application/use-cases/SignUpUseCase';
import { SignOutUseCase } from '../../application/use-cases/SignOutUseCase';
import { ResetPasswordUseCase } from '../../application/use-cases/ResetPasswordUseCase';
import { GetCurrentUserUseCase } from '../../application/use-cases/GetCurrentUserUseCase';

// Infrastructure implementations
import { BetterAuthRepository } from '../repositories/BetterAuthRepository';
import { ApiAuthRepository } from '../repositories/ApiAuthRepository';
import { BetterAuthSessionRepository } from '../repositories/BetterAuthSessionRepository';
import { BetterAuthPasswordService } from '../services/BetterAuthPasswordService';
import { ConsoleEmailService } from '../services/ConsoleEmailService';

/**
 * Authentication Dependency Injection Container
 * 
 * Manages all dependencies for the auth feature.
 * Follows the exact pattern established in AdminContainer.
 */
export class AuthContainer {
  private static instance: AuthContainer;

  // Repositories
  private readonly authRepository: IAuthRepository;
  private readonly sessionRepository: ISessionRepository;

  // Services
  private readonly passwordService: IPasswordService;
  private readonly emailService: IEmailService;

  // Use Cases
  private readonly signInUseCase: SignInUseCase;
  private readonly signUpUseCase: SignUpUseCase;
  private readonly signOutUseCase: SignOutUseCase;
  private readonly resetPasswordUseCase: ResetPasswordUseCase;
  private readonly getCurrentUserUseCase: GetCurrentUserUseCase;

  private constructor() {
    // Initialize services first (no dependencies)
    this.passwordService = new BetterAuthPasswordService();
    this.emailService = new ConsoleEmailService(); // In production, use real email service

    // Initialize repositories with environment-based selection
    // On client-side: use API repository
    // On server-side: use Better Auth repository directly
    this.authRepository = typeof window !== 'undefined' 
      ? new ApiAuthRepository()
      : new BetterAuthRepository();

    this.sessionRepository = typeof window !== 'undefined'
      ? new BetterAuthSessionRepository() // This could also be API-based
      : new BetterAuthSessionRepository();

    // Initialize use cases with dependencies
    this.signInUseCase = new SignInUseCase(
      this.authRepository,
      this.passwordService
    );

    this.signUpUseCase = new SignUpUseCase(
      this.authRepository,
      this.passwordService,
      this.emailService
    );

    this.signOutUseCase = new SignOutUseCase(
      this.authRepository,
      this.sessionRepository
    );

    this.resetPasswordUseCase = new ResetPasswordUseCase(
      this.authRepository,
      this.passwordService,
      this.emailService
    );

    this.getCurrentUserUseCase = new GetCurrentUserUseCase(
      this.authRepository,
      this.sessionRepository
    );
  }

  /**
   * Get singleton instance
   */
  static getInstance(): AuthContainer {
    if (!AuthContainer.instance) {
      AuthContainer.instance = new AuthContainer();
    }
    return AuthContainer.instance;
  }

  /**
   * Get Sign In Use Case
   */
  getSignInUseCase(): SignInUseCase {
    return this.signInUseCase;
  }

  /**
   * Get Sign Up Use Case
   */
  getSignUpUseCase(): SignUpUseCase {
    return this.signUpUseCase;
  }

  /**
   * Get Sign Out Use Case
   */
  getSignOutUseCase(): SignOutUseCase {
    return this.signOutUseCase;
  }

  /**
   * Get Reset Password Use Case
   */
  getResetPasswordUseCase(): ResetPasswordUseCase {
    return this.resetPasswordUseCase;
  }

  /**
   * Get Current User Use Case
   */
  getGetCurrentUserUseCase(): GetCurrentUserUseCase {
    return this.getCurrentUserUseCase;
  }

  /**
   * Get Auth Repository (for direct access if needed)
   */
  getAuthRepository(): IAuthRepository {
    return this.authRepository;
  }

  /**
   * Get Session Repository (for direct access if needed)
   */
  getSessionRepository(): ISessionRepository {
    return this.sessionRepository;
  }

  /**
   * Get Password Service (for direct access if needed)
   */
  getPasswordService(): IPasswordService {
    return this.passwordService;
  }

  /**
   * Get Email Service (for direct access if needed)
   */
  getEmailService(): IEmailService {
    return this.emailService;
  }

  /**
   * Reset singleton instance (useful for testing)
   */
  static resetInstance(): void {
    AuthContainer.instance = undefined as any;
  }

  /**
   * Create instance with custom dependencies (useful for testing)
   */
  static createWithDependencies(dependencies: {
    authRepository?: IAuthRepository;
    sessionRepository?: ISessionRepository;
    passwordService?: IPasswordService;
    emailService?: IEmailService;
  }): AuthContainer {
    const container = Object.create(AuthContainer.prototype);
    
    // Use provided dependencies or defaults
    container.passwordService = dependencies.passwordService || new BetterAuthPasswordService();
    container.emailService = dependencies.emailService || new ConsoleEmailService();
    container.authRepository = dependencies.authRepository || new BetterAuthRepository();
    container.sessionRepository = dependencies.sessionRepository || new BetterAuthSessionRepository();

    // Initialize use cases with dependencies
    container.signInUseCase = new SignInUseCase(
      container.authRepository,
      container.passwordService
    );

    container.signUpUseCase = new SignUpUseCase(
      container.authRepository,
      container.passwordService,
      container.emailService
    );

    container.signOutUseCase = new SignOutUseCase(
      container.authRepository,
      container.sessionRepository
    );

    container.resetPasswordUseCase = new ResetPasswordUseCase(
      container.authRepository,
      container.passwordService,
      container.emailService
    );

    container.getCurrentUserUseCase = new GetCurrentUserUseCase(
      container.authRepository,
      container.sessionRepository
    );

    return container;
  }
}
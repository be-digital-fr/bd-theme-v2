/**
 * Email Service Interface
 * 
 * Defines the contract for email-related operations.
 * Follows clean architecture principles by abstracting infrastructure concerns.
 */

export interface EmailTemplate {
  subject: string;
  htmlBody: string;
  textBody: string;
}

export interface EmailOptions {
  priority?: 'low' | 'normal' | 'high';
  delay?: number; // seconds to delay sending
  retryAttempts?: number;
}

export interface IEmailService {
  /**
   * Send password reset email
   */
  sendPasswordResetEmail(
    email: string, 
    userName: string, 
    resetUrl: string,
    options?: EmailOptions
  ): Promise<boolean>;

  /**
   * Send email verification email
   */
  sendEmailVerificationEmail(
    email: string, 
    userName: string, 
    verificationUrl: string,
    options?: EmailOptions
  ): Promise<boolean>;

  /**
   * Send welcome email after successful registration
   */
  sendWelcomeEmail(
    email: string, 
    userName: string,
    options?: EmailOptions
  ): Promise<boolean>;

  /**
   * Send login notification email (for security)
   */
  sendLoginNotificationEmail(
    email: string, 
    userName: string, 
    loginDetails: {
      ipAddress?: string;
      userAgent?: string;
      location?: string;
      timestamp: Date;
    },
    options?: EmailOptions
  ): Promise<boolean>;

  /**
   * Send password change confirmation email
   */
  sendPasswordChangeConfirmationEmail(
    email: string, 
    userName: string,
    options?: EmailOptions
  ): Promise<boolean>;

  /**
   * Send account deletion confirmation email
   */
  sendAccountDeletionConfirmationEmail(
    email: string, 
    userName: string,
    options?: EmailOptions
  ): Promise<boolean>;

  /**
   * Send custom email with template
   */
  sendCustomEmail(
    email: string,
    template: EmailTemplate,
    variables?: Record<string, string>,
    options?: EmailOptions
  ): Promise<boolean>;

  /**
   * Generate email template for password reset
   */
  generatePasswordResetTemplate(userName: string, resetUrl: string): EmailTemplate;

  /**
   * Generate email template for email verification
   */
  generateEmailVerificationTemplate(userName: string, verificationUrl: string): EmailTemplate;

  /**
   * Generate email template for welcome message
   */
  generateWelcomeTemplate(userName: string): EmailTemplate;

  /**
   * Validate email address format
   */
  validateEmailFormat(email: string): boolean;

  /**
   * Check if email domain is valid (optional - can use DNS lookup)
   */
  validateEmailDomain?(email: string): Promise<boolean>;

  /**
   * Get email sending status/stats (optional)
   */
  getEmailStats?(): Promise<{
    sent: number;
    failed: number;
    pending: number;
  }>;
}
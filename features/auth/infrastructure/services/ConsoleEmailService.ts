import { IEmailService, EmailTemplate, EmailOptions } from '../../domain/services/IEmailService';

/**
 * Console Email Service Implementation
 * 
 * Development implementation that logs emails to console instead of sending them.
 * In production, this would be replaced with a real email service (SendGrid, AWS SES, etc.).
 */
export class ConsoleEmailService implements IEmailService {
  constructor() {}

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(
    email: string, 
    userName: string, 
    resetUrl: string,
    options?: EmailOptions
  ): Promise<boolean> {
    try {
      const template = this.generatePasswordResetTemplate(userName, resetUrl);
      
      console.log('📧 [EMAIL SERVICE] Password Reset Email');
      console.log('To:', email);
      console.log('Subject:', template.subject);
      console.log('Priority:', options?.priority || 'normal');
      console.log('Reset URL:', resetUrl);
      console.log('---');
      console.log(template.textBody);
      console.log('=====================================');

      // Simulate email sending delay
      if (options?.delay) {
        await new Promise(resolve => setTimeout(resolve, options.delay! * 1000));
      }

      return true;
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      return false;
    }
  }

  /**
   * Send email verification email
   */
  async sendEmailVerificationEmail(
    email: string, 
    userName: string, 
    verificationUrl: string,
    options?: EmailOptions
  ): Promise<boolean> {
    try {
      const template = this.generateEmailVerificationTemplate(userName, verificationUrl);
      
      console.log('📧 [EMAIL SERVICE] Email Verification');
      console.log('To:', email);
      console.log('Subject:', template.subject);
      console.log('Priority:', options?.priority || 'normal');
      console.log('Verification URL:', verificationUrl);
      console.log('---');
      console.log(template.textBody);
      console.log('=====================================');

      if (options?.delay) {
        await new Promise(resolve => setTimeout(resolve, options.delay! * 1000));
      }

      return true;
    } catch (error) {
      console.error('Failed to send email verification email:', error);
      return false;
    }
  }

  /**
   * Send welcome email after successful registration
   */
  async sendWelcomeEmail(
    email: string, 
    userName: string,
    options?: EmailOptions
  ): Promise<boolean> {
    try {
      const template = this.generateWelcomeTemplate(userName);
      
      console.log('📧 [EMAIL SERVICE] Welcome Email');
      console.log('To:', email);
      console.log('Subject:', template.subject);
      console.log('Priority:', options?.priority || 'normal');
      console.log('---');
      console.log(template.textBody);
      console.log('=====================================');

      if (options?.delay) {
        await new Promise(resolve => setTimeout(resolve, options.delay! * 1000));
      }

      return true;
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return false;
    }
  }

  /**
   * Send login notification email (for security)
   */
  async sendLoginNotificationEmail(
    email: string, 
    userName: string, 
    loginDetails: {
      ipAddress?: string;
      userAgent?: string;
      location?: string;
      timestamp: Date;
    },
    options?: EmailOptions
  ): Promise<boolean> {
    try {
      const template: EmailTemplate = {
        subject: 'Nouvelle connexion à votre compte',
        htmlBody: `
          <h2>Nouvelle connexion détectée</h2>
          <p>Bonjour ${userName},</p>
          <p>Nous avons détecté une nouvelle connexion à votre compte :</p>
          <ul>
            <li>Date : ${loginDetails.timestamp.toLocaleString('fr-FR')}</li>
            ${loginDetails.ipAddress ? `<li>Adresse IP : ${loginDetails.ipAddress}</li>` : ''}
            ${loginDetails.location ? `<li>Localisation : ${loginDetails.location}</li>` : ''}
            ${loginDetails.userAgent ? `<li>Navigateur : ${loginDetails.userAgent}</li>` : ''}
          </ul>
          <p>Si ce n'était pas vous, veuillez changer votre mot de passe immédiatement.</p>
        `,
        textBody: `
Nouvelle connexion détectée

Bonjour ${userName},

Nous avons détecté une nouvelle connexion à votre compte :
- Date : ${loginDetails.timestamp.toLocaleString('fr-FR')}
${loginDetails.ipAddress ? `- Adresse IP : ${loginDetails.ipAddress}` : ''}
${loginDetails.location ? `- Localisation : ${loginDetails.location}` : ''}
${loginDetails.userAgent ? `- Navigateur : ${loginDetails.userAgent}` : ''}

Si ce n'était pas vous, veuillez changer votre mot de passe immédiatement.
        `
      };
      
      console.log('📧 [EMAIL SERVICE] Login Notification');
      console.log('To:', email);
      console.log('Subject:', template.subject);
      console.log('Priority:', options?.priority || 'normal');
      console.log('---');
      console.log(template.textBody);
      console.log('=====================================');

      if (options?.delay) {
        await new Promise(resolve => setTimeout(resolve, options.delay! * 1000));
      }

      return true;
    } catch (error) {
      console.error('Failed to send login notification email:', error);
      return false;
    }
  }

  /**
   * Send password change confirmation email
   */
  async sendPasswordChangeConfirmationEmail(
    email: string, 
    userName: string,
    options?: EmailOptions
  ): Promise<boolean> {
    try {
      const template: EmailTemplate = {
        subject: 'Mot de passe modifié',
        htmlBody: `
          <h2>Mot de passe modifié avec succès</h2>
          <p>Bonjour ${userName},</p>
          <p>Votre mot de passe a été modifié avec succès.</p>
          <p>Si vous n'avez pas effectué cette modification, contactez-nous immédiatement.</p>
        `,
        textBody: `
Mot de passe modifié avec succès

Bonjour ${userName},

Votre mot de passe a été modifié avec succès.

Si vous n'avez pas effectué cette modification, contactez-nous immédiatement.
        `
      };
      
      console.log('📧 [EMAIL SERVICE] Password Change Confirmation');
      console.log('To:', email);
      console.log('Subject:', template.subject);
      console.log('Priority:', options?.priority || 'normal');
      console.log('---');
      console.log(template.textBody);
      console.log('=====================================');

      if (options?.delay) {
        await new Promise(resolve => setTimeout(resolve, options.delay! * 1000));
      }

      return true;
    } catch (error) {
      console.error('Failed to send password change confirmation email:', error);
      return false;
    }
  }

  /**
   * Send account deletion confirmation email
   */
  async sendAccountDeletionConfirmationEmail(
    email: string, 
    userName: string,
    options?: EmailOptions
  ): Promise<boolean> {
    try {
      const template: EmailTemplate = {
        subject: 'Compte supprimé',
        htmlBody: `
          <h2>Compte supprimé avec succès</h2>
          <p>Bonjour ${userName},</p>
          <p>Votre compte a été supprimé définitivement comme demandé.</p>
          <p>Nous sommes désolés de vous voir partir. N'hésitez pas à revenir quand vous le souhaitez.</p>
        `,
        textBody: `
Compte supprimé avec succès

Bonjour ${userName},

Votre compte a été supprimé définitivement comme demandé.

Nous sommes désolés de vous voir partir. N'hésitez pas à revenir quand vous le souhaitez.
        `
      };
      
      console.log('📧 [EMAIL SERVICE] Account Deletion Confirmation');
      console.log('To:', email);
      console.log('Subject:', template.subject);
      console.log('Priority:', options?.priority || 'normal');
      console.log('---');
      console.log(template.textBody);
      console.log('=====================================');

      if (options?.delay) {
        await new Promise(resolve => setTimeout(resolve, options.delay! * 1000));
      }

      return true;
    } catch (error) {
      console.error('Failed to send account deletion confirmation email:', error);
      return false;
    }
  }

  /**
   * Send custom email with template
   */
  async sendCustomEmail(
    email: string,
    template: EmailTemplate,
    variables?: Record<string, string>,
    options?: EmailOptions
  ): Promise<boolean> {
    try {
      let subject = template.subject;
      let htmlBody = template.htmlBody;
      let textBody = template.textBody;

      // Replace variables in template
      if (variables) {
        Object.entries(variables).forEach(([key, value]) => {
          const placeholder = `{{${key}}}`;
          subject = subject.replace(new RegExp(placeholder, 'g'), value);
          htmlBody = htmlBody.replace(new RegExp(placeholder, 'g'), value);
          textBody = textBody.replace(new RegExp(placeholder, 'g'), value);
        });
      }
      
      console.log('📧 [EMAIL SERVICE] Custom Email');
      console.log('To:', email);
      console.log('Subject:', subject);
      console.log('Priority:', options?.priority || 'normal');
      console.log('Variables:', variables);
      console.log('---');
      console.log(textBody);
      console.log('=====================================');

      if (options?.delay) {
        await new Promise(resolve => setTimeout(resolve, options.delay! * 1000));
      }

      return true;
    } catch (error) {
      console.error('Failed to send custom email:', error);
      return false;
    }
  }

  /**
   * Generate email template for password reset
   */
  generatePasswordResetTemplate(userName: string, resetUrl: string): EmailTemplate {
    return {
      subject: 'Réinitialisation de votre mot de passe',
      htmlBody: `
        <h2>Réinitialisation de mot de passe</h2>
        <p>Bonjour ${userName},</p>
        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
        <p>Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :</p>
        <p><a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Réinitialiser mon mot de passe</a></p>
        <p>Ce lien expirera dans 1 heure.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, ignorez ce message.</p>
      `,
      textBody: `
Réinitialisation de mot de passe

Bonjour ${userName},

Vous avez demandé la réinitialisation de votre mot de passe.

Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :
${resetUrl}

Ce lien expirera dans 1 heure.

Si vous n'avez pas demandé cette réinitialisation, ignorez ce message.
      `
    };
  }

  /**
   * Generate email template for email verification
   */
  generateEmailVerificationTemplate(userName: string, verificationUrl: string): EmailTemplate {
    return {
      subject: 'Vérifiez votre adresse email',
      htmlBody: `
        <h2>Vérification d'email</h2>
        <p>Bonjour ${userName},</p>
        <p>Merci de vous être inscrit ! Pour terminer votre inscription, veuillez vérifier votre adresse email.</p>
        <p>Cliquez sur le lien ci-dessous :</p>
        <p><a href="${verificationUrl}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Vérifier mon email</a></p>
        <p>Ce lien expirera dans 24 heures.</p>
      `,
      textBody: `
Vérification d'email

Bonjour ${userName},

Merci de vous être inscrit ! Pour terminer votre inscription, veuillez vérifier votre adresse email.

Cliquez sur le lien ci-dessous :
${verificationUrl}

Ce lien expirera dans 24 heures.
      `
    };
  }

  /**
   * Generate email template for welcome message
   */
  generateWelcomeTemplate(userName: string): EmailTemplate {
    return {
      subject: 'Bienvenue !',
      htmlBody: `
        <h2>Bienvenue ${userName} !</h2>
        <p>Votre compte a été créé avec succès.</p>
        <p>Nous sommes ravis de vous compter parmi nous !</p>
        <p>N'hésitez pas à explorer toutes les fonctionnalités disponibles.</p>
      `,
      textBody: `
Bienvenue ${userName} !

Votre compte a été créé avec succès.

Nous sommes ravis de vous compter parmi nous !

N'hésitez pas à explorer toutes les fonctionnalités disponibles.
      `
    };
  }

  /**
   * Validate email address format
   */
  validateEmailFormat(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Check if email domain is valid (stub implementation)
   */
  async validateEmailDomain(email: string): Promise<boolean> {
    try {
      // In a real implementation, this would do DNS lookup
      const domain = email.split('@')[1];
      const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'test.local'];
      return commonDomains.includes(domain);
    } catch (error) {
      console.error('Email domain validation error:', error);
      return false;
    }
  }

  /**
   * Get email sending stats (stub implementation)
   */
  async getEmailStats(): Promise<{
    sent: number;
    failed: number;
    pending: number;
  }> {
    // In a real implementation, this would return actual stats
    return {
      sent: 0,
      failed: 0,
      pending: 0
    };
  }
}
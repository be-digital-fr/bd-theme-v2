import * as Sentry from '@sentry/nextjs';

interface FormErrorContext {
  formType: 'create' | 'update' | 'delete';
  entityType: 'product' | 'category' | 'ingredient' | 'extra' | 'collection';
  entityId?: string;
  userId?: string;
  formData?: Record<string, any>;
}

interface ValidationErrorDetails {
  field: string;
  message: string;
  value?: any;
}

export class SentryFormErrorCapture {
  /**
   * Capture form submission errors with context
   */
  static captureFormError(
    error: Error,
    context: FormErrorContext,
    additionalData?: Record<string, any>
  ) {
    Sentry.withScope((scope) => {
      // Set error context
      scope.setTag('error.type', 'form_submission');
      scope.setTag('form.type', context.formType);
      scope.setTag('entity.type', context.entityType);
      
      if (context.entityId) {
        scope.setTag('entity.id', context.entityId);
      }
      
      if (context.userId) {
        scope.setUser({ id: context.userId });
      }

      // Set form context
      scope.setContext('form', {
        type: context.formType,
        entity: context.entityType,
        entityId: context.entityId,
        timestamp: new Date().toISOString(),
      });

      // Add form data (sanitized)
      if (context.formData) {
        const sanitizedFormData = this.sanitizeFormData(context.formData);
        scope.setContext('formData', sanitizedFormData);
      }

      // Add additional context
      if (additionalData) {
        scope.setContext('additional', additionalData);
      }

      // Set error level based on error type
      if (this.isValidationError(error)) {
        scope.setLevel('warning');
        scope.setTag('error.category', 'validation');
      } else if (this.isNetworkError(error)) {
        scope.setLevel('error');
        scope.setTag('error.category', 'network');
      } else if (this.isDatabaseError(error)) {
        scope.setLevel('error');
        scope.setTag('error.category', 'database');
      } else {
        scope.setLevel('error');
        scope.setTag('error.category', 'unknown');
      }

      // Capture the error
      Sentry.captureException(error);
    });
  }

  /**
   * Capture validation errors specifically
   */
  static captureValidationError(
    validationErrors: ValidationErrorDetails[],
    context: FormErrorContext
  ) {
    Sentry.withScope((scope) => {
      scope.setTag('error.type', 'form_validation');
      scope.setTag('form.type', context.formType);
      scope.setTag('entity.type', context.entityType);
      scope.setLevel('warning');

      scope.setContext('validation', {
        errors: validationErrors,
        fieldCount: validationErrors.length,
        failedFields: validationErrors.map(e => e.field),
      });

      scope.setContext('form', {
        type: context.formType,
        entity: context.entityType,
        entityId: context.entityId,
      });

      // Create a custom error for validation
      const validationError = new Error(
        `Form validation failed: ${validationErrors.length} field(s) invalid`
      );
      validationError.name = 'FormValidationError';

      Sentry.captureException(validationError);
    });
  }

  /**
   * Capture successful form operations for monitoring
   */
  static captureFormSuccess(
    context: FormErrorContext,
    duration?: number
  ) {
    // Only capture in production for analytics
    if (process.env.NODE_ENV === 'production') {
      Sentry.addBreadcrumb({
        category: 'form.success',
        message: `${context.formType} ${context.entityType} completed successfully`,
        level: 'info',
        data: {
          formType: context.formType,
          entityType: context.entityType,
          entityId: context.entityId,
          duration: duration ? `${duration}ms` : undefined,
        },
      });
    }
  }

  /**
   * Sanitize form data to remove sensitive information
   */
  private static sanitizeFormData(formData: Record<string, any>): Record<string, any> {
    const sensitiveFields = [
      'password',
      'token',
      'secret',
      'key',
      'email',
      'phone',
      'ssn',
      'creditCard',
    ];

    const sanitized = { ...formData };

    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    }

    // Recursively sanitize nested objects
    for (const [key, value] of Object.entries(sanitized)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        sanitized[key] = this.sanitizeFormData(value);
      }
    }

    return sanitized;
  }

  /**
   * Check if error is a validation error
   */
  private static isValidationError(error: Error): boolean {
    return (
      error.name === 'ZodError' ||
      error.message.includes('validation') ||
      error.message.includes('Invalid') ||
      error.message.includes('required')
    );
  }

  /**
   * Check if error is a network error
   */
  private static isNetworkError(error: Error): boolean {
    return (
      error.message.includes('fetch') ||
      error.message.includes('network') ||
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('timeout')
    );
  }

  /**
   * Check if error is a database error
   */
  private static isDatabaseError(error: Error): boolean {
    return (
      error.message.includes('Prisma') ||
      error.message.includes('database') ||
      error.message.includes('UNIQUE constraint') ||
      error.message.includes('Foreign key')
    );
  }
}

// Convenience functions for common use cases
export const captureProductFormError = (
  error: Error,
  formType: FormErrorContext['formType'],
  productId?: string,
  formData?: Record<string, any>
) => {
  SentryFormErrorCapture.captureFormError(error, {
    formType,
    entityType: 'product',
    entityId: productId,
    formData,
  });
};

export const captureCategoryFormError = (
  error: Error,
  formType: FormErrorContext['formType'],
  categoryId?: string,
  formData?: Record<string, any>
) => {
  SentryFormErrorCapture.captureFormError(error, {
    formType,
    entityType: 'category',
    entityId: categoryId,
    formData,
  });
};

export const captureIngredientFormError = (
  error: Error,
  formType: FormErrorContext['formType'],
  ingredientId?: string,
  formData?: Record<string, any>
) => {
  SentryFormErrorCapture.captureFormError(error, {
    formType,
    entityType: 'ingredient',
    entityId: ingredientId,
    formData,
  });
};
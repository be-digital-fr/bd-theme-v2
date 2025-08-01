import { z } from 'zod';

/**
 * User Domain Schemas
 * 
 * Contains all validation schemas related to User entity.
 * Follows the pattern established in AdminPreferencesSchema.
 */

// Base User Schema
export const UserSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(255, 'Email must not exceed 255 characters'),
  name: z
    .string()
    .nullable()
    .refine(
      (name) => name === null || (name.length >= 2 && name.length <= 100),
      'Name must be between 2 and 100 characters when provided'
    ),
  emailVerified: z.boolean().default(false),
  image: z
    .string()
    .url('Invalid image URL')
    .nullable(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

// User Update Schema
export const UpdateUserSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .optional(),
  image: z
    .string()
    .url('Invalid image URL')
    .nullable()
    .optional(),
});

// User Profile Schema (for forms)
export const UserProfileFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  image: z
    .string()
    .url('URL d\'image invalide')
    .nullable()
    .optional(),
});

// Sign Up Data Schema (for domain use cases - without confirmPassword)
export const SignUpDataSchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide')
    .max(255, 'L\'email ne peut pas dépasser 255 caractères'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .max(128, 'Le mot de passe ne peut pas dépasser 128 caractères')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'
    ),
});

// Sign Up Form Schema (for UI components - with confirmPassword validation)
export const SignUpFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide')
    .max(255, 'L\'email ne peut pas dépasser 255 caractères'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .max(128, 'Le mot de passe ne peut pas dépasser 128 caractères')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

// Sign In Credentials Schema
export const SignInCredentialsSchema = z.object({
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide'),
  password: z
    .string()
    .min(1, 'Le mot de passe est requis'),
});

// Password Reset Request Schema
export const PasswordResetRequestSchema = z.object({
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide'),
});

// Password Reset Schema
export const PasswordResetSchema = z.object({
  token: z
    .string()
    .min(1, 'Token de réinitialisation requis'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .max(128, 'Le mot de passe ne peut pas dépasser 128 caractères')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

// Email Verification Schema
export const EmailVerificationSchema = z.object({
  token: z
    .string()
    .min(1, 'Token de vérification requis'),
});

// User Public Info Schema (for API responses)
export const UserPublicSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
});

// Better Auth Response Schema for validation
export const BetterAuthUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional().nullable(),
  emailVerified: z.boolean().optional(),
  image: z.string().optional().nullable(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const BetterAuthSessionSchema = z.object({
  id: z.string(),
  token: z.string().optional(),
  expiresAt: z.string().optional(),
});

export const BetterAuthResponseSchema = z.object({
  user: BetterAuthUserSchema.nullable(),
  session: BetterAuthSessionSchema.nullable().optional(),
  token: z.string().optional(),
});

// Auth Result Types
export const AuthResultSchema = z.object({
  user: UserPublicSchema,
  session: z.object({
    id: z.string(),
    token: z.string(),
    expiresAt: z.date(),
  }),
});

// Type exports
export type UserType = z.infer<typeof UserSchema>;
export type UpdateUserType = z.infer<typeof UpdateUserSchema>;
export type UserProfileFormType = z.infer<typeof UserProfileFormSchema>;
export type SignUpDataType = z.infer<typeof SignUpDataSchema>;
export type SignUpFormType = z.infer<typeof SignUpFormSchema>;
export type SignInCredentialsType = z.infer<typeof SignInCredentialsSchema>;
export type PasswordResetRequestType = z.infer<typeof PasswordResetRequestSchema>;
export type PasswordResetType = z.infer<typeof PasswordResetSchema>;
export type EmailVerificationType = z.infer<typeof EmailVerificationSchema>;
export type UserPublicType = z.infer<typeof UserPublicSchema>;
export type BetterAuthUserType = z.infer<typeof BetterAuthUserSchema>;
export type BetterAuthResponseType = z.infer<typeof BetterAuthResponseSchema>;
export type AuthResultType = z.infer<typeof AuthResultSchema>;

// Error Type for domain consistency
export type AuthErrorType = {
  code: string;
  message: string;
  details?: any; // Optional details for additional error information
};
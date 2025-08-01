import { z } from 'zod';

/**
 * Authentication Domain Schemas
 * 
 * Contains all validation schemas related to authentication entities.
 * Follows the pattern established in AdminPreferencesSchema.
 */

// Token Purpose Enum
export const TokenPurposeSchema = z.enum(['password-reset', 'email-verification']);
export type TokenPurpose = z.infer<typeof TokenPurposeSchema>;

// Session Schema
export const SessionSchema = z.object({
  id: z.string().min(1, 'Session ID is required'),
  userId: z.string().min(1, 'User ID is required'),
  token: z.string().min(10, 'Token must be at least 10 characters'),
  expiresAt: z.date(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
  createdAt: z.date().default(() => new Date()),
});

// AuthToken Schema
export const AuthTokenSchema = z.object({
  id: z.string().min(1, 'Token ID is required'),
  userId: z.string().min(1, 'User ID is required'),
  token: z.string().min(10, 'Token must be at least 10 characters'),
  purpose: TokenPurposeSchema,
  expiresAt: z.date(),
  used: z.boolean().default(false),
  createdAt: z.date().default(() => new Date()),
});

// Auth Result Schema (successful authentication response)
export const AuthResultSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string().nullable(),
    emailVerified: z.boolean(),
    image: z.string().nullable(),
  }),
  session: z.object({
    id: z.string(),
    token: z.string(),
    expiresAt: z.date(),
  }),
});

// Auth Error Schema
export const AuthErrorSchema = z.object({
  code: z.enum([
    'INVALID_CREDENTIALS',
    'USER_NOT_FOUND',
    'EMAIL_ALREADY_EXISTS',
    'INVALID_TOKEN',
    'TOKEN_EXPIRED',
    'TOKEN_USED',
    'WEAK_PASSWORD',
    'EMAIL_NOT_VERIFIED',
    'SESSION_EXPIRED',
    'UNAUTHORIZED',
    'FORBIDDEN',
    'TOO_MANY_ATTEMPTS',
    'INTERNAL_ERROR'
  ]),
  message: z.string(),
  details: z.record(z.any()).optional(),
});

// Create Session Request Schema
export const CreateSessionRequestSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  token: z.string().min(10, 'Token must be at least 10 characters'),
  expirationHours: z.number().min(1).max(8760).default(24), // Max 1 year
  ipAddress: z.string().nullable().optional(),
  userAgent: z.string().nullable().optional(),
});

// Update Session Schema
export const UpdateSessionSchema = z.object({
  expiresAt: z.date().optional(),
  ipAddress: z.string().nullable().optional(),
  userAgent: z.string().nullable().optional(),
});

// Create AuthToken Request Schema
export const CreateAuthTokenRequestSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  token: z.string().min(10, 'Token must be at least 10 characters'),
  purpose: TokenPurposeSchema,
  expirationHours: z.number().min(0.1).max(168).default(1), // Max 1 week
});

// Session Info Schema (for API responses)
export const SessionInfoSchema = z.object({
  id: z.string(),
  userId: z.string(),
  expiresAt: z.date(),
  createdAt: z.date(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
  isValid: z.boolean(),
  expiresSoon: z.boolean(),
  ageInDays: z.number(),
});

// Auth Status Schema
export const AuthStatusSchema = z.object({
  isAuthenticated: z.boolean(),
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string().nullable(),
    emailVerified: z.boolean(),
    image: z.string().nullable(),
    hasCompleteProfile: z.boolean(),
    needsEmailVerification: z.boolean(),
    displayName: z.string(),
  }).nullable(),
  session: z.object({
    id: z.string(),
    expiresAt: z.date(),
    expiresSoon: z.boolean(),
    ageInDays: z.number(),
  }).nullable(),
});

// Better Auth Integration Schemas
export const BetterAuthUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  image: z.string().nullable(),
  emailVerified: z.boolean(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
});

export const BetterAuthSessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  expiresAt: z.string().or(z.date()),
  token: z.string(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
});

export const BetterAuthResponseSchema = z.object({
  user: BetterAuthUserSchema.optional(),
  session: BetterAuthSessionSchema.optional(),
  token: z.string().optional(),
});

// Type exports
export type SessionType = z.infer<typeof SessionSchema>;
export type AuthTokenType = z.infer<typeof AuthTokenSchema>;
export type AuthResultType = z.infer<typeof AuthResultSchema>;
export type AuthErrorType = z.infer<typeof AuthErrorSchema>;
export type CreateSessionRequestType = z.infer<typeof CreateSessionRequestSchema>;
export type UpdateSessionType = z.infer<typeof UpdateSessionSchema>;
export type CreateAuthTokenRequestType = z.infer<typeof CreateAuthTokenRequestSchema>;
export type SessionInfoType = z.infer<typeof SessionInfoSchema>;
export type AuthStatusType = z.infer<typeof AuthStatusSchema>;
export type BetterAuthUserType = z.infer<typeof BetterAuthUserSchema>;
export type BetterAuthSessionType = z.infer<typeof BetterAuthSessionSchema>;
export type BetterAuthResponseType = z.infer<typeof BetterAuthResponseSchema>;
import { Session } from '../entities/Session';
import { 
  CreateSessionRequestType, 
  UpdateSessionType,
  SessionInfoType,
  AuthErrorType 
} from '../schemas/AuthSchemas';

/**
 * Session Repository Interface
 * 
 * Defines the contract for session management operations.
 * Follows the pattern established in IAdminPreferencesRepository.
 */

// Result type for session operations (Either pattern)
export type SessionResult<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: AuthErrorType;
};

export interface ISessionRepository {
  /**
   * Create a new session
   */
  create(request: CreateSessionRequestType): Promise<SessionResult<Session>>;

  /**
   * Get session by ID
   */
  getById(sessionId: string): Promise<SessionResult<Session | null>>;

  /**
   * Get session by token
   */
  getByToken(token: string): Promise<SessionResult<Session | null>>;

  /**
   * Get all sessions for a user
   */
  getByUserId(userId: string): Promise<SessionResult<Session[]>>;

  /**
   * Update session
   */
  update(sessionId: string, updateData: UpdateSessionType): Promise<SessionResult<Session>>;

  /**
   * Delete session by ID
   */
  delete(sessionId: string): Promise<SessionResult<void>>;

  /**
   * Delete session by token
   */
  deleteByToken(token: string): Promise<SessionResult<void>>;

  /**
   * Delete all sessions for a user
   */
  deleteAllForUser(userId: string): Promise<SessionResult<void>>;

  /**
   * Extend session expiration
   */
  extend(sessionId: string, extensionHours: number): Promise<SessionResult<Session>>;

  /**
   * Get session info (without sensitive data)
   */
  getSessionInfo(sessionId: string): Promise<SessionResult<SessionInfoType | null>>;

  /**
   * Get all active sessions for a user
   */
  getActiveSessionsForUser(userId: string): Promise<SessionResult<SessionInfoType[]>>;

  /**
   * Delete expired sessions (cleanup task)
   */
  deleteExpiredSessions(): Promise<SessionResult<number>>;

  /**
   * Check if session is valid
   */
  isValid(sessionId: string): Promise<SessionResult<boolean>>;

  /**
   * Get sessions that expire soon for notification purposes
   */
  getSessionsExpiringSoon(userId: string): Promise<SessionResult<Session[]>>;
}
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContainer } from '../../infrastructure/di/AuthContainer';
import type { SignInCredentialsType } from '../../domain/schemas/UserSchemas';
import { captureAuthError, AuthErrorType, setAuthUserContext, startAuthTransaction } from '@/lib/sentry-auth-client';

interface UseSignInOptions {
  callbackUrl?: string;
  onSuccess?: () => void;
}

interface UseSignInReturn {
  signIn: (credentials: SignInCredentialsType) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

/**
 * Presentation layer hook for sign-in functionality
 * 
 * Connects the presentation layer to the application layer through dependency injection.
 * Handles UI concerns like loading state, error display, and navigation.
 */
export function useSignIn({ callbackUrl = "/dashboard", onSuccess }: UseSignInOptions = {}): UseSignInReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const signIn = async (credentials: SignInCredentialsType) => {
    setIsLoading(true);
    setError(null);

    const transaction = startAuthTransaction("signin");

    try {
      // Get the sign-in use case from the dependency injection container
      const signInUseCase = AuthContainer.getInstance().getSignInUseCase();
      
      // Execute the business logic
      const result = await signInUseCase.execute(credentials);

      if (!result.success) {
        const errorMessage = result.error.message;
        setError(errorMessage);
        
        // Capture auth error in Sentry
        captureAuthError(
          result.error.message,
          AuthErrorType.SIGNIN_FAILED,
          {
            email: credentials.email,
            callbackUrl,
            errorCode: result.error.code,
          }
        );
        
        transaction.setStatus("unauthenticated");
        return;
      }

      // Set user context in Sentry
      if (result.data.user) {
        setAuthUserContext({
          id: result.data.user.id,
          email: result.data.user.email,
          name: result.data.user.name || undefined,
        });
      }

      transaction.setStatus("ok");

      // Handle successful sign-in
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(callbackUrl);
        router.refresh();
      }

    } catch (err: unknown) {
      const errorMessage = "Une erreur inattendue s'est produite";
      setError(errorMessage);
      
      // Capture unexpected error in Sentry
      captureAuthError(
        err instanceof Error ? err : new Error(String(err)),
        AuthErrorType.SIGNIN_FAILED,
        {
          email: credentials.email,
          callbackUrl,
          unexpected: true,
        }
      );
      
      transaction.setStatus("internal_error");
      console.error("Sign in error:", err);
    } finally {
      setIsLoading(false);
      transaction.finish();
    }
  };

  const clearError = () => setError(null);

  return {
    signIn,
    isLoading,
    error,
    clearError,
  };
}
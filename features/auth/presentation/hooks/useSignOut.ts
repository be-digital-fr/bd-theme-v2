import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContainer } from '../../infrastructure/di/AuthContainer';

interface UseSignOutOptions {
  redirectTo?: string;
  onSuccess?: () => void;
}

interface UseSignOutReturn {
  signOut: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

/**
 * Presentation layer hook for sign-out functionality
 * 
 * Connects the presentation layer to the application layer through dependency injection.
 * Handles UI concerns like loading state, error display, and navigation after sign out.
 */
export function useSignOut({ redirectTo = "/", onSuccess }: UseSignOutOptions = {}): UseSignOutReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const signOut = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get the sign-out use case from the dependency injection container
      const signOutUseCase = AuthContainer.getInstance().getSignOutUseCase();
      
      // Execute the business logic
      const result = await signOutUseCase.execute();

      if (!result.success) {
        const errorMessage = result.error.message;
        setError(errorMessage);
        console.error("Sign out error:", result.error);
        return;
      }

      // Handle successful sign-out
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(redirectTo);
        router.refresh();
      }

    } catch (err: unknown) {
      const errorMessage = "Une erreur inattendue s'est produite lors de la déconnexion";
      setError(errorMessage);
      console.error("Sign out error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    signOut,
    isLoading,
    error,
    clearError,
  };
}
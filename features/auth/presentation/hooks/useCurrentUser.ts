import { useState, useEffect } from 'react';
import { AuthContainer } from '../../infrastructure/di/AuthContainer';
import type { User } from '../../domain/entities/User';

interface UseCurrentUserReturn {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Presentation layer hook for getting current user
 * 
 * Connects the presentation layer to the application layer through dependency injection.
 * Provides the current authenticated user and handles loading/error states.
 */
export function useCurrentUser(): UseCurrentUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get the current user use case from the dependency injection container
      const getCurrentUserUseCase = AuthContainer.getInstance().getGetCurrentUserUseCase();
      
      // Execute the business logic
      const result = await getCurrentUserUseCase.execute();

      if (!result.success) {
        setError(result.error.message);
        setUser(null);
        return;
      }

      setUser(result.data);

    } catch (err: unknown) {
      const errorMessage = "Une erreur s'est produite lors de la récupération de l'utilisateur";
      setError(errorMessage);
      setUser(null);
      console.error("Get current user error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const refetch = async () => {
    await fetchUser();
  };

  return {
    user,
    isLoading,
    error,
    refetch,
  };
}
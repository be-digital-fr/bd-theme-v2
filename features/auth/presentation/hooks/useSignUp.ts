import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContainer } from '../../infrastructure/di/AuthContainer';
import type { SignUpDataType } from '../../domain/schemas/UserSchemas';

interface UseSignUpOptions {
  callbackUrl?: string;
  onSuccess?: () => void;
}

// Allow both formats: with or without confirmPassword
type SignUpInput = SignUpDataType | (SignUpDataType & { confirmPassword?: string });

interface UseSignUpReturn {
  signUp: (userData: SignUpInput) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
  clearError: () => void;
  clearSuccess: () => void;
}

/**
 * Presentation layer hook for sign-up functionality
 * 
 * Connects the presentation layer to the application layer through dependency injection.
 * Handles UI concerns like loading state, error display, success state, and navigation.
 */
export function useSignUp({ callbackUrl = "/", onSuccess }: UseSignUpOptions = {}): UseSignUpReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const signUp = async (userData: SignUpInput) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Get the sign-up use case from the dependency injection container
      const signUpUseCase = AuthContainer.getInstance().getSignUpUseCase();
      
      // Transform data: extract confirmPassword if present (UI concern)
      // The domain layer doesn't need confirmPassword - it's only for UI validation
      const { confirmPassword: _, ...domainData } = userData as any;
      const cleanUserData: SignUpDataType = {
        name: domainData.name,
        email: domainData.email,
        password: domainData.password,
      };
      
      // Execute the business logic
      const result = await signUpUseCase.execute(cleanUserData);

      if (!result.success) {
        const errorMessage = result.error.message;
        setError(errorMessage);
        console.error("Sign up error:", result.error);
        return;
      }

      // Handle successful sign-up
      setSuccess(true);
      
      // Delay navigation to show success message
      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      } else {
        setTimeout(() => {
          router.push(callbackUrl);
          router.refresh();
        }, 2000);
      }

    } catch (err: unknown) {
      const errorMessage = "Une erreur inattendue s'est produite";
      setError(errorMessage);
      console.error("Sign up error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);
  const clearSuccess = () => setSuccess(false);

  return {
    signUp,
    isLoading,
    error,
    success,
    clearError,
    clearSuccess,
  };
}
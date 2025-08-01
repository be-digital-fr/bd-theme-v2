"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { signUpSchema, type SignUpForm } from "@/lib/auth-schemas";
import { useSignUp } from "@/features/auth/presentation/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Spinner } from "@/components/ui/spinner";
import { SocialAuthButtons } from "./social-auth-buttons";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { AuthSettings } from "@/hooks/useAuthSettings";

interface SignUpFormProps {
  callbackUrl?: string;
  onSuccess?: () => void;
  onModeChange?: (mode: 'signin' | 'signup' | 'forgot-password') => void;
  authSettings?: AuthSettings;
  hideCard?: boolean;
}

export function SignUpForm({ 
  callbackUrl = "/",
  onSuccess,
  onModeChange,
  authSettings
}: SignUpFormProps) {
  const { signUp, isLoading, error, success, clearError } = useSignUp({
    callbackUrl,
    onSuccess,
  });

  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignUpForm) => {
    clearError();
    // Pass all form data - the hook will handle extracting confirmPassword
    await signUp(data);
  };

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <CardTitle className="text-green-600">
              Inscription réussie !
            </CardTitle>
            <CardDescription>
              Votre compte a été créé avec succès. Redirection en cours...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Inscription</CardTitle>
          <CardDescription>
            Créez votre compte
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom complet</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Jean Dupont"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="••••••••"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmer le mot de passe</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="••••••••"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Spinner size="sm" className="text-primary-foreground" />
                ) : (
                  "S'inscrire"
                )}
              </Button>
            </form>

            {/* Social Auth */}
            {authSettings && (
              <SocialAuthButtons 
                authSettings={authSettings}
                disabled={isLoading}
                onError={(errorMessage) => {
                  // This is handled by social auth independently
                  console.error('Social auth error:', errorMessage);
                }}
              />
            )}
          </Form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            Déjà un compte ?{" "}
            {onModeChange ? (
              <button
                type="button"
                onClick={() => onModeChange('signin')}
                className="text-primary hover:underline"
              >
                Se connecter
              </button>
            ) : (
              <Link href="/auth/signin" className="text-primary hover:underline">
                Se connecter
              </Link>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
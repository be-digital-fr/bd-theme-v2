"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { signInSchema, type SignInForm } from "@/lib/auth-schemas";
import { useSignIn } from "@/features/auth/presentation/hooks";
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

interface SignInFormProps {
  callbackUrl?: string;
  onSuccess?: () => void;
  onModeChange?: (mode: 'signin' | 'signup' | 'forgot-password') => void;
  authSettings?: AuthSettings;
  hideCard?: boolean;
}

export function SignInForm({ 
  callbackUrl = "/",
  onSuccess,
  onModeChange,
  authSettings,
  hideCard = false
}: SignInFormProps) {
  const { signIn, isLoading, error, clearError } = useSignIn({
    callbackUrl,
    onSuccess,
  });

  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInForm) => {
    clearError();
    await signIn({
      email: data.email,
      password: data.password,
    });
  };

  const formContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <Spinner size="sm" className="text-primary-foreground" />
          ) : (
            "Se connecter"
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
  );

  const footerContent = (
    <div className="flex flex-col space-y-2 text-center">
      {onModeChange ? (
        <button
          type="button"
          onClick={() => onModeChange('forgot-password')}
          className="text-sm text-muted-foreground hover:text-primary underline"
        >
          Mot de passe oublié ?
        </button>
      ) : (
        <Link
          href="/auth/forgot-password"
          className="text-sm text-muted-foreground hover:text-primary underline"
        >
          Mot de passe oublié ?
        </Link>
      )}
      <div className="text-sm text-muted-foreground">
        Pas encore de compte ?{" "}
        {onModeChange ? (
          <button
            type="button"
            onClick={() => onModeChange('signup')}
            className="text-primary hover:underline"
          >
            S&apos;inscrire
          </button>
        ) : (
          <Link href="/auth/signup" className="text-primary hover:underline">
            S&apos;inscrire
          </Link>
        )}
      </div>
    </div>
  );

  if (hideCard) {
    return (
      <div className="space-y-6">
        {formContent}
        {footerContent}
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Connexion</CardTitle>
          <CardDescription>
            Connectez-vous à votre compte
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {formContent}
        </CardContent>

        <CardFooter>
          {footerContent}
        </CardFooter>
      </Card>
    </div>
  );
}
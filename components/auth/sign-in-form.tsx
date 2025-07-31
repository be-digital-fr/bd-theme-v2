"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { signInSchema, type SignInForm } from "@/lib/auth-schemas";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface SignInFormProps {
  callbackUrl?: string;
  onSuccess?: () => void;
  onModeChange?: (mode: 'signin' | 'signup' | 'forgot-password') => void;
  showSocialButtons?: boolean;
  socialProviders?: {
    google?: boolean;
    facebook?: boolean;
    twitter?: boolean;
    github?: boolean;
  };
  hideCard?: boolean;
}

export function SignInForm({ 
  callbackUrl = "/dashboard",
  onSuccess,
  onModeChange,
  showSocialButtons = false,
  socialProviders = {},
  hideCard = false
}: SignInFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInForm) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: result, error: signInError } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: callbackUrl,
      });

      if (signInError) {
        setError(signInError.message || "Erreur lors de la connexion");
        return;
      }

      if (result) {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(callbackUrl);
          router.refresh();
        }
      }
    } catch (err) {
      setError("Une erreur inattendue s'est produite");
      console.error("Sign in error:", err);
    } finally {
      setIsLoading(false);
    }
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
                  <Input
                    type="password"
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
          {isLoading ? "Connexion..." : "Se connecter"}
        </Button>
      </form>
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
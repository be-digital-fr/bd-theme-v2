"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { forgotPasswordSchema, type ForgotPasswordForm } from "@/lib/auth-schemas";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
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

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
  onModeChange?: (mode: 'signin' | 'signup' | 'forgot-password') => void;
  hideCard?: boolean;
}

export function ForgotPasswordForm({
  onSuccess,
  onModeChange
}: ForgotPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: resetError } = await authClient.forgetPassword({
        email: data.email,
        redirectTo: "/auth/reset-password",
      });

      if (resetError) {
        setError(resetError.message || "Erreur lors de l'envoi de l'email");
        return;
      }

      setSuccess(true);
      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      }
    } catch (err) {
      setError("Une erreur inattendue s'est produite");
      console.error("Forgot password error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <CardTitle>Email envoyé !</CardTitle>
            <CardDescription>
              Nous avons envoyé un lien de réinitialisation à votre adresse email.
              Vérifiez votre boîte de réception et suivez les instructions.
            </CardDescription>
          </CardHeader>
          
          <CardFooter className="flex justify-center">
            {onModeChange ? (
              <button
                type="button"
                onClick={() => onModeChange('signin')}
                className="text-sm text-primary hover:underline"
              >
                Retour à la connexion
              </button>
            ) : (
              <Link
                href="/auth/signin"
                className="text-sm text-primary hover:underline"
              >
                Retour à la connexion
              </Link>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Mot de passe oublié</CardTitle>
          <CardDescription>
            Entrez votre email pour recevoir un lien de réinitialisation
          </CardDescription>
        </CardHeader>
        
        <CardContent>
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

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Spinner size="sm" className="text-primary-foreground" />
                ) : (
                  "Envoyer le lien"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex justify-center">
          {onModeChange ? (
            <button
              type="button"
              onClick={() => onModeChange('signin')}
              className="text-sm text-muted-foreground hover:text-primary underline"
            >
              Retour à la connexion
            </button>
          ) : (
            <Link
              href="/auth/signin"
              className="text-sm text-muted-foreground hover:text-primary underline"
            >
              Retour à la connexion
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
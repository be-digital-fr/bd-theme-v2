"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { SignInCredentialsSchema, type SignInCredentialsType } from "@/features/auth/domain/schemas/UserSchemas";
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
import { useAuthTranslations, useAuthNotifications } from "@/hooks/useTranslations";
import { mapAuthError } from "@/lib/auth-error-mapper";

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
  const { translations: t } = useAuthTranslations();
  const { notifications } = useAuthNotifications();
  const { signIn, isLoading, error, clearError } = useSignIn({
    callbackUrl,
    onSuccess,
  });

  const form = useForm<SignInCredentialsType>({
    resolver: zodResolver(SignInCredentialsSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInCredentialsType) => {
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
                <FormLabel>{t.emailLabel}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t.emailPlaceholder}
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
                <FormLabel>{t.passwordLabel}</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder={t.passwordPlaceholder}
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
              {mapAuthError(error, notifications) || error}
            </div>
          )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner size="sm" className="text-primary-foreground mr-2" />
              {notifications.loading.signingIn}
            </>
          ) : (
            t.submitButton
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
            // Error already handled by social auth component
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
          {t.forgotPasswordLink}
        </button>
      ) : (
        <Link
          href="/auth/forgot-password"
          className="text-sm text-muted-foreground hover:text-primary underline"
        >
          {t.forgotPasswordLink}
        </Link>
      )}
      <div className="text-sm text-muted-foreground">
        {t.signUpLink}{" "}
        {onModeChange ? (
          <button
            type="button"
            onClick={() => onModeChange('signup')}
            className="text-primary hover:underline"
          >
            {t.signUpLinkText}
          </button>
        ) : (
          <Link href="/auth/signup" className="text-primary hover:underline">
            {t.signUpLinkText}
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
          <CardTitle>{t.title}</CardTitle>
          <CardDescription>
            {t.subtitle}
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
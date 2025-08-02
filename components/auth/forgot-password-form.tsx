"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { PasswordResetRequestSchema, type PasswordResetRequestType } from "@/features/auth/domain/schemas/UserSchemas";
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
import { useForgotPasswordTranslations } from "@/hooks/useForgotPasswordTranslations";
import { useAuthNotifications } from "@/hooks/useAuthNotifications";
import { mapAuthError } from "@/lib/auth-error-mapper";

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
  onModeChange?: (mode: 'signin' | 'signup' | 'forgot-password') => void;
  hideCard?: boolean;
}

export function ForgotPasswordForm({
  onSuccess,
  onModeChange,
  hideCard = false
}: ForgotPasswordFormProps) {
  const { translations: t } = useForgotPasswordTranslations();
  const { notifications } = useAuthNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<PasswordResetRequestType>({
    resolver: zodResolver(PasswordResetRequestSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: PasswordResetRequestType) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: resetError } = await authClient.forgetPassword({
        email: data.email,
        redirectTo: "/auth/reset-password",
      });

      if (resetError) {
        setError(resetError.message || notifications.error.generalError);
        return;
      }

      setSuccess(true);
      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      }
    } catch (err) {
      setError(notifications.error.generalError);
      console.error("Forgot password error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    const successContent = (
      <>
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
        <h3 className="text-lg font-semibold text-center">
          {t.successMessage}
        </h3>
        <p className="text-sm text-muted-foreground text-center mt-2">
          {t.successDescription}
        </p>
      </>
    );

    const backLink = onModeChange ? (
      <button
        type="button"
        onClick={() => onModeChange('signin')}
        className="text-sm text-primary hover:underline"
      >
        {t.backToSignInLink}
      </button>
    ) : (
      <Link
        href="/auth/signin"
        className="text-sm text-primary hover:underline"
      >
        {t.backToSignInLink}
      </Link>
    );

    if (hideCard) {
      return (
        <div className="space-y-4">
          {successContent}
          <div className="text-center">
            {backLink}
          </div>
        </div>
      );
    }

    return (
      <div className="w-full max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            {successContent}
          </CardHeader>
          
          <CardFooter className="flex justify-center">
            {backLink}
          </CardFooter>
        </Card>
      </div>
    );
  }

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

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  {mapAuthError(error, notifications) || error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner size="sm" className="text-primary-foreground mr-2" />
                    {notifications.loading.sendingEmail}
                  </>
                ) : (
                  t.submitButton
                )}
              </Button>
            </form>
          </Form>
  );

  const footerContent = (
    <div className="text-center">
      {onModeChange ? (
        <button
          type="button"
          onClick={() => onModeChange('signin')}
          className="text-sm text-muted-foreground hover:text-primary underline"
        >
          {t.backToSignInLink}
        </button>
      ) : (
        <Link
          href="/auth/signin"
          className="text-sm text-muted-foreground hover:text-primary underline"
        >
          {t.backToSignInLink}
        </Link>
      )}
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

        <CardFooter className="flex justify-center">
          {footerContent}
        </CardFooter>
      </Card>
    </div>
  );
}
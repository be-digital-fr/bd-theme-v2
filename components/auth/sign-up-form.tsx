"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { SignUpFormSchema, type SignUpFormType } from "@/features/auth/domain/schemas/UserSchemas";
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
import { useSignUpTranslations } from "@/hooks/useSignUpTranslations";
import { useAuthNotifications } from "@/hooks/useAuthNotifications";
import { mapAuthError } from "@/lib/auth-error-mapper";

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
  authSettings,
  hideCard = false
}: SignUpFormProps) {
  const { translations: t } = useSignUpTranslations();
  const { notifications } = useAuthNotifications();
  const { signUp, isLoading, error, success, clearError } = useSignUp({
    callbackUrl,
    onSuccess,
  });

  const form = useForm<SignUpFormType>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignUpFormType) => {
    clearError();
    // Pass all form data - the hook will handle extracting confirmPassword
    await signUp(data);
  };

  if (success) {
    const successContent = (
      <>
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
        <h3 className="text-lg font-semibold text-green-600 text-center">
          {t.successMessage}
        </h3>
        <p className="text-sm text-muted-foreground text-center mt-2">
          {t.successDescription}
        </p>
      </>
    );

    if (hideCard) {
      return <div className="space-y-4">{successContent}</div>;
    }

    return (
      <div className="w-full max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            {successContent}
          </CardHeader>
        </Card>
      </div>
    );
  }

  const formContent = (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.nameLabel}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t.namePlaceholder}
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

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.confirmPasswordLabel}</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder={t.confirmPasswordPlaceholder}
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
                    {notifications.loading.signingUp}
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
    <div className="text-sm text-muted-foreground text-center">
      {t.signInLink}{" "}
      {onModeChange ? (
        <button
          type="button"
          onClick={() => onModeChange('signin')}
          className="text-primary hover:underline"
        >
          {t.signInLinkText}
        </button>
      ) : (
        <Link href="/auth/signin" className="text-primary hover:underline">
          {t.signInLinkText}
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
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}

export const metadata = {
  title: "Réinitialiser le mot de passe - BD Theme",
  description: "Choisissez un nouveau mot de passe pour votre compte BD Theme",
};
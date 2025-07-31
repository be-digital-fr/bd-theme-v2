import { Suspense } from "react";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ForgotPasswordForm />
    </Suspense>
  );
}

export const metadata = {
  title: "Mot de passe oublié - BD Theme",
  description: "Réinitialisez votre mot de passe BD Theme",
};